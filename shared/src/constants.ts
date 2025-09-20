// ====================
// Enum Definition
// ====================

enum DebatePerspective {
  FOR = 'for',
  AGAINST = 'against',
  NEUTRAL = 'neutral',
  ECONOMIC = 'economic',
  ETHICAL = 'ethical',
  LEGAL = 'legal',
  SCIENTIFIC = 'scientific',
  CUSTOM = 'custom',
}

// ====================
// API Constants
// ====================

export const API_ENDPOINTS = {
  AUTH: {
    MAGIC_LINK: '/api/auth/magic-link',
    VERIFY: '/api/auth/verify',
    LOGOUT: '/api/auth/logout',
  },
  DEBATES: {
    CREATE: '/api/debates',
    GET_BY_ID: '/api/debates',
    GET_BY_USER: '/api/debates/user',
    ADD_MESSAGE: '/api/debates/:id/messages',
    GET_MESSAGES: '/api/debates/:id/messages',
  },
  RAG: {
    SEARCH: '/api/rag/search',
    INGEST: '/api/rag/ingest',
    GENERATE: '/api/rag/generate',
  },
  AI_DEBATE: {
    CREATE: '/api/ai-debate',
    START: '/api/ai-debate/:id/start',
    GET_STATUS: '/api/ai-debate/:id/status',
  },
  EXPORT: {
    DEBATE: '/api/export/debate/:id',
  },
  SCORING: {
    SUBMIT: '/api/scoring/submit',
    GET_STATS: '/api/scoring/stats',
  },
} as const;

// ====================
// Perspective Configurations
// ====================

export const PERSPECTIVE_CONFIGS = {
  [DebatePerspective.FOR]: {
    label: 'Supporting',
    description: 'Arguments in favor of the topic',
    icon: '👍',
    color: '#22c55e',
  },
  [DebatePerspective.AGAINST]: {
    label: 'Opposing',
    description: 'Arguments against the topic',
    icon: '👎',
    color: '#ef4444',
  },
  [DebatePerspective.NEUTRAL]: {
    label: 'Balanced',
    description: 'Balanced analysis with multiple viewpoints',
    icon: '⚖️',
    color: '#6b7280',
  },
  [DebatePerspective.ECONOMIC]: {
    label: 'Economic',
    description: 'Focus on economic implications and impacts',
    icon: '💰',
    color: '#f59e0b',
  },
  [DebatePerspective.ETHICAL]: {
    label: 'Ethical',
    description: 'Moral and ethical considerations',
    icon: '🤝',
    color: '#8b5cf6',
  },
  [DebatePerspective.LEGAL]: {
    label: 'Legal',
    description: 'Legal framework and regulatory aspects',
    icon: '⚖️',
    color: '#0ea5e9',
  },
  [DebatePerspective.SCIENTIFIC]: {
    label: 'Scientific',
    description: 'Evidence-based scientific analysis',
    icon: '🔬',
    color: '#06b6d4',
  },
  [DebatePerspective.CUSTOM]: {
    label: 'Custom',
    description: 'User-defined perspective',
    icon: '✨',
    color: '#ec4899',
  },
} as const;

// ====================
// LLM Configuration
// ====================

export const LLM_CONFIG = {
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.1,
} as const;

// ====================
// RAG Configuration
// ====================

export const RAG_CONFIG = {
  CHUNK_SIZE: 1000,
  CHUNK_OVERLAP: 200,
  MAX_RETRIEVAL_DOCS: 10,
  SIMILARITY_THRESHOLD: 0.7,
  EMBEDDING_DIMENSIONS: 384,
} as const;

// ====================
// Validation Constraints
// ====================

export const VALIDATION_LIMITS = {
  TOPIC: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  CUSTOM_PERSPECTIVE: {
    MAX_LENGTH: 100,
  },
  DEBATE_HISTORY: {
    MAX_MESSAGES: 100,
  },
} as const;

// ====================
// Error Messages
// ====================

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_EMAIL: 'Please provide a valid email address',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again',
    UNAUTHORIZED: 'You are not authorized to access this resource',
  },
  DEBATE: {
    NOT_FOUND: 'Debate session not found',
    INVALID_TOPIC: 'Topic must be between 10 and 500 characters',
    INVALID_MESSAGE: 'Message cannot be empty',
    SESSION_ENDED: 'This debate session has ended',
  },
  RAG: {
    NO_RESULTS: 'No relevant documents found for your query',
    SEARCH_FAILED: 'Failed to search knowledge base',
    GENERATION_FAILED: 'Failed to generate response',
  },
  GENERAL: {
    SERVER_ERROR: 'An unexpected error occurred',
    VALIDATION_ERROR: 'Please check your input and try again',
    RATE_LIMIT: 'Too many requests. Please try again later',
  },
} as const;

// ====================
// Success Messages
// ====================

export const SUCCESS_MESSAGES = {
  AUTH: {
    MAGIC_LINK_SENT: 'Magic link sent to your email',
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
  },
  DEBATE: {
    SESSION_CREATED: 'Debate session created successfully',
    MESSAGE_SENT: 'Message sent successfully',
    ARGUMENT_GENERATED: 'Argument generated successfully',
  },
  EXPORT: {
    DEBATE_EXPORTED: 'Debate transcript exported successfully',
  },
  SCORING: {
    SCORE_SUBMITTED: 'Your score has been recorded',
  },
} as const;

// ====================
// System Prompts
// ====================

export const SYSTEM_PROMPTS = {
  BASE_DEBATER: `You are an expert debate partner with deep knowledge across multiple domains. Your role is to engage in structured, evidence-based arguments while maintaining intellectual honesty and respect.

Guidelines:
1. Present clear, well-structured arguments with supporting evidence
2. Acknowledge valid counterpoints and limitations
3. Use relevant examples and analogies
4. Maintain a respectful and professional tone
5. Cite sources when available
6. Focus on logical reasoning over emotional appeals`,

  PERSPECTIVE_SPECIFIC: {
    [DebatePerspective.FOR]: 'Focus on presenting the strongest arguments in favor of the topic while acknowledging potential weaknesses.',
    [DebatePerspective.AGAINST]: 'Present compelling arguments against the topic while fairly representing the opposing viewpoint.',
    [DebatePerspective.NEUTRAL]: 'Provide a balanced analysis that examines multiple perspectives objectively.',
    [DebatePerspective.ECONOMIC]: 'Analyze the topic primarily through an economic lens, considering costs, benefits, market impacts, and financial implications.',
    [DebatePerspective.ETHICAL]: 'Examine the moral and ethical dimensions, considering principles of right and wrong, fairness, and social responsibility.',
    [DebatePerspective.LEGAL]: 'Focus on legal frameworks, regulations, precedents, and jurisprudential considerations.',
    [DebatePerspective.SCIENTIFIC]: 'Emphasize empirical evidence, research findings, methodology, and scientific consensus.',
  },
} as const;