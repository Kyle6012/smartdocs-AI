# 🏗️ Architecture Guide

Complete technical overview of your AI WhatsApp bot's architecture, components, and data flow.

> **⚡ Quick Setup**: [Quick Start Guide](QUICK_START.md)  
> **🧠 Vector Database**: [Qdrant Guide](QDRANT_GUIDE.md)

## 🎯 **System Overview**

Your AI WhatsApp bot is a **multi-platform, intelligent assistant** that combines modern AI with vector databases for context-aware responses.

### **High-Level Architecture**
```
┌─────────────────────────────────────────────────────────────────┐
│                        AI WhatsApp Bot                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  WhatsApp   │  │ Web Widget  │  │ WhatsApp    │              │
│  │  (Baileys)  │  │ (Browser)   │  │ Business    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          │                                      │
│         ┌────────────────▼────────────────┐                     │
│         │        Express Server           │                     │
│         │     (Unified Processing)        │                     │
│         └────────────────┬────────────────┘                     │
│                          │                                      │
│    ┌─────────────────────┼─────────────────────┐                │
│    │                     │                     │                │
│ ┌──▼───┐           ┌─────▼─────┐        ┌─────▼─────┐           │
│ │ AI   │           │  Vector   │        │   File    │           │
│ │(LLM) │           │ Database  │        │Processor  │           │
│ │      │           │ (Qdrant)  │        │(PDF/DOCX)│           │
│ └──────┘           └───────────┘        └───────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **Core Components**

### **1. Express Server** (`src/index.ts`)
**Central orchestrator** that handles all requests and coordinates between components.

```typescript
// Main responsibilities:
- HTTP server for web requests
- Message routing and processing
- Service initialization and management
- Error handling and logging
- Health check endpoints
```

**Key Features:**
- **Multi-platform support**: Handles WhatsApp, Web, and Business API
- **Unified message processing**: Single pipeline for all platforms
- **Admin command routing**: Routes `/` commands to admin service
- **File upload handling**: Processes uploaded documents
- **Health monitoring**: `/health` endpoint for deployment platforms

### **2. WhatsApp Service** (`src/whatsapp.ts`)
**Baileys integration** for WhatsApp Web API with persistent sessions.

```typescript
// Core functionality:
- QR code generation and scanning
- Message sending and receiving
- File/media download and processing
- Session persistence and auto-reconnection
- Connection state management
```

**Technical Details:**
- **Library**: `@whiskeysockets/baileys`
- **Session Storage**: `useMultiFileAuthState`
- **Media Support**: PDF, DOCX, images, audio, video
- **Auto-reconnection**: Handles WhatsApp disconnections
- **QR Code Display**: Terminal-based QR code rendering

### **3. WhatsApp Business Service** (`src/whatsapp-business.ts`)
**Official WhatsApp Business API** integration for enterprise use.

```typescript
// Features:
- Official API integration
- Webhook handling
- Template messages
- Business features
- Scalable messaging
```

**Configuration:**
- **Webhooks**: Receive messages via HTTP
- **Templates**: Pre-approved message templates
- **Media**: Official media handling
- **Verification**: Webhook verification tokens

### **4. AI Service** (`src/together.ts`)
**Together AI integration** for language models and embeddings.

```typescript
// Capabilities:
- Chat completions (LLM responses)
- Text embedding generation
- Multiple model support
- Context-aware responses
- Fallback mechanisms
```

**Models Supported:**
- **Chat**: Llama 2, Mixtral, CodeLlama
- **Embeddings**: m2-bert-80M-8k-retrieval
- **Fallback**: Hash-based embeddings if API unavailable

### **5. Vector Database** (`src/qdrant.ts`)
**Qdrant integration** for semantic search and knowledge storage.

```typescript
// Operations:
- Vector similarity search
- Document storage and retrieval
- Collection management
- Embedding storage
- Metadata filtering
```

**Technical Specs:**
- **Dimensions**: 768 (m2-bert embeddings)
- **Distance**: Cosine similarity
- **Index**: HNSW for fast search
- **Storage**: Persistent cloud storage

### **6. File Processing** (`src/admin-training.ts`)
**Multi-format document processing** for knowledge ingestion.

```typescript
// Supported Formats:
- PDF: pdf-parse library
- DOCX: mammoth library
- CSV: Custom parser
- JSON: Native parsing
- TXT/MD: Direct reading
```

**Processing Pipeline:**
1. **File Detection**: Identify format by extension
2. **Content Extraction**: Extract text using appropriate library
3. **Chunking**: Split into optimal 1000-character chunks
4. **Embedding**: Generate vectors for each chunk
5. **Storage**: Store in Qdrant with metadata

### **7. Admin Training Service** (`src/admin-training.ts`)
**Comprehensive admin interface** for bot management and training.

```typescript
// Admin Features:
- Command processing (/ prefix)
- Training session management
- File upload handling
- System monitoring
- Web widget generation
```

**Session Management:**
- **State Tracking**: Maintains conversation state per admin
- **Multi-Admin**: Concurrent admin sessions
- **Command Routing**: Routes commands to appropriate handlers
- **Error Handling**: Graceful error recovery

### **8. Web Chat Service** (`src/web-chat.ts`)
**Embeddable web widget** for website integration.

```typescript
// Web Features:
- Session management
- Real-time messaging
- Widget HTML generation
- Embed code creation
- Mobile-responsive design
```

**Integration:**
- **REST API**: `/api/chat/` endpoints
- **Widget HTML**: Served at `/widget.html`
- **Session-based**: Unique session per visitor
- **Same AI**: Uses same knowledge base as WhatsApp

### **9. Unified Chat Handler** (`src/unified-chat.ts`)
**Platform abstraction layer** for consistent message handling.

```typescript
// Unification:
- Message normalization
- Platform detection
- Response routing
- Format conversion
- Error standardization
```

## 📊 **Data Flow Architecture**

### **Message Processing Flow**
```
1. Message Received (WhatsApp/Web/Business API)
         ↓
