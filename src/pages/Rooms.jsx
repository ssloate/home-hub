import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Image,
  Palette,
  Ruler,
  ShoppingCart,
  Link as LinkIcon,
  FileText,
  Trash2,
  X,
  ExternalLink,
  Check,
  Upload,
  Pencil,
  Home,
  Trees,
  Building,
  LayoutGrid,
  ArrowUp,
  Triangle
} from 'lucide-react';
import { RoomIcon } from '../components/HouseIllustrations';
import LinkPreview from '../components/LinkPreview';
import './Rooms.css';

const iconMap = {
  Home: Home,
  Trees: Trees,
  Building: Building,
  LayoutGrid: LayoutGrid,
  ArrowUp: ArrowUp,
  Triangle: Triangle
};

const roomTypeMap = {
  'Backyard': 'backyard',
  'Front Yard': 'frontyard',
  'Basement': 'basement',
  'Main Floor': 'mainfloor',
  'Upper Floor': 'upperfloor',
  'Attic': 'attic'
};

export default function Rooms() {
  const {
    rooms,
    updateRoom,
    addFurnitureIdea,
    updateFurnitureIdea,
    deleteFurnitureIdea,
    addPaintSwatch,
    deletePaintSwatch,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    addShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem,
    addInspirationLink,
    deleteInspirationLink
  } = useData();

  const [expandedRoom, setExpandedRoom] = useState(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const [activeTab, setActiveTab] = useState('paint');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'paint', label: 'Paint Swatches', icon: Palette },
    { id: 'measurements', label: 'Measurements', icon: Ruler },
    { id: 'furniture', label: 'Furniture Ideas', icon: Image },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'links', label: 'Inspiration', icon: LinkIcon },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const handleRoomClick = (roomId) => {
    if (expandedRoom === roomId) {
      setExpandedRoom(null);
      setSelectedSubdivision(null);
    } else {
      setExpandedRoom(roomId);
      const room = rooms.find(r => r.id === roomId);
      if (room?.subdivisions?.length > 0) {
        setSelectedSubdivision(room.subdivisions[0].id);
      } else {
        setSelectedSubdivision(null);
      }
    }
  };

  const handleSubdivisionClick = (subdivisionId) => {
    setSelectedSubdivision(subdivisionId);
  };

  const openAddModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setModalType(null);
  };

  const currentRoom = rooms.find(r => r.id === expandedRoom);
  const currentSubdivision = currentRoom?.subdivisions?.find(s => s.id === selectedSubdivision);

  // Filter items by subdivision
  const getFilteredItems = (items) => {
    if (!selectedSubdivision) return items;
    return items.filter(item => item.subdivisionId === selectedSubdivision || !item.subdivisionId);
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 for local storage
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'furniture') {
        addFurnitureIdea(expandedRoom, selectedSubdivision, {
          name: file.name.replace(/\.[^/.]+$/, ''),
          image: reader.result,
          notes: ''
        });
      } else if (type === 'paint') {
        addPaintSwatch(expandedRoom, selectedSubdivision, {
          name: file.name.replace(/\.[^/.]+$/, ''),
          image: reader.result,
          color: '',
          brand: ''
        });
      }
    };
    reader.readAsDataURL(file);
    closeAddModal();
  };

  return (
    <div className="rooms-page">
      <div className="page-header">
        <h1 className="page-title">Rooms</h1>
        <p className="page-subtitle">Manage furniture ideas, paint colors, and more for each room</p>
      </div>

      <div className="rooms-layout">
        {/* Room Sidebar */}
        <div className="rooms-sidebar">
          <div className="sidebar-header">
            <h3>Room Categories</h3>
          </div>
          <div className="room-list">
            {rooms.map(room => {
              const IconComponent = iconMap[room.icon] || Home;
              const isExpanded = expandedRoom === room.id;

              return (
                <div key={room.id} className="room-item-wrapper">
                  <button
                    className={`room-item ${isExpanded ? 'active' : ''}`}
                    onClick={() => handleRoomClick(room.id)}
                  >
                    <div className="room-item-left">
                      <IconComponent size={18} />
                      <span>{room.name}</span>
                    </div>
                    {room.subdivisions?.length > 0 && (
                      isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>

                  {isExpanded && room.subdivisions?.length > 0 && (
                    <div className="subdivision-list">
                      {room.subdivisions.map(sub => (
                        <button
                          key={sub.id}
                          className={`subdivision-item ${selectedSubdivision === sub.id ? 'active' : ''}`}
                          onClick={() => handleSubdivisionClick(sub.id)}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="rooms-content">
          {!expandedRoom ? (
            <div className="empty-state">
              <RoomIcon type="mainfloor" size={80} />
              <h3>Select a Room</h3>
              <p>Choose a room from the sidebar to view and manage its details</p>
            </div>
          ) : (
            <>
              <div className="content-header">
                <h2>
                  {currentRoom?.name}
                  {currentSubdivision && ` - ${currentSubdivision.name}`}
                </h2>
              </div>

              <div className="tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {/* Furniture Ideas Tab */}
                {activeTab === 'furniture' && (
                  <FurnitureTab
                    items={getFilteredItems(currentRoom?.furnitureIdeas || [])}
                    onAdd={() => openAddModal('furniture')}
                    onUpdate={(id, updates) => updateFurnitureIdea(expandedRoom, id, updates)}
                    onDelete={(id) => deleteFurnitureIdea(expandedRoom, id)}
                  />
                )}

                {/* Paint Swatches Tab */}
                {activeTab === 'paint' && (
                  <PaintTab
                    items={getFilteredItems(currentRoom?.paintSwatches || [])}
                    onAdd={() => openAddModal('paint')}
                    onDelete={(id) => deletePaintSwatch(expandedRoom, id)}
                  />
                )}

                {/* Measurements Tab */}
                {activeTab === 'measurements' && (
                  <MeasurementsTab
                    items={getFilteredItems(currentRoom?.measurements || [])}
                    onAdd={() => openAddModal('measurement')}
                    onUpdate={(id, updates) => updateMeasurement(expandedRoom, id, updates)}
                    onDelete={(id) => deleteMeasurement(expandedRoom, id)}
                    roomId={expandedRoom}
                    subdivisionId={selectedSubdivision}
                    addMeasurement={addMeasurement}
                  />
                )}

                {/* Shopping List Tab */}
                {activeTab === 'shopping' && (
                  <ShoppingTab
                    items={getFilteredItems(currentRoom?.shoppingLists || [])}
                    onAdd={() => openAddModal('shopping')}
                    onUpdate={(id, updates) => updateShoppingListItem(expandedRoom, id, updates)}
                    onDelete={(id) => deleteShoppingListItem(expandedRoom, id)}
                    roomId={expandedRoom}
                    subdivisionId={selectedSubdivision}
                    addShoppingListItem={addShoppingListItem}
                  />
                )}

                {/* Inspiration Links Tab */}
                {activeTab === 'links' && (
                  <LinksTab
                    items={getFilteredItems(currentRoom?.inspirationLinks || [])}
                    onAdd={() => openAddModal('link')}
                    onDelete={(id) => deleteInspirationLink(expandedRoom, id)}
                    roomId={expandedRoom}
                    subdivisionId={selectedSubdivision}
                    addInspirationLink={addInspirationLink}
                  />
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <NotesTab
                    notes={currentRoom?.notes || ''}
                    onUpdate={(notes) => updateRoom(expandedRoom, { notes })}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal
          type={modalType}
          onClose={closeAddModal}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          roomId={expandedRoom}
          subdivisionId={selectedSubdivision}
          addFurnitureIdea={addFurnitureIdea}
          addPaintSwatch={addPaintSwatch}
          addMeasurement={addMeasurement}
          addShoppingListItem={addShoppingListItem}
          addInspirationLink={addInspirationLink}
        />
      )}
    </div>
  );
}

// Furniture Ideas Tab Component
function FurnitureTab({ items, onAdd, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditNotes(item.notes || '');
  };

  const saveEdit = (id) => {
    onUpdate(id, { notes: editNotes });
    setEditingId(null);
  };

  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Furniture Ideas</h3>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Plus size={16} /> Add Idea
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state small">
          <Image size={40} />
          <p>No furniture ideas yet. Upload images to get started.</p>
        </div>
      ) : (
        <div className="ideas-grid">
          {items.map(item => (
            <div key={item.id} className="idea-card">
              {item.image && (
                <div className="idea-image">
                  <img src={item.image} alt={item.name} />
                </div>
              )}
              <div className="idea-content">
                <h4>{item.name}</h4>
                {editingId === item.id ? (
                  <div className="edit-notes">
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes..."
                    />
                    <div className="edit-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => saveEdit(item.id)}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {item.notes && <p className="idea-notes">{item.notes}</p>}
                    <div className="idea-actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => startEdit(item)}>
                        {item.notes ? 'Edit Notes' : 'Add Notes'}
                      </button>
                      <button className="btn btn-sm btn-ghost delete" onClick={() => onDelete(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Paint Swatches Tab Component
function PaintTab({ items, onAdd, onDelete }) {
  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Paint Swatches</h3>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Plus size={16} /> Add Swatch
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state small">
          <Palette size={40} />
          <p>No paint swatches yet. Upload images to get started.</p>
        </div>
      ) : (
        <div className="swatches-grid">
          {items.map(item => (
            <div key={item.id} className="swatch-card">
              {item.image && (
                <div className="swatch-image">
                  <img src={item.image} alt={item.name} />
                </div>
              )}
              <div className="swatch-content">
                <h4>{item.name}</h4>
                {item.color && <span className="swatch-color">{item.color}</span>}
                {item.brand && <span className="swatch-brand">{item.brand}</span>}
                <button className="btn btn-sm btn-ghost delete" onClick={() => onDelete(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Measurements Tab Component
function MeasurementsTab({ items, onDelete, onUpdate, roomId, subdivisionId, addMeasurement }) {
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [dimensions, setDimensions] = useState([{ label: 'Height', value: '', unit: 'inches' }]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDimensions, setEditDimensions] = useState([]);

  const dimensionPresets = [
    { label: 'Height', placeholder: 'Height' },
    { label: 'Width', placeholder: 'Width' },
    { label: 'Depth', placeholder: 'Depth' },
    { label: 'Length', placeholder: 'Length' },
    { label: 'Diameter', placeholder: 'Diameter' }
  ];

  const addDimension = () => {
    const usedLabels = dimensions.map(d => d.label);
    const nextPreset = dimensionPresets.find(p => !usedLabels.includes(p.label)) || { label: 'Custom', placeholder: 'Custom' };
    setDimensions([...dimensions, { label: nextPreset.label, value: '', unit: 'inches' }]);
  };

  const removeDimension = (index) => {
    if (dimensions.length > 1) {
      setDimensions(dimensions.filter((_, i) => i !== index));
    }
  };

  const updateDimension = (index, field, value) => {
    setDimensions(dimensions.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const addEditDimension = () => {
    const usedLabels = editDimensions.map(d => d.label);
    const nextPreset = dimensionPresets.find(p => !usedLabels.includes(p.label)) || { label: 'Custom', placeholder: 'Custom' };
    setEditDimensions([...editDimensions, { label: nextPreset.label, value: '', unit: 'inches' }]);
  };

  const removeEditDimension = (index) => {
    if (editDimensions.length > 1) {
      setEditDimensions(editDimensions.filter((_, i) => i !== index));
    }
  };

  const updateEditDimension = (index, field, value) => {
    setEditDimensions(editDimensions.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditName(item.name);
    setEditDimensions(
      item.dimensions
        ? item.dimensions.map(d => ({ ...d }))
        : [{ label: 'Height', value: item.value || '', unit: item.unit || 'inches' }]
    );
    setExpandedItem(item.id);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
    setEditDimensions([]);
  };

  const saveEditing = () => {
    if (!editName.trim()) return;
    const validDimensions = editDimensions.filter(d => d.value.trim());
    if (validDimensions.length === 0) return;

    onUpdate(editingItem, {
      name: editName,
      dimensions: validDimensions,
      value: validDimensions[0]?.value || '',
      unit: validDimensions[0]?.unit || 'inches'
    });
    setEditingItem(null);
    setEditName('');
    setEditDimensions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const validDimensions = dimensions.filter(d => d.value.trim());
    if (validDimensions.length === 0) return;

    addMeasurement(roomId, subdivisionId, {
      name: itemName,
      dimensions: validDimensions,
      // Keep backward compatibility
      value: validDimensions[0]?.value || '',
      unit: validDimensions[0]?.unit || 'inches'
    });
    setItemName('');
    setDimensions([{ label: 'Height', value: '', unit: 'inches' }]);
    setShowForm(false);
  };

  const toggleExpand = (id) => {
    if (editingItem === id) return;
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Measurements</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form measurement-form">
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Living Room Window, Bedroom Door"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="dimensions-section">
            <label className="form-label">Dimensions</label>
            {dimensions.map((dim, index) => (
              <div key={index} className="dimension-row">
                <select
                  className="form-select dimension-label"
                  value={dim.label}
                  onChange={(e) => updateDimension(index, 'label', e.target.value)}
                >
                  {dimensionPresets.map(p => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
                <input
                  type="text"
                  className="form-input dimension-value"
                  placeholder="Value"
                  value={dim.value}
                  onChange={(e) => updateDimension(index, 'value', e.target.value)}
                />
                <select
                  className="form-select dimension-unit"
                  value={dim.unit}
                  onChange={(e) => updateDimension(index, 'unit', e.target.value)}
                >
                  <option value="inches">in</option>
                  <option value="feet">ft</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
                {dimensions.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeDimension(index)}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm add-dimension-btn" onClick={addDimension}>
              <Plus size={14} /> Add Dimension
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm">Save Item</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
              setShowForm(false);
              setItemName('');
              setDimensions([{ label: 'Height', value: '', unit: 'inches' }]);
            }}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && !showForm ? (
        <div className="empty-state small">
          <Ruler size={40} />
          <p>No measurements recorded yet.</p>
        </div>
      ) : (
        <div className="measurements-list">
          {items.map(item => (
            <div key={item.id} className="measurement-item-card">
              <div className="measurement-item-header" onClick={() => toggleExpand(item.id)}>
                <div className="measurement-item-info">
                  <Ruler size={16} className="measurement-icon" />
                  <span className="measurement-name">{item.name}</span>
                </div>
                <div className="measurement-item-actions">
                  {item.dimensions ? (
                    <span className="dimension-count">{item.dimensions.length} dimension{item.dimensions.length !== 1 ? 's' : ''}</span>
                  ) : (
                    <span className="measurement-value">{item.value} {item.unit}</span>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); startEditing(item); }}>
                    <Pencil size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm delete" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {editingItem === item.id ? (
                <div className="measurement-edit-form">
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="dimensions-section">
                    <label className="form-label">Dimensions</label>
                    {editDimensions.map((dim, index) => (
                      <div key={index} className="dimension-row">
                        <select
                          className="form-select dimension-label"
                          value={dim.label}
                          onChange={(e) => updateEditDimension(index, 'label', e.target.value)}
                        >
                          {dimensionPresets.map(p => (
                            <option key={p.label} value={p.label}>{p.label}</option>
                          ))}
                          <option value="Custom">Custom</option>
                        </select>
                        <input
                          type="text"
                          className="form-input dimension-value"
                          placeholder="Value"
                          value={dim.value}
                          onChange={(e) => updateEditDimension(index, 'value', e.target.value)}
                        />
                        <select
                          className="form-select dimension-unit"
                          value={dim.unit}
                          onChange={(e) => updateEditDimension(index, 'unit', e.target.value)}
                        >
                          <option value="inches">in</option>
                          <option value="feet">ft</option>
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                        </select>
                        {editDimensions.length > 1 && (
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeEditDimension(index)}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline btn-sm add-dimension-btn" onClick={addEditDimension}>
                      <Plus size={14} /> Add Dimension
                    </button>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={saveEditing}>Save</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {(expandedItem === item.id || !item.dimensions) && item.dimensions && (
                    <div className="measurement-dimensions">
                      {item.dimensions.map((dim, idx) => (
                        <div key={idx} className="dimension-display">
                          <span className="dimension-label">{dim.label}:</span>
                          <span className="dimension-value">{dim.value} {dim.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!item.dimensions && (
                    <div className="measurement-dimensions legacy">
                      <div className="dimension-display">
                        <span className="dimension-value">{item.value} {item.unit}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shopping List Tab Component
function ShoppingTab({ items, onUpdate, onDelete, roomId, subdivisionId, addShoppingListItem }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [store, setStore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addShoppingListItem(roomId, subdivisionId, {
      name,
      quantity: parseInt(quantity) || 1,
      estimatedPrice: parseFloat(estimatedPrice) || 0,
      store
    });
    setName('');
    setQuantity('1');
    setEstimatedPrice('');
    setStore('');
    setShowForm(false);
  };

  const togglePurchased = (item) => {
    onUpdate(item.id, { purchased: !item.purchased });
  };

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice || 0) * (item.quantity || 1), 0);

  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Shopping List</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <input
              type="text"
              className="form-input"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="form-input small"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="Estimated price ($)"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Store"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && !showForm ? (
        <div className="empty-state small">
          <ShoppingCart size={40} />
          <p>No items in your shopping list.</p>
        </div>
      ) : (
        <>
          <div className="shopping-list">
            {items.map(item => (
              <div key={item.id} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
                <button
                  className={`checkbox ${item.purchased ? 'checked' : ''}`}
                  onClick={() => togglePurchased(item)}
                >
                  {item.purchased && <Check size={14} />}
                </button>
                <div className="shopping-item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">
                    {item.quantity > 1 && `Qty: ${item.quantity} • `}
                    {item.store && `${item.store} • `}
                    {item.estimatedPrice > 0 && `$${item.estimatedPrice}`}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm delete" onClick={() => onDelete(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          {totalEstimated > 0 && (
            <div className="shopping-total">
              <span>Estimated Total</span>
              <span>${totalEstimated.toLocaleString()}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Inspiration Links Tab Component
function LinksTab({ items, onDelete, roomId, subdivisionId, addInspirationLink }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addInspirationLink(roomId, subdivisionId, { title, url, description });
    setTitle('');
    setUrl('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Inspiration Links</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Link
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <input
              type="text"
              className="form-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="url"
              className="form-input"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="form-row">
            <textarea
              className="form-textarea"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && !showForm ? (
        <div className="empty-state small">
          <LinkIcon size={40} />
          <p>No inspiration links saved yet.</p>
        </div>
      ) : (
        <div className="links-list">
          {items.map(item => (
            <div key={item.id} className="link-item with-preview">
              <LinkPreview url={item.url} title={item.title} />
              <div className="link-info">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-title">
                  {item.title}
                  <ExternalLink size={14} />
                </a>
                {item.description && <p className="link-description">{item.description}</p>}
              </div>
              <button className="btn btn-ghost btn-sm delete" onClick={() => onDelete(item.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notes Tab Component
function NotesTab({ notes, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(notes);

  const saveNotes = () => {
    onUpdate(editValue);
    setEditing(false);
  };

  return (
    <div className="tab-section">
      <div className="section-header">
        <h3>Notes</h3>
        {!editing && (
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
            {notes ? 'Edit' : 'Add Notes'}
          </button>
        )}
      </div>

      {editing ? (
        <div className="notes-editor">
          <textarea
            className="form-textarea large"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Add notes about this room..."
          />
          <div className="form-actions">
            <button className="btn btn-primary btn-sm" onClick={saveNotes}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              setEditValue(notes);
              setEditing(false);
            }}>Cancel</button>
          </div>
        </div>
      ) : notes ? (
        <div className="notes-content">
          <p>{notes}</p>
        </div>
      ) : (
        <div className="empty-state small">
          <FileText size={40} />
          <p>No notes for this room yet.</p>
        </div>
      )}
    </div>
  );
}

// Add Modal Component
function AddModal({
  type,
  onClose,
  onImageUpload,
  fileInputRef,
  roomId,
  subdivisionId,
  addFurnitureIdea,
  addPaintSwatch
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');

  const handleFurnitureSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addFurnitureIdea(roomId, subdivisionId, { name, image: null, notes: '' });
    onClose();
  };

  const handlePaintSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPaintSwatch(roomId, subdivisionId, { name, image: null, color, brand });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {type === 'furniture' && 'Add Furniture Idea'}
            {type === 'paint' && 'Add Paint Swatch'}
          </h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {(type === 'furniture' || type === 'paint') && (
            <>
              <div className="upload-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => onImageUpload(e, type)}
                  style={{ display: 'none' }}
                />
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={24} />
                  <span>Upload Image</span>
                </button>
              </div>

              <div className="divider">
                <span>or add without image</span>
              </div>

              <form onSubmit={type === 'furniture' ? handleFurnitureSubmit : handlePaintSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={type === 'furniture' ? 'e.g., Blue velvet sofa' : 'e.g., Seafoam Green'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {type === 'paint' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Color Code</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., #A8D5BA or SW 6463"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Benjamin Moore, Sherwin Williams"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
