import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead } = useUser();

  // Mark all unread notifications as read when screen opens
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    unreadNotifications.forEach(notification => {
      setTimeout(() => markNotificationAsRead(notification.id), 500);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-6 h-6 text-[#E53935]" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-[#43A047]" />;
      default:
        return <Info className="w-6 h-6 text-[#1565C0]" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-[#E53935]/10';
      case 'success':
        return 'bg-[#43A047]/10';
      default:
        return 'bg-[#1565C0]/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E53935] to-[#C62828] px-4 py-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Notifications
            </h1>
            <p className="text-white/80 text-sm">{notifications.length} notifications</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-[#212121] font-semibold text-lg mb-2">No Notifications</p>
            <p className="text-[#757575] text-sm text-center">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                !notification.read ? 'border-l-4 border-[#E53935]' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBackgroundColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[#212121] font-bold">{notification.title}</h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#E53935] rounded-full" />
                    )}
                  </div>
                  <p className="text-[#757575] text-sm mb-2">{notification.message}</p>
                  <p className="text-[#757575] text-xs">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
