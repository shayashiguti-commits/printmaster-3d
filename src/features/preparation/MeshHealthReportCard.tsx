import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Box, 
  RotateCcw, 
  Wrench, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Info,
  Sparkles
} from 'lucide-react';
import { MeshHealthReport } from '../../types/index.ts';

interface MeshHealthReportCardProps {
  report: MeshHealthReport;
  fileName: string;
  onSendToChat?: (promptText: string) => void;
  onToggleWireframe?: () => void;
  isWireframe?: boolean;
}

export const MeshHealthReportCard: React.FC<MeshHealthReportCardProps> = ({
  report,
  fileName,
  onSendToChat,
  onToggleWireframe,
  isWireframe
}) => {
  const [copied, setCopied] = useState(false);
  const [showAllDiagnostics, setShowAllDiagnostics] = useState(true);

  const getStatusBadge = () => {
    switch (report.overallStatus) {
      case 'perfect':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          label: 'Malha 100% Manifold (Pronta para Fatiar)',
          icon: ShieldCheck,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          label: 'Atenção: Inconsistências Leves (Reparável)',
          icon: AlertTriangle,
        };
      case 'critical':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          label: 'Crítico: Não-Manifold (Risco de Falha no Fatiador)',
          icon: AlertOctagon,
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const handleCopyReport = () => {
    const text = `=== LAUDO TÉCNICO DE SAÚDE DA MALHA (THREE.JS) ===
Arquivo: ${fileName}
Score de Saúde: ${report.healthScore}/100 (${report.overallStatus.toUpperCase()})
Triângulos Totais: ${report.totalTriangles.toLocaleString('pt-BR')}
Vértices Únicos Mapeados: ${report.totalUniqueVertices.toLocaleString('pt-BR')}

1. Manifoldness (Variedade): ${report.isManifold ? 'SIM (2-Manifold)' : `NÃO (${report.nonManifoldEdgesCount} arestas singulares)`}
2. Faces Não Unidas / Arestas Abertas: ${report.openEdgesCount === 0 ? '0 (Watertight / Estanque)' : `${report.openEdgesCount} arestas abertas`}
3. Triângulos Invertidos: ${report.invertedTrianglesCount === 0 ? '0 (Normais Consistentes)' : `${report.invertedTrianglesCount} faces com normais invertidas`}
4. Faces Degeneradas (Área Zero): ${report.degenerateFacesCount} faces

Resumo:
${report.summary}

Recomendações para Bambu Studio:
${report.repairRecommendations.map(r => `- ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConsultAi = () => {
    if (!onSendToChat) return;
    const prompt = `Analisei a malha do arquivo "${fileName}" no Preparador 3D e o verificador do Three.js acusou o seguinte laudo de saúde:
- Status: ${report.overallStatus} (Score ${report.healthScore}/100)
- Arestas abertas (faces não unidas): ${report.openEdgesCount}
- Arestas não-manifold: ${report.nonManifoldEdgesCount}
- Triângulos invertidos: ${report.invertedTrianglesCount}
- Triângulos totais: ${report.totalTriangles}

Como devo configurar o Bambu Studio para fatiar essa peça com segurança ou como corrigir essa malha?`;
    onSendToChat(prompt);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn space-y-0">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${statusBadge.bg}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Saúde da Malha 3D
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Three.js Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verificação topológica de manifoldness, normais e estanqueidade.
            </p>
          </div>
        </div>

        {/* Score & Copy Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium">Score:</span>
            <span className={`text-sm font-black font-mono ${
              report.healthScore >= 95 ? 'text-emerald-400' :
              report.healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {report.healthScore}/100
            </span>
          </div>

          <button
            onClick={handleCopyReport}
            title="Copiar relatório completo de saúde da malha"
            className="p-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copiado' : 'Copiar Laudo'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Status Banner */}
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${statusBadge.bg}`}>
          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${statusBadge.dot} animate-pulse`} />
          <div className="space-y-1">
            <span className="text-xs font-bold block">{statusBadge.label}</span>
            <p className="text-xs text-slate-300 leading-relaxed">{report.summary}</p>
          </div>
        </div>

        {/* 4 Core Health Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Manifoldness */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Manifoldness</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                report.nonManifoldEdgesCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {report.nonManifoldEdgesCount === 0 ? '2-MANIFOLD' : 'NÃO-MANIFOLD'}
              </span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {report.nonManifoldEdgesCount === 0 ? 'Nenhuma aresta singular' : `${report.nonManifoldEdgesCount} arestas com 3+ faces`}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {report.nonManifoldEdgesCount === 0 ? 'Topologia de superfície válida sem aletas internas.' : 'Gera ambiguidade de volume para o fatiador.'}
            </p>
          </div>

          {/* 2. Open Edges / Unjoined faces */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-amber-400" />
                <span>Faces Não Unidas</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                report.openEdgesCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {report.openEdgesCount === 0 ? 'WATERTIGHT' : 'ABERTO'}
              </span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {report.openEdgesCount === 0 ? '0 arestas abertas (fechada)' : `${report.openEdgesCount} arestas de contorno`}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {report.openEdgesCount === 0 ? 'Sólido perfeitamente estanque sem orifícios.' : 'Furos na malha podem causar peças ocas.'}
            </p>
          </div>

          {/* 3. Inverted Triangles */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>Triângulos Invertidos</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                report.invertedTrianglesCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {report.invertedTrianglesCount === 0 ? 'COERENTE' : 'INVERTIDO'}
              </span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {report.invertedTrianglesCount === 0 ? '0 normais conflitantes' : `${report.invertedTrianglesCount} faces invertidas`}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {report.invertedTrianglesCount === 0 ? 'Todas as normais apontam para fora do sólido.' : 'Normais para dentro causam falhas de infill.'}
            </p>
          </div>

          {/* 4. Degenerate Triangles */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Faces Degeneradas</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                report.degenerateFacesCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {report.degenerateFacesCount === 0 ? 'LIMPA' : 'ARTEFATOS'}
              </span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {report.degenerateFacesCount === 0 ? '0 triângulos planos' : `${report.degenerateFacesCount} faces com área nula`}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {report.degenerateFacesCount === 0 ? 'Nenhum vértice duplicado ou colinear.' : 'Triângulos degenerados por tolerância CAD.'}
            </p>
          </div>
        </div>

        {/* Technical Diagnostics Detail List */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowAllDiagnostics(!showAllDiagnostics)}
            className="w-full p-3 bg-slate-850 hover:bg-slate-800 text-left flex items-center justify-between text-xs text-slate-300 font-semibold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Detalhamento dos Itens Inspecionados ({report.diagnostics.length})</span>
            </div>
            {showAllDiagnostics ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAllDiagnostics && (
            <div className="p-4 bg-slate-900/50 border-t border-slate-800 space-y-3">
              {report.diagnostics.map((diag, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    diag.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' :
                    diag.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' :
                    'bg-rose-500/5 border-rose-500/20 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-[11px]">
                    {diag.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {diag.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {diag.type === 'error' && <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    <span>{diag.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-5.5 leading-relaxed">
                    {diag.description}
                  </p>
                  {diag.fixAdvice && (
                    <div className="mt-1.5 pl-5.5 text-[10px] text-blue-300 font-medium bg-blue-950/30 p-2 rounded border border-blue-500/20">
                      <strong>Dica Prática: </strong>{diag.fixAdvice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bambu Studio Repair Recommendations */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Recomendações Práticas para Bambu Studio & Slicing</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Guia Técnico
            </span>
          </div>
          <ul className="space-y-1.5">
            {report.repairRecommendations.map((rec, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action triggers */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {onToggleWireframe && (
              <button
                onClick={onToggleWireframe}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                  isWireframe
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isWireframe ? 'Ocultar Wireframe' : 'Destacar Arestas (Wireframe)'}</span>
              </button>
            )}
          </div>

          {onSendToChat && (
            <button
              onClick={handleConsultAi}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-900/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consultar Especialista IA sobre esta Malha</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
