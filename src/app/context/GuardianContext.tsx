import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useUser } from './UserContext';

export type JourneyStatus = 'idle' | 'in-transit' | 'paused' | 'delayed' | 'completed' | 'incident';
export type IncidentTriggerType = 'iot_impact' | 'iot_rollover' | 'missed_checkin' | 'silent_sos' | 'manual_sos';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Active' | 'Dispatched' | 'On Scene' | 'Resolved';

export interface IoTSensorData {
  accelG: number; // Normal: ~1.0G, Impact: > 4.0G
  gyroRoll: number; // Normal: -15° to +15°, Rollover: > 60°
  gyroPitch: number; // Pitch angle
  speedKmh: number;
  batteryLevel: number;
  gpsLat: number;
  gpsLng: number;
  gpsAccuracyMeters: number;
  altitudeMeters: number;
  lastUpdated: string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  triggerType: IncidentTriggerType;
  triggerDescription: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  gpsLat: number;
  gpsLng: number;
  userName: string;
  userPhone: string;
  userBloodType: string;
  sensorSnapshot: {
    accelG: number;
    gyroRoll: number;
    speedKmh: number;
  };
  journeyDetails?: {
    origin: string;
    destination: string;
    elapsedMinutes: number;
  };
  assignedHospital: string;
  assignedAmbulance: string;
  etaAmbulanceMinutes: number;
  notificationsSent: {
    emergencyContacts: boolean;
    adminCommandCenter: boolean;
    hospital: boolean;
  };
}

export interface SafeJourneyState {
  status: JourneyStatus;
  origin: string;
  destination: string;
  estimatedMinutes: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  distanceKm: number;
  progressPercent: number;
  checkInIntervalSeconds: number;
  nextCheckInCountdown: number;
  isCheckInPending: boolean;
  checkInTimeoutCountdown: number; // 20s window to respond
  missedCheckInCount: number;
  isSilentSosActive: boolean;
  journeyStartTime: string | null;
  shareableToken: string;
}

export interface GuardianContextType {
  // Safe Journey
  journey: SafeJourneyState;
  startJourney: (origin: string, destination: string, estimatedMinutes: number, checkInIntervalSec?: number) => void;
  pauseJourney: () => void;
  resumeJourney: () => void;
  endJourney: () => void;
  
  // Check-In Berkala
  confirmCheckIn: () => void;
  postponeCheckIn: (seconds?: number) => void;
  triggerCheckInPrompt: () => void;
  
  // Silent SOS
  triggerSilentSOS: () => void;
  cancelSilentSOS: () => void;
  
  // IoT MPU6050 & GPS Telemetry
  sensorData: IoTSensorData;
  isSimulatorOpen: boolean;
  toggleSimulator: () => void;
  simulateCrashImpact: (customG?: number) => void;
  simulateRolloverTilt: (customAngle?: number) => void;
  simulateMissedCheckInTimeout: () => void;
  resetSensors: () => void;
  setSimulatedSpeed: (speed: number) => void;
  
  // Incident & Emergency Management (SINDUKA Core Bridge)
  incidents: IncidentRecord[];
  activeIncident: IncidentRecord | null;
  createIncident: (trigger: IncidentTriggerType, desc?: string, customSeverity?: IncidentSeverity) => IncidentRecord;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  clearActiveIncident: () => void;
  
  // Multi-party Notification Simulator
  broadcastNotificationLogs: Array<{
    id: string;
    time: string;
    recipient: 'Emergency Contacts' | 'Command Center Admin' | 'Hospital Emergency Dept';
    channel: 'WhatsApp / SMS' | 'WebSocket Dispatch' | 'Hospital HIS System';
    message: string;
    status: 'Sent' | 'Delivered' | 'Acknowledged';
  }>;
}

const DEFAULT_SENSOR_DATA: IoTSensorData = {
  accelG: 1.02,
  gyroRoll: 1.8,
  gyroPitch: -0.5,
  speedKmh: 42,
  batteryLevel: 94,
  gpsLat: -7.7828,
  gpsLng: 110.3671,
  gpsAccuracyMeters: 4.2,
  altitudeMeters: 135,
  lastUpdated: 'Baru saja',
  connectionStatus: 'connected',
};

const INITIAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-2026-0801',
    timestamp: '10 menit lalu',
    triggerType: 'iot_impact',
    triggerDescription: 'Benturan Keras Terdeteksi (G-Force 4.7G) oleh Sensor MPU6050 IoT',
    severity: 'High',
    status: 'Dispatched',
    locationName: 'Jl. Ringroad Utara No. 45, Sleman, Yogyakarta',
    gpsLat: -7.7562,
    gpsLng: 110.3789,
    userName: 'Muhammad Raja Aufaiz Naufal',
    userPhone: '+62 812-3456-7890',
    userBloodType: 'O+',
    sensorSnapshot: {
      accelG: 4.7,
      gyroRoll: 42.5,
      speedKmh: 58,
    },
    journeyDetails: {
      origin: 'Kampus 1 UTY',
      destination: 'Kost Pogung Baru',
      elapsedMinutes: 14,
    },
    assignedHospital: 'RSUP Dr. Sardjito Yogyakarta',
    assignedAmbulance: 'Ambulans Gawat Darurat Unit 01 (AB-119-GD)',
    etaAmbulanceMinutes: 3,
    notificationsSent: {
      emergencyContacts: true,
      adminCommandCenter: true,
      hospital: true,
    },
  },
  {
    id: 'INC-2026-0802',
    timestamp: '45 menit lalu',
    triggerType: 'missed_checkin',
    triggerDescription: 'Check-In Berkala Tidak Direspons (Timeout 20 Detik) pada Rute Malam Hari',
    severity: 'Medium',
    status: 'Resolved',
    locationName: 'Jl. Kaliurang KM 9.2, Sleman',
    gpsLat: -7.7285,
    gpsLng: 110.3951,
    userName: 'Rina Kusuma Dewi',
    userPhone: '+62 813-8888-9999',
    userBloodType: 'A+',
    sensorSnapshot: {
      accelG: 1.1,
      gyroRoll: 3.2,
      speedKmh: 0,
    },
    journeyDetails: {
      origin: 'Malioboro Mall',
      destination: 'Jl. Kaliurang KM 12',
      elapsedMinutes: 28,
    },
    assignedHospital: 'RS Panti Rapih',
    assignedAmbulance: 'Ambulans Reaksi Cepat Unit 03',
    etaAmbulanceMinutes: 6,
    notificationsSent: {
      emergencyContacts: true,
      adminCommandCenter: true,
      hospital: true,
    },
  },
  {
    id: 'INC-2026-0803',
    timestamp: '2 jam lalu',
    triggerType: 'silent_sos',
    triggerDescription: 'Silent SOS Diaktifkan oleh Pengguna (Situasi Bahaya Tanpa Suara)',
    severity: 'Critical',
    status: 'Resolved',
    locationName: 'Jl. Gejayan (Affandi), Caturtunggal, Depok',
    gpsLat: -7.7712,
    gpsLng: 110.3905,
    userName: 'Andi Saputra',
    userPhone: '+62 857-2222-3333',
    userBloodType: 'B+',
    sensorSnapshot: {
      accelG: 1.2,
      gyroRoll: 8.5,
      speedKmh: 15,
    },
    assignedHospital: 'RS Siloam Yogyakarta',
    assignedAmbulance: 'Ambulans Siaga 02',
    etaAmbulanceMinutes: 4,
    notificationsSent: {
      emergencyContacts: true,
      adminCommandCenter: true,
      hospital: true,
    },
  },
];

const GuardianContext = createContext<GuardianContextType | undefined>(undefined);

