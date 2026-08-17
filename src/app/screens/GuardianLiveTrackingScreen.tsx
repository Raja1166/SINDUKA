import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Navigation, Shield, Share2, Radio,
  Activity, Clock, Battery, Signal, Users, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

export function GuardianLiveTrackingScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { journey, sensorData, confirmCheckIn } = useGuardian();
  const [isCopied, setIsCopied] = useState(false);

  const trackingLink = `https://sinduka.id/track/${journey.shareableToken}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(trackingLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white p-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-3 py-0.5 rounded-full">
              Guardian Live Tracking
            </span>
            <h1 className="text-lg font-bold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pelacakan GPS Real-Time
            </h1>
          </div>
          <button
            onClick={copyLink}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Bagikan Tautan Pelacakan"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Live Tracking Header Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Status: Terhubung & Siaga</p>
              <p className="text-white/80 text-xs font-mono">
                Token: {journey.shareableToken}
              </p>
            </div>
          </div>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 bg-white text-[#1565C0] rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition-colors"
          >
            {isCopied ? 'Tersalin ✓' : 'Salin Link'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 mt-5 space-y-5">
        {/* Live Map Box */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#1565C0]" />
              Radar Rute Perjalanan
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live GPS Fix (4m)
            </span>
          </div>

          {/* Interactive Map Visualizer */}
          <div
            onClick={() => navigate('/maps')}
            className="h-64 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer hover:opacity-95 transition-opacity"
          >
            {/* Grid Map pattern */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'linear-gradient(#1565C0 1px, transparent 1px), linear-gradient(to right, #1565C0 1px, transparent 1px)',
                backgroundSize: '28px 28px'
              }}
            />

            {/* Simulated Road Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 30 200 Q 120 120 180 150 T 320 60"
                fill="none"
                stroke="#1565C0"
                strokeWidth="4"
                strokeDasharray="6,6"
              />
            </svg>

            {/* Top Stats Tag */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-700">
                Kecepatan: <span className="font-bold text-[#1565C0]">{sensorData.speedKmh} km/h</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>{sensorData.batteryLevel}%</span>
              </div>
            </div>

            {/* Center GPS Marker */}
            <div className="relative z-10 mx-auto flex flex-col items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#1565C0] border-4 border-white shadow-xl flex items-center justify-center text-white animate-pulse">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping" />
              </div>
              <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 shadow">
                {journey.destination || 'Dalam Perjalanan'}
              </div>
            </div>

            {/* Bottom GPS Coordinates */}
            <div className="relative z-10 text-center">
              <div className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-mono text-slate-600 border border-slate-200">
                Lat: {sensorData.gpsLat} | Lng: {sensorData.gpsLng} | Alt: {sensorData.altitudeMeters}m
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Akselerasi MPU</span>
            <span className="text-xl font-black text-slate-800 font-mono">{sensorData.accelG} G</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Normal</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Sudut Giroskop</span>
            <span className="text-xl font-black text-slate-800 font-mono">{sensorData.gyroRoll}°</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Stabil</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Interval Check-In</span>
            <span className="text-xl font-black text-[#1565C0] font-mono">{journey.nextCheckInCountdown}s</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Otomatis</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Sinyal IoT</span>
            <span className="text-xl font-black text-emerald-600 font-mono">4G LTE</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Tersinkronisasi</span>
          </div>
        </div>

        {/* Emergency Contacts Sharing Status */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1565C0]" />
              Kontak Darurat Terhubung
            </h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-[#1565C0] font-semibold hover:underline"
            >
              Kelola Kontak →
            </button>
          </div>

          <div className="space-y-2.5">
            {user.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{contact.name}</h4>
                  <p className="text-[11px] text-slate-500">{contact.relationship} • {contact.phone}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Sync
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Button */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/safe-journey')}
            className="py-3.5 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-xs rounded-2xl shadow transition-colors text-center"
          >
            Buka Safe Journey Cockpit
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow transition-colors text-center"
          >
            Buka Admin Command Center
          </button>
        </div>
      </div>
    </div>
  );
}
