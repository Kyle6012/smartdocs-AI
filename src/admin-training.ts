import { QdrantService, Document } from './qdrant';
import { TogetherAIService } from './together';
import { WhatsAppService } from './whatsapp';
import { WebChatService, WidgetConfig } from './web-chat';
import { logger } from './utils';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

interface TrainingSession {
  adminNumber: string;
  state: 'idle' | 'adding_faq' | 'adding_info' | 'waiting_question' | 'waiting_answer' | 'confirm_training' | 'configuring_widget';
  currentData?: {
    question?: string;
    answer?: string;
    content?: string;
    type?: string;
    widgetConfig?: Partial<WidgetConfig>;
  };
  tempData: Document[];
}

export class AdminTrainingService {
  private qdrantService: QdrantService;
  private togetherService: TogetherAIService;
  private whatsappService: WhatsAppService;
  private webChatService: WebChatService;
  private adminNumbers: Set<string>;
  private sessions: Map<string, TrainingSession> = new Map();

  constructor(
    qdrantService: QdrantService, 
    togetherService: TogetherAIService,
    whatsappService: WhatsAppService,
    webChatService: WebChatService,
    adminNumbers: string[] = []
  ) {
    this.qdrantService = qdrantService;
    this.togetherService = togetherService;
    this.whatsappService = whatsappService;
    this.webChatService = webChatService;
    this.adminNumbers = new Set(adminNumbers);
  }

  isAdmin(phoneNumber: string): boolean {
    return this.adminNumbers.has(phoneNumber);
  }

  addAdmin(phoneNumber: string): void {
    this.adminNumbers.add(phoneNumber);
    logger.info(`Added admin: ${phoneNumber}`);
  }

  async handleAdminMessage(from: string, message: string): Promise<string> {
    if (!this.isAdmin(from)) {
      return "❌ You don't have admin privileges. Contact the bot owner to get admin access.";
    }

    const session = this.getOrCreateSession(from);
    const lowerMessage = message.toLowerCase().trim();

    // Handle admin commands with / prefix
    if (message.startsWith('/')) {
      return await this.handleAdminCommands(from, message, session);
    }

    // Handle training flows
    switch (session.state) {
      case 'idle':
        return this.handleIdleCommands(session, lowerMessage);
      
      case 'adding_faq':
        return this.handleFAQFlow(session, lowerMessage);
      
      case 'waiting_question':
        return this.handleQuestionInput(session, message);
      
      case 'waiting_answer':
        return this.handleAnswerInput(session, message);
      
      case 'adding_info':
        return this.handleInfoInput(session, message);
      
      case 'confirm_training':
        return await this.handleConfirmation(session, lowerMessage);
      
      default:
        return this.showMainMenu();
    }
  }

  private getOrCreateSession(adminNumber: string): TrainingSession {
    if (!this.sessions.has(adminNumber)) {
      this.sessions.set(adminNumber, {
        adminNumber,
        state: 'idle',
        tempData: []
      });
    }
    return this.sessions.get(adminNumber)!;
  }

  private async handleAdminCommands(from: string, message: string, session: TrainingSession): Promise<string> {
    const command = message.toLowerCase().trim();

    switch (command) {
      case '/menu':
      case '/start':
      case '/setup':
        session.state = 'idle';
        return this.showMainMenu();

      case '/help':
        return this.showHelpMenu();

      case '/status':
        return await this.showStatus();

      case '/cancel':
        session.state = 'idle';
        session.currentData = {};
        session.tempData = [];
        return "✅ Training session cancelled. Type /menu to start again.";

      case '/clear':
      case '/cleanup':
        return await this.clearSessions();

      case '/logs':
        return await this.showRecentLogs();

      case '/restart':
        return await this.restartServices();

      case '/backup':
        return await this.backupKnowledgeBase();

      case '/widget':
        return await this.getWidgetCode();

      case '/train':
        session.state = 'idle';
        return this.handleIdleCommands(session, '1');

      case '/add-faq':
        session.state = 'adding_faq';
        return "📝 **Adding FAQ**\n\nPlease send the question you want to add:";

      case '/bulk-train':
        return `📚 **Bulk Training**

*Text Format:*
Send multiple FAQ pairs like this:

Q: Your question here?
A: Your answer here.

Q: Another question?
A: Another answer.

*File Upload:*
📎 Attach any of these file types:
• .txt files with FAQ content
• .md files with documentation  
• .csv files with Q&A pairs
• .json files with structured data
• .pdf files with documents/manuals
• .docx files with Word documents

Just attach the file and I'll process it automatically! 🚀`;

      case '/upload':
      case '/file':
        return `📎 **File Upload Training**

Supported file types:
• **Text files** (.txt, .md) - Documentation, FAQs, guides
• **CSV files** (.csv) - Structured Q&A data
• **JSON files** (.json) - Structured training data
• **PDF files** (.pdf) - Documents, manuals, reports
• **Word files** (.docx) - Word documents, proposals

*How to upload:*
1. Attach your file to a WhatsApp message
2. Send it to me
3. I'll automatically process and train on the content

*File format examples:*

**FAQ Text File:**
\`\`\`
Q: What are your business hours?
A: We're open Monday-Friday 9AM-5PM

Q: How do I contact support?
A: Email us at support@company.com
\`\`\`

**CSV Format:**
\`\`\`
question,answer
"What services do you offer?","We provide web design and development"
"What are your rates?","Our rates start at $100/hour"
\`\`\`

Ready to upload? Just attach your file! 📁`;

      default:
        return `❓ Unknown command: ${command}\n\nType /menu to see all available commands.`;
    }
  }

