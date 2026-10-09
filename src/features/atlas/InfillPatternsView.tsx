import React, { useState } from 'react';
import { 
  Grid, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Search, 
  Info, 
  Flame,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { INFILL_PATTERNS_V3 } from '../../data/knowledgeBaseV3.ts';
import { InfillPatternV3 } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const InfillPatternsView: React.FC = () => {
  const { setActiveTab, setInitialChatPrompt, activePrinter, slicerLanguage } = useApp();
  const [search, setSearch] = useState('');
  const [collisionFilter, setCollisionFilter] = useState<'all' | 'safe' | 'crossing'>('all');
  const [selectedPattern, setSelectedPattern] = useState<InfillPatternV3 | null>(null);

  const filteredPatterns = INFILL_PATTERNS_V3.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = 
      p.label_pt.toLowerCase().includes(q) ||
      p.label_en.toLowerCase().includes(q) ||
      p.config_value.toLowerCase().includes(q) ||
      p.technical_note.toLowerCase().includes(q) ||
      p.purpose.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (collisionFilter === 'safe') {
      return p.collision_risk_same_layer === 'baixo';
    }
    if (collisionFilter === 'crossing') {
      return p.collision_risk_same_layer === 'alto';
    }
    return true;
  });

  const handleConsultDiagnostic = (p: InfillPatternV3) => {
    setInitialChatPrompt(
      `Estou usando o padrão de preenchimento "${p.label_pt}" (${p.label_en}, config: "${p.config_value}") na minha ${activePrinter}. ${
        p.collision_risk_same_layer === 'alto'
          ? 'Como evitar ruídos de raspagem e colisão do bico com as linhas já impressas em alta velocidade?' 
          : 'Quais são as melhores velocidades e densidades para maximizar a qualidade e resistência com este padrão?'
      }`
    );
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>Atlas Completo de Preenchimentos — 22 Padrões do Bambu Studio</span>
          </div>
          <p className="text-xs text-slate-300">
            Base oficial do código-fonte do Bambu Studio. Inclui detecção física de colisão do bico (cruzamento no mesmo plano), economia de material e finalidades de aplicação.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sem Risco Crítico</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Auto-Cruzamento</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por padrão (ex: Gyroid, Grid, Aligned, Honeycomb, config_value)..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 shrink-0">
          <button
            onClick={() => setCollisionFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              collisionFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({INFILL_PATTERNS_V3.length})
          </button>
          <button
            onClick={() => setCollisionFilter('safe')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              collisionFilter === 'safe'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Sem Colisão (Baixo Risco)</span>
          </button>
          <button
            onClick={() => setCollisionFilter('crossing')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              collisionFilter === 'crossing'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Com Auto-Cruzamento</span>
          </button>
        </div>
      </div>

      {/* Grid of Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatterns.map(pattern => {
          const isCrossing = pattern.collision_risk_same_layer === 'alto';
          const isCheckPreview = pattern.collision_risk_same_layer === 'avaliar_preview';
          return (
            <div
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern)}
              className="group bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {slicerLanguage === 'en' ? pattern.label_en : pattern.label_pt}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                        {pattern.config_value}
                      </span>
                      {slicerLanguage === 'bilingual' && (
                        <span className="text-[11px] text-slate-400">
                          ({pattern.label_en})
                        </span>
                      )}
                    </div>
                  </div>

                  {isCrossing ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0" title="Linhas se cruzam na mesma camada. Em altas velocidades, o bico pode raspar gerando ruído e descolamento.">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Risco de Colisão</span>
                    </span>
                  ) : isCheckPreview ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0" title="Verificar comportamento nas prévias do slicer.">
                      <Info className="w-3 h-3" />
                      <span>Avaliar Prévia</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0" title="Trajetória contínua sem colisão do bico no mesmo plano. Seguro para altas velocidades.">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Sem Colisão</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {pattern.technical_note}
                </p>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Uso de Material:</span>
                    <span className="font-semibold text-slate-200 capitalize">{pattern.relative_material_use.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Finalidade Primária:</span>
                    <span className="font-semibold text-blue-300 capitalize">{pattern.purpose.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300">
                <span>Ver parâmetros e detalhes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedPattern && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {selectedPattern.label_pt}
                  </h2>
                  <span className="text-xs text-slate-400">({selectedPattern.label_en})</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                    Valor no Studio: "{selectedPattern.config_value}"
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Chave: {selectedPattern.slicer_key}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPattern(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Collision Risk Highlight */}
            <div className={`p-3.5 rounded-xl border mb-4 flex items-start gap-3 ${
              selectedPattern.collision_risk_same_layer === 'alto'
                ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                : selectedPattern.collision_risk_same_layer === 'baixo'
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
            }`}>
              {selectedPattern.collision_risk_same_layer === 'alto' ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-rose-300">
                      Risco de Raspagem e Colisão do Bico no Mesmo Plano
                    </h4>
                    <p className="text-xs text-rose-200/90 mt-0.5">
                      Este padrão cruza trajetórias na mesma camada. Em impressoras CoreXY rápidas, pode gerar estalos mecânicos e descolamento da peça.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-emerald-300">
                      Trajetória Contínua (Sem Auto-Cruzamento no Mesmo Plano)
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      Padrão seguro para alta aceleração e velocidade sem impacto de bico em saliências prévias.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3 mb-4 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-semibold text-slate-200 text-xs">Nota Técnica de Engenharia:</h4>
              <p>{selectedPattern.technical_note}</p>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Finalidade:</span>
                <span className="font-semibold text-slate-100 capitalize">{selectedPattern.purpose.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consumo Relativo:</span>
                <span className="font-semibold text-amber-400 capitalize">{selectedPattern.relative_material_use.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Disponibilidade:</span>
                <span className="font-semibold text-blue-400">{selectedPattern.availability.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Source URLs */}
            {selectedPattern.source_urls.length > 0 && (
              <div className="mb-4">
                <span className="text-[11px] text-slate-400 block mb-1">Fontes Oficiais e Referências:</span>
                <div className="space-y-1">
                  {selectedPattern.source_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedPattern(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => handleConsultDiagnostic(selectedPattern)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consultar Diagnóstico no Assistente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
