import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { ThemeAndLanguageModal } from './components/layout/ThemeAndLanguageModal.tsx';
import { DashboardPage } from './features/dashboard/DashboardPage.tsx';
import { DiagnosticsPage } from './features/diagnostics/DiagnosticsPage.tsx';
import { StudioAtlasPage } from './features/studio-atlas/StudioAtlasPage.tsx';
import { PreparationPage } from './features/preparation/PreparationPage.tsx';
import { EquipmentPage } from './features/equipment/EquipmentPage.tsx';
import { CalibrationPage } from './features/calibration/CalibrationPage.tsx';
import { HistoryPage } from './features/history/HistoryPage.tsx';
import { AdminPage } from './features/admin/AdminPage.tsx';
import { PrivacyPage } from './features/privacy/PrivacyPage.tsx';

function MainLayout() {
  const { activeTab, isOfflineDemo, toggleOfflineDemo, theme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'studio-light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} flex font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-150`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Offline Demo Mode Notification Banner */}
        {isOfflineDemo && (
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>
                <strong className="text-amber-300 font-semibold">Modo Demonstração Offline Ativo:</strong> Atlas Bambu Studio e visualizador 3D operando 100% com dados e modelos embutidos localmente.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-amber-300/70 hidden md:inline">
                (Limitação: IA em nuvem e persistência desativadas)
              </span>
              <button
                onClick={toggleOfflineDemo}
                className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] border border-amber-500/40 transition-colors"
              >
                Voltar ao Modo Online
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'diagnostics' && <DiagnosticsPage />}
          {activeTab === 'atlas' && <StudioAtlasPage />}
          {activeTab === 'preparation' && <PreparationPage />}
          {activeTab === 'equipment' && <EquipmentPage />}
          {activeTab === 'calibration' && <CalibrationPage />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'admin' && <AdminPage />}
          {activeTab === 'privacy' && <PrivacyPage />}
        </main>
      </div>

      {/* Theme and Slicer Language Modal */}
      <ThemeAndLanguageModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
