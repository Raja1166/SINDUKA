import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface AppSettings {
  darkMode: boolean;
  language: Language;
}

interface AppSettingsContextType {
  settings: AppSettings;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('sinduka_settings');
      return saved ? JSON.parse(saved) : { darkMode: false, language: 'id' };
    } catch {
      return { darkMode: false, language: 'id' };
    }
  });

  useEffect(() => {
    localStorage.setItem('sinduka_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const toggleDarkMode = () =>
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));

  const setLanguage = (language: Language) =>
    setSettings(prev => ({ ...prev, language }));

  return (
    <AppSettingsContext.Provider value={{ settings, toggleDarkMode, setLanguage }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}

export const LANG: Record<Language, Record<string, string>> = {
  id: {
    appName: 'SINDUKA+',
    home: 'Beranda',
    maps: 'Peta',
    history: 'Riwayat',
    profile: 'Profil',
    settings: 'Pengaturan',
    notifications: 'Notifikasi',
    emergency: 'Darurat',
    nearbyServices: 'Layanan Terdekat',
    recentActivity: 'Aktivitas Terkini',
    darkMode: 'Mode Gelap',
    language: 'Bahasa',
    privacySecurity: 'Privasi & Keamanan',
    emergencyContacts: 'Kontak Darurat',
    viewAll: 'Lihat Semua',
    track: 'Lacak',
    nearestAmbulance: 'Ambulans Terdekat',
    nearestHospital: 'Rumah Sakit Terdekat',
    nearestPolice: 'Polisi Terdekat',
    tripCompleted: 'Perjalanan Selesai',
    addContact: 'Tambah Kontak',
    editContact: 'Edit Kontak',
    deleteContact: 'Hapus Kontak',
    name: 'Nama',
    relationship: 'Hubungan',
    phone: 'Telepon',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    confirmDelete: 'Yakin ingin menghapus kontak ini?',
  },
  en: {
    appName: 'SINDUKA+',
    home: 'Home',
    maps: 'Maps',
    history: 'History',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    emergency: 'Emergency',
    nearbyServices: 'Nearby Services',
    recentActivity: 'Recent Activity',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacySecurity: 'Privacy & Security',
    emergencyContacts: 'Emergency Contacts',
    viewAll: 'View All',
    track: 'Track',
    nearestAmbulance: 'Nearest Ambulance',
    nearestHospital: 'Nearest Hospital',
    nearestPolice: 'Nearest Police',
    tripCompleted: 'Trip Completed',
    addContact: 'Add Contact',
    editContact: 'Edit Contact',
    deleteContact: 'Delete Contact',
    name: 'Name',
    relationship: 'Relationship',
    phone: 'Phone',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this contact?',
  },
};
