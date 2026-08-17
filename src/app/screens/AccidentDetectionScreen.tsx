import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, CheckCircle, XCircle, Activity, MapPin, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

export function AccidentDetectionScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { activeIncident, incidents, sensorData, journey, resetSensors } = useGuardian();
  const [countdown, setCountdown] = useState(15);

  const currentIncident = activeIncident || incidents[0];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/emergency-dispatch');
    }
  }, [countdown, navigate]);

  const handleSafe = () => {
    resetSensors();
    navigate('/dashboard');
  };

  const handleEmergency = () => {
    navigate('/emergency-dispatch');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E53935] via-[#D32F2F] to-[#B71C1C] flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center w-full max-w-md"
      >
        {/* Alert Icon with pulsing rings */}
        <div className="relative mb-6">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -inset-4 bg-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="relative w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl"
          >
            <AlertTriangle className="w-14 h-14 text-[#E53935]" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl font-black mb-1 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Keadaan Darurat Terdeteksi!
        </h1>
        <p className="text-white/90 text-sm mb-4">
          SINDUKA Core mendeteksi anomali pada pemantauan Guardian Anda.
        </p>

        {/* Detected Trigger Details Badge */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 mb-6 text-left border border-white/20 text-xs">
          <div className="flex items-center gap-2 text-rose-200 font-bold mb-1">
            <Cpu className="w-4 h-4 text-amber-300" />
            <span>Pemicu Sistem:</span>
          </div>
          <p className="text-white font-medium">
            {currentIncident?.triggerDescription || 'Sensor IoT MPU6050 mendeteksi lonjakan gaya benturan (G-Force 4.8G)'}
          </p>
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/10 text-white/80 text-[11px]">
            <span>G-Force: <strong>{sensorData.accelG}G</strong></span>
            <span>Kemiringan: <strong>{sensorData.gyroRoll}°</strong></span>
            <span>GPS: <strong>{sensorData.gpsLat}, {sensorData.gpsLng}</strong></span>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto bg-white/15 backdrop-blur-md rounded-full flex flex-col items-center justify-center border-4 border-white shadow-xl">
            <p className="text-white text-5xl font-black font-mono">{countdown}</p>
            <p className="text-white/80 text-[11px] font-semibold uppercase tracking-wider">Detik</p>
          </div>
          <p className="text-white/90 text-xs mt-3">
            Bantuan darurat & ambulans 119 akan diberangkatkan otomatis
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSafe}
            className="w-full bg-[#43A047] hover:bg-[#2E7D32] text-white py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Saya Aman - Batalkan Peringatan
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmergency}
            className="w-full bg-white hover:bg-slate-100 text-[#E53935] py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Kirim Bantuan Sekarang (Tanpa Menunggu)
          </motion.button>
        </div>

        {/* Multi-party Notification Targets */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/15">
          <p className="text-white/90 text-xs font-bold mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            Notifikasi Otomatis Multi-Pihak:
          </p>
          <ul className="text-white/80 text-xs space-y-1 pl-2">
            <li>• Kontak Darurat Keluarga ({user.emergencyContacts.length} Nomor via SMS/WhatsApp)</li>
            <li>• SINDUKA Core Admin Command Center Dispatch</li>
            <li>• Rujukan IGD RSUP Dr. Sardjito / RS Siloam</li>
            <li>• Unit Ambulans Gawat Darurat 119 Terdekat</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
