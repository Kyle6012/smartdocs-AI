import axios from 'axios';
import { logger } from './utils';

export interface TogetherAIResponse {
  message: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class TogetherAIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private embeddingModel: string;
  private systemPrompt: string;

  constructor(apiKey: string, model: string = 'meta-llama/Llama-2-70b-chat-hf', embeddingModel: string = 'BAAI/bge-base-en-v1.5') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.together.xyz/v1';
    this.model = model;
    this.embeddingModel = embeddingModel;
    this.systemPrompt = `You are a helpful AI assistant. Use the provided context to answer questions accurately and helpfully. If the context doesn't contain relevant information, say so and provide a general helpful response.`;
  }

  async chat(message: string, context?: string): Promise<string> {
    try {
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        }
      ];

      if (context) {
        messages.push({
          role: 'system',
          content: `Context: ${context}`
        });
      }

      messages.push({
        role: 'user',
        content: message
      });

      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data?.choices?.[0]?.message?.content) {
        const aiResponse = response.data.choices[0].message.content.trim();
        logger.info(`Together AI response generated using ${this.model}`);
        return aiResponse;
      }

      logger.warn('Unexpected Together AI response format:', response.data);
      return 'Sorry, I could not process your request at the moment.';
    } catch (error: any) {
      logger.error('Together AI API error:', error.message);
      if (error.response) {
        logger.error('API Response Status:', error.response.status);
        logger.error('API Response Data:', error.response.data);
      }
      
      if (error.response?.status === 401) {
        return 'Authentication failed. Please check your Together AI API key.';
      }
      
      if (error.response?.status === 429) {
        return 'Rate limit exceeded. Please try again later.';
      }
      
      if (error.response?.status === 400) {
        const errorDetail = error.response.data?.error?.message || 'No additional details provided.';
        return `Invalid request. Please check your model configuration. Details: ${errorDetail}`;
      }
      
      return 'Sorry, I encountered an error while processing your request.';
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/embeddings`, {
        model: this.embeddingModel,
        input: text,
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data?.data?.[0]?.embedding) {
        logger.info(`Embedding generated using ${this.embeddingModel}`);
        return response.data.data[0].embedding;
      }

      logger.warn('Unexpected Together AI embedding response format:', response.data);
      throw new Error('Invalid embedding response format');
    } catch (error: any) {
      logger.error('Together AI embedding API error:', error.message);
      if (error.response) {
        logger.error('API Response Status:', error.response.status);
        logger.error('API Response Data:', error.response.data);
      }
      throw error;
    }
  }

  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    logger.info('System prompt updated');
  }

  setModel(model: string): void {
    this.model = model;
    logger.info(`Model changed to: ${model}`);
  }

  async testConnection(): Promise<{ success: boolean, message: string }> {
    try {
      const testMessage = 'Hello, this is a test message.';
      const response = await this.chat(testMessage);
      
      if (response && !response.includes('error') && !response.includes('Authentication failed') && !response.includes('Invalid request')) {
        logger.success('Together AI connection successful');
        return { success: true, message: 'Connection successful' };
      }
      
      logger.error(`Together AI connection test failed. Response: ${response}`);
      return { success: false, message: response };
    } catch (error: any) {
      logger.error('Together AI connection test failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // Available models for different use cases
  static getAvailableModels() {
    return {
      // Most capable models
      'meta-llama/Llama-2-70b-chat-hf': 'Llama 2 70B - Most capable',
      'meta-llama/Llama-2-13b-chat-hf': 'Llama 2 13B - Good balance',
      'meta-llama/Llama-2-7b-chat-hf': 'Llama 2 7B - Fastest',
      
      // Code-specialized models
      'codellama/CodeLlama-34b-Instruct-hf': 'Code Llama 34B - Best for code',
      'codellama/CodeLlama-13b-Instruct-hf': 'Code Llama 13B - Code tasks',
      
      // Other options
      'mistralai/Mixtral-8x7B-Instruct-v0.1': 'Mixtral 8x7B - High quality',
      'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO': 'Nous Hermes 2 - Creative',
      'teknium/OpenHermes-2.5-Mistral-7B': 'OpenHermes 2.5 - Fast and good'
    };
  }
} 