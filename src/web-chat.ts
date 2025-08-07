import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils';

export interface WebChatMessage {
  from: string;
  text: string;
  timestamp: number;
  sessionId: string;
  messageId: string;
}

export interface WebChatSession {
  sessionId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  startTime: number;
  lastActivity: number;
  messages: WebChatMessage[];
}

export interface WidgetConfig {
  botName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark';
  showTypingIndicator: boolean;
  collectUserInfo: boolean;
}

export class WebChatService {
  private sessions: Map<string, WebChatSession> = new Map();
  private onMessageCallback?: (message: WebChatMessage) => Promise<void>;
  private defaultWidgetConfig: WidgetConfig;

  constructor() {
    this.defaultWidgetConfig = {
      botName: 'AI Assistant',
      primaryColor: '#2563eb',
      accentColor: '#1d4ed8',
      logoUrl: '',
      welcomeMessage: 'Hello! How can I help you today?',
      position: 'bottom-right',
      theme: 'light',
      showTypingIndicator: true,
      collectUserInfo: false
    };

    // Clean up old sessions every hour
    setInterval(() => this.cleanupOldSessions(), 60 * 60 * 1000);
  }

  createSession(userId?: string, userName?: string, userEmail?: string): string {
    const sessionId = uuidv4();
    const session: WebChatSession = {
      sessionId,
      userId,
      userName,
      userEmail,
      startTime: Date.now(),
      lastActivity: Date.now(),
      messages: []
    };

    this.sessions.set(sessionId, session);
    logger.info(`Web chat session created: ${sessionId}`);
    
    return sessionId;
  }

  getSession(sessionId: string): WebChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  async handleMessage(sessionId: string, text: string, userId?: string): Promise<WebChatMessage> {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const message: WebChatMessage = {
      from: userId || sessionId,
      text,
      timestamp: Date.now(),
      sessionId,
      messageId: uuidv4()
    };

    // Update session
    session.lastActivity = Date.now();
    session.messages.push(message);
    if (userId) session.userId = userId;

    // Process message through callback
    if (this.onMessageCallback) {
      try {
        await this.onMessageCallback(message);
      } catch (error) {
        logger.error('Error processing web chat message:', error);
      }
    }

    return message;
  }

  addBotResponse(sessionId: string, text: string): WebChatMessage {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const response: WebChatMessage = {
      from: 'bot',
      text,
      timestamp: Date.now(),
      sessionId,
      messageId: uuidv4()
    };

    session.messages.push(response);
    session.lastActivity = Date.now();

    return response;
  }

  getSessionMessages(sessionId: string): WebChatMessage[] {
    const session = this.getSession(sessionId);
    return session ? session.messages : [];
  }

  onMessage(callback: (message: WebChatMessage) => Promise<void>): void {
    this.onMessageCallback = callback;
  }

