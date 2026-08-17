import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Ambulance, Mail, Lock, Eye, EyeOff, User, Phone, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { authService } from '../services/authService';
import { MathCaptcha, CaptchaRef } from '../components/MathCaptcha';

export function RegisterScreen() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const captchaRef = useRef<CaptchaRef>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    else if (!/^(\+62|0)[0-9]{8,12}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Format nomor telepon tidak valid';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan';
    if (!captchaAnswer.trim()) {
      newErrors.captcha = 'Jawaban CAPTCHA wajib diisi';
    } else if (!captchaRef.current?.validate(captchaAnswer)) {
      newErrors.captcha = 'Jawaban CAPTCHA salah, coba lagi';
      captchaRef.current?.reset();
      setCaptchaAnswer('');
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = authService.register(formData.fullName, formData.email, formData.phone, formData.password);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    updateUser({ name: formData.fullName, email: formData.email, phone: formData.phone });
    localStorage.setItem('sinduka_session_user', JSON.stringify({
      id: String(Date.now()),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
    }));
    setStep('success');
  };

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][passwordStrength];
  const strengthColor = ['', '#E53935', '#F9A825', '#43A047', '#1565C0'][passwordStrength];

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-white px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-[#E8F5E9] rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-[#43A047]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#212121] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Registrasi Berhasil!
          </h2>
          <p className="text-[#757575] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Akun Anda telah berhasil dibuat.
          </p>
          <p className="text-[#757575] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            Selamat datang, <span className="font-semibold text-[#212121]">{formData.fullName}</span>!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Mulai Gunakan SINDUKA+
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-white px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/login')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
            >
              <ChevronLeft className="w-5 h-5 text-[#757575]" />
            </button>
            <div className="flex-1 text-center pr-9">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#E53935] to-[#C62828] rounded-full mb-3">
                <Ambulance className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Buat Akun
              </h1>
              <p className="text-sm text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Daftar untuk menggunakan SINDUKA+
              </p>
            </div>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#E53935] text-center"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.fullName ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="Nama lengkap Anda"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-[#E53935]">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-[#E53935]">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.phone ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="+62 812 3456 7890"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-[#E53935]">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.password ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="Min. 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#E53935] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ backgroundColor: i <= passwordStrength ? strengthColor : '#E0E0E0' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-[#E53935]">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.confirmPassword ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="Ulangi password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#E53935] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-[#E53935]">{errors.confirmPassword}</p>}
            </div>

            {/* CAPTCHA */}
            <MathCaptcha
              ref={captchaRef}
              value={captchaAnswer}
              onChange={setCaptchaAnswer}
              error={errors.captcha}
            />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#E53935] focus:ring-[#E53935]"
                />
                <span className="text-sm text-[#757575]">
                  Saya menyetujui{' '}
                  <span className="text-[#E53935] font-medium cursor-pointer hover:underline">Syarat & Ketentuan</span>{' '}
                  dan{' '}
                  <span className="text-[#E53935] font-medium cursor-pointer hover:underline">Kebijakan Privasi</span>{' '}
                  SINDUKA+
                </span>
              </label>
              {errors.agreeTerms && <p className="mt-1 text-xs text-[#E53935]">{errors.agreeTerms}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all mt-2"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#757575] text-sm">
              Sudah punya akun?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#E53935] font-semibold hover:text-[#C62828] transition-colors"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
