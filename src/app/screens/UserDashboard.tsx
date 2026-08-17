import React from 'react';
import { useNavigate } from 'react-router';
import {
  Home, MapIcon, History, User, Ambulance, Hospital, Shield, MapPin,
  Bell, Settings, Navigation, Clock, CheckCircle2, EyeOff, Radio,
  Activity, ArrowRight, LayoutDashboard, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useGuardian } from '../context/GuardianContext';

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, unreadCount } = useUser();
  const { journey, confirmCheckIn, triggerCheckInPrompt, sensorData } = useGuardian();

  const isInTransit = journey.status === 'in-transit';

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#0D47A1] p-6 rounded-b-3xl shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white/90">
                SINDUKA + GUARDIAN
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Halo, {user.name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
              title="Buka Admin Command Center"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Core</span>
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E53935] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Guardian Active Protection Card */}
        {isInTransit ? (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Safe Journey Sedang Berjalan</span>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">Menuju {journey.destination}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/safe-journey')}
                className="px-3 py-1 bg-white text-[#1565C0] text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                Cockpit <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/70 block">Check-In Berikutnya</span>
                <span className="text-sm font-mono font-bold text-white">{journey.nextCheckInCountdown} detik lagi</span>
              </div>
              <button
                onClick={confirmCheckIn}
                className="px-3 py-1.5 bg-[#43A047] hover:bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saya Aman
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-400/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Guardian Siaga Aktif</p>
                <p className="text-white/75 text-xs">Sensor IoT ESP32 & MPU6050 Terhubung</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/safe-journey')}
              className="px-3.5 py-1.5 bg-white text-[#1565C0] text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors"
            >
              Mulai Rute
            </button>
          </div>
        )}
      </div>

      {/* Emergency SOS Main Button */}
      <div className="px-5 -mt-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/sos')}
          className="w-full bg-gradient-to-r from-[#E53935] to-[#C62828] rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all border-2 border-white/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md animate-pulse">
                <Ambulance className="w-7 h-7 text-[#E53935]" />
              </div>
              <div className="text-left text-white">
                <p className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  EMERGENCY SOS
                </p>
                <p className="text-white/80 text-xs">Tekan & tahan untuk bantuan darurat instan</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Guardian 4-Core Features Grid */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#1E293B] font-bold text-base flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Shield className="w-5 h-5 text-[#1565C0]" />
            Modul Guardian (Preventif)
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">5 Fitur Utama</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Safe Journey */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/safe-journey')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-200 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1565C0] flex items-center justify-center mb-2.5">
              <Navigation className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Safe Journey</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Pemantauan perjalanan & estimasi ETA</p>
            <span className="inline-block text-[10px] font-bold text-[#1565C0] mt-2">Buka Rute →</span>
          </motion.div>

          {/* Check-In Berkala */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerCheckInPrompt}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-green-200 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Check-In Berkala</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Tes prompt respon keselamatan</p>
            <span className="inline-block text-[10px] font-bold text-emerald-600 mt-2">Uji Sekarang →</span>
          </motion.div>

          {/* Live Tracking */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/live-tracking')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Live Tracking</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Pelacakan GPS & tautan keluarga</p>
            <span className="inline-block text-[10px] font-bold text-indigo-600 mt-2">Lihat Radar →</span>
          </motion.div>

          {/* Silent SOS */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/silent-sos')}
            className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm border border-slate-800 cursor-pointer hover:bg-black transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-rose-400 flex items-center justify-center mb-2.5">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Silent SOS</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Sinyal senyap anti-kejahatan</p>
            <span className="inline-block text-[10px] font-bold text-rose-400 mt-2">Mode Senyap →</span>
          </motion.div>
        </div>
      </div>

      {/* Mini Radar Map */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <div
            onClick={() => navigate('/maps')}
            className="h-44 bg-gradient-to-br from-blue-50 via-slate-100 to-emerald-50 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative"
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(#1565C0 1px, transparent 1px), linear-gradient(to right, #1565C0 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-lg shadow-red-500/30 mb-2 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {journey.destination || 'Jl. Ringroad Utara No. 45, Sleman'}
              </p>
              <p className="text-[11px] text-slate-500">
                Speed: {sensorData.speedKmh} km/h • GPS Akurasi: {sensorData.gpsAccuracyMeters}m
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-800 font-bold text-sm">Lokasi Terpantau Guardian</p>
              <p className="text-slate-500 text-xs">Yogyakarta, Indonesia (Lat: {sensorData.gpsLat}, Lng: {sensorData.gpsLng})</p>
            </div>
            <button
              onClick={() => navigate('/maps')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Buka Peta
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Emergency Services */}
      <div className="px-5 mt-6">
        <h3 className="text-[#1E293B] font-bold text-base mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Layanan Siaga Terdekat (SINDUKA Core)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/ambulance-tracking/1')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center mb-2">
              <Ambulance className="w-5 h-5" />
            </div>
            <p className="text-slate-800 font-bold text-sm">Ambulans 119 Siaga</p>
            <p className="text-slate-500 text-xs">1.2 km • RSUP Sardjito</p>
            <p className="text-[#1565C0] text-xs font-bold mt-1">ETA 2 Menit</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/maps')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-rose-50 text-[#E53935] rounded-xl flex items-center justify-center mb-2">
              <Hospital className="w-5 h-5" />
            </div>
            <p className="text-slate-800 font-bold text-sm">RS Siloam Yogyakarta</p>
            <p className="text-slate-500 text-xs">2.5 km • IGD 24 Jam</p>
            <p className="text-[#E53935] text-xs font-bold mt-1">Siaga Terbuka</p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3.5 z-30">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button className="flex flex-col items-center gap-1 text-[#1565C0]">
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-bold">Home</span>
          </button>
          <button onClick={() => navigate('/safe-journey')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#1565C0] transition-colors">
            <Navigation className="w-5 h-5" />
            <span className="text-[11px] font-medium">Guardian</span>
          </button>
          <button onClick={() => navigate('/maps')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#1565C0] transition-colors">
            <MapIcon className="w-5 h-5" />
            <span className="text-[11px] font-medium">Maps</span>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#1565C0] transition-colors">
            <History className="w-5 h-5" />
            <span className="text-[11px] font-medium">History</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#1565C0] transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[11px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
