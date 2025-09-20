const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Serve the new modern UI that matches the design
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Debate Partner - Modern Interface</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #ffffff;
            height: 100vh;
            overflow: hidden;
        }
        
        .app-container {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px 0;
            overflow-y: auto;
        }
        
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 15px 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .sidebar-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-left-color: #6366f1;
        }
        
        .sidebar-item.active {
            background: rgba(99, 102, 241, 0.2);
            color: #ffffff;
            border-left-color: #6366f1;
        }
        
        .sidebar-item i {
            margin-right: 15px;
            width: 20px;
            text-align: center;
            font-size: 16px;
        }
        
        .sidebar-item span {
            font-size: 14px;
            font-weight: 500;
        }
        
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .header {
            text-align: center;
            padding: 40px 20px;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .content-area {
            flex: 1;
            display: flex;
            position: relative;
            overflow: hidden;
        }
        
        .debate-input-section {
            width: 400px;
            padding: 30px;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .input-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .input-label {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #ffffff;
        }
        
        .topic-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            padding: 15px;
            color: #ffffff;
            font-size: 14px;
            resize: none;
            height: 80px;
            transition: all 0.3s ease;
        }
        
        .topic-input:focus {
            outline: none;
            border-color: #6366f1;
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        .topic-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .stance-section {
            margin: 25px 0;
        }
        
        .stance-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .stance-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid transparent;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .stance-btn.for {
            border-color: #10b981;
        }
        
        .stance-btn.for.active {
            background: #10b981;
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
        
        .stance-btn.against {
            border-color: #ef4444;
        }
        
        .stance-btn.against.active {
            background: #ef4444;
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
        
        .stance-btn.neutral {
            border-color: #f59e0b;
        }
        
        .stance-btn.neutral.active {
            background: #f59e0b;
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }
        
        .stance-btn:hover:not(.active) {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .start-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
        }
        
        .start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
        }
        
        .start-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .conversation-area {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .message {
            max-width: 70%;
            animation: fadeIn 0.5s ease;
        }
        
        .message.user {
            align-self: flex-end;
        }
        
        .message.ai {
            align-self: flex-start;
        }
        
        .message-bubble {
            padding: 20px 25px;
            border-radius: 25px;
            position: relative;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .message.user .message-bubble {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            border-bottom-right-radius: 8px;
        }
        
        .message.ai .message-bubble {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-bottom-left-radius: 8px;
        }
        
        .message-header {
            font-size: 12px;
            opacity: 0.7;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .message.user .message-header {
            text-align: right;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 20px 25px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            border-bottom-left-radius: 8px;
            max-width: 200px;
            animation: fadeIn 0.3s ease;
        }
        
        .typing-dots {
            display: flex;
            gap: 5px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            opacity: 0.6;
        }
        
        .empty-state i {
            font-size: 4rem;
            margin-bottom: 20px;
            color: rgba(255, 255, 255, 0.3);
        }
        
        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .empty-state p {
            color: rgba(255, 255, 255, 0.5);
            max-width: 300px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
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
        
        .status-indicator {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }
        
        .metadata {
            font-size: 11px;
            opacity: 0.6;
            margin-top: 10px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        /* Section Content Styles */
        .section-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
        }
        
        .section-header {
            margin-bottom: 30px;
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-header h2 {
            font-size: 1.8rem;
            margin-bottom: 8px;
            color: #ffffff;
        }
        
        .section-header p {
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* History Styles */
        .history-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .history-item {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .history-item:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }
        
        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .history-header h3 {
            color: #ffffff;
            font-size: 1rem;
            margin: 0;
            flex: 1;
        }
        
        .history-actions {
            display: flex;
            gap: 10px;
        }
        
        .action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .action-btn.load {
            background: #6366f1;
            color: white;
        }
        
        .action-btn.delete {
            background: #ef4444;
            color: white;
        }
        
        .action-btn:hover {
            transform: translateY(-1px);
            opacity: 0.9;
        }
        
        .history-meta {
            display: flex;
            gap: 15px;
            align-items: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .stance-badge {
            padding: 4px 10px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .stance-badge.for {
            background: #10b981;
            color: white;
        }
        
        .stance-badge.against {
            background: #ef4444;
            color: white;
        }
        
        .stance-badge.neutral {
            background: #f59e0b;
            color: white;
        }
        
        .date, .message-count {
            color: rgba(255, 255, 255, 0.5);
        }
        
        /* Settings Styles */
        .settings-group {
            margin-bottom: 30px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .settings-group h3 {
            color: #ffffff;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .setting-item:last-child {
            border-bottom: none;
        }
        
        .setting-item label {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.success {
            background: #10b981;
            color: white;
        }
        
        .status-badge.info {
            background: #6366f1;
            color: white;
        }
        
        /* Help Styles */
        .help-section {
            margin-bottom: 25px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .help-section h3 {
            color: #ffffff;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .help-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .help-section li {
            color: rgba(255, 255, 255, 0.8);
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            line-height: 1.5;
        }
        
        .help-section li:before {
            content: "•";
            color: #6366f1;
            font-weight: bold;
            position: absolute;
            left: 8px;
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        function ModernDebateApp() {
            const [topic, setTopic] = useState('');
            const [stance, setStance] = useState('');
            const [conversations, setConversations] = useState([]);
            const [currentChat, setCurrentChat] = useState([]);
            const [isLoading, setIsLoading] = useState(false);
            const [activeSection, setActiveSection] = useState('new-debate');
            const conversationRef = useRef(null);

            const sidebarItems = [
                { id: 'new-debate', icon: 'fas fa-plus-circle', label: 'New Debate' },
                { id: 'history', icon: 'fas fa-history', label: 'History' },
                { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
                { id: 'help', icon: 'fas fa-question-circle', label: 'Help' }
            ];

            const scrollToBottom = () => {
                if (conversationRef.current) {
                    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
                }
            };

            useEffect(() => {
                scrollToBottom();
            }, [currentChat, isLoading]);

            const handleStanceSelect = (selectedStance) => {
                setStance(selectedStance);
            };

            const startDebate = async () => {
                if (!topic.trim() || !stance) {
                    alert('Please enter a topic and select your stance');
                    return;
                }

                setIsLoading(true);
                
                const userMessage = {
                    type: 'user',
                    content: \`Tell me why \${topic}.\`,
                    timestamp: new Date().toISOString(),
                    stance: stance,
                    topic: topic
                };
                
                setCurrentChat(prev => [...prev, userMessage]);

                try {
                    const response = await fetch('http://localhost:5000/api/llm-debate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            topic: topic,
                            stance: stance,
                            conversationHistory: currentChat
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        const aiMessage = {
                            type: 'ai',
                            content: data.llmResponse,
                            timestamp: data.metadata?.timestamp || new Date().toISOString(),
                            metadata: data.metadata,
                            ragContext: data.ragContext,
                            topic: topic,
                            stance: stance
                        };
                        
                        const newChat = [...currentChat, userMessage, aiMessage];
                        setCurrentChat(newChat);
                        
                        // Save to conversation history
                        const newConversation = {
                            id: Date.now(),
                            topic: topic,
                            stance: stance,
                            messages: newChat,
                            timestamp: new Date().toISOString()
                        };
                        setConversations(prev => [newConversation, ...prev]);
                        
                    } else {
                        throw new Error(data.error || 'Failed to get AI response');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    const errorMessage = {
                        type: 'ai',
                        content: 'I apologize, but I encountered an error. Please try again.',
                        timestamp: new Date().toISOString(),
                        error: true
                    };
                    setCurrentChat(prev => [...prev, errorMessage]);
                }

                setIsLoading(false);
            };

            const clearChat = () => {
                setCurrentChat([]);
                setTopic('');
                setStance('');
            };

            const loadConversation = (conversation) => {
                setCurrentChat(conversation.messages);
                setTopic(conversation.topic);
                setStance(conversation.stance);
                setActiveSection('new-debate');
            };

            const deleteConversation = (conversationId) => {
                setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            };

            const formatTime = (timestamp) => {
                return new Date(timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            };

            const formatDate = (timestamp) => {
                return new Date(timestamp).toLocaleDateString();
            };

            const renderContent = () => {
                switch (activeSection) {
                    case 'new-debate':
                        return (
                            <div className="content-area">
                                <div className="debate-input-section">
                                    <div className="input-card">
                                        <div className="input-label">What would you like to debate?</div>
                                        <textarea
                                            className="topic-input"
                                            placeholder="Enter your debate topic here..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                        
                                        <div className="stance-section">
                                            <div className="input-label">Stance:</div>
                                            <div className="stance-buttons">
                                                <button 
                                                    className={\`stance-btn for \${stance === 'FOR' ? 'active' : ''}\`}
                                                    onClick={() => handleStanceSelect('FOR')}
                                                >
                                                    FOR
                                                </button>
                                                <button 
                                                    className={\`stance-btn against \${stance === 'AGAINST' ? 'active' : ''}\`}
                                                    onClick={() => handleStanceSelect('AGAINST')}
                                                >
                                                    AGAINST
                                                </button>
                                                <button 
                                                    className={\`stance-btn neutral \${stance === 'NEUTRAL' ? 'active' : ''}\`}
                                                    onClick={() => handleStanceSelect('NEUTRAL')}
                                                >
                                                    NEUTRAL
                                                </button>
                                            </div>
                                        </div>

                                        <button 
                                            className="start-btn"
                                            onClick={startDebate}
                                            disabled={isLoading || !topic.trim() || !stance}
                                        >
                                            {isLoading ? 'AI is thinking...' : 'Start Debate'}
                                        </button>
                                        
                                        {currentChat.length > 0 && (
                                            <button 
                                                onClick={clearChat}
                                                style={{
                                                    marginTop: '10px',
                                                    width: '100%',
                                                    padding: '12px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '25px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                <i className="fas fa-trash"></i> Clear Chat
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="conversation-area" ref={conversationRef}>
                                    {currentChat.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-comments"></i>
                                            <h3>Ready to Debate!</h3>
                                            <p>Enter a topic, choose your stance, and start an intelligent conversation with AI.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {currentChat.map((message, index) => (
                                                <div key={index} className={\`message \${message.type}\`}>
                                                    <div className="message-header">
                                                        {message.type === 'user' ? 'User' : 'AI'} • {formatTime(message.timestamp)}
                                                    </div>
                                                    <div className="message-bubble">
                                                        {message.content}
                                                        {message.ragContext && (
                                                            <div className="metadata">
                                                                <i className="fas fa-search"></i> RAG: {message.ragContext.totalSources} sources | 
                                                                Model: {message.metadata?.model || 'Gemini'} | 
                                                                Temp: {message.metadata?.temperature || 0.9}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {isLoading && (
                                                <div className="message ai">
                                                    <div className="message-header">AI • thinking...</div>
                                                    <div className="typing-indicator">
                                                        <div className="typing-dots">
                                                            <div className="typing-dot"></div>
                                                            <div className="typing-dot"></div>
                                                            <div className="typing-dot"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );

                    case 'history':
                        return (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-history"></i> Conversation History</h2>
                                    <p>Your previous debate conversations</p>
                                </div>
                                
                                {conversations.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-history"></i>
                                        <h3>No Conversations Yet</h3>
                                        <p>Start your first debate to see it appear here.</p>
                                    </div>
                                ) : (
                                    <div className="history-list">
                                        {conversations.map((conv) => (
                                            <div key={conv.id} className="history-item">
                                                <div className="history-header">
                                                    <h3>{conv.topic}</h3>
                                                    <div className="history-actions">
                                                        <button 
                                                            onClick={() => loadConversation(conv)}
                                                            className="action-btn load"
                                                        >
                                                            <i className="fas fa-eye"></i> View
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteConversation(conv.id)}
                                                            className="action-btn delete"
                                                        >
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="history-meta">
                                                    <span className={\`stance-badge \${conv.stance.toLowerCase()}\`}>
                                                        {conv.stance}
                                                    </span>
                                                    <span className="date">{formatDate(conv.timestamp)}</span>
                                                    <span className="message-count">{conv.messages.length} messages</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );

                    case 'settings':
                        return (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-cog"></i> Settings</h2>
                                    <p>Configure your AI Debate Partner</p>
                                </div>
                                
                                <div className="settings-group">
                                    <h3>AI Model Configuration</h3>
                                    <div className="setting-item">
                                        <label>Model: Gemini 1.5 Flash</label>
                                        <div className="status-badge success">Active</div>
                                    </div>
                                    <div className="setting-item">
                                        <label>Temperature: 0.9 (Creative)</label>
                                        <div className="status-badge success">Optimal</div>
                                    </div>
                                    <div className="setting-item">
                                        <label>RAG System: Enabled</label>
                                        <div className="status-badge success">Online</div>
                                    </div>
                                </div>
                                
                                <div className="settings-group">
                                    <h3>Interface Preferences</h3>
                                    <div className="setting-item">
                                        <label>Theme: Dark Mode</label>
                                        <div className="status-badge info">Default</div>
                                    </div>
                                    <div className="setting-item">
                                        <label>Conversations Auto-save</label>
                                        <div className="status-badge success">Enabled</div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'help':
                        return (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-question-circle"></i> Help & Guide</h2>
                                    <p>Learn how to use AI Debate Partner effectively</p>
                                </div>
                                
                                <div className="help-section">
                                    <h3><i className="fas fa-rocket"></i> Getting Started</h3>
                                    <ul>
                                        <li>Enter a debate topic in the text area</li>
                                        <li>Select your stance: FOR, AGAINST, or NEUTRAL</li>
                                        <li>Click "Start Debate" to begin the conversation</li>
                                        <li>Engage in thoughtful discussion with AI</li>
                                    </ul>
                                </div>
                                
                                <div className="help-section">
                                    <h3><i className="fas fa-brain"></i> AI Features</h3>
                                    <ul>
                                        <li>Powered by Google Gemini 1.5 Flash</li>
                                        <li>RAG system provides contextual information</li>
                                        <li>Authentic conversational responses</li>
                                        <li>Stance-aware debate logic</li>
                                    </ul>
                                </div>
                                
                                <div className="help-section">
                                    <h3><i className="fas fa-tips"></i> Tips for Better Debates</h3>
                                    <ul>
                                        <li>Be specific with your topic statements</li>
                                        <li>Choose your stance thoughtfully</li>
                                        <li>Ask follow-up questions to deepen discussion</li>
                                        <li>Review conversation history to track your debates</li>
                                    </ul>
                                </div>
                                
                                <div className="help-section">
                                    <h3><i className="fas fa-info-circle"></i> System Info</h3>
                                    <ul>
                                        <li>Backend: Node.js with Express</li>
                                        <li>AI Model: Google Gemini API</li>
                                        <li>RAG: Vector similarity + web search</li>
                                        <li>Frontend: React with modern UI</li>
                                    </ul>
                                </div>
                            </div>
                        );

                    default:
                        return renderContent('new-debate');
                }
            };

            return (
                <div className="app-container">
                    <div className="status-indicator">
                        <i className="fas fa-robot"></i> AI Ready
                    </div>
                    
                    <div className="sidebar">
                        {sidebarItems.map((item) => (
                            <div 
                                key={item.id}
                                className={\`sidebar-item \${activeSection === item.id ? 'active' : ''}\`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="main-content">
                        <div className="header">
                            <h1>AI Debate Partner</h1>
                            <p>Engage in reasoned discourse</p>
                        </div>

                        {renderContent()}
                    </div>
                </div>
            );
        }

        ReactDOM.render(<ModernDebateApp />, document.getElementById('root'));
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🎨 Modern UI Frontend server running at http://localhost:${PORT}`);
  console.log(`🔗 Backend API: http://localhost:5000`);
  console.log(`✨ Sleek Design Interface Ready!`);
});