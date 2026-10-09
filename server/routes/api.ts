import { Router, Request, Response } from 'express';
import { repository } from '../db/repository.ts';
import { kbService } from '../services/kbService.ts';
import { geminiExpertService } from '../services/geminiService.ts';
import { fileAnalysisService } from '../services/fileAnalysisService.ts';
import { qaSuiteService } from '../services/qaSuiteService.ts';
import { ChatRequestSchema, TestResultSubmissionSchema, FeedbackSubmissionSchema, EquipmentCreationSchema } from '../schemas.ts';
import { DiagnosticCase, CaseStatus } from '../../src/types/index.ts';
import { 
  INFILL_COMPARISON_GUIDELINES, 
  NOZZLE_COLLISION_INDICATORS,
  QA_ACCEPTANCE_TESTS_V3
} from '../../src/data/knowledgeBaseV3.ts';

export const apiRouter = Router();

// Helper to extract authenticated user ID from request (defaulting to standard user)
function getAuthUserId(req: Request): string {
  const headerUser = req.headers['x-user-id'];
  if (typeof headerUser === 'string' && headerUser.trim().length > 0) {
    return headerUser.trim();
  }
  return 'default_user';
}

function getAuthUserRole(req: Request): string {
  const headerRole = req.headers['x-user-role'];
  if (typeof headerRole === 'string' && headerRole.trim().length > 0) {
    return headerRole.trim();
  }
  return 'user';
}

// ==========================================
// 1. Knowledge Base & Atlas Routes
// ==========================================

