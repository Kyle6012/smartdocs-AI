import express from 'express';
import dotenv from 'dotenv';
import { WhatsAppService, WhatsAppMessage } from './whatsapp';
import { WhatsAppBusinessService, WhatsAppBusinessMessage } from './whatsapp-business';
import { WebChatService, WebChatMessage } from './web-chat';
import { TogetherAIService } from './together';
import { QdrantService } from './qdrant';
import { setupKnowledgeBase } from './document-ingestion';
import { AdminTrainingService } from './admin-training';
import { UnifiedChatHandler, UnifiedMessage } from './unified-chat';
import { logger, sanitizeMessage } from './utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      whatsapp_baileys: whatsappService?.isConnected() || false,
      whatsapp_business: !!whatsappBusinessService,
      web_chat: !!webChatService,
      together_ai: !!process.env.TOGETHER_API_KEY,
      qdrant: !!process.env.QDRANT_URL
    }
  });
});

// WhatsApp Business webhook
app.get('/webhook/whatsapp', (req, res) => {
  if (!whatsappBusinessService) {
    return res.status(404).send('WhatsApp Business not configured');
  }
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const result = whatsappBusinessService.verifyWebhook(
    mode as string, 
    token as string, 
    challenge as string
  );
  
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.post('/webhook/whatsapp', (req, res) => {
  if (!whatsappBusinessService) {
    return res.status(404).send('WhatsApp Business not configured');
  }
  
  const messages = whatsappBusinessService.handleWebhook(req.body);
  whatsappBusinessService.processWebhookMessages(messages);
  
  res.status(200).send('OK');
});

// Web chat endpoints
app.post('/api/chat/session', (req, res) => {
  try {
    const sessionId = webChatService.createSession();
    res.json({ sessionId });
  } catch (error) {
    logger.error('Failed to create chat session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.post('/api/chat/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Handle user message
    const userMessage = await webChatService.handleMessage(sessionId, message);
    
    // Process through unified handler (this will trigger AI response)
    const unifiedMessage = UnifiedChatHandler.fromWebChat(userMessage);
    await handleUnifiedMessage(unifiedMessage);
    
    // Get the latest messages (including bot response)
    const messages = webChatService.getSessionMessages(sessionId);
    const lastBotMessage = messages.filter(m => m.from === 'bot').pop();
    
    res.json({ 
      messageId: userMessage.messageId,
      response: lastBotMessage?.text || 'Sorry, I could not process your message.'
    });
  } catch (error) {
    logger.error('Failed to process chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Serve widget HTML
app.get('/widget.html', (req, res) => {
  try {
    const configParam = req.query.config;
    const config = configParam ? JSON.parse(configParam as string) : {};
    const widgetHTML = webChatService.generateWidgetHTML(config);
    res.setHeader('Content-Type', 'text/html');
    res.send(widgetHTML);
  } catch (error) {
    logger.error('Failed to serve widget:', error);
    res.status(500).send('Error loading chat widget');
  }
});

let whatsappService: WhatsAppService | null = null;
let whatsappBusinessService: WhatsAppBusinessService | null = null;
let webChatService: WebChatService;
let togetherService: TogetherAIService;
let qdrantService: QdrantService;
let adminTrainingService: AdminTrainingService;

async function handleWhatsAppMessage(message: WhatsAppMessage): Promise<void> {
  // Handle file uploads from admins
  if (message.fileContent && message.fileName && adminTrainingService.isAdmin(message.from)) {
    const response = await adminTrainingService.handleFileUpload(message.from, message.fileContent, message.fileName);
    if (whatsappService) {
      await whatsappService.sendMessage(message.from, response);
    }
    return;
  }

  const unifiedMessage = UnifiedChatHandler.fromWhatsApp(message);
  await handleUnifiedMessage(unifiedMessage);
}

async function handleUnifiedMessage(message: UnifiedMessage): Promise<void> {
  try {
    const sanitizedMessage = sanitizeMessage(message.text);
    logger.info(`Processing ${message.platform} message from ${message.from}: ${sanitizedMessage}`);

    if (!sanitizedMessage) {
      logger.info('Received empty message, skipping processing.');
      return;
    }

    // Check if it's an admin command (starts with /) from an admin user
    if (adminTrainingService.isAdmin(message.from) && sanitizedMessage.startsWith('/')) {
      const adminResponse = await adminTrainingService.handleAdminMessage(message.from, sanitizedMessage);
      
      // Send admin response through appropriate platform
      if (message.platform === 'whatsapp' && whatsappService) {
        await whatsappService.sendMessage(message.from, adminResponse);
      } else if (message.platform === 'whatsapp-business' && whatsappBusinessService) {
        await whatsappBusinessService.sendMessage(message.from, adminResponse);
      } else if (message.platform === 'web') {
        webChatService.addBotResponse(message.sessionId!, adminResponse);
      }
      return;
    }

    // Check if it's an admin training flow (non-command message from admin)
    if (adminTrainingService.isAdmin(message.from) && !sanitizedMessage.startsWith('/')) {
      const adminResponse = await adminTrainingService.handleAdminMessage(message.from, sanitizedMessage);
      
      // Only handle training responses if they're not just normal chat
      if (!adminResponse.includes('❓ Unknown command') && 
          !adminResponse.includes('Type /menu')) {
        
                 // Send admin response through appropriate platform
         if (message.platform === 'whatsapp' && whatsappService) {
           await whatsappService.sendMessage(message.from, adminResponse);
         } else if (message.platform === 'whatsapp-business' && whatsappBusinessService) {
           await whatsappBusinessService.sendMessage(message.from, adminResponse);
         } else if (message.platform === 'web') {
           webChatService.addBotResponse(message.sessionId!, adminResponse);
         }
        return;
      }
    }

    // Regular user query - search for context and respond
    const contextResults = await qdrantService.searchSimilar(
      sanitizedMessage, 
      togetherService.generateEmbedding.bind(togetherService),
      3
    );
    
    const context = contextResults
      .filter(result => result.score > 0.7)
      .map(result => result.content)
      .join('\n\n');

    logger.info(`Found ${contextResults.length} context results`);

    const response = await togetherService.chat(sanitizedMessage, context);
    
    // Send response based on platform
    if (UnifiedChatHandler.isWhatsAppPlatform(message.platform)) {
      if (whatsappService) {
        await whatsappService.sendMessage(message.from, response);
      } else if (whatsappBusinessService) {
        await whatsappBusinessService.sendMessage(message.from, response);
      }
    } else if (UnifiedChatHandler.isWebPlatform(message.platform) && message.sessionId) {
      webChatService.addBotResponse(message.sessionId, response);
    }
    
    logger.success(`Response sent to ${message.from} via ${message.platform}`);
  } catch (error) {
    logger.error('Error handling message:', error);
    
    const errorMessage = 'Sorry, I encountered an error processing your message. Please try again later.';
    
    try {
      if (UnifiedChatHandler.isWhatsAppPlatform(message.platform)) {
        if (whatsappService) {
          await whatsappService.sendMessage(message.from, errorMessage);
        } else if (whatsappBusinessService) {
          await whatsappBusinessService.sendMessage(message.from, errorMessage);
        }
      } else if (UnifiedChatHandler.isWebPlatform(message.platform) && message.sessionId) {
        webChatService.addBotResponse(message.sessionId, errorMessage);
      }
    } catch (sendError) {
      logger.error('Failed to send error message:', sendError);
    }
  }
}

async function initializeServices(): Promise<void> {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error('Missing Together AI API key');
    }

    if (!process.env.QDRANT_URL) {
      throw new Error('Missing Qdrant configuration');
    }

    if (!process.env.WA_SESSION_NAME) {
      throw new Error('Missing WhatsApp session name');
    }

    // Initialize Together AI service
    const model = process.env.TOGETHER_MODEL || 'meta-llama/Llama-2-70b-chat-hf';
    const embeddingModel = process.env.TOGETHER_EMBEDDING_MODEL || 'BAAI/bge-base-en-v1.5';
    togetherService = new TogetherAIService(process.env.TOGETHER_API_KEY, model, embeddingModel);

    // Initialize Qdrant service with auto-generated collection name if not provided
    const collectionName = process.env.QDRANT_COLLECTION_NAME || 'knowledge_base';
    qdrantService = new QdrantService(
      process.env.QDRANT_URL,
      process.env.QDRANT_API_KEY || '',
      collectionName
    );

    // Initialize WhatsApp service
    whatsappService = new WhatsAppService(process.env.WA_SESSION_NAME);

    // Test connections
    await qdrantService.testConnection();
    await qdrantService.ensureCollection(); // Create collection if it doesn't exist
    await togetherService.testConnection();

    // Setup knowledge base with default content
    await setupKnowledgeBase(qdrantService, togetherService);

    // Initialize web chat service
    webChatService = new WebChatService();

    // Initialize admin training service
    const adminNumbers = process.env.ADMIN_NUMBERS ? process.env.ADMIN_NUMBERS.split(',') : [];
    adminTrainingService = new AdminTrainingService(
      qdrantService, 
      togetherService, 
      whatsappService || new WhatsAppService('dummy'),
      webChatService,
      adminNumbers
    );

    // Set up message handling
    whatsappService.onMessage(handleWhatsAppMessage);
    await whatsappService.initialize();

    logger.success('All services initialized successfully');

    // Temporary test function
    setTimeout(runTemporaryTests, 5000);

  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(): Promise<void> {
  logger.info('Shutting down gracefully...');
  
  if (whatsappService) {
    await whatsappService.disconnect();
  }
  
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  await initializeServices();
});

export { app }; 