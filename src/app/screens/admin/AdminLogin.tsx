import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim().toLowerCase() === 'admin@sinduka.id' && password === 'guardian123') {
      setError('');
      localStorage.setItem('sinduka_admin_session', 'true');
      navigate('/admin/dashboard');
      return;
    }

    setError('Akses admin ditolak. Gunakan email admin@sinduka.id dan password guardian123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1565C0] via-[#0D47A1] to-[#E53935] px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-full mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#212121] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SINDUKA+ Admin
            </h1>
            <p className="text-[#757575]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Emergency Command Center
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1565C0] focus:outline-none transition-colors"
                  placeholder="admin@sinduka.id"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1565C0] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#1565C0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#1565C0]/5 rounded-xl">
            <p className="text-[#757575] text-sm text-center">
              <span className="inline-block w-2 h-2 bg-[#43A047] rounded-full mr-2" />
              Secure admin access for emergency personnel only
            </p>
          </div>
        </div>

        <p className="text-white/80 text-center mt-6 text-sm">
          SINDUKA+ Emergency Response System v1.0
        </p>
      </motion.div>
    </div>
  );
}
