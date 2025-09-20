'use client';

import React, { useState, useRef } from 'react';

const PREDEFINED_TOPICS = [
  'Climate change policies should prioritize economic growth over environmental protection',
  'Artificial intelligence will create more jobs than it eliminates',
  'Social media platforms should be regulated by government agencies',
  'Remote work is more productive than traditional office work',
  'Cryptocurrency should replace traditional banking systems',
  'Universal basic income should be implemented globally',
  'Nuclear energy is the best solution to climate change',
  'Private space exploration benefits humanity more than government programs',
  'Genetic engineering should be used to enhance human capabilities',
  'Traditional education systems are obsolete in the digital age'
];

const DEBATE_TIPS = [
  'Use specific examples and evidence to support your arguments',
  'Acknowledge counterpoints to strengthen your position',
  'Focus on logical reasoning rather than emotional appeals',
  'Cite credible sources when making factual claims',
  'Consider the long-term implications of your stance'
];

export default function DebatePage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [userStance, setUserStance] = useState('');
  const [counterArguments, setCounterArguments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [recentDebates, setRecentDebates] = useState([]);
  const stanceTextareaRef = useRef(null);

  React.useEffect(() => {
    checkBackendConnection();
    loadRecentDebates();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const loadRecentDebates = () => {
    const saved = localStorage.getItem('recentDebates');
    if (saved) {
      setRecentDebates(JSON.parse(saved));
    }
  };

  const saveDebate = (topic, stance, counterArgs) => {
    const debate = {
      id: Date.now(),
      topic: topic || customTopic,
      stance,
      counterArguments: counterArgs,
      timestamp: new Date().toISOString()
    };
    
    const updated = [debate, ...recentDebates.slice(0, 4)];
    setRecentDebates(updated);
    localStorage.setItem('recentDebates', JSON.stringify(updated));
  };

  const generateCounterArguments = async () => {
    const topic = selectedTopic || customTopic;
    if (!topic.trim() || !userStance.trim()) {
      alert('Please select a topic and enter your stance');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-counter-arguments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          userStance: userStance.trim(),
          includeRAG: true
        }),
      });

      const data = await response.json();
      if (data.success && data.counterArguments) {
        setCounterArguments(data.counterArguments);
        saveDebate(topic, userStance, data.counterArguments);
      } else {
        alert('Failed to generate counter-arguments: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to generate counter-arguments:', error);
      alert('Failed to generate counter-arguments. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (value) => {
    setSelectedTopic(value);
    if (value !== 'custom') {
      setCustomTopic('');
    }
  };

  const currentTopic = selectedTopic === 'custom' ? customTopic : selectedTopic;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '1.5rem 2rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🧠
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              AI Debate Partner
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
              Intelligent Counter-Arguments Powered by RAG
            </p>
          </div>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Debate Panel */}
        <div>
          {/* Share Your Stance Card */}
          <div style={{
            background: 'rgba(15, 20, 25, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💭</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Share Your Stance</h2>
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              Enter your position on any debate topic and receive intelligent counter-arguments
            </p>

            {/* Topic Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                🧩 Select Topic (Optional)
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a topic or enter custom below...</option>
                {PREDEFINED_TOPICS.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
                <option value="custom">Custom Topic</option>
              </select>
            </div>

            {/* Custom Topic Input */}
            {selectedTopic === 'custom' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  🎯 Custom Topic
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Or enter your own debate topic..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            )}

            {/* User Stance Input */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                💡 Your Stance
              </label>
              <textarea
                ref={stanceTextareaRef}
                value={userStance}
                onChange={(e) => setUserStance(e.target.value)}
                placeholder="Share your position, arguments, and reasoning on this topic. Be specific and detailed to receive more targeted counter-arguments..."
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                maxLength={2000}
              />
              <div style={{ 
                textAlign: 'right', 
                marginTop: '0.5rem', 
                color: '#64748b', 
                fontSize: '0.875rem' 
              }}>
                {userStance.length}/2000 characters
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCounterArguments}
              disabled={loading || backendStatus !== 'online' || !userStance.trim()}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                background: loading || backendStatus !== 'online' || !userStance.trim() 
                  ? 'rgba(100, 116, 139, 0.5)' 
                  : 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading || backendStatus !== 'online' || !userStance.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <span style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid #ffffff', 
                    borderTop: '2px solid transparent', 
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Generating Counter-Arguments...
                </>
              ) : (
                <>
                  🧠 Generate Counter-Arguments
                </>
              )}
            </button>
          </div>

          {/* Counter-Arguments Results */}
          {counterArguments.length > 0 && (
            <div style={{
              background: 'rgba(15, 20, 25, 0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Counter-Arguments</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {counterArguments.map((argument, index) => {
                  // Safe property access
                  const isRAGSynthesis = (argument as any)?.isRAGSynthesis || false;
                  const ragEnhanced = (argument as any)?.ragEnhanced || false;
                  const confidence = (argument as any)?.confidence;
                  const theme = (argument as any)?.theme;
                  const retrievalScore = (argument as any)?.retrievalScore;
                  const vectorSimilarity = (argument as any)?.vectorSimilarity;
                  const webSearchTerms = (argument as any)?.webSearchTerms;
                  const sources = (argument as any)?.sources;
                  const text = (argument as any)?.text || argument;

                  return (
                    <div key={index} style={{
                      background: isRAGSynthesis ? 'rgba(34, 211, 238, 0.1)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      borderLeft: isRAGSynthesis ? '4px solid #22d3ee' : '4px solid #4ade80',
                      position: 'relative'
                    }}>
                      {/* RAG Enhancement Badge */}
                      {ragEnhanced && (
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
                          color: '#000',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span>🧬</span>
                          RAG Enhanced
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '1.1rem', 
                          fontWeight: '600',
                          color: isRAGSynthesis ? '#22d3ee' : '#4ade80'
                        }}>
                          {isRAGSynthesis ? '🧠 RAG Synthesis' : `Counter-Argument #${index + 1}`}
                        </h3>
                        {confidence && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {Math.round(confidence * 100)}% confidence
                          </span>
                        )}
                      </div>

                      <p style={{ 
                        margin: '0 0 1rem 0', 
                        lineHeight: '1.6',
                        color: '#e2e8f0'
                      }}>
                        {text}
                      </p>

                      {/* RAG Metadata */}
                      {ragEnhanced && (
                        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {retrievalScore && (
                              <span>📊 Retrieval Score: {retrievalScore}</span>
                            )}
                            {vectorSimilarity && (
                              <span>🔗 Vector Similarity: {vectorSimilarity}</span>
                            )}
                            {theme && (
                              <span>🏷️ Theme: {theme}</span>
                            )}
                          </div>
                          {webSearchTerms && Array.isArray(webSearchTerms) && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                🔍 Search Terms: {webSearchTerms.slice(0, 3).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sources */}
                      {sources && Array.isArray(sources) && (
                        <div>
                          <p style={{ 
                            margin: '0 0 0.5rem 0', 
                            fontSize: '0.875rem', 
                            color: '#94a3b8',
                            fontWeight: '500'
                          }}>
                            📚 Sources:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '1rem', color: '#cbd5e1' }}>
                            {sources.map((source: any, idx: number) => (
                              <li key={idx} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* RAG Technology Card */}
          <div style={{
            background: 'rgba(15, 20, 25, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🧬</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>RAG Technology</h3>
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Retrieval-Augmented Generation combines real-time information retrieval with AI generation:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#22d3ee', fontSize: '1rem' }}>🔍</span>
                <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>Web search for current information</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80', fontSize: '1rem' }}>🔗</span>
                <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>Vector similarity matching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '1rem' }}>🧠</span>
                <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>Intelligent argument synthesis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#8b5cf6', fontSize: '1rem' }}>✅</span>
                <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>Source verification</span>
              </div>
            </div>
          </div>

          {/* Debate Tips Card */}
          <div style={{
            background: 'rgba(15, 20, 25, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Debate Tips</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {DEBATE_TIPS.map((tip, index) => (
                <div key={index} style={{ 
                  fontSize: '0.875rem', 
                  color: '#cbd5e1',
                  paddingLeft: '1rem',
                  position: 'relative'
                }}>
                  <span style={{ 
                    position: 'absolute', 
                    left: 0, 
                    color: '#4ade80',
                    fontWeight: 'bold'
                  }}>
                    •
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Debates Card */}
          <div style={{
            background: 'rgba(15, 20, 25, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📝</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Recent Debates</h3>
            </div>
            {recentDebates.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentDebates.map((debate: any) => (
                  <div key={debate.id} style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer'
                  }} onClick={() => {
                    setSelectedTopic(debate.topic);
                    setUserStance(debate.stance);
                    setCounterArguments(debate.counterArguments);
                  }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#e2e8f0'
                    }}>
                      {debate.topic.substring(0, 60)}...
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.75rem', 
                      color: '#94a3b8' 
                    }}>
                      {new Date(debate.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ 
                color: '#64748b', 
                fontSize: '0.875rem', 
                textAlign: 'center',
                fontStyle: 'italic',
                margin: 0
              }}>
                No debates yet. Start your first debate above!
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}