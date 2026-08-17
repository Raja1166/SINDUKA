import { useNavigate } from 'react-router';
import { ArrowLeft, Download, TrendingUp, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const accidentTrendsData = [
  { month: 'Jan', incidents: 65 },
  { month: 'Feb', incidents: 59 },
  { month: 'Mar', incidents: 80 },
  { month: 'Apr', incidents: 81 },
  { month: 'May', incidents: 56 },
];

const responseTimeData = [
  { time: '< 2 min', count: 45 },
  { time: '2-5 min', count: 78 },
  { time: '5-10 min', count: 32 },
  { time: '> 10 min', count: 12 },
];

const incidentCategoriesData = [
  { name: 'Vehicle Collision', value: 45, color: '#E53935' },
  { name: 'Minor Accident', value: 30, color: '#F9A825' },
  { name: 'Emergency Stop', value: 15, color: '#1565C0' },
  { name: 'False Alarm', value: 10, color: '#43A047' },
];

export function AnalyticsReportsPage() {
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
                Analytics & Reports
              </h1>
              <p className="text-sm text-[#757575]">Performance metrics and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Date range selector would open here')}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-[#1565C0] transition-colors"
            >
              <Calendar className="w-5 h-5 text-[#757575]" />
              <span className="text-[#212121] font-semibold hidden sm:inline">Last 6 Months</span>
            </button>
            <button
              onClick={() => alert('Report exported successfully! Check your downloads folder.')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <Download className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E53935]/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#E53935]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#43A047]" />
            </div>
            <p className="text-[#757575] text-sm mb-1">Total Incidents</p>
            <h3 className="text-3xl font-bold text-[#212121] mb-1">341</h3>
            <p className="text-[#43A047] text-sm">-12% from last period</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#1565C0]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#43A047]" />
            </div>
            <p className="text-[#757575] text-sm mb-1">Avg Response Time</p>
            <h3 className="text-3xl font-bold text-[#212121] mb-1">3.2m</h3>
            <p className="text-[#43A047] text-sm">-8% improvement</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#43A047]/10 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-[#43A047]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#43A047]" />
            </div>
            <p className="text-[#757575] text-sm mb-1">Resolution Rate</p>
            <h3 className="text-3xl font-bold text-[#212121] mb-1">96.5%</h3>
            <p className="text-[#43A047] text-sm">+2.1% increase</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F9A825]/10 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#F9A825]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#E53935]" />
            </div>
            <p className="text-[#757575] text-sm mb-1">Active Users</p>
            <h3 className="text-3xl font-bold text-[#212121] mb-1">2,847</h3>
            <p className="text-[#E53935] text-sm">+15% growth</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accident Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Accident Trends
              </h3>
              <span className="text-xs text-[#757575]">Last 5 months</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accidentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#757575" />
                <YAxis stroke="#757575" />
                <Tooltip />
                <Line type="monotone" dataKey="incidents" stroke="#E53935" strokeWidth={3} dot={{ fill: '#E53935', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Response Time Distribution
              </h3>
              <span className="text-xs text-[#757575]">Current period</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#757575" />
                <YAxis stroke="#757575" />
                <Tooltip />
                <Bar dataKey="count" fill="#1565C0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Incident Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Incident Categories
              </h3>
              <span className="text-xs text-[#757575]">Total: 100 incidents</span>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={incidentCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {incidentCategoriesData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#757575]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Geographic Distribution
              </h3>
              <span className="text-xs text-[#757575]">Top 5 locations</span>
            </div>
            <div className="space-y-4">
              {[
                { location: 'Jakarta Pusat', count: 89, percentage: 90 },
                { location: 'Jakarta Selatan', count: 67, percentage: 70 },
                { location: 'Jakarta Utara', count: 54, percentage: 55 },
                { location: 'Jakarta Barat', count: 43, percentage: 45 },
                { location: 'Jakarta Timur', count: 32, percentage: 35 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#212121] font-semibold">{item.location}</span>
                    <span className="text-sm text-[#757575]">{item.count} incidents</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1565C0] to-[#0D47A1]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#212121] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Report Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#F5F7FA] rounded-xl">
              <p className="text-[#757575] text-sm mb-2">Most Active Time</p>
              <p className="text-[#212121] font-bold text-lg">14:00 - 18:00</p>
              <p className="text-[#757575] text-xs mt-1">Peak hours for incidents</p>
            </div>
            <div className="p-4 bg-[#F5F7FA] rounded-xl">
              <p className="text-[#757575] text-sm mb-2">Busiest Day</p>
              <p className="text-[#212121] font-bold text-lg">Friday</p>
              <p className="text-[#757575] text-xs mt-1">Most incidents occur</p>
            </div>
            <div className="p-4 bg-[#F5F7FA] rounded-xl">
              <p className="text-[#757575] text-sm mb-2">Average Severity</p>
              <p className="text-[#F9A825] font-bold text-lg">Medium</p>
              <p className="text-[#757575] text-xs mt-1">Overall incident severity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
