import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  EyeOff, ArrowLeft, ShieldAlert, CheckCircle2, Lock, Radio,
  Send, AlertOctagon, HelpCircle, PhoneCall, VolumeX
} from 'lucide-react';
import { useGuardian } from '../context/GuardianContext';
import { useUser } from '../context/UserContext';

export function SilentSOSScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { triggerSilentSOS, journey, sensorData, cancelSilentSOS } = useGuardian();
  const [isActivated, setIsActivated] = useState(journey.isSilentSosActive);
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguiseNotes, setDisguiseNotes] = useState('Daftar belanja bulanan: Beras, susu, roti, telur, minyak goreng...');

  const handleActivate = () => {
    triggerSilentSOS();
    setIsActivated(true);
  };

  const handleDeactivate = () => {
    cancelSilentSOS();
    setIsActivated(false);
  };

  if (isDisguised) {
    return (
      <div className="min-h-screen bg-amber-50/50 p-6 flex flex-col justify-between font-sans">
        <div>
          <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4">
            <h2 className="text-lg font-bold text-amber-900">Catatan Cepat</h2>
            <button
              onClick={() => setIsDisguised(false)}
              className="text-xs text-amber-800 font-semibold underline"
            >
              Kembali ke Mode Normal
            </button>
          </div>
          <textarea
            value={disguiseNotes}
            onChange={(e) => setDisguiseNotes(e.target.value)}
            className="w-full h-80 bg-transparent border-none focus:outline-none text-slate-800 text-sm resize-none leading-relaxed"
          />
        </div>
        <div className="text-center">
          <span className="text-[10px] text-amber-600/70 font-mono">
            {isActivated ? '• Sinyal Senyap Aktif Latar Belakang (GPS: Fixed)' : 'Catatan tersimpan otomatis'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-400">
            <VolumeX className="w-3.5 h-3.5" />
            <span>Mode Senyap / Stealth</span>
          </div>
          <button
            onClick={() => setIsDisguised(true)}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
          >
            Samarkan Tampilan
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-950">
            <EyeOff className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Silent SOS (Senyap)
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            Mengirimkan sinyal darurat dan koordinat presisi ke SINDUKA Core tanpa bunyi sirine atau alarm layar.
          </p>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="text-center my-auto">
        {!isActivated ? (
          <motion.div whileTap={{ scale: 0.95 }} className="inline-block">
            <button
              onClick={handleActivate}
              className="w-52 h-52 mx-auto rounded-full bg-gradient-to-b from-rose-600 to-rose-900 border-4 border-rose-500/40 shadow-2xl shadow-rose-950 flex flex-col items-center justify-center text-white relative group"
            >
              <div className="absolute inset-0 rounded-full border border-rose-400 animate-ping opacity-30 pointer-events-none" />
              <ShieldAlert className="w-14 h-14 mb-2 text-rose-200 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-black tracking-wider uppercase">
                Aktifkan SOS
              </span>
              <span className="text-[10px] text-rose-300 mt-1">
                Kirim Sinyal Senyap
              </span>
            </button>
          </motion.div>
        ) : (
          <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-400">Sinyal Darurat Senyap Terkirim!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Lokasi GPS Anda ({sensorData.gpsLat}, {sensorData.gpsLng}) dan telemetri telah dikirimkan ke:
              </p>
            </div>

            <div className="space-y-2 text-left text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kontak Darurat ({user.emergencyContacts.length} Kontak via WA/SMS)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Command Center Operator SINDUKA Core</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unit Penyelamat & Rumah Sakit Terdekat</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsDisguised(true)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Kunci Tampilan (Catatan)
              </button>
              <button
                onClick={handleDeactivate}
                className="py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center mt-6">
        <p className="text-[11px] text-slate-400">
          🔒 Dirancang khusus untuk situasi kriminalitas, begal jalanan, atau kondisi intimidasi ketika korban tidak dapat melakukan panggilan suara terbuka.
        </p>
      </div>
    </div>
  );
}
