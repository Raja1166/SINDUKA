import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Shield, MapPin, Navigation, Clock, Play, Square, Pause,
  CheckCircle, AlertTriangle, Share2, EyeOff, Radio, RefreshCw,
  ArrowLeft, Bell, Users, Activity, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

const DESTINATION_PRESETS = [
  { name: 'Kost Pogung Dalangan, Sleman', distance: '6.8 km', eta: 20 },
  { name: 'Kampus 1 UTY (Jl. Ringroad Utara)', distance: '4.2 km', eta: 12 },
  { name: 'Malioboro Mall, Kota Yogyakarta', distance: '8.5 km', eta: 25 },
  { name: 'Stasiun Tugu Yogyakarta', distance: '7.9 km', eta: 22 },
];

export function SafeJourneyScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    journey,
    startJourney,
    pauseJourney,
    resumeJourney,
    endJourney,
    confirmCheckIn,
    triggerCheckInPrompt,
    triggerSilentSOS,
    sensorData,
  } = useGuardian();

  const [originInput, setOriginInput] = useState(journey.origin || 'Kampus 1 UTY (Jl. Ringroad Utara)');
  const [destInput, setDestInput] = useState(journey.destination || 'Kost Pogung Dalangan, Sleman');
  const [customEta, setCustomEta] = useState(20);
  const [selectedInterval, setSelectedInterval] = useState(journey.checkInIntervalSeconds || 30);
  const [isCopied, setIsCopied] = useState(false);

  const isInTransit = journey.status === 'in-transit';
  const isPaused = journey.status === 'paused';
  const isIdle = journey.status === 'idle' || journey.status === 'completed';

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startJourney(originInput, destInput, customEta, selectedInterval);
  };

  const handleShareLink = () => {
    const trackingUrl = `https://sinduka.id/track/${journey.shareableToken}`;
    navigator.clipboard?.writeText(trackingUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1565C0] via-[#1976D2] to-[#0D47A1] text-white p-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold bg-white/10 px-3 py-1 rounded-full">
              Modul Guardian
            </span>
            <h1 className="text-xl font-bold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Safe Journey & Tracking
            </h1>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isInTransit ? 'bg-emerald-500 text-white animate-pulse' :
              isPaused ? 'bg-amber-500 text-white' : 'bg-white/20 text-white'
            }`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-base">
                  {isInTransit ? 'Safe Journey Aktif' : isPaused ? 'Perjalanan Dijeda' : 'Siaga Perjalanan'}
                </p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-white/80 text-xs">
                {isInTransit ? `Check-In tiap ${journey.checkInIntervalSeconds}s • GPS Terhubung` : 'Siap mengawal perjalanan aman Anda'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/70 block">IoT MPU6050</span>
            <span className="text-xs font-bold text-emerald-300">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-5 mt-5 space-y-5">
        {/* If in Journey: Live Journey HUD */}
        {isInTransit || isPaused ? (
          <div className="space-y-4">
            {/* Live Journey Progress Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tujuan Perjalanan</span>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#E53935]" />
                    {journey.destination}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Dari: {journey.origin}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Sisa Waktu</span>
                  <div className="text-2xl font-black text-[#1565C0] font-mono">
                    {formatTime(journey.remainingSeconds)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Progres Rute</span>
                  <span>{journey.progressPercent}% Selesai</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1565C0] to-[#43A047]"
                    animate={{ width: `${journey.progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Check-In Berkala Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-mono font-bold text-sm">
                    {journey.nextCheckInCountdown}s
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Check-In Berikutnya</h4>
                    <p className="text-xs text-slate-600">Tekan konfirmasi bila Anda aman</p>
                  </div>
                </div>
                <button
                  onClick={confirmCheckIn}
                  className="px-4 py-2 bg-[#43A047] hover:bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Saya Aman
                </button>
              </div>

              {/* Real-time Telemetry Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Kecepatan</span>
                  <span className="text-base font-bold text-slate-800 font-mono">{sensorData.speedKmh} km/h</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">G-Force (IoT)</span>
                  <span className="text-base font-bold text-slate-800 font-mono">{sensorData.accelG} G</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Kemiringan</span>
                  <span className="text-base font-bold text-slate-800 font-mono">{sensorData.gyroRoll}°</span>
                </div>
              </div>
            </div>

            {/* Journey Control Actions */}
            <div className="grid grid-cols-2 gap-3">
              {isInTransit ? (
                <button
                  onClick={pauseJourney}
                  className="py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Jeda Perjalanan
                </button>
              ) : (
                <button
                  onClick={resumeJourney}
                  className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Lanjutkan
                </button>
              )}

              <button
                onClick={endJourney}
                className="py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                Selesai Perjalanan
              </button>
            </div>

            {/* Emergency & Share Action Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  triggerSilentSOS();
                  navigate('/emergency-dispatch');
                }}
                className="p-4 bg-slate-900 text-white rounded-2xl shadow-md hover:bg-black transition-colors text-left flex items-start gap-3 border border-slate-800"
              >
                <div className="w-9 h-9 bg-slate-800 text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Silent SOS</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kirim sinyal senyap tanpa suara alarm</p>
                </div>
              </button>

              <button
                onClick={handleShareLink}
                className="p-4 bg-white text-slate-800 rounded-2xl shadow-md hover:bg-slate-50 transition-colors text-left flex items-start gap-3 border border-slate-200/60"
              >
                <div className="w-9 h-9 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{isCopied ? 'Link Disalin! ✓' : 'Bagikan Live Link'}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Keluarga dapat memantau rute Anda</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Trip Setup Form */
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#1565C0]" />
                Rencanakan Safe Journey
              </h3>

              {/* Inputs */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Titik Awal (Origin)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={originInput}
                      onChange={(e) => setOriginInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1565C0]"
                      placeholder="Masukkan titik awal"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Titik Tujuan (Destination)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={destInput}
                      onChange={(e) => setDestInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1565C0]"
                      placeholder="Masukkan alamat tujuan"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Presets */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-500 block mb-2">Preset Rute Cepat</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DESTINATION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDestInput(preset.name);
                        setCustomEta(preset.eta);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                        destInput === preset.name
                          ? 'bg-blue-50 border-[#1565C0] text-[#1565C0] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{preset.name}</span>
                      <span className="text-[10px] shrink-0 text-slate-500">{preset.eta}m</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-In Interval Settings */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-500">Interval Check-In Berkala</label>
                  <span className="text-[11px] text-blue-600 font-bold">
                    {selectedInterval < 60 ? `${selectedInterval} Detik (Demo)` : `${selectedInterval / 60} Menit`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { sec: 15, label: '15s (Demo)' },
                    { sec: 30, label: '30s (Demo)' },
                    { sec: 900, label: '15 Menit' },
                    { sec: 1800, label: '30 Menit' },
                  ].map((item) => (
                    <button
                      key={item.sec}
                      onClick={() => setSelectedInterval(item.sec)}
                      className={`py-2 px-1 rounded-xl text-center font-medium text-xs border transition-all ${
                        selectedInterval === item.sec
                          ? 'bg-[#1565C0] border-[#1565C0] text-white font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Mulai Safe Journey
              </motion.button>
            </div>

            {/* Feature Explainers */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perlindungan Selama Perjalanan:</h4>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Check-In Berkala Otomatis:</strong> Memastikan Anda selalu responsif & aman di sepanjang rute.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Sensor IoT MPU6050:</strong> Deteksi instan jika terjadi benturan keras atau kendaraan terguling.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Integrasi SINDUKA Core:</strong> Auto-dispatch tim medis RSUP Sardjito & notifikasi keluarga saat darurat.</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Map Preview & Nearby Hospitals */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500" />
              Live Radar Keamanan Rute
            </h3>
            <button
              onClick={() => navigate('/maps')}
              className="text-xs font-semibold text-[#1565C0] hover:underline"
            >
              Lihat Peta Penuh →
            </button>
          </div>

          <div
            onClick={() => navigate('/maps')}
            className="h-44 rounded-2xl bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative overflow-hidden"
          >
            {/* Map Grid effect */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(#1565C0 1px, transparent 1px), linear-gradient(to right, #1565C0 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1565C0] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {journey.destination || 'Jl. Ringroad Utara, Sleman'}
              </p>
              <p className="text-[11px] text-slate-500">
                GPS: {sensorData.gpsLat}, {sensorData.gpsLng} • 3 RS Siaga Terdekat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
