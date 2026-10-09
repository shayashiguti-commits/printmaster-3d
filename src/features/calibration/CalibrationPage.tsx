import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { DiagnosticTest } from '../../types/index.ts';

export const CalibrationPage: React.FC = () => {
  const { setActiveTab, setInitialChatPrompt, activePrinter } = useApp();
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [selectedTech, setSelectedTech] = useState<'all' | 'FDM' | 'SLA/MSLA'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<DiagnosticTest | null>(null);

  useEffect(() => {
    fetch('/api/kb/tests')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTests(d.tests);
      });
  }, []);

  const filteredTests = tests.filter(t => {
    if (selectedTech !== 'all' && t.technology !== selectedTech) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.objective.toLowerCase().includes(q);
  });

  const handleStartCalibrationInChat = (test: DiagnosticTest) => {
    setInitialChatPrompt(`Gostaria de executar a rotina de calibração "${test.name}" na minha ${activePrinter}. Qual o passo a passo detalhado e os modelos de teste recomendados?`);
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Catálogo de Rotinas de Calibração</h1>
          </div>
          <p className="text-xs text-slate-400">
            Procedimentos metódicos de baixo risco e calibrações oficiais para FDM e SLA, sem ajustes invasivos.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTech('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTech === 'all' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todas ({tests.length})
          </button>
          <button
            onClick={() => setSelectedTech('FDM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTech === 'FDM' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            FDM ({tests.filter(x => x.technology === 'FDM').length})
          </button>
          <button
            onClick={() => setSelectedTech('SLA/MSLA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTech === 'SLA/MSLA' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            SLA / Resina ({tests.filter(x => x.technology === 'SLA/MSLA').length})
          </button>
        </div>
      </div>

      {/* Grid of Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map(test => (
          <div
            key={test.id}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {test.id} • {test.technology}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Seguro</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{test.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{test.objective}</p>

              {/* Steps summary */}
              <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300 block">Passos principais:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {test.procedure_steps.slice(0, 3).map((s, idx) => (
                    <li key={idx} className="line-clamp-1">{s}</li>
                  ))}
                </ul>
              </div>

              {test.contraindications && test.contraindications.length > 0 && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">
                  <strong>Contraindicação: </strong>{test.contraindications[0]}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {test.pass_conditions ? 'Critério definido' : ''}
              </span>
              <button
                onClick={() => handleStartCalibrationInChat(test)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 group"
              >
                <span>Guia no Chat</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
