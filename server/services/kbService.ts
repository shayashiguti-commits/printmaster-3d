import fs from 'fs';
import path from 'path';
import { repository } from '../db/repository.ts';
import { StudioParameter, FailureType, DiagnosticTest, KBArticle, KnowledgeSource } from '../../src/types/index.ts';

export interface SearchResults {
  parameters: StudioParameter[];
  failures: FailureType[];
  articles: KBArticle[];
  tests: DiagnosticTest[];
  sources: KnowledgeSource[];
  query: string;
}

export interface CoverageReport {
  version: string;
  totalParameters: number;
  verifiedCount: number;
  pendingCount: number;
  coveragePercentage: number;
  byCategory: Record<string, { total: number; verified: number; pending: number }>;
  disclaimer: string;
}

export class KnowledgeBaseService {
  /**
   * Search knowledge base across parameters (PT & EN names, config_key, description),
   * failure types, articles and tests.
   */
  async searchKnowledge(query: string, filters?: {
    category?: string;
    printer?: string;
    version?: string;
  }): Promise<SearchResults> {
    const rawQ = (query || '').toLowerCase().trim();
    // Normalize accents for resilient PT search (e.g. 'altura da camada', 'vazao')
    const q = rawQ.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const [allParams, allFailures, allArticles, allTests, allSources] = await Promise.all([
      repository.getParameters(),
      repository.getFailures(),
      repository.getArticles(),
      repository.getTests(),
      repository.getSources(),
    ]);

    const normalize = (str?: string | null) => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Filter parameters
    let matchedParams = allParams.filter(p => {
      if (filters?.category && filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      if (!q) return true;

      const pt = normalize(p.name_pt);
      const en = normalize(p.name_en);
      const key = normalize(p.config_key);
      const desc = normalize(p.description);

      return pt.includes(q) || en.includes(q) || key.includes(q) || desc.includes(q);
    });

    // 2. Filter failures
    let matchedFailures = allFailures.filter(f => {
      if (!q) return true;
      const name = normalize(f.name);
      const hyp = f.diagnostic_hypotheses.map(normalize).join(' ');
      const check = normalize(f.first_safe_check);
      const tags = f.tags.map(normalize).join(' ');

      return name.includes(q) || hyp.includes(q) || check.includes(q) || tags.includes(q);
    });

    // 3. Filter articles
    let matchedArticles = allArticles.filter(a => {
      if (!q) return true;
      const title = normalize(a.title);
      const body = normalize(a.body);
      const tags = a.tags.map(normalize).join(' ');

      return title.includes(q) || body.includes(q) || tags.includes(q);
    });

    // 4. Filter tests
    let matchedTests = allTests.filter(t => {
      if (!q) return true;
      const name = normalize(t.name);
      const obj = normalize(t.objective);

      return name.includes(q) || obj.includes(q);
    });

    return {
      parameters: matchedParams.slice(0, 20),
      failures: matchedFailures.slice(0, 10),
      articles: matchedArticles.slice(0, 5),
      tests: matchedTests.slice(0, 5),
      sources: allSources,
      query,
    };
  }

  /**
   * Generates a grounded context block for Gemini from retrieved records.
   */
  async buildPromptContext(query: string, caseContext?: { printer?: string; material?: string; slicer_version?: string }): Promise<string> {
    const search = await this.searchKnowledge(query, {
      printer: caseContext?.printer,
      version: caseContext?.slicer_version,
    });

    let contextText = `=== BASE DE CONHECIMENTO DISPONÍVEL (FONTE VERIFICADA) ===\n`;

    if (search.failures.length > 0) {
      contextText += `\n[FALHAS E SINTOMAS IDENTIFICADOS]:\n`;
      search.failures.slice(0, 3).forEach(f => {
        contextText += `- Código ${f.id} (${f.technology}): ${f.name}\n`;
        contextText += `  Hipóteses da base: ${f.diagnostic_hypotheses.join('; ')}\n`;
        contextText += `  Primeira checagem segura: ${f.first_safe_check}\n`;
        contextText += `  Risco de segurança: ${f.risk}\n`;
      });
    }

    if (search.parameters.length > 0) {
      contextText += `\n[PARÂMETROS RELEVANTES DO BAMBU STUDIO]:\n`;
      search.parameters.slice(0, 5).forEach(p => {
        contextText += `- ${p.name_pt} (EN: ${p.name_en}, Chave: ${p.config_key || 'n/a'})\n`;
        contextText += `  Categoria: ${p.category} | Menu verificado: ${p.menu_path_validated ? p.menu_path : 'Localização a confirmar'}\n`;
        contextText += `  Descrição: ${p.description} (Unidade: ${p.unit || 'n/a'})\n`;
      });
    }

    if (search.articles.length > 0) {
      contextText += `\n[ARTIGOS TÉCNICOS / BOAS PRÁTICAS]:\n`;
      search.articles.slice(0, 2).forEach(a => {
        contextText += `- ${a.title}: ${a.body}\n`;
      });
    }

    if (search.tests.length > 0) {
      contextText += `\n[ROTINAS DE TESTE DE BAIXO RISCO]:\n`;
      search.tests.slice(0, 2).forEach(t => {
        contextText += `- ${t.name} (${t.technology}): ${t.objective}\n`;
        contextText += `  Passos: ${t.procedure_steps.join(' -> ')}\n`;
        contextText += `  Critério de sucesso: ${t.pass_conditions}\n`;
      });
    }

    contextText += `\n[FONTES OFICIAIS CITADAS]: BambuStudio PrintConfig.cpp, BBL profiles, Ellis Tuning Guide, FAQ Impressão 3D PDF.\n`;
    contextText += `AVISO DE PRECISÃO: Não invente menus ou números ausentes. Se algo não estiver confirmado na versão ${caseContext?.slicer_version || 'atual'}, declare como "a confirmar".`;

    return contextText;
  }

  /**
   * Calculates knowledge base coverage report.
   */
  async getKnowledgeCoverage(targetVersion: string = 'v01.09+'): Promise<CoverageReport> {
    const params = await repository.getParameters();

    const byCategory: Record<string, { total: number; verified: number; pending: number }> = {};
    let totalVerified = 0;

    for (const p of params) {
      if (!byCategory[p.category]) {
        byCategory[p.category] = { total: 0, verified: 0, pending: 0 };
      }
      byCategory[p.category].total += 1;

      if (p.menu_path_validated && p.compatibility_status === 'verified') {
        byCategory[p.category].verified += 1;
        totalVerified += 1;
      } else {
        byCategory[p.category].pending += 1;
      }
    }

    const total = params.length;
    const percentage = total > 0 ? Math.round((totalVerified / total) * 100) : 0;

    return {
      version: targetVersion,
      totalParameters: total,
      verifiedCount: totalVerified,
      pendingCount: total - totalVerified,
      coveragePercentage: percentage,
      byCategory,
      disclaimer: "O percentual reflete os campos com localização de menu e chave validados na versão de referência. Nunca declare 100% sem auditoria visual completa de todos os diálogos do software.",
    };
  }

  /**
   * Idempotent seed function
   */
  async seedKnowledgeBase(): Promise<{ seeded: boolean; message: string }> {
    const initialSeedPath = path.resolve(process.cwd(), 'data', 'initialKnowledgeBase.json');
    if (!fs.existsSync(initialSeedPath)) {
      return { seeded: false, message: 'Arquivo initialKnowledgeBase.json não encontrado.' };
    }

    const raw = fs.readFileSync(initialSeedPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.parameters) {
      await repository.saveParameters(parsed.parameters);
      await repository.addAuditLog({
        actor: 'Admin UI',
        event: 'RESEED_KB',
        target: 'parameters',
        change_summary: `Base de dados reinserida com ${parsed.parameters.length} parâmetros e ${parsed.failure_types?.length || 0} falhas.`
      });
      return { seeded: true, message: `Base recarregada com sucesso (${parsed.parameters.length} parâmetros).` };
    }
    return { seeded: false, message: 'Estrutura JSON inválida.' };
  }
}

export const kbService = new KnowledgeBaseService();
