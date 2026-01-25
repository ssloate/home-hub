import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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

  // TEMPORARY: Migration function for importing old data
  const importData = useCallback(async (tasksData, contactsData) => {
    if (!user?.id) {
      console.error('Not logged in!');
      return;
    }
    try {
      if (tasksData && tasksData.length > 0) {
        await setDoc(doc(db, 'users', user.id, 'appData', 'tasks'), {
          items: tasksData,
          updatedAt: new Date().toISOString()
        });
        setMaintenanceTasks(tasksData);
        console.log('✓ Imported', tasksData.length, 'tasks');
      }
      if (contactsData && contactsData.length > 0) {
        await setDoc(doc(db, 'users', user.id, 'appData', 'contacts'), {
          items: contactsData,
          updatedAt: new Date().toISOString()
        });
        setContacts(contactsData);
        console.log('✓ Imported', contactsData.length, 'contacts');
      }
      console.log('🎉 Migration complete!');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }, [user?.id]);

  // Expose import function globally for migration
  useEffect(() => {
    window.importHomeData = importData;
    return () => { delete window.importHomeData; };
  }, [importData]);

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

  // Reopen Maintenance Tasks

  const reopenMaintenanceTask = useCallback((taskId) => {
  setMaintenanceTasks(prev => prev.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        isActive: true,
        // Optional: If it's a one-time task, you might want to reset the date to today 
        // so it shows up in the active list clearly.
        dueDate: task.frequency === 'one-time' ? new Date().toISOString() : task.dueDate
      };
    }
    return task;
  }));
  }, []);

  // Load data when user changes
  useEffect(() => {
    if (!user?.id) {
      setRooms([]);
      setMaintenanceTasks([]);
      setCosts([]);
      setNotifications([]);
      setContacts([]);
      setInitialized(false);
      setLoading(false);
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
          // Initialize with default room structure
          const initialRooms = defaultRoomCategories.map(category => ({
            ...category,
            furnitureIdeas: [],
            paintSwatches: [],
            measurements: [],
            shoppingLists: [],
            inspirationLinks: [],
            notes: ''
          }));
          setRooms(initialRooms);
          await setDoc(doc(db, 'users', user.id, 'appData', 'rooms'), {
            items: initialRooms,
            updatedAt: new Date().toISOString()
          });
        }

        // Load maintenance tasks
        const tasksDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'tasks'));
        if (tasksDoc.exists() && tasksDoc.data().items) {
          setMaintenanceTasks(tasksDoc.data().items);
        } else {
          // Initialize with default tasks
          const today = new Date();
          const initialTasks = defaultMaintenanceTasks.map(task => ({
            ...task,
            id: uuidv4(),
            dueDate: addDays(today, Math.floor(Math.random() * task.intervalDays)).toISOString(),
            completionHistory: [],
            isActive: true,
            createdAt: today.toISOString()
          }));
          setMaintenanceTasks(initialTasks);
          await setDoc(doc(db, 'users', user.id, 'appData', 'tasks'), {
            items: initialTasks,
            updatedAt: new Date().toISOString()
          });
        }

        // Load costs
        const costsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'costs'));
        if (costsDoc.exists() && costsDoc.data().items) {
          setCosts(costsDoc.data().items);
        } else {
          setCosts([]);
        }

        // Load notifications
        const notificationsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'notifications'));
        if (notificationsDoc.exists() && notificationsDoc.data().items) {
          setNotifications(notificationsDoc.data().items);
        } else {
          setNotifications([]);
        }

        // Load contacts
        const contactsDoc = await getDoc(doc(db, 'users', user.id, 'appData', 'contacts'));
        if (contactsDoc.exists() && contactsDoc.data().items) {
          setContacts(contactsDoc.data().items);
        } else {
          setContacts([]);
        }

        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Auto-save when data changes
  useEffect(() => {
    if (!user?.id || !initialized) return;
    saveToFirestore('rooms', rooms);
  }, [rooms, user?.id, initialized, saveToFirestore]);

  useEffect(() => {
    if (!user?.id || !initialized) return;
    saveToFirestore('tasks', maintenanceTasks);
  }, [maintenanceTasks, user?.id, initialized, saveToFirestore]);

  useEffect(() => {
    if (!user?.id || !initialized) return;
    saveToFirestore('costs', costs);
  }, [costs, user?.id, initialized, saveToFirestore]);

  useEffect(() => {
    if (!user?.id || !initialized) return;
    saveToFirestore('notifications', notifications);
  }, [notifications, user?.id, initialized, saveToFirestore]);

  useEffect(() => {
    if (!user?.id || !initialized) return;
    saveToFirestore('contacts', contacts);
  }, [contacts, user?.id, initialized, saveToFirestore]);

  // Room functions
  const updateRoom = useCallback((roomId, updates) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    ));
  }, []);

  const addFurnitureIdea = useCallback((roomId, subdivisionId, idea) => {
    const newIdea = {
      id: uuidv4(),
      ...idea,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          furnitureIdeas: [...room.furnitureIdeas, { ...newIdea, subdivisionId }]
        };
      }
      return room;
    }));

    return newIdea;
  }, []);

  const updateFurnitureIdea = useCallback((roomId, ideaId, updates) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          furnitureIdeas: room.furnitureIdeas.map(idea =>
            idea.id === ideaId ? { ...idea, ...updates } : idea
          )
        };
      }
      return room;
    }));
  }, []);

  const deleteFurnitureIdea = useCallback((roomId, ideaId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          furnitureIdeas: room.furnitureIdeas.filter(idea => idea.id !== ideaId)
        };
      }
      return room;
    }));
  }, []);

  const addPaintSwatch = useCallback((roomId, subdivisionId, swatch) => {
    const newSwatch = {
      id: uuidv4(),
      ...swatch,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          paintSwatches: [...room.paintSwatches, { ...newSwatch, subdivisionId }]
        };
      }
      return room;
    }));

    return newSwatch;
  }, []);

  const deletePaintSwatch = useCallback((roomId, swatchId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          paintSwatches: room.paintSwatches.filter(s => s.id !== swatchId)
        };
      }
      return room;
    }));
  }, []);

  const addMeasurement = useCallback((roomId, subdivisionId, measurement) => {
    const newMeasurement = {
      id: uuidv4(),
      ...measurement,
      subdivisionId,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          measurements: [...room.measurements, newMeasurement]
        };
      }
      return room;
    }));

    return newMeasurement;
  }, []);

  const updateMeasurement = useCallback((roomId, measurementId, updates) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          measurements: room.measurements.map(m =>
            m.id === measurementId ? { ...m, ...updates } : m
          )
        };
      }
      return room;
    }));
  }, []);

  const deleteMeasurement = useCallback((roomId, measurementId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          measurements: room.measurements.filter(m => m.id !== measurementId)
        };
      }
      return room;
    }));
  }, []);

  const addShoppingListItem = useCallback((roomId, subdivisionId, item) => {
    const newItem = {
      id: uuidv4(),
      ...item,
      subdivisionId,
      purchased: false,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          shoppingLists: [...room.shoppingLists, newItem]
        };
      }
      return room;
    }));

    return newItem;
  }, []);

  const updateShoppingListItem = useCallback((roomId, itemId, updates) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          shoppingLists: room.shoppingLists.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return room;
    }));
  }, []);

  const deleteShoppingListItem = useCallback((roomId, itemId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          shoppingLists: room.shoppingLists.filter(item => item.id !== itemId)
        };
      }
      return room;
    }));
  }, []);

  const addInspirationLink = useCallback((roomId, subdivisionId, link) => {
    const newLink = {
      id: uuidv4(),
      ...link,
      subdivisionId,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          inspirationLinks: [...room.inspirationLinks, newLink]
        };
      }
      return room;
    }));

    return newLink;
  }, []);

  const deleteInspirationLink = useCallback((roomId, linkId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          inspirationLinks: room.inspirationLinks.filter(l => l.id !== linkId)
        };
      }
      return room;
    }));
  }, []);

  // Maintenance task functions
  const addMaintenanceTask = useCallback((task) => {
    const newTask = {
      id: uuidv4(),
      ...task,
      completionHistory: [],
      isActive: true,
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
          ? addDays(today, task.intervalDays).toISOString() 
          : null;

        return {
          ...task,
          // One-time tasks become inactive so they disappear from the main list
          isActive: !isOneTime,
          dueDate: nextDueDate,
          completionHistory: [...(task.completionHistory || []), completionEntry]
        };
      }
      return task;
    }));
  }, []);

  // Get upcoming tasks (due within 30 days)
  const getUpcomingTasks = useCallback(() => {
    const today = startOfDay(new Date());
    const thirtyDaysFromNow = addDays(today, 30);

    return maintenanceTasks
      .filter(task => {
        if (!task.isActive) return false;
        const dueDate = new Date(task.dueDate);
        return isBefore(dueDate, thirtyDaysFromNow);
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [maintenanceTasks]);

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const today = startOfDay(new Date());

    return maintenanceTasks
      .filter(task => {
        if (!task.isActive) return false;
        if (!task.dueDate) return false;
        const dueDate = startOfDay(new Date(task.dueDate));
        return differenceInDays(dueDate, today) < 0;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [maintenanceTasks]);

  // Get tasks due soon (within 7 days)
  const getTasksDueSoon = useCallback(() => {
    const today = startOfDay(new Date());
    const sevenDaysFromNow = addDays(today, 7);

    return maintenanceTasks
      .filter(task => {
        if (!task.isActive) return false;
        const dueDate = startOfDay(new Date(task.dueDate));
        return !isBefore(dueDate, today) && isBefore(dueDate, sevenDaysFromNow);
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [maintenanceTasks]);

  // Cost tracking functions
  const addCost = useCallback((cost) => {
    const newCost = {
      id: uuidv4(),
      ...cost,
      createdAt: new Date().toISOString()
    };

    setCosts(prev => [...prev, newCost]);
    return newCost;
  }, []);

  const updateCost = useCallback((costId, updates) => {
    setCosts(prev => prev.map(cost =>
      cost.id === costId ? { ...cost, ...updates } : cost
    ));
  }, []);

  const deleteCost = useCallback((costId) => {
    setCosts(prev => prev.filter(cost => cost.id !== costId));
  }, []);

  const getTotalCosts = useCallback((filters = {}) => {
    let filtered = costs;

    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(c => new Date(c.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(c => new Date(c.date) <= new Date(filters.endDate));
    }

    return filtered.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  }, [costs]);

  // Notification functions
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: uuidv4(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markNotificationRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Contact functions
  const addContact = useCallback((contact) => {
    const newContact = {
      id: uuidv4(),
      ...contact,
      createdAt: new Date().toISOString()
    };

    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);

  const updateContact = useCallback((contactId, updates) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, ...updates } : contact
    ));
  }, []);

  const deleteContact = useCallback((contactId) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  }, []);

  // Reset maintenance tasks to defaults
  const resetMaintenanceTasks = useCallback(() => {
    const today = new Date();
    const initialTasks = defaultMaintenanceTasks.map(task => ({
      ...task,
      id: uuidv4(),
      dueDate: task.frequency === 'one-time' ? null : addDays(today, Math.floor(Math.random() * task.intervalDays)).toISOString(),
      completionHistory: [],
      isActive: true,
      createdAt: today.toISOString()
    }));
    setMaintenanceTasks(initialTasks);
    return initialTasks;
  }, []);

  // Check for due tasks and create notifications
  useEffect(() => {
    if (!user?.id || !initialized) return;

    const checkDueTasks = () => {
      const today = startOfDay(new Date());

      maintenanceTasks.forEach(task => {
        if (!task.isActive) return;

        const dueDate = startOfDay(new Date(task.dueDate));
        const daysUntilDue = differenceInDays(dueDate, today);

        // Check if notification already exists for this task and type
        const existingWeekNotification = notifications.find(
          n => n.taskId === task.id && n.type === 'week-before' &&
              new Date(n.createdAt) > addDays(today, -1)
        );
        const existingDueNotification = notifications.find(
          n => n.taskId === task.id && n.type === 'due-today' &&
              new Date(n.createdAt) > addDays(today, -1)
        );

        // One week before notification
        if (daysUntilDue === 7 && !existingWeekNotification && user.settings?.notifyWeekBefore !== false) {
          addNotification({
            type: 'week-before',
            taskId: task.id,
            title: 'Task Due Soon',
            message: `"${task.name}" is due in one week`,
            priority: task.priority
          });
        }

        // Due today notification
        if (daysUntilDue === 0 && !existingDueNotification && user.settings?.notifyOnDueDate !== false) {
          addNotification({
            type: 'due-today',
            taskId: task.id,
            title: 'Task Due Today',
            message: `"${task.name}" is due today`,
            priority: task.priority
          });
        }
      });
    };

    checkDueTasks();
    // Check every hour
    const interval = setInterval(checkDueTasks, 3600000);

    return () => clearInterval(interval);
  }, [maintenanceTasks, user?.id, user?.settings, initialized, notifications, addNotification]);

  return (
    <DataContext.Provider value={{
      // Data
      rooms,
      maintenanceTasks,
      costs,
      notifications,
      contacts,
      initialized,
      loading,

      // Room functions
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
      deleteInspirationLink,

      // Maintenance functions
      addMaintenanceTask,
      updateMaintenanceTask,
      deleteMaintenanceTask,
      completeMaintenanceTask,
      getUpcomingTasks,
      getOverdueTasks,
      getTasksDueSoon,
      resetMaintenanceTasks,
      reopenMaintenanceTask,

      // Cost functions
      addCost,
      updateCost,
      deleteCost,
      getTotalCosts,

      // Notification functions
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      getUnreadCount,

      // Contact functions
      addContact,
      updateContact,
      deleteContact
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
