import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Navigation, Ambulance, Hospital, Shield, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const markers = [
  { id: 1, x: 50, y: 50, type: 'user', title: 'Your Location' },
  { id: 2, x: 55, y: 45, type: 'ambulance', title: 'Ambulance Unit 1', eta: '2 min' },
  { id: 3, x: 45, y: 55, type: 'hospital', title: 'RS Siloam', distance: '2.5 km' },
  { id: 4, x: 60, y: 40, type: 'police', title: 'Polsek Jakarta Pusat', distance: '3.2 km' },
];

export function FullscreenMaps() {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<typeof markers[0] | null>(null);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'ambulance':
        return { icon: Ambulance, color: 'bg-[#1565C0]' };
      case 'hospital':
        return { icon: Hospital, color: 'bg-[#E53935]' };
      case 'police':
        return { icon: Shield, color: 'bg-[#F9A825]' };
      default:
        return { icon: MapPin, color: 'bg-[#43A047]' };
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 flex items-center gap-4 z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#212121]" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#212121]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Emergency Map
          </h1>
          <p className="text-xs text-[#757575]">Real-time tracking</p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {/* Map Background with Grid Pattern */}
        <div className="absolute inset-0 bg-[#F5F7FA]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #E0E0E0 1px, transparent 1px),
              linear-gradient(to bottom, #E0E0E0 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}>
            {/* Map overlay with gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1565C0]/5 via-transparent to-[#43A047]/5" />

            {/* Road-like patterns */}
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300" />
            <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-300" />
            <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-300" />
            <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-gray-300" />

            {/* Markers */}
            {markers.map((marker) => {
              const { icon: Icon, color } = getMarkerIcon(marker.type);
              return (
                <motion.div
                  key={marker.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedMarker(marker)}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`${color} w-12 h-12 rounded-full shadow-lg flex items-center justify-center border-4 border-white ${
                    marker.type === 'user' ? 'animate-pulse' : ''
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {selectedMarker?.id === marker.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 whitespace-nowrap z-10"
                    >
                      <p className="text-[#212121] font-semibold text-sm">{marker.title}</p>
                      {marker.eta && <p className="text-[#1565C0] text-xs">ETA: {marker.eta}</p>}
                      {marker.distance && <p className="text-[#757575] text-xs">{marker.distance}</p>}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="absolute bottom-24 right-6 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-20">
          <Navigation className="w-6 h-6 text-[#1565C0]" />
        </button>
      </div>

      {/* Bottom Info Card */}
      <div className="bg-white p-6 rounded-t-3xl shadow-2xl">
        <h3 className="text-[#212121] font-bold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Nearby Services
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-[#1565C0]/5 rounded-xl">
            <div className="w-10 h-10 bg-[#1565C0] rounded-full flex items-center justify-center">
              <Ambulance className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#212121] font-semibold">Ambulance Unit 1</p>
              <p className="text-[#757575] text-sm">1.2 km • ETA 2 min</p>
            </div>
            <button
              onClick={() => navigate('/ambulance-tracking/1')}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-semibold hover:bg-[#0D47A1] transition-colors"
            >
              Lacak
            </button>
          </div>

          <div className="flex items-center gap-4 p-3 bg-[#43A047]/5 rounded-xl">
            <div className="w-10 h-10 bg-[#43A047] rounded-full flex items-center justify-center">
              <Ambulance className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#212121] font-semibold">Ambulance Unit 2</p>
              <p className="text-[#757575] text-sm">2.1 km • ETA 4 min</p>
            </div>
            <button
              onClick={() => navigate('/ambulance-tracking/2')}
              className="px-4 py-2 bg-[#43A047] text-white rounded-lg text-sm font-semibold hover:bg-[#388E3C] transition-colors"
            >
              Lacak
            </button>
          </div>

          <div className="flex items-center gap-4 p-3 bg-[#E53935]/5 rounded-xl">
            <div className="w-10 h-10 bg-[#E53935] rounded-full flex items-center justify-center">
              <Hospital className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#212121] font-semibold">RS Siloam Jakarta</p>
              <p className="text-[#757575] text-sm">2.5 km • ETA 5 min</p>
            </div>
            <button
              onClick={() => navigate('/sos')}
              className="px-4 py-2 border-2 border-[#E53935] text-[#E53935] rounded-lg text-sm font-semibold hover:bg-[#E53935] hover:text-white transition-colors"
            >
              SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
