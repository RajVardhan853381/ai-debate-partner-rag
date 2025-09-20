# AI Debate Partner - RAG Enhanced

🤖 **An intelligent debate companion powered by Google Gemini AI and Retrieval-Augmented Generation (RAG)**

![AI Debate Partner](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue) ![RAG](https://img.shields.io/badge/RAG-Enabled-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **🧠 Authentic AI Conversations**: Powered by Google Gemini 1.5 Flash for natural, context-aware responses
- **🔍 RAG System**: Retrieval-Augmented Generation with vector similarity matching and web search simulation
- **🎯 Stance-Based Debates**: Choose FOR, AGAINST, or NEUTRAL positions on any topic
- **💬 Modern Chat Interface**: Beautiful dark theme with glass morphism design
- **📚 Conversation History**: Auto-save and manage all your debate sessions
- **⚙️ System Monitoring**: Real-time status of AI models and RAG components
- **📖 Interactive Help**: Comprehensive guide for effective debates

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-debate-partner-rag.git
   cd ai-debate-partner-rag
   ```

2. **Set up your Gemini API Key**
   - Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Replace `'your-gemini-api-key-here'` in `backend/src/index.js` with your actual API key
   - Or use environment variable: `set GEMINI_API_KEY=your-api-key-here` (Windows PowerShell)

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the servers**
   ```bash
   # Terminal 1 - Backend
   node backend/src/index.js

   # Terminal 2 - Frontend  
   node frontend-modern.js
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
ai-debate-partner-rag/
├── backend/
│   └── src/
│       └── index.js          # Main backend server with RAG system
├── frontend-modern.js        # Modern UI frontend server
├── frontend-llm.js          # Alternative LLM-style frontend
├── frontend-simple.js       # Basic frontend server
├── README.md                # Project documentation
├── package.json             # Project dependencies
└── .gitignore              # Git ignore file
```

## 🎯 How to Use

### Starting a Debate

1. **Choose a Topic**: Enter any debate topic in the text area
   - Examples: "Remote work is better than office work"
   - "AI will replace most human jobs"
   - "Social media should be regulated"

2. **Select Your Stance**:
   - 🟢 **FOR**: You support the statement
   - 🔴 **AGAINST**: You oppose the statement  
   - 🟡 **NEUTRAL**: You're undecided

3. **Start Conversation**: Click "Start Debate" and engage with AI

### Navigation

- **🆕 New Debate**: Create fresh conversations
- **📚 History**: View, reload, or delete past debates
- **⚙️ Settings**: Check system status and configuration
- **❓ Help**: Get tips and guidance

## 🔧 Technical Architecture

### Backend Components

- **Express Server**: RESTful API endpoints
- **RAG System**: `SimpleRAGSystem` class with:
  - Web search simulation
  - Text chunking and vectorization
  - Similarity-based retrieval
  - Context-aware generation
- **Gemini Integration**: Google Generative AI API
- **CORS Enabled**: Cross-origin resource sharing

### Frontend Components

- **React-based UI**: Modern component architecture
- **Glass Morphism Design**: Beautiful frosted glass effects
- **Responsive Layout**: Works on desktop and mobile
- **Real-time Updates**: Live conversation flow
- **State Management**: React hooks for data persistence

### RAG Pipeline

1. **Query Processing**: Topic analysis and preprocessing
2. **Web Search Simulation**: Generate contextual search results
3. **Text Chunking**: Break content into manageable pieces
4. **Vector Similarity**: Calculate relevance scores
5. **Context Retrieval**: Select most relevant information
6. **AI Generation**: Gemini creates contextual responses

## 🤖 AI Model Details

- **Model**: Google Gemini 1.5 Flash
- **Temperature**: 0.9 (Creative responses)
- **Max Tokens**: 2048
- **Conversation Style**: Natural, inquisitive, balanced

## 🔐 Security & Privacy

- **API Key Security**: Store your Gemini API key securely
- **No Data Storage**: Conversations are session-based only
- **CORS Protection**: Configured for localhost development

## 🐛 Troubleshooting

### Common Issues

**Error: "Cannot read properties of undefined"**
- Ensure Gemini API key is correctly configured
- Check backend server is running on port 5000

**Frontend not loading**
- Verify frontend server is on port 3000
- Check browser console for JavaScript errors

**AI responses are generic**
- Confirm authentic Gemini API integration
- Check backend logs for RAG processing

### Debug Mode

Enable detailed logging by checking backend console output:
```bash
node backend/src/index.js
# Watch for RAG pipeline logs and Gemini API responses
```

## 📈 Performance Features

- **Response Optimization**: RAG results processed efficiently
- **Async Processing**: Non-blocking conversation flow
- **Error Handling**: Graceful fallbacks for API failures
- **Memory Management**: Efficient conversation storage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini**: For providing advanced AI capabilities
- **React**: For the frontend framework
- **Express.js**: For the backend server
- **Font Awesome**: For beautiful icons

---

**⭐ If you find this project helpful, please give it a star!**

Made with ❤️ for intelligent conversations and thoughtful debates.
- **Structured Arguments**: AI returns formatted responses with claims, evidence, and counterpoints
- **AI vs AI Debates**: Simulate debates between multiple AI agents
- **Scoring System**: Rate arguments on relevance, persuasiveness, and logic
- **Export Functionality**: Save debate transcripts as PDF/Markdown
- **Mobile Optimized**: Responsive design for all devices

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Authentication**: NextAuth.js with Magic Links

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite with Drizzle ORM
- **Vector Database**: ChromaDB
- **LLM Integration**: Gemini API
- **Authentication**: Magic Link (nodemailer)

### Infrastructure
- **Containerization**: Docker
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)
- **CI/CD**: GitHub Actions

## Project Structure

```
ai-debate-partner/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities and configurations
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── db/                 # Database files
│   └── package.json
├── shared/                  # Shared types and utilities
├── docker-compose.yml      # Development environment
├── .env.example           # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your API keys
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Start the development servers:
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# LLM API
GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=file:./db/database.sqlite

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Vector Database
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Backend
BACKEND_URL=http://localhost:5000
PORT=5000
```

## API Documentation

### Authentication
- `POST /api/auth/magic-link` - Send magic link to email
- `GET /api/auth/verify/:token` - Verify magic link token

### Debates
- `POST /api/debates` - Create new debate session
- `GET /api/debates/:id` - Get debate session
- `POST /api/debates/:id/messages` - Add message to debate
- `GET /api/debates/user/:userId` - Get user's debate history

### RAG
- `POST /api/rag/search` - Search vector database
- `POST /api/rag/ingest` - Add documents to vector database

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Docker Development
```bash
docker-compose up -d
```

## Deployment

The application is designed to be deployed with:
- Frontend on Vercel
- Backend on Render/Railway
- Vector database on cloud provider

See `docker-compose.prod.yml` for production deployment configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.