2. Platform Detection & Normalization
         ↓
3. Admin Command Check
    ├─ Admin Command → Admin Service
    └─ Regular Message → Continue
         ↓
4. Context Retrieval (Qdrant Search)
         ↓
5. AI Response Generation (Together AI)
         ↓
6. Response Routing (Back to Platform)
         ↓
7. Message Sent to User
```

### **File Upload Processing**
```
1. File Received (WhatsApp Media)
         ↓
2. File Download & Validation
         ↓
3. Format Detection (.pdf, .docx, etc.)
         ↓
4. Content Extraction
    ├─ PDF → pdf-parse
    ├─ DOCX → mammoth
    ├─ CSV → Custom parser
    └─ JSON/TXT → Direct processing
         ↓
5. Text Chunking (1000 chars)
         ↓
6. Embedding Generation (Together AI)
         ↓
7. Vector Storage (Qdrant)
         ↓
8. Confirmation to Admin
```

### **Knowledge Retrieval Flow**
```
1. User Question Received
         ↓
2. Question Embedding Generation
         ↓
3. Vector Similarity Search (Qdrant)
         ↓
4. Context Assembly (Top 3 Results)
         ↓
5. AI Prompt Construction
         ↓
6. LLM Response Generation
         ↓
7. Response Delivery
```

## 🌐 **Multi-Platform Architecture**

### **Platform Abstraction**
```typescript
interface UnifiedMessage {
  from: string;
  text: string;
  timestamp: number;
  platform: 'whatsapp' | 'whatsapp-business' | 'web';
  sessionId?: string;
  messageId?: string;
}
```

### **Response Routing**
```typescript
// Single processing, multiple outputs
async function handleUnifiedMessage(message: UnifiedMessage) {
  // Process once
  const response = await generateAIResponse(message.text);
  
  // Route to appropriate platform
  switch (message.platform) {
    case 'whatsapp':
      await whatsappService.sendMessage(message.from, response);
      break;
    case 'whatsapp-business':
      await whatsappBusinessService.sendMessage(message.from, response);
      break;
    case 'web':
      webChatService.addBotResponse(message.sessionId!, response);
      break;
  }
}
```

## 🔐 **Security Architecture**

### **Authentication & Authorization**
```typescript
// Admin Access Control
const adminNumbers = new Set(process.env.ADMIN_NUMBERS?.split(',') || []);

function isAdmin(phoneNumber: string): boolean {
  return adminNumbers.has(phoneNumber);
}

