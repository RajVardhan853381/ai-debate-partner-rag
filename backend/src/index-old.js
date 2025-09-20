const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Helper functions for RAG simulation
const generateSearchTerms = (topic, stance, theme) => {
  const baseTerms = topic.split(' ').slice(0, 3);
  const themeTerms = {
    economic: ['cost analysis', 'economic impact', 'financial implications'],
    environmental: ['environmental impact', 'sustainability', 'ecological effects'],
    social: ['social implications', 'community impact', 'demographic effects'],
    technical: ['technical feasibility', 'implementation challenges', 'technology adoption'],
    policy: ['policy implications', 'regulatory framework', 'governance'],
    contextual: ['contextual factors', 'situational variables', 'case studies'],
    complexity: ['systems analysis', 'complexity theory', 'emergent properties']
  };
  
  return [...baseTerms, ...(themeTerms[theme] || ['recent studies', 'expert analysis', 'current research'])];
};

const generateRandomRegion = () => {
  const regions = ['Northern Europe', 'Southeast Asia', 'North America', 'Latin America', 'East Africa', 'the Middle East', 'Oceania', 'Eastern Europe'];
  return regions[Math.floor(Math.random() * regions.length)];
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mock AI responses for counter-arguments with RAG simulation
const generateCounterArguments = (topic, userStance) => {
  const stanceLower = userStance.toLowerCase();
  const topicLower = topic.toLowerCase();
  
  // Analyze the stance for key themes
  const themes = {
    economic: stanceLower.includes('cost') || stanceLower.includes('money') || stanceLower.includes('economic') || stanceLower.includes('budget'),
    social: stanceLower.includes('people') || stanceLower.includes('society') || stanceLower.includes('community') || stanceLower.includes('social'),
    environmental: stanceLower.includes('environment') || stanceLower.includes('climate') || stanceLower.includes('green') || stanceLower.includes('sustainable'),
    technical: stanceLower.includes('technology') || stanceLower.includes('ai') || stanceLower.includes('digital') || stanceLower.includes('tech'),
    policy: stanceLower.includes('government') || stanceLower.includes('law') || stanceLower.includes('policy') || stanceLower.includes('regulation'),
    ethical: stanceLower.includes('moral') || stanceLower.includes('ethical') || stanceLower.includes('right') || stanceLower.includes('wrong')
  };

  const counterArguments = [];

  // Generate theme-specific counter-arguments
  if (themes.economic) {
    counterArguments.push({
      text: `While your economic analysis considers direct costs, recent studies from the International Economic Review (2024) suggest that hidden externalities often increase total costs by 15-30%. A comprehensive cost-benefit analysis should include long-term societal impacts that may not be immediately apparent in traditional economic models.`,
      sources: ["International Economic Review 2024", "Cambridge Economic Policy Institute", "World Bank Economic Analysis Framework"],
      theme: "economic",
      confidence: 0.85
    });
  }

  if (themes.environmental || topicLower.includes('climate')) {
    counterArguments.push({
      text: `Your environmental perspective, while well-intentioned, may not account for recent findings from the Global Climate Research Network showing that alternative approaches could achieve 40% better outcomes. The 2024 IPCC supplementary report highlights emerging solutions that weren't previously considered viable.`,
      sources: ["IPCC Supplementary Report 2024", "Global Climate Research Network", "Environmental Science & Policy Journal"],
      theme: "environmental",
      confidence: 0.92
    });
  }

  if (themes.social) {
    counterArguments.push({
      text: `While your social considerations are valuable, demographic research from the Stanford Social Policy Lab indicates that implementation challenges often emerge from cultural factors not addressed in your framework. Cross-cultural studies show significant variation in outcomes across different communities.`,
      sources: ["Stanford Social Policy Lab", "Cross-Cultural Implementation Studies", "Journal of Social Policy Research"],
      theme: "social",
      confidence: 0.78
    });
  }

  if (themes.technical || themes.policy) {
    counterArguments.push({
      text: `Your technical/policy approach overlooks recent developments in implementation science. The MIT Technology Policy Review (September 2025) documents cases where similar approaches faced unexpected scalability issues. Regulatory frameworks may need updating to address these technological complexities.`,
      sources: ["MIT Technology Policy Review Sept 2025", "Implementation Science Quarterly", "Regulatory Affairs Journal"],
      theme: "technical-policy",
      confidence: 0.81
    });
  }

  // Add universal counter-arguments based on stance characteristics
  if (stanceLower.includes('always') || stanceLower.includes('never') || stanceLower.includes('must') || stanceLower.includes('should')) {
    counterArguments.push({
      text: `Your absolute position doesn't account for contextual variations that research consistently shows affect outcomes. The Harvard Policy Implementation Study (2024) found that rigid approaches often fail when applied across diverse contexts, suggesting a more nuanced framework might be more effective.`,
      sources: ["Harvard Policy Implementation Study 2024", "Contextual Variation Research", "Adaptive Policy Framework Institute"],
      theme: "contextual",
      confidence: 0.88
    });
  }

  if (userStance.length > 500) {
    counterArguments.push({
      text: `While your comprehensive analysis covers many important points, systems thinking research from the Santa Fe Institute suggests that complex positions often create implementation paradoxes. Simpler, more focused approaches might achieve better real-world outcomes despite appearing less thorough.`,
      sources: ["Santa Fe Institute Systems Research", "Implementation Paradox Studies", "Complexity Science Review"],
      theme: "complexity",
      confidence: 0.76
    });
  }

  // Fallback counter-arguments if no specific themes detected
  if (counterArguments.length === 0) {
    counterArguments.push({
      text: `Your position, while logically constructed, may benefit from considering alternative frameworks that recent interdisciplinary research has highlighted. The Journal of Integrated Studies (2024) shows that seemingly opposing viewpoints often reveal complementary insights when examined through different methodological lenses.`,
      sources: ["Journal of Integrated Studies 2024", "Interdisciplinary Research Methods", "Alternative Framework Analysis"],
      theme: "general",
      confidence: 0.70
    });

    counterArguments.push({
      text: `Historical precedent analysis from the Global Policy Archive suggests that positions similar to yours have encountered unexpected challenges during implementation. Learning from these cases could strengthen your approach and help anticipate potential obstacles.`,
      sources: ["Global Policy Archive", "Historical Precedent Database", "Implementation Challenge Studies"],
      theme: "historical",
      confidence: 0.73
    });
  }

  // Ensure we have exactly 3 counter-arguments
  while (counterArguments.length < 3) {
    counterArguments.push({
      text: `Additional research perspectives from the International Think Tank Consortium suggest that your stance could be enhanced by incorporating insights from related fields. Cross-disciplinary approaches often reveal blind spots in single-perspective analyses.`,
      sources: ["International Think Tank Consortium", "Cross-Disciplinary Studies", "Perspective Integration Research"],
      theme: "interdisciplinary",
      confidence: 0.65
    });
  }

  return counterArguments.slice(0, 3);
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

    // If RAG is enabled, enhance with "research" and real-time information simulation
    if (includeRAG) {
      counterArguments.forEach((arg, index) => {
        // Add RAG-enhanced content
        arg.ragEnhanced = true;
        arg.retrievalScore = (0.7 + Math.random() * 0.3).toFixed(2); // Simulate retrieval confidence
        
        // Add simulated real-time information
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        
        // Enhance sources with more recent and specific information
        arg.sources = arg.sources.map(source => {
          if (Math.random() > 0.5) {
            return `${source} (${currentMonth} ${currentYear} Update)`;
          }
          return source;
        });

        // Add web search simulation markers
        arg.webSearchTerms = generateSearchTerms(topic, userStance, arg.theme);
        arg.vectorSimilarity = (0.65 + Math.random() * 0.35).toFixed(3);
        
        // Enhance text with more specific, "retrieved" information
        if (index === 0) {
          arg.text = `[RAG-Enhanced] ${arg.text} Furthermore, real-time data analysis reveals that ${Math.floor(Math.random() * 40 + 60)}% of similar implementations in the past 12 months have encountered the challenges mentioned, with particularly notable cases in ${generateRandomRegion()}.`;
        }
      });

      // Add a synthesized RAG summary
      counterArguments.push({
        text: `[Synthesis] Based on real-time information retrieval across ${Math.floor(Math.random() * 50 + 100)} recent sources, the collective evidence suggests that while your position has strong foundations, emerging trends and recent developments create new considerations that warrant attention. This synthesis represents the convergence of multiple expert perspectives from the past 6 months.`,
        sources: ["Real-time Academic Feed", "Expert Opinion Aggregator", "Current Affairs Database", "Policy Update Stream"],
        theme: "rag-synthesis",
        confidence: 0.89,
        ragEnhanced: true,
        retrievalScore: "0.94",
        isRAGSynthesis: true
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