export function GuardianProvider({ children }: { children: ReactNode }) {
  const { user, addNotification } = useUser();

  const [journey, setJourney] = useState<SafeJourneyState>(() => {
    const saved = localStorage.getItem('sinduka_guardian_journey');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      status: 'idle',
      origin: 'Kampus 1 UTY (Jl. Ringroad Utara)',
      destination: 'Kost Pogung Dalangan, Sleman',
      estimatedMinutes: 20,
      elapsedSeconds: 0,
      remainingSeconds: 20 * 60,
      distanceKm: 6.8,
      progressPercent: 0,
      checkInIntervalSeconds: 30, // 30s for demo
      nextCheckInCountdown: 30,
      isCheckInPending: false,
      checkInTimeoutCountdown: 20,
      missedCheckInCount: 0,
      isSilentSosActive: false,
      journeyStartTime: null,
      shareableToken: 'GRD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
  });

  const [sensorData, setSensorData] = useState<IoTSensorData>(DEFAULT_SENSOR_DATA);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    const saved = localStorage.getItem('sinduka_incidents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_INCIDENTS;
  });
  const [activeIncident, setActiveIncident] = useState<IncidentRecord | null>(null);

  const [broadcastNotificationLogs, setBroadcastNotificationLogs] = useState<GuardianContextType['broadcastNotificationLogs']>([
    {
      id: 'LOG-001',
      time: 'Baru saja',
      recipient: 'Command Center Admin',
      channel: 'WebSocket Dispatch',
      message: 'Sistem SINDUKA Core terhubung ke Modul Guardian IoT ESP32 (Status: Aktif & Terlindungi)',
      status: 'Acknowledged',
    },
    {
      id: 'LOG-002',
      time: '5 menit lalu',
      recipient: 'Emergency Contacts',
      channel: 'WhatsApp / SMS',
      message: 'Safe Journey Siaga: Sistem pemantauan perjalanan & Check-In berkala aktif untuk rute pengguna.',
      status: 'Delivered',
    },
  ]);

  // Persist journey state to localStorage
  useEffect(() => {
    localStorage.setItem('sinduka_guardian_journey', JSON.stringify(journey));
  }, [journey]);

  // Persist incidents to localStorage
  useEffect(() => {
    localStorage.setItem('sinduka_incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Incident Creation (SINDUKA Core Bridge)
  const createIncident = useCallback((
    trigger: IncidentTriggerType,
    desc?: string,
    customSeverity?: IncidentSeverity
  ): IncidentRecord => {
    const incId = 'INC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const currentUserName = user.name || 'Pengguna SINDUKA';
    const currentUserPhone = user.phone || '+62 812-3456-7890';
    const currentUserBloodType = user.bloodType || 'O+';

    let severity: IncidentSeverity = customSeverity || 'High';
    let defaultDesc = 'Deteksi Keadaan Darurat Otomatis oleh SINDUKA Core';

    if (trigger === 'iot_impact') {
      defaultDesc = `Benturan Keras Terdeteksi (${sensorData.accelG}G) oleh Sensor Akselerometer MPU6050`;
      severity = 'Critical';
    } else if (trigger === 'iot_rollover') {
      defaultDesc = `Kemiringan Ekstrim / Rollover Kendaraan (${sensorData.gyroRoll}°) Terdeteksi oleh Giroskop MPU6050`;
      severity = 'Critical';
    } else if (trigger === 'missed_checkin') {
      defaultDesc = 'Check-In Berkala Tidak Direspons Pengguna (Response Timeout 20s) - Indikasi Bahaya/Hilang Kesadaran';
      severity = 'High';
    } else if (trigger === 'silent_sos') {
      defaultDesc = 'Silent SOS Terpicu secara Senyap dari Aplikasi Guardian (Situasi Darurat/Kriminalitas)';
      severity = 'Critical';
    } else if (trigger === 'manual_sos') {
      defaultDesc = 'Tombol Emergency SOS Ditekan oleh Pengguna';
      severity = 'High';
    }

    const newIncident: IncidentRecord = {
      id: incId,
      timestamp: 'Baru saja',
      triggerType: trigger,
      triggerDescription: desc || defaultDesc,
      severity,
      status: 'Active',
      locationName: journey.status === 'in-transit' ? `Rute Menuju ${journey.destination}` : 'Jl. Ringroad Utara, Sleman, D.I. Yogyakarta',
      gpsLat: sensorData.gpsLat,
      gpsLng: sensorData.gpsLng,
      userName: currentUserName,
      userPhone: currentUserPhone,
      userBloodType: currentUserBloodType,
      sensorSnapshot: {
        accelG: sensorData.accelG,
        gyroRoll: sensorData.gyroRoll,
        speedKmh: sensorData.speedKmh,
      },
      journeyDetails: journey.status === 'in-transit' ? {
        origin: journey.origin,
        destination: journey.destination,
        elapsedMinutes: Math.round(journey.elapsedSeconds / 60),
      } : undefined,
      assignedHospital: 'RSUP Dr. Sardjito Yogyakarta',
      assignedAmbulance: 'Ambulans Siaga 119 Unit 01',
      etaAmbulanceMinutes: 2,
      notificationsSent: {
        emergencyContacts: true,
        adminCommandCenter: true,
        hospital: true,
      },
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setActiveIncident(newIncident);

    addNotification({
      title: 'Guardian Incident Alert',
      message: `${newIncident.userName} terdeteksi dalam situasi darurat (${newIncident.triggerType}). Sistem Guardian mengirimkan peringatan ke kontak darurat dan pusat komando.`,
      type: 'emergency',
    });

    // Multi-party Notification Simulator Broadcast
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBroadcastNotificationLogs((prev) => [
      {
        id: 'LOG-' + Math.random().toString(36).substring(2, 6),
        time: timeNow,
        recipient: 'Emergency Contacts',
        channel: 'WhatsApp / SMS',
        message: `🚨 PERINGATAN DARURAT SINDUKA: ${newIncident.userName} terindikasi mengalami keadaan darurat (${newIncident.triggerDescription}). Lokasi: ${newIncident.locationName} (GPS: ${newIncident.gpsLat}, ${newIncident.gpsLng}). Ambulans sedang dikirim.`,
        status: 'Delivered',
      },
      {
        id: 'LOG-' + Math.random().toString(36).substring(2, 6),
        time: timeNow,
        recipient: 'Command Center Admin',
        channel: 'WebSocket Dispatch',
        message: `🚨 INCIDENT ALERT [${newIncident.id}]: ${newIncident.severity} Severity. Auto-dispatching unit ambulans terdekat.`,
        status: 'Acknowledged',
      },
      {
        id: 'LOG-' + Math.random().toString(36).substring(2, 6),
        time: timeNow,
        recipient: 'Hospital Emergency Dept',
        channel: 'Hospital HIS System',
        message: `🏥 RUJUKAN DARURAT IGD [${newIncident.assignedHospital}]: Pasien terindikasi kecelakaan lalu lintas. Golongan Darah: ${newIncident.userBloodType}. ETA Ambulans: ${newIncident.etaAmbulanceMinutes} Menit.`,
        status: 'Sent',
      },
      ...prev,
    ]);

    return newIncident;
  }, [sensorData, journey, user.name, user.phone, user.bloodType, addNotification]);

  const handleMissedCheckInEscalation = useCallback(() => {
    createIncident('missed_checkin', 'Check-In Berkala Tidak Direspons Pengguna (Response Timeout 20s) - Indikasi Bahaya/Hilang Kesadaran', 'High');
  }, [createIncident]);

  // Main Safe Journey & Check-In Tick Timer
  useEffect(() => {
    if (journey.status !== 'in-transit') return;

    const interval = setInterval(() => {
      setJourney((prev) => {
        if (prev.status !== 'in-transit') return prev;

        const newElapsed = prev.elapsedSeconds + 1;
        const totalSec = prev.estimatedMinutes * 60;
        const newRemaining = Math.max(0, totalSec - newElapsed);
        const newProgress = Math.min(100, Math.round((newElapsed / totalSec) * 100));

        // If Check-In popup is currently pending response
        if (prev.isCheckInPending) {
          const newTimeout = prev.checkInTimeoutCountdown - 1;
          if (newTimeout <= 0) {
            // Check-in MISSED! Trigger auto escalation to SINDUKA Core
            setTimeout(() => {
              handleMissedCheckInEscalation();
            }, 0);
            return {
              ...prev,
              isCheckInPending: false,
              missedCheckInCount: prev.missedCheckInCount + 1,
              status: 'incident',
            };
          }
          return {
            ...prev,
            elapsedSeconds: newElapsed,
            remainingSeconds: newRemaining,
            progressPercent: newProgress,
            checkInTimeoutCountdown: newTimeout,
          };
        }

        // Count down to next Check-In prompt
        const nextCountdown = prev.nextCheckInCountdown - 1;
        if (nextCountdown <= 0) {
          return {
            ...prev,
            elapsedSeconds: newElapsed,
            remainingSeconds: newRemaining,
            progressPercent: newProgress,
            isCheckInPending: true,
            checkInTimeoutCountdown: 20, // 20s to respond
            nextCheckInCountdown: prev.checkInIntervalSeconds,
          };
        }

        // Overdue status check
        let status = prev.status;
        if (newRemaining === 0 && prev.progressPercent < 100) {
          status = 'delayed';
        }

        return {
          ...prev,
          status,
          elapsedSeconds: newElapsed,
          remainingSeconds: newRemaining,
          progressPercent: newProgress,
          nextCheckInCountdown: nextCountdown,
        };
      });

      // Fluctuate simulated GPS & speed slightly while in-transit
      setSensorData((prev) => ({
        ...prev,
        speedKmh: Math.max(25, Math.min(65, Math.round(prev.speedKmh + (Math.random() * 6 - 3)))),
        accelG: +(1.0 + (Math.random() * 0.15 - 0.07)).toFixed(2),
        gyroRoll: +(Math.random() * 4 - 2).toFixed(1),
        lastUpdated: 'Baru saja',
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [journey.status, journey.isCheckInPending, handleMissedCheckInEscalation]);

  // Safe Journey Controls
  const startJourney = useCallback((origin: string, destination: string, estimatedMinutes: number, checkInIntervalSec: number = 30) => {
    setJourney({
      status: 'in-transit',
      origin: origin || 'Kampus 1 UTY',
      destination: destination || 'Kost Pogung Dalangan',
      estimatedMinutes: estimatedMinutes || 20,
      elapsedSeconds: 0,
      remainingSeconds: (estimatedMinutes || 20) * 60,
      distanceKm: +(Math.random() * 5 + 4).toFixed(1),
      progressPercent: 0,
      checkInIntervalSeconds: checkInIntervalSec,
      nextCheckInCountdown: checkInIntervalSec,
      isCheckInPending: false,
      checkInTimeoutCountdown: 20,
      missedCheckInCount: 0,
      isSilentSosActive: false,
      journeyStartTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shareableToken: 'GRD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    setSensorData((prev) => ({
      ...prev,
      speedKmh: 40,
      connectionStatus: 'connected',
    }));

    // Add broadcast log
    const logId = 'LOG-' + Date.now().toString().slice(-4);
    setBroadcastNotificationLogs((prev) => [
      {
        id: logId,
        time: 'Baru saja',
        recipient: 'Emergency Contacts',
        channel: 'WhatsApp / SMS',
        message: `Safe Journey Dimulai: Pengguna melakukan perjalanan dari ${origin} menuju ${destination}. Pemantauan aktif via Guardian.`,
        status: 'Delivered',
      },
      ...prev,
    ]);
  }, []);

  const pauseJourney = useCallback(() => {
    setJourney((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const resumeJourney = useCallback(() => {
    setJourney((prev) => ({ ...prev, status: 'in-transit' }));
  }, []);

  const endJourney = useCallback(() => {
    setJourney((prev) => ({
      ...prev,
      status: 'completed',
      progressPercent: 100,
      isCheckInPending: false,
    }));
    setSensorData((prev) => ({ ...prev, speedKmh: 0 }));

    const logId = 'LOG-' + Date.now().toString().slice(-4);
    setBroadcastNotificationLogs((prev) => [
      {
        id: logId,
        time: 'Baru saja',
        recipient: 'Emergency Contacts',
        channel: 'WhatsApp / SMS',
        message: 'Safe Journey Selesai: Pengguna telah tiba di tujuan dengan selamat.',
        status: 'Delivered',
      },
      ...prev,
    ]);
  }, []);

  // Check-In Actions
  const confirmCheckIn = useCallback(() => {
    setJourney((prev) => ({
      ...prev,
      isCheckInPending: false,
      checkInTimeoutCountdown: 20,
      nextCheckInCountdown: prev.checkInIntervalSeconds,
    }));

    const logId = 'LOG-' + Date.now().toString().slice(-4);
    setBroadcastNotificationLogs((prev) => [
      {
        id: logId,
        time: 'Baru saja',
        recipient: 'Command Center Admin',
        channel: 'WebSocket Dispatch',
        message: 'Check-In Terkonfirmasi: Pengguna aman & dalam kondisi normal.',
        status: 'Acknowledged',
      },
      ...prev,
    ]);
  }, []);

  const postponeCheckIn = useCallback((seconds: number = 30) => {
    setJourney((prev) => ({
      ...prev,
      isCheckInPending: false,
      nextCheckInCountdown: seconds,
      checkInTimeoutCountdown: 20,
    }));
  }, []);

  const triggerCheckInPrompt = useCallback(() => {
    setJourney((prev) => ({
      ...prev,
      isCheckInPending: true,
      checkInTimeoutCountdown: 20,
    }));
  }, []);

  // Silent SOS Actions
  const triggerSilentSOS = useCallback(() => {
    setJourney((prev) => ({ ...prev, isSilentSosActive: true, status: 'incident' }));
    createIncident('silent_sos', 'Silent SOS Senyap Diaktifkan oleh Pengguna', 'Critical');
  }, [createIncident]);

  const cancelSilentSOS = useCallback(() => {
    setJourney((prev) => ({ ...prev, isSilentSosActive: false }));
  }, []);

  // IoT Sensor Simulator Handlers
  const simulateCrashImpact = useCallback((customG: number = 4.8) => {
    setSensorData((prev) => ({
      ...prev,
      accelG: customG,
      gyroRoll: 35.4,
      speedKmh: 0,
      lastUpdated: 'Baru saja (Benturan Terdeteksi!)',
    }));
    setJourney((prev) => ({ ...prev, status: 'incident' }));
    createIncident('iot_impact', `Benturan Keras Terdeteksi (${customG}G) oleh Sensor Akselerometer MPU6050`, 'Critical');
  }, [createIncident]);

  const simulateRolloverTilt = useCallback((customAngle: number = 74.2) => {
    setSensorData((prev) => ({
      ...prev,
      accelG: 2.9,
      gyroRoll: customAngle,
      speedKmh: 0,
      lastUpdated: 'Baru saja (Kemiringan Ekstrim Terdeteksi!)',
    }));
    setJourney((prev) => ({ ...prev, status: 'incident' }));
    createIncident('iot_rollover', `Kemiringan Ekstrim / Rollover Kendaraan (${customAngle}°) Terdeteksi oleh Giroskop MPU6050`, 'Critical');
  }, [createIncident]);

  const simulateMissedCheckInTimeout = useCallback(() => {
    triggerCheckInPrompt();
    // Force timeout immediately after 1.2s for simulation demo
    setTimeout(() => {
      setJourney((prev) => ({ ...prev, isCheckInPending: false, status: 'incident' }));
      handleMissedCheckInEscalation();
    }, 1200);
  }, [triggerCheckInPrompt, handleMissedCheckInEscalation]);

  const resetSensors = useCallback(() => {
    setSensorData(DEFAULT_SENSOR_DATA);
  }, []);

  const setSimulatedSpeed = useCallback((speed: number) => {
    setSensorData((prev) => ({ ...prev, speedKmh: speed }));
  }, []);

  const toggleSimulator = useCallback(() => {
    setIsSimulatorOpen((prev) => !prev);
  }, []);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
    if (activeIncident?.id === id) {
      setActiveIncident((prev) => prev ? { ...prev, status } : null);
    }
  }, [activeIncident]);

  const clearActiveIncident = useCallback(() => {
    setActiveIncident(null);
  }, []);

  return (
    <GuardianContext.Provider
      value={{
        journey,
        startJourney,
        pauseJourney,
        resumeJourney,
        endJourney,
        confirmCheckIn,
        postponeCheckIn,
        triggerCheckInPrompt,
        triggerSilentSOS,
        cancelSilentSOS,
        sensorData,
        isSimulatorOpen,
        toggleSimulator,
        simulateCrashImpact,
        simulateRolloverTilt,
        simulateMissedCheckInTimeout,
        resetSensors,
        setSimulatedSpeed,
        incidents,
        activeIncident,
        createIncident,
        updateIncidentStatus,
        clearActiveIncident,
        broadcastNotificationLogs,
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
}

export function useGuardian() {
  const context = useContext(GuardianContext);
  if (!context) {
    throw new Error('useGuardian must be used within a GuardianProvider');
  }
  return context;
}
