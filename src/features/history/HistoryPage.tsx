import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { DiagnosticCase } from '../../types/index.ts';

export const HistoryPage: React.FC = () => {
  const { setActiveCaseId, setActiveTab } = useApp();
  const [cases, setCases] = useState<DiagnosticCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      if (data.success && data.cases) {
        setCases(data.cases);
      }
    } catch (err) {
      console.error('Error fetching cases', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDeleteCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir este caso e todo o histórico de testes associado?')) return;

    try {
      const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCases(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting case', err);
    }
  };

  const handleOpenCase = (id: string) => {
    setActiveCaseId(id);
    setActiveTab('diagnostics');
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'resolved') return c.status === 'resolved';
    if (statusFilter === 'active') return c.status !== 'resolved' && c.status !== 'escalated';
    if (statusFilter === 'escalated') return c.status === 'escalated';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Histórico de Casos Diagnósticos</h1>
          </div>
          <p className="text-xs text-slate-400">
            Acompanhe o ciclo de vida dos problemas relatados, testes efetuados e soluções confirmadas.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({cases.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'active' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Em Aberto ({cases.filter(c => c.status !== 'resolved' && c.status !== 'escalated').length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'resolved' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Resolvidos ({cases.filter(c => c.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Carregando histórico de casos...</div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8">
          <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400 mb-4">Nenhum caso encontrado para este filtro.</p>
          <button
            onClick={() => { setActiveCaseId(null); setActiveTab('diagnostics'); }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
          >
            Abrir Novo Diagnóstico
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map(c => {
            const isResolved = c.status === 'resolved';
            const isEscalated = c.status === 'escalated';

            return (
              <div
                key={c.id}
                onClick={() => handleOpenCase(c.id)}
                className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isResolved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      isEscalated ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {c.title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="text-[11px] text-slate-400">
                      <strong>Equipamento:</strong> {c.printer_model} ({c.filament_type})
                    </p>
                    {c.current_test && (
                      <p className="text-[11px] text-indigo-300">
                        <strong>Último teste:</strong> {c.current_test.name}
                      </p>
                    )}
                  </div>

                  {/* Counters */}
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{c.messages.length}</span>
                    </div>
                    {c.images.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{c.images.length} fotos</span>
                      </div>
                    )}
                    {c.test_history.length > 0 && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{c.test_history.length} testes</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={(e) => handleDeleteCase(c.id, e)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                  <span className="text-xs text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Retomar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
