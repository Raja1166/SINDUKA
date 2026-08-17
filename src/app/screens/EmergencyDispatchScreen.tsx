import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, MapPin, Ambulance, Shield, Users, Clock, Hospital, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

const dispatchSteps = [
  { id: 1, text: 'Koordinat GPS & Telemetri Sensor Terkirim', icon: MapPin, delay: 400 },
  { id: 2, text: 'Notifikasi Darurat Terkirim ke Kontak Keluarga (WhatsApp)', icon: Users, delay: 1000 },
  { id: 3, text: 'SINDUKA Core Command Center Merespons', icon: Shield, delay: 1600 },
  { id: 4, text: 'Rujukan Medis Diterima IGD RSUP Dr. Sardjito', icon: Hospital, delay: 2200 },
  { id: 5, text: 'Ambulans 119 Reaksi Cepat Diberangkatkan', icon: Ambulance, delay: 2800 },
];

export function EmergencyDispatchScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { activeIncident, incidents, sensorData } = useGuardian();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const incident = activeIncident || incidents[0];

  useEffect(() => {
    dispatchSteps.forEach((step) => {
      setTimeout(() => {
        setCompletedSteps((prev) => Array.from(new Set([...prev, step.id])));
      }, step.delay);
    });

    const redirectTimer = setTimeout(() => {
      navigate('/ambulance-tracking/1');
    }, 4500);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E53935] via-[#D32F2F] to-[#C62828] flex flex-col items-center justify-center px-5 py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <div className="w-full h-full border-4 border-white border-t-transparent rounded-full" />
          </motion.div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mengirimkan Bantuan Darurat
          </h1>
          <p className="text-white/85 text-xs">
            Harap tetap tenang, sistem SINDUKA Core sedang mengoordinasikan pertolongan
          </p>
        </div>

        {/* Dispatch Checklist */}
        <div className="bg-white rounded-3xl p-5 mb-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1E293B] font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Status Koordinasi Multi-Pihak
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Dispatch
            </span>
          </div>

          <div className="space-y-3">
            {dispatchSteps.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              return (
                <motion.div
                  key={step.id}
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: step.delay / 1000 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    isCompleted ? 'bg-emerald-50/80 border border-emerald-200' : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isCompleted ? 'text-slate-800 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {step.text}
                  </p>
                  {isCompleted && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-emerald-600 text-[10px] font-bold shrink-0"
                    >
                      ✓ Selesai
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ETA Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#E53935]" />
              </div>
              <div>
                <p className="text-white/80 text-[11px]">Estimasi Tiba Ambulans (ETA)</p>
                <p className="text-white text-xl font-bold font-mono">2 Menit</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 block">RS Rujukan</span>
              <span className="text-xs font-bold text-white">RSUP Dr. Sardjito</span>
            </div>
          </div>
        </div>

        {/* Action button if user doesn't want to wait */}
        <button
          onClick={() => navigate('/ambulance-tracking/1')}
          className="w-full py-3 bg-white text-[#E53935] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition-colors"
        >
          Lihat Posisi Ambulans di Peta Sekarang →
        </button>
      </motion.div>
    </div>
  );
}
