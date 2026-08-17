import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, MapIcon, TrendingUp, FileText, Bell,
  AlertTriangle, Ambulance, CheckCircle2, Activity, Users,
  MapPin, Clock, Menu, LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../../context/GuardianContext';

export function MonitoringDashboard() {
  const navigate = useNavigate();
  const { incidents } = useGuardian();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const recentIncidents = incidents.slice(0, 3).map((incident) => ({
    id: incident.id,
    location: incident.locationName,
    time: incident.timestamp,
    severity: incident.severity,
    status: incident.status,
  }));

  const activeCount = incidents.filter((incident) => ['Active', 'Dispatched', 'On Scene'].includes(incident.status)).length;
  const resolvedCount = incidents.filter((incident) => incident.status === 'Resolved').length;
  const totalIncidents = incidents.length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#1565C0] to-[#0D47A1] text-white p-6 hidden lg:flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            SINDUKA+
          </h1>
          <p className="text-white/80 text-sm">Admin Dashboard</p>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/admin/heatmap')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            <MapIcon className="w-5 h-5" />
            <span>Heatmap</span>
          </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Reports</span>
          </button>
        </nav>

        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="w-64 h-full bg-gradient-to-b from-[#1565C0] to-[#0D47A1] text-white p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                SINDUKA+
              </h1>
              <p className="text-white/80 text-sm">Admin Dashboard</p>
            </div>

            <nav className="space-y-2 flex-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => { navigate('/admin/heatmap'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <MapIcon className="w-5 h-5" />
                <span>Heatmap</span>
              </button>
              <button
                onClick={() => { navigate('/admin/analytics'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => { navigate('/admin/analytics'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </button>
            </nav>

            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-[#212121]" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Emergency Command Center
              </h2>
              <p className="text-sm text-[#757575]">Real-time monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6 text-[#757575]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E53935] rounded-full" />
            </button>
            <div
              onClick={() => navigate('/admin')}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-[#1565C0] rounded-full flex items-center justify-center text-white font-bold">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#212121]">Admin User</p>
                <p className="text-xs text-[#757575]">Emergency Operator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#E53935]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#E53935]" />
                </div>
                <span className="text-xs font-semibold text-[#757575]">TODAY</span>
              </div>
              <h3 className="text-3xl font-bold text-[#212121] mb-1">{totalIncidents}</h3>
              <p className="text-[#757575] text-sm">Total Incidents</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#F9A825]/10 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#F9A825]" />
                </div>
                <span className="text-xs font-semibold text-[#757575]">ACTIVE</span>
              </div>
              <h3 className="text-3xl font-bold text-[#212121] mb-1">{activeCount}</h3>
              <p className="text-[#757575] text-sm">Active Incidents</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                  <Ambulance className="w-6 h-6 text-[#1565C0]" />
                </div>
                <span className="text-xs font-semibold text-[#757575]">AVAILABLE</span>
              </div>
              <h3 className="text-3xl font-bold text-[#212121] mb-1">12</h3>
              <p className="text-[#757575] text-sm">Ambulances Ready</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#43A047]/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#43A047]" />
                </div>
                <span className="text-xs font-semibold text-[#757575]">TODAY</span>
              </div>
              <h3 className="text-3xl font-bold text-[#212121] mb-1">{resolvedCount}</h3>
              <p className="text-[#757575] text-sm">Resolved Incidents</p>
            </motion.div>
          </div>

          {/* Map and Incidents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Map */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Live Emergency Map
              </h3>
              <div className="h-96 bg-gradient-to-br from-[#1565C0]/20 to-[#43A047]/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#E53935] mx-auto mb-4" />
                  <p className="text-[#757575] font-semibold">Real-time Incident Tracking</p>
                  <p className="text-[#757575] text-sm">{activeCount} active incidents being monitored</p>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Recent Alerts
                </h3>
                <span className="text-xs font-semibold text-[#E53935] bg-[#E53935]/10 px-2 py-1 rounded">
                  LIVE
                </span>
              </div>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => navigate(`/admin/incident/${incident.id}`)}
                    className="p-4 bg-[#F5F7FA] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        incident.severity === 'High' ? 'bg-[#E53935]/10 text-[#E53935]' :
                        incident.severity === 'Medium' ? 'bg-[#F9A825]/10 text-[#F9A825]' :
                        'bg-[#43A047]/10 text-[#43A047]'
                      }`}>
                        {incident.severity}
                      </span>
                      <span className="text-xs text-[#757575]">{incident.time}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#212121] mb-1">{incident.location}</p>
                    <p className="text-xs text-[#757575]">Status: {incident.status}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/history')}
                className="w-full mt-4 py-2 text-[#1565C0] font-semibold text-sm hover:bg-[#1565C0]/5 rounded-lg transition-colors"
              >
                View All Incidents →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
