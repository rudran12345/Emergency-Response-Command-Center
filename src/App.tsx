import React, { useState, useEffect } from 'react';
import {
  Incident,
  ResponseTeam,
  Alert,
  DashboardStats,
  SystemSettings,
  IncidentStatus,
  TeamStatus,
  EmergencyType,
  SeverityLevel,
} from './models/emergency.types';
import { emergencyDataService } from './services/emergency-data.service';
import { settingsService } from './services/settings.service';
import { soundService } from './services/sound.service';
import { LoginComponent } from './components/LoginComponent';
import { NavbarComponent } from './components/NavbarComponent';
import { SidebarComponent, NavigationTab } from './components/SidebarComponent';
import { DashboardComponent } from './components/DashboardComponent';
import { IncidentsComponent } from './components/IncidentsComponent';
import { ResponseTeamsComponent } from './components/ResponseTeamsComponent';
import { AlertsComponent } from './components/AlertsComponent';
import { AnalyticsComponent } from './components/AnalyticsComponent';
import { SettingsComponent } from './components/SettingsComponent';
import { IncidentModalComponent } from './components/IncidentModalComponent';
import { LogIncidentModal } from './components/LogIncidentModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data streams
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [teams, setTeams] = useState<ResponseTeam[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<DashboardStats>(emergencyDataService.getStats());
  const [settings, setSettings] = useState<SystemSettings>(settingsService.getSettings());

  // Modals
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    // Check remembered user
    const remembered = localStorage.getItem('ercc_logged_in_user');
    if (remembered) {
      setCurrentUser('Commander Admin');
    }

    const unsubIncidents = emergencyDataService.subscribeIncidents(setIncidents);
    const unsubTeams = emergencyDataService.subscribeTeams(setTeams);
    const unsubAlerts = emergencyDataService.subscribeAlerts(setAlerts);
    const unsubStats = emergencyDataService.subscribeStats(setStats);
    const unsubSettings = settingsService.subscribe(setSettings);

    return () => {
      unsubIncidents();
      unsubTeams();
      unsubAlerts();
      unsubStats();
      unsubSettings();
    };
  }, []);

  const handleLoginSuccess = (name: string) => {
    setCurrentUser(name);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('ercc_logged_in_user');
    setCurrentUser(null);
    soundService.playBeep(350, 'sawtooth', 0.1);
  };

  const handleSimulateQuickIncident = () => {
    const locations = ['Anna Nagar', 'Guindy', 'Adyar', 'T Nagar', 'Velachery', 'Central Zone', 'Marina Beach', 'Koyambedu'];
    const types: EmergencyType[] = ['Fire', 'Medical', 'Accident', 'Flood', 'Crime'];
    const severities: SeverityLevel[] = ['Critical', 'High', 'Medium'];

    const chosenLocation = locations[Math.floor(Math.random() * locations.length)];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const chosenSev = severities[Math.floor(Math.random() * severities.length)];

    const availableTeam = teams.find((t) => t.status === 'AVAILABLE');
    const teamName = availableTeam ? availableTeam.name : 'Fire Unit 04';

    const newInc = emergencyDataService.addIncident({
      type: chosenType,
      location: chosenLocation,
      severity: chosenSev,
      assignedTeam: teamName,
      status: 'Active',
      coordinates: {
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 70) + 15,
      },
      description: `Live simulated telemetry alert: Sudden ${chosenType.toLowerCase()} event verified at ${chosenLocation}. Emergency squad rolling.`,
      reportedBy: 'Metropolis Automated Sensor Network',
      casualties: chosenSev === 'Critical' ? 1 : 0,
      priorityScore: chosenSev === 'Critical' ? 95 : 75,
    });

    setSelectedIncident(newInc);
  };

  const handleLogNewIncident = (data: {
    type: EmergencyType;
    location: string;
    severity: SeverityLevel;
    assignedTeam: string;
    status: 'Active';
    coordinates: { x: number; y: number };
    description: string;
    reportedBy: string;
    casualties: number;
    priorityScore: number;
  }) => {
    const newInc = emergencyDataService.addIncident(data);
    setSelectedIncident(newInc);
  };

  const handleUpdateIncidentStatus = (id: string, status: IncidentStatus) => {
    emergencyDataService.updateIncidentStatus(id, status);
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status });
    }
  };

  const handleAssignTeamToIncident = (incidentId: string, teamName: string) => {
    emergencyDataService.assignTeamToIncident(incidentId, teamName);
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident({ ...selectedIncident, assignedTeam: teamName, status: 'Responding' });
    }
  };

  const handleUpdateTeamStatus = (teamId: string, status: TeamStatus, assignment?: string) => {
    emergencyDataService.updateTeamStatus(teamId, status, assignment);
  };

  const unreadAlertsCount = alerts.filter((a) => a.status === 'unread').length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;

  // 1. If not logged in, render the futuristic login page
  if (!currentUser) {
    return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. If logged in, render the command center
  return (
    <div
      className={`min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 ${
        settings.compactMode ? 'text-xs' : 'text-sm'
      }`}
    >
      {/* Top Fixed Command Header */}
      <NavbarComponent
        operatorName={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        alerts={alerts}
        onDismissAlert={(id) => emergencyDataService.dismissAlert(id)}
        onMarkAllAlertsRead={() => emergencyDataService.markAllAlertsAsRead()}
        onNavigateToAlerts={() => setCurrentTab('alerts')}
        onSimulateIncident={handleSimulateQuickIncident}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <SidebarComponent
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          unreadAlertsCount={unreadAlertsCount}
          activeIncidentsCount={activeIncidentsCount}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardComponent
              stats={stats}
              incidents={incidents}
              teams={teams}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onNavigateToIncidents={() => setCurrentTab('incidents')}
              onNavigateToTeams={() => setCurrentTab('teams')}
              onNavigateToAlerts={() => setCurrentTab('alerts')}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentsComponent
              incidents={incidents}
              teams={teams}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onAddNewIncident={() => setShowLogModal(true)}
            />
          )}

          {currentTab === 'teams' && (
            <ResponseTeamsComponent
              teams={teams}
              onUpdateTeamStatus={handleUpdateTeamStatus}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsComponent
              alerts={alerts}
              onMarkAsRead={(id) => emergencyDataService.markAlertAsRead(id)}
              onDismiss={(id) => emergencyDataService.dismissAlert(id)}
              onMarkAllAsRead={() => emergencyDataService.markAllAlertsAsRead()}
              onClearAll={() => emergencyDataService.clearAllAlerts()}
              onSimulateAlert={handleSimulateQuickIncident}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsComponent incidents={incidents} />
          )}

          {currentTab === 'settings' && <SettingsComponent />}
        </main>
      </div>

      {/* Modal 1: Incident Detail & Dispatch */}
      {selectedIncident && (
        <IncidentModalComponent
          incident={selectedIncident}
          teams={teams}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleUpdateIncidentStatus}
          onAssignTeam={handleAssignTeamToIncident}
        />
      )}

      {/* Modal 2: Log New Incident */}
      {showLogModal && (
        <LogIncidentModal
          teams={teams}
          onClose={() => setShowLogModal(false)}
          onSubmit={handleLogNewIncident}
        />
      )}
    </div>
  );
}
