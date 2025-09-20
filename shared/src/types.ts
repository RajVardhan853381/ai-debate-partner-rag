import { z } from 'zod';

// ====================
// User Types
// ====================

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ====================
// Debate Types
// ====================

export enum DebatePerspective {
  FOR = 'for',
  AGAINST = 'against',
  NEUTRAL = 'neutral',
  ECONOMIC = 'economic',
  ETHICAL = 'ethical',
  LEGAL = 'legal',
  SCIENTIFIC = 'scientific',
  CUSTOM = 'custom',
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export const DebateMessageSchema = z.object({
  id: z.string(),
  debateSessionId: z.string(),
  role: z.nativeEnum(MessageRole),
  content: z.string(),
  perspective: z.nativeEnum(DebatePerspective).optional(),
  sources: z.array(z.string()).optional(),
  aiParticipantName: z.string().optional(), // For AI vs AI debates
  roundNumber: z.number().optional(),
  argumentScore: z.object({
    logic: z.number().min(0).max(10),
    evidence: z.number().min(0).max(10),
    persuasiveness: z.number().min(0).max(10),
    overall: z.number().min(0).max(10),
  }).optional(),
  createdAt: z.date(),
});

export type DebateMessage = z.infer<typeof DebateMessageSchema>;

export const DebateSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  topic: z.string(),
  description: z.string().optional(),
  perspective: z.nativeEnum(DebatePerspective),
  customPerspective: z.string().optional(),
  isActive: z.boolean(),
  mode: z.enum(['human_vs_ai', 'ai_vs_ai', 'spectator']).default('human_vs_ai'),
  aiDebateConfig: z.object({
    participant1: z.object({
      name: z.string(),
      perspective: z.nativeEnum(DebatePerspective),
      personality: z.enum(['logical', 'emotional', 'aggressive', 'diplomatic', 'academic']),
    }),
    participant2: z.object({
      name: z.string(),
      perspective: z.nativeEnum(DebatePerspective),
      personality: z.enum(['logical', 'emotional', 'aggressive', 'diplomatic', 'academic']),
    }),
    maxRounds: z.number().min(1).max(20).default(5),
    autoAdvanceDelay: z.number().min(1000).max(30000).default(3000),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DebateSession = z.infer<typeof DebateSessionSchema>;

// ====================
// Argument Structure
// ====================

export const ArgumentStructureSchema = z.object({
  mainClaim: z.string(),
  supportingEvidence: z.array(z.string()),
  counterpoints: z.array(z.string()),
  conclusion: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
    relevanceScore: z.number().min(0).max(1),
  })),
});

export type ArgumentStructure = z.infer<typeof ArgumentStructureSchema>;

// ====================
// RAG Types
// ====================

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  source: z.string(),
  metadata: z.record(z.any()).optional(),
  embedding: z.array(z.number()).optional(),
  createdAt: z.date(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const RetrievalResultSchema = z.object({
  document: DocumentSchema,
  score: z.number(),
  relevantChunk: z.string(),
});

export type RetrievalResult = z.infer<typeof RetrievalResultSchema>;

// ====================
// API Request/Response Types
// ====================

export const CreateDebateRequestSchema = z.object({
  topic: z.string().min(10).max(500),
  description: z.string().optional(),
  perspective: z.nativeEnum(DebatePerspective),
  customPerspective: z.string().optional(),
});

export type CreateDebateRequest = z.infer<typeof CreateDebateRequestSchema>;

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1).max(2000),
  perspective: z.nativeEnum(DebatePerspective).optional(),
});

export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

export const GenerateArgumentRequestSchema = z.object({
  topic: z.string(),
  perspective: z.nativeEnum(DebatePerspective),
  customPerspective: z.string().optional(),
  context: z.array(z.string()).optional(),
  retrievalResults: z.array(RetrievalResultSchema).optional(),
});

export type GenerateArgumentRequest = z.infer<typeof GenerateArgumentRequestSchema>;

export const GenerateArgumentResponseSchema = z.object({
  argument: ArgumentStructureSchema,
  rawResponse: z.string(),
  perspective: z.nativeEnum(DebatePerspective),
  processingTime: z.number(),
});

