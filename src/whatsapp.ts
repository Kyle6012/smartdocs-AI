import makeWASocket, { 
  ConnectionState, 
  DisconnectReason, 
  useMultiFileAuthState,
  WAMessage,
  proto,
  Browsers,
  makeInMemoryStore,
  downloadMediaMessage
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { logger, formatPhoneNumber } from './utils';

export interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp: number;
  fileContent?: string;
  fileName?: string;
}

import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export class WhatsAppService {
  private socket: any;
  private store: any;
  private sessionName: string;
  private onMessageCallback?: (message: WhatsAppMessage) => Promise<void>;
  private connected: boolean = false;

  constructor(sessionName: string) {
    this.sessionName = sessionName;
  }

  async initialize(): Promise<void> {
    try {
      const storeLogger = { ...logger, level: 'silent' };
      this.store = makeInMemoryStore({ logger: storeLogger as any });

      const storeFile = `${this.sessionName}_store.json`;
      if (existsSync(storeFile)) {
        this.store.readFromFile(storeFile);
        logger.info(`Loaded store from file: ${storeFile}`);
      }

      // Save store to file every 10s
      setInterval(() => {
        this.store.writeToFile(storeFile);
      }, 10_000);

      logger.info(`🔄 Initializing WhatsApp with session: ${this.sessionName}`);
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionName);
      
      // Check if we have existing credentials
      const hasExistingAuth = state.creds?.me?.id;
      if (hasExistingAuth) {
        logger.info('📱 Found existing auth credentials, attempting auto-connect...');
      } else {
        logger.info('🆕 No existing credentials found, will show QR code...');
      }
      
      this.socket = makeWASocket({
        auth: state,
        browser: Browsers.macOS('Desktop'),
        getMessage: async key => {
          return (this.store.loadMessage(key.remoteJid!, key.id!) || this.store.loadMessage(key.remoteJid!, key.id!))?.message || undefined
        },
        logger: {
          level: 'silent',
          trace: () => {},
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
          fatal: () => {},
          child: () => ({ 
            level: 'silent',
            trace: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
            fatal: () => {}
          })
        } as any
      });

      this.store.bind(this.socket.ev);

      this.socket.ev.on('creds.update', saveCreds);
      this.socket.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
      this.socket.ev.on('messages.upsert', this.handleMessages.bind(this));

      logger.info('WhatsApp client initialized');
    } catch (error) {
      logger.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  private async handleConnectionUpdate(update: Partial<ConnectionState>) {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      logger.info('🔗 WhatsApp QR Code received! Please scan with your phone:');
      console.log('\n' + '='.repeat(60));
      console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP:');
      console.log('='.repeat(60) + '\n');
      
      // Import QR code generation
      const QRCode = require('qrcode-terminal');
      QRCode.generate(qr, { small: true });
      
      console.log('\n' + '='.repeat(60));
      console.log('📱 Steps to connect:');
      console.log('1. Open WhatsApp on your phone');
      console.log('2. Go to Settings > Linked Devices');  
      console.log('3. Tap "Link a Device"');
      console.log('4. Scan the QR code above');
      console.log('5. Wait for connection...');
      console.log('\n⏰ QR Code expires in ~20 seconds. A new one will appear if needed.');
      console.log('='.repeat(60) + '\n');
    }
    
        if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      
      if (shouldReconnect) {
        logger.warn('Connection closed, reconnecting...');
        this.connected = false;
        await this.initialize();
      } else {
        logger.error('WhatsApp logged out! Auth session expired.');
        logger.info('🔄 Clearing old session and generating new QR code...');
        this.connected = false;
        
        // Clear the old session and reinitialize to get a new QR code
        await this.clearSession();
        await this.initialize();
      }
    } else if (connection === 'open') {
        logger.success('🎉 WhatsApp connected successfully! You can now use the bot.');
        this.connected = true;
        
        // Send connection notification to admin numbers
        await this.notifyAdminsOfConnection();
      } else if (connection === 'connecting') {
        logger.info('🔄 Connecting to WhatsApp...');
        this.connected = false;
    }
  }

  private async notifyAdminsOfConnection() {
    try {
      const adminNumbers = process.env.ADMIN_NUMBERS?.split(',').map(num => num.trim()) || [];
      
      if (adminNumbers.length === 0) {
        logger.warn('No admin numbers configured for connection notification');
        return;
      }

      const connectionMessage = `🤖 *WhatsApp AI Bot Connected!*

✅ Bot is now online and ready to serve
🎯 All services initialized successfully
📊 Vector database connected
🔧 Admin controls available

*Quick Admin Menu:*
• /menu - Show full admin menu
• /help - Get help and commands
• /status - Check system status
• /train - Start training mode

*Web Widget:*
• /widget - Get embed code for your website

Type */menu* to get started with training and configuration!

_Bot Version: 1.0.0_
_Status: Online & Ready_ 🟢`;

      // Send to all admin numbers
      for (const adminNumber of adminNumbers) {
        const formattedNumber = adminNumber.includes('@s.whatsapp.net') 
          ? adminNumber 
          : `${adminNumber}@s.whatsapp.net`;
        
        await this.sendMessage(formattedNumber, connectionMessage);
        logger.info(`Connection notification sent to admin: ${adminNumber}`);
      }

      // Also send to bot's own number (self-message for admin operations)
      if (this.socket?.user?.id) {
        const botNumber = this.socket.user.id;
        const selfMessage = `🤖 *Bot Self-Admin Interface*

This is your bot's admin control center. You can manage the bot directly from here.

*Available Commands:*
• /menu - Full admin menu
• /status - System status
• /logs - View recent logs
• /restart - Restart services
• /backup - Backup knowledge base

*Training Commands:*
• /train - Start training session
• /add-faq - Quick FAQ addition
• /bulk-train - Bulk training mode

Type */menu* to begin! 🚀`;

        await this.sendMessage(botNumber, selfMessage);
        logger.info('Self-admin interface message sent to bot');
      }

    } catch (error) {
      logger.error('Failed to send connection notifications:', error);
    }
  }

  private async handleMessages(m: { messages: WAMessage[] }) {
    const message = m.messages[0];
    
    if (!message.message || message.key.fromMe) return;
    
    // Handle text messages
    let messageText = message.message.conversation || 
                      message.message.extendedTextMessage?.text || '';
    
    // Handle document/media messages
    let fileContent = '';
    let fileName = '';
    let hasFile = false;

    try {
      // Check for document messages
      if (message.message.documentMessage) {
        const doc = message.message.documentMessage;
        fileName = doc.fileName || 'document.txt';
        logger.info(`Received document: ${fileName}`);
        
        // Download and process the document
        const buffer = await this.downloadMediaMessage(message);
        if (buffer) {
          // For PDF and DOCX, keep as buffer; for text files, convert to string
          const fileExt = fileName.split('.').pop()?.toLowerCase();
          if (fileExt === 'pdf' || fileExt === 'docx') {
            fileContent = buffer.toString('base64'); // Store as base64 for binary files
          } else {
            fileContent = buffer.toString('utf-8'); // Text files as UTF-8
          }
          hasFile = true;
          messageText = messageText || `📄 Uploaded file: ${fileName}`;
        }
      }
      
      // Check for image messages with captions (for OCR potential)
      else if (message.message.imageMessage) {
        const img = message.message.imageMessage;
        fileName = 'image.jpg';
        messageText = img.caption || messageText || '📸 Image uploaded';
        logger.info('Received image message');
        // Note: OCR could be added here in the future
      }
      
      // Check for other media types
      else if (message.message.audioMessage) {
        messageText = messageText || '🎵 Audio file uploaded';
      } else if (message.message.videoMessage) {
        messageText = messageText || '🎬 Video file uploaded';
      }
      
    } catch (error) {
      logger.error('Error processing media message:', error);
    }

    // Skip if no text and no file
    if (!messageText.trim() && !hasFile) return;

    const whatsappMessage: WhatsAppMessage = {
      from: message.key.remoteJid || '',
      text: messageText,
      timestamp: message.messageTimestamp as number || Date.now(),
      fileContent: hasFile ? fileContent : undefined,
      fileName: hasFile ? fileName : undefined
    };

    logger.info('Received message:', { 
      from: whatsappMessage.from, 
      text: whatsappMessage.text, 
      hasFile: hasFile,
      fileName: fileName 
    });

    if (this.onMessageCallback) {
      try {
        await this.onMessageCallback(whatsappMessage);
      } catch (error) {
        logger.error('Error processing message:', error);
      }
    }
  }

  private async downloadMediaMessage(message: WAMessage): Promise<Buffer | null> {
    try {
      const stream = await downloadMediaMessage(
        message,
        'buffer',
        {},
        {
          logger: { level: 'silent' } as any,
          reuploadRequest: this.socket.updateMediaMessage
        }
      );
      return stream as Buffer;
    } catch (error) {
      logger.error(`Error downloading media:`, error);
      return null;
    }
  }

  async sendMessage(to: string, text: string): Promise<void> {
    try {
      if (!this.socket) {
        throw new Error('WhatsApp socket not initialized');
      }

      const formattedTo = formatPhoneNumber(to);
      await this.socket.sendMessage(formattedTo, { text });
      logger.info(`Message sent to ${formattedTo}: ${text.substring(0, 50)}...`);
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw error;
    }
  }

  onMessage(callback: (message: WhatsAppMessage) => Promise<void>): void {
    this.onMessageCallback = callback;
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.end(new Error('Graceful shutdown'));
      this.socket = null;
      this.connected = false;
      logger.info('WhatsApp client disconnected');
    }
  }

  private async clearSession(): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      if (fs.existsSync(this.sessionName)) {
        logger.info(`🗑️ Clearing old session directory: ${this.sessionName}`);
        fs.rmSync(this.sessionName, { recursive: true, force: true });
      }
      
      logger.success('✅ Old session cleared, ready for new QR code');
    } catch (error) {
      logger.error('Failed to clear session:', error);
    }
  }

  isConnected(): boolean {
    return this.connected && this.socket?.user?.id ? true : false;
  }
} 