  generateWidgetHTML(config: Partial<WidgetConfig> = {}): string {
    const widgetConfig = { ...this.defaultWidgetConfig, ...config };
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chat Widget</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .chat-widget {
            position: fixed;
            ${widgetConfig.position.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
            ${widgetConfig.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chat-bubble {
            width: 60px;
            height: 60px;
            background: ${widgetConfig.primaryColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }

        .chat-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .chat-bubble svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        .chat-window {
            position: absolute;
            ${widgetConfig.position.includes('bottom') ? 'bottom: 80px' : 'top: 80px'};
            ${widgetConfig.position.includes('right') ? 'right: 0' : 'left: 0'};
            width: 350px;
            height: 500px;
            background: ${widgetConfig.theme === 'light' ? '#ffffff' : '#1f2937'};
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-window.open {
            display: flex;
        }

        .chat-header {
            background: ${widgetConfig.primaryColor};
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-header img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        .chat-header-info h3 {
            font-size: 16px;
            font-weight: 600;
        }

        .chat-header-info p {
            font-size: 12px;
            opacity: 0.9;
        }

        .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: ${widgetConfig.theme === 'light' ? '#f9fafb' : '#111827'};
        }

        .message {
            margin-bottom: 12px;
            display: flex;
            gap: 8px;
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        .message.bot .message-bubble {
            background: ${widgetConfig.theme === 'light' ? '#e5e7eb' : '#374151'};
            color: ${widgetConfig.theme === 'light' ? '#1f2937' : '#f9fafb'};
        }

        .message.user .message-bubble {
            background: ${widgetConfig.primaryColor};
            color: white;
        }

        .chat-input {
            padding: 16px;
            border-top: 1px solid ${widgetConfig.theme === 'light' ? '#e5e7eb' : '#374151'};
            background: ${widgetConfig.theme === 'light' ? '#ffffff' : '#1f2937'};
        }

        .input-container {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid ${widgetConfig.theme === 'light' ? '#d1d5db' : '#4b5563'};
            border-radius: 24px;
            outline: none;
            background: ${widgetConfig.theme === 'light' ? '#ffffff' : '#374151'};
            color: ${widgetConfig.theme === 'light' ? '#1f2937' : '#f9fafb'};
            font-size: 14px;
        }

        .chat-input input:focus {
            border-color: ${widgetConfig.primaryColor};
        }

        .send-button {
            width: 40px;
            height: 40px;
            background: ${widgetConfig.primaryColor};
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        }

        .send-button:hover {
            background: ${widgetConfig.accentColor};
        }

        .send-button svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            margin-bottom: 12px;
        }

        .typing-indicator.hidden {
            display: none;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: ${widgetConfig.theme === 'light' ? '#9ca3af' : '#6b7280'};
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        @media (max-width: 480px) {
            .chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 100px);
                ${widgetConfig.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            }
        }
    </style>
</head>
<body>
    <div class="chat-widget">
        <div class="chat-bubble" onclick="toggleChat()">
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </div>
        
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                ${widgetConfig.logoUrl ? `<img src="${widgetConfig.logoUrl}" alt="Logo">` : ''}
                <div class="chat-header-info">
                    <h3>${widgetConfig.botName}</h3>
                    <p>Online • Usually replies instantly</p>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    <div class="message-bubble">${widgetConfig.welcomeMessage}</div>
                </div>
                <div class="typing-indicator hidden" id="typingIndicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            
            <div class="chat-input">
                <div class="input-container">
                    <input 
                        type="text" 
                        id="messageInput" 
                        placeholder="Type your message..." 
                        onkeypress="handleKeyPress(event)"
                    >
                    <button class="send-button" onclick="sendMessage()">
                        <svg viewBox="0 0 24 24">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let sessionId = null;
        let isOpen = false;

        async function initChat() {
            try {
                const response = await fetch('/api/chat/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                sessionId = data.sessionId;
            } catch (error) {
                console.error('Failed to initialize chat:', error);
            }
        }

        function toggleChat() {
            const chatWindow = document.getElementById('chatWindow');
            isOpen = !isOpen;
            
            if (isOpen) {
                chatWindow.classList.add('open');
                if (!sessionId) initChat();
                document.getElementById('messageInput').focus();
            } else {
                chatWindow.classList.remove('open');
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message || !sessionId) return;

            // Add user message to chat
            addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            if (${widgetConfig.showTypingIndicator}) {
                document.getElementById('typingIndicator').classList.remove('hidden');
            }

            try {
                const response = await fetch('/api/chat/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: message
                    })
                });

                const data = await response.json();
                
                // Hide typing indicator
                document.getElementById('typingIndicator').classList.add('hidden');
                
                if (data.response) {
                    addMessage(data.response, 'bot');
                }
            } catch (error) {
                console.error('Failed to send message:', error);
                document.getElementById('typingIndicator').classList.add('hidden');
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        }

        function addMessage(text, sender) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}\`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.textContent = text;
            
            messageDiv.appendChild(bubbleDiv);
            
            // Insert before typing indicator
            const typingIndicator = document.getElementById('typingIndicator');
            messagesContainer.insertBefore(messageDiv, typingIndicator);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Initialize chat when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Auto-open chat if needed
            // toggleChat();
        });
    </script>
</body>
</html>`;
  }

  generateEmbedCode(config: Partial<WidgetConfig> = {}): string {
    const widgetConfig = { ...this.defaultWidgetConfig, ...config };
    const configJson = JSON.stringify(widgetConfig);
    
    return `<!-- AI Chat Widget -->
<script>
  (function() {
    var chatConfig = ${configJson};
    
    // Create iframe for widget
    var iframe = document.createElement('iframe');
    iframe.src = '/widget.html?config=' + encodeURIComponent(JSON.stringify(chatConfig));
    iframe.style.position = 'fixed';
    iframe.style.${widgetConfig.position.includes('bottom') ? 'bottom' : 'top'} = '20px';
    iframe.style.${widgetConfig.position.includes('right') ? 'right' : 'left'} = '20px';
    iframe.style.width = '80px';
    iframe.style.height = '80px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.borderRadius = '50%';
    iframe.style.overflow = 'hidden';
    iframe.id = 'ai-chat-widget';
    
    // Add to page when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(iframe);
      });
    } else {
      document.body.appendChild(iframe);
    }
  })();
</script>
<!-- End AI Chat Widget -->`;
  }

  private cleanupOldSessions(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.sessions.delete(sessionId);
        logger.info(`Cleaned up old web chat session: ${sessionId}`);
      }
    }
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  getAllSessions(): WebChatSession[] {
    return Array.from(this.sessions.values());
  }
} 