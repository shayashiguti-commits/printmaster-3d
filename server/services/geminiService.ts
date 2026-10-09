import { GoogleGenAI } from '@google/genai';
import { AIStructuredResponseSchema } from '../schemas.ts';
import { AIStructuredResponse } from '../../src/types/index.ts';
import { kbService } from './kbService.ts';

// Server-side Gemini initialization using official @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_PROMPT = `Você é o PrintMaster 3D, um engenheiro especialista sênior em Manufatura Aditiva (FDM/FFF e SLA/MSLA), fatiamento no Bambu Studio e ecossistema Bambu Lab.

REGRAS DE CONDUTA E SEGURANÇA INVIOLÁVEIS:
1. SEGURANÇA ELÉTRICA E TÉRMICA (NÍVEL STOP): Se houver menção a fumaça, cheiro de queimado, fio/cabo derretido, faísca, erro persistente de aquecimento anormal (Thermal Runaway), PARE imediatamente! Defina "safety.level = 'stop'". Bloqueie qualquer instrução de ajuste de parâmetros, ordene desligar da tomada com segurança e acionar o suporte do fabricante. NUNCA sugira bypass de sensores ou fusíveis.
2. RIGOR COM BAMBU LAB: Em impressoras Bambu Lab (A1, A1 mini, P1S, X1C), NUNCA prescreva VREF manual, E-steps, calibração PID manual por G-code ou Z-offset manual destrutivo. Utilize sempre os procedimentos oficiais de calibração automática da máquina e do Bambu Studio.
3. SEPARAÇÃO METODOLÓGICA:
   - "observations": Apenas fatos visíveis ou relatados (ex: "Canto inferior esquerdo da peça encurvado para cima em 2mm").
   - "hypotheses": Até 4 causas concorrentes fundamentadas, com sinais a favor, contra e o que falta testar. NUNCA afirme certeza absoluta por foto ou mensagem curta. Confiança: 'possible', 'probable' ou 'confirmed' (apenas se validada por teste do usuário).
   - "next_test": Proponha UM teste discriminativo, de baixo risco e reversível por vez (ex: lavar placa com detergente ou imprimir torre de retração).
4. MENUS DO BAMBU STUDIO: Só informe o caminho do menu ("menu") se estiver conferido na base de conhecimento. Se a versão ou localização não estiver garantida, indique "Localização a confirmar na versão informada".
5. NÃO INVENTE DADOS: Nunca invente valores de perfil, tempo de impressão exato, massa em gramas ou resultado de fatiamento sem que um fatiador real tenha executado.
6. ADAPTAÇÃO AO NÍVEL DO USUÁRIO:
   - Iniciante: Termos simples, explicações sem jargão pesado, um passo por vez.
   - Intermediário: Justificativa breve, compensações de parâmetros (trade-offs).
   - Especialista: Mecanismos físicos, reologia dos polímeros, dinâmica de vazão volumétrica.
7. RESPOSTA EM PORTUGUÊS DO BRASIL no formato JSON rigoroso.`;

export class GeminiExpertService {
  /**
   * Evaluates if message represents an electrical/thermal hazard
   */
  private checkEmergencyHazards(text: string): { isHazard: boolean; reason: string } {
    const lower = text.toLowerCase();
    const hazardTerms = [
      'fumaça', 'fumaca', 'cheiro de queimado', 'fio derretido', 
      'cabo derretido', 'pegando fogo', 'faísca', 'faisca', 'curto circuito',
      'curto-circuito', 'conector queimado', 'estalo com fumaça'
    ];

    for (const term of hazardTerms) {
      if (lower.includes(term)) {
        return {
          isHazard: true,
          reason: `Risco crítico de segurança identificado: "${term}". A impressora deve ser desligada imediatamente.`
        };
      }
    }
    return { isHazard: false, reason: '' };
  }

  async analyzeAndRespond(params: {
    message: string;
    userLevel: 'Iniciante' | 'Intermediário' | 'Especialista';
    context?: {
      printer_model?: string;
      nozzle_size?: string;
      filament_type?: string;
      plate_type?: string;
      slicer_version?: string;
    };
    images?: Array<{ fileName: string; mimeType: string; data: string }>;
    historySummary?: string;
  }): Promise<AIStructuredResponse> {
    const { message, userLevel, context, images } = params;

    // 1. Immediate Safety Pre-check
    const hazard = this.checkEmergencyHazards(message);
    if (hazard.isHazard) {
      return {
        intent: 'hardware',
        safety: {
          level: 'stop',
          message: `${hazard.reason} Desligue a impressora da tomada com segurança. Não tente reiniciar a impressão e contate o suporte técnico autorizado.`,
        },
        context: {
          printer: context?.printer_model || null,
          slicer_version: context?.slicer_version || null,
          material: context?.filament_type || null,
        },
        observations: ['Indício de superaquecimento anormal, odor elétrico ou componente danificado relatado.'],
        hypotheses: [
          {
            name: 'Falha em circuito elétrico, curto em aquecedor ou queima de conector',
            confidence: 'probable',
            for: [message],
            against: [],
            missing: ['Inspeção física desenergizada por técnico']
          }
        ],
        next_question: null,
        next_test: null,
        parameter_changes: [],
        sources: [
          {
            title: 'Protocolo Universal de Segurança - PrintMaster 3D',
            url_or_document: 'Sistema FAQ Impressão 3D',
            section_or_page: 'Segurança em Defeitos Elétricos',
            evidence_level: 'critical_safety_rule'
          }
        ],
        cannot_verify: [],
        user_summary: 'ATENÇÃO: Operação suspensa por segurança devido a risco elétrico/térmico.',
        answer: 'PARADA IMEDIATA DE SEGURANÇA: Identificamos risco térmico ou elétrico na sua descrição. Por favor, desligue imediatamente a máquina da tomada. Não altere configurações de software nem tente contornar o problema.'
      };
    }

    // 2. Retrieve grounded knowledge base context
    const kbContext = await kbService.buildPromptContext(message, {
      printer: context?.printer_model,
      material: context?.filament_type,
      slicer_version: context?.slicer_version,
    });

    // 3. Prepare prompt and contents
    const promptInstructions = `
