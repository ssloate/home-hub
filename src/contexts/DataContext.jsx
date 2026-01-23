import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { defaultMaintenanceTasks, roomCategories as defaultRoomCategories } from '../data/defaultData';
import { addDays, isAfter, isBefore, startOfDay, differenceInDays } from 'date-fns';

const DataContext = createContext(null);

const getStorageKey = (userId, key) => `homeapp_${userId}_${key}`;

export function DataProvider({ children }) {
  const { user } = useAuth();

  // State for all data types
  const [rooms, setRooms] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [costs, setCosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (!user) {
      setRooms([]);
      setMaintenanceTasks([]);
      setCosts([]);
      setNotifications([]);
      setInitialized(false);
      return;
    }

    const loadData = () => {
      // Load rooms
      const storedRooms = localStorage.getItem(getStorageKey(user.id, 'rooms'));
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
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
        localStorage.setItem(getStorageKey(user.id, 'rooms'), JSON.stringify(initialRooms));
      }

      // Load maintenance tasks
      const storedTasks = localStorage.getItem(getStorageKey(user.id, 'tasks'));
      if (storedTasks) {
        setMaintenanceTasks(JSON.parse(storedTasks));
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
        localStorage.setItem(getStorageKey(user.id, 'tasks'), JSON.stringify(initialTasks));
      }

      // Load costs
      const storedCosts = localStorage.getItem(getStorageKey(user.id, 'costs'));
      if (storedCosts) {
        setCosts(JSON.parse(storedCosts));
      }

      // Load notifications
      const storedNotifications = localStorage.getItem(getStorageKey(user.id, 'notifications'));
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }

      setInitialized(true);
    };

    loadData();
  }, [user]);

  // Auto-save when data changes
  useEffect(() => {
    if (!user || !initialized) return;
    localStorage.setItem(getStorageKey(user.id, 'rooms'), JSON.stringify(rooms));
  }, [rooms, user, initialized]);

  useEffect(() => {
    if (!user || !initialized) return;
    localStorage.setItem(getStorageKey(user.id, 'tasks'), JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks, user, initialized]);

  useEffect(() => {
    if (!user || !initialized) return;
    localStorage.setItem(getStorageKey(user.id, 'costs'), JSON.stringify(costs));
  }, [costs, user, initialized]);

  useEffect(() => {
    if (!user || !initialized) return;
    localStorage.setItem(getStorageKey(user.id, 'notifications'), JSON.stringify(notifications));
  }, [notifications, user, initialized]);

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
        const completionEntry = {
          id: uuidv4(),
          completedAt: today.toISOString(),
          notes
        };

        // Calculate next due date based on interval
        const nextDueDate = addDays(today, task.intervalDays);

        return {
          ...task,
          dueDate: nextDueDate.toISOString(),
          completionHistory: [...task.completionHistory, completionEntry]
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
        const dueDate = new Date(task.dueDate);
        return isBefore(dueDate, today);
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

  // Check for due tasks and create notifications
  useEffect(() => {
    if (!user || !initialized) return;

    const checkDueTasks = () => {
      const today = startOfDay(new Date());
      const oneWeekFromNow = addDays(today, 7);

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
  }, [maintenanceTasks, user, initialized, notifications, addNotification]);

  return (
    <DataContext.Provider value={{
      // Data
      rooms,
      maintenanceTasks,
      costs,
      notifications,
      initialized,

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
      getUnreadCount
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
