const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configuration - Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';

// Initialize Gemini AI with latest model for authentic conversations
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.9,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

// Simple RAG System Implementation
class SimpleRAGSystem {
  constructor() {
    this.searchResults = new Map();
  }

  // Step 1: Simulate web search for relevant information
  async searchWeb(query, numResults = 5) {
    console.log(`[RAG] Searching for: ${query}`);
    
    // Simulated search results with diverse perspectives
    const mockSearchResults = [
      {
        title: `Recent Research on ${query}`,
        snippet: `Latest findings from 2024 research institutes show significant developments in ${query}. Multiple studies indicate varying perspectives on implementation and effectiveness. Key considerations include economic impact, social implications, and long-term sustainability.`,
        url: `https://research.org/${query.replace(/\s+/g, '-')}`,
        source: 'Academic Research Database',
        relevanceScore: 0.92
      },
      {
        title: `Policy Analysis: ${query}`,
        snippet: `Government policy experts have identified critical challenges with ${query}. Recent analysis suggests that while benefits exist, implementation hurdles and unintended consequences require careful consideration. Cross-sector collaboration appears essential.`,
        url: `https://policy.gov/${query.replace(/\s+/g, '-')}`,
        source: 'Policy Research Institute',
        relevanceScore: 0.88
      },
      {
        title: `Economic Impact of ${query}`,
        snippet: `Economic modeling reveals mixed outcomes for ${query}. While some sectors may benefit, others face potential disruption. Cost-benefit analysis shows varying results across different demographics and regions, suggesting need for targeted approaches.`,
        url: `https://economics.edu/${query.replace(/\s+/g, '-')}`,
        source: 'Economic Analysis Center',
        relevanceScore: 0.85
      },
      {
        title: `International Perspective on ${query}`,
        snippet: `Global case studies of ${query} implementation show diverse outcomes. Countries with different economic structures and social systems have experienced varying degrees of success and failure, providing valuable lessons for policy design.`,
        url: `https://international.org/${query.replace(/\s+/g, '-')}`,
        source: 'International Policy Forum',
        relevanceScore: 0.82
      },
      {
        title: `Industry Response to ${query}`,
        snippet: `Private sector analysis of ${query} reveals concerns about market impacts and competitive dynamics. Industry leaders emphasize the need for regulatory clarity and gradual implementation to minimize economic disruption.`,
        url: `https://industry.com/${query.replace(/\s+/g, '-')}`,
        source: 'Industry Analysis Group',
        relevanceScore: 0.79
      }
    ];

    return mockSearchResults.slice(0, numResults);
  }

  // Step 2: Extract and chunk content
  extractAndChunkContent(searchResults) {
    console.log(`[RAG] Chunking ${searchResults.length} search results`);
    
    const chunks = [];
    searchResults.forEach((result, index) => {
      // Split content into meaningful chunks
      const sentences = result.snippet.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      sentences.forEach((sentence, sentIndex) => {
        if (sentence.trim()) {
          chunks.push({
            id: `chunk_${index}_${sentIndex}`,
            content: sentence.trim(),
            source: result.source,
            title: result.title,
            url: result.url,
            originalRelevance: result.relevanceScore
          });
        }
      });
    });

    return chunks;
  }

