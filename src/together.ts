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
  private systemPrompt: string;

  constructor(apiKey: string, model: string = 'meta-llama/Llama-2-70b-chat-hf') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.together.xyz/v1';
    this.model = model;
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
      
      if (error.response?.status === 401) {
        return 'Authentication failed. Please check your Together AI API key.';
      }
      
      if (error.response?.status === 429) {
        return 'Rate limit exceeded. Please try again later.';
      }
      
      if (error.response?.status === 400) {
        return 'Invalid request. Please try rephrasing your message.';
      }
      
      return 'Sorry, I encountered an error while processing your request.';
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use a simple fallback embedding for now since Together AI embeddings endpoint changed
      // In production, you'd use a proper embedding service
      logger.info('Generating fallback embedding (768-dim)');
      
      // Create a simple hash-based embedding as fallback
      const hash = this.simpleHash(text);
      const embedding = new Array(768).fill(0);
      
      // Fill embedding with deterministic values based on text hash
      for (let i = 0; i < 768; i++) {
        embedding[i] = Math.sin(hash + i) * 0.1;
      }
      
      return embedding;
    } catch (error) {
      logger.error('Failed to generate embedding:', error);
      return new Array(768).fill(0);
    }
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    logger.info('System prompt updated');
  }

  setModel(model: string): void {
    this.model = model;
    logger.info(`Model changed to: ${model}`);
  }

  async testConnection(): Promise<boolean> {
    try {
      const testMessage = 'Hello, this is a test message.';
      const response = await this.chat(testMessage);
      
      if (response && !response.includes('error') && !response.includes('Authentication failed')) {
        logger.success('Together AI connection successful');
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Together AI connection test failed:', error);
      return false;
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