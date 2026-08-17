import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Ambulance, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const loggedUser = localStorage.getItem('sinduka_session_user');
      const adminSession = localStorage.getItem('sinduka_admin_session');

      if (adminSession === 'true') {
        navigate('/admin/dashboard');
        return;
      }

      if (loggedUser) {
        navigate('/dashboard');
        return;
      }

      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E53935] to-[#C62828]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <Ambulance className="w-24 h-24 text-white mx-auto" />
          <MapPin className="w-12 h-12 text-white absolute -bottom-2 -right-2" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          SINDUKA+
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xl text-white/90 mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Smart Emergency Response System
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
