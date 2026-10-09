import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Box, 
  ArrowRight,
  User,
  Flower2,
  Wrench,
  Package,
  Image,
  Flame,
  RotateCw,
  Info
} from 'lucide-react';
import { PRINT_PROFILES_DATABASE } from '../../data/printProfiles.ts';
import { FileTypePreset } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

interface RecommendedProfilesSectionProps {
  currentFileName?: string;
  onApplyRecipe?: (preset: FileTypePreset) => void;
  onLoadSampleModel?: (type: 'cube' | 'overhang' | 'defective') => void;
}

export const RecommendedProfilesSection: React.FC<RecommendedProfilesSectionProps> = ({
  currentFileName = '',
  onApplyRecipe,
  onLoadSampleModel
}) => {
  const { activePrinter, setActiveTab, setInitialChatPrompt, slicerLanguage } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-detect profile from file name if possible
  const detectedProfileId = useMemo(() => {
    if (!currentFileName) return null;
    const lowerName = currentFileName.toLowerCase();
    for (const preset of PRINT_PROFILES_DATABASE) {
      if (preset.recommendedFileKeywords.some(kw => lowerName.includes(kw))) {
        return preset.id;
      }
    }
    return null;
  }, [currentFileName]);

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    detectedProfileId || 'action-figure'
  );

  // Sync selected if detected changes
  React.useEffect(() => {
    if (detectedProfileId) {
      setSelectedProfileId(detectedProfileId);
    }
  }, [detectedProfileId]);

  const activePreset = useMemo(() => {
    return PRINT_PROFILES_DATABASE.find(p => p.id === selectedProfileId) || PRINT_PROFILES_DATABASE[0];
  }, [selectedProfileId]);

  const handleCopySettings = (preset: FileTypePreset) => {
    const text = `
=== PRINTMASTER 3D: PERFIL RECOMENDADO ===
Tipo: ${preset.name_pt} (${preset.name_en})
Impressora Destino: ${activePrinter}

CONFIGURAÇÕES NO BAMBU STUDIO:
• Altura de Camada: ${preset.layerHeight}
• Altura da 1ª Camada: ${preset.initialLayerHeight}
• Perímetros de Parede: ${preset.wallLoops}
• Camadas Superior/Inferior: ${preset.topBottomShells}
• Preenchimento: ${preset.infillDensity} (${preset.infillPattern})
• Velocidade Parede Externa: ${preset.outerWallSpeed}
• Velocidade Parede Interna: ${preset.innerWallSpeed}
• Suporte: ${preset.supportType} (${preset.supportStyle})
• Posição da Costura (Seam): ${preset.seamPosition}
• Aderência à Mesa (Brim): ${preset.brimType}
• Resfriamento: ${preset.coolingProfile}

PARÂMETROS AVANÇADOS:
${preset.specializedParameters.map(p => `• ${p.name_pt}: ${p.value} [${p.slicerPath}]`).join('\n')}

JUSTIFICATIVA TÉCNICA:
${preset.technicalRationale_pt}
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleConsultDiagnostic = (preset: FileTypePreset) => {
    setInitialChatPrompt(
      `Quero fatiar um modelo do tipo "${preset.name_pt}" na minha ${activePrinter}. Pelo perfil recomendado, utilizarei altura de camada ${preset.layerHeight}, ${preset.wallLoops} e preenchimento ${preset.infillDensity} (${preset.infillPattern}). Quais detalhes extras de calibração devo verificar antes de iniciar a impressão?`
    );
    setActiveTab('diagnostics');
  };

  const getProfileIcon = (id: string) => {
    switch (id) {
      case 'action-figure':
        return <User className="w-4 h-4 text-purple-400" />;
      case 'vase-mode':
        return <Flower2 className="w-4 h-4 text-emerald-400" />;
      case 'mechanical-part':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'rapid-box':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'lithophane':
        return <Image className="w-4 h-4 text-pink-400" />;
      case 'tpu-flexible':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Box className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-5 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Perfis de Fatiamento por Tipo de Peça / Arquivo
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Presets ajustados para Action Figures, Vasos Espirais, Peças Mecânicas, Caixas e Materiais Especiais.
          </p>
        </div>

        {detectedProfileId && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil detectado via nome do arquivo: <strong>{currentFileName}</strong></span>
          </div>
        )}
      </div>

      {/* Preset Pills Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {PRINT_PROFILES_DATABASE.map(preset => {
          const isSelected = preset.id === selectedProfileId;
          const isDetected = preset.id === detectedProfileId;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedProfileId(preset.id);
                if (onApplyRecipe) onApplyRecipe(preset);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {isDetected && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-slate-900 animate-pulse" title="Correspondência detectada" />
              )}
              <div className="flex items-center gap-1.5 mb-1">
                {getProfileIcon(preset.id)}
                <span className="text-xs font-bold truncate">
                  {slicerLanguage === 'en' ? preset.name_en.split('&')[0].trim() : preset.name_pt.split('&')[0].trim()}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1">
                {preset.tag_pt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Preset Detail Card */}
      {activePreset && (
        <div className="space-y-4 pt-1 animate-fadeIn">
          {/* Preset Intro Bar */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {activePreset.name_pt}
                </h4>
                <span className="text-xs text-slate-400">({activePreset.name_en})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                  {activePreset.tag_pt}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                {activePreset.shortDesc_pt}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopySettings(activePreset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copiedId === activePreset.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {copiedId === activePreset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Parâmetros</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleConsultDiagnostic(activePreset)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consultar no Chat</span>
              </button>
            </div>
          </div>

          {/* Slicer Settings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Altura de Camada</span>
              <strong className="text-white block font-mono">{activePreset.layerHeight}</strong>
              <span className="text-[10px] text-slate-400 mt-1 block">1ª camada: {activePreset.initialLayerHeight}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Perímetros (Walls)</span>
              <strong className="text-white block font-mono">{activePreset.wallLoops}</strong>
              <span className="text-[10px] text-slate-400 mt-1 block">T/B: {activePreset.topBottomShells}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Preenchimento</span>
              <strong className="text-white block font-mono">{activePreset.infillDensity}</strong>
              <span className="text-[10px] text-blue-300 mt-1 block truncate">{activePreset.infillPattern}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Velocidade Externa</span>
              <strong className="text-white block font-mono">{activePreset.outerWallSpeed}</strong>
              <span className="text-[10px] text-slate-400 mt-1 block">Interna: {activePreset.innerWallSpeed}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Suporte Recomendado</span>
              <strong className="text-white block truncate">{activePreset.supportType}</strong>
              <span className="text-[10px] text-slate-400 mt-1 block truncate">{activePreset.supportStyle}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Costura (Seam) & Brim</span>
              <strong className="text-white block truncate">{activePreset.seamPosition}</strong>
              <span className="text-[10px] text-slate-400 mt-1 block truncate">Brim: {activePreset.brimType}</span>
            </div>
          </div>

          {/* Specialized Bambu Studio Parameters */}
          {activePreset.specializedParameters && activePreset.specializedParameters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Configurações-Chave Específicas do Bambu Studio para este Tipo de Peça:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activePreset.specializedParameters.map((param, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {param.name_pt}
                        {param.highlight && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Crítico
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        {param.value}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Caminho: {param.slicerPath}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {param.rationale_pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dos and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-3.5 rounded-xl space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>O que fazer para garantir o melhor resultado</span>
              </h5>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {activePreset.dosAndDonts.recommended_pt.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/30 p-3.5 rounded-xl space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>O que evitar neste tipo de impressão</span>
              </h5>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {activePreset.dosAndDonts.avoid_pt.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
