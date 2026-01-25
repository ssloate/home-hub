import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  ShoppingCart,
  ExternalLink,
  Check,
  X,
  Edit2,
  Trash2,
  DollarSign,
  Link as LinkIcon,
  Package,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import './WishList.css';

export default function WishList() {
  const {
    wishlistItems,
    maintenanceTasks,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    toggleWishlistPurchased
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showPurchased, setShowPurchased] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on purchased status and search
  const filteredItems = useMemo(() => {
    return wishlistItems
      .filter(item => {
        // Filter by purchased status
        if (showPurchased) {
          if (!item.purchased) return false;
        } else {
          if (item.purchased) return false;
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!item.name.toLowerCase().includes(query)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [wishlistItems, showPurchased, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const active = wishlistItems.filter(i => !i.purchased);
    const purchased = wishlistItems.filter(i => i.purchased);
    const totalEstimated = active.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0);

    return {
      activeCount: active.length,
      purchasedCount: purchased.length,
      totalEstimated
    };
  }, [wishlistItems]);

  // Get task names for display
  const getLinkedTaskNames = (taskIds) => {
    if (!taskIds || taskIds.length === 0) return [];
    return taskIds
      .map(id => maintenanceTasks.find(t => t.id === id))
      .filter(Boolean)
      .map(t => t.name);
  };

  return (
    <div className="wishlist-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Wish List</h1>
          <p className="page-subtitle">Track tools and items you want to buy</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="wishlist-stats">
        <button
          className={`stat-pill ${!showPurchased ? 'active' : ''}`}
          onClick={() => setShowPurchased(false)}
        >
          <ShoppingCart size={16} />
          <span className="stat-count">{stats.activeCount}</span>
          <span className="stat-label">To Buy</span>
        </button>
        <button
          className={`stat-pill purchased ${showPurchased ? 'active' : ''}`}
          onClick={() => setShowPurchased(true)}
        >
          <CheckCircle2 size={16} />
          <span className="stat-count">{stats.purchasedCount}</span>
          <span className="stat-label">Purchased</span>
        </button>
        {!showPurchased && stats.totalEstimated > 0 && (
          <div className="stat-pill total">
            <DollarSign size={16} />
            <span className="stat-count">${stats.totalEstimated.toLocaleString()}</span>
            <span className="stat-label">Estimated Total</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="wishlist-container">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            {showPurchased ? (
              <>
                <Package size={48} />
                <h3>No purchased items</h3>
                <p>Items you mark as purchased will appear here</p>
              </>
            ) : (
              <>
                <ShoppingCart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Add tools and items you want to buy</p>
              </>
            )}
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredItems.map(item => {
              const linkedTasks = getLinkedTaskNames(item.linkedTaskIds);

              return (
                <div key={item.id} className={`wishlist-card ${item.purchased ? 'is-purchased' : ''}`}>
                  <div className="wishlist-card-header">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowEditModal(item)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => deleteWishlistItem(item.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="wishlist-card-body">
                    {item.estimatedPrice > 0 && (
                      <div className="item-price">
                        <DollarSign size={16} />
                        <span>${item.estimatedPrice.toLocaleString()}</span>
                      </div>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-link"
                      >
                        <LinkIcon size={14} />
                        <span>View Link</span>
                        <ExternalLink size={12} />
                      </a>
                    )}

                    {linkedTasks.length > 0 && (
                      <div className="linked-tasks">
                        <Wrench size={14} />
                        <span className="linked-tasks-label">For:</span>
                        <div className="linked-tasks-list">
                          {linkedTasks.map((name, idx) => (
                            <span key={idx} className="linked-task-badge">{name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.purchased && item.purchasedDate && (
                      <div className="purchased-date">
                        <CheckCircle2 size={14} />
                        <span>Purchased {format(new Date(item.purchasedDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  <div className="wishlist-card-footer">
                    <button
                      className={`btn ${item.purchased ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                      onClick={() => toggleWishlistPurchased(item.id)}
                    >
                      {item.purchased ? (
                        <>
                          <X size={16} /> Mark as Not Purchased
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Mark as Purchased
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <WishlistItemModal
          mode="add"
          tasks={maintenanceTasks}
          onClose={() => setShowAddModal(false)}
          onSave={(itemData) => {
            addWishlistItem(itemData);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <WishlistItemModal
          mode="edit"
          item={showEditModal}
          tasks={maintenanceTasks}
          onClose={() => setShowEditModal(null)}
          onSave={(itemData) => {
            updateWishlistItem(showEditModal.id, itemData);
            setShowEditModal(null);
          }}
        />
      )}
    </div>
  );
}

// Add/Edit Item Modal
function WishlistItemModal({ mode, item, tasks, onClose, onSave }) {
  const [name, setName] = useState(item?.name || '');
  const [link, setLink] = useState(item?.link || '');
  const [estimatedPrice, setEstimatedPrice] = useState(item?.estimatedPrice?.toString() || '');
  const [linkedTaskIds, setLinkedTaskIds] = useState(item?.linkedTaskIds || []);
  const [taskSearch, setTaskSearch] = useState('');

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    if (!taskSearch.trim()) return [];
    const query = taskSearch.toLowerCase();
    return tasks
      .filter(t => t.isActive)
      .filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.location?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [tasks, taskSearch]);

  const handleToggleTask = (taskId) => {
    if (linkedTaskIds.includes(taskId)) {
      setLinkedTaskIds(prev => prev.filter(id => id !== taskId));
    } else {
      setLinkedTaskIds(prev => [...prev, taskId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      link: link.trim() || null,
      estimatedPrice: parseFloat(estimatedPrice) || 0,
      linkedTaskIds
    });
  };

  // Get selected task names
  const selectedTasks = linkedTaskIds
    .map(id => tasks.find(t => t.id === id))
    .filter(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Add Item' : 'Edit Item'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Cordless Drill"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link (optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Price ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link to Tasks</label>
              <p className="form-hint">Search for tasks this item will be used for</p>

              <div className="task-search-box">
                <Search size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search tasks..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>

              {/* Search Results */}
              {filteredTasks.length > 0 && (
                <div className="task-search-results">
                  {filteredTasks.map(task => (
                    <button
                      key={task.id}
                      type="button"
                      className={`task-search-result ${linkedTaskIds.includes(task.id) ? 'selected' : ''}`}
                      onClick={() => handleToggleTask(task.id)}
                    >
                      <span className="task-result-name">{task.name}</span>
                      {task.location && (
                        <span className="task-result-location">{task.location}</span>
                      )}
                      {linkedTaskIds.includes(task.id) && (
                        <CheckCircle2 size={16} className="task-selected-icon" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Tasks */}
              {selectedTasks.length > 0 && (
                <div className="selected-tasks">
                  <span className="selected-tasks-label">Selected tasks:</span>
                  <div className="selected-tasks-list">
                    {selectedTasks.map(task => (
                      <span key={task.id} className="selected-task-badge">
                        {task.name}
                        <button
                          type="button"
                          className="remove-task-btn"
                          onClick={() => handleToggleTask(task.id)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
