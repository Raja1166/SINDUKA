import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, User, MapPin, Ambulance, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

export function EmergencySOSScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { createIncident, sensorData, triggerSilentSOS } = useGuardian();
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      createIncident('manual_sos', 'Tombol Emergency SOS Ditekan oleh Pengguna', 'High');
      navigate('/accident-detection');
    }, 1500);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E53935] via-[#D32F2F] to-[#B71C1C] text-white flex flex-col justify-between p-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-3 py-0.5 rounded-full">
              SINDUKA Core
            </span>
            <h1 className="text-xl font-bold mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Emergency SOS
            </h1>
          </div>
          <button
            onClick={() => {
              triggerSilentSOS();
              navigate('/silent-sos');
            }}
            className="px-3 py-1.5 bg-black/30 hover:bg-black/40 rounded-full text-xs font-bold flex items-center gap-1 border border-white/20"
            title="Gunakan Mode Senyap"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Silent</span>
          </button>
        </div>
      </div>

      {/* Main SOS Button Center */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <motion.div
          animate={isPressed ? { scale: 0.92 } : { scale: 1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25" />
          <motion.button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            whileHover={{ scale: 1.05 }}
            className="relative w-60 h-60 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center border-8 border-white/30"
          >
            <Ambulance className="w-18 h-18 text-[#E53935] mb-2 animate-bounce" />
            <p className="text-[#E53935] text-4xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SOS
            </p>
            <p className="text-slate-500 text-xs font-bold uppercase mt-1">
              {isPressed ? 'Tahan 1.5 Detik...' : 'Tekan & Tahan'}
            </p>
          </motion.button>
        </motion.div>

        <div>
          <p className="text-white text-lg font-bold">
            Tahan Tombol untuk Bantuan Darurat
          </p>
          <p className="text-white/80 text-xs mt-1 max-w-xs mx-auto">
            Sistem akan menyiarkan koordinat GPS dan memanggil ambulans 119 ke lokasi Anda.
          </p>
        </div>
      </div>

      {/* Bottom Information */}
      <div className="space-y-3">
        {/* Location Preview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-bold text-xs">Lokasi GPS Terpantau:</p>
              <p className="text-white/90 text-xs">
                Jl. Ringroad Utara, Sleman, Yogyakarta (Lat: {sensorData.gpsLat}, Lng: {sensorData.gpsLng})
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Preview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">Kontak Keluarga Siaga:</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-bold">
              {user.emergencyContacts.length} Nomor Siaga
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
