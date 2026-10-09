import React from 'react';
import { 
  Activity, 
  BookOpen, 
  Box, 
  Sliders, 
  History, 
  Shield, 
  Settings, 
  Printer, 
  FileText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Palette,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { SLICER_LANG_OPTIONS, THEME_OPTIONS } from '../../lib/themeAndLang.ts';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, setIsThemeModalOpen, slicerLanguage, theme } = useApp();

  const currentTheme = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];
  const currentLang = SLICER_LANG_OPTIONS.find(l => l.id === slicerLanguage) || SLICER_LANG_OPTIONS[0];

  const navItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: Activity, badge: null },
    { id: 'diagnostics', label: 'Diagnosticar Falha', icon: AlertTriangle, badge: 'IA' },
    { id: 'atlas', label: 'Atlas Bambu Studio', icon: BookOpen, badge: 'v1.9+' },
    { id: 'preparation', label: 'Preparar Modelo 3D', icon: Box, badge: '3D STL' },
    { id: 'equipment', label: 'Equipamentos & Materiais', icon: Printer, badge: null },
    { id: 'calibration', label: 'Rotinas de Calibração', icon: Sliders, badge: '14' },
    { id: 'history', label: 'Histórico de Casos', icon: History, badge: null },
    { id: 'admin', label: 'Painel Admin & Auditoria', icon: Shield, badge: 'QA' },
    { id: 'privacy', label: 'Segurança & Termos', icon: FileText, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-200
        transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('dashboard'); onClose(); }}>
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-md shadow-blue-900/30">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">PrintMaster</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">3D</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Engenharia Aditiva & Slicer</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Módulos Principais
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-blue-700/80 text-blue-100' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Slicer & Theme Settings Button */}
          <div className="pt-3 border-t border-slate-800/80 mt-2">
            <button
              onClick={() => {
                setIsThemeModalOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Tema & Idioma Fatiador</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                {currentLang.badge}
              </span>
            </button>
          </div>
        </nav>

        {/* Safety & Protocol Banner */}
        <div className="p-3 m-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Protocolo de Segurança</span>
          </div>
          <p className="text-[10px] text-amber-200/70 leading-relaxed">
            Nunca execute comandos elétricos invasivos sem suporte oficial. Em caso de odor de fumaça, desligue a máquina.
          </p>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Motor Especialista Ativo</span>
          </div>
          <span className="text-[10px] text-slate-300">v1.0.0</span>
        </div>
      </aside>
    </>
  );
};
