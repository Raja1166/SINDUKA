import { createBrowserRouter } from "react-router";
import { Root } from "./layouts/Root";
import { SplashScreen } from "./screens/SplashScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { UserDashboard } from "./screens/UserDashboard";
import { FullscreenMaps } from "./screens/FullscreenMaps";
import { EmergencySOSScreen } from "./screens/EmergencySOSScreen";
import { AccidentDetectionScreen } from "./screens/AccidentDetectionScreen";
import { EmergencyDispatchScreen } from "./screens/EmergencyDispatchScreen";
import { AmbulanceTrackingScreen } from "./screens/AmbulanceTrackingScreen";
import { IncidentHistoryScreen } from "./screens/IncidentHistoryScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SafeJourneyScreen } from "./screens/SafeJourneyScreen";
import { SilentSOSScreen } from "./screens/SilentSOSScreen";
import { GuardianLiveTrackingScreen } from "./screens/GuardianLiveTrackingScreen";
import { AdminLogin } from "./screens/admin/AdminLogin";
import { MonitoringDashboard } from "./screens/admin/MonitoringDashboard";
import { IncidentDetailPage } from "./screens/admin/IncidentDetailPage";
import { AccidentHeatmapPage } from "./screens/admin/AccidentHeatmapPage";
import { AnalyticsReportsPage } from "./screens/admin/AnalyticsReportsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "register", Component: RegisterScreen },
      { path: "dashboard", Component: UserDashboard },
      { path: "safe-journey", Component: SafeJourneyScreen },
      { path: "guardian", Component: SafeJourneyScreen },
      { path: "live-tracking", Component: GuardianLiveTrackingScreen },
      { path: "silent-sos", Component: SilentSOSScreen },
      { path: "maps", Component: FullscreenMaps },
      { path: "sos", Component: EmergencySOSScreen },
      { path: "accident-detection", Component: AccidentDetectionScreen },
      { path: "emergency-dispatch", Component: EmergencyDispatchScreen },
      { path: "ambulance-tracking/:id", Component: AmbulanceTrackingScreen },
      { path: "history", Component: IncidentHistoryScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "notifications", Component: NotificationsScreen },
      { path: "settings", Component: SettingsScreen },

      // Admin/Web Dashboard Routes (SINDUKA Core Command Center)
      { path: "admin", Component: AdminLogin },
      { path: "admin/dashboard", Component: MonitoringDashboard },
      { path: "admin/incident/:id", Component: IncidentDetailPage },
      { path: "admin/heatmap", Component: AccidentHeatmapPage },
      { path: "admin/analytics", Component: AnalyticsReportsPage },
    ],
  },
]);