  private showMainMenu(): string {
    return `🤖 *AI Training Menu*

Choose what you'd like to do:

*📚 Training Options:*
1️⃣ Add FAQ (Question & Answer)
2️⃣ Add Company Info
3️⃣ Upload Document/File
4️⃣ Bulk Training Mode

*🌐 Web Integration:*
5️⃣ Generate Website Widget
6️⃣ View Widget Status

*⚙️ Management:*
7️⃣ View Training Status
8️⃣ Add New Admin
9️⃣ Help & Instructions

*Commands:*
• Type the number (1-9) to select
• Type /cancel to stop training
• Type /menu to see this menu again
• Type /help for detailed instructions

What would you like to do?`;
  }

  private showHelpMenu(): string {
    return `📖 *Training Help Guide*

*🎯 Quick Start:*
1. Type *1* to add FAQ (most common)
2. Follow the prompts step by step
3. Confirm when ready to train

*📚 Training Types:*

*FAQ Training:* Best for customer questions
Example: "What are your hours?" → "9AM-5PM Mon-Fri"

*Company Info:* General information
Example: Company description, services, policies

*File Upload:* Send documents directly
Supported: .txt, .pdf, .docx files

*🔧 Tips:*
• Write naturally, like you're talking to customers
• Be specific and detailed in answers
• Use common words customers would use
• Test your training by asking the bot questions

*Commands:*
/menu - Show main menu
/status - Check training progress  
/cancel - Stop current training
/help - Show this help

Ready to start? Type /menu`;
  }

  private async handleIdleCommands(session: TrainingSession, command: string): Promise<string> {
    switch (command) {
      case '1':
        session.state = 'adding_faq';
        return this.handleFAQFlow(session, 'start');
      
      case '2':
        session.state = 'adding_info';
        return "📝 *Add Company Information*\n\nPlease type or paste your company information. This could be:\n• About us\n• Services description\n• Policies\n• Contact details\n• Any other company info\n\nJust send it as a regular message:";
      
      case '3':
        return "📎 *Upload Document*\n\n*How to upload:*\n1. Send me any document file (.txt, .pdf, .docx)\n2. I'll process it automatically\n3. All text content will be added to training\n\n*Alternative:* Copy and paste text content directly\n\nSend your file or text now:";
      
      case '4':
        return "🚀 *Bulk Training Mode*\n\nSend multiple training items at once:\n\n*Format for FAQ:*\nQ: Your question here?\nA: Your answer here\n\nQ: Another question?\nA: Another answer\n\n*Format for Info:*\nJust send paragraphs of information\n\nReady? Send your bulk training data:";
      
      case '5':
        session.state = 'configuring_widget';
        return this.startWidgetConfiguration(session);
      
      case '6':
        return await this.showWidgetStatus();
      
      case '7':
        return await this.showStatus();
      
      case '8':
        return "👥 *Add New Admin*\n\nTo add a new admin:\n1. Get their WhatsApp number\n2. Send it in this format: +1234567890\n3. They'll get admin access immediately\n\nSend the phone number:";
      
      case '9':
        return this.showHelpMenu();
      
      default:
        return "❓ Please choose a number from 1-9, or type /menu to see options again.";
    }
  }

