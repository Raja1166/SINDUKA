import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Ambulance, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services/authService';
import { MathCaptcha, CaptchaRef } from '../components/MathCaptcha';
import { useUser } from '../context/UserContext';

export function LoginScreen() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const captchaRef = useRef<CaptchaRef>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email wajib diisi';
    if (!password) newErrors.password = 'Password wajib diisi';
    if (!captchaAnswer.trim()) {
      newErrors.captcha = 'Jawaban CAPTCHA wajib diisi';
    } else if (!captchaRef.current?.validate(captchaAnswer)) {
      newErrors.captcha = 'Jawaban CAPTCHA salah, coba lagi';
      captchaRef.current?.reset();
      setCaptchaAnswer('');
    }
    return newErrors;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const result = authService.login(email, password);
    if (!result.success) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      setServerError(result.message);
      captchaRef.current?.reset();
      setCaptchaAnswer('');
      return;
    }

    if (result.user) {
      updateUser({ name: result.user.fullName, email: result.user.email, phone: result.user.phone });
      localStorage.setItem('sinduka_session_user', JSON.stringify({
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
      }));
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-white px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E53935] to-[#C62828] rounded-full mb-4">
              <Ambulance className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#212121] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SINDUKA+
            </h1>
            <p className="text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Masuk untuk melanjutkan
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-[#E53935] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#E53935]">{serverError}</p>
                {loginAttempts >= 3 && (
                  <p className="text-xs text-[#757575] mt-1">
                    Belum punya akun?{' '}
                    <button onClick={() => navigate('/register')} className="text-[#E53935] underline">
                      Daftar sekarang
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); setServerError(''); }}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-[#E53935]">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); setServerError(''); }}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.password ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'}`}
                  placeholder="Masukkan password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#E53935] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-[#E53935]">{errors.password}</p>}
            </div>

            {/* CAPTCHA */}
            <MathCaptcha
              ref={captchaRef}
              value={captchaAnswer}
              onChange={v => { setCaptchaAnswer(v); if (errors.captcha) setErrors(p => ({ ...p, captcha: '' })); }}
              error={errors.captcha}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E53935] focus:ring-[#E53935]" />
                <span className="text-[#757575]">Ingat saya</span>
              </label>
              <button type="button" className="text-[#E53935] hover:text-[#C62828] transition-colors">
                Lupa Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#757575]">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[#E53935] font-semibold hover:text-[#C62828] transition-colors"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
