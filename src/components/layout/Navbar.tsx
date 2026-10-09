import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Printer, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  HardDrive, 
  WifiOff, 
  Wifi, 
  AlertCircle,
  Palette,
  Globe,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { UserExperienceLevel } from '../../types/index.ts';
import { THEME_OPTIONS, SLICER_LANG_OPTIONS, UI_STRINGS } from '../../lib/themeAndLang.ts';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { 
    activePrinter, 
    setActivePrinter, 
    userLevel, 
    setUserLevel, 
    theme, 
    setTheme,
    toggleTheme, 
    slicerLanguage,
    setSlicerLanguage,
    interfaceLanguage,
    setIsThemeModalOpen,
    slicerVersion, 
    setSlicerVersion,
    storageNotice,
    setActiveTab,
    setInitialChatPrompt,
    isOfflineDemo,
    toggleOfflineDemo
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const t = UI_STRINGS[interfaceLanguage] || UI_STRINGS.pt;

  const currentThemeObj = THEME_OPTIONS.find(o => o.id === theme) || THEME_OPTIONS[0];
  const currentSlicerLangObj = SLICER_LANG_OPTIONS.find(o => o.id === slicerLanguage) || SLICER_LANG_OPTIONS[0];

  const printers = [
    'Bambu Lab P1S',
    'Bambu Lab X1 Carbon',
    'Bambu Lab A1',
    'Bambu Lab A1 mini',
    'Bambu Lab A2L',
    'Bambu Lab H2S',
    'Outra FDM Genérica'
  ];

  const levels: UserExperienceLevel[] = ['Iniciante', 'Intermediário', 'Especialista'];

  const cycleSlicerLanguage = () => {
    if (slicerLanguage === 'pt') setSlicerLanguage('en');
    else if (slicerLanguage === 'en') setSlicerLanguage('bilingual');
    else setSlicerLanguage('pt');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setInitialChatPrompt(searchVal.trim());
    setActiveTab('diagnostics');
    setSearchVal('');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs">
        {/* Slicer Language Quick Switcher */}
        <button
          onClick={cycleSlicerLanguage}
          title={`Idioma do Fatiador: ${currentSlicerLangObj.name_pt}. Clique para alternar (PT-BR -> EN -> Bilíngue).`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 transition-all group"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[10px] text-slate-400 hidden xl:inline">Fatiador:</span>
          <span className="text-[11px] font-mono font-bold text-emerald-300 group-hover:text-emerald-200">
            {currentSlicerLangObj.badge}
          </span>
        </button>

        {/* Theme & Language Preferences Button */}
        <button
          onClick={() => setIsThemeModalOpen(true)}
          title="Abrir painel de Temas e Idioma do Fatiador"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 transition-all"
        >
          <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: currentThemeObj.accentColor }} />
          <span className="text-[11px] font-medium hidden md:inline truncate max-w-[110px]">
            {currentThemeObj.tag}
          </span>
        </button>

        {/* Active Printer Global Selector */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-lg">
          <Printer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-[11px] text-slate-400 hidden lg:inline">Máquina:</span>
          <select
            value={activePrinter}
            onChange={e => setActivePrinter(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            {printers.map(p => (
              <option key={p} value={p} className="bg-slate-900 text-slate-200">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Studio Version Badge */}
        <div className="hidden 2xl:flex items-center gap-1 bg-slate-800/60 border border-slate-700/60 px-2 py-1.5 rounded-lg text-slate-300">
          <span className="text-[10px] text-slate-400">Studio:</span>
          <span className="text-[11px] font-mono text-amber-400 font-semibold">{slicerVersion}</span>
        </div>

        {/* Offline Demo Mode Toggle */}
        <button
          onClick={toggleOfflineDemo}
          title={isOfflineDemo ? 'Clique para retornar ao modo online' : 'Ativar modo de demonstração 100% offline'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            isOfflineDemo
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-xs'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          {isOfflineDemo ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Demo Offline</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Online</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
