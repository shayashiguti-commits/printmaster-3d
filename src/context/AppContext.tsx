import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserEquipment, UserExperienceLevel, AppTheme, SlicerLanguage, InterfaceLanguage } from '../types/index.ts';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userLevel: UserExperienceLevel;
  setUserLevel: (level: UserExperienceLevel) => void;
  activePrinter: string;
  setActivePrinter: (printer: string) => void;
  slicerVersion: string;
  setSlicerVersion: (ver: string) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  slicerLanguage: SlicerLanguage;
  setSlicerLanguage: (lang: SlicerLanguage) => void;
  interfaceLanguage: InterfaceLanguage;
  setInterfaceLanguage: (lang: InterfaceLanguage) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  myEquipment: UserEquipment[];
  refreshEquipment: () => Promise<void>;
  storageNotice: string;
  searchFilter: string;
  setSearchFilter: (q: string) => void;
  initialChatPrompt: string | null;
  setInitialChatPrompt: (prompt: string | null) => void;
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  isOfflineDemo: boolean;
  toggleOfflineDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(() => {
    return localStorage.getItem('pm3d_offline_mode') === 'true';
  });
  const [userLevel, setUserLevelState] = useState<UserExperienceLevel>(() => {
    return (localStorage.getItem('pm3d_user_level') as UserExperienceLevel) || 'Iniciante';
  });
  const [activePrinter, setActivePrinterState] = useState<string>(() => {
    return localStorage.getItem('pm3d_active_printer') || 'Bambu Lab P1S';
  });
  const [slicerVersion, setSlicerVersion] = useState<string>('v01.09+');
  
  // Theme state: default to 'bambu-dark'
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('pm3d_theme');
    if (saved === 'dark') return 'bambu-dark';
    if (saved === 'light') return 'studio-light';
    if (saved && ['bambu-dark', 'orca-dark', 'slate-dark', 'studio-light', 'high-contrast'].includes(saved)) {
      return saved as AppTheme;
    }
    return 'bambu-dark';
  });

  // Slicer terminology language: default to 'pt'
  const [slicerLanguage, setSlicerLanguageState] = useState<SlicerLanguage>(() => {
    const saved = localStorage.getItem('pm3d_slicer_lang');
    if (saved && ['pt', 'en', 'bilingual'].includes(saved)) {
      return saved as SlicerLanguage;
    }
    return 'pt';
  });

  // Interface language: default to 'pt'
  const [interfaceLanguage, setInterfaceLanguageState] = useState<InterfaceLanguage>(() => {
    const saved = localStorage.getItem('pm3d_ui_lang');
    if (saved && ['pt', 'en'].includes(saved)) {
      return saved as InterfaceLanguage;
    }
    return 'pt';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [myEquipment, setMyEquipment] = useState<UserEquipment[]>([]);
  const [storageNotice, setStorageNotice] = useState<string>('Demonstração Local Persistente');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const setUserLevel = (level: UserExperienceLevel) => {
    setUserLevelState(level);
    localStorage.setItem('pm3d_user_level', level);
  };

  const setActivePrinter = (printer: string) => {
    setActivePrinterState(printer);
    localStorage.setItem('pm3d_active_printer', printer);
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('pm3d_theme', newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const next: AppTheme = prev === 'studio-light' ? 'bambu-dark' : 'studio-light';
      localStorage.setItem('pm3d_theme', next);
      return next;
    });
  };

  const setSlicerLanguage = (lang: SlicerLanguage) => {
    setSlicerLanguageState(lang);
    localStorage.setItem('pm3d_slicer_lang', lang);
  };

  const setInterfaceLanguage = (lang: InterfaceLanguage) => {
    setInterfaceLanguageState(lang);
    localStorage.setItem('pm3d_ui_lang', lang);
  };

  const toggleOfflineDemo = () => {
    setIsOfflineDemo(prev => {
      const next = !prev;
      localStorage.setItem('pm3d_offline_mode', String(next));
      return next;
    });
  };

  const refreshEquipment = async () => {
    try {
      const res = await fetch('/api/equipment');
      const data = await res.json();
      if (data.success && data.equipment) {
        setMyEquipment(data.equipment);
      }
    } catch (e) {
      console.warn('Could not fetch equipment', e);
    }
  };

  useEffect(() => {
    refreshEquipment();
    fetch('/api/kb/status')
      .then(res => res.json())
      .then(data => {
        if (data.storageMode) {
          setStorageNotice('Persistência em Servidor (data/runtime_db.json)');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userLevel,
        setUserLevel,
        activePrinter,
        setActivePrinter,
        slicerVersion,
        setSlicerVersion,
        theme,
        setTheme,
        toggleTheme,
        slicerLanguage,
        setSlicerLanguage,
        interfaceLanguage,
        setInterfaceLanguage,
        isThemeModalOpen,
        setIsThemeModalOpen,
        myEquipment,
        refreshEquipment,
        storageNotice,
        searchFilter,
        setSearchFilter,
        initialChatPrompt,
        setInitialChatPrompt,
        activeCaseId,
        setActiveCaseId,
        isOfflineDemo,
        toggleOfflineDemo,
      }}
    >
      <div className={`theme-${theme} ${theme === 'studio-light' ? 'light' : 'dark'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
