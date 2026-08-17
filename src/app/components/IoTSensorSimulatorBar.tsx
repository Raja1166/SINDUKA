import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu, Activity, Zap, Compass, AlertTriangle, ShieldAlert,
  RotateCcw, ChevronUp, ChevronDown, CheckCircle2, Radio, BellRing
} from 'lucide-react';
import { useGuardian } from '../context/GuardianContext';
import { useNavigate } from 'react-router';

export function IoTSensorSimulatorBar() {
  const {
    sensorData,
    journey,
    simulateCrashImpact,
    simulateRolloverTilt,
    simulateMissedCheckInTimeout,
    resetSensors,
    setSimulatedSpeed,
    triggerSilentSOS,
    triggerCheckInPrompt,
  } = useGuardian();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isImpactHigh = sensorData.accelG >= 4.0;
  const isRolloverHigh = Math.abs(sensorData.gyroRoll) >= 60;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Floating Badge Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-white font-semibold text-xs transition-all border ${
          isImpactHigh || isRolloverHigh
            ? 'bg-[#E53935] border-red-400 animate-bounce'
            : 'bg-slate-900/90 border-slate-700 hover:bg-slate-800'
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span>Simulator IoT MPU6050</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </motion.button>

      {/* Simulator Control Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-12 right-0 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-5 shadow-2xl text-white mt-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">ESP32 + MPU6050 Testbench</h4>
                  <p className="text-[10px] text-slate-400">Simulasi Parameter Skenario SINDUKA Core</p>
                </div>
              </div>
              <button
                onClick={resetSensors}
                title="Reset Sensor"
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Realtime Live Gauge Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <div className={`p-2.5 rounded-xl border transition-all ${
                isImpactHigh ? 'bg-rose-950/60 border-rose-500 text-rose-400' : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Akselerasi</span>
                  <Zap className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {sensorData.accelG} <span className="text-[10px] font-normal text-slate-400">G</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">Batas: &gt;4.0G</div>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${
                isRolloverHigh ? 'bg-rose-950/60 border-rose-500 text-rose-400' : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Giroskop</span>
                  <Compass className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {sensorData.gyroRoll}°
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">Batas: &gt;60°</div>
              </div>

              <div className="p-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Kecepatan</span>
                  <Radio className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {sensorData.speedKmh} <span className="text-[10px] font-normal text-slate-400">km/h</span>
                </div>
                <div className="text-[9px] text-emerald-400 mt-0.5">GPS Fixed (4m)</div>
              </div>
            </div>

            {/* Quick Trigger Actions */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulasi Pemicu Keadaan Darurat
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    simulateCrashImpact(4.9);
                    navigate('/accident-detection');
                  }}
                  className="p-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 hover:border-rose-500 rounded-xl text-left transition-all text-xs font-semibold text-rose-200 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <div>Crash Impact</div>
                    <div className="text-[10px] font-normal text-rose-400">G-Force 4.9G</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    simulateRolloverTilt(78.5);
                    navigate('/accident-detection');
                  }}
                  className="p-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 hover:border-amber-500 rounded-xl text-left transition-all text-xs font-semibold text-amber-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div>Rollover Tilt</div>
                    <div className="text-[10px] font-normal text-amber-400">Gyro Kemiringan 78°</div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={triggerCheckInPrompt}
                  className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl text-left transition-all text-xs font-semibold text-blue-200 flex items-center gap-2"
                >
                  <BellRing className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div>Prompt Check-In</div>
                    <div className="text-[10px] font-normal text-blue-300">Munculkan Dialog</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    simulateMissedCheckInTimeout();
                    setTimeout(() => navigate('/accident-detection'), 1400);
                  }}
                  className="p-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl text-left transition-all text-xs font-semibold text-purple-200 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div>Missed Check-In</div>
                    <div className="text-[10px] font-normal text-purple-300">Timeout Eskalasi</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => {
                  triggerSilentSOS();
                  navigate('/emergency-dispatch');
                }}
                className="w-full p-2.5 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-600/60 rounded-xl text-xs font-semibold text-slate-200 hover:text-rose-300 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-rose-500" />
                Simulasi Silent SOS (Sinyal Senyap)
              </button>
            </div>

            {/* Footer status */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Status Perjalanan: <span className="capitalize font-semibold text-slate-200">{journey.status}</span>
              </span>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Buka Admin Core →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