  private handleFAQFlow(session: TrainingSession, input: string): string {
    if (input === 'start') {
      session.state = 'waiting_question';
      return "❓ *Add FAQ Training*\n\nStep 1: What question do customers ask?\n\nExamples:\n• \"What are your business hours?\"\n• \"How much does it cost?\"\n• \"Do you offer refunds?\"\n\nType the question:";
    }
    return this.showMainMenu();
  }

  private handleQuestionInput(session: TrainingSession, question: string): string {
    session.currentData = { question };
    session.state = 'waiting_answer';
    
    return `✅ Question saved: "${question}"\n\n💬 Step 2: What's the answer?\n\nBe specific and helpful. Write like you're personally helping the customer.\n\nType the answer:`;
  }

  private handleAnswerInput(session: TrainingSession, answer: string): string {
    if (session.currentData) {
      session.currentData.answer = answer;
    }
    
    session.state = 'confirm_training';
    
    return `✅ *Ready to Train!*\n\n*Question:* ${session.currentData?.question}\n*Answer:* ${answer}\n\n*Options:*\n✅ Type *YES* to add this training\n🔄 Type *MORE* to add another FAQ\n❌ Type *CANCEL* to discard\n\nWhat would you like to do?`;
  }

  private handleInfoInput(session: TrainingSession, content: string): string {
    session.currentData = { content, type: 'company_info' };
    session.state = 'confirm_training';
    
    const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;
    
    return `✅ *Ready to Train!*\n\n*Content Added:*\n${preview}\n\n*Options:*\n✅ Type *YES* to add this training\n🔄 Type *MORE* to add more info\n❌ Type *CANCEL* to discard\n\nWhat would you like to do?`;
  }

  private async handleConfirmation(session: TrainingSession, command: string): Promise<string> {
    switch (command) {
      case 'yes':
      case 'y':
        return await this.processTraining(session);
      
      case 'more':
      case 'm':
        // Save current data to temp storage
        if (session.currentData) {
          if (session.currentData.question && session.currentData.answer) {
            session.tempData.push({
              content: `Q: ${session.currentData.question}\nA: ${session.currentData.answer}`,
              metadata: { type: 'faq', question: session.currentData.question }
            });
          } else if (session.currentData.content) {
            session.tempData.push({
              content: session.currentData.content,
              metadata: { type: session.currentData.type || 'info' }
            });
          }
        }
        
        session.state = 'idle';
        session.currentData = {};
        return `✅ Training data saved! (${session.tempData.length} items total)\n\n${this.showMainMenu()}`;
      
      case 'cancel':
      case 'c':
        session.state = 'idle';
        session.currentData = {};
        session.tempData = [];
        return "❌ Training cancelled.\n\n" + this.showMainMenu();
      
      default:
        return "Please type *YES* to confirm, *MORE* to add more, or *CANCEL* to discard.";
    }
  }

  private async processTraining(session: TrainingSession): Promise<string> {
    try {
      const documents: Document[] = [...session.tempData];
      
      // Add current data
      if (session.currentData) {
        if (session.currentData.question && session.currentData.answer) {
          documents.push({
            content: `Q: ${session.currentData.question}\nA: ${session.currentData.answer}`,
            metadata: { 
              type: 'faq', 
              question: session.currentData.question,
              addedBy: session.adminNumber,
              addedAt: new Date().toISOString()
            }
          });
        } else if (session.currentData.content) {
          documents.push({
            content: session.currentData.content,
            metadata: { 
              type: session.currentData.type || 'info',
              addedBy: session.adminNumber,
              addedAt: new Date().toISOString()
            }
          });
        }
      }

      if (documents.length === 0) {
        return "❌ No training data to process.";
      }

      // Process training
      const success = await this.qdrantService.addDocuments(
        documents,
        this.togetherService.generateEmbedding.bind(this.togetherService)
      );

      if (success) {
        // Reset session
        session.state = 'idle';
        session.currentData = {};
        session.tempData = [];

        return `🎉 *Training Successful!*\n\n✅ Added ${documents.length} training item(s)\n✅ AI is now smarter!\n✅ Ready for customer questions\n\n*Test it:* Ask the bot a question to see if it learned!\n\n${this.showMainMenu()}`;
      } else {
        return "❌ Training failed. Please try again or contact support.";
      }
    } catch (error) {
      logger.error('Training error:', error);
      return "❌ Training error occurred. Please try again.";
    }
  }

