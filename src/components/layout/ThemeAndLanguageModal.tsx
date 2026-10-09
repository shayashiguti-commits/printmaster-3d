import React from 'react';
import { 
  X, 
  Palette, 
  Globe, 
  Check, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Info,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  THEME_OPTIONS, 
  SLICER_LANG_OPTIONS, 
  getFormattedSlicerParam, 
  UI_STRINGS 
} from '../../lib/themeAndLang.ts';
import { AppTheme, SlicerLanguage, InterfaceLanguage } from '../../types/index.ts';

export const ThemeAndLanguageModal: React.FC = () => {
  const { 
    isThemeModalOpen, 
    setIsThemeModalOpen, 
    theme, 
    setTheme, 
    slicerLanguage, 
    setSlicerLanguage,
    interfaceLanguage,
    setInterfaceLanguage
  } = useApp();

  if (!isThemeModalOpen) return null;

  const t = UI_STRINGS[interfaceLanguage] || UI_STRINGS.pt;

  // Sample parameter for live preview
  const sampleParam = {
    name_pt: 'Wall loops / Linhas de parede',
    name_en: 'Wall loops',
    config_key: 'wall_loops',
    description: 'Quantidade de perímetros externos verticais. Aumenta a rigidez e previne vazamento de luz/preenchimento.',
  };

  const previewFormatted = getFormattedSlicerParam(sampleParam, slicerLanguage);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t.themeAndLangModalTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.themeAndLangModalDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          
          {/* SECTION 1: Slicer Language / Terminology */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.slicerSectionTitle}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                {slicerLanguage === 'pt' ? 'Atualmente: Bambu Studio PT' : slicerLanguage === 'en' ? 'Atualmente: Bambu Studio EN' : 'Atualmente: Bilíngue PT+EN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.slicerSectionDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SLICER_LANG_OPTIONS.map(opt => {
                const isSelected = slicerLanguage === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSlicerLanguage(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-xs shadow-emerald-900/20 ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-bold">
                          {opt.badge}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mb-1">
                        {interfaceLanguage === 'en' ? opt.name_en : opt.name_pt}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {interfaceLanguage === 'en' ? opt.desc_en : opt.desc_pt}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/60 text-[10px] font-mono text-slate-400 truncate">
                      {opt.example_pt}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Preview Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    {t.quickPreview}
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span>{previewFormatted.primaryTitle}</span>
                    {previewFormatted.secondaryTitle && (
                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                        ({previewFormatted.secondaryTitle})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono shrink-0 border border-slate-700">
                key: wall_loops
              </span>
            </div>
          </div>

          {/* SECTION 2: Visual Themes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.themeSectionTitle}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                5 temas disponíveis
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.themeSectionDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_OPTIONS.map(opt => {
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-md'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    style={{
                      backgroundColor: opt.isLight ? '#f8fafc' : '#0f172a',
                      color: opt.isLight ? '#0f172a' : '#f8fafc',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                            style={{ backgroundColor: opt.accentColor }}
                          />
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            opt.isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {opt.tag}
                          </span>
                        </div>
                        {isSelected && (
                          <div 
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: opt.accentColor }}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className={`text-xs font-bold mb-1 ${opt.isLight ? 'text-slate-900' : 'text-white'}`}>
                        {interfaceLanguage === 'en' ? opt.name_en : opt.name_pt}
                      </div>

                      <p className={`text-[11px] leading-snug ${opt.isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {interfaceLanguage === 'en' ? opt.desc_en : opt.desc_pt}
                      </p>
                    </div>

                    {/* Color Swatch Bar */}
                    <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-3 h-3 rounded-sm border border-black/20" 
                          style={{ backgroundColor: opt.bgHex }} 
                          title="Fundo"
                        />
                        <span 
                          className="w-3 h-3 rounded-sm border border-black/20" 
                          style={{ backgroundColor: opt.surfaceHex }} 
                          title="Superfície"
                        />
                        <span 
                          className="w-3 h-3 rounded-sm border border-black/20" 
                          style={{ backgroundColor: opt.accentColor }} 
                          title="Destaque"
                        />
                      </div>
                      <span className={`font-mono ${opt.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {opt.accentColor}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: General UI Language */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.appLangSectionTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInterfaceLanguage('pt')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  interfaceLanguage === 'pt'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>🇧🇷 Português (Brasil)</span>
                {interfaceLanguage === 'pt' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setInterfaceLanguage('en')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  interfaceLanguage === 'en'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>🇺🇸 English (US)</span>
                {interfaceLanguage === 'en' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.appliedNotice}</span>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
