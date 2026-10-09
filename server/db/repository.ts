import fs from 'fs';
import path from 'path';
import { 
  DiagnosticCase, 
  UserEquipment, 
  UserMaterial, 
  KnowledgeSource, 
  PrinterModel, 
  FilamentType, 
  StudioParameter, 
  FailureType, 
  DiagnosticTest, 
  KBArticle,
  InfillPatternV3,
  PrinterSpecV3,
  FilamentCatalogItemV3,
  TargetedFaqV3
} from '../../src/types/index.ts';
import { 
  INFILL_PATTERNS_V3, 
  PRINTER_SPECS_V3, 
  FILAMENT_CATALOG_V3, 
  TARGETED_FAQ_V3, 
  FAILURE_TYPES_V3_ADDITIONS, 
  KB_ARTICLES_V3_ADDITIONS,
  getFilteredFilamentsForPrinter
} from '../../src/data/knowledgeBaseV3.ts';

export interface AuditLog {
  id: string;
  actor: string;
  event: string;
  target: string;
  timestamp: string;
  change_summary: string;
}

export interface IPersistentRepository {
  readonly storageMode: 'local_file_persistent' | 'firebase_firestore' | 'supabase';
  
  // Knowledge Base Queries
  getSources(): Promise<KnowledgeSource[]>;
  getPrinters(): Promise<PrinterModel[]>;
  getFilaments(): Promise<FilamentType[]>;
  getParameters(): Promise<StudioParameter[]>;
  getParameterById(id: string): Promise<StudioParameter | null>;
  getFailures(): Promise<FailureType[]>;
  getTests(): Promise<DiagnosticTest[]>;
  getArticles(): Promise<KBArticle[]>;
  saveParameters(parameters: StudioParameter[]): Promise<void>;
  
  // V3 Dossier Additions
  getInfillPatterns(): Promise<InfillPatternV3[]>;
  getPrinterSpecs(): Promise<PrinterSpecV3[]>;
  getFilamentCatalog(): Promise<FilamentCatalogItemV3[]>;
  getFilteredFilaments(modelName: string, options?: any): Promise<any>;
  getTargetedFaq(): Promise<TargetedFaqV3[]>;

  // Cases & Diagnostics (enforcing userId isolation)
  listCases(userId: string): Promise<DiagnosticCase[]>;
  getCaseById(id: string, userId: string): Promise<DiagnosticCase | null>;
  saveCase(c: DiagnosticCase): Promise<DiagnosticCase>;
  deleteCase(id: string, userId: string): Promise<boolean>;

  // User Equipment & Materials
  listEquipment(userId: string): Promise<UserEquipment[]>;
  saveEquipment(userId: string, equipment: UserEquipment): Promise<UserEquipment>;
  deleteEquipment(id: string, userId: string): Promise<boolean>;

  // Feedback & Audit
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
  recordFeedback(feedback: { caseId?: string; vote: 'positive' | 'negative'; comment?: string; userId: string }): Promise<void>;
}

interface DbData {
  sources: KnowledgeSource[];
  printers: PrinterModel[];
  filaments: FilamentType[];
  parameters: StudioParameter[];
  failures: FailureType[];
  tests: DiagnosticTest[];
  articles: KBArticle[];
  cases: DiagnosticCase[];
  equipment: (UserEquipment & { user_id: string })[];
  audit_logs: AuditLog[];
  feedback: Array<{ id: string; caseId?: string; vote: string; comment?: string; userId: string; created_at: string }>;
}

export class JsonFileStorageRepository implements IPersistentRepository {
  public readonly storageMode = 'local_file_persistent';
  private filePath: string;
  private data: DbData;

  constructor() {
    this.filePath = path.resolve(process.cwd(), 'data', 'runtime_db.json');
    this.data = this.loadData();
  }

  private loadData(): DbData {
    let resultDb: DbData | null = null;
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        resultDb = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[Repository] Failed to read existing runtime_db.json, initializing fresh seed', err);
    }

    if (!resultDb) {
      // Default structure initialized from initialKnowledgeBase.json if exists
      const initialSeedPath = path.resolve(process.cwd(), 'data', 'initialKnowledgeBase.json');
      let seed: Partial<DbData> = {};
      if (fs.existsSync(initialSeedPath)) {
        try {
          const rawSeed = fs.readFileSync(initialSeedPath, 'utf-8');
          const parsed = JSON.parse(rawSeed);
          seed = {
            sources: parsed.knowledge_sources || [],
            printers: parsed.printer_models || [],
            filaments: parsed.filament_types || [],
            parameters: parsed.parameters || [],
            failures: parsed.failure_types || [],
            tests: parsed.diagnostic_tests || [],
            articles: parsed.kb_articles || [],
          };
        } catch (err) {
          console.error('[Repository] Error loading initial seed', err);
        }
      }

      resultDb = {
        sources: seed.sources || [],
        printers: seed.printers || [],
        filaments: seed.filaments || [],
        parameters: seed.parameters || [],
        failures: seed.failures || [],
        tests: seed.tests || [],
        articles: seed.articles || [],
        cases: [],
        equipment: [
          {
            id: 'eq-default-1',
            user_id: 'default_user',
            name: 'Minha Bambu P1S',
            model_id: 'printer-bambu-lab-p1s',
            manufacturer: 'Bambu Lab',
            nozzle_size: '0.4mm Aço Temperado',
            plate_type: 'Textured PEI Plate',
            firmware: '01.06.01.00',
            is_default: true,
            notes: 'Equipamento principal com AMS'
          }
        ],
        audit_logs: [
          {
            id: 'log-seed-1',
            actor: 'System Boot',
            event: 'SEED_INITIAL_DB',
            target: 'runtime_db.json',
            timestamp: new Date().toISOString(),
            change_summary: 'Base de conhecimento inicial carregada e indexada'
          }
        ],
        feedback: []
      };
    }

