import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Copy, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Printer,
  Compass,
  FileText,
  WifiOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { DiagnosticCase, AIStructuredResponse, ChatMessage } from '../../types/index.ts';

export const DiagnosticsPage: React.FC = () => {
  const { 
    activeCaseId, 
    setActiveCaseId, 
    activePrinter, 
    userLevel, 
    initialChatPrompt, 
    setInitialChatPrompt,
    slicerVersion,
    isOfflineDemo
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<Array<{ fileName: string; mimeType: string; data: string }>>([]);
  const [currentCase, setCurrentCase] = useState<DiagnosticCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [testOutcomeNotes, setTestOutcomeNotes] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<'resolved' | 'improved' | 'not_resolved' | null>(null);
  const [expandedHypotheses, setExpandedHypotheses] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load existing case or prepare from initialChatPrompt
  useEffect(() => {
    if (activeCaseId) {
      fetch(`/api/cases/${activeCaseId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.case) {
            setCurrentCase(data.case);
          }
        })
        .catch(err => console.error('Error fetching case', err));
    } else {
      setCurrentCase(null);
      if (initialChatPrompt) {
        setInputMessage(initialChatPrompt);
        setInitialChatPrompt(null);
      }
    }
  }, [activeCaseId, initialChatPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCase?.messages, isSubmitting]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        const base64Clean = result.split(',')[1];
        setSelectedImages(prev => [
          ...prev,
          {
            fileName: file.name,
            mimeType: file.type,
            data: base64Clean,
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && selectedImages.length === 0) return;

    const messageText = inputMessage.trim() || 'Por favor, analise a imagem da peça impressa em anexo.';
    setInputMessage('');
    const imagesPayload = [...selectedImages];
    setSelectedImages([]);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: currentCase?.id,
          message: messageText,
          userLevel,
          context: {
            printer_model: activePrinter,
            nozzle_size: '0.4mm',
            filament_type: 'PLA',
            slicer_version: slicerVersion,
          },
          images: imagesPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.case) {
        setCurrentCase(data.case);
        setActiveCaseId(data.case.id);
      } else {
        alert(data.error || 'Erro ao enviar mensagem.');
      }
    } catch (err: any) {
      console.error('Error submitting chat message', err);
      alert('Erro de conexão ao processar diagnóstico.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteTestClick = (outcome: 'resolved' | 'improved' | 'not_resolved') => {
    setPendingOutcome(outcome);
    setShowTestModal(true);
  };

  const confirmTestOutcome = async () => {
    if (!currentCase || !currentCase.current_test || !pendingOutcome) return;

    try {
      const res = await fetch(`/api/cases/${currentCase.id}/tests/${currentCase.current_test.id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: pendingOutcome,
          notes: testOutcomeNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.case) {
        setCurrentCase(data.case);
        setShowTestModal(false);
        setTestOutcomeNotes('');
        setPendingOutcome(null);

        // If not resolved, trigger prompt to re-evaluate with AI
        if (pendingOutcome !== 'resolved') {
          setInputMessage(`Realizei o teste "${currentCase.current_test.name}". Resultado: ${pendingOutcome === 'improved' ? 'Melhorou um pouco, mas ainda não está perfeito.' : 'Não resolveu o problema.'} O que devemos testar agora?`);
        }
      }
    } catch (err) {
      console.error('Error recording test result', err);
    }
  };

  const copyDiagnosticPlan = () => {
    if (!currentCase) return;
    const planText = `[PLANO DE DIAGNÓSTICO PRINTMASTER 3D]
Caso: ${currentCase.title}
Impressora: ${currentCase.printer_model} | Filamento: ${currentCase.filament_type}
Status: ${currentCase.status}

Observações:
${currentCase.observations.map(o => `- ${o}`).join('\n')}

Hipóteses:
${currentCase.hypotheses.map(h => `- ${h.name} (${h.confidence})`).join('\n')}

Próximo Teste Recomendado:
${currentCase.current_test ? `${currentCase.current_test.name}\nPassos: ${currentCase.current_test.steps.join(' -> ')}` : 'Nenhum teste pendente.'}
`;
    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const downloadDiagnosticReport = () => {
    if (!currentCase) return;
    const reportJson = JSON.stringify(currentCase, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-${currentCase.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-7.5rem)] animate-fadeIn">
      {/* Left Area: Chat Timeline (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Chat Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              IA
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentCase?.title || 'Novo Atendimento Diagnóstico'}</span>
                {currentCase && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {currentCase.status}
                  </span>
                )}
                {isOfflineDemo && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>Demo Offline</span>
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                {activePrinter} • Modo {userLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentCase && (
              <>
                <button
                  onClick={copyDiagnosticPlan}
                  title="Copiar plano para área de transferência"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedPlan ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={downloadDiagnosticReport}
                  title="Baixar relatório em JSON"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              onClick={() => { setActiveCaseId(null); setCurrentCase(null); }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              Novo Caso
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Offline demo limitation disclaimer banner */}
          {isOfflineDemo && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block">Operando em Modo Demonstração Offline</strong>
                <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                  Neste modo, as consultas por inteligência artificial generativa em nuvem estão desligadas e os casos não são salvos em banco persistente. Respostas seguem o motor local e dados embutidos.
                </p>
              </div>
            </div>
          )}

          {!currentCase || currentCase.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white mb-1">Como podemos te ajudar hoje?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Descreva o que ocorreu com a peça impressa ou envie uma foto. O especialista fará uma análise física, formulará hipóteses concorrentes e proporá um teste seguro.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full max-w-lg mt-2">
                <button
                  onClick={() => setInputMessage('Minha peça começou a soltar nos cantos da mesa de PEI')}
                  className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 text-left"
                >
                  "Peça soltando nos cantos (Warping)"
                </button>
                <button
                  onClick={() => setInputMessage('Estou com muitos fiapos finos (stringing) ao imprimir PETG')}
                  className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 text-left"
                >
                  "Muitos fiapos (Stringing) em PETG"
                </button>
              </div>
            </div>
          ) : (
            currentCase.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : msg.sender === 'system'
                      ? 'bg-slate-800/80 border border-slate-700 text-slate-300 rounded-tl-xs'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs shadow-md'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-medium pb-1 border-b border-white/10">
                    <span>{msg.sender === 'user' ? 'Você' : msg.sender === 'system' ? 'Sistema' : 'Especialista PrintMaster'}</span>
                    <span>{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Attached images */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.attachments.map(att => (
                        <img
                          key={att.id}
                          src={att.data_url}
                          alt={att.file_name}
                          className="w-24 h-24 object-cover rounded-lg border border-white/20"
                        />
                      ))}
                    </div>
                  )}

                  {/* Main content */}
                  <p className="whitespace-pre-line text-xs font-normal">
                    {msg.content}
                  </p>

                  {/* Emergency Stop Banner if flagged */}
                  {msg.structured_data?.safety.level === 'stop' && (
                    <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500 text-rose-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                        <span>INTERRUPÇÃO IMEDIATA DE SEGURANÇA</span>
                      </div>
                      <p>{msg.structured_data.safety.message}</p>
                    </div>
                  )}

                  {/* Structured Question Prompt */}
                  {msg.structured_data?.next_question && (
                    <div className="p-2.5 rounded-lg bg-blue-900/30 border border-blue-500/30 text-blue-200 text-xs">
                      <strong>Pergunta de triagem:</strong> {msg.structured_data.next_question}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isSubmitting && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs animate-pulse max-w-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Analisando evidências físicas e consultando base...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input & Upload Bar */}
        <div className="p-3 bg-slate-850 border-t border-slate-800">
          {/* Thumbnails preview of pending uploads */}
          {selectedImages.length > 0 && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-800 rounded-lg">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt="Anexo"
                    className="w-12 h-12 object-cover rounded-md border border-slate-600"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <span className="text-[11px] text-slate-400">({selectedImages.length}/3 fotos selecionadas)</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Anexar foto da impressão com falha"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Descreva o problema ou responda à pergunta do especialista..."
              disabled={isSubmitting}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            <button
              type="submit"
              disabled={isSubmitting || (!inputMessage.trim() && selectedImages.length === 0)}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Area: Diagnostic Inspector & Test Execution (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full space-y-4 overflow-y-auto pr-1">
        {/* Active Test Card */}
        {currentCase?.current_test ? (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Próximo Teste Discriminativo</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                currentCase.current_test.risk === 'low' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Risco: {currentCase.current_test.risk}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              {currentCase.current_test.name}
            </h3>

            {/* Steps */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="text-[11px] font-semibold text-slate-400">Passos a executar:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                {currentCase.current_test.steps.map((st, i) => (
                  <li key={i} className="text-xs">{st}</li>
                ))}
              </ol>
            </div>

            {/* Expected Result */}
            {currentCase.current_test.expected_results.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-indigo-300">Resultado esperado: </strong>
                {currentCase.current_test.expected_results.join('; ')}
              </div>
            )}

            {/* Feedback Buttons */}
            <div className="pt-2 border-t border-indigo-900/50 flex flex-wrap gap-2">
              <button
                onClick={() => handleExecuteTestClick('resolved')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Resolveu</span>
              </button>
              <button
                onClick={() => handleExecuteTestClick('improved')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Melhorou</span>
              </button>
              <button
                onClick={() => handleExecuteTestClick('not_resolved')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Não Resolveu</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Nenhum teste de validação aguardando execução.</p>
          </div>
        )}

        {/* Hypotheses Accordion */}
        {currentCase && currentCase.hypotheses.length > 0 && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div 
              onClick={() => setExpandedHypotheses(!expandedHypotheses)}
              className="p-3.5 bg-slate-850 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Árvore de Hipóteses Concorrentes ({currentCase.hypotheses.length})</span>
              </div>
              {expandedHypotheses ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedHypotheses && (
              <div className="p-3.5 space-y-2.5 divide-y divide-slate-800/80">
                {currentCase.hypotheses.map(hyp => {
                  const confMap = {
                    possible: { label: 'Possível', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    probable: { label: 'Provável', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    confirmed: { label: 'Confirmado', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  };
                  const badge = confMap[hyp.confidence] || confMap.possible;

                  return (
                    <div key={hyp.id} className="pt-2 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{hyp.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      {hyp.for.length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          <strong className="text-emerald-400/90 font-medium">Sinais a favor:</strong> {hyp.for.join(', ')}
                        </p>
                      )}
                      {hyp.missing.length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          <strong className="text-slate-400 font-medium">O que falta testar:</strong> {hyp.missing.join(', ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Proposed Studio Parameter Changes */}
        {currentCase && currentCase.parameter_changes.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ajustes Sugeridos no Bambu Studio</span>
            </div>

            <div className="space-y-2">
              {currentCase.parameter_changes.map((change, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{change.key}</span>
                    <span className="text-[10px] text-blue-400 font-mono">{change.suggested} {change.unit}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    <strong>Menu:</strong> {change.menu}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {change.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test History Timeline */}
        {currentCase && currentCase.test_history.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-white">Histórico de Testes Deste Caso</h4>
            <div className="space-y-2">
              {currentCase.test_history.map(th => (
                <div key={th.id} className="p-2 rounded-lg bg-slate-800 text-[11px] flex items-center justify-between">
                  <div>
                    <strong className="text-slate-200">{th.test_name}</strong>
                    {th.user_notes && <p className="text-slate-400 text-[10px]">{th.user_notes}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    th.outcome === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                    th.outcome === 'improved' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {th.outcome === 'resolved' ? 'Resolveu' : th.outcome === 'improved' ? 'Melhorou' : 'Não resolveu'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Outcome Confirmation Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">
              Registrar Resultado do Teste
            </h3>
            <p className="text-xs text-slate-300">
              Você marcou que o teste <strong>{currentCase?.current_test?.name}</strong> gerou resultado:
              <span className="font-bold text-blue-400 ml-1">
                {pendingOutcome === 'resolved' ? 'Resolveu o problema' : pendingOutcome === 'improved' ? 'Melhorou' : 'Não resolveu'}
              </span>.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Observações do teste (opcional):
              </label>
              <textarea
                value={testOutcomeNotes}
                onChange={e => setTestOutcomeNotes(e.target.value)}
                placeholder="Ex: Cantos permaneceram retos, porém ainda há pequena marca visível..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmTestOutcome}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Confirmar e Atualizar Caso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
