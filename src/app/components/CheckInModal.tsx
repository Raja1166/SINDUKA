import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, Clock, Volume2, ThumbsUp, X } from 'lucide-react';
import { useGuardian } from '../context/GuardianContext';
import { useNavigate } from 'react-router';

export function CheckInModal() {
  const { journey, confirmCheckIn, postponeCheckIn } = useGuardian();
  const navigate = useNavigate();

  if (!journey.isCheckInPending) return null;

  const secondsLeft = journey.checkInTimeoutCountdown;
  const progressPercent = (secondsLeft / 20) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/20 text-center relative overflow-hidden"
        >
          {/* Header Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#F9A825] via-[#E53935] to-[#C62828]" />

          {/* Icon with pulsing rings */}
          <div className="relative my-4 flex justify-center items-center">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute w-28 h-28 rounded-full bg-[#1565C0]/20"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="absolute w-22 h-22 rounded-full bg-[#1565C0]/30"
            />
            <div className="w-18 h-18 bg-gradient-to-tr from-[#1565C0] to-[#1E88E5] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 text-white z-10">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1E293B] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Check-In Keselamatan Berkala
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Guardian memantau rute perjalanan Anda menuju <span className="font-semibold text-slate-700">{journey.destination}</span>.
          </p>

          {/* Countdown Clock Circle */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 relative">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-[#E53935] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Batas Waktu Respons:
              </span>
              <span className={`text-3xl font-black ${secondsLeft <= 5 ? 'text-[#E53935] animate-pulse' : 'text-[#1565C0]'}`}>
                {secondsLeft}s
              </span>
            </div>

            {/* Linear Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
              <motion.div
                className={`h-full transition-all duration-1000 ${
                  secondsLeft <= 5 ? 'bg-[#E53935]' : 'bg-[#1565C0]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-rose-600 font-medium mt-2.5 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Jika tidak dijawab, SINDUKA Core otomatis mengirim sinyal darurat!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={confirmCheckIn}
              className="w-full py-4 bg-gradient-to-r from-[#43A047] to-[#2E7D32] text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-600/30 hover:shadow-green-600/40 transition-all flex items-center justify-center gap-3"
            >
              <ThumbsUp className="w-6 h-6" />
              Saya Aman! (Konfirmasi)
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => postponeCheckIn(60)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
              >
                Tunda 1 Menit
              </button>
              <button
                onClick={() => {
                  confirmCheckIn();
                  navigate('/sos');
                }}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition-colors border border-rose-200"
              >
                Butuh Bantuan Segera
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