    // Merge v3 additions (additive preservation by ID)
    const existingFailureIds = new Set((resultDb.failures || []).map(f => f.id));
    for (const f of FAILURE_TYPES_V3_ADDITIONS) {
      if (!existingFailureIds.has(f.id)) {
        resultDb.failures.push(f);
      }
    }

    const existingArticleIds = new Set((resultDb.articles || []).map(a => a.id));
    for (const a of KB_ARTICLES_V3_ADDITIONS) {
      if (!existingArticleIds.has(a.id)) {
        resultDb.articles.push(a);
      }
    }

    this.persist(resultDb);
    return resultDb;
  }

  private persist(dataToSave: DbData = this.data): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Repository] Error persisting runtime_db.json:', err);
    }
  }

  async getSources(): Promise<KnowledgeSource[]> {
    return this.data.sources;
  }

  async getPrinters(): Promise<PrinterModel[]> {
    return this.data.printers;
  }

  async getFilaments(): Promise<FilamentType[]> {
    return this.data.filaments;
  }

  async getParameters(): Promise<StudioParameter[]> {
    return this.data.parameters;
  }

  async getParameterById(id: string): Promise<StudioParameter | null> {
    const p = this.data.parameters.find(x => x.id === id || x.config_key === id);
    return p || null;
  }

  async getFailures(): Promise<FailureType[]> {
    return this.data.failures;
  }

  async getTests(): Promise<DiagnosticTest[]> {
    return this.data.tests;
  }

  async getArticles(): Promise<KBArticle[]> {
    return this.data.articles;
  }

  async getInfillPatterns(): Promise<InfillPatternV3[]> {
    return INFILL_PATTERNS_V3;
  }

  async getPrinterSpecs(): Promise<PrinterSpecV3[]> {
    return PRINTER_SPECS_V3;
  }

  async getFilamentCatalog(): Promise<FilamentCatalogItemV3[]> {
    return FILAMENT_CATALOG_V3;
  }

  async getFilteredFilaments(modelName: string, options?: any): Promise<any> {
    return getFilteredFilamentsForPrinter(modelName, options);
  }

  async getTargetedFaq(): Promise<TargetedFaqV3[]> {
    return TARGETED_FAQ_V3;
  }

  async saveParameters(parameters: StudioParameter[]): Promise<void> {
    this.data.parameters = parameters;
    this.persist();
  }

  async listCases(userId: string): Promise<DiagnosticCase[]> {
    // STRICT user isolation: User A only sees cases belonging to user A
    return this.data.cases.filter(c => c.user_id === userId);
  }

  async getCaseById(id: string, userId: string): Promise<DiagnosticCase | null> {
    // STRICT user isolation: cannot read another user's case
    const found = this.data.cases.find(c => c.id === id);
    if (!found) return null;
    if (found.user_id !== userId && userId !== 'admin') {
      return null;
    }
    return found;
  }

  async saveCase(c: DiagnosticCase): Promise<DiagnosticCase> {
    const idx = this.data.cases.findIndex(x => x.id === c.id);
    if (idx >= 0) {
      this.data.cases[idx] = c;
    } else {
      this.data.cases.unshift(c);
    }
    this.persist();
    return c;
  }

  async deleteCase(id: string, userId: string): Promise<boolean> {
    const idx = this.data.cases.findIndex(x => x.id === id && (x.user_id === userId || userId === 'admin'));
    if (idx >= 0) {
      this.data.cases.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  async listEquipment(userId: string): Promise<UserEquipment[]> {
    return this.data.equipment
      .filter(e => e.user_id === userId)
      .map(({ user_id, ...rest }) => rest);
  }

  async saveEquipment(userId: string, equipment: UserEquipment): Promise<UserEquipment> {
    const itemWithUser = { ...equipment, user_id: userId };
    const idx = this.data.equipment.findIndex(e => e.id === equipment.id && e.user_id === userId);
    if (idx >= 0) {
      this.data.equipment[idx] = itemWithUser;
    } else {
      this.data.equipment.push(itemWithUser);
    }
    this.persist();
    return equipment;
  }

  async deleteEquipment(id: string, userId: string): Promise<boolean> {
    const idx = this.data.equipment.findIndex(e => e.id === id && e.user_id === userId);
    if (idx >= 0) {
      this.data.equipment.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  async addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(newLog);
    // Keep max 200 logs
    if (this.data.audit_logs.length > 200) {
      this.data.audit_logs.pop();
    }
    this.persist();
    return newLog;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.data.audit_logs;
  }

  async recordFeedback(feedback: { caseId?: string; vote: 'positive' | 'negative'; comment?: string; userId: string }): Promise<void> {
    this.data.feedback.push({
      id: `fb-${Date.now()}`,
      caseId: feedback.caseId,
      vote: feedback.vote,
      comment: feedback.comment,
      userId: feedback.userId,
      created_at: new Date().toISOString()
    });
    this.persist();
  }
}

// Global repository instance
export const repository: IPersistentRepository = new JsonFileStorageRepository();
