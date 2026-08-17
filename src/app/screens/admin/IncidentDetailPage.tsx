import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, User, Phone, MapPin, Clock, AlertTriangle,
  Ambulance, Shield, CheckCircle2, Activity, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardian } from '../../context/GuardianContext';

export function IncidentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { incidents } = useGuardian();
  const incident = incidents.find((item) => item.id === id) || incidents[0];

  const timelineEvents = [
    { time: incident.timestamp, event: 'Incident recorded in Guardian system', status: 'completed', icon: CheckCircle2, color: 'text-[#43A047]' },
    { time: 'Live', event: 'Hospital notification transmitted', status: 'completed', icon: Ambulance, color: 'text-[#1565C0]' },
    { time: 'Live', event: 'Emergency contacts informed', status: 'completed', icon: User, color: 'text-[#1565C0]' },
    { time: 'Live', event: 'Command center confirmed dispatch', status: 'completed', icon: Shield, color: 'text-[#F9A825]' },
    { time: 'Live', event: 'Ambulance assigned', status: 'completed', icon: Activity, color: 'text-[#1565C0]' },
    { time: 'Live', event: `${incident.triggerDescription}`, status: 'completed', icon: AlertTriangle, color: 'text-[#E53935]' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Incident Details
            </h1>
            <p className="text-sm text-[#757575]">Incident ID: #{id}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-[#43A047] to-[#2E7D32] rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-12 h-12" />
                  <div>
                    <p className="text-2xl font-bold">{incident.status}</p>
                    <p className="text-white/80">Total response time: {incident.etaAmbulanceMinutes} minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Severity</p>
                  <span className="text-lg font-bold">{incident.severity.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>

            {/* Victim Information */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Victim Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#1565C0]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#757575]">Name</p>
                    <p className="text-[#212121] font-semibold">{incident.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E53935]/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#E53935]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#757575]">Phone</p>
                    <p className="text-[#212121] font-semibold">{incident.userPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F9A825]/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#F9A825]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#757575]">Age</p>
                    <p className="text-[#212121] font-semibold">{incident.userBloodType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#43A047]/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#43A047]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#757575]">Blood Type</p>
                    <p className="text-[#212121] font-semibold">{incident.userBloodType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Location Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#E53935] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#757575]">Accident Location</p>
                    <p className="text-[#212121] font-semibold mb-2">{incident.locationName}</p>
                    <p className="text-xs text-[#757575]">Coordinates: {incident.gpsLat}, {incident.gpsLng}</p>
                  </div>
                </div>
                <div className="h-48 bg-gradient-to-br from-[#1565C0]/20 to-[#43A047]/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#E53935] mx-auto mb-2" />
                    <p className="text-[#757575] font-semibold">Map View</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Status Timeline
              </h3>
              <div className="space-y-4">
                {timelineEvents.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-[#43A047]/10' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[#212121] font-semibold">{item.event}</p>
                          <span className="text-sm text-[#757575]">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/ambulance-tracking/1')}
                  className="w-full flex items-center gap-3 p-3 bg-[#1565C0]/10 rounded-xl hover:bg-[#1565C0]/20 transition-colors"
                >
                  <Ambulance className="w-5 h-5 text-[#1565C0]" />
                  <span className="text-[#212121] font-semibold">Dispatch Ambulance</span>
                </button>
                <button
                  onClick={() => alert('Police has been dispatched to the location')}
                  className="w-full flex items-center gap-3 p-3 bg-[#F9A825]/10 rounded-xl hover:bg-[#F9A825]/20 transition-colors"
                >
                  <Shield className="w-5 h-5 text-[#F9A825]" />
                  <span className="text-[#212121] font-semibold">Dispatch Police</span>
                </button>
                <button
                  onClick={() => alert('Calling victim: +62 812-3456-7890')}
                  className="w-full flex items-center gap-3 p-3 bg-[#43A047]/10 rounded-xl hover:bg-[#43A047]/20 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#43A047]" />
                  <span className="text-[#212121] font-semibold">Call Victim</span>
                </button>
              </div>
            </div>

            {/* Accident Severity */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Accident Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#757575] mb-1">Severity Level</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-[#F9A825] to-[#E53935]" />
                    </div>
                    <span className="text-[#E53935] font-bold text-sm">{incident.severity.toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#757575] mb-1">Impact Force</p>
                  <p className="text-[#212121] font-semibold">{incident.sensorSnapshot.accelG} G</p>
                </div>
                <div>
                  <p className="text-sm text-[#757575] mb-1">Vehicle Speed</p>
                  <p className="text-[#212121] font-semibold">{incident.sensorSnapshot.speedKmh} km/h</p>
                </div>
                <div>
                  <p className="text-sm text-[#757575] mb-1">Detection Time</p>
                  <p className="text-[#212121] font-semibold">{incident.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Response Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-[#212121] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Response Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#757575]">Dispatch Time</span>
                  <span className="text-[#212121] font-semibold">{incident.etaAmbulanceMinutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#757575]">Arrival Time</span>
                  <span className="text-[#212121] font-semibold">{incident.etaAmbulanceMinutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#757575]">Total Response</span>
                  <span className="text-[#43A047] font-bold">{incident.etaAmbulanceMinutes} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
