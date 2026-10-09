import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Thermometer, 
  Wind, 
  Sparkles,
  Info,
  Sliders,
  ExternalLink,
  Lock
} from 'lucide-react';
import { 
  PRINTER_SPECS_V3, 
  FILAMENT_CATALOG_V3, 
  getFilteredFilamentsForPrinter 
} from '../../data/knowledgeBaseV3.ts';
import { PrinterSpecV3, FilamentCatalogItemV3, PrinterFilamentCompatibilityV3 } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const PrinterFilamentMatrixView: React.FC = () => {
  const { activePrinter, setActivePrinter, setActiveTab, setInitialChatPrompt } = useApp();

  // Selected printer model
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const match = PRINTER_SPECS_V3.find(p => activePrinter.toLowerCase().includes(p.model.toLowerCase()));
    return match ? match.model : 'P1S';
  });

  // Hardware modifiers
  const [nozzleDiameter, setNozzleDiameter] = useState<number>(0.4);
  const [nozzleMaterial, setNozzleMaterial] = useState<string>('aco_endurecido');
  const [feedSystem, setFeedSystem] = useState<string>('AMS');

  const selectedPrinterSpec: PrinterSpecV3 | undefined = useMemo(() => {
    return PRINTER_SPECS_V3.find(p => p.model === selectedModel) || PRINTER_SPECS_V3[4];
  }, [selectedModel]);

  // Compute filtered list using fail-closed logic
  const filteringResult = useMemo(() => {
    return getFilteredFilamentsForPrinter(selectedModel, {
      nozzleDiameter,
      nozzleMaterial,
      feedSystem,
    });
  }, [selectedModel, nozzleDiameter, nozzleMaterial, feedSystem]);

  const filamentCatalogMap = useMemo(() => {
    const map = new Map<string, FilamentCatalogItemV3>();
    for (const f of FILAMENT_CATALOG_V3) {
      map.set(f.name.toLowerCase(), f);
    }
    return map;
  }, []);

  const compatibleItems = useMemo(() => {
    return filteringResult.items.filter(
      item => item.effective_status === 'ideal' || item.effective_status === 'conditional'
    );
  }, [filteringResult]);

  const blockedItems = useMemo(() => {
    return filteringResult.items.filter(
      item => item.effective_status === 'blocked' || item.effective_status === 'not_recommended'
    );
  }, [filteringResult]);

  const handleSelectPrinter = (model: string) => {
    setSelectedModel(model);
    const spec = PRINTER_SPECS_V3.find(p => p.model === model);
    if (spec) {
      if (spec.default_nozzle_material.includes('inoxidavel')) {
        setNozzleMaterial('aco_inoxidavel');
      } else {
        setNozzleMaterial('aco_endurecido');
      }
    }
  };

  const handleConsultDiagnostic = (filamentKey: string, reason?: string) => {
    setInitialChatPrompt(
      `Estou configurando o filamento "${filamentKey}" na minha Bambu Lab ${selectedModel} com bico ${nozzleDiameter}mm (${nozzleMaterial === 'aco_endurecido' ? 'Aço Endurecido' : 'Aço Inox'}) e alimentação via ${feedSystem}. ${
        reason ? `Aviso de compatibilidade: ${reason}. ` : ''
      }Quais parâmetros de temperatura, velocidade e adesão devo aplicar no Bambu Studio?`
    );
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-6">
      {/* Fail-Closed Policy Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
            <Lock className="w-4 h-4" />
            <span>Matriz de Compatibilidade Rígida (Isolamento Fail-Closed)</span>
          </div>
          <p className="text-xs text-slate-300">
            Cada impressora Bambu Lab possui limites térmicos, de câmara, de tração e de bico estritamente isolados. Materiais não validados ou de alta exigência térmica em câmaras abertas são automaticamente bloqueados para evitar danos ao equipamento e entupimentos na extrusora.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Impressoras Cadastradas:</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30">
            {PRINTER_SPECS_V3.length} Modelos Bambu Lab
          </span>
        </div>
      </div>

      {/* Printer Selector Ribbon */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Printer className="w-4 h-4 text-blue-400" />
          <span>Selecione o Modelo da Impressora Bambu Lab:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRINTER_SPECS_V3.map(p => {
            const isSelected = p.model === selectedModel;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPrinter(p.model)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 text-white'
                    : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold truncate">{p.model}</span>
                  {p.has_active_chamber ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Ativa
                    </span>
                  ) : p.chamber_type.includes('fechada') ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Fechada
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      Aberta
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Bico: {p.max_hotend_C}°C</span>
                  <span>Mesa: {p.max_bed_C ?? 'N/A'}°C</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hardware Modifiers Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Nozzle Diameter */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Diâmetro do Bico Instalado:
          </label>
          <div className="flex items-center gap-1.5">
            {[0.2, 0.4, 0.6, 0.8].map(d => (
              <button
                key={d}
                onClick={() => setNozzleDiameter(d)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium transition-colors ${
                  nozzleDiameter === d
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {d}mm
              </button>
            ))}
          </div>
          {nozzleDiameter === 0.2 && (
            <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Bico 0.2mm bloqueia filamentos com fibra (CF/GF) e PVA.</span>
            </p>
          )}
        </div>

        {/* Hotend Material */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Material do Hotend:
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setNozzleMaterial('aco_endurecido')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                nozzleMaterial === 'aco_endurecido'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              Aço Endurecido (Hardened)
            </button>
            <button
              onClick={() => setNozzleMaterial('aco_inoxidavel')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                nozzleMaterial === 'aco_inoxidavel'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              Aço Inox (Padrão A1/P1P)
            </button>
          </div>
          {nozzleMaterial === 'aco_inoxidavel' && (
            <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Aço Inoxidável desgasta rápido com filamentos abrasivos (CF/GF/Glow).</span>
            </p>
          )}
        </div>

        {/* Feeding Mode (AMS vs External) */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Alimentação de Filamento:
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFeedSystem('AMS')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                feedSystem === 'AMS'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              Slot AMS
            </button>
            <button
              onClick={() => setFeedSystem('externo')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                feedSystem === 'externo'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              Spool Externo
            </button>
          </div>
          {feedSystem === 'AMS' && (
            <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <span>AMS bloqueia TPU flexível convencional para evitar atolamento nos tubos PTFE.</span>
            </p>
          )}
        </div>
      </div>

      {/* Selected Printer Hardware Specs Summary */}
      {selectedPrinterSpec && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{selectedPrinterSpec.brand} {selectedPrinterSpec.model}</h3>
              <p className="text-[11px] text-slate-400">
                Volume: {selectedPrinterSpec.build_volume_mm ? `${selectedPrinterSpec.build_volume_mm[0]}×${selectedPrinterSpec.build_volume_mm[1]}×${selectedPrinterSpec.build_volume_mm[2]}mm` : 'Não especificado'} • Filamento: {selectedPrinterSpec.filament_diameter_mm}mm
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Câmara:</span>
              <span className="font-semibold text-slate-200 capitalize">
                {selectedPrinterSpec.chamber_type.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Temperaturas Máximas:</span>
              <span className="font-semibold text-amber-300">
                Bico {selectedPrinterSpec.max_hotend_C}°C / Mesa {selectedPrinterSpec.max_bed_C ? `${selectedPrinterSpec.max_bed_C}°C` : 'N/A'}
              </span>
            </div>

            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Bico de Fábrica:</span>
              <span className="font-semibold text-slate-200 capitalize">
                {selectedPrinterSpec.default_nozzle_material.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Results: Compatible vs Blocked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compatible List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Materiais Compatíveis Aprovados ({compatibleItems.length})
              </h4>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Aptos para Produção
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {compatibleItems.map(item => {
              const catalogInfo = filamentCatalogMap.get(item.filament_key.toLowerCase());
              return (
                <div
                  key={`${item.printer_id}-${item.filament_key}`}
                  className="bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{item.filament_key}</h5>
                      <span className="text-[10px] text-slate-400 font-mono capitalize">
                        Status: {item.effective_status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {catalogInfo?.abrasive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Abrasivo
                        </span>
                      )}
                      {catalogInfo?.example_nozzle_temperature_C && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                          {catalogInfo.example_nozzle_temperature_C[0]}-{catalogInfo.example_nozzle_temperature_C[1]}°C
                        </span>
                      )}
                    </div>
                  </div>

                  {item.requirements.length > 0 && (
                    <div className="text-[10px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 mb-2">
                      <span className="text-slate-400 block font-semibold">Requisitos / Condições:</span>
                      <ul className="list-disc list-inside mt-0.5 text-slate-300 space-y-0.5">
                        {item.requirements.map((req, rIdx) => (
                          <li key={rIdx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {catalogInfo && (
                    <p className="text-[10px] text-slate-400 mb-2">
                      {catalogInfo.properties_use}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      Secagem: {catalogInfo?.drying_guidance || 'Consulte o fabricante'}
                    </span>
                    <button
                      onClick={() => handleConsultDiagnostic(item.filament_key)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Ver Ajustes</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked or Incompatible List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Materiais Bloqueados nesta Configuração ({blockedItems.length})
              </h4>
            </div>
            <span className="text-[11px] text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Isolamento Ativo
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {blockedItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                Nenhum material bloqueado para este setup!
              </div>
            ) : (
              blockedItems.map((item) => {
                const catalogInfo = filamentCatalogMap.get(item.filament_key.toLowerCase());
                const reason = item.block_reason || item.requirements.join('; ') || 'Restrição térmica ou mecânica do modelo de impressora selecionado.';
                return (
                  <div
                    key={`${item.printer_id}-${item.filament_key}`}
                    className="bg-rose-950/20 border border-rose-900/30 p-3.5 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h5 className="text-xs font-bold text-rose-200">{item.filament_key}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {catalogInfo?.family || 'Polímero'}
                        </span>
                      </div>

                      <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold flex items-center gap-1 shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Bloqueado</span>
                      </span>
                    </div>

                    {/* Explicit Hardware Rejection Reason */}
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/40 text-[11px] text-rose-200/90 mb-2 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Status: {item.effective_status}</span>
                      <button
                        onClick={() => handleConsultDiagnostic(item.filament_key, reason)}
                        className="text-slate-300 hover:text-white underline"
                      >
                        Como liberar?
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
