import { 
  CreateDebateRequest,
  SendMessageRequest,
  DebateSession,
  DebateMessage,
  MagicLinkRequest,
  createSuccessResponse,
  createErrorResponse,
} from '@ai-debate/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication endpoints
  async sendMagicLink(email: string) {
    return this.request('/api/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(token: string) {
    return this.request(`/api/auth/verify/${token}`, {
      method: 'GET',
    });
  }

  async refreshToken() {
    return this.request('/api/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Debate endpoints
  async createDebate(data: CreateDebateRequest): Promise<DebateSession> {
    const response = await this.request('/api/debates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getDebateSession(id: string): Promise<DebateSession> {
    const response = await this.request(`/api/debates/${id}`);
    return response.data;
  }

  async getUserDebates(): Promise<DebateSession[]> {
    const response = await this.request('/api/debates');
    return response.data;
  }

  async sendMessage(debateId: string, data: SendMessageRequest): Promise<DebateMessage> {
    const response = await this.request(`/api/debates/${debateId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getDebateMessages(debateId: string): Promise<DebateMessage[]> {
    const response = await this.request(`/api/debates/${debateId}/messages`);
    return response.data;
  }

  // RAG endpoints
  async searchDocuments(query: string, maxResults?: number) {
    return this.request('/api/rag/search', {
      method: 'POST',
      body: JSON.stringify({ query, maxResults }),
    });
  }

  async generateArgument(data: {
    topic: string;
    perspective: string;
    customPerspective?: string;
    context?: string[];
  }) {
    return this.request('/api/rag/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI vs AI debate endpoints
  async createAiDebate(data: {
    topic: string;
    participants: Array<{
      name: string;
      perspective: string;
    }>;
    maxRounds: number;
  }) {
    return this.request('/api/ai-debate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startAiDebate(id: string) {
    return this.request(`/api/ai-debate/${id}/start`, {
      method: 'POST',
    });
  }

  async getAiDebateStatus(id: string) {
    return this.request(`/api/ai-debate/${id}/status`);
  }

  // Scoring endpoints
  async submitScore(data: {
    messageId: string;
    relevance: number;
    persuasiveness: number;
    logicalStrength: number;
    feedback?: string;
  }) {
    return this.request('/api/scoring/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getScoringStats() {
    return this.request('/api/scoring/stats');
  }

  // Export endpoints
  async exportDebate(debateId: string, format: 'pdf' | 'markdown' | 'json') {
    return this.request(`/api/export/debate/${debateId}?format=${format}`);
  }

  // Health check
  async healthCheck() {
    return fetch(`${API_BASE_URL}/health`).then(res => res.json());
  }
}

export const apiClient = new ApiClient();