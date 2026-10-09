export type UserRole = 'visitor' | 'user' | 'expert' | 'admin';

export type UserExperienceLevel = 'Iniciante' | 'Intermediário' | 'Especialista';

export type SlicerLanguage = 'pt' | 'en' | 'bilingual';

export type AppTheme = 'bambu-dark' | 'orca-dark' | 'slate-dark' | 'studio-light' | 'high-contrast';

export type InterfaceLanguage = 'pt' | 'en';

export interface UserEquipment {
  id: string;
  name: string;
  model_id: string;
  manufacturer: string;
  nozzle_size: string;
  plate_type: string;
  firmware?: string;
  is_default: boolean;
  notes?: string;
}

export interface UserMaterial {
  id: string;
  filament_type_id: string;
  name: string;
  brand: string;
  color: string;
  spool_weight_grams?: number;
  is_dry: boolean;
  notes?: string;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  kind: string;
  url: string | null;
  authority: string;
  version: string;
  review_status: string;
}

export interface PrinterModel {
  id: string;
  manufacturer: string;
  name: string;
  capabilities: {
    build_volume?: string;
    max_bed_temp?: number;
    enclosure?: boolean;
    chamber_fan?: boolean;
    ams_support?: boolean;
    ams_type?: string;
    micro_lidar?: boolean;
    hardened_nozzle?: boolean;
    recommended_nozzles?: string[];
  };
  review_status: string;
  notes: string;
  source_ids: string[];
}

export interface FilamentType {
  id: string;
  name: string;
  printer_compatible: string[] | null;
  temperature_range: string | null;
  drying_settings: string | null;
  notes: string;
  review_status: string;
}

export interface StudioParameter {
  id: string;
  name_pt: string;
  name_en: string;
  config_key: string | null;
  category: 'Quality' | 'Strength' | 'Speed' | 'Support' | 'Others' | 'Filament' | 'Printer';
  description: string;
  unit: string | null;
  control_type: string;
  menu_path: string | null;
  menu_path_validated: boolean;
  slicer_version: string;
  compatible_printers: string[];
  compatibility_status: string;
  parameter_status: string;
  risk_level: 'low' | 'medium' | 'high';
  source_ids: string[];
  notes?: string;
}

export interface FailureType {
  id: string;
  technology: 'FDM' | 'SLA/MSLA';
  name: string;
  diagnostic_hypotheses: string[];
  first_safe_check: string;
  status: string;
  source_ids: string[];
  risk: 'normal' | 'caution' | 'stop';
  tags: string[];
}

export interface DiagnosticTest {
  id: string;
  name: string;
  technology: 'FDM' | 'SLA/MSLA';
  objective: string;
  procedure_steps: string[];
  contraindications: string[];
  pass_conditions: string;
  status: string;
}

export interface KBArticle {
  id: string;
  title: string;
  body: string;
  technology: string;
  tags: string[];
  source_ids: string[];
  revision_state: string;
}

export type CaseStatus = 
  | 'new'
  | 'collecting_context'
  | 'hypotheses'
  | 'awaiting_test'
  | 'evaluating_test'
  | 'resolved'
  | 'escalated';

export interface DiagnosticCase {
  id: string;
  user_id: string;
  title: string;
  status: CaseStatus;
  technology: 'FDM' | 'SLA/MSLA';
  printer_model: string;
  nozzle_size?: string;
  filament_type: string;
  plate_type?: string;
  slicer_version?: string;
  symptom_description: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  observations: string[];
  hypotheses: CaseHypothesis[];
  current_test?: CaseTestPlan;
  test_history: CaseTestRecord[];
  parameter_changes: ParameterChangeProposal[];
  messages: ChatMessage[];
  images: CaseAttachment[];
}

export interface CaseHypothesis {
  id: string;
  name: string;
  confidence: 'possible' | 'probable' | 'confirmed';
  for: string[];
  against: string[];
  missing: string[];
}

export interface CaseTestPlan {
  id: string;
  name: string;
  steps: string[];
  expected_results: string[];
  risk: 'low' | 'moderate' | 'high';
}

export interface CaseTestRecord {
  id: string;
  test_name: string;
  executed_at: string;
  outcome: 'resolved' | 'improved' | 'not_resolved';
  user_notes?: string;
  photo_after_url?: string;
}

export interface ParameterChangeProposal {
  key: string;
  menu: string;
  current: string | null;
  suggested: string | null;
  unit: string;
  reason: string;
  verified_compatibility: boolean;
}

export interface CaseAttachment {
  id: string;
  file_name: string;
  file_type: string;
  data_url: string; // base64 or object URL
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  structured_data?: AIStructuredResponse;
  created_at: string;
  attachments?: CaseAttachment[];
}

export interface AIStructuredResponse {
  intent: 'diagnose' | 'prepare' | 'explain_setting' | 'calibrate' | 'hardware' | 'other';
  safety: {
    level: 'normal' | 'caution' | 'stop';
    message: string | null;
  };
  context: {
    printer: string | null;
    slicer_version: string | null;
    material: string | null;
  };
  observations: string[];
  hypotheses: Array<{
    name: string;
    confidence: 'possible' | 'probable' | 'confirmed';
    for: string[];
    against: string[];
    missing: string[];
  }>;
  next_question: string | null;
  next_test: {
    name: string;
    steps: string[];
    expected_results: string[];
    risk: 'low' | 'moderate' | 'high';
  } | null;
  parameter_changes: ParameterChangeProposal[];
  sources: Array<{
    title: string;
    url_or_document: string;
    section_or_page: string;
    evidence_level: string;
  }>;
  cannot_verify: string[];
  user_summary: string;
  answer?: string;
}

export interface MeshDiagnosticItem {
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  fixAdvice?: string;
}

export interface MeshHealthReport {
  isManifold: boolean;
  totalTriangles: number;
  totalUniqueVertices: number;
  openEdgesCount: number; // Arestas abertas / faces não unidas (boundary edges)
  nonManifoldEdgesCount: number; // Arestas com 3+ triângulos conectados
  invertedTrianglesCount: number; // Triângulos com normais ou bobinamento inconsistente
  degenerateFacesCount: number; // Triângulos de área nula / vértices colineares
  isWatertight: boolean; // Malha estanque fechada
  overallStatus: 'perfect' | 'warning' | 'critical';
  healthScore: number; // 0 - 100%
  summary: string;
  diagnostics: MeshDiagnosticItem[];
  repairRecommendations: string[];
}

export interface StlAnalysisResult {
  fileName: string;
  triangleCount: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    size: [number, number, number]; // [widthX, depthY, heightZ] in mm
  };
  isWatertight: boolean;
  estimatedVolumeCm3: number | null; // null if not watertight
  degenerateFaces: number;
  openEdgesCount: number;
  heuristicWarnings: string[];
  recommendedOrientationReason: string;
  meshHealth?: MeshHealthReport;
}

export interface ThreeMfAnalysisResult {
  fileName: string;
  isZipValid: boolean;
  isBambuProject: boolean;
  detectedFiles: string[];
  metadata: Record<string, string>;
  hasEmbeddedProfiles: boolean;
  embeddedProfileNotes?: string;
  limitationsNotice: string;
}

// ==========================================
// PrintMaster 3D v3 Additions
// ==========================================

export type InfillCollisionRisk = 'baixo' | 'alto' | 'avaliar_preview';

export interface InfillPatternV3 {
  id: string;
  config_value: string;
  label_en: string;
  label_pt: string;
  slicer_key: string;
  collision_risk_same_layer: InfillCollisionRisk;
  relative_material_use: string;
  purpose: string;
  technical_note: string;
  strength_is_absolute_rank: boolean;
  availability: string;
  source_urls: string[];
  review_status: string;
}

export interface PrinterSpecV3 {
  id: string;
  brand: string;
  model: string;
  build_volume_mm: [number, number, number] | null;
  max_hotend_C: number;
  max_bed_C: number | null;
  chamber_type: string;
  has_active_chamber: boolean;
  default_nozzle_material: string;
  filament_diameter_mm: number;
  remarks: string[];
  source_urls: string[];
  validation: string;
}

export interface FilamentCatalogItemV3 {
  id: string;
  name: string;
  family: string;
  properties_use: string;
  example_nozzle_temperature_C: [number, number] | null;
  example_scope: string | null;
  example_temperature_source_url: string | null;
  drying_guidance: string;
  abrasive: boolean;
  machine_profile_required: boolean;
  brand_sku_specific_parameters_required: boolean;
  source_urls: string[];
}

export type CompatibilityStatusV3 = 'ideal' | 'conditional' | 'not_recommended' | 'unknown';

export interface PrinterFilamentCompatibilityV3 {
  printer_id: string;
  printer_model: string;
  filament_key: string;
  status: CompatibilityStatusV3;
  effective_status?: 'ideal' | 'conditional' | 'not_recommended' | 'blocked' | 'unknown';
  block_reason?: string;
  requirements: string[];
  review_status: string;
  source_urls: string[];
}

export interface FilamentHardwareRuleV3 {
  id: string;
  effect: 'block' | 'conditional';
  condition: {
    feed_system?: string[];
    nozzle_material?: string[];
    nozzle_diameter_mm?: number[];
    printer?: string[];
    filament_keys: string[];
  };
  message: string;
  source_url: string;
  applies_printers?: string[];
}

export interface TargetedFaqV3 {
  id: string;
  title: string;
  category: string;
  tags: string[];
  infill_pattern: string | null;
  triage_questions: string[];
  differential_diagnosis: string;
  recommended_action: string;
  validation: string;
  safety: string;
  source_urls: string[];
  review_status: string;
}

export type PrintProfileCategory = 

  | 'figures_art'
  | 'vases_decor'
  | 'mechanical'
  | 'articulated'
  | 'lithophane'
  | 'precision'
  | 'draft_fast'
  | 'tpu_flexible';

export interface ProfileSlicerParameter {
  key: string;
  name_pt: string;
  name_en: string;
  value: string;
  unit?: string;
  slicerPath: string; // ex: Processo > Qualidade > Básico
  rationale_pt: string;
  rationale_en: string;
  highlight?: boolean;
}

export interface FileTypePreset {
  id: string;
  category: PrintProfileCategory;
  name_pt: string;
  name_en: string;
  tag_pt: string;
  tag_en: string;
  iconName: string; // ex: 'User', 'Flower2', 'Wrench', 'Boxes', 'Flame'
  shortDesc_pt: string;
  shortDesc_en: string;
  targetModels_pt: string[];
  targetModels_en: string[];
  recommendedFileKeywords: string[];
  recommendedMaterials: string[];
  recommendedNozzle: string;
  
  // Core Slicer Values
  layerHeight: string;
  initialLayerHeight: string;
  wallLoops: string;
  topBottomShells: string;
  infillDensity: string;
  infillPattern: string;
  outerWallSpeed: string;
  innerWallSpeed: string;
  supportType: string;
  supportStyle: string;
  seamPosition: string;
  brimType: string;
  coolingProfile: string;

  // Key specialized slicer configs
  specializedParameters: ProfileSlicerParameter[];

  dosAndDonts: {
    recommended_pt: string[];
    recommended_en: string[];
    avoid_pt: string[];
    avoid_en: string[];
  };

  technicalRationale_pt: string;
  technicalRationale_en: string;
  sampleFileName?: string;
}