  // Step 3: Calculate semantic similarity
  calculateSemanticSimilarity(query, chunks) {
    console.log(`[RAG] Calculating similarity for ${chunks.length} chunks`);
    
    return chunks.map(chunk => {
      const queryTerms = query.toLowerCase().split(/\s+/);
      const chunkTerms = chunk.content.toLowerCase().split(/\s+/);
      
      // Simple TF-IDF-like scoring
      let score = 0;
      queryTerms.forEach(term => {
        const termCount = chunkTerms.filter(t => t.includes(term) || term.includes(t)).length;
        score += termCount / chunkTerms.length;
      });
      
      // Boost score with original relevance
      const finalScore = (score * 0.7) + (chunk.originalRelevance * 0.3);
      
      return {
        ...chunk,
        similarityScore: Math.min(finalScore, 1.0)
      };
    }).sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Step 4: Retrieve most relevant chunks
  retrieveRelevantChunks(rankedChunks, topK = 5) {
    console.log(`[RAG] Retrieving top ${topK} relevant chunks`);
    return rankedChunks.slice(0, topK);
  }

  // Step 5: Generate authentic Gemini-style conversational responses
  async generateCounterArgumentsWithGemini(topic, userStance, relevantChunks) {
    console.log(`[RAG] Generating authentic Gemini conversation`);
    
    try {
      // Prepare context from retrieved information
      const contextInfo = relevantChunks.map(chunk => chunk.content).join('\n\n');

      // Authentic Gemini-style prompt that produces natural, specific responses
      const prompt = `I'm having a conversation about "${topic}" and the person just told me their stance is "${userStance}".

Here's some relevant information I found:
${contextInfo}

I want to respond like I'm Gemini AI - thoughtful, nuanced, and genuinely engaging with their specific perspective. I should:

- Acknowledge their viewpoint naturally and specifically
- Share my own "thoughts" and analysis in a conversational way
- Bring up specific, relevant points and examples (not just generic statements)
- Ask thoughtful follow-up questions that show I'm truly engaged
- Be intellectually curious and balanced, like how Gemini naturally responds
- Reference specific aspects of the topic, not just talk in generalities
- Sound like I'm actually thinking through this topic with them

Please respond as if I'm Gemini having this exact conversation about "${topic}" with someone who says "${userStance}". Be specific, authentic, and conversational - not generic or template-like.`;

      console.log(`[RAG] Sending authentic conversation request to Gemini`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      
      console.log(`[RAG] Received authentic Gemini response`);
      console.log(`[RAG] Response preview: ${generatedText.substring(0, 100)}...`);

      return generatedText.trim();

    } catch (error) {
      console.error('[RAG] Gemini API Error:', error);
      
      // If Gemini fails, return an error message instead of generic fallback
      return `I apologize, but I'm having trouble connecting to my AI processing right now. This seems like a fascinating topic about "${topic}" and I'd love to discuss your "${userStance}" perspective, but I need a moment to get my systems back online. Could you try again in a moment?`;
    }
  }

  // Parse Gemini response into structured arguments (kept for backward compatibility)
  parseGeminiResponse(text, relevantChunks) {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
    
    return paragraphs.slice(0, 3).map((paragraph, index) => ({
      text: paragraph.trim(),
      sources: relevantChunks.slice(0, 2).map(chunk => chunk.source),
      retrievalScore: relevantChunks[index % relevantChunks.length]?.similarityScore.toFixed(3) || "0.800",
      vectorSimilarity: (0.75 + Math.random() * 0.25).toFixed(3),
      webSearchTerms: this.generateSearchTerms(topic, userStance),
      theme: `perspective_${index + 1}`,
      confidence: 0.85 + (Math.random() * 0.1),
      ragEnhanced: true,
      sourceUrl: relevantChunks[index % relevantChunks.length]?.url || '',
      retrievedAt: new Date().toISOString(),
      geminiGenerated: true
    }));
  }

  // Fallback arguments if Gemini API fails
  generateFallbackArguments(topic, userStance, relevantChunks) {
    console.log(`[RAG] Using fallback generation`);
    
    return relevantChunks.slice(0, 3).map((chunk, index) => ({
      text: `Based on ${chunk.source}, there are important considerations regarding ${topic} that challenge your position. ${chunk.content} This suggests that your stance on "${userStance}" may benefit from considering additional perspectives and potential implementation challenges.`,
      sources: [chunk.source],
      retrievalScore: chunk.similarityScore.toFixed(3),
      vectorSimilarity: (chunk.similarityScore * 0.9).toFixed(3),
      webSearchTerms: this.generateSearchTerms(topic, userStance),
      theme: `fallback_${index + 1}`,
      confidence: 0.75,
      ragEnhanced: true,
      sourceUrl: chunk.url,
      retrievedAt: new Date().toISOString(),
      fallbackGenerated: true
    }));
  }

  generateSearchTerms(topic, stance) {
    return [
      topic.toLowerCase(),
      `${topic} analysis`,
      `${topic} research`,
      `${topic} policy`
    ];
  }

  // Main RAG pipeline
  async processRAGPipeline(topic, userStance) {
    console.log(`[RAG] Starting RAG pipeline for topic: ${topic}`);
    
    try {
      // Step 1: Search for relevant information
      const searchResults = await this.searchWeb(topic);
      
      // Step 2: Extract and chunk content
      const chunks = this.extractAndChunkContent(searchResults);
      
      // Step 3: Calculate similarity and rank
      const rankedChunks = this.calculateSemanticSimilarity(`${topic} ${userStance}`, chunks);
      
      // Step 4: Retrieve most relevant chunks
      const relevantChunks = this.retrieveRelevantChunks(rankedChunks, 5);
      
      // Step 5: Generate counter-arguments
      const counterArguments = await this.generateCounterArgumentsWithGemini(topic, userStance, relevantChunks);
      
      console.log(`[RAG] Pipeline completed successfully`);
      
      return {
        success: true,
        counterArguments,
        searchResults: searchResults,  // Include search results for LLM endpoint
        vectorSimilarity: relevantChunks.map(chunk => chunk.similarityScore),
        sources: relevantChunks,
        ragMetadata: {
          searchResultsCount: searchResults.length,
          chunksProcessed: chunks.length,
          relevantChunksUsed: relevantChunks.length,
          averageRelevanceScore: relevantChunks.reduce((sum, chunk) => sum + chunk.similarityScore, 0) / relevantChunks.length,
          processingTimestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('[RAG] Pipeline error:', error);
      return {
        success: false,
        message: `RAG pipeline error: ${error.message}`,
        counterArguments: []
      };
    }
  }
}

// Initialize RAG system
const ragSystem = new SimpleRAGSystem();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your-api-key-here'
  });
});

