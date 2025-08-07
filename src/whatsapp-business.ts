import axios from 'axios';
import { logger } from './utils';

export interface WhatsAppBusinessMessage {
  from: string;
  text: string;
  timestamp: number;
  messageId: string;
}

export interface WhatsAppBusinessConfig {
  accessToken: string;
  phoneNumberId: string;
  webhookVerifyToken: string;
  apiVersion: string;
}

export class WhatsAppBusinessService {
  private config: WhatsAppBusinessConfig;
  private baseUrl: string;
  private onMessageCallback?: (message: WhatsAppBusinessMessage) => Promise<void>;

  constructor(config: WhatsAppBusinessConfig) {
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/v${config.apiVersion}`;
  }

  async sendMessage(to: string, text: string): Promise<boolean> {
    try {
      const cleanNumber = to.replace(/[^\d]/g, '');
      
      const response = await axios.post(
        `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: cleanNumber,
          type: 'text',
          text: { body: text }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        logger.info(`WhatsApp Business message sent to ${to}`);
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error('WhatsApp Business send error:', error.response?.data || error.message);
      return false;
    }
  }

  async sendTemplate(to: string, templateName: string, languageCode: string = 'en_US', parameters?: string[]): Promise<boolean> {
    try {
      const cleanNumber = to.replace(/[^\d]/g, '');
      
      const templateData: any = {
        messaging_product: 'whatsapp',
        to: cleanNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode }
        }
      };

      if (parameters && parameters.length > 0) {
        templateData.template.components = [{
          type: 'body',
          parameters: parameters.map(param => ({ type: 'text', text: param }))
        }];
      }

      const response = await axios.post(
        `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
        templateData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        logger.info(`WhatsApp Business template sent to ${to}`);
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error('WhatsApp Business template error:', error.response?.data || error.message);
      return false;
    }
  }

  handleWebhook(body: any): WhatsAppBusinessMessage[] {
    const messages: WhatsAppBusinessMessage[] = [];
    
    try {
      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              for (const message of change.value.messages || []) {
                if (message.type === 'text') {
                  messages.push({
                    from: message.from,
                    text: message.text.body,
                    timestamp: parseInt(message.timestamp) * 1000,
                    messageId: message.id
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      logger.error('Webhook parsing error:', error);
    }

    return messages;
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.webhookVerifyToken) {
      logger.info('WhatsApp Business webhook verified');
      return challenge;
    }
    logger.warn('WhatsApp Business webhook verification failed');
    return null;
  }

  onMessage(callback: (message: WhatsAppBusinessMessage) => Promise<void>): void {
    this.onMessageCallback = callback;
  }

  async processWebhookMessages(messages: WhatsAppBusinessMessage[]): Promise<void> {
    if (!this.onMessageCallback) return;

    for (const message of messages) {
      try {
        await this.onMessageCallback(message);
      } catch (error) {
        logger.error('Error processing WhatsApp Business message:', error);
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.config.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );

      if (response.status === 200) {
        logger.success('WhatsApp Business API connection successful');
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error('WhatsApp Business API connection failed:', error.response?.data || error.message);
      return false;
    }
  }

  async getPhoneNumberInfo(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.config.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get phone number info:', error);
      return null;
    }
  }
} 