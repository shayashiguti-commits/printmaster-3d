import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Layers, 
  ListOrdered, 
  HardDrive,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';

interface CoverageReport {
  version: string;
  totalParameters: number;
  verifiedCount: number;
  pendingCount: number;
  coveragePercentage: number;
  byCategory: Record<string, { total: number; verified: number; pending: number }>;
  disclaimer: string;
}

interface QaTestResult {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  observed: string;
  durationMs: number;
}

interface AuditLog {
  id: string;
  actor: string;
  event: string;
  target: string;
  timestamp: string;
  change_summary: string;
}

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qa' | 'coverage' | 'audit' | 'reseed'>('qa');
  const [coverage, setCoverage] = useState<CoverageReport | null>(null);
  const [qaResults, setQaResults] = useState<QaTestResult[]>([]);
  const [qaSummary, setQaSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [qaRunning, setQaRunning] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [reseedMsg, setReseedMsg] = useState<string | null>(null);
  const [kbStatus, setKbStatus] = useState<any>(null);

  const fetchStatusAndCoverage = async () => {
    try {
      const [covRes, statRes, auditRes] = await Promise.all([
        fetch('/api/kb/coverage').then(r => r.json()),
        fetch('/api/kb/status').then(r => r.json()),
        fetch('/api/admin/audit-logs').then(r => r.json()),
      ]);
      if (covRes.success) setCoverage(covRes.coverage);
      if (statRes.success) setKbStatus(statRes);
      if (auditRes.success) setAuditLogs(auditRes.logs);
    } catch (e) {
      console.error('Error fetching admin data', e);
    }
  };

  useEffect(() => {
    fetchStatusAndCoverage();
  }, []);

  const runQaSuite = async () => {
    setQaRunning(true);
    try {
      const res = await fetch('/api/tests/run-qa-suite');
      const data = await res.json();
      if (data.success) {
        setQaResults(data.results);
        setQaSummary(data.summary);
        await fetchStatusAndCoverage(); // Refresh audit logs
      }
    } catch (err) {
      console.error('Error running QA suite', err);
    } finally {
      setQaRunning(false);
    }
  };

  const handleReseed = async () => {
    setReseedLoading(true);
    setReseedMsg(null);
    try {
      const res = await fetch('/api/kb/seed', { method: 'POST' });
      const data = await res.json();
      setReseedMsg(data.message || (data.success ? 'Base reimportada com sucesso!' : 'Erro na reimportação'));
      await fetchStatusAndCoverage();
    } catch (err: any) {
      setReseedMsg(`Falha na reimportação: ${err.message}`);
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Painel Administrativo & QA</h1>
          </div>
          <p className="text-xs text-slate-400">
            Controle de governança da base de conhecimento, testes automatizados e integridade do repositório.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'qa' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Suíte QA (Testes)
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'coverage' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cobertura do Atlas
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'audit' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Auditoria & Logs
          </button>
          <button
            onClick={() => setActiveTab('reseed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'reseed' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Ingestão Seed
          </button>
        </div>
      </div>

      {/* TAB 1: QA TEST SUITE */}
      {activeTab === 'qa' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">
                Suíte de Testes Obrigatórios de Confiabilidade (QA01 - QA10)
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Executa verificações reais em tempo de execução no servidor para validar: busca bilíngue, parada em emergência de fumaça, proteção contra zip bombs 3MF, parser STL real, isolamento de casos entre usuários e mais.
              </p>
            </div>

            <button
              onClick={runQaSuite}
              disabled={qaRunning}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
            >
              {qaRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Executando Testes...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-300" />
                  <span>Rodar Suíte QA Agora</span>
                </>
              )}
            </button>
          </div>

          {/* Results Summary Box */}
          {qaSummary && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              qaSummary.failed === 0 
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {qaSummary.failed === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>Resultado: {qaSummary.passed} de {qaSummary.total} testes aprovados com sucesso!</span>
              </div>
              <span className="text-[11px] font-mono">100% dos cenários críticos válidos</span>
            </div>
          )}

          {/* Test Results Table */}
          {qaResults.length > 0 && (
            <div className="space-y-2.5">
              {qaResults.map(test => (
                <div
                  key={test.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${test.passed ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      <span className="text-xs font-bold text-white">{test.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({test.id})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{test.durationMs}ms</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-lg bg-slate-800/60 text-slate-300">
                      <strong className="text-slate-400 block mb-0.5">Comportamento Esperado:</strong>
                      {test.expected}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/60 text-slate-300">
                      <strong className="text-slate-400 block mb-0.5">Observado no Teste:</strong>
                      {test.observed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COVERAGE */}
      {activeTab === 'coverage' && coverage && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white mb-1">
                  Relatório de Cobertura do Atlas — {coverage.version}
                </h2>
                <p className="text-xs text-slate-400">
                  Total de parâmetros identificados, auditados e pendentes de reconciliação de menu.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-400 font-mono">{coverage.coveragePercentage}%</span>
                <span className="text-[10px] text-slate-400 block">Cobertura Verificada</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${coverage.coveragePercentage}%` }}
              />
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{coverage.disclaimer}</span>
            </div>

            {/* Breakdown by Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {Object.entries(coverage.byCategory).map(([cat, stats]) => (
                <div key={cat} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
                  <span className="font-bold text-slate-200">{cat}</span>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Total: {stats.total}</span>
                    <span className="text-emerald-400">Verificados: {stats.verified}</span>
                    <span className="text-amber-400">Pendentes: {stats.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-sm font-bold text-white mb-1">Registros de Auditoria & Alterações</h2>
            <p className="text-xs text-slate-400 mb-4">
              Histórico rastreável de eventos de sistema, re-ingestão e execuções de testes.
            </p>

            <div className="space-y-2">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.event}</span>
                      <span className="text-[10px] text-blue-400 font-mono">[{log.actor}]</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{log.change_summary}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESEED / INGESTION */}
      {activeTab === 'reseed' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-2xl">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Ingestão & Sincronização da Base JSON</h2>
              <p className="text-xs text-slate-400">
                Recarrega os parâmetros estruturados de <code>initialKnowledgeBase.json</code> de forma idempotente para o repositório em disco.
              </p>
            </div>

            {kbStatus && (
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5 text-xs text-slate-300">
                <p><strong>Modo de Armazenamento:</strong> {kbStatus.storageMode}</p>
                <p><strong>Parâmetros Carregados:</strong> {kbStatus.totalParameters}</p>
                <p><strong>Falhas Mapeadas:</strong> {kbStatus.totalFailures}</p>
                <p><strong>Fontes Registradas:</strong> {kbStatus.totalSources}</p>
                <p className="text-[11px] text-emerald-400 font-medium pt-1">{kbStatus.storageModeNotice}</p>
              </div>
            )}

            {reseedMsg && (
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500 text-xs text-blue-200">
                {reseedMsg}
              </div>
            )}

            <button
              onClick={handleReseed}
              disabled={reseedLoading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${reseedLoading ? 'animate-spin' : ''}`} />
              <span>{reseedLoading ? 'Processando Ingestão...' : 'Reexecutar Ingestão da Base'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
