const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Serve the LLM-style interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Debate Assistant - LLM Chat Interface</title>
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .llm-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .llm-header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            padding: 20px;
        }
        
        .llm-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .llm-header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .chat-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .input-section {
            padding: 25px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .input-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #374151;
            font-size: 1rem;
        }
        
        .topic-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            resize: vertical;
            min-height: 80px;
        }
        
        .topic-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .stance-selector {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .stance-option {
            flex: 1;
            min-width: 120px;
            padding: 12px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            text-align: center;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .stance-option:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }
        
        .stance-option.selected {
            border-color: #667eea;
            background: #667eea;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .stance-for { border-color: #10b981; }
        .stance-for.selected { background: #10b981; border-color: #10b981; }
        
        .stance-against { border-color: #ef4444; }
        .stance-against.selected { background: #ef4444; border-color: #ef4444; }
        
        .stance-neutral { border-color: #f59e0b; }
        .stance-neutral.selected { background: #f59e0b; border-color: #f59e0b; }
        
        .generate-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        
        .generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .conversation-area {
            flex: 1;
            padding: 25px;
            overflow-y: auto;
            max-height: 500px;
        }
        
        .message {
            margin-bottom: 20px;
            animation: fadeIn 0.5s ease;
        }
        
        .message-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
        }
        
        .user-avatar {
            background: #667eea;
        }
        
        .ai-avatar {
            background: #10b981;
        }
        
        .message-content {
            background: #f8fafc;
            padding: 15px 20px;
            border-radius: 16px;
            border-left: 4px solid #e2e8f0;
            line-height: 1.6;
        }
        
        .ai-message .message-content {
            background: #f0fdf4;
            border-left-color: #10b981;
        }
        
        .loading {
            display: inline-flex;
            align-items: center;
            color: #6b7280;
        }
        
        .loading::after {
            content: '...';
            animation: dots 1.5s steps(4, end) infinite;
        }
        
        .metadata {
            font-size: 0.85rem;
            color: #6b7280;
            margin-top: 10px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60% { content: '...'; }
            80%, 100% { content: ''; }
        }
        
        .status-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            background: #f3f4f6;
            border-radius: 20px;
            margin: 10px 0;
            width: fit-content;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% { 
                transform: scale(0);
                opacity: 0.5;
            }
            40% { 
                transform: scale(1);
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        function LLMDebateApp() {
            const [topic, setTopic] = useState('');
            const [stance, setStance] = useState('');
            const [conversation, setConversation] = useState([]);
            const [isLoading, setIsLoading] = useState(false);
            const conversationRef = useRef(null);

            const scrollToBottom = () => {
                if (conversationRef.current) {
                    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
                }
            };

            useEffect(() => {
                scrollToBottom();
            }, [conversation, isLoading]);

            const handleStanceSelect = (selectedStance) => {
                setStance(selectedStance);
            };

            const startDebate = async () => {
                if (!topic.trim() || !stance) {
                    alert('Please enter a topic and select your stance');
                    return;
                }

                setIsLoading(true);
                
                // Add user message to conversation
                const userMessage = {
                    type: 'user',
                    content: \`I want to discuss: "\${topic}"\nMy stance: \${stance}\`,
                    timestamp: new Date().toISOString(),
                    stance: stance
                };
                
                setConversation(prev => [...prev, userMessage]);

                try {
                    const response = await fetch('http://localhost:5000/api/llm-debate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            topic: topic,
                            stance: stance,
                            conversationHistory: conversation
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        const aiMessage = {
                            type: 'ai',
                            content: data.llmResponse,
                            timestamp: data.metadata.timestamp,
                            metadata: data.metadata,
                            ragContext: data.ragContext
                        };
                        
                        setConversation(prev => [...prev, aiMessage]);
                    } else {
                        throw new Error(data.error || 'Failed to get AI response');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    const errorMessage = {
                        type: 'ai',
                        content: 'I apologize, but I encountered an error processing your request. Please try again.',
                        timestamp: new Date().toISOString(),
                        error: true
                    };
                    setConversation(prev => [...prev, errorMessage]);
                }

                setIsLoading(false);
            };

            const clearConversation = () => {
                setConversation([]);
                setTopic('');
                setStance('');
            };

            return (
                <div className="llm-container">
                    <div className="status-indicator">
                        🤖 AI Ready
                    </div>
                    
                    <header className="llm-header">
                        <h1>AI Debate Assistant</h1>
                        <p>Engage in thoughtful discussions with advanced AI reasoning</p>
                    </header>

                    <div className="chat-container">
                        <div className="input-section">
                            <div className="input-group">
                                <label className="input-label">What would you like to debate about?</label>
                                <textarea
                                    className="topic-input"
                                    placeholder="Enter your debate topic here... (e.g., 'Social media should be regulated by governments', 'Remote work is better than office work', etc.)"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">What's your stance on this topic?</label>
                                <div className="stance-selector">
                                    <div 
                                        className={\`stance-option stance-for \${stance === 'FOR' ? 'selected' : ''}\`}
                                        onClick={() => handleStanceSelect('FOR')}
                                    >
                                        👍 FOR
                                        <div style={{fontSize: '0.8rem', opacity: 0.8, marginTop: '4px'}}>I support this</div>
                                    </div>
                                    <div 
                                        className={\`stance-option stance-against \${stance === 'AGAINST' ? 'selected' : ''}\`}
                                        onClick={() => handleStanceSelect('AGAINST')}
                                    >
                                        👎 AGAINST
                                        <div style={{fontSize: '0.8rem', opacity: 0.8, marginTop: '4px'}}>I oppose this</div>
                                    </div>
                                    <div 
                                        className={\`stance-option stance-neutral \${stance === 'NEUTRAL' ? 'selected' : ''}\`}
                                        onClick={() => handleStanceSelect('NEUTRAL')}
                                    >
                                        🤔 NEUTRAL
                                        <div style={{fontSize: '0.8rem', opacity: 0.8, marginTop: '4px'}}>I'm undecided</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="generate-btn"
                                onClick={startDebate}
                                disabled={isLoading || !topic.trim() || !stance}
                            >
                                {isLoading ? '🤖 AI is thinking...' : '🚀 Start Debate Discussion'}
                            </button>
                            
                            {conversation.length > 0 && (
                                <button 
                                    onClick={clearConversation}
                                    style={{
                                        marginTop: '10px',
                                        width: '100%',
                                        padding: '12px',
                                        background: '#6b7280',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️ Clear Conversation
                                </button>
                            )}
                        </div>

                        <div className="conversation-area" ref={conversationRef}>
                            {conversation.length === 0 && (
                                <div style={{textAlign: 'center', color: '#6b7280', padding: '40px'}}>
                                    <h3>💬 Ready to Debate!</h3>
                                    <p>Enter a topic, choose your stance, and start an engaging AI discussion.</p>
                                </div>
                            )}
                            
                            {conversation.map((message, index) => (
                                <div key={index} className={\`message \${message.type === 'ai' ? 'ai-message' : 'user-message'}\`}>
                                    <div className="message-header">
                                        <div className={\`message-avatar \${message.type === 'ai' ? 'ai-avatar' : 'user-avatar'}\`}>
                                            {message.type === 'ai' ? '🤖' : '👤'}
                                        </div>
                                        <strong>{message.type === 'ai' ? 'AI Assistant' : 'You'}</strong>
                                        <span style={{marginLeft: '10px', fontSize: '0.85rem', color: '#6b7280'}}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                    {message.ragContext && (
                                        <div className="metadata">
                                            🔍 RAG Context: {message.ragContext.totalSources} sources analyzed | 
                                            Model: {message.metadata?.model || 'Gemini AI'} | 
                                            Response Type: {message.metadata?.responseType || 'Conversational'}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="typing-indicator">
                                    <div className="typing-dots">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                    <span style={{marginLeft: '10px', color: '#6b7280'}}>AI is analyzing and responding...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        ReactDOM.render(<LLMDebateApp />, document.getElementById('root'));
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 LLM Frontend server running at http://localhost:${PORT}`);
  console.log(`🔗 Backend API: http://localhost:5000`);
  console.log(`🤖 LLM Chat Interface Ready!`);
});