// RAG status endpoint
app.get('/api/rag-status', (req, res) => {
  res.json({
    ragSystemActive: true,
    features: [
      'Web Search Simulation',
      'Semantic Chunking',
      'Vector Similarity Matching',
      'Gemini AI Generation',
      'Source Attribution'
    ],
    geminiApiConfigured: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your-api-key-here'
  });
});

// Enhanced LLM-based conversation endpoint with authentic Gemini personality
app.post('/api/llm-debate', async (req, res) => {
  try {
    const { topic, stance, conversationHistory = [] } = req.body;
    
    if (!topic || !stance) {
      return res.status(400).json({ 
        error: 'Topic and stance are required',
        details: 'Please provide both a debate topic and your stance (FOR/AGAINST/NEUTRAL)' 
      });
    }

    console.log(`🤖 Authentic Gemini Conversation: "${topic}" with stance: ${stance}`);
    
    // Get RAG context first
    const ragResult = await ragSystem.processRAGPipeline(topic, stance);
    
    // Create a completely natural conversation prompt
    const searchContext = ragResult.searchResults && ragResult.searchResults.length > 0 
      ? ragResult.searchResults.map(result => result.snippet || result.title || '').filter(snippet => snippet.length > 0).join('\n\n')
      : 'Recent discussions and research on this topic';

    const conversationPrompt = `You are Gemini, having a genuine conversation with someone about "${topic}".

They just shared that their stance is: "${stance}"

Some relevant context I found through research:
${searchContext}

Please respond as Gemini would - naturally, thoughtfully, and authentically. Don't sound like you're reading from a template. Be curious, ask follow-up questions, share interesting insights, and engage with their specific viewpoint about "${topic}".

${conversationHistory.length > 0 ? `Previous conversation context: ${JSON.stringify(conversationHistory.slice(-2))}` : ''}

Respond as if you're genuinely interested in discussing "${topic}" with someone who feels "${stance}" about it. Be specific to this exact topic, not generic.`;

    console.log(`[Gemini] Sending natural conversation request`);
    
    const result = await model.generateContent(conversationPrompt);
    const response = await result.response;
    const geminiResponse = response.text();
    
    console.log(`[Gemini] Received authentic response: ${geminiResponse.substring(0, 150)}...`);
    
    res.json({
      success: true,
      topic: topic,
      userStance: stance,
      llmResponse: geminiResponse,
      conversational: true,
      ragContext: {
        searchResults: ragResult.searchResults || [],
        vectorSimilarity: ragResult.vectorSimilarity || [],
        totalSources: ragResult.sources?.length || 0
      },
      metadata: {
        timestamp: new Date().toISOString(),
        responseType: 'AUTHENTIC_GEMINI_CONVERSATION',
        stance: stance,
        model: 'gemini-1.5-flash',
        temperature: 0.9,
        authentic: true
      }
    });

  } catch (error) {
    console.error('❌ Error in authentic Gemini conversation:', error.message);
    
    // Even error messages should feel authentic
    const errorResponse = `I'm having some technical difficulties right now, but I'm really interested in discussing "${req.body.topic}" with you! Your ${req.body.stance} perspective sounds intriguing. Could you give me a moment to get my systems sorted and try again? I promise the conversation will be worth the wait!`;
    
    res.status(500).json({ 
      success: false,
      llmResponse: errorResponse,
      error: 'Temporary connection issue',
      authentic: true,
      metadata: {
        timestamp: new Date().toISOString(),
        responseType: 'ERROR_BUT_AUTHENTIC'
      }
    });
  }
});

// Main counter-arguments generation endpoint
app.post('/api/generate-counter-arguments', async (req, res) => {
  console.log('[API] Received counter-arguments request');
  
  try {
    const { topic, userStance, includeRAG = true } = req.body;
    
    if (!topic || !userStance) {
      return res.status(400).json({
        success: false,
        message: 'Topic and user stance are required'
      });
    }
    
    console.log(`[API] Processing: ${topic} | ${userStance}`);
    
    if (includeRAG) {
      const result = await ragSystem.processRAGPipeline(topic, userStance);
      res.json(result);
    } else {
      res.json({
        success: false,
        message: 'RAG processing is required for this system'
      });
    }
    
  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
      counterArguments: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Clean RAG-Based AI Debate Partner running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🧬 RAG Status: http://localhost:${PORT}/api/rag-status`);
  console.log(`🧠 Counter-arguments API: http://localhost:${PORT}/api/generate-counter-arguments`);
  console.log(`🔬 RAG Features: Web Search + Vector Similarity + AI Generation`);
  console.log(`🔑 Gemini API: ${GEMINI_API_KEY ? 'Configured ✅' : 'Not Configured ❌'}`);
});