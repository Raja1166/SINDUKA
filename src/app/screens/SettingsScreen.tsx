import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Bell, Shield, MapPin, Smartphone, Moon, Globe,
  Volume2, Vibrate, ChevronRight, X, Check, Lock, Eye, EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppSettings, LANG } from '../context/AppSettingsContext';

const LANGUAGES = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
] as const;

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, toggleDarkMode, setLanguage } = useAppSettings();
  const t = LANG[settings.language];
  const dark = settings.darkMode;

  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    emergencyAlerts: true,
    locationServices: true,
    autoDetection: true,
    soundAlerts: true,
    vibration: true,
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [passwordMsg, setPasswordMsg] = useState('');

  const toggleLocal = (key: keyof typeof localSettings) =>
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const bg = dark ? 'bg-[#1E1E1E]' : 'bg-white';
  const cardBg = dark ? 'bg-[#2A2A2A]' : 'bg-white';
  const textPrimary = dark ? 'text-white' : 'text-[#212121]';
  const textSecondary = dark ? 'text-gray-400' : 'text-[#757575]';
  const divider = dark ? 'divide-gray-700' : 'divide-gray-100';
  const border = dark ? 'border-gray-700' : 'border-gray-100';
  const hoverBg = dark ? 'hover:bg-white/5' : 'hover:bg-gray-50';

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full transition-colors ${value ? 'bg-[#43A047]' : dark ? 'bg-gray-600' : 'bg-gray-300'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  const handleSavePassword = () => {
    if (!passwordForm.current) { setPasswordMsg('Password saat ini wajib diisi'); return; }
    if (passwordForm.next.length < 8) { setPasswordMsg('Password baru minimal 8 karakter'); return; }
    if (passwordForm.next !== passwordForm.confirm) { setPasswordMsg('Konfirmasi password tidak cocok'); return; }
    setPasswordMsg('✓ Password berhasil diubah');
    setTimeout(() => { setShowPasswordModal(false); setPasswordForm({ current: '', next: '', confirm: '' }); setPasswordMsg(''); }, 1500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#121212]' : 'bg-[#F5F7FA]'}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r from-[#1565C0] to-[#0D47A1] px-4 py-4 rounded-b-3xl shadow-lg`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t.settings}
            </h1>
            <p className="text-white/80 text-sm">
              {settings.language === 'id' ? 'Preferensi & konfigurasi aplikasi' : 'App preferences and configuration'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4 pb-8">
        {/* Notifications */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t.notifications}
            </h3>
          </div>
          <div className={`divide-y ${divider}`}>
            {[
              { key: 'notifications', icon: <Bell className="w-5 h-5 text-[#1565C0]" />, iconBg: 'bg-[#1565C0]/10', label: settings.language === 'id' ? 'Push Notifikasi' : 'Push Notifications', sub: settings.language === 'id' ? 'Terima notifikasi aplikasi' : 'Receive app notifications' },
              { key: 'emergencyAlerts', icon: <Bell className="w-5 h-5 text-[#E53935]" />, iconBg: 'bg-[#E53935]/10', label: settings.language === 'id' ? 'Notifikasi Darurat' : 'Emergency Alerts', sub: settings.language === 'id' ? 'Notifikasi darurat kritis' : 'Critical emergency notifications' },
              { key: 'soundAlerts', icon: <Volume2 className="w-5 h-5 text-[#F9A825]" />, iconBg: 'bg-[#F9A825]/10', label: settings.language === 'id' ? 'Suara Notifikasi' : 'Sound Alerts', sub: settings.language === 'id' ? 'Putar suara untuk notifikasi' : 'Play sound for notifications' },
              { key: 'vibration', icon: <Vibrate className="w-5 h-5 text-[#1565C0]" />, iconBg: 'bg-[#1565C0]/10', label: settings.language === 'id' ? 'Getaran' : 'Vibration', sub: settings.language === 'id' ? 'Getar saat notifikasi' : 'Vibrate on notifications' },
            ].map(item => (
              <div key={item.key} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}>{item.icon}</div>
                  <div>
                    <p className={`${textPrimary} font-semibold`}>{item.label}</p>
                    <p className={`${textSecondary} text-sm`}>{item.sub}</p>
                  </div>
                </div>
                <Toggle value={localSettings[item.key as keyof typeof localSettings]} onToggle={() => toggleLocal(item.key as keyof typeof localSettings)} />
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Security */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {settings.language === 'id' ? 'Keselamatan & Keamanan' : 'Safety & Security'}
            </h3>
          </div>
          <div className={`divide-y ${divider}`}>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#43A047]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#43A047]" />
                </div>
                <div>
                  <p className={`${textPrimary} font-semibold`}>{settings.language === 'id' ? 'Layanan Lokasi' : 'Location Services'}</p>
                  <p className={`${textSecondary} text-sm`}>{settings.language === 'id' ? 'Aktifkan pelacakan GPS' : 'Enable GPS tracking'}</p>
                </div>
              </div>
              <Toggle value={localSettings.locationServices} onToggle={() => toggleLocal('locationServices')} />
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E53935]/10 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#E53935]" />
                </div>
                <div>
                  <p className={`${textPrimary} font-semibold`}>{settings.language === 'id' ? 'Deteksi Kecelakaan Otomatis' : 'Auto Accident Detection'}</p>
                  <p className={`${textSecondary} text-sm`}>{settings.language === 'id' ? 'Deteksi kecelakaan secara otomatis' : 'Detect accidents automatically'}</p>
                </div>
              </div>
              <Toggle value={localSettings.autoDetection} onToggle={() => toggleLocal('autoDetection')} />
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#1565C0]" />
                </div>
                <div className="text-left">
                  <p className={`${textPrimary} font-semibold`}>{settings.language === 'id' ? 'Ubah Password' : 'Change Password'}</p>
                  <p className={`${textSecondary} text-sm`}>{settings.language === 'id' ? 'Perbarui kata sandi Anda' : 'Update your password'}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#9C27B0]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#9C27B0]" />
                </div>
                <div className="text-left">
                  <p className={`${textPrimary} font-semibold`}>{t.privacySecurity}</p>
                  <p className={`${textSecondary} text-sm`}>{settings.language === 'id' ? 'Kelola data & privasi Anda' : 'Manage your data & privacy'}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F9A825]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#F9A825]" />
                </div>
                <div className="text-left">
                  <p className={`${textPrimary} font-semibold`}>{settings.language === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'}</p>
                  <p className={`${textSecondary} text-sm`}>{settings.language === 'id' ? 'Baca syarat penggunaan' : 'Read terms of use'}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div className={`${cardBg} rounded-2xl shadow-md overflow-hidden transition-colors duration-300`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`${textPrimary} font-bold`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {settings.language === 'id' ? 'Preferensi Aplikasi' : 'App Preferences'}
            </h3>
          </div>
          <div className={`divide-y ${divider}`}>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${dark ? 'bg-yellow-500/10' : 'bg-[#212121]/10'} rounded-full flex items-center justify-center`}>
                  <Moon className={`w-5 h-5 ${dark ? 'text-yellow-400' : 'text-[#212121]'}`} />
                </div>
                <div>
                  <p className={`${textPrimary} font-semibold`}>{t.darkMode}</p>
                  <p className={`${textSecondary} text-sm`}>
                    {settings.language === 'id' ? (dark ? 'Mode gelap aktif' : 'Gunakan tema gelap') : (dark ? 'Dark theme enabled' : 'Use dark theme')}
                  </p>
                </div>
              </div>
              <Toggle value={settings.darkMode} onToggle={toggleDarkMode} />
            </div>

            <button
              onClick={() => setShowLanguageModal(true)}
              className={`w-full px-5 py-4 flex items-center justify-between ${hoverBg} transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#1565C0]" />
                </div>
                <div className="text-left">
                  <p className={`${textPrimary} font-semibold`}>{t.language}</p>
                  <p className={`${textSecondary} text-sm`}>
                    {LANGUAGES.find(l => l.code === settings.language)?.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{LANGUAGES.find(l => l.code === settings.language)?.flag}</span>
                <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className={`${cardBg} rounded-2xl shadow-md p-6 transition-colors duration-300`}>
          <div className="text-center">
            <p className={`${textSecondary} text-sm mb-1`}>SINDUKA+ Version</p>
            <p className={`${textPrimary} font-bold text-lg`}>2.0.0</p>
            <p className={`${textSecondary} text-xs mt-2`}>© 2026 SINDUKA+ Emergency Response System</p>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${dark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-t-3xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t.language}
                </h2>
                <button onClick={() => setShowLanguageModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-3 pb-4">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLanguageModal(false); }}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                      settings.language === lang.code
                        ? 'border-[#1565C0] bg-[#1565C0]/10'
                        : `${dark ? 'border-gray-600' : 'border-gray-200'} ${hoverBg}`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{lang.flag}</span>
                      <span className={`font-semibold ${textPrimary}`}>{lang.label}</span>
                    </div>
                    {settings.language === lang.code && <Check className="w-5 h-5 text-[#1565C0]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy & Security Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${dark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t.privacySecurity}
                </h2>
                <button onClick={() => setShowPrivacyModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-4 pb-4">
                {[
                  { title: settings.language === 'id' ? 'Pengumpulan Data' : 'Data Collection', body: settings.language === 'id' ? 'SINDUKA+ mengumpulkan data lokasi, informasi perangkat, dan data penggunaan untuk meningkatkan layanan darurat dan keselamatan Anda.' : 'SINDUKA+ collects location data, device information, and usage data to improve emergency services and your safety.' },
                  { title: settings.language === 'id' ? 'Penggunaan Data' : 'Data Usage', body: settings.language === 'id' ? 'Data Anda digunakan untuk mendeteksi kecelakaan, mengirim bantuan darurat, dan memberikan layanan navigasi yang akurat.' : 'Your data is used to detect accidents, dispatch emergency assistance, and provide accurate navigation services.' },
                  { title: settings.language === 'id' ? 'Berbagi Data' : 'Data Sharing', body: settings.language === 'id' ? 'Data darurat dibagikan dengan layanan medis, polisi, dan pemadam kebakaran hanya saat situasi darurat terjadi.' : 'Emergency data is shared with medical services, police, and fire departments only during emergency situations.' },
                  { title: settings.language === 'id' ? 'Keamanan Data' : 'Data Security', body: settings.language === 'id' ? 'Semua data dienkripsi menggunakan standar AES-256. Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga.' : 'All data is encrypted using AES-256 standard. We never sell your personal data to third parties.' },
                  { title: settings.language === 'id' ? 'Hak Pengguna' : 'User Rights', body: settings.language === 'id' ? 'Anda berhak mengakses, mengubah, atau menghapus data pribadi Anda kapan saja melalui menu profil atau menghubungi kami.' : 'You have the right to access, modify, or delete your personal data at any time through the profile menu or by contacting us.' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${dark ? 'bg-[#1E1E1E]' : 'bg-[#F5F7FA]'}`}>
                    <p className={`font-bold ${textPrimary} mb-1`}>{item.title}</p>
                    <p className={`text-sm ${textSecondary} leading-relaxed`}>{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${dark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {settings.language === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'}
                </h2>
                <button onClick={() => setShowTermsModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-4 pb-4">
                {[
                  { title: '1. ' + (settings.language === 'id' ? 'Penerimaan Syarat' : 'Acceptance of Terms'), body: settings.language === 'id' ? 'Dengan menggunakan SINDUKA+, Anda menyetujui syarat dan ketentuan ini. Jika tidak setuju, harap hentikan penggunaan aplikasi.' : 'By using SINDUKA+, you agree to these terms and conditions. If you disagree, please stop using the app.' },
                  { title: '2. ' + (settings.language === 'id' ? 'Penggunaan Layanan' : 'Use of Service'), body: settings.language === 'id' ? 'SINDUKA+ dirancang khusus untuk keperluan darurat. Penggunaan yang tidak tepat atau penyalahgunaan sistem dapat dikenai sanksi hukum.' : 'SINDUKA+ is designed exclusively for emergency purposes. Misuse of the system may result in legal penalties.' },
                  { title: '3. ' + (settings.language === 'id' ? 'Tanggung Jawab Pengguna' : 'User Responsibility'), body: settings.language === 'id' ? 'Pengguna bertanggung jawab atas kebenaran informasi yang diberikan dan penggunaan fitur SOS secara bijaksana.' : 'Users are responsible for the accuracy of information provided and the wise use of the SOS feature.' },
                  { title: '4. ' + (settings.language === 'id' ? 'Batasan Layanan' : 'Service Limitations'), body: settings.language === 'id' ? 'SINDUKA+ tidak menjamin ketersediaan layanan 100% dan tidak bertanggung jawab atas keterlambatan respons akibat kondisi di luar kendali.' : 'SINDUKA+ does not guarantee 100% service availability and is not responsible for response delays due to conditions beyond our control.' },
                  { title: '5. ' + (settings.language === 'id' ? 'Perubahan Syarat' : 'Changes to Terms'), body: settings.language === 'id' ? 'Kami berhak mengubah syarat ini sewaktu-waktu. Pengguna akan diberitahu melalui notifikasi aplikasi.' : 'We reserve the right to modify these terms at any time. Users will be notified via app notifications.' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${dark ? 'bg-[#1E1E1E]' : 'bg-[#F5F7FA]'}`}>
                    <p className={`font-bold ${textPrimary} mb-1`}>{item.title}</p>
                    <p className={`text-sm ${textSecondary} leading-relaxed`}>{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`w-full ${dark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-t-3xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textPrimary}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {settings.language === 'id' ? 'Ubah Password' : 'Change Password'}
                </h2>
                <button onClick={() => setShowPasswordModal(false)} className={`p-2 rounded-full ${hoverBg}`}>
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              <div className="space-y-4">
                {(['current', 'next', 'confirm'] as const).map(field => (
                  <div key={field}>
                    <label className={`block text-sm font-medium ${textPrimary} mb-1.5`}>
                      {field === 'current' ? (settings.language === 'id' ? 'Password Saat Ini' : 'Current Password') :
                       field === 'next' ? (settings.language === 'id' ? 'Password Baru' : 'New Password') :
                       (settings.language === 'id' ? 'Konfirmasi Password Baru' : 'Confirm New Password')}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                      <input
                        type={showPw[field] ? 'text' : 'password'}
                        value={passwordForm[field]}
                        onChange={e => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${dark ? 'bg-[#1E1E1E] border-gray-600 text-white focus:border-[#1565C0]' : 'border-gray-200 focus:border-[#1565C0]'}`}
                        placeholder={field === 'current' ? '••••••••' : field === 'next' ? (settings.language === 'id' ? 'Min. 8 karakter' : 'Min. 8 chars') : '••••••••'}
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} className={`absolute right-4 top-1/2 -translate-y-1/2 ${textSecondary}`}>
                        {showPw[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
                {passwordMsg && (
                  <p className={`text-sm text-center ${passwordMsg.startsWith('✓') ? 'text-[#43A047]' : 'text-[#E53935]'}`}>
                    {passwordMsg}
                  </p>
                )}
                <button
                  onClick={handleSavePassword}
                  className="w-full bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-2"
                >
                  {settings.language === 'id' ? 'Simpan Password' : 'Save Password'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
