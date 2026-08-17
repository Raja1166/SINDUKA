import { Outlet } from "react-router";
import { UserProvider } from "../context/UserContext";
import { AppSettingsProvider, useAppSettings } from "../context/AppSettingsContext";
import { GuardianProvider } from "../context/GuardianContext";
import { CheckInModal } from "../components/CheckInModal";
import { IoTSensorSimulatorBar } from "../components/IoTSensorSimulatorBar";

function ThemedWrapper() {
  const { settings } = useAppSettings();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.darkMode ? 'bg-[#121212]' : 'bg-[#F5F7FA]'}`}>
      <Outlet />
      <CheckInModal />
      <IoTSensorSimulatorBar />
    </div>
  );
}

export function Root() {
  return (
    <AppSettingsProvider>
      <UserProvider>
        <GuardianProvider>
          <ThemedWrapper />
        </GuardianProvider>
      </UserProvider>
    </AppSettingsProvider>
  );
}

