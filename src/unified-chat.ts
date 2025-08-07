import { WhatsAppMessage } from './whatsapp';
import { WhatsAppBusinessMessage } from './whatsapp-business';
import { WebChatMessage } from './web-chat';

export interface UnifiedMessage {
  from: string;
  text: string;
  timestamp: number;
  platform: 'whatsapp' | 'whatsapp-business' | 'web';
  sessionId?: string;
  messageId?: string;
}

export class UnifiedChatHandler {
  static fromWhatsApp(message: WhatsAppMessage): UnifiedMessage {
    return {
      from: message.from,
      text: message.text,
      timestamp: message.timestamp,
      platform: 'whatsapp'
    };
  }

  static fromWhatsAppBusiness(message: WhatsAppBusinessMessage): UnifiedMessage {
    return {
      from: message.from,
      text: message.text,
      timestamp: message.timestamp,
      platform: 'whatsapp-business',
      messageId: message.messageId
    };
  }

  static fromWebChat(message: WebChatMessage): UnifiedMessage {
    return {
      from: message.from,
      text: message.text,
      timestamp: message.timestamp,
      platform: 'web',
      sessionId: message.sessionId,
      messageId: message.messageId
    };
  }

  static isWhatsAppPlatform(platform: string): boolean {
    return platform === 'whatsapp' || platform === 'whatsapp-business';
  }

  static isWebPlatform(platform: string): boolean {
    return platform === 'web';
  }

  static formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Add country code if missing
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }

  static getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'whatsapp':
      case 'whatsapp-business':
        return '📱';
      case 'web':
        return '🌐';
      default:
        return '💬';
    }
  }

  static getPlatformName(platform: string): string {
    switch (platform) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'whatsapp-business':
        return 'WhatsApp Business';
      case 'web':
        return 'Website';
      default:
        return 'Unknown';
    }
  }
} 