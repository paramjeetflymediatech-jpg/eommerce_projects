import { create } from "zustand";

interface Notification {
  message: string;
  type: "success" | "error" | "info";
  id: string;
}

interface NotificationStore {
  notifications: Notification[];
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  showNotification: (message, type = "info") => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
