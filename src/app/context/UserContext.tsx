import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  age: number;
  emergencyContacts: Array<{
    id: number;
    name: string;
    relationship: string;
    phone: string;
  }>;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "emergency" | "info" | "success";
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  notifications: NotificationItem[];
  addNotification: (input: Omit<NotificationItem, "id" | "time" | "read"> & { read?: boolean }) => void;
  markNotificationAsRead: (id: number) => void;
  unreadCount: number;
}

const defaultUser: User = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+62 812-3456-7890",
  address: "Jl. Sudirman No. 123, Jakarta",
  bloodType: "O+",
  age: 35,
  emergencyContacts: [
    {
      id: 1,
      name: "Sarah Doe",
      relationship: "Wife",
      phone: "+62 812-9876-5432",
    },
    {
      id: 2,
      name: "Michael Doe",
      relationship: "Brother",
      phone: "+62 813-1111-2222",
    },
  ],
};

const defaultNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Emergency Alert Test",
    message:
      "Monthly emergency system test completed successfully",
    time: "10 min ago",
    read: false,
    type: "info",
  },
  {
    id: 2,
    title: "Profile Updated",
    message:
      "Your emergency contact information has been updated",
    time: "1 hour ago",
    read: false,
    type: "success",
  },
  {
    id: 3,
    title: "System Update",
    message: "SINDUKA+ has been updated to version 2.0",
    time: "2 hours ago",
    read: true,
    type: "info",
  },
];

const USER_STORAGE_KEY = "sinduka_user_profile";
const NOTIFICATIONS_STORAGE_KEY = "sinduka_user_notifications";

const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) return defaultUser;
      return { ...defaultUser, ...JSON.parse(stored) };
    } catch {
      return defaultUser;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (!stored) return defaultNotifications;
      return JSON.parse(stored);
    } catch {
      return defaultNotifications;
    }
  });

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('sinduka_session_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser((prev) => ({ ...prev, name: parsed.fullName || prev.name, email: parsed.email || prev.email, phone: parsed.phone || prev.phone }));
      } catch {
        // ignore invalid session
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addNotification = (input: Omit<NotificationItem, "id" | "time" | "read"> & { read?: boolean }) => {
    const newNotification: NotificationItem = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      time: "Baru saja",
      read: input.read ?? false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 12));
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        notifications,
        addNotification,
        markNotificationAsRead,
        unreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useUser must be used within a UserProvider",
    );
  }
  return context;
}