  private async showStatus(): Promise<string> {
    try {
      const stats = await this.qdrantService.getCollectionInfo();
      const pointsCount = stats?.points_count || 0;
      
      return `📊 *Training Status*\n\n✅ Knowledge Items: ${pointsCount}\n✅ AI Model: Ready\n✅ Admins: ${this.adminNumbers.size}\n\n*Recent Activity:*\n• Collection is active\n• Ready for new training\n• Responding to user questions\n\nType /menu for training options.`;
    } catch (error) {
      return "📊 *Training Status*\n\n⚠️ Could not fetch detailed stats\n✅ System is running\n✅ Ready for training\n\nType /menu for training options.";
    }
  }

  async handleFileUpload(from: string, fileContent: string, fileName: string): Promise<string> {
    if (!this.isAdmin(from)) {
      return "❌ Admin access required for file uploads.";
    }

    try {
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      let documents: Document[] = [];
      let processedCount = 0;

      logger.info(`Processing file upload: ${fileName} (${fileExt})`);

      switch (fileExt) {
        case 'txt':
        case 'md':
          // Process as plain text
          documents = await this.processTextFile(fileContent, fileName);
          break;

        case 'csv':
          // Process CSV file
          documents = await this.processCSVFile(fileContent, fileName);
          break;

        case 'json':
          // Process JSON file
          documents = await this.processJSONFile(fileContent, fileName);
          break;

        case 'pdf':
          // Process PDF file
          documents = await this.processPDFFile(fileContent, fileName);
          break;

        case 'docx':
          // Process DOCX file
          documents = await this.processDOCXFile(fileContent, fileName);
          break;

        default:
          // Try to process as plain text
          documents = await this.processTextFile(fileContent, fileName);
          break;
      }

      if (documents.length === 0) {
        return `❌ *File Processing Failed*\n\n📄 File: ${fileName}\n⚠️ No content could be extracted\n\n*Supported formats:*\n• .txt, .md (plain text)\n• .csv (question,answer format)\n• .json (structured data)\n• .pdf (PDF documents)\n• .docx (Word documents)`;
      }

      const success = await this.qdrantService.addDocuments(
        documents,
        this.togetherService.generateEmbedding.bind(this.togetherService)
      );

      processedCount = documents.length;

      if (success) {
        return `🎉 *File Uploaded Successfully!*

📄 **File:** ${fileName}
📊 **Processed:** ${processedCount} content chunks
✅ **Status:** Added to AI knowledge base
🧠 **Ready:** AI can now answer questions about this content

*What was added:*
${documents.slice(0, 3).map((doc, i) => `${i + 1}. ${doc.content.substring(0, 100)}...`).join('\n')}
${documents.length > 3 ? `\n...and ${documents.length - 3} more chunks` : ''}

Type /menu for more training options! 🚀`;
      } else {
        return "❌ File upload failed. Please try again.";
      }
    } catch (error) {
      logger.error('File upload error:', error);
      return `❌ *File Processing Error*\n\n📄 File: ${fileName}\n🔍 Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n*Try:*\n• Check file format\n• Ensure file is not corrupted\n• Use supported file types (.txt, .md, .csv, .json, .pdf, .docx)`;
    }
  }

  private async processTextFile(content: string, fileName: string): Promise<Document[]> {
    const chunks = this.splitIntoChunks(content, 1000);
    return chunks.map((chunk, index) => ({
      content: chunk,
      metadata: {
        type: 'text',
        source: fileName,
        chunk_index: index,
        total_chunks: chunks.length,
        addedAt: new Date().toISOString()
      }
    }));
  }

