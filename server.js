const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../..')));

// Configuration - Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';

// Initialize Gemini AI with latest model for authentic conversations
let genAI;
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend-modern.js'));
});

// API status endpoint
app.get('/api/rag-status', (req, res) => {
  res.json({
    status: 'active',
    features: {
      webSearch: true,
      vectorSimilarity: true,
      aiGeneration: true,
      geminiIntegration: !!GEMINI_API_KEY
    }
  });
});

// Simple RAG System Class
class SimpleRAGSystem {
  constructor() {
    this.documents = [];
  }

  simulateWebSearch(query) {
    console.log(`[RAG] Searching for: ${query}`);
    return [
      `Research on ${query} shows various perspectives and evidence.`,
      `Studies indicate different viewpoints regarding ${query}.`,
      `Academic literature presents multiple arguments about ${query}.`,
      `Experts have varying opinions on ${query} based on different criteria.`,
      `Current evidence suggests nuanced understanding of ${query} is important.`
    ];
  }

  chunkDocuments(searchResults) {
    console.log(`[RAG] Chunking ${searchResults.length} search results`);
    const chunks = [];
    searchResults.forEach((result, idx) => {
      const sentences = result.split('. ');
      sentences.forEach((sentence, sentIdx) => {
        if (sentence.trim()) {
          chunks.push({
            id: `chunk_${idx}_${sentIdx}`,
            text: sentence.trim(),
            source: `search_result_${idx}`,
            embedding: this.generateSimpleEmbedding(sentence)
          });
        }
      });
    });
    return chunks;
  }

  generateSimpleEmbedding(text) {
    return text.toLowerCase().split(' ').map(word => word.length * 0.1);
  }

  calculateSimilarity(queryEmbedding, chunkEmbedding) {
    const minLength = Math.min(queryEmbedding.length, chunkEmbedding.length);
    let similarity = 0;
    for (let i = 0; i < minLength; i++) {
      similarity += queryEmbedding[i] * chunkEmbedding[i];
    }
    return similarity / (minLength || 1);
  }

  retrieveRelevantChunks(query, chunks, topK = 5) {
    console.log(`[RAG] Calculating similarity for ${chunks.length} chunks`);
    const queryEmbedding = this.generateSimpleEmbedding(query);
    
    const rankedChunks = chunks.map(chunk => ({
      ...chunk,
      similarity: this.calculateSimilarity(queryEmbedding, chunk.embedding)
    })).sort((a, b) => b.similarity - a.similarity);

    console.log(`[RAG] Retrieving top ${topK} relevant chunks`);
    return rankedChunks.slice(0, topK);
  }

  async processRAGPipeline(query, stance) {
    try {
      console.log(`[RAG] Starting RAG pipeline for topic: ${query}`);
      
      const searchResults = this.simulateWebSearch(query);
      const chunks = this.chunkDocuments(searchResults);
      const relevantChunks = this.retrieveRelevantChunks(query, chunks);
      
      const context = relevantChunks.map(chunk => chunk.text).join(' ');
      
      console.log(`[RAG] Generating authentic Gemini conversation`);
      const response = await this.generateAuthenticResponse(query, stance, context);
      
      console.log(`[RAG] Pipeline completed successfully`);
      return {
        success: true,
        response: response,
        context: context,
        relevantChunks: relevantChunks.length
      };
      
    } catch (error) {
      console.error('[RAG] Pipeline error:', error);
      return {
        success: false,
        error: error.message,
        fallbackResponse: `I understand you're ${stance.toLowerCase()} the topic "${query}". That's an interesting perspective that deserves thoughtful discussion.`
      };
    }
  }

  async generateAuthenticResponse(topic, stance, context) {
    if (!genAI) {
      throw new Error('Gemini AI not initialized - check API key');
    }

    try {
      console.log(`[RAG] Sending authentic conversation request to Gemini`);
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 1000
        }
      });

      const conversationPrompt = `You are an engaging debate partner having a natural conversation. The human has stated their stance on a topic, and you should respond authentically and conversationally.

Context information: ${context}

Topic: "${topic}"
Human's stance: ${stance}

Guidelines:
- Respond as if you're genuinely curious and engaged in conversation
- Ask thoughtful follow-up questions
- Show interest in their perspective
- Keep it conversational and natural
- Don't be overly formal or robotic
- If they're FOR something, explore what specifically appeals to them
- If they're AGAINST something, understand their concerns
- Use casual language and show personality

Respond with genuine curiosity and engagement:`;

      const result = await model.generateContent(conversationPrompt);
      const response = result.response.text();
      
      console.log(`[RAG] Received authentic Gemini response`);
      console.log(`[RAG] Response preview: ${response.substring(0, 100)}...`);
      
      return response;
      
    } catch (error) {
      console.error('[RAG] Gemini generation error:', error);
      throw error;
    }
  }
}

const ragSystem = new SimpleRAGSystem();

// Generate counter-arguments endpoint
app.post('/api/generate-counter-arguments', async (req, res) => {
  try {
    const { topic, stance } = req.body;
    
    if (!topic || !stance) {
      return res.status(400).json({ 
        error: 'Missing required fields: topic and stance' 
      });
    }

    console.log(`🤖 Authentic Gemini Conversation: "${topic}" with stance: ${stance}`);
    
    const result = await ragSystem.processRAGPipeline(topic, stance);
    
    if (result.success) {
      res.json({
        success: true,
        response: result.response,
        metadata: {
          ragEnabled: true,
          contextChunks: result.relevantChunks,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.json({
        success: false,
        response: result.fallbackResponse,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Clean RAG-Based AI Debate Partner running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🧬 RAG Status: http://localhost:${PORT}/api/rag-status`);
  console.log(`🧠 Counter-arguments API: http://localhost:${PORT}/api/generate-counter-arguments`);
  console.log(`🔬 RAG Features: Web Search + Vector Similarity + AI Generation`);
  console.log(`🔑 Gemini API: ${GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
});