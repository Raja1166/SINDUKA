import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, AlertTriangle, TrendingUp, Calendar, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const hotspots = [
  { location: 'Jl. Sudirman', incidents: 45, risk: 'High', color: 'text-[#E53935]' },
  { location: 'Jl. Thamrin', incidents: 32, risk: 'High', color: 'text-[#E53935]' },
  { location: 'Jl. Gatot Subroto', incidents: 28, risk: 'Medium', color: 'text-[#F9A825]' },
  { location: 'Jl. Rasuna Said', incidents: 18, risk: 'Medium', color: 'text-[#F9A825]' },
  { location: 'Jl. HR Rasuna', incidents: 12, risk: 'Low', color: 'text-[#43A047]' },
];

export function AccidentHeatmapPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Accident Heatmap
              </h1>
              <p className="text-sm text-[#757575]">Risk analysis and hotspot tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Date range selector would open here')}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-[#1565C0] transition-colors"
            >
              <Calendar className="w-5 h-5 text-[#757575]" />
              <span className="text-[#212121] font-semibold hidden sm:inline">Last 30 Days</span>
            </button>
            <button
              onClick={() => alert('Filter options would open here')}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-[#1565C0] transition-colors"
            >
              <Filter className="w-5 h-5 text-[#757575]" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Geographic Distribution
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#E53935] rounded" />
                    <span className="text-xs text-[#757575]">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#F9A825] rounded" />
                    <span className="text-xs text-[#757575]">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#43A047] rounded" />
                    <span className="text-xs text-[#757575]">Safe Area</span>
                  </div>
                </div>
              </div>

              {/* Map Area */}
              <div className="h-[600px] bg-gradient-to-br from-[#E53935]/10 via-[#F9A825]/10 to-[#43A047]/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                  <MapPin className="w-16 h-16 text-[#E53935] mx-auto mb-4" />
                  <p className="text-[#757575] font-semibold text-lg">Accident Heatmap View</p>
                  <p className="text-[#757575] text-sm">Showing high-risk zones in Jakarta</p>
                </div>

                {/* Heat zones overlay */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-[#E53935]/30 rounded-full blur-2xl" />
                <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#E53935]/20 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#F9A825]/25 rounded-full blur-xl" />
                <div className="absolute bottom-20 left-40 w-28 h-28 bg-[#F9A825]/20 rounded-full blur-xl" />
                <div className="absolute top-40 right-20 w-20 h-20 bg-[#43A047]/20 rounded-full blur-lg" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Summary Statistics
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#E53935]/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#757575] text-sm">High Risk Zones</span>
                    <TrendingUp className="w-5 h-5 text-[#E53935]" />
                  </div>
                  <p className="text-3xl font-bold text-[#E53935]">8</p>
                  <p className="text-xs text-[#757575] mt-1">77 total incidents</p>
                </div>
                <div className="p-4 bg-[#F9A825]/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#757575] text-sm">Medium Risk Zones</span>
                    <AlertTriangle className="w-5 h-5 text-[#F9A825]" />
                  </div>
                  <p className="text-3xl font-bold text-[#F9A825]">15</p>
                  <p className="text-xs text-[#757575] mt-1">46 total incidents</p>
                </div>
                <div className="p-4 bg-[#43A047]/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#757575] text-sm">Safe Areas</span>
                    <MapPin className="w-5 h-5 text-[#43A047]" />
                  </div>
                  <p className="text-3xl font-bold text-[#43A047]">42</p>
                  <p className="text-xs text-[#757575] mt-1">12 total incidents</p>
                </div>
              </div>
            </div>

            {/* Top Hotspots */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Top Accident Hotspots
              </h3>
              <div className="space-y-3">
                {hotspots.map((hotspot, index) => (
                  <div key={index} className="p-3 bg-[#F5F7FA] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#757575] font-bold text-sm">#{index + 1}</span>
                        <p className="text-[#212121] font-semibold text-sm">{hotspot.location}</p>
                      </div>
                      <span className={`text-xs font-semibold ${hotspot.color}`}>
                        {hotspot.risk}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#757575]">{hotspot.incidents} incidents</span>
                      <div className="flex-1 mx-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            hotspot.risk === 'High' ? 'bg-[#E53935]' :
                            hotspot.risk === 'Medium' ? 'bg-[#F9A825]' :
                            'bg-[#43A047]'
                          }`}
                          style={{ width: `${(hotspot.incidents / 45) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Monthly Comparison
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#757575] text-sm">This Month</span>
                  <span className="text-[#212121] font-bold">135</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#757575] text-sm">Last Month</span>
                  <span className="text-[#757575] font-semibold">142</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#43A047]" />
                      <span className="text-[#43A047] font-semibold text-sm">-4.9% decrease</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