export type GenerateArgumentResponse = z.infer<typeof GenerateArgumentResponseSchema>;

// ====================
// Scoring Types
// ====================

export const ArgumentScoreSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  userId: z.string(),
  relevance: z.number().min(1).max(5),
  persuasiveness: z.number().min(1).max(5),
  logicalStrength: z.number().min(1).max(5),
  overallScore: z.number().min(1).max(5),
  feedback: z.string().optional(),
  createdAt: z.date(),
});

export type ArgumentScore = z.infer<typeof ArgumentScoreSchema>;

// ====================
// Authentication Types
// ====================

export const MagicLinkRequestSchema = z.object({
  email: z.string().email(),
});

export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>;

export const AuthTokenSchema = z.object({
  userId: z.string(),
  email: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

// ====================
// AI vs AI Debate Types
// ====================

export const AIPersonalitySchema = z.object({
  style: z.enum(['logical', 'emotional', 'aggressive', 'diplomatic', 'academic']),
  characteristics: z.array(z.string()),
  responseLength: z.enum(['concise', 'moderate', 'detailed']),
  biases: z.array(z.string()).optional(),
});

export type AIPersonality = z.infer<typeof AIPersonalitySchema>;

export const AIDebateParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  perspective: z.nativeEnum(DebatePerspective),
  personality: AIPersonalitySchema,
  systemPrompt: z.string(),
  wins: z.number().default(0),
  totalDebates: z.number().default(0),
});

export type AIDebateParticipant = z.infer<typeof AIDebateParticipantSchema>;

export const AIDebateSessionSchema = z.object({
  id: z.string(),
  topic: z.string(),
  participants: z.array(AIDebateParticipantSchema),
  maxRounds: z.number(),
  currentRound: z.number(),
  status: z.enum(['active', 'completed', 'paused']),
  winner: z.string().optional(), // participant ID
  spectators: z.array(z.string()).optional(), // user IDs
  scores: z.object({
    participant1: z.number(),
    participant2: z.number(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AIDebateSession = z.infer<typeof AIDebateSessionSchema>;

// ====================
// Advanced Scoring Types
// ====================

export const ArgumentAnalysisSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  logicalStructure: z.object({
    hasClaim: z.boolean(),
    hasEvidence: z.boolean(),
    hasReasoning: z.boolean(),
    logicalFallacies: z.array(z.string()),
    score: z.number().min(0).max(10),
  }),
  evidenceQuality: z.object({
    sources: z.number(),
    credibility: z.number().min(0).max(10),
    relevance: z.number().min(0).max(10),
    score: z.number().min(0).max(10),
  }),
  persuasiveness: z.object({
    emotionalAppeal: z.number().min(0).max(10),
    clarity: z.number().min(0).max(10),
    impact: z.number().min(0).max(10),
    score: z.number().min(0).max(10),
  }),
  overallScore: z.number().min(0).max(10),
  feedback: z.string().optional(),
  createdAt: z.date(),
});

export type ArgumentAnalysis = z.infer<typeof ArgumentAnalysisSchema>;

// ====================
// Export Types
// ====================

export const ExportFormatSchema = z.enum(['pdf', 'markdown', 'json', 'html']);
export type ExportFormat = z.infer<typeof ExportFormatSchema>;

export const ExportRequestSchema = z.object({
  debateSessionId: z.string(),
  format: ExportFormatSchema,
  includeScores: z.boolean().default(true),
  includeSources: z.boolean().default(true),
  includeAnalysis: z.boolean().default(false),
  customTitle: z.string().optional(),
  metadata: z.object({
    author: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
});

export type ExportRequest = z.infer<typeof ExportRequestSchema>;

export const ExportResultSchema = z.object({
  filename: z.string(),
  downloadUrl: z.string().optional(),
  content: z.string().optional(), // For immediate download
  size: z.number(),
  generatedAt: z.date(),
});

export type ExportResult = z.infer<typeof ExportResultSchema>;

// ====================
// Utility Functions
// ====================

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

export const safeParseRequest = <T>(schema: z.ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(data);
  return result;
};