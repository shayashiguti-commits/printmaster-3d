import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles,
  X,
  Layers,
  Zap,
  Gauge,
  LifeBuoy,
  Tag,
  Info,
  WifiOff,
  Globe,
  Palette,
  Printer,
  Grid
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { StudioParameter, KnowledgeSource } from '../../types/index.ts';
import { BUNDLED_PARAMETERS, BUNDLED_SOURCES } from '../../data/bundledAtlas.ts';
import { getFormattedSlicerParam, SLICER_LANG_OPTIONS } from '../../lib/themeAndLang.ts';
import { InfillPatternsView } from '../atlas/InfillPatternsView.tsx';
import { PrinterFilamentMatrixView } from '../atlas/PrinterFilamentMatrixView.tsx';
import { TargetedFaqView } from '../atlas/TargetedFaqView.tsx';

export const StudioAtlasPage: React.FC = () => {
  const { 
    setActiveTab, 
    setInitialChatPrompt, 
    activePrinter, 
    slicerVersion, 
    isOfflineDemo,
    slicerLanguage,
    setSlicerLanguage,
    setIsThemeModalOpen
  } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'params' | 'infill' | 'printers' | 'faq'>('params');
  const [parameters, setParameters] = useState<StudioParameter[]>([]);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedParam, setSelectedParam] = useState<StudioParameter | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Todos os Parâmetros' },
    { id: 'Quality', label: 'Qualidade (Quality)' },
    { id: 'Strength', label: 'Resistência (Strength)' },
    { id: 'Speed', label: 'Velocidade (Speed)' },
    { id: 'Support', label: 'Suportes (Support)' },
    { id: 'Others', label: 'Outros / Adesão' },
    { id: 'Filament', label: 'Filamento' },
    { id: 'Printer', label: 'Impressora & Hardware' },
  ];

  const filterBundledParameters = (query: string, cat: string): StudioParameter[] => {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    return BUNDLED_PARAMETERS.filter(p => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (!q) return true;
      const pt = (p.name_pt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const en = (p.name_en || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const key = (p.config_key || '').toLowerCase();
      const desc = (p.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return pt.includes(q) || en.includes(q) || key.includes(q) || desc.includes(q);
    });
  };

  const fetchParameters = async () => {
    setLoading(true);

    // If offline demo mode is active, use bundled parameters immediately
    if (isOfflineDemo) {
      const results = filterBundledParameters(searchQuery, selectedCategory);
      setParameters(results);
      setSources(BUNDLED_SOURCES);
      setLoading(false);
      return;
    }

    try {
      const q = encodeURIComponent(searchQuery);
      const cat = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const res = await fetch(`/api/studio/parameters?query=${q}${cat}`);
      const data = await res.json();
      if (data.success && data.parameters) {
        setParameters(data.parameters);
      } else {
        // Fallback to bundled
        setParameters(filterBundledParameters(searchQuery, selectedCategory));
      }
    } catch (err) {
      console.warn('Network fetch failed, falling back to bundled atlas data', err);
      setParameters(filterBundledParameters(searchQuery, selectedCategory));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, [selectedCategory, isOfflineDemo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParameters();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, isOfflineDemo]);

  useEffect(() => {
    if (isOfflineDemo) {
      setSources(BUNDLED_SOURCES);
      return;
    }
    fetch('/api/kb/sources')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSources(d.sources);
      })
      .catch(() => setSources(BUNDLED_SOURCES));
  }, [isOfflineDemo]);

  const handleAskAIAboutField = (param: StudioParameter) => {
    if (isOfflineDemo) {
      alert(`[Modo Demonstração Offline]\nO diagnóstico por IA generativa em nuvem está desativado no modo offline.\n\nDescrição técnica rápida do campo "${param.name_pt}":\n${param.description}\n\nLocalização no Studio: ${param.menu_path || 'A confirmar'}\nRecomendação: ${param.notes || 'Consulte o manual da sua máquina.'}`);
      return;
    }
    setInitialChatPrompt(`Gostaria de entender a fundo o parâmetro "${param.name_pt}" (${param.name_en}, config_key: ${param.config_key || 'n/a'}). Como ele afeta minha ${activePrinter} e quais os cuidados ao alterar?`);
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Atlas Técnico & Base de Conhecimento</h1>
            {isOfflineDemo && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                <span>Base Local Embutida</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Dicionário auditado de configurações, atlas de 22 preenchimentos, isolamento fail-closed por impressora e 33 diagnósticos práticos.
          </p>
        </div>

        {activeSubTab === 'params' && (
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por termo PT, EN ou chave (ex: wall loops, seam)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveSubTab('params')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'params'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dicionário de Parâmetros ({parameters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('infill')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'infill'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
          }`}
        >
          <Grid className="w-4 h-4 text-emerald-400" />
          <span>Atlas de Preenchimentos (22 Padrões)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('printers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'printers'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
          }`}
        >
          <Printer className="w-4 h-4 text-indigo-400" />
          <span>Impressoras & Filamentos (Fail-Closed)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('faq')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'faq'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>FAQ Técnico & Diagnósticos (33 Casos)</span>
        </button>
      </div>

      {/* Conditional Sub-View Rendering */}
      {activeSubTab === 'infill' && <InfillPatternsView />}
      {activeSubTab === 'printers' && <PrinterFilamentMatrixView />}
      {activeSubTab === 'faq' && <TargetedFaqView />}

      {activeSubTab === 'params' && (
        <div className="space-y-6">
          {/* Slicer Language & Appearance Settings Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">Terminologia do seu Fatiador:</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">(ajuste para bater com o seu Bambu Studio)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
              {SLICER_LANG_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSlicerLanguage(opt.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    slicerLanguage === opt.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.badge} - {opt.id === 'pt' ? 'Português' : opt.id === 'en' ? 'Inglês' : 'Bilíngue'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors ml-auto sm:ml-0"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Configurar Temas & Aparência</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs">
            Carregando catálogo de parâmetros...
          </div>
        ) : parameters.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Nenhum parâmetro encontrado para o filtro "{searchQuery}".</p>
          </div>
        ) : (
          parameters.map(param => {
            const formatted = getFormattedSlicerParam(param, slicerLanguage);
            return (
              <div
                key={param.id}
                onClick={() => setSelectedParam(param)}
                className="group bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {param.category}
                    </span>
                    {param.menu_path_validated ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verificado</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400/90 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>A confirmar</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {formatted.primaryTitle}
                  </h3>
                  {formatted.secondaryTitle ? (
                    <p className="text-[11px] text-slate-400 font-mono mb-2">
                      {formatted.secondaryTitle} {param.config_key && `| [${param.config_key}]`}
                    </p>
                  ) : (
                    param.config_key && (
                      <p className="text-[11px] text-slate-400 font-mono mb-2">
                        [{param.config_key}]
                      </p>
                    )
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {param.description}
                  </p>
                </div>

                {/* Menu path preview */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">
                    {param.menu_path ? param.menu_path : 'Localização a confirmar'}
                  </span>
                  <span className="text-blue-400 font-medium group-hover:underline">
                    Ver detalhes
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )}

  {/* Parameter Details Modal / Drawer */}
      {selectedParam && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedParam.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    selectedParam.menu_path_validated 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {selectedParam.menu_path_validated ? 'Localização Verificada' : 'Localização a confirmar'}
                  </span>

                  {/* Modal Slicer Language Quick Switcher */}
                  <div className="inline-flex items-center gap-1 bg-slate-850 p-0.5 rounded-md border border-slate-700/80 text-[10px]">
                    <span className="text-slate-400 px-1">Fatiador:</span>
                    {(['pt', 'en', 'bilingual'] as const).map(l => (
                      <button
                        key={l}
                        onClick={() => setSlicerLanguage(l)}
                        className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                          slicerLanguage === l 
                            ? 'bg-emerald-600 text-white font-bold' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const mFormat = getFormattedSlicerParam(selectedParam, slicerLanguage);
                  return (
                    <>
                      <h2 className="text-lg font-bold text-white">{mFormat.primaryTitle}</h2>
                      {mFormat.secondaryTitle && (
                        <p className="text-xs text-slate-400 font-mono">
                          {mFormat.secondaryTitle} {selectedParam.config_key && `• Chave interna: ${selectedParam.config_key}`}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setSelectedParam(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 leading-relaxed">
              {selectedParam.description}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Unidade / Tipo</span>
                <strong className="text-white font-mono">{selectedParam.unit || 'n/a'} ({selectedParam.control_type})</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Versão Suportada</span>
                <strong className="text-amber-400 font-mono">{selectedParam.slicer_version}</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Nível de Risco</span>
                <strong className={`capitalize ${selectedParam.risk_level === 'low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedParam.risk_level === 'low' ? 'Baixo' : 'Médio'}
                </strong>
              </div>
            </div>

            {/* Menu Location */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Onde encontrar no Bambu Studio:</span>
              <p className="text-xs text-white font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                {selectedParam.menu_path_validated 
                  ? selectedParam.menu_path 
                  : 'Localização depende do modo Básico/Avançado e da versão exata instalada.'}
              </p>
            </div>

            {/* Notes / Caveats */}
            {selectedParam.notes && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                <strong>Recomendação técnica: </strong>{selectedParam.notes}
              </div>
            )}

            {/* Sources & Citations */}
            <div className="text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-400">Fontes técnicas de referência:</span>
              <ul className="list-disc list-inside text-slate-400 text-[10px]">
                {selectedParam.source_ids?.map(sid => {
                  const s = sources.find(x => x.id === sid);
                  return (
                    <li key={sid}>
                      {s ? `${s.title} (${s.authority})` : sid}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedParam(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => handleAskAIAboutField(selectedParam)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Perguntar à IA sobre este campo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
