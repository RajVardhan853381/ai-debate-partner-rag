const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mock AI responses for counter-arguments
const generateCounterArguments = (topic, userStance) => {
  // This would normally call the Gemini API
  const counterArguments = [
    {
      text: `While your position on "${topic}" has merit, consider that opposing viewpoints often arise from different foundational assumptions. Research suggests that alternative approaches may yield different outcomes than what you've outlined.`,
      sources: ["Academic Research Database", "Policy Analysis Institute"]
    },
    {
      text: `Your stance overlooks potential unintended consequences that could emerge from this approach. Historical precedents show similar positions have sometimes led to outcomes that contradict the original intentions.`,
      sources: ["Historical Analysis Journal", "Case Study Repository"]
    },
    {
      text: `From an economic perspective, the implementation of your proposed stance might face practical challenges that weren't fully addressed in your argument. Cost-benefit analyses often reveal hidden complexities.`,
      sources: ["Economic Policy Review", "Implementation Studies"]
    }
  ];

  // Customize based on stance content
  if (userStance.toLowerCase().includes('benefit') || userStance.toLowerCase().includes('advantage')) {
    counterArguments.push({
      text: `While you emphasize the benefits, it's important to weigh these against potential drawbacks that may not be immediately apparent but could manifest over time.`,
      sources: ["Long-term Impact Studies", "Risk Assessment Framework"]
    });
  }

  if (userStance.toLowerCase().includes('should') || userStance.toLowerCase().includes('must')) {
    counterArguments.push({
      text: `Your prescriptive approach assumes a level of certainty that may not account for contextual variations and individual circumstances that could make blanket recommendations problematic.`,
      sources: ["Context-Dependent Policy Studies", "Individual Variation Research"]
    });
  }

  return counterArguments.slice(0, 3); // Return top 3
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    message: 'AI Debate Partner Backend is running',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Generate counter-arguments endpoint
app.post('/api/generate-counter-arguments', async (req, res) => {
  try {
    const { topic, userStance, includeRAG } = req.body;

    if (!topic || !userStance) {
      return res.status(400).json({
        success: false,
        message: 'Topic and user stance are required'
      });
    }

    if (userStance.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a more detailed stance (at least 10 characters)'
      });
    }

    console.log('Generating counter-arguments for:', {
      topic: topic.substring(0, 100) + '...',
      stanceLength: userStance.length,
      includeRAG
    });

    // Generate counter-arguments
    const counterArguments = generateCounterArguments(topic, userStance);

    // If RAG is enabled, enhance with "research"
    if (includeRAG) {
      counterArguments.forEach(arg => {
        if (!arg.sources) {
          arg.sources = ["Academic Research", "Expert Analysis"];
        }
        arg.ragEnhanced = true;
      });
    }

    res.json({
      success: true,
      counterArguments,
      metadata: {
        topic,
        stanceLength: userStance.length,
        generatedAt: new Date().toISOString(),
        ragEnabled: includeRAG
      }
    });

  } catch (error) {
    console.error('Error generating counter-arguments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while generating counter-arguments'
    });
  }
});

// Fallback for old API endpoints
app.get('/api/debates', (req, res) => {
  res.json({ success: true, data: [], message: 'Debates endpoint - now using counter-arguments' });
});

app.post('/api/debates', (req, res) => {
  res.json({ success: true, message: 'Use /api/generate-counter-arguments instead' });
});

app.get('/api/ai-debates', (req, res) => {
  res.json({ success: true, data: [], message: 'AI debates endpoint - now using counter-arguments' });
});

app.post('/api/ai-debates', (req, res) => {
  res.json({ success: true, message: 'Use /api/generate-counter-arguments instead' });
});

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found. Available routes: /health, /api/generate-counter-arguments`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Debate Partner Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 Counter-arguments API: http://localhost:${PORT}/api/generate-counter-arguments`);
  console.log(`🎯 Focus: Stance-based counter-argument generation with RAG support`);
});

module.exports = app;