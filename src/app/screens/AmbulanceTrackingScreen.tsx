import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Phone, MessageCircle, Navigation, Clock, MapPin, Hospital, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

export function AmbulanceTrackingScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { activeIncident, incidents, sensorData } = useGuardian();

  const incident = activeIncident || incidents[0];

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#1E293B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pelacakan Ambulans Siaga 119
            </h1>
            <p className="text-xs text-slate-500">Unit Gawat Darurat • Menuju Lokasi Kejadian</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          En Route
        </span>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-50 overflow-hidden">
        {/* Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'linear-gradient(#1565C0 1px, transparent 1px), linear-gradient(to right, #1565C0 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Center Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative text-center">
            {/* Victim Location Pin */}
            <div className="absolute -top-16 -left-20 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
                Lokasi Korban
              </span>
            </div>

            {/* Ambulance Moving Pin */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#1565C0] border-4 border-white shadow-2xl flex items-center justify-center text-white">
                  <Navigation className="w-7 h-7 rotate-45" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-blue-400/30 animate-ping" />
              </div>
              <span className="bg-[#1565C0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow mt-1">
                Ambulans 119 (Unit {id || '01'})
              </span>
            </div>
          </div>
        </div>

        {/* Floating Top Route Info Card */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-slate-800">Sedang Meluncur ke Koordinat</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#1565C0]">AB-119-GD</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 font-semibold">ETA Tiba</p>
                <p className="text-sm font-bold text-[#E53935] font-mono">2 Menit</p>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 font-semibold">Jarak</p>
                <p className="text-sm font-bold text-slate-800 font-mono">1.2 km</p>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 font-semibold">RS Rujukan</p>
                <p className="text-xs font-bold text-slate-800 truncate">RSUP Sardjito</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-100">
        {/* Paramedic Driver Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-md">
            BR
          </div>
          <div className="flex-1">
            <p className="text-slate-800 font-bold text-sm">Bripka Rahmat / Dr. Hendra (Paramedis)</p>
            <p className="text-slate-500 text-xs">Tim Siaga Reaksi Cepat IGD 119 Sleman</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-amber-500 text-xs font-bold">★ 4.9</span>
              <span className="text-slate-400 text-[11px]">• Siaga Medis Tingkat 1</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href="tel:119"
            className="flex items-center justify-center gap-2 bg-[#43A047] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            Telepon Tim 119
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
        </div>

        {/* Live Timeline Updates */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Paramedis telah menerima profil medis pasien (Gol. Darah: <strong>{user.bloodType}</strong>)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Kontak darurat keluarga telah menerima link tracking ambulans via WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
