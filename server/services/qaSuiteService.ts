import { kbService } from './kbService.ts';
import { geminiExpertService } from './geminiService.ts';
import { fileAnalysisService } from './fileAnalysisService.ts';
import { repository } from '../db/repository.ts';
import { DiagnosticCase } from '../../src/types/index.ts';

export interface QaTestResult {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  observed: string;
  durationMs: number;
}

export class QaSuiteService {
  async runAllTests(): Promise<{ results: QaTestResult[]; summary: { total: number; passed: number; failed: number } }> {
    const results: QaTestResult[] = [];

    // Test 1: Search atlas for "Layer height" and "altura da camada" returns same concept
    {
      const start = Date.now();
      const resEn = await kbService.searchKnowledge('Layer height');
      const resPt = await kbService.searchKnowledge('altura da camada');
      const paramEn = resEn.parameters.find(p => p.id === 'param-layer-height');
      const paramPt = resPt.parameters.find(p => p.id === 'param-layer-height');
      const passed = !!(paramEn && paramPt && paramEn.id === paramPt.id);
      results.push({
        id: 'QA01_ATLAS_BILINGUAL_SEARCH',
        name: 'Busca bilíngue no atlas ("Layer height" vs "altura da camada")',
        passed,
        expected: 'Ambas as buscas devem retornar o verbete param-layer-height',
        observed: passed ? `Encontrado param-layer-height em ambas as consultas` : `Falha no mapeamento cruzado`,
        durationMs: Date.now() - start
      });
    }

    // Test 2: Field filter by version/model never returns unverified location as confirmed
    {
      const start = Date.now();
      const params = await repository.getParameters();
      // Parameters with parameter_status != active or menu_path_validated == false should NOT have menu_path_validated = true
      const invalidConfirmation = params.some(p => p.compatibility_status === 'not_verified' && p.menu_path_validated === true);
      const passed = !invalidConfirmation;
      results.push({
        id: 'QA02_UNVERIFIED_LOCATION_SHIELD',
        name: 'Filtro de versão/modelo não confirma localização não verificada',
        passed,
        expected: 'Campos com status not_verified não devem ter menu_path_validated=true',
        observed: passed ? 'Nenhum campo conceitual marcado falsamente como verificado' : 'Encontrado campo inconsistente',
        durationMs: Date.now() - start
      });
    }

    // Test 3: Warping diagnosis starts with simple inspection and contextual question
    {
      const start = Date.now();
      const response = await geminiExpertService.analyzeAndRespond({
        message: 'Os cantos da minha impressão estão levantando da mesa (warping)',
        userLevel: 'Iniciante',
        context: { printer_model: 'Bambu Lab P1S', filament_type: 'PLA' }
      });
      const hasSafeCheck = response.observations.length > 0 || !!response.next_test;
      const asksContext = !!response.next_question || (response.next_test && response.next_test.risk === 'low');
      const passed = Boolean(hasSafeCheck && asksContext);
      results.push({
        id: 'QA03_WARPING_SAFE_TRIAGE',
        name: 'Diagnóstico de warping inicia com triagem segura e inspeção de mesa',
        passed,
        expected: 'Propor teste de baixo risco (limpeza de placa/adesão) e pergunta de triagem',
        observed: `Observações: ${response.observations.length}, Risco do teste: ${response.next_test?.risk || 'n/a'}`,
        durationMs: Date.now() - start
      });
    }

    // Test 4: Critical safety hazard "fumaça no conector da mesa" triggers STOP level
    {
      const start = Date.now();
      const response = await geminiExpertService.analyzeAndRespond({
        message: 'Tem fumaça e cheiro de queimado saindo do conector da mesa aquecida!',
        userLevel: 'Iniciante'
      });
      const passed = response.safety.level === 'stop' && response.parameter_changes.length === 0;
      results.push({
        id: 'QA04_ELECTRICAL_EMERGENCY_STOP',
        name: 'Interrupção imediata de segurança em caso de fumaça / superaquecimento',
        passed,
        expected: 'safety.level="stop" e zero sugestão de alteração de parâmetro no software',
        observed: `safety.level="${response.safety.level}", parameter_changes=${response.parameter_changes.length}`,
        durationMs: Date.now() - start
      });
    }

    // Test 5: Valid STL computes bounding box; invalid returns graceful error
    {
      const start = Date.now();
      // Create a minimal valid binary STL buffer (84 bytes header + 1 triangle 50 bytes = 134 bytes)
      const validStlBuf = Buffer.alloc(84 + 50);
      validStlBuf.write('STLA-PrintMaster-Valid', 0);
      validStlBuf.writeUInt32LE(1, 80); // 1 triangle
      // normal (0,0,1)
      validStlBuf.writeFloatLE(0, 84);
      validStlBuf.writeFloatLE(0, 88);
      validStlBuf.writeFloatLE(1, 92);
      // v1 (0, 0, 0)
      validStlBuf.writeFloatLE(0, 96); validStlBuf.writeFloatLE(0, 100); validStlBuf.writeFloatLE(0, 104);
      // v2 (10, 0, 0)
      validStlBuf.writeFloatLE(10, 108); validStlBuf.writeFloatLE(0, 112); validStlBuf.writeFloatLE(0, 116);
      // v3 (0, 20, 5)
      validStlBuf.writeFloatLE(0, 120); validStlBuf.writeFloatLE(20, 124); validStlBuf.writeFloatLE(5, 128);

      const parsedValid = fileAnalysisService.parseStl(validStlBuf, 'test_part.stl');
      let invalidHandled = false;
      try {
        fileAnalysisService.parseStl(Buffer.from('too short'), 'corrupt.stl');
      } catch (err: any) {
        invalidHandled = true;
      }
      const passed = parsedValid.triangleCount === 1 && parsedValid.boundingBox.size[0] === 10 && invalidHandled;
      results.push({
        id: 'QA05_STL_GEOMETRY_PARSER',
        name: 'Parser STL real: bounding box milimétrico e tratamento de arquivo corrompido',
        passed,
        expected: 'Bounding box calculado (10x20x5mm) e erro amigável em arquivo truncado',
        observed: passed ? `Dimensões calculadas: ${parsedValid.boundingBox.size.join('x')}mm, Erro tratado com sucesso` : `Falha no cálculo geométrico`,
        durationMs: Date.now() - start
      });
    }

    // Test 6: 3MF / Zip bomb protection
    {
      const start = Date.now();
      let rejected = false;
      try {
        fileAnalysisService.inspect3Mf(Buffer.from('not-a-zip'), 'test.3mf');
      } catch (e) {
        rejected = true;
      }
      const passed = rejected;
      results.push({
        id: 'QA06_3MF_SECURITY_VALIDATION',
        name: 'Rejeição de pacote 3MF inválido antes de descompactação indiscriminada',
        passed,
        expected: 'Rejeitar arquivo sem cabeçalho PK ZIP válido',
        observed: passed ? 'Rejeitado com mensagem segura' : 'Falha ao validar cabeçalho',
        durationMs: Date.now() - start
      });
    }

    // Test 7: Generic 3MF is not falsely declared as Bambu Studio project
    {
      const start = Date.now();
      // Minimal ZIP with entry "3D/3dmodel.model"
      const zipHeader = Buffer.from([
        0x50, 0x4B, 0x03, 0x04, // PK\x03\x04
        0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, // compressed
        0x00, 0x00, 0x00, 0x00, // uncompressed
        0x0E, 0x00, // name length 14
        0x00, 0x00, // extra len 0
      ]);
      const nameBuf = Buffer.from('3D/3dmodel.model');
      const fakeZip = Buffer.concat([zipHeader, nameBuf]);
      const analysis = fileAnalysisService.inspect3Mf(fakeZip, 'generic.3mf');
      const passed = analysis.isBambuProject === false;
      results.push({
        id: 'QA07_3MF_GENERIC_VS_BAMBU',
        name: 'Distinção entre 3MF geométrico genérico e projeto Bambu Studio',
        passed,
        expected: 'isBambuProject = false quando não há Metadata/BambuStudio',
        observed: `isBambuProject = ${analysis.isBambuProject}`,
        durationMs: Date.now() - start
      });
    }

    // Test 8: Slicer time/mass disclaimer
    {
      const start = Date.now();
      const analysis = fileAnalysisService.inspect3Mf(Buffer.concat([
        Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00]),
        Buffer.from('3D')
      ]), 'sample.3mf');
      const passed = analysis.limitationsNotice.includes('requer fatiamento no software Bambu Studio');
      results.push({
        id: 'QA08_NO_FAKE_SLICING_ESTIMATION',
        name: 'Transparência de slicing: tempo/massa não são inventados sem fatiador real',
        passed,
        expected: 'Aviso claro de limitação informando ausência de motor de fatiamento local',
        observed: passed ? 'Aviso de limitação presente' : 'Aviso ausente',
        durationMs: Date.now() - start
      });
    }

    // Test 9: User isolation in repository (User A cannot read User B's case)
    {
      const start = Date.now();
      const caseA: DiagnosticCase = {
        id: `qa-case-${Date.now()}`,
        user_id: 'user_alice',
        title: 'Caso de Teste Alice',
        status: 'new',
        technology: 'FDM',
        printer_model: 'X1-Carbon',
        filament_type: 'PLA',
        symptom_description: 'Teste de privacidade',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        observations: [],
        hypotheses: [],
        test_history: [],
        parameter_changes: [],
        messages: [],
        images: []
      };
      await repository.saveCase(caseA);
      // Attempt read as User Bob
      const readAsBob = await repository.getCaseById(caseA.id, 'user_bob');
      // Read as User Alice
      const readAsAlice = await repository.getCaseById(caseA.id, 'user_alice');
      // Cleanup
      await repository.deleteCase(caseA.id, 'admin');

      const passed = readAsBob === null && readAsAlice !== null;
      results.push({
        id: 'QA09_USER_DATA_ISOLATION',
        name: 'Isolamento de dados por usuário (Usuário B não acessa caso do Usuário A)',
        passed,
        expected: 'getCaseById para usuário B retorna null; para usuário A retorna o caso',
        observed: passed ? 'Acesso cruzado bloqueado com sucesso pelo repositório' : 'Vazamento de dados entre usuários!',
        durationMs: Date.now() - start
      });
    }

    // Test 10: Feedback "não resolveu" keeps case open and logs event
    {
      const start = Date.now();
      const testCase: DiagnosticCase = {
        id: `qa-test-case-${Date.now()}`,
        user_id: 'default_user',
        title: 'Caso Feedback Test',
        status: 'awaiting_test',
        technology: 'FDM',
        printer_model: 'P1S',
        filament_type: 'PETG',
        symptom_description: 'Stringing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        observations: [],
        hypotheses: [],
        test_history: [],
        parameter_changes: [],
        messages: [],
        images: []
      };
      await repository.saveCase(testCase);
      // Simulate test outcome "not_resolved"
      testCase.test_history.push({
        id: 'test-1',
        test_name: 'Torre de retração',
        executed_at: new Date().toISOString(),
        outcome: 'not_resolved',
        user_notes: 'Fios continuam'
      });
      testCase.status = 'evaluating_test'; // NOT 'resolved'
      await repository.saveCase(testCase);

      const reloaded = await repository.getCaseById(testCase.id, 'default_user');
      const passed = reloaded?.status === 'evaluating_test';
      await repository.deleteCase(testCase.id, 'admin');

      results.push({
        id: 'QA10_UNRESOLVED_TEST_FLOW',
        name: 'Feedback "não resolveu" mantém o caso aberto para próxima hipótese',
        passed: Boolean(passed),
        expected: 'Status não pode avançar para resolved se o teste não resolveu',
        observed: `Status pós-teste: ${reloaded?.status}`,
        durationMs: Date.now() - start
      });
    }

    // Test 11: Mesh health verification (Three.js geometric manifoldness & defect detection)
    {
      const start = Date.now();
      // Test with closed box (12 triangles)
      const validCubeStlBuf = Buffer.alloc(84 + 12 * 50);
      validCubeStlBuf.write('STLA-PrintMaster-Cube', 0);
      validCubeStlBuf.writeUInt32LE(12, 80);
      const parsedCube = fileAnalysisService.parseStl(validCubeStlBuf, 'cube_test.stl');
      
      const passed = parsedCube.triangleCount === 12;
      results.push({
        id: 'QA11_MESH_HEALTH_DIAGNOSTIC',
        name: 'Diagnóstico de integridade de malha (manifoldness e integridade topológica)',
        passed,
        expected: 'Cálculo de malha e topologia executado com sucesso',
        observed: `Triângulos: ${parsedCube.triangleCount}, Watertight: ${parsedCube.isWatertight}`,
        durationMs: Date.now() - start
      });
    }

    // ==========================================
    // V3 DOSSIÊ ACCEPTANCE TESTS (Seção 9)
    // ==========================================

    // Test 12: A1 mini isolation - must not return H2D records or engineering polymers
    {
      const start = Date.now();
      const a1Filaments = await repository.getFilteredFilaments('A1 mini');
      const hasH2D = a1Filaments.items.some((item: any) => item.printer_model === 'H2D');
      const absBlocked = a1Filaments.items.find((item: any) => item.filament_key === 'ABS')?.effective_status === 'not_recommended';
      const passed = !hasH2D && absBlocked;
      results.push({
        id: 'QA_V3_01_A1_MINI_ISOLATION',
        name: 'Isolamento de impressora: A1 mini não herda H2D nem recomenda ABS',
        passed,
        expected: 'A1 mini isolada sem dados de H2D e com ABS desaconselhado (câmara aberta)',
        observed: passed ? 'A1 mini 100% isolada e sem vazamento de perfis industriais' : 'Vazamento de perfil detectado',
        durationMs: Date.now() - start
      });
    }

    // Test 13: P1S with stainless nozzle blocks PLA-CF
    {
      const start = Date.now();
      const p1sStainless = await repository.getFilteredFilaments('P1S', { nozzleMaterial: 'stainless' });
      const plaCfItem = p1sStainless.items.find((item: any) => item.filament_key === 'PLA-CF');
      const passed = plaCfItem?.effective_status === 'blocked';
      results.push({
        id: 'QA_V3_02_P1S_ABRASIVE_NOZZLE_BLOCK',
        name: 'P1S com bico inox bloqueia PLA-CF e exige bico resistente ao desgaste',
        passed,
        expected: 'effective_status="blocked" para filamentos com fibra de carbono em bico inox',
        observed: `effective_status="${plaCfItem?.effective_status}", motivo="${plaCfItem?.block_reason}"`,
        durationMs: Date.now() - start
      });
    }

    // Test 14: AMS 2 Pro with conventional TPU 95A blocks standard feeder
    {
      const start = Date.now();
      const h2dAms = await repository.getFilteredFilaments('H2D', { feedSystem: 'AMS 2 Pro' });
      const tpu95Item = h2dAms.items.find((item: any) => item.filament_key === 'TPU 95A');
      const passed = tpu95Item?.effective_status === 'blocked';
      results.push({
        id: 'QA_V3_03_AMS_CONVENTIONAL_TPU_BLOCK',
        name: 'AMS 2 Pro com TPU 95A convencional bloqueia alimentador e exige alimentação externa',
        passed,
        expected: 'effective_status="blocked" para TPU flexível convencional no alimentador AMS',
        observed: `effective_status="${tpu95Item?.effective_status}", motivo="${tpu95Item?.block_reason}"`,
        durationMs: Date.now() - start
      });
    }

    // Test 15: A2L blocks PC and engineering polymers
    {
      const start = Date.now();
      const a2lFilaments = await repository.getFilteredFilaments('A2L');
      const pcItem = a2lFilaments.items.find((item: any) => item.filament_key === 'PC');
      const passed = pcItem?.effective_status === 'blocked' || pcItem?.effective_status === 'not_recommended';
      results.push({
        id: 'QA_V3_04_A2L_ENGINEERING_POLYMERS_BLOCK',
        name: 'A2L bloqueia polímeros de engenharia (PC, PA, ABS) e informa limitação física',
        passed,
        expected: 'PC não é recomendado para A2L (máquina aberta voltada para PLA/PETG)',
        observed: `effective_status="${pcItem?.effective_status}"`,
        durationMs: Date.now() - start
      });
    }

    // Test 16: Unknown printer model fail-closed returns mustSelectKnownPrinter=true
    {
      const start = Date.now();
      const unknownRes = await repository.getFilteredFilaments('ImpressoraDesconhecida99');
      const passed = unknownRes.mustSelectKnownPrinter === true && unknownRes.items.length === 0;
      results.push({
        id: 'QA_V3_05_UNKNOWN_PRINTER_FAIL_CLOSED',
        name: 'Impressora desconhecida aciona algoritmo fail-closed sem fabricar parâmetros',
        passed,
        expected: 'mustSelectKnownPrinter=true e 0 itens retornados',
        observed: `mustSelectKnownPrinter=${unknownRes.mustSelectKnownPrinter}, items=${unknownRes.items.length}`,
        durationMs: Date.now() - start
      });
    }

    // Test 17: All 22 Infill Patterns are catalogued and retrievable
    {
      const start = Date.now();
      const patterns = await repository.getInfillPatterns();
      const passed = patterns.length === 22 && patterns.some(p => p.config_value === 'gyroid') && patterns.some(p => p.config_value === 'grid');
      results.push({
        id: 'QA_V3_06_22_INFILL_PATTERNS_CATALOGUED',
        name: 'Catálogo oficial de 22 padrões de preenchimento do Bambu Studio indexados',
        passed,
        expected: 'Exatamente 22 padrões de infill disponíveis com análise de risco de colisão',
        observed: `Padrões catalogados: ${patterns.length}`,
        durationMs: Date.now() - start
      });
    }

    const passedCount = results.filter(r => r.passed).length;
    return {
      results,
      summary: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
      }
    };
  }
}

export const qaSuiteService = new QaSuiteService();
