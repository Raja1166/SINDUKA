export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

const DB_KEY = 'sinduka_users';
const SESSION_KEY = 'sinduka_session_user';
const ADMIN_SESSION_KEY = 'sinduka_admin_session';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export const authService = {
  saveSession(user: StoredUser): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession(): StoredUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  saveAdminSession(): void {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  },

  getAdminSession(): boolean {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  clearAdminSession(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  register(fullName: string, email: string, phone: string, password: string): { success: boolean; message: string } {
    const users = getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }
    const newUser: StoredUser = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    return { success: true, message: 'Registrasi berhasil.' };
  },

  login(email: string, password: string): { success: boolean; message: string; user?: StoredUser } {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Email tidak ditemukan. Periksa kembali email Anda.' };
    }
    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, message: 'Password salah. Periksa kembali password Anda.' };
    }
    return { success: true, message: 'Login berhasil.', user };
  },

  getUserCount(): number {
    return getUsers().length;
  },
};
