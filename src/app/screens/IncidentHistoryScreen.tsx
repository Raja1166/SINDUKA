import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Filter, Calendar, MapPin, AlertTriangle, CheckCircle2, Clock, Cpu, EyeOff, ShieldAlert, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian, IncidentTriggerType } from '../context/GuardianContext';

export function IncidentHistoryScreen() {
  const navigate = useNavigate();
  const { incidents } = useGuardian();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.triggerDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-[#E53935]/10 text-[#E53935] border-red-200';
      case 'Medium':
        return 'bg-[#F9A825]/10 text-[#F9A825] border-amber-200';
      case 'Low':
        return 'bg-[#43A047]/10 text-[#43A047] border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTriggerIcon = (triggerType: IncidentTriggerType) => {
    switch (triggerType) {
      case 'iot_impact':
      case 'iot_rollover':
        return <Cpu className="w-5 h-5 text-rose-600" />;
      case 'missed_checkin':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'silent_sos':
        return <EyeOff className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-[#E53935]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm px-5 py-4 sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Riwayat Kejadian & Log Guardian
              </h1>
              <p className="text-xs text-slate-500">{incidents.length} total kejadian terdaftar di SINDUKA Core</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-xs font-bold text-[#1565C0] hover:underline"
          >
            Admin Feed →
          </button>
        </div>

        {/* Search & Severity Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan lokasi, pemicu, atau ID insiden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1565C0]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  filterSeverity === sev
                    ? 'bg-[#1565C0] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev === 'all' ? 'Semua Tingkat' : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="px-5 pt-4 space-y-3.5">
        {filteredIncidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer text-left"
            onClick={() => navigate(`/admin/incident/${incident.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getTriggerIcon(incident.triggerType)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{incident.id}</span>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">{incident.triggerDescription}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{incident.timestamp}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 truncate">
                <span className="font-semibold text-slate-800">{incident.locationName}</span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  Lat: {incident.gpsLat}, Lng: {incident.gpsLng} • Telemetri: {incident.sensorSnapshot.accelG}G / {incident.sensorSnapshot.gyroRoll}°
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-700">{incident.status}</span>
                <span className="text-slate-400">• RS: {incident.assignedHospital.split(' ')[0]}</span>
              </div>
              <span className="text-[#1565C0] font-bold flex items-center gap-0.5 hover:underline">
                Detail <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}

        {filteredIncidents.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada riwayat kejadian ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter keparahan</p>
          </div>
        )}
      </div>
    </div>
  );
}
