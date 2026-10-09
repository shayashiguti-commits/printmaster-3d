import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Box, 
  BookOpen, 
  Sliders, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  History, 
  Printer, 
  FileCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { DiagnosticCase, KBArticle, FailureType } from '../../types/index.ts';

export const DashboardPage: React.FC = () => {
  const { setActiveTab, setInitialChatPrompt, activePrinter, userLevel, setActiveCaseId } = useApp();
  const [recentCases, setRecentCases] = useState<DiagnosticCase[]>([]);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);
  const [failures, setFailures] = useState<FailureType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/cases').then(r => r.json()),
      fetch('/api/kb/articles').then(r => r.json()),
      fetch('/api/kb/failures').then(r => r.json()),
    ])
      .then(([casesData, articlesData, failuresData]) => {
        if (casesData.success) setRecentCases(casesData.cases.slice(0, 4));
        if (articlesData.success) setKbArticles(articlesData.articles.slice(0, 3));
        if (failuresData.success) setFailures(failuresData.failures.slice(0, 6));
      })
      .catch(err => console.error('Error loading dashboard data', err))
      .finally(() => setLoading(false));
  }, []);

  const quickExamples = [
    { label: 'Action Figures: Suportes finos & Detalhes', query: 'Quero fatiar uma Action Figure / miniatura detalhada. Quais os perfis, camadas adaptativas e suportes recomendados?' },
    { label: 'Modo Vaso (Spiral Vase) sem costura', query: 'Como configurar o Modo Vaso Espiral no Bambu Studio com espessura contínua e sem costura Z?' },
    { label: 'Bico raspando em preenchimento Grid', query: 'O bico está raspando com força no preenchimento Grid em alta velocidade. Como resolver mudando o padrão de infill?' },
    { label: 'Minha peça descola da mesa (Warping)', query: 'Minha impressão está descolando da mesa nos cantos (warping), como diagnosticar?' },
    { label: 'Compatibilidade de materiais da minha impressora', query: 'Quais filamentos são permitidos na minha impressora e quais são estritamente bloqueados por hardware?' },
    { label: 'O que é vazão volumétrica máxima?', query: 'O que significa o parâmetro Max Volumetric Speed no Bambu Studio e quando alterar?' },
  ];

  const handleExampleClick = (query: string) => {
    setInitialChatPrompt(query);
    setActiveCaseId(null);
    setActiveTab('diagnostics');
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Sistema Especialista em Engenharia Aditiva</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Seu especialista em impressão 3D
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
            Diagnostique problemas, configure peças e domine o Bambu Studio com fundamentação física, segurança comprovada e rastreabilidade total.
          </p>

          {/* Quick Stats / Active Machine Pill */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Impressora Ativa: <strong className="text-white font-medium">{activePrinter}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Modo: <strong className="text-white font-medium">{userLevel}</strong></span>
            </div>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main 4 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Resolver problema */}
        <div 
          onClick={() => { setActiveCaseId(null); setActiveTab('diagnostics'); }}
          className="group relative bg-slate-800/60 dark:bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Resolver um problema
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnóstico metódico por foto ou texto, árvore de hipóteses e protocolo de testes seguros.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-blue-400 font-medium">
            <span>Iniciar diagnóstico</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Preparar peça */}
        <div 
          onClick={() => setActiveTab('preparation')}
          className="group relative bg-slate-800/60 dark:bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Preparar minha peça
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualizador 3D em Three.js, análise de bounding box, espessuras e orientação para impressão.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-blue-400 font-medium">
            <span>Abrir visualizador STL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Entender Bambu Studio */}
        <div 
          onClick={() => setActiveTab('atlas')}
          className="group relative bg-slate-800/60 dark:bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Entender Bambu Studio
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Atlas com mais de 70 configurações verificadas, menus exatos, impactos de aumentar/diminuir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-blue-400 font-medium">
            <span>Explorar atlas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Calibração */}
        <div 
          onClick={() => setActiveTab('calibration')}
          className="group relative bg-slate-800/60 dark:bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Calibração & Manutenção
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              14 rotinas técnicas (primeira camada, fluxo, PA, torre térmica, pontes) sem comandos invasivos.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-blue-400 font-medium">
            <span>Ver rotinas oficiais</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Search & Examples Section */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200">Exemplos frequentes de investigação técnica:</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(ex.query)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-slate-700 hover:border-blue-500/40 transition-all text-left flex items-center gap-1.5"
            >
              <span>{ex.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Recent Cases & Knowledge Base Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Diagnostic Cases (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Casos Recentes de Diagnóstico</h2>
            </div>
            <button 
              onClick={() => setActiveTab('history')}
              className="text-xs text-blue-400 hover:underline"
            >
              Ver todos os casos
            </button>
          </div>

          {recentCases.length === 0 ? (
            <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-8 text-center">
              <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-3">Nenhum caso registrado ainda no seu histórico.</p>
              <button
                onClick={() => { setActiveCaseId(null); setActiveTab('diagnostics'); }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Abrir Primeiro Caso
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentCases.map(c => {
                const statusLabels: Record<string, { label: string; color: string }> = {
                  new: { label: 'Novo', color: 'bg-slate-700 text-slate-300' },
                  collecting_context: { label: 'Triagem', color: 'bg-blue-900/60 text-blue-300' },
                  hypotheses: { label: 'Hipóteses', color: 'bg-amber-900/60 text-amber-300' },
                  awaiting_test: { label: 'Aguardando Teste', color: 'bg-indigo-900/60 text-indigo-300' },
                  evaluating_test: { label: 'Avaliando', color: 'bg-purple-900/60 text-purple-300' },
                  resolved: { label: 'Resolvido', color: 'bg-emerald-900/60 text-emerald-300' },
                  escalated: { label: 'Alerta/Suporte', color: 'bg-rose-900/60 text-rose-300' },
                };
                const st = statusLabels[c.status] || { label: c.status, color: 'bg-slate-800 text-slate-300' };

                return (
                  <div
                    key={c.id}
                    onClick={() => handleOpenCase(c.id)}
                    className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{c.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {c.printer_model} • {c.filament_type} • {c.messages.length} mensagens
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(c.updated_at).toLocaleDateString('pt-BR')}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: KB Articles & Best Practices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Guia Técnico Fundamental</h2>
            </div>
            <button 
              onClick={() => setActiveTab('atlas')}
              className="text-xs text-blue-400 hover:underline"
            >
              Ver atlas
            </button>
          </div>

          <div className="space-y-3">
            {kbArticles.map(article => (
              <div 
                key={article.id}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{article.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {article.technology}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {article.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
