import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Edit2,
  Trash2,
  X,
  StickyNote,
  Filter,
  User,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  Leaf,
  Home,
  Shield,
  Building
} from 'lucide-react';
import './Contacts.css';

const contactCategories = [
  { value: 'contractor', label: 'Contractor', icon: Wrench },
  { value: 'electrician', label: 'Electrician', icon: Zap },
  { value: 'plumber', label: 'Plumber', icon: Droplets },
  { value: 'designer', label: 'Designer', icon: Paintbrush },
  { value: 'landscaper', label: 'Landscaper', icon: Leaf },
  { value: 'realtor', label: 'Realtor', icon: Home },
  { value: 'insurance', label: 'Insurance', icon: Shield },
  { value: 'hoa', label: 'HOA', icon: Building },
  { value: 'other', label: 'Other', icon: User },
];

const getCategoryIcon = (category) => {
  const found = contactCategories.find(c => c.value === category);
  return found ? found.icon : User;
};

const getCategoryLabel = (category) => {
  const found = contactCategories.find(c => c.value === category);
  return found ? found.label : 'Other';
};

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useData();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedContact, setExpandedContact] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    category: 'contractor',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter(contact => {
        // Category filter
        if (categoryFilter !== 'all' && contact.category !== categoryFilter) {
          return false;
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchFields = [
            contact.name,
            contact.company,
            contact.email,
            contact.phone,
            contact.notes
          ].filter(Boolean).map(f => f.toLowerCase());

          if (!searchFields.some(field => field.includes(query))) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, categoryFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const byCategory = {};
    contactCategories.forEach(cat => {
      byCategory[cat.value] = contacts.filter(c => c.category === cat.value).length;
    });
    return {
      total: contacts.length,
      byCategory
    };
  }, [contacts]);

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      category: 'contractor',
      phone: '',
      email: '',
      address: '',
      notes: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingContact(null);
    setShowAddModal(true);
  };

  const openEditModal = (contact) => {
    setFormData({
      name: contact.name || '',
      company: contact.company || '',
      category: contact.category || 'contractor',
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      notes: contact.notes || ''
    });
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingContact(null);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    if (editingContact) {
      updateContact(editingContact.id, formData);
    } else {
      addContact(formData);
    }

    closeModal();
  };

  const handleDelete = (contactId) => {
    deleteContact(contactId);
    setShowDeleteConfirm(null);
  };

  const toggleExpandContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  return (
    <div className="contacts-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your contractors, designers, and service providers</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      {/* Stats Pills */}
      <div className="contact-stats">
        <button
          className={`stat-pill ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          <Users size={18} />
          <span className="stat-count">{stats.total}</span>
          <span className="stat-label">All Contacts</span>
        </button>
        {contactCategories.slice(0, 5).map(cat => {
          const count = stats.byCategory[cat.value] || 0;
          if (count === 0) return null;
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              className={`stat-pill ${cat.value} ${categoryFilter === cat.value ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === cat.value ? 'all' : cat.value)}
            >
              <Icon size={18} />
              <span className="stat-count">{count}</span>
              <span className="stat-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {contactCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact List */}
      <div className="contact-list-container">
        {filteredContacts.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No contacts found</h3>
            <p>{searchQuery || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first contact to get started'}</p>
            {!searchQuery && categoryFilter === 'all' && (
              <button className="btn btn-primary mt-4" onClick={openAddModal}>
                <Plus size={18} />
                Add Contact
              </button>
            )}
          </div>
        ) : (
          <div className="contact-list">
            {filteredContacts.map(contact => {
              const CategoryIcon = getCategoryIcon(contact.category);
              const isExpanded = expandedContact === contact.id;

              return (
                <div
                  key={contact.id}
                  className={`contact-card ${isExpanded ? 'expanded' : ''}`}
                >
                  <div
                    className="contact-main"
                    onClick={() => toggleExpandContact(contact.id)}
                  >
                    <div className="contact-icon-wrapper">
                      <div className={`contact-icon ${contact.category}`}>
                        <CategoryIcon size={20} />
                      </div>
                    </div>

                    <div className="contact-info">
                      <div className="contact-header">
                        <h3 className="contact-name">{contact.name}</h3>
                        <span className={`category-badge ${contact.category}`}>
                          {getCategoryLabel(contact.category)}
                        </span>
                      </div>

                      {contact.company && (
                        <div className="contact-company">
                          <Briefcase size={14} />
                          {contact.company}
                        </div>
                      )}

                      <div className="contact-details">
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="contact-detail" onClick={e => e.stopPropagation()}>
                            <Phone size={14} />
                            {contact.phone}
                          </a>
                        )}
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="contact-detail" onClick={e => e.stopPropagation()}>
                            <Mail size={14} />
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="contact-actions">
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(contact);
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(contact.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="contact-expanded">
                      {contact.address && (
                        <div className="expanded-row">
                          <MapPin size={16} />
                          <span>{contact.address}</span>
                        </div>
                      )}
                      {contact.notes && (
                        <div className="expanded-row notes">
                          <StickyNote size={16} />
                          <span>{contact.notes}</span>
                        </div>
                      )}
                      {!contact.address && !contact.notes && (
                        <div className="expanded-row empty">
                          <span>No additional details</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contact name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {contactCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company or business name"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, city, state"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes, specialties, availability..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Contact</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