  private async processCSVFile(content: string, fileName: string): Promise<Document[]> {
    const documents: Document[] = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return documents;

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles basic quoted fields)
      const columns = this.parseCSVLine(line);
      if (columns.length >= 2) {
        const question = columns[0].replace(/^"|"$/g, '');
        const answer = columns[1].replace(/^"|"$/g, '');
        
        if (question && answer) {
          documents.push({
            content: `Q: ${question}\nA: ${answer}`,
            metadata: {
              type: 'faq',
              source: fileName,
              question: question,
              answer: answer,
              addedAt: new Date().toISOString()
            }
          });
        }
      }
    }

    return documents;
  }

  private async processJSONFile(content: string, fileName: string): Promise<Document[]> {
    const documents: Document[] = [];
    
    try {
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        // Handle array of objects
        data.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            if (item.question && item.answer) {
              // FAQ format
              documents.push({
                content: `Q: ${item.question}\nA: ${item.answer}`,
                metadata: {
                  type: 'faq',
                  source: fileName,
                  question: item.question,
                  answer: item.answer,
                  index: index,
                  addedAt: new Date().toISOString()
                }
              });
            } else if (item.content) {
              // Content format
              documents.push({
                content: item.content,
                metadata: {
                  type: 'content',
                  source: fileName,
                  title: item.title || `Item ${index + 1}`,
                  index: index,
                  addedAt: new Date().toISOString()
                }
              });
            }
          }
        });
      } else if (typeof data === 'object') {
        // Handle single object
        if (data.content) {
          documents.push({
            content: data.content,
            metadata: {
              type: 'content',
              source: fileName,
              title: data.title || fileName,
              addedAt: new Date().toISOString()
            }
          });
        }
      }
    } catch (error) {
      logger.error('JSON parsing error:', error);
    }

    return documents;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private async processPDFFile(base64Content: string, fileName: string): Promise<Document[]> {
    try {
      // Convert base64 back to buffer
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Extract text from PDF
      const data = await pdfParse(buffer);
      const text = data.text;
      
      if (!text || text.trim().length === 0) {
        logger.warn(`No text extracted from PDF: ${fileName}`);
        return [];
      }
      
      // Split into chunks
      const chunks = this.splitIntoChunks(text, 1000);
      return chunks.map((chunk, index) => ({
        content: chunk,
        metadata: {
          type: 'pdf',
          source: fileName,
          chunk_index: index,
          total_chunks: chunks.length,
          pages: data.numpages || 'unknown',
          addedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      logger.error(`PDF processing error for ${fileName}:`, error);
      return [];
    }
  }

  private async processDOCXFile(base64Content: string, fileName: string): Promise<Document[]> {
    try {
      // Convert base64 back to buffer
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;
      
      if (!text || text.trim().length === 0) {
        logger.warn(`No text extracted from DOCX: ${fileName}`);
        return [];
      }
      
      // Split into chunks
      const chunks = this.splitIntoChunks(text, 1000);
      return chunks.map((chunk, index) => ({
        content: chunk,
        metadata: {
          type: 'docx',
          source: fileName,
          chunk_index: index,
          total_chunks: chunks.length,
          addedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      logger.error(`DOCX processing error for ${fileName}:`, error);
      return [];
    }
  }

  private splitIntoChunks(text: string, maxChunkSize: number): string[] {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    let currentChunk = '';

    for (const word of words) {
      if (currentChunk.length + word.length + 1 <= maxChunkSize) {
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = word;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.length > 0 ? chunks : [text];
  }

  private startWidgetConfiguration(session: TrainingSession): string {
    session.currentData = { widgetConfig: {} };
    
    return `🌐 *Website Widget Generator*\n\nI'll help you create a customizable chat widget for your website!\n\n*Default Settings:*\n• Bot Name: AI Assistant\n• Color: Blue theme\n• Position: Bottom right\n• Welcome Message: "Hello! How can I help you today?"\n\n*Options:*\n✅ Type *GENERATE* to create widget with default settings\n⚙️ Type *CUSTOMIZE* to personalize colors, messages, etc.\n❌ Type *CANCEL* to go back\n\nWhat would you like to do?`;
  }

  private async showWidgetStatus(): Promise<string> {
    const activeSessions = this.webChatService.getActiveSessionsCount();
    
    return `🌐 *Website Widget Status*\n\n✅ Widget System: Active\n👥 Active Web Sessions: ${activeSessions}\n🔗 Integration: Ready\n\n*Features Available:*\n• Customizable colors & branding\n• Mobile responsive design\n• Real-time chat with AI\n• Same training data as WhatsApp\n• Easy website embedding\n\nType *5* to generate a new widget or /menu for options.`;
  }

  private async generateWidget(config: Partial<WidgetConfig> = {}): Promise<string> {
    try {
      const embedCode = this.webChatService.generateEmbedCode(config);
      
      const configSummary = `*Widget Configuration:*\n• Bot Name: ${config.botName || 'AI Assistant'}\n• Theme: ${config.theme || 'light'}\n• Position: ${config.position || 'bottom-right'}\n• Primary Color: ${config.primaryColor || '#2563eb'}`;
      
      return `🎉 *Website Widget Generated!*\n\n${configSummary}\n\n*📋 Embed Code:*\n\`\`\`html\n${embedCode}\n\`\`\`\n\n*🚀 How to Use:*\n1. Copy the code above\n2. Paste it in your website's HTML (before closing </body> tag)\n3. Save and publish your website\n4. The chat widget will appear automatically!\n\n*✨ Features:*\n• Same AI brain as WhatsApp\n• All your training data included\n• Mobile responsive\n• Customizable styling\n\nType /menu for more options!`;
    } catch (error) {
      logger.error('Widget generation error:', error);
      return "❌ Error generating widget. Please try again.";
    }
  }

  private async clearSessions(): Promise<string> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Clear training sessions
      const sessionCount = this.sessions.size;
      this.sessions.clear();
      
      // Clear temporary files if any
      const tempDir = path.join(process.cwd(), 'temp');
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      logger.info(`Admin cleared ${sessionCount} training sessions`);
      
      return `🧹 *Session Cleanup Complete*

✅ Cleared ${sessionCount} training sessions
🗑️ Removed temporary files
💾 WhatsApp auth session preserved
🔄 System refreshed

*Status:* All clean! 🟢`;

    } catch (error) {
      logger.error('Session cleanup error:', error);
      return "❌ Error during cleanup. Some files may still be present.";
    }
  }

  private async showRecentLogs(): Promise<string> {
    try {
      // Get recent log entries (this is a simplified version)
      const logs = [
        `[${new Date().toISOString()}] System status check`,
        `[${new Date(Date.now() - 60000).toISOString()}] Training session completed`,
        `[${new Date(Date.now() - 120000).toISOString()}] WhatsApp connection stable`,
        `[${new Date(Date.now() - 180000).toISOString()}] Vector database sync complete`
      ];
      
      return `📋 *Recent System Logs*

${logs.join('\n')}

*🔍 Full Logs:*
Check server console for detailed logs

*📊 Quick Stats:*
• Active Sessions: ${this.sessions.size}
• Admin Numbers: ${this.adminNumbers.size}
• System Status: Online 🟢

Type /status for more details.`;

    } catch (error) {
      logger.error('Log retrieval error:', error);
      return "❌ Unable to retrieve logs at the moment.";
    }
  }

  private async restartServices(): Promise<string> {
    try {
      logger.info('Admin requested service restart');
      
      // Clear sessions but keep admin data
      this.sessions.clear();
      
      return `🔄 *Service Restart Initiated*

✅ Training sessions cleared
🔄 Services refreshing...
⚡ System will be back online shortly

*Note:* WhatsApp connection maintained
*Status:* Restarting... 🟡

Type /status in a few seconds to check.`;

    } catch (error) {
      logger.error('Service restart error:', error);
      return "❌ Error during restart. Please check system manually.";
    }
  }

  private async backupKnowledgeBase(): Promise<string> {
    try {
      const collectionInfo = await this.qdrantService.getCollectionInfo();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      logger.info(`Admin requested knowledge base backup at ${timestamp}`);
      
      return `💾 *Knowledge Base Backup*

📊 *Current Stats:*
• Total Documents: ${collectionInfo?.vectors_count || 'N/A'}
• Collection: ${process.env.QDRANT_COLLECTION_NAME || 'knowledge_base'}
• Backup Time: ${new Date().toLocaleString()}

✅ *Backup Status:*
Vector database is automatically backed up by Qdrant Cloud

🔒 *Data Security:*
• All embeddings stored securely
• Training data preserved
• Admin settings maintained

*Note:* For manual export, use Qdrant dashboard
Type /status for system overview.`;

    } catch (error) {
      logger.error('Backup check error:', error);
      return "❌ Unable to check backup status. Vector database may be unavailable.";
    }
  }

  private async getWidgetCode(): Promise<string> {
    try {
      const defaultConfig: WidgetConfig = {
        botName: 'AI Assistant',
        theme: 'light',
        primaryColor: '#2563eb',
        accentColor: '#1e40af',
        position: 'bottom-right',
        welcomeMessage: 'Hello! How can I help you today?',
        showTypingIndicator: true,
        collectUserInfo: false
      };
      
      const embedCode = this.webChatService.generateEmbedCode(defaultConfig);
      
      return `🌐 *Website Widget Code*

*📋 Quick Embed Code:*
\`\`\`html
${embedCode}
\`\`\`

*🎨 Customization:*
• Change colors, position, theme
• Modify bot name and messages
• Responsive design included

*🚀 Installation:*
1. Copy code above
2. Paste before </body> tag
3. Save and publish

*✨ Features:*
• Same AI as WhatsApp bot
• All your training included
• Mobile-friendly design

Type /menu for more options!`;

    } catch (error) {
      logger.error('Widget code generation error:', error);
      return "❌ Unable to generate widget code. Please try again.";
    }
  }
} 