import { z } from 'zod';

export const AIStructuredResponseSchema = z.object({
  intent: z.enum(['diagnose', 'prepare', 'explain_setting', 'calibrate', 'hardware', 'other']),
  safety: z.object({
    level: z.enum(['normal', 'caution', 'stop']),
    message: z.string().nullable().default(null),
  }),
  context: z.object({
    printer: z.string().nullable().default(null),
    slicer_version: z.string().nullable().default(null),
    material: z.string().nullable().default(null),
  }),
  observations: z.array(z.string()).default([]),
  hypotheses: z.array(
    z.object({
      name: z.string(),
      confidence: z.enum(['possible', 'probable', 'confirmed']),
      for: z.array(z.string()).default([]),
      against: z.array(z.string()).default([]),
      missing: z.array(z.string()).default([]),
    })
  ).default([]),
  next_question: z.string().nullable().default(null),
  next_test: z.object({
    name: z.string(),
    steps: z.array(z.string()),
    expected_results: z.array(z.string()),
    risk: z.enum(['low', 'moderate', 'high']),
  }).nullable().default(null),
  parameter_changes: z.array(
    z.object({
      key: z.string(),
      menu: z.string(),
      current: z.string().nullable().default(null),
      suggested: z.string().nullable().default(null),
      unit: z.string().default(''),
      reason: z.string(),
      verified_compatibility: z.boolean().default(false),
    })
  ).default([]),
  sources: z.array(
    z.object({
      title: z.string(),
      url_or_document: z.string(),
      section_or_page: z.string(),
      evidence_level: z.string(),
    })
  ).default([]),
  cannot_verify: z.array(z.string()).default([]),
  user_summary: z.string(),
  answer: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  caseId: z.string().optional(),
  message: z.string().min(1),
  userLevel: z.enum(['Iniciante', 'Intermediário', 'Especialista']).default('Iniciante'),
  context: z.object({
    printer_model: z.string().optional(),
    nozzle_size: z.string().optional(),
    filament_type: z.string().optional(),
    plate_type: z.string().optional(),
    slicer_version: z.string().optional(),
  }).optional(),
  images: z.array(
    z.object({
      fileName: z.string(),
      mimeType: z.string(),
      data: z.string(), // base64 string
    })
  ).max(4).optional(),
});

export const TestResultSubmissionSchema = z.object({
  outcome: z.enum(['resolved', 'improved', 'not_resolved']),
  notes: z.string().optional(),
  photoAfterDataUrl: z.string().optional(),
});

export const FeedbackSubmissionSchema = z.object({
  caseId: z.string().optional(),
  vote: z.enum(['positive', 'negative']),
  comment: z.string().optional(),
});

export const EquipmentCreationSchema = z.object({
  name: z.string().min(2),
  model_id: z.string(),
  manufacturer: z.string().default('Bambu Lab'),
  nozzle_size: z.string().default('0.4mm'),
  plate_type: z.string().default('Textured PEI Plate'),
  firmware: z.string().optional(),
  is_default: z.boolean().default(false),
  notes: z.string().optional(),
});