${kbContext}

CONTEXTO DO EQUIPAMENTO INFORMADO PELO USUÁRIO:
- Impressora: ${context?.printer_model || 'Não informada'}
- Bico: ${context?.nozzle_size || '0.4mm (padrão assumido)'}
- Filamento: ${context?.filament_type || 'Não informado'}
- Placa: ${context?.plate_type || 'Não informada'}
- Versão Bambu Studio: ${context?.slicer_version || 'Não informada'}
- Nível de Experiência: ${userLevel}

MENSAGEM DO USUÁRIO:
"${message}"

${params.historySummary ? `HISTÓRICO RECENTE DO CASO:\n${params.historySummary}` : ''}

INSTRUÇÕES DO SCHEMA JSON:
Você DEVE responder com um JSON válido conforme esta estrutura:
{
  "intent": "diagnose" | "prepare" | "explain_setting" | "calibrate" | "hardware" | "other",
  "safety": { "level": "normal" | "caution" | "stop", "message": string | null },
  "context": { "printer": string | null, "slicer_version": string | null, "material": string | null },
  "observations": string[],
  "hypotheses": [
    { "name": string, "confidence": "possible" | "probable" | "confirmed", "for": string[], "against": string[], "missing": string[] }
  ],
  "next_question": string | null,
  "next_test": { "name": string, "steps": string[], "expected_results": string[], "risk": "low" | "moderate" | "high" } | null,
  "parameter_changes": [
    { "key": string, "menu": string, "current": string | null, "suggested": string | null, "unit": string, "reason": string, "verified_compatibility": boolean }
  ],
  "sources": [
    { "title": string, "url_or_document": string, "section_or_page": string, "evidence_level": string }
  ],
  "cannot_verify": string[],
  "user_summary": string,
  "answer": string
}
`;

    const parts: any[] = [{ text: promptInstructions }];

    // Add image parts if provided
    if (images && images.length > 0) {
      for (const img of images) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: img.data,
          },
        });
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2, // low temperature for high technical precision
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);

      // Validate with Zod
      const validated = AIStructuredResponseSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      } else {
        console.warn('[GeminiService] Zod validation had warnings:', validated.error);
        // Fill safe defaults over the raw parsed object
        return {
          intent: parsed.intent || 'diagnose',
          safety: parsed.safety || { level: 'normal', message: null },
          context: parsed.context || { printer: null, slicer_version: null, material: null },
          observations: Array.isArray(parsed.observations) ? parsed.observations : [message],
          hypotheses: Array.isArray(parsed.hypotheses) ? parsed.hypotheses : [],
          next_question: parsed.next_question || null,
          next_test: parsed.next_test || null,
          parameter_changes: Array.isArray(parsed.parameter_changes) ? parsed.parameter_changes : [],
          sources: Array.isArray(parsed.sources) ? parsed.sources : [],
          cannot_verify: Array.isArray(parsed.cannot_verify) ? parsed.cannot_verify : [],
          user_summary: parsed.user_summary || 'Análise de impressão 3D realizada.',
          answer: parsed.answer || parsed.user_summary || '',
        };
      }
    } catch (err: any) {
      console.error('[GeminiService] Error calling Gemini API:', err);
      // Resilient local fallback when API key is missing or offline
      return {
        intent: 'diagnose',
        safety: { level: 'normal', message: null },
        context: {
          printer: context?.printer_model || null,
          slicer_version: context?.slicer_version || null,
          material: context?.filament_type || null,
        },
        observations: ['Mensagem recebida com sucesso.', `Sintoma relatado: "${message}"`],
        hypotheses: [
          {
            name: 'Possível problema de adesão ou temperatura de filamento',
            confidence: 'possible',
            for: ['Sintoma relatado pelo usuário'],
            against: [],
            missing: ['Informação detalhada de placa e material']
          }
        ],
        next_question: context?.printer_model ? 'A falha ocorreu na primeira camada ou após várias horas de impressão?' : 'Qual o modelo exato da sua impressora e o material utilizado?',
        next_test: {
          name: 'Verificação inicial de mesa e primeira camada',
          steps: [
            'Lavar a placa com detergente neutro e água morna',
            'Conferir se o tipo de placa no Bambu Studio bate com a placa física',
            'Realizar impressão teste de 1 camada'
          ],
          expected_results: ['Linhas coladas de forma homogênea sem cantos levantados'],
          risk: 'low'
        },
        parameter_changes: [],
        sources: [
          {
            title: 'Base de Conhecimento Local PrintMaster 3D',
            url_or_document: 'initialKnowledgeBase.json',
            section_or_page: 'Rotina T01',
            evidence_level: 'standard_practice'
          }
        ],
        cannot_verify: ['Conexão online com modelo Gemini em processamento'],
        user_summary: 'Diagnóstico preliminar gerado com base nas diretrizes técnicas locais.',
        answer: `Recebemos seu relato sobre "${message}". O primeiro passo recomendado antes de qualquer alteração de parâmetros no fatiador é conferir a limpeza da mesa e a correspondência entre a placa física e o perfil selecionado no Bambu Studio.`
      };
    }
  }
}

export const geminiExpertService = new GeminiExpertService();
