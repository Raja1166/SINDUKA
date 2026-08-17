import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Bell, Shield, Settings,
  LogOut, ChevronRight, Users, Plus, Pencil, Trash2, X, Check,
  Clock, AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useAppSettings, LANG } from '../context/AppSettingsContext';

interface ContactForm {
  name: string;
  relationship: string;
  phone: string;
}

const RECENT_ACTIVITIES = [
  { id: 1, icon: <AlertTriangle className="w-5 h-5 text-[#E53935]" />, iconBg: 'bg-[#E53935]/10', title: 'SOS Dikirim', sub: 'Hari ini, 10:32', route: '/sos' },
  { id: 2, icon: <Clock className="w-5 h-5 text-[#43A047]" />, iconBg: 'bg-[#43A047]/10', title: 'Perjalanan Selesai', sub: 'Kemarin, 15:10', route: '/history' },
  { id: 3, icon: <MapPin className="w-5 h-5 text-[#1565C0]" />, iconBg: 'bg-[#1565C0]/10', title: 'Lokasi Dibagikan', sub: '2 hari lalu, 08:45', route: '/maps' },
  { id: 4, icon: <Bell className="w-5 h-5 text-[#F9A825]" />, iconBg: 'bg-[#F9A825]/10', title: 'Notifikasi Darurat Diterima', sub: '3 hari lalu, 20:18', route: '/notifications' },
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { settings } = useAppSettings();
  const t = LANG[settings.language];
  const dark = settings.darkMode;

  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<{ id: number } & ContactForm | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({ name: '', relationship: '', phone: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [contactError, setContactError] = useState('');

  const textPrimary = dark ? 'text-white' : 'text-[#212121]';
  const textSecondary = dark ? 'text-gray-400' : 'text-[#757575]';
  const cardBg = dark ? 'bg-[#2A2A2A]' : 'bg-white';
  const divider = dark ? 'divide-gray-700' : 'divide-gray-100';
  const border = dark ? 'border-gray-700' : 'border-gray-100';
  const hoverBg = dark ? 'hover:bg-white/5' : 'hover:bg-gray-50';
  const inputCls = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${dark ? 'bg-[#1E1E1E] border-gray-600 text-white focus:border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`;
  const sheetBg = dark ? 'bg-[#2A2A2A]' : 'bg-white';

  const openAdd = () => {
    setEditingContact(null);
    setContactForm({ name: '', relationship: '', phone: '' });
    setContactError('');
    setShowContactModal(true);
  };

  const openEdit = (c: typeof user.emergencyContacts[0]) => {
    setEditingContact({ id: c.id, name: c.name, relationship: c.relationship, phone: c.phone });
    setContactForm({ name: c.name, relationship: c.relationship, phone: c.phone });
    setContactError('');
    setShowContactModal(true);
  };

  const saveContact = () => {
    if (!contactForm.name.trim()) { setContactError(settings.language === 'id' ? 'Nama wajib diisi' : 'Name is required'); return; }
    if (!contactForm.phone.trim()) { setContactError(settings.language === 'id' ? 'Nomor telepon wajib diisi' : 'Phone is required'); return; }
    if (editingContact) {
      updateUser({
        emergencyContacts: user.emergencyContacts.map(c =>
          c.id === editingContact.id ? { ...c, ...contactForm } : c
        ),
      });
    } else {
      const newId = Math.max(0, ...user.emergencyContacts.map(c => c.id)) + 1;
      updateUser({ emergencyContacts: [...user.emergencyContacts, { id: newId, ...contactForm }] });
    }
    setShowContactModal(false);
  };

  const deleteContact = (id: number) => {
    updateUser({ emergencyContacts: user.emergencyContacts.filter(c => c.id !== id) });
    setConfirmDeleteId(null);
  };

  const handleLogout = () => navigate('/login');

  const ACCENT_COLORS = ['text-[#E53935]', 'text-[#1565C0]', 'text-[#43A047]', 'text-[#F9A825]'];
  const ACCENT_BG = ['bg-[#E53935]/10', 'bg-[#1565C0]/10', 'bg-[#43A047]/10', 'bg-[#F9A825]/10'];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${dark ? 'bg-[#121212]' : 'bg-[#F5F7FA]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E53935] to-[#C62828] px-4 py-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{t.profile}</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-[#E53935]" />
            </div>
            <div>
              <p className="text-white text-2xl font-bold">{user.name}</p>
              <p className="text-white/80 text-sm">{user.email}</p>
              <p className="text-white/80 text-sm">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Personal Information */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {settings.language === 'id' ? 'Informasi Pribadi' : 'Personal Information'}
            </h3>
          </div>
          <div className={`divide-y ${divider}`}>
            {[
              { icon: <User className="w-5 h-5 text-[#1565C0]" />, iconBg: 'bg-[#1565C0]/10', label: settings.language === 'id' ? 'Nama Lengkap' : 'Full Name', value: user.name },
              { icon: <Mail className="w-5 h-5 text-[#E53935]" />, iconBg: 'bg-[#E53935]/10', label: 'Email', value: user.email },
              { icon: <Phone className="w-5 h-5 text-[#43A047]" />, iconBg: 'bg-[#43A047]/10', label: settings.language === 'id' ? 'Nomor Telepon' : 'Phone Number', value: user.phone },
              { icon: <MapPin className="w-5 h-5 text-[#F9A825]" />, iconBg: 'bg-[#F9A825]/10', label: settings.language === 'id' ? 'Alamat' : 'Address', value: user.address },
            ].map((item, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}>{item.icon}</div>
                <div className="flex-1">
                  <p className={`${textSecondary} text-sm`}>{item.label}</p>
                  <p className={`${textPrimary} font-semibold`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border} flex items-center justify-between`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>{t.emergencyContacts}</h3>
            <button onClick={openAdd} className="flex items-center gap-1 text-[#E53935] text-sm font-semibold hover:text-[#C62828] transition-colors">
              <Plus className="w-4 h-4" />
              {settings.language === 'id' ? 'Tambah' : 'Add'}
            </button>
          </div>
          <div className={`divide-y ${divider}`}>
            {user.emergencyContacts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Users className={`w-10 h-10 ${textSecondary} mx-auto mb-2`} />
                <p className={`${textSecondary} text-sm`}>
                  {settings.language === 'id' ? 'Belum ada kontak darurat' : 'No emergency contacts yet'}
                </p>
              </div>
            ) : (
              user.emergencyContacts.map((contact, index) => (
                <div key={contact.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ACCENT_BG[index % ACCENT_BG.length]}`}>
                      <Users className={`w-5 h-5 ${ACCENT_COLORS[index % ACCENT_COLORS.length]}`} />
                    </div>
                    <div>
                      <p className={`${textPrimary} font-semibold`}>{contact.name}</p>
                      <p className={`${textSecondary} text-sm`}>{contact.relationship} • {contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(contact)} className={`p-2 rounded-full ${hoverBg} transition-colors`}>
                      <Pencil className="w-4 h-4 text-[#1565C0]" />
                    </button>
                    <button onClick={() => setConfirmDeleteId(contact.id)} className={`p-2 rounded-full ${hoverBg} transition-colors`}>
                      <Trash2 className="w-4 h-4 text-[#E53935]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border} flex items-center justify-between`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>{t.recentActivity}</h3>
            <button onClick={() => setShowActivityModal(true)} className="text-[#1565C0] text-sm font-semibold hover:text-[#0D47A1] transition-colors">
              {t.viewAll}
            </button>
          </div>
          <div className={`divide-y ${divider}`}>
            {RECENT_ACTIVITIES.slice(0, 2).map(item => (
              <button key={item.id} onClick={() => navigate(item.route)} className={`w-full px-5 py-4 flex items-center gap-4 ${hoverBg} transition-colors`}>
                <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}>{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className={`${textPrimary} font-semibold`}>{item.title}</p>
                  <p className={`${textSecondary} text-sm`}>{item.sub}</p>
                </div>
                <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>{t.settings}</h3>
          </div>
          <div className={`divide-y ${divider}`}>
            <button onClick={() => navigate('/notifications')} className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}>
              <div className="flex items-center gap-4">
                <Bell className={`w-5 h-5 ${textSecondary}`} />
                <span className={`${textPrimary} font-semibold`}>{t.notifications}</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
            <button onClick={() => setShowPrivacyModal(true)} className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}>
              <div className="flex items-center gap-4">
                <Shield className={`w-5 h-5 ${textSecondary}`} />
                <span className={`${textPrimary} font-semibold`}>{t.privacySecurity}</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
            <button onClick={() => navigate('/settings')} className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}>
              <div className="flex items-center gap-4">
                <Settings className={`w-5 h-5 ${textSecondary}`} />
                <span className={`${textPrimary} font-semibold`}>{settings.language === 'id' ? 'Pengaturan Aplikasi' : 'App Settings'}</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-[#E53935] text-white py-4 rounded-2xl font-semibold shadow-md hover:bg-[#C62828] transition-colors flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          {settings.language === 'id' ? 'Keluar' : 'Logout'}
        </motion.button>
      </div>

      {/* Add / Edit Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShowContactModal(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${sheetBg} rounded-t-3xl p-6`} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {editingContact ? t.editContact : t.addContact}
                </h2>
                <button onClick={() => setShowContactModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1.5`}>{t.name}</label>
                  <input className={inputCls} placeholder={settings.language === 'id' ? 'Nama kontak darurat' : 'Emergency contact name'}
                    value={contactForm.name} onChange={e => { setContactForm(p => ({ ...p, name: e.target.value })); setContactError(''); }} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1.5`}>{t.relationship}</label>
                  <input className={inputCls} placeholder={settings.language === 'id' ? 'cth. Istri, Ayah, Kakak' : 'e.g. Wife, Father, Sibling'}
                    value={contactForm.relationship} onChange={e => setContactForm(p => ({ ...p, relationship: e.target.value }))} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1.5`}>{t.phone}</label>
                  <input className={inputCls} placeholder="+62 812 3456 7890" type="tel"
                    value={contactForm.phone} onChange={e => { setContactForm(p => ({ ...p, phone: e.target.value })); setContactError(''); }} />
                </div>
                {contactError && <p className="text-sm text-[#E53935]">{contactError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowContactModal(false)}
                    className={`flex-1 py-3 rounded-xl font-semibold border-2 ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-[#757575]'} transition-colors`}>
                    {t.cancel}
                  </button>
                  <button onClick={saveContact}
                    className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#E53935] to-[#C62828] text-white hover:shadow-lg transition-all">
                    {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmDeleteId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className={`w-full max-w-sm ${sheetBg} rounded-3xl p-6 text-center`}>
              <div className="w-16 h-16 bg-[#E53935]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-[#E53935]" />
              </div>
              <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>{t.deleteContact}</h3>
              <p className={`${textSecondary} text-sm mb-6`}>{t.confirmDelete}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)}
                  className={`flex-1 py-3 rounded-xl font-semibold border-2 ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-[#757575]'}`}>
                  {t.cancel}
                </button>
                <button onClick={() => deleteContact(confirmDeleteId)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#E53935] text-white hover:bg-[#C62828] transition-colors">
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShowActivityModal(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${sheetBg} rounded-t-3xl p-6`} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{t.recentActivity}</h2>
                <button onClick={() => setShowActivityModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className={`divide-y ${divider}`}>
                {RECENT_ACTIVITIES.map(item => (
                  <button key={item.id} onClick={() => { setShowActivityModal(false); navigate(item.route); }}
                    className={`w-full py-4 flex items-center gap-4 ${hoverBg} transition-colors`}>
                    <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}>{item.icon}</div>
                    <div className="flex-1 text-left">
                      <p className={`${textPrimary} font-semibold`}>{item.title}</p>
                      <p className={`${textSecondary} text-sm`}>{item.sub}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShowPrivacyModal(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${sheetBg} rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{t.privacySecurity}</h2>
                <button onClick={() => setShowPrivacyModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-3 pb-4">
                {[
                  { title: settings.language === 'id' ? 'Pengumpulan Data' : 'Data Collection', body: settings.language === 'id' ? 'SINDUKA+ mengumpulkan data lokasi dan penggunaan untuk meningkatkan layanan darurat Anda.' : 'SINDUKA+ collects location and usage data to improve your emergency services.' },
                  { title: settings.language === 'id' ? 'Keamanan Data' : 'Data Security', body: settings.language === 'id' ? 'Semua data dienkripsi menggunakan AES-256. Kami tidak menjual data pribadi Anda.' : 'All data is encrypted using AES-256. We never sell your personal data.' },
                  { title: settings.language === 'id' ? 'Berbagi Data Darurat' : 'Emergency Data Sharing', body: settings.language === 'id' ? 'Data darurat hanya dibagikan ke layanan medis dan polisi saat keadaan darurat.' : 'Emergency data is only shared with medical and police services during emergencies.' },
                  { title: settings.language === 'id' ? 'Hak Pengguna' : 'User Rights', body: settings.language === 'id' ? 'Anda berhak mengakses, mengubah, atau menghapus data pribadi Anda kapan saja.' : 'You have the right to access, modify, or delete your personal data at any time.' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${dark ? 'bg-[#1E1E1E]' : 'bg-[#F5F7FA]'}`}>
                    <p className={`font-bold ${textPrimary} mb-1`}>{item.title}</p>
                    <p className={`text-sm ${textSecondary} leading-relaxed`}>{item.body}</p>
                  </div>
                ))}
                <button
                  onClick={() => { setShowPrivacyModal(false); navigate('/settings'); }}
                  className="w-full mt-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white"
                >
                  {settings.language === 'id' ? 'Kelola Pengaturan Privasi' : 'Manage Privacy Settings'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