// Command Authorization
if (message.startsWith('/') && !isAdmin(from)) {
  return "❌ Admin access required";
}
```

### **Environment Security**
```bash
# Secure Configuration
- API keys in environment variables
- No hardcoded secrets
- .env excluded from git
- Production environment isolation
```

### **Data Security**
- **Vector Database**: Encrypted at rest (Qdrant Cloud)
- **API Communications**: HTTPS only
- **File Processing**: Temporary processing, no permanent storage
- **Session Data**: Encrypted WhatsApp sessions

## 📈 **Scalability Design**

### **Horizontal Scaling**
```typescript
// Stateless Design
- No server-side session storage
- Database-backed state management
- Load balancer compatible
- Multi-instance deployment ready
```

### **Performance Optimization**
```typescript
// Efficient Processing
- Chunked document processing
- Optimized vector dimensions (768)
- Cosine similarity for fast search
- HNSW indexing for scale
- Result caching opportunities
```

### **Resource Management**
```typescript
// Memory Optimization
- Streaming file processing
- Garbage collection friendly
- Connection pooling
- Efficient data structures
```

## 🔄 **State Management**

### **Session States**
```typescript
interface TrainingSession {
  adminNumber: string;
  state: 'idle' | 'adding_faq' | 'adding_info' | 'waiting_question' | 'waiting_answer';
  currentData?: {
    question?: string;
    answer?: string;
    content?: string;
  };
  tempData: Document[];
}
```

### **Connection States**
```typescript
// WhatsApp Connection States
- 'connecting': Establishing connection
- 'open': Connected and ready
- 'close': Disconnected (auto-reconnect)
- 'qr': QR code available for scanning
```

### **Application States**
```typescript
// Service States
- Initializing: Starting up services
- Ready: All services operational
- Error: Service failures
- Maintenance: Admin operations
```

## 🛠️ **Development Architecture**

### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### **Build Pipeline**
```bash
Development:  tsx watch src/index.ts
Build:        tsc
Production:   node dist/index.js
```

### **Dependency Management**
```typescript
// Core Dependencies
- @whiskeysockets/baileys: WhatsApp integration
- @qdrant/js-client-rest: Vector database
- express: Web server
- axios: HTTP client
- dotenv: Environment management

// Processing Libraries
- pdf-parse: PDF text extraction
- mammoth: DOCX text extraction
- qrcode-terminal: QR code display

// Development
- typescript: Type checking
- tsx: Development server
- @types/*: Type definitions
```

## 🚀 **Deployment Architecture**

### **Cloud Platform Support**
```bash
Railway:  Zero-config deployment
Render:   Web service deployment  
Fly.io:   Global edge deployment
Vercel:   Serverless functions
Heroku:   Traditional PaaS
```

### **Environment Configuration**
```bash
# Production Environment
NODE_ENV=production
PORT=${PORT}  # Platform-provided
TOGETHER_API_KEY=${TOGETHER_API_KEY}
QDRANT_URL=${QDRANT_URL}
QDRANT_API_KEY=${QDRANT_API_KEY}
ADMIN_NUMBERS=${ADMIN_NUMBERS}
```

### **Health Monitoring**
```typescript
// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      whatsapp: whatsappService?.isConnected(),
      qdrant: await qdrantService?.testConnection(),
      ai: await togetherService?.testConnection()
    }
  });
});
```

## 📊 **Performance Characteristics**

### **Response Times**
| Operation | Typical Time | Factors |
|-----------|--------------|---------|
| Simple chat | 1-3 seconds | AI model, context size |
| File upload | 5-30 seconds | File size, format |
| Vector search | 10-50ms | Collection size, query |
| Admin commands | 100-500ms | Operation complexity |

### **Throughput**
| Metric | Capacity | Notes |
|--------|----------|-------|
| Concurrent users | 100-1000+ | Depends on deployment |
| Messages/minute | 60-600 | Rate limited by APIs |
| File uploads/hour | 10-100 | Processing intensive |
| Vector searches/sec | 100-1000+ | Qdrant performance |

### **Storage Requirements**
```bash
# Typical Usage
Small bot (1K documents):     ~10MB vectors
Medium bot (10K documents):   ~100MB vectors  
Large bot (100K documents):   ~1GB vectors

# File Storage (temporary)
PDF processing:   2x file size RAM
DOCX processing:  1.5x file size RAM
Session data:     ~1MB per session
```

## 🔍 **Monitoring and Observability**

### **Built-in Monitoring**
```typescript
// Admin Commands
/status  - System health and statistics
/logs    - Recent system activity
/backup  - Knowledge base status
/clear   - Cleanup operations
```

### **Error Handling**
```typescript
// Graceful Degradation
- API failures → Fallback responses
- Connection issues → Auto-retry
- File processing errors → User feedback
- Vector search failures → Basic responses
```

### **Logging Strategy**
```typescript
// Structured Logging
logger.info('Message processed', { 
  platform, from, messageLength, processingTime 
});
logger.error('API error', { 
  service, error, context 
});
```

## 📚 **Related Technical Guides**

- 🧠 **[Qdrant Guide](QDRANT_GUIDE.md)** - Vector database deep dive
- 📄 **[File Processing](FILE_PROCESSING.md)** - Document processing pipeline
- 👨‍💼 **[Admin Guide](ADMIN_GUIDE.md)** - Admin interface details
- 🚀 **[Deployment Guide](DEPLOYMENT.md)** - Cloud deployment architecture
- 🐛 **[Troubleshooting](TROUBLESHOOTING.md)** - System debugging

---

**🏗️ Understanding the architecture** helps you customize, extend, and troubleshoot your AI WhatsApp bot effectively. This system is designed for scalability, maintainability, and intelligent responses! 🤖✨ 