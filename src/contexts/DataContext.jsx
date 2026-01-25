import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { defaultMaintenanceTasks, roomCategories as defaultRoomCategories } from '../data/defaultData';
import { addDays, isBefore, startOfDay, differenceInDays } from 'date-fns';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  // State for all data types
  const [rooms, setRooms] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [costs, setCosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to get/set Firestore documents
  const getDocRef = useCallback((collection) => {
    if (!user?.id) return null;
    return doc(db, 'users', user.id, 'appData', collection);
  }, [user?.id]);

  const saveToFirestore = useCallback(async (collection, data) => {
    const docRef = getDocRef(collection);
    if (!docRef) return;
    try {
      await setDoc(docRef, { items: data, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error(`Error saving ${collection}:`, error);
    }
  }, [getDocRef]);

  // --- MAINTENANCE FUNCTIONS ---

  // Adds a task (also used for "Reopening" a completed task as a new instance)
  const addMaintenanceTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      isActive: true, // New or reopened tasks are always active
      completionHistory: task.completionHistory || [], // Keep history if reopened from template
      createdAt: new Date().toISOString()
    };

    setMaintenanceTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateMaintenanceTask = useCallback((taskId, updates) => {
    setMaintenanceTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteMaintenanceTask = useCallback((taskId) => {
    setMaintenanceTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const completeMaintenanceTask = useCallback((taskId, notes = '') => {
    const today = new Date();

    setMaintenanceTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isOneTime = task.frequency === 'one-time';
        const completionEntry = {
          id: uuidv4(),
          completedAt: today.toISOString(),
          notes
        };

        // If recurring, calculate next due date. If one-time, set to null.
        const nextDueDate = !isOneTime 
          ? addDays(today, task.intervalDays || 30).toISOString() 
          : null;

        return {
          ...task,
          isActive: !isOneTime, // One-time tasks become inactive (history only)
          dueDate: nextDueDate,
          completionHistory: [...(task.completionHistory || []), completionEntry]
        };
      }
      return task;
    }));
  }, []);

  // Clears all inactive (Completed) tasks from the list
  const clearCompletedTasks = useCallback(() => {
    setMaintenanceTasks(prev => prev.filter(task => task.isActive === true));
  }, []);

  // --- DATA LOADING & AUTO-SAVE ---

  useEffect(() => {
    if (!user?.id) {
      setRooms([]); setMaintenanceTasks([]); setCosts([]); setNotifications([]); setContacts([]);
      setInitialized(false); setLoading(false);
      return;
    }

    setLoading(true);
    const loadData = async () => {
      try {
        // Load rooms
        const roomsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'rooms'));
        if (roomsDoc.exists() && roomsDoc.data().items) {
          setRooms(roomsDoc.data().items);
        } else {
          const initialRooms = defaultRoomCategories.map(cat => ({ ...cat, furnitureIdeas: [], paintSwatches: [], measurements: [], shoppingLists: [], inspirationLinks: [], notes: '' }));
          setRooms(initialRooms);
          await setDoc(doc(db, 'users', user.id, 'appData', 'rooms'), { items: initialRooms, updatedAt: new Date().toISOString() });
        }

        // Load tasks
        const tasksDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'tasks'));
        if (tasksDoc.exists() && tasksDoc.data().items) {
          setMaintenanceTasks(tasksDoc.data().items);
        } else {
          const today = new Date();
          const initialTasks = defaultMaintenanceTasks.map(task => ({
            ...task, id: uuidv4(), dueDate: addDays(today, Math.floor(Math.random() * task.intervalDays)).toISOString(),
            completionHistory: [], isActive: true, createdAt: today.toISOString()
          }));
          setMaintenanceTasks(initialTasks);
          await setDoc(doc(db, 'users', user.id, 'appData', 'tasks'), { items: initialTasks, updatedAt: new Date().toISOString() });
        }

        // Load Costs, Notifications, Contacts
        const costsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'costs'));
        setCosts(costsDoc.exists() ? costsDoc.data().items : []);
        const notificationsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'notifications'));
        setNotifications(notificationsDoc.exists() ? notificationsDoc.data().items : []);
        const contactsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'contacts'));
        setContacts(contactsDoc.exists() ? contactsDoc.data().items : []);

        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  useEffect(() => { if (user?.id && initialized) saveToFirestore('rooms', rooms); }, [rooms, user?.id, initialized, saveToFirestore]);
  useEffect(() => { if (user?.id && initialized) saveToFirestore('tasks', maintenanceTasks); }, [maintenanceTasks, user?.id, initialized, saveToFirestore]);
  useEffect(() => { if (user?.id && initialized) saveToFirestore('costs', costs); }, [costs, user?.id, initialized, saveToFirestore]);
  useEffect(() => { if (user?.id && initialized) saveToFirestore('notifications', notifications); }, [notifications, user?.id, initialized, saveToFirestore]);
  useEffect(() => { if (user?.id && initialized) saveToFirestore('contacts', contacts); }, [contacts, user?.id, initialized, saveToFirestore]);

  // --- ROOM HELPER FUNCTIONS ---
  const updateRoom = useCallback((roomId, updates) => { setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updates } : room)); }, []);
  const addFurnitureIdea = useCallback((roomId, subdivisionId, idea) => {
    const newIdea = { id: uuidv4(), ...idea, createdAt: new Date().toISOString() };
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, furnitureIdeas: [...room.furnitureIdeas, { ...newIdea, subdivisionId }] } : room));
    return newIdea;
  }, []);
  const updateFurnitureIdea = useCallback((roomId, ideaId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, furnitureIdeas: room.furnitureIdeas.map(i => i.id === ideaId ? { ...i, ...updates } : i) } : room));
  }, []);
  const deleteFurnitureIdea = useCallback((roomId, ideaId) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, furnitureIdeas: room.furnitureIdeas.filter(i => i.id !== ideaId) } : room));
  }, []);
  const addPaintSwatch = useCallback((roomId, subdivisionId, swatch) => {
    const newSwatch = { id: uuidv4(), ...swatch, createdAt: new Date().toISOString() };
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, paintSwatches: [...room.paintSwatches, { ...newSwatch, subdivisionId }] } : room));
    return newSwatch;
  }, []);
  const deletePaintSwatch = useCallback((roomId, swatchId) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, paintSwatches: room.paintSwatches.filter(s => s.id !== swatchId) } : room));
  }, []);
  const addMeasurement = useCallback((roomId, subdivisionId, measurement) => {
    const newMeasurement = { id: uuidv4(), ...measurement, subdivisionId, createdAt: new Date().toISOString() };
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, measurements: [...room.measurements, newMeasurement] } : room));
    return newMeasurement;
  }, []);
  const updateMeasurement = useCallback((roomId, measurementId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, measurements: room.measurements.map(m => m.id === measurementId ? { ...m, ...updates } : m) } : room));
  }, []);
  const deleteMeasurement = useCallback((roomId, measurementId) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, measurements: room.measurements.filter(m => m.id !== measurementId) } : room));
  }, []);
  const addShoppingListItem = useCallback((roomId, subdivisionId, item) => {
    const newItem = { id: uuidv4(), ...item, subdivisionId, purchased: false, createdAt: new Date().toISOString() };
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, shoppingLists: [...room.shoppingLists, newItem] } : room));
    return newItem;
  }, []);
  const updateShoppingListItem = useCallback((roomId, itemId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, shoppingLists: room.shoppingLists.map(i => i.id === itemId ? { ...i, ...updates } : i) } : room));
  }, []);
  const deleteShoppingListItem = useCallback((roomId, itemId) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, shoppingLists: room.shoppingLists.filter(i => i.id !== itemId) } : room));
  }, []);
  const addInspirationLink = useCallback((roomId, subdivisionId, link) => {
    const newLink = { id: uuidv4(), ...link, subdivisionId, createdAt: new Date().toISOString() };
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, inspirationLinks: [...room.inspirationLinks, newLink] } : room));
    return newLink;
  }, []);
  const deleteInspirationLink = useCallback((roomId, linkId) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, inspirationLinks: room.inspirationLinks.filter(l => l.id !== linkId) } : room));
  }, []);

  // --- COST & NOTIFICATION HELPERS ---
  const addCost = useCallback((cost) => {
    const newCost = { id: uuidv4(), ...cost, createdAt: new Date().toISOString() };
    setCosts(prev => [...prev, newCost]);
    return newCost;
  }, []);
  const updateCost = useCallback((costId, updates) => { setCosts(prev => prev.map(c => c.id === costId ? { ...c, ...updates } : c)); }, []);
  const deleteCost = useCallback((costId) => { setCosts(prev => prev.filter(c => c.id !== costId)); }, []);
  const getTotalCosts = useCallback((filters = {}) => {
    let filtered = costs;
    if (filters.category) filtered = filtered.filter(c => c.category === filters.category);
    if (filters.startDate) filtered = filtered.filter(c => new Date(c.date) >= new Date(filters.startDate));
    if (filters.endDate) filtered = filtered.filter(c => new Date(c.date) <= new Date(filters.endDate));
    return filtered.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  }, [costs]);

  const addNotification = useCallback((notification) => {
    const newNotification = { id: uuidv4(), ...notification, read: false, createdAt: new Date().toISOString() };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);
  const markNotificationRead = useCallback((id) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); }, []);
  const markAllNotificationsRead = useCallback(() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }, []);
  const deleteNotification = useCallback((id) => { setNotifications(prev => prev.filter(n => n.id !== id)); }, []);
  const getUnreadCount = useCallback(() => notifications.filter(n => !n.read).length, [notifications]);

  const addContact = useCallback((contact) => {
    const newContact = { id: uuidv4(), ...contact, createdAt: new Date().toISOString() };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);
  const updateContact = useCallback((id, updates) => { setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c)); }, []);
  const deleteContact = useCallback((id) => { setContacts(prev => prev.filter(c => c.id !== id)); }, []);

  return (
    <DataContext.Provider value={{
      rooms, maintenanceTasks, costs, notifications, contacts, initialized, loading,
      updateRoom, addFurnitureIdea, updateFurnitureIdea, deleteFurnitureIdea, addPaintSwatch, deletePaintSwatch,
      addMeasurement, updateMeasurement, deleteMeasurement, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem,
      addInspirationLink, deleteInspirationLink,
      addMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask, completeMaintenanceTask, clearCompletedTasks,
      addCost, updateCost, deleteCost, getTotalCosts,
      addNotification, markNotificationRead, markAllNotificationsRead, deleteNotification, getUnreadCount,
      addContact, updateContact, deleteContact
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}