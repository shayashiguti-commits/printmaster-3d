import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Segurança, Privacidade & Termos de Uso</h1>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          O PrintMaster 3D adota princípios rigorosos de conformidade técnica, proteção de dados e integridade de equipamentos.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Isenção de Responsabilidade para Peças Críticas e Aplicações Reguladas</span>
        </div>
        <p className="leading-relaxed">
          Nenhuma recomendação gerada por modelos de inteligência artificial substitui ensaios mecânicos de laboratório, cálculos estruturais de engenharia ou homologações de conformidade. Peças sujeitas a cargas extremas, contato com alimentos, aplicações médicas, aeroespaciais ou de segurança humana NUNCA devem ser validadas apenas com base em orientações de fatiamento de software.
        </p>
      </div>

      {/* Security Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-white text-xs">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Chaves de API & Proteção de Segredos</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nenhuma chave de API (como <code>GEMINI_API_KEY</code>) trafega para o navegador ou console do cliente. Todas as chamadas para o modelo multimodal ocorrem exclusivamente em rotas protegidas no servidor.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-white text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Nenhum Envio de G-Code Não Autorizado</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            O PrintMaster 3D neste MVP atua de forma exclusivamente consultiva e analítica. O aplicativo não estabelece conexão direta MQTT ou serial com impressoras e não envia comandos destrutivos à sua máquina.
          </p>
        </div>
      </div>

      {/* Data Protection / LGPD */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300">
        <h3 className="text-sm font-bold text-white">Privacidade de Dados & Tratamento de Imagens (LGPD)</h3>
        <p className="leading-relaxed">
          • As fotos anexadas para diagnóstico são utilizadas apenas para inspeção de falhas físicas (warping, stringing, patas de elefante).<br />
          • Você possui o direito e a capacidade de excluir qualquer caso e seus anexos diretamente na aba "Histórico" a qualquer momento.<br />
          • Arquivos 3D enviados (STL e 3MF) são inspecionados geometricamente sem persistência de dados pessoais e protegidos contra exploração de arquivos corrompidos.
        </p>
      </div>
    </div>
  );
};
