const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple HTML page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Debate Partner</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
      color: white;
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      margin-bottom: 2rem;
      padding: 1.5rem 2rem;
      background: rgba(0,0,0,0.2);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .logo { 
      width: 48px; 
      height: 48px; 
      background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .title { font-size: 1.5rem; font-weight: bold; }
    .subtitle { color: #94a3b8; font-size: 0.875rem; }
    .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
    .card { 
      background: rgba(15, 20, 25, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .input { 
      width: 100%; 
      padding: 0.75rem; 
      border-radius: 8px; 
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.3);
      color: white;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    .textarea { 
      height: 200px; 
      resize: vertical; 
    }
    .button { 
      width: 100%;
      padding: 1rem 2rem;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
      color: white;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .button:disabled { 
      background: rgba(100, 116, 139, 0.5);
      cursor: not-allowed;
    }
    .status { 
      color: #22c55e; 
      font-weight: bold; 
    }
    .status.offline { 
      color: #ef4444; 
    }
    .argument {
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      padding: 1.5rem;
      border-left: 4px solid #4ade80;
      margin-bottom: 1rem;
    }
    .argument.rag {
      border-left: 4px solid #22d3ee;
      background: rgba(34, 211, 238, 0.1);
    }
    .rag-badge {
      background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
      color: black;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🧠</div>
      <div>
        <h1 class="title">AI Debate Partner</h1>
        <p class="subtitle">Intelligent Counter-Arguments Powered by RAG</p>
      </div>
    </div>
    
    <div class="main-grid">
      <div>
        <div class="card">
          <h2>💭 Share Your Stance</h2>
          <p style="color: #94a3b8; margin-bottom: 2rem;">Enter your position on any debate topic and receive intelligent counter-arguments</p>
          
          <label>🧩 Select Topic (Optional)</label>
          <select id="topicSelect" class="input">
            <option value="">Choose a topic or enter custom below...</option>
            <option>Climate change policies should prioritize economic growth over environmental protection</option>
            <option>Artificial intelligence will create more jobs than it eliminates</option>
            <option>Social media platforms should be regulated by government agencies</option>
            <option>Remote work is more productive than traditional office work</option>
            <option>Cryptocurrency should replace traditional banking systems</option>
            <option>Universal basic income should be implemented globally</option>
            <option>Nuclear energy is the best solution to climate change</option>
            <option>Private space exploration benefits humanity more than government programs</option>
            <option>Genetic engineering should be used to enhance human capabilities</option>
            <option>Traditional education systems are obsolete in the digital age</option>
            <option value="custom">Custom Topic</option>
          </select>
          
          <div id="customTopicDiv" style="display: none;">
            <label>🎯 Custom Topic</label>
            <input type="text" id="customTopic" class="input" placeholder="Enter your own debate topic...">
          </div>
          
          <label>💡 Your Stance</label>
          <textarea id="userStance" class="input textarea" placeholder="Share your position, arguments, and reasoning on this topic. Be specific and detailed to receive more targeted counter-arguments..." maxlength="2000"></textarea>
          <div style="text-align: right; color: #64748b; font-size: 0.875rem; margin-bottom: 2rem;">
            <span id="charCount">0/2000 characters</span>
          </div>
          
          <button id="generateBtn" class="button">
            🧠 Generate Counter-Arguments
          </button>
        </div>
        
        <div id="resultsCard" class="card" style="display: none;">
          <h2>⚡ Counter-Arguments</h2>
          <div id="argumentsList"></div>
        </div>
      </div>
      
      <div>
        <div class="card">
          <h3>⚡ System Status</h3>
          <p>Backend: <span id="status" class="status">Checking...</span></p>
        </div>
        
        <div class="card">
          <h3>🧬 RAG Technology</h3>
          <p style="color: #94a3b8; margin-bottom: 1rem; font-size: 0.875rem;">
            Retrieval-Augmented Generation combines real-time information retrieval with AI generation:
          </p>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="color: #22d3ee;">🔍</span>
              <span style="font-size: 0.875rem;">Web search for current information</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="color: #4ade80;">🔗</span>
              <span style="font-size: 0.875rem;">Vector similarity matching</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="color: #f59e0b;">🧠</span>
              <span style="font-size: 0.875rem;">Intelligent argument synthesis</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #8b5cf6;">✅</span>
              <span style="font-size: 0.875rem;">Source verification</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>💡 Debate Tips</h3>
          <div>
            <div style="font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.75rem; padding-left: 1rem; position: relative;">
              <span style="position: absolute; left: 0; color: #4ade80; font-weight: bold;">•</span>
              Use specific examples and evidence to support your arguments
            </div>
            <div style="font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.75rem; padding-left: 1rem; position: relative;">
              <span style="position: absolute; left: 0; color: #4ade80; font-weight: bold;">•</span>
              Acknowledge counterpoints to strengthen your position
            </div>
            <div style="font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.75rem; padding-left: 1rem; position: relative;">
              <span style="position: absolute; left: 0; color: #4ade80; font-weight: bold;">•</span>
              Focus on logical reasoning rather than emotional appeals
            </div>
            <div style="font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.75rem; padding-left: 1rem; position: relative;">
              <span style="position: absolute; left: 0; color: #4ade80; font-weight: bold;">•</span>
              Cite credible sources when making factual claims
            </div>
            <div style="font-size: 0.875rem; color: #cbd5e1; padding-left: 1rem; position: relative;">
              <span style="position: absolute; left: 0; color: #4ade80; font-weight: bold;">•</span>
              Consider the long-term implications of your stance
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let backendStatus = 'checking';
    
    // Check backend connection
    async function checkBackendConnection() {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
          backendStatus = 'online';
          document.getElementById('status').textContent = '✅ Connected';
          document.getElementById('status').classList.remove('offline');
        } else {
          backendStatus = 'offline';
          document.getElementById('status').textContent = '❌ Offline';
          document.getElementById('status').classList.add('offline');
        }
      } catch (error) {
        backendStatus = 'offline';
        document.getElementById('status').textContent = '❌ Offline';
        document.getElementById('status').classList.add('offline');
      }
    }
    
    // Character counter
    document.getElementById('userStance').addEventListener('input', function() {
      const count = this.value.length;
      document.getElementById('charCount').textContent = count + '/2000 characters';
    });
    
    // Topic selection
    document.getElementById('topicSelect').addEventListener('change', function() {
      const customDiv = document.getElementById('customTopicDiv');
      if (this.value === 'custom') {
        customDiv.style.display = 'block';
      } else {
        customDiv.style.display = 'none';
      }
    });
    
    // Generate counter-arguments
    async function generateCounterArguments() {
      const topicSelect = document.getElementById('topicSelect').value;
      const customTopic = document.getElementById('customTopic').value;
      const userStance = document.getElementById('userStance').value;
      const generateBtn = document.getElementById('generateBtn');
      
      const topic = topicSelect === 'custom' ? customTopic : topicSelect;
      
      if (!topic.trim() || !userStance.trim()) {
        alert('Please select a topic and enter your stance');
        return;
      }
      
      if (backendStatus !== 'online') {
        alert('Backend is offline. Please check the connection.');
        return;
      }
      
      // Show loading state
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<div class="spinner"></div> Generating Counter-Arguments...';
      
      try {
        const response = await fetch('http://localhost:5000/api/generate-counter-arguments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: topic,
            userStance: userStance.trim(),
            includeRAG: true
          }),
        });
        
        const data = await response.json();
        if (data.success && data.counterArguments) {
          displayResults(data.counterArguments);
        } else {
          alert('Failed to generate counter-arguments: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to generate counter-arguments:', error);
        alert('Failed to generate counter-arguments. Please check if backend is running.');
      } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🧠 Generate Counter-Arguments';
      }
    }
    
    // Display results
    function displayResults(counterArguments) {
      const resultsCard = document.getElementById('resultsCard');
      const argumentsList = document.getElementById('argumentsList');
      
      argumentsList.innerHTML = '';
      
      counterArguments.forEach((argument, index) => {
        const isRAGSynthesis = argument.isRAGSynthesis || false;
        const ragEnhanced = argument.ragEnhanced || false;
        const confidence = argument.confidence;
        const sources = argument.sources;
        const text = argument.text || argument;
        
        const argumentDiv = document.createElement('div');
        argumentDiv.className = 'argument' + (isRAGSynthesis ? ' rag' : '');
        
        let html = '';
        
        if (ragEnhanced) {
          html += '<span class="rag-badge">🧬 RAG Enhanced</span>';
        }
        
        html += '<h3 style="margin: 0 0 0.75rem 0; color: ' + (isRAGSynthesis ? '#22d3ee' : '#4ade80') + ';">';
        html += isRAGSynthesis ? '🧠 RAG Synthesis' : 'Counter-Argument #' + (index + 1);
        if (confidence) {
          html += ' <span style="font-size: 0.75rem; color: #94a3b8; background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: normal;">' + Math.round(confidence * 100) + '% confidence</span>';
        }
        html += '</h3>';
        
        html += '<p style="margin: 0 0 1rem 0; line-height: 1.6; color: #e2e8f0;">' + text + '</p>';
        
        if (sources && Array.isArray(sources)) {
          html += '<div>';
          html += '<p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #94a3b8; font-weight: 500;">📚 Sources:</p>';
          html += '<ul style="margin: 0; padding-left: 1rem; color: #cbd5e1;">';
          sources.forEach(source => {
            html += '<li style="font-size: 0.875rem; margin-bottom: 0.25rem;">' + source + '</li>';
          });
          html += '</ul>';
          html += '</div>';
        }
        
        argumentDiv.innerHTML = html;
        argumentsList.appendChild(argumentDiv);
      });
      
      resultsCard.style.display = 'block';
    }
    
    // Event listeners
    document.getElementById('generateBtn').addEventListener('click', generateCounterArguments);
    
    // Initial check
    checkBackendConnection();
    setInterval(checkBackendConnection, 30000); // Check every 30 seconds
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('🚀 Frontend Server running on http://localhost:' + PORT);
  console.log('📋 Open your browser to: http://localhost:' + PORT);
});