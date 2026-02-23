import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { costCategories } from '../data/defaultData';
import { format, startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trash2,
  Edit2,
  X,
  PieChart,
  Gift
} from 'lucide-react';
import './Costs.css';

export default function Costs() {
  const { costs, addCost, updateCost, deleteCost, getTotalCosts, gifts, addGift, updateGift, deleteGift } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCost, setEditingCost] = useState(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);

  const today = new Date();

  // Calculate date ranges
  const dateRanges = useMemo(() => ({
    'all': { start: null, end: null },
    'this-month': { start: startOfMonth(today), end: endOfMonth(today) },
    'last-month': { start: startOfMonth(subMonths(today, 1)), end: endOfMonth(subMonths(today, 1)) },
    'this-year': { start: startOfYear(today), end: today },
    'last-3-months': { start: subMonths(today, 3), end: today },
    'last-6-months': { start: subMonths(today, 6), end: today }
  }), [today]);

  // Filter costs
  const filteredCosts = useMemo(() => {
    return costs
      .filter(cost => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!cost.description?.toLowerCase().includes(query) &&
              !cost.vendor?.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Category filter
        if (categoryFilter !== 'All' && cost.category !== categoryFilter) {
          return false;
        }

        // Date range filter
        const range = dateRanges[dateRange];
        if (range.start && new Date(cost.date) < range.start) return false;
        if (range.end && new Date(cost.date) > range.end) return false;

        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [costs, searchQuery, categoryFilter, dateRange, dateRanges]);

  // Calculate statistics
  const stats = useMemo(() => {
    const range = dateRanges[dateRange];
    const filtered = costs.filter(c => {
      if (range.start && new Date(c.date) < range.start) return false;
      if (range.end && new Date(c.date) > range.end) return false;
      return true;
    });

    const total = filtered.reduce((sum, c) => sum + (c.amount || 0), 0);

    // Calculate by category
    const byCategory = {};
    filtered.forEach(cost => {
      byCategory[cost.category] = (byCategory[cost.category] || 0) + (cost.amount || 0);
    });

    // This month vs last month comparison
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(subMonths(today, 1));
    const lastMonthEnd = endOfMonth(subMonths(today, 1));

    const thisMonthTotal = costs
      .filter(c => new Date(c.date) >= thisMonthStart)
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const lastMonthTotal = costs
      .filter(c => new Date(c.date) >= lastMonthStart && new Date(c.date) <= lastMonthEnd)
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const monthChange = lastMonthTotal > 0
      ? parseFloat(((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1))
      : (thisMonthTotal > 0 ? 100 : 0);

    return {
      total,
      byCategory,
      thisMonthTotal,
      lastMonthTotal,
      monthChange,
      count: filtered.length
    };
  }, [costs, dateRange, dateRanges, today]);

  // Get top categories
  const topCategories = useMemo(() => {
    return Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [stats.byCategory]);

  // Filter gifts by the same date range
  const filteredGifts = useMemo(() => {
    return (gifts || [])
      .filter(gift => {
        const range = dateRanges[dateRange];
        if (range.start && new Date(gift.date) < range.start) return false;
        if (range.end && new Date(gift.date) > range.end) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [gifts, dateRange, dateRanges]);

  const totalGifts = useMemo(() => {
    return filteredGifts.reduce((sum, g) => sum + (g.amount || 0), 0);
  }, [filteredGifts]);

  const handleEdit = (cost) => {
    setEditingCost(cost);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCost(null);
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setShowGiftModal(true);
  };

  const handleCloseGiftModal = () => {
    setShowGiftModal(false);
    setEditingGift(null);
  };

  return (
    <div className="costs-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cost Tracking</h1>
          <p className="page-subtitle">Track all your home maintenance and improvement expenses</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="costs-stats">
        <div className="stat-card large">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">${stats.total.toLocaleString()}</span>
            <span className="stat-label">
              {dateRange === 'all' ? 'Total Spent' : `Spent (${dateRange.replace('-', ' ')})`}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-value">${stats.thisMonthTotal.toLocaleString()}</span>
            <span className="stat-label">This Month</span>
          </div>
          <div className={`stat-change ${stats.monthChange >= 0 ? 'up' : 'down'}`}>
            {stats.monthChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {stats.monthChange >= 0 ? '+' : ''}{stats.monthChange}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-value">{stats.count}</span>
            <span className="stat-label">Transactions</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <div className="category-breakdown">
          <div className="breakdown-header">
            <PieChart size={18} />
            <h3>Spending by Category</h3>
          </div>
          <div className="category-bars">
            {topCategories.map(([category, amount]) => {
              const percentage = (amount / stats.total * 100).toFixed(1);
              return (
                <div key={category} className="category-bar-item">
                  <div className="category-bar-label">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">${amount.toLocaleString()}</span>
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="category-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            {costCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Calendar size={16} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="expenses-container">
        {filteredCosts.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} />
            <h3>No expenses found</h3>
            <p>
              {searchQuery || categoryFilter !== 'All' || dateRange !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first expense to start tracking'}
            </p>
          </div>
        ) : (
          <div className="expenses-list">
            {filteredCosts.map(cost => (
              <div
                key={cost.id}
                className="expense-card clickable"
                onClick={() => handleEdit(cost)}
              >
                <div className="expense-main">
                  <div className="expense-info">
                    <h4 className="expense-description">{cost.description}</h4>
                    <div className="expense-meta">
                      <span className="expense-category">{cost.category}</span>
                      {cost.vendor && <span className="expense-vendor">{cost.vendor}</span>}
                      <span className="expense-date">
                        <Calendar size={12} />
                        {format(new Date(cost.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {cost.notes && (
                      <p className="expense-notes">{cost.notes}</p>
                    )}
                  </div>
                  <div className="expense-amount">
                    ${cost.amount?.toLocaleString()}
                  </div>
                </div>
                <div className="expense-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(cost)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteCost(cost.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gift Money Section */}
      <div className="gifts-section">
        <div className="gifts-header">
          <div className="gifts-title">
            <Gift size={18} />
            <h3>Gift Money</h3>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowGiftModal(true)}>
            <Plus size={16} /> Add Gift
          </button>
        </div>

        {filteredGifts.length === 0 ? (
          <div className="gifts-empty">
            <p>No gift money recorded yet.</p>
          </div>
        ) : (
          <div className="gifts-list">
            {filteredGifts.map(gift => (
              <div
                key={gift.id}
                className="expense-card clickable"
                onClick={() => handleEditGift(gift)}
              >
                <div className="expense-main">
                  <div className="expense-info">
                    <h4 className="expense-description">{gift.description}</h4>
                    <div className="expense-meta">
                      {gift.source && <span className="expense-vendor">{gift.source}</span>}
                      <span className="expense-date">
                        <Calendar size={12} />
                        {format(new Date(gift.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {gift.notes && (
                      <p className="expense-notes">{gift.notes}</p>
                    )}
                  </div>
                  <div className="expense-amount gift-amount">
                    +${gift.amount?.toLocaleString()}
                  </div>
                </div>
                <div className="expense-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEditGift(gift)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteGift(gift.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Net Total */}
      <div className="net-total-section">
        <div className="net-total-row">
          <span className="net-total-label">Total Costs</span>
          <span className="net-total-value costs">${stats.total.toLocaleString()}</span>
        </div>
        <div className="net-total-row">
          <span className="net-total-label">Gift Money</span>
          <span className="net-total-value gifts">-${totalGifts.toLocaleString()}</span>
        </div>
        <div className="net-total-divider" />
        <div className="net-total-row total">
          <span className="net-total-label">Net Total</span>
          <span className="net-total-value">${(stats.total - totalGifts).toLocaleString()}</span>
        </div>
      </div>

      {/* Add/Edit Cost Modal */}
      {showAddModal && (
        <CostModal
          cost={editingCost}
          onClose={handleCloseModal}
          onSave={editingCost ? updateCost : addCost}
        />
      )}

      {/* Add/Edit Gift Modal */}
      {showGiftModal && (
        <GiftModal
          gift={editingGift}
          onClose={handleCloseGiftModal}
          onSave={editingGift ? updateGift : addGift}
        />
      )}
    </div>
  );
}

// Cost Modal
function CostModal({ cost, onClose, onSave }) {
  const [description, setDescription] = useState(cost?.description || '');
  const [amount, setAmount] = useState(cost?.amount?.toString() || '');
  const [category, setCategory] = useState(cost?.category || 'Maintenance');
  const [vendor, setVendor] = useState(cost?.vendor || '');
  const [date, setDate] = useState(cost?.date ? format(new Date(cost.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState(cost?.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    // Parse date parts to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0);

    const costData = {
      description,
      amount: parseFloat(amount),
      category,
      vendor,
      date: localDate.toISOString(),
      notes
    };

    if (cost) {
      onSave(cost.id, costData);
    } else {
      onSave(costData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{cost ? 'Edit Expense' : 'Add Expense'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., HVAC Repair"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Amount ($) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {costCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Vendor/Store</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Home Depot"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Add any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {cost ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Gift Modal
function GiftModal({ gift, onClose, onSave }) {
  const [description, setDescription] = useState(gift?.description || '');
  const [amount, setAmount] = useState(gift?.amount?.toString() || '');
  const [source, setSource] = useState(gift?.source || '');
  const [date, setDate] = useState(gift?.date ? format(new Date(gift.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState(gift?.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0);

    const giftData = {
      description,
      amount: parseFloat(amount),
      source,
      date: localDate.toISOString(),
      notes
    };

    if (gift) {
      onSave(gift.id, giftData);
    } else {
      onSave(giftData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{gift ? 'Edit Gift' : 'Add Gift Money'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Housewarming gift from parents"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Amount ($) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">From</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Mom & Dad"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Add any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {gift ? 'Save Changes' : 'Add Gift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