apiRouter.get('/kb/status', async (req: Request, res: Response) => {
  try {
    const params = await repository.getParameters();
    const failures = await repository.getFailures();
    const sources = await repository.getSources();
    res.json({
      success: true,
      storageMode: repository.storageMode,
      storageModeNotice: 'Armazenamento persistente local ativo no servidor (data/runtime_db.json). Pronto para conectar Supabase ou Firestore via adaptador IPersistentRepository.',
      totalParameters: params.length,
      totalFailures: failures.length,
      totalSources: sources.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/kb/seed', async (req: Request, res: Response) => {
  try {
    const result = await kbService.seedKnowledgeBase();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kb/coverage', async (req: Request, res: Response) => {
  try {
    const version = typeof req.query.version === 'string' ? req.query.version : 'v01.09+';
    const coverage = await kbService.getKnowledgeCoverage(version);
    res.json({ success: true, coverage });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kb/sources', async (req: Request, res: Response) => {
  try {
    const sources = await repository.getSources();
    res.json({ success: true, sources });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kb/failures', async (req: Request, res: Response) => {
  try {
    const failures = await repository.getFailures();
    res.json({ success: true, failures });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kb/tests', async (req: Request, res: Response) => {
  try {
    const tests = await repository.getTests();
    res.json({ success: true, tests });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kb/articles', async (req: Request, res: Response) => {
  try {
    const articles = await repository.getArticles();
    res.json({ success: true, articles });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/studio/parameters', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.query === 'string' ? req.query.query : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const printer = typeof req.query.printer === 'string' ? req.query.printer : undefined;
    const version = typeof req.query.version === 'string' ? req.query.version : undefined;

    const results = await kbService.searchKnowledge(query, { category, printer, version });
    res.json({ success: true, parameters: results.parameters });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/studio/parameters/:id', async (req: Request, res: Response) => {
  try {
    const param = await repository.getParameterById(req.params.id);
    if (!param) {
      return res.status(404).json({ error: 'Parâmetro não encontrado.' });
    }
    const sources = await repository.getSources();
    const relatedSources = sources.filter(s => param.source_ids?.includes(s.id));
    res.json({ success: true, parameter: param, sources: relatedSources });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 1.1 Infill Patterns & V3 Hardware Routes
// ==========================================

apiRouter.get('/infill/patterns', async (_req: Request, res: Response) => {
  try {
    const patterns = await repository.getInfillPatterns();
    res.json({ success: true, count: patterns.length, patterns });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/infill/compare', async (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      guidelines: INFILL_COMPARISON_GUIDELINES,
      indicators: NOZZLE_COLLISION_INDICATORS,
      disclaimer: 'Não existe ranking universal "mais resistente": a resistência funcional é dominada por orientação, contorno de paredes e natureza do esforço.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/printers', async (_req: Request, res: Response) => {
  try {
    const printers = await repository.getPrinterSpecs();
    res.json({ success: true, count: printers.length, printers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/printers/:printerId/filaments', async (req: Request, res: Response) => {
  try {
    const { printerId } = req.params;
    const nozzleMaterial = req.query.nozzleMaterial as string | undefined;
    const feed = req.query.feed as string | undefined;
    const nozzle = req.query.nozzle ? parseFloat(req.query.nozzle as string) : undefined;
    const explicitSearch = req.query.search === 'true' || req.query.explicit === 'true';

    const result = await repository.getFilteredFilaments(printerId, {
      nozzleMaterial,
      feedSystem: feed,
      nozzleDiameter: nozzle,
      explicitSearch
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/faq/targeted', async (_req: Request, res: Response) => {
  try {
    const list = await repository.getTargetedFaq();
    res.json({ success: true, count: list.length, faqs: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/qa/scenarios-v3', async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, scenarios: QA_ACCEPTANCE_TESTS_V3 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. Chat & Diagnostics Pipeline
// ==========================================

apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dados da requisição inválidos.', details: parsed.error.issues });
    }

    const { message, userLevel, context, images, caseId } = parsed.data;

    // Load or instantiate Diagnostic Case
    let currentCase: DiagnosticCase | null = null;
    if (caseId) {
      currentCase = await repository.getCaseById(caseId, userId);
    }

    const isNewCase = !currentCase;
    if (!currentCase) {
      currentCase = {
        id: `case-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        user_id: userId,
        title: message.length > 50 ? `${message.slice(0, 47)}...` : message,
        status: 'collecting_context',
        technology: 'FDM',
        printer_model: context?.printer_model || 'Bambu Lab P1S',
        nozzle_size: context?.nozzle_size || '0.4mm',
        filament_type: context?.filament_type || 'PLA',
        plate_type: context?.plate_type || 'Textured PEI Plate',
        slicer_version: context?.slicer_version || 'v01.09+',
        symptom_description: message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        observations: [],
        hypotheses: [],
        test_history: [],
        parameter_changes: [],
        messages: [],
        images: [],
      };
    }

    // Save uploaded images to case attachments
    if (images && images.length > 0) {
      for (const img of images) {
        currentCase.images.push({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file_name: img.fileName,
          file_type: img.mimeType,
          data_url: `data:${img.mimeType};base64,${img.data}`,
          uploaded_at: new Date().toISOString(),
        });
      }
    }

    // Add user message to history
    currentCase.messages.push({
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      content: message,
      created_at: new Date().toISOString(),
      attachments: images && images.length > 0 ? currentCase.images.slice(-images.length) : undefined,
    });

    // Build brief history context from last 3 exchanges
    const recentMessages = currentCase.messages.slice(-4)
      .map(m => `${m.sender.toUpperCase()}: ${m.content}`)
      .join('\n');

    // Run Gemini Expert Engine
    const aiResponse = await geminiExpertService.analyzeAndRespond({
      message,
      userLevel,
      context: {
        printer_model: currentCase.printer_model,
        nozzle_size: currentCase.nozzle_size,
        filament_type: currentCase.filament_type,
        plate_type: currentCase.plate_type,
        slicer_version: currentCase.slicer_version,
      },
      images,
      historySummary: recentMessages,
    });

    // Update case state machine
    if (aiResponse.safety.level === 'stop') {
      currentCase.status = 'escalated';
    } else if (aiResponse.next_test) {
      currentCase.status = 'awaiting_test';
      currentCase.current_test = {
        id: `test-plan-${Date.now()}`,
        name: aiResponse.next_test.name,
        steps: aiResponse.next_test.steps,
        expected_results: aiResponse.next_test.expected_results,
        risk: aiResponse.next_test.risk,
      };
    } else if (aiResponse.hypotheses.length > 0) {
      currentCase.status = 'hypotheses';
    }

    // Merge observations and hypotheses
    currentCase.observations = Array.from(new Set([...currentCase.observations, ...aiResponse.observations]));
    currentCase.hypotheses = aiResponse.hypotheses.map(h => ({
      id: `hyp-${Math.random().toString(36).slice(2, 7)}`,
      name: h.name,
      confidence: h.confidence,
      for: h.for,
      against: h.against,
      missing: h.missing,
    }));
    currentCase.parameter_changes = aiResponse.parameter_changes;
    currentCase.updated_at = new Date().toISOString();

    // Add assistant response
    currentCase.messages.push({
      id: `msg-${Date.now()}-a`,
      sender: 'assistant',
      content: aiResponse.answer || aiResponse.user_summary,
      structured_data: aiResponse,
      created_at: new Date().toISOString(),
    });

    // Persist case
    await repository.saveCase(currentCase);

    res.json({
      success: true,
      caseId: currentCase.id,
      case: currentCase,
      response: aiResponse,
    });
  } catch (err: any) {
    console.error('[API /chat] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. Case Management Routes
// ==========================================

apiRouter.get('/cases', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const cases = await repository.listCases(userId);
    res.json({ success: true, cases });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/cases/:id', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const found = await repository.getCaseById(req.params.id, userId);
    if (!found) {
      return res.status(404).json({ error: 'Caso não encontrado ou acesso não autorizado.' });
    }
    res.json({ success: true, case: found });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/cases/:id', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const deleted = await repository.deleteCase(req.params.id, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Caso não encontrado ou não permitido.' });
    }
    res.json({ success: true, message: 'Caso excluído com sucesso.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/cases/:id/tests/:testId/result', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const currentCase = await repository.getCaseById(req.params.id, userId);
    if (!currentCase) {
      return res.status(404).json({ error: 'Caso não encontrado.' });
    }

    const parsed = TestResultSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dados inválidos.', details: parsed.error.issues });
    }

    const { outcome, notes, photoAfterDataUrl } = parsed.data;

    // Record test result
    currentCase.test_history.push({
      id: req.params.testId,
      test_name: currentCase.current_test?.name || 'Teste de validação',
      executed_at: new Date().toISOString(),
      outcome,
      user_notes: notes,
      photo_after_url: photoAfterDataUrl,
    });

    // Advance State Machine
    if (outcome === 'resolved') {
      currentCase.status = 'resolved';
      currentCase.confirmed_at = new Date().toISOString();
      currentCase.messages.push({
        id: `msg-sys-${Date.now()}`,
        sender: 'system',
        content: `Resultado registrado: Resolvido com sucesso! O teste "${currentCase.current_test?.name}" sanou o problema. Solução arquivada no histórico.`,
        created_at: new Date().toISOString(),
      });
    } else if (outcome === 'improved') {
      currentCase.status = 'evaluating_test';
      currentCase.messages.push({
        id: `msg-sys-${Date.now()}`,
        sender: 'system',
        content: `Resultado registrado: Melhorou parcialmente. Vamos calibrar os parâmetros complementares ou avançar para a próxima hipótese.`,
        created_at: new Date().toISOString(),
      });
    } else {
      // not_resolved
      currentCase.status = 'evaluating_test';
      currentCase.messages.push({
        id: `msg-sys-${Date.now()}`,
        sender: 'system',
        content: `Resultado registrado: Não resolveu. A hipótese anterior foi descartada como causa principal. O caso permanece aberto para a próxima hipótese concorrente.`,
        created_at: new Date().toISOString(),
      });
    }

    currentCase.updated_at = new Date().toISOString();
    await repository.saveCase(currentCase);

    res.json({ success: true, case: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. 3D Model File Analysis Routes
// ==========================================

apiRouter.post('/files/analyze-stl', async (req: Request, res: Response) => {
  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data é obrigatório.' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const analysis = fileAnalysisService.parseStl(buffer, fileName || 'modelo.stl');
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/files/analyze-3mf', async (req: Request, res: Response) => {
  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data é obrigatório.' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const analysis = fileAnalysisService.inspect3Mf(buffer, fileName || 'projeto.3mf');
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 5. Equipment & Materials Routes
// ==========================================

apiRouter.get('/equipment', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const list = await repository.listEquipment(userId);
    res.json({ success: true, equipment: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/equipment', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = EquipmentCreationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dados inválidos.', details: parsed.error.issues });
    }

    const newEquip = {
      id: `eq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...parsed.data,
    };
    const saved = await repository.saveEquipment(userId, newEquip);
    res.json({ success: true, equipment: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/equipment/:id', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const success = await repository.deleteEquipment(req.params.id, userId);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/printer-models', async (req: Request, res: Response) => {
  try {
    const printers = await repository.getPrinters();
    res.json({ success: true, printers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/filaments', async (req: Request, res: Response) => {
  try {
    const filaments = await repository.getFilaments();
    res.json({ success: true, filaments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. QA Test Suite Runner & Admin Audit Logs
// ==========================================

apiRouter.get('/tests/run-qa-suite', async (req: Request, res: Response) => {
  try {
    const testResults = await qaSuiteService.runAllTests();
    await repository.addAuditLog({
      actor: 'Admin Test Suite',
      event: 'RUN_QA_SUITE',
      target: 'QA01_QA10',
      change_summary: `Suíte executada: ${testResults.summary.passed}/${testResults.summary.total} testes aprovados.`,
    });
    res.json({ success: true, ...testResults });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await repository.getAuditLogs();
    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/feedback', async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const parsed = FeedbackSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dados inválidos.', details: parsed.error.issues });
    }
    await repository.recordFeedback({
      caseId: parsed.data.caseId,
      vote: parsed.data.vote,
      comment: parsed.data.comment,
      userId,
    });
    res.json({ success: true, message: 'Feedback gravado com sucesso.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. V3 Investigative Dossier Routes
// ==========================================

apiRouter.get('/v3/infill-patterns', async (req: Request, res: Response) => {
  try {
    const patterns = await repository.getInfillPatterns();
    res.json({ success: true, total: patterns.length, patterns });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/v3/printer-specs', async (req: Request, res: Response) => {
  try {
    const printers = await repository.getPrinterSpecs();
    res.json({ success: true, total: printers.length, printers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/v3/filament-catalog', async (req: Request, res: Response) => {
  try {
    const filaments = await repository.getFilamentCatalog();
    res.json({ success: true, total: filaments.length, filaments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/v3/printer-filaments', async (req: Request, res: Response) => {
  try {
    const model = (req.query.model as string) || '';
    const nozzle = req.query.nozzle ? parseFloat(req.query.nozzle as string) : undefined;
    const hotend = req.query.hotend as string | undefined;
    const ams = req.query.ams === 'true';
    const feeder = req.query.feeder as any;
    const version = (req.query.version as string) || 'v2.0';

    if (!model) {
      return res.status(400).json({ 
        error: 'Impressora é obrigatória (ex: model=Bambu Lab P1S). Fail-closed exige seleção explícita.' 
      });
    }

    const filtered = await repository.getFilteredFilaments(model, {
      nozzle_diameter: nozzle,
      hotend_type: hotend,
      ams_slot: ams,
      feeder_type: feeder,
      studio_version: version
    });

    res.json({ success: true, ...filtered });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/v3/targeted-faq', async (req: Request, res: Response) => {
  try {
    const faq = await repository.getTargetedFaq();
    res.json({ success: true, total: faq.length, faq });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

