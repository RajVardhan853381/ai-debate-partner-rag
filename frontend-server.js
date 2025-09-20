const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple HTML page that includes our React component
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Debate Partner</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
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

    function DebatePage() {
      const [selectedTopic, setSelectedTopic] = useState('');
      const [customTopic, setCustomTopic] = useState('');
      const [userStance, setUserStance] = useState('');
      const [counterArguments, setCounterArguments] = useState([]);
      const [loading, setLoading] = useState(false);
      const [backendStatus, setBackendStatus] = useState('checking');
      const [recentDebates, setRecentDebates] = useState([]);
      const stanceTextareaRef = useRef(null);

      useEffect(() => {
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

      return React.createElement('div', {
        style: { 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      }, [
        // Header
        React.createElement('header', {
          key: 'header',
          style: { 
            padding: '1.5rem 2rem', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.2)'
          }
        }, [
          React.createElement('div', {
            key: 'header-content',
            style: { display: 'flex', alignItems: 'center', gap: '1rem' }
          }, [
            React.createElement('div', {
              key: 'logo',
              style: {
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }
            }, '🧠'),
            React.createElement('div', { key: 'title-section' }, [
              React.createElement('h1', {
                key: 'title',
                style: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }
              }, 'AI Debate Partner'),
              React.createElement('p', {
                key: 'subtitle',
                style: { margin: 0, color: '#94a3b8', fontSize: '0.875rem' }
              }, 'Intelligent Counter-Arguments Powered by RAG')
            ])
          ])
        ]),
        
        // Main Content
        React.createElement('div', {
          key: 'main-content',
          style: { 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem',
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }
        }, [
          // Main Debate Panel
          React.createElement('div', { key: 'main-panel' }, [
            // Share Your Stance Card
            React.createElement('div', {
              key: 'stance-card',
              style: {
                background: 'rgba(15, 20, 25, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '2rem',
                marginBottom: '2rem'
              }
            }, [
              React.createElement('div', {
                key: 'stance-header',
                style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
              }, [
                React.createElement('span', { key: 'stance-icon', style: { fontSize: '1.5rem' } }, '💭'),
                React.createElement('h2', { 
                  key: 'stance-title',
                  style: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }
                }, 'Share Your Stance')
              ]),
              React.createElement('p', {
                key: 'stance-description',
                style: { color: '#94a3b8', marginBottom: '2rem' }
              }, 'Enter your position on any debate topic and receive intelligent counter-arguments'),
              
              // Topic Selection
              React.createElement('div', {
                key: 'topic-selection',
                style: { marginBottom: '1.5rem' }
              }, [
                React.createElement('label', {
                  key: 'topic-label',
                  style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                }, '🧩 Select Topic (Optional)'),
                React.createElement('select', {
                  key: 'topic-select',
                  value: selectedTopic,
                  onChange: (e) => handleTopicChange(e.target.value),
                  style: {
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }
                }, [
                  React.createElement('option', { key: 'default-option', value: '' }, 'Choose a topic or enter custom below...'),
                  ...PREDEFINED_TOPICS.map((topic, index) => 
                    React.createElement('option', { key: \`topic-\${index}\`, value: topic }, topic)
                  ),
                  React.createElement('option', { key: 'custom-option', value: 'custom' }, 'Custom Topic')
                ])
              ]),
              
              // Custom Topic Input
              selectedTopic === 'custom' && React.createElement('div', {
                key: 'custom-topic',
                style: { marginBottom: '1.5rem' }
              }, [
                React.createElement('label', {
                  key: 'custom-label',
                  style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                }, '🎯 Custom Topic'),
                React.createElement('input', {
                  key: 'custom-input',
                  type: 'text',
                  value: customTopic,
                  onChange: (e) => setCustomTopic(e.target.value),
                  placeholder: 'Or enter your own debate topic...',
                  style: {
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }
                })
              ]),
              
              // User Stance Input
              React.createElement('div', {
                key: 'stance-input',
                style: { marginBottom: '2rem' }
              }, [
                React.createElement('label', {
                  key: 'stance-input-label',
                  style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                }, '💡 Your Stance'),
                React.createElement('textarea', {
                  key: 'stance-textarea',
                  ref: stanceTextareaRef,
                  value: userStance,
                  onChange: (e) => setUserStance(e.target.value),
                  placeholder: 'Share your position, arguments, and reasoning on this topic. Be specific and detailed to receive more targeted counter-arguments...',
                  style: {
                    width: '100%',
                    height: '200px',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    resize: 'vertical'
                  },
                  maxLength: 2000
                }),
                React.createElement('div', {
                  key: 'char-count',
                  style: { 
                    textAlign: 'right', 
                    marginTop: '0.5rem', 
                    color: '#64748b', 
                    fontSize: '0.875rem' 
                  }
                }, \`\${userStance.length}/2000 characters\`)
              ]),
              
              // Generate Button
              React.createElement('button', {
                key: 'generate-button',
                onClick: generateCounterArguments,
                disabled: loading || backendStatus !== 'online' || !userStance.trim(),
                style: {
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
                }
              }, loading 
                ? [
                    React.createElement('span', {
                      key: 'spinner',
                      style: { 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid #ffffff', 
                        borderTop: '2px solid transparent', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }
                    }),
                    'Generating Counter-Arguments...'
                  ]
                : '🧠 Generate Counter-Arguments'
              )
            ]),
            
            // Counter-Arguments Results
            counterArguments.length > 0 && React.createElement('div', {
              key: 'results-card',
              style: {
                background: 'rgba(15, 20, 25, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '2rem'
              }
            }, [
              React.createElement('div', {
                key: 'results-header',
                style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }
              }, [
                React.createElement('span', { key: 'results-icon', style: { fontSize: '1.5rem' } }, '⚡'),
                React.createElement('h2', { 
                  key: 'results-title',
                  style: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }
                }, 'Counter-Arguments')
              ]),
              
              React.createElement('div', {
                key: 'arguments-list',
                style: { display: 'flex', flexDirection: 'column', gap: '1rem' }
              }, counterArguments.map((argument, index) => {
                // Safe property access
                const isRAGSynthesis = argument?.isRAGSynthesis || false;
                const ragEnhanced = argument?.ragEnhanced || false;
                const confidence = argument?.confidence;
                const theme = argument?.theme;
                const retrievalScore = argument?.retrievalScore;
                const vectorSimilarity = argument?.vectorSimilarity;
                const webSearchTerms = argument?.webSearchTerms;
                const sources = argument?.sources;
                const text = argument?.text || argument;

                return React.createElement('div', {
                  key: index,
                  style: {
                    background: isRAGSynthesis ? 'rgba(34, 211, 238, 0.1)' : 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    borderLeft: isRAGSynthesis ? '4px solid #22d3ee' : '4px solid #4ade80',
                    position: 'relative'
                  }
                }, [
                  // RAG Enhancement Badge
                  ragEnhanced && React.createElement('div', {
                    key: \`badge-\${index}\`,
                    style: {
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
                    }
                  }, [
                    React.createElement('span', { key: 'dna-icon' }, '🧬'),
                    'RAG Enhanced'
                  ]),

                  React.createElement('div', {
                    key: \`header-\${index}\`,
                    style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }
                  }, [
                    React.createElement('h3', {
                      key: \`title-\${index}\`,
                      style: { 
                        margin: 0, 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        color: isRAGSynthesis ? '#22d3ee' : '#4ade80'
                      }
                    }, isRAGSynthesis ? '🧠 RAG Synthesis' : \`Counter-Argument #\${index + 1}\`),
                    confidence && React.createElement('span', {
                      key: \`confidence-\${index}\`,
                      style: {
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px'
                      }
                    }, \`\${Math.round(confidence * 100)}% confidence\`)
                  ]),

                  React.createElement('p', {
                    key: \`text-\${index}\`,
                    style: { 
                      margin: '0 0 1rem 0', 
                      lineHeight: '1.6',
                      color: '#e2e8f0'
                    }
                  }, text),

                  // Sources
                  sources && Array.isArray(sources) && React.createElement('div', {
                    key: \`sources-\${index}\`
                  }, [
                    React.createElement('p', {
                      key: 'sources-title',
                      style: { 
                        margin: '0 0 0.5rem 0', 
                        fontSize: '0.875rem', 
                        color: '#94a3b8',
                        fontWeight: '500'
                      }
                    }, '📚 Sources:'),
                    React.createElement('ul', {
                      key: 'sources-list',
                      style: { margin: 0, paddingLeft: '1rem', color: '#cbd5e1' }
                    }, sources.map((source, idx) =>
                      React.createElement('li', {
                        key: idx,
                        style: { fontSize: '0.875rem', marginBottom: '0.25rem' }
                      }, source)
                    ))
                  ])
                ]);
              }))
            ])
          ]),
          
          // Sidebar
          React.createElement('div', { key: 'sidebar' }, [
            // Status Card
            React.createElement('div', {
              key: 'status-card',
              style: {
                background: 'rgba(15, 20, 25, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }
            }, [
              React.createElement('div', {
                key: 'status-header',
                style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
              }, [
                React.createElement('span', { key: 'status-icon', style: { fontSize: '1.2rem' } }, '⚡'),
                React.createElement('h3', { 
                  key: 'status-title',
                  style: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }
                }, 'System Status')
              ]),
              React.createElement('p', {
                key: 'status-text',
                style: { 
                  color: backendStatus === 'online' ? '#22c55e' : '#ef4444',
                  fontWeight: 'bold',
                  margin: 0
                }
              }, \`Backend: \${backendStatus === 'online' ? '✅ Connected' : '❌ Offline'}\`)
            ]),
            
            // RAG Technology Card
            React.createElement('div', {
              key: 'rag-card',
              style: {
                background: 'rgba(15, 20, 25, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }
            }, [
              React.createElement('div', {
                key: 'rag-header',
                style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
              }, [
                React.createElement('span', { key: 'rag-icon', style: { fontSize: '1.2rem' } }, '🧬'),
                React.createElement('h3', { 
                  key: 'rag-title',
                  style: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }
                }, 'RAG Technology')
              ]),
              React.createElement('p', {
                key: 'rag-description',
                style: { color: '#94a3b8', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }
              }, 'Retrieval-Augmented Generation combines real-time information retrieval with AI generation:'),
              React.createElement('div', {
                key: 'rag-features',
                style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }
              }, [
                React.createElement('div', {
                  key: 'feature-1',
                  style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
                }, [
                  React.createElement('span', { style: { color: '#22d3ee', fontSize: '1rem' } }, '🔍'),
                  React.createElement('span', { style: { fontSize: '0.875rem', color: '#e2e8f0' } }, 'Web search for current information')
                ]),
                React.createElement('div', {
                  key: 'feature-2',
                  style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
                }, [
                  React.createElement('span', { style: { color: '#4ade80', fontSize: '1rem' } }, '🔗'),
                  React.createElement('span', { style: { fontSize: '0.875rem', color: '#e2e8f0' } }, 'Vector similarity matching')
                ]),
                React.createElement('div', {
                  key: 'feature-3',
                  style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
                }, [
                  React.createElement('span', { style: { color: '#f59e0b', fontSize: '1rem' } }, '🧠'),
                  React.createElement('span', { style: { fontSize: '0.875rem', color: '#e2e8f0' } }, 'Intelligent argument synthesis')
                ]),
                React.createElement('div', {
                  key: 'feature-4',
                  style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
                }, [
                  React.createElement('span', { style: { color: '#8b5cf6', fontSize: '1rem' } }, '✅'),
                  React.createElement('span', { style: { fontSize: '0.875rem', color: '#e2e8f0' } }, 'Source verification')
                ])
              ])
            ]),
            
            // Debate Tips Card
            React.createElement('div', {
              key: 'tips-card',
              style: {
                background: 'rgba(15, 20, 25, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1.5rem'
              }
            }, [
              React.createElement('div', {
                key: 'tips-header',
                style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
              }, [
                React.createElement('span', { key: 'tips-icon', style: { fontSize: '1.2rem' } }, '💡'),
                React.createElement('h3', { 
                  key: 'tips-title',
                  style: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }
                }, 'Debate Tips')
              ]),
              React.createElement('div', {
                key: 'tips-list',
                style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }
              }, DEBATE_TIPS.map((tip, index) =>
                React.createElement('div', {
                  key: index,
                  style: { 
                    fontSize: '0.875rem', 
                    color: '#cbd5e1',
                    paddingLeft: '1rem',
                    position: 'relative'
                  }
                }, [
                  React.createElement('span', {
                    style: { 
                      position: 'absolute', 
                      left: 0, 
                      color: '#4ade80',
                      fontWeight: 'bold'
                    }
                  }, '•'),
                  tip
                ])
              ))
            ])
          ])
        ])
      ]);
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(DebatePage));
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend Server running on http://localhost:${PORT}`);
  console.log(`📋 Open your browser to: http://localhost:${PORT}`);
});