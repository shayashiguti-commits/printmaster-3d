import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Layers, 
  Wrench, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';
import { TARGETED_FAQ_V3 } from '../../data/knowledgeBaseV3.ts';
import { TargetedFaqV3 } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const TargetedFaqView: React.FC = () => {
  const { setActiveTab, setInitialChatPrompt, activePrinter } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(TARGETED_FAQ_V3[0]?.id || null);

  const categories = [
    { id: 'all', label: `Todos os Casos (${TARGETED_FAQ_V3.length})` },
    { id: 'preenchimento_e_colisao', label: 'Infill & Colisão do Bico' },
    { id: 'filamentos_e_compatibilidade', label: 'Filamentos & Hardware' },
    { id: 'adesao_e_deformacao', label: 'Adesão & Warping' },
    { id: 'resfriamento_e_camadas', label: 'Resfriamento & Camadas' }
  ];

  const getCategoryFromItem = (item: TargetedFaqV3): string => {
    if (item.category) return item.category;
    const text = (item.title + ' ' + item.tags.join(' ')).toLowerCase();
    if (text.includes('grid') || text.includes('colis') || text.includes('infill') || text.includes('preenchimento') || text.includes('raspagem')) {
      return 'preenchimento_e_colisao';
    }
    if (text.includes('ams') || text.includes('tpu') || text.includes('cf') || text.includes('bico') || text.includes('a1') || text.includes('p1s') || text.includes('h2d')) {
      return 'filamentos_e_compatibilidade';
    }
    return 'preenchimento_e_colisao';
  };

  const filteredItems = TARGETED_FAQ_V3.filter(item => {
    const q = search.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(q) ||
      item.differential_diagnosis.toLowerCase().includes(q) ||
      item.recommended_action.toLowerCase().includes(q) ||
      item.safety.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.triage_questions.some(tq => tq.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedCategory !== 'all') {
      const cat = getCategoryFromItem(item);
      if (cat !== selectedCategory) return false;
    }
    return true;
  });

  const handleStartDiagnostic = (item: TargetedFaqV3) => {
    setInitialChatPrompt(
      `Estou investigando o seguinte problema na minha ${activePrinter}: "${item.title}". Diagnóstico diferencial: ${item.differential_diagnosis}. Ação recomendada: ${item.recommended_action}. Como devo configurar e verificar isso no Bambu Studio?`
    );
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-800/40 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Técnico & Diagnósticos Direcionados (33 Casos de Investigação)</span>
          </div>
          <p className="text-xs text-slate-300">
            Resoluções passo a passo fundamentadas no código do Bambu Studio e na mecânica das impressoras Bambu Lab. Do atrito em infill Grid a falhas de alimentação no AMS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">Total de Diagnósticos:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30">
            {TARGETED_FAQ_V3.length} Casos Auditados
          </span>
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
            placeholder="Buscar por sintoma, filamento ou defeito (ex: colisão grid, tpu ams, silk stringing)..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin shrink-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion / Cards List */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/50 hover:bg-slate-850 border-slate-800'
              }`}
            >
              {/* Header Toggle */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                      {item.id}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                    {item.infill_pattern && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Infill: {item.infill_pattern}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {item.differential_diagnosis}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-4 text-xs animate-fadeIn">
                  {/* Differential Diagnosis Card */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Diagnóstico Diferencial & Causa-Raiz</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {item.differential_diagnosis}
                    </p>
                  </div>

                  {/* Triage Questions */}
                  {item.triage_questions.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Perguntas de Triagem para Validação</span>
                      </h4>
                      <div className="space-y-1.5">
                        {item.triage_questions.map((q, qIdx) => (
                          <div key={qIdx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {qIdx + 1}
                            </span>
                            <span className="text-slate-200">{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  <div className="bg-emerald-950/20 border border-emerald-800/30 p-3.5 rounded-xl">
                    <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ação Recomendada de Correção</span>
                    </h4>
                    <p className="text-emerald-200/90 leading-relaxed">
                      {item.recommended_action}
                    </p>
                  </div>

                  {/* Safety & Validation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Critério de Validação:</span>
                      <p className="text-slate-200">{item.validation}</p>
                    </div>
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                      <span className="text-rose-400 block text-[10px] uppercase font-semibold mb-0.5 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Aviso de Segurança:</span>
                      </span>
                      <p className="text-rose-200/90">{item.safety}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer CTAs */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Status de Revisão: {item.review_status}
                    </span>
                    <button
                      onClick={() => handleStartDiagnostic(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Iniciar Diagnóstico Guiado</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
