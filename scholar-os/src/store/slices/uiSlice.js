export const createUISlice = (set) => ({
  theme: 'dark',
  activeHub: 'academic',
  activeSection: 'dashboard',
  sidebarOpen: true,
  notifications: [],
  searchQuery: '',

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  setActiveHub: (hub) => set({ activeHub: hub }),
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSearchQuery: (q) => set({ searchQuery: q }),

  addNotification: (n) => set((s) => ({
    notifications: [{
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
      ...n
    }, ...s.notifications].slice(0, 50),
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),
  clearNotifications: () => set({ notifications: [] }),
});
