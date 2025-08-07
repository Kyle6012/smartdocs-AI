import { promises as fs } from 'fs';
import path from 'path';
import { QdrantService, Document } from './qdrant';
import { TogetherAIService } from './together';
import { logger } from './utils';

export class DocumentIngestionService {
  private qdrantService: QdrantService;
  private togetherService: TogetherAIService;

  constructor(qdrantService: QdrantService, togetherService: TogetherAIService) {
    this.qdrantService = qdrantService;
    this.togetherService = togetherService;
  }

  async ingestTextFile(filePath: string, chunkSize: number = 1000): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const chunks = this.splitIntoChunks(content, chunkSize);
      
      const documents: Document[] = chunks.map((chunk, index) => ({
        content: chunk,
        metadata: {
          source: path.basename(filePath),
          chunk_index: index,
          total_chunks: chunks.length,
          file_path: filePath
        }
      }));

      return await this.qdrantService.addDocuments(
        documents, 
        this.togetherService.generateEmbedding.bind(this.togetherService)
      );
    } catch (error) {
      logger.error(`Failed to ingest file ${filePath}:`, error);
      return false;
    }
  }

  async ingestDirectory(dirPath: string, chunkSize: number = 1000): Promise<boolean> {
    try {
      const files = await fs.readdir(dirPath);
      const textFiles = files.filter(file => 
        file.endsWith('.txt') || 
        file.endsWith('.md') || 
        file.endsWith('.json')
      );

      let allSuccessful = true;
      for (const file of textFiles) {
        const filePath = path.join(dirPath, file);
        const success = await this.ingestTextFile(filePath, chunkSize);
        if (!success) allSuccessful = false;
      }

      logger.info(`Processed ${textFiles.length} files from ${dirPath}`);
      return allSuccessful;
    } catch (error) {
      logger.error(`Failed to ingest directory ${dirPath}:`, error);
      return false;
    }
  }

  async ingestFromArray(documents: Document[]): Promise<boolean> {
    try {
      return await this.qdrantService.addDocuments(
        documents,
        this.togetherService.generateEmbedding.bind(this.togetherService)
      );
    } catch (error) {
      logger.error('Failed to ingest documents from array:', error);
      return false;
    }
  }

  async ingestFAQ(faqData: Array<{question: string, answer: string}>): Promise<boolean> {
    try {
      const documents: Document[] = faqData.map((faq, index) => ({
        content: `Q: ${faq.question}\nA: ${faq.answer}`,
        metadata: {
          type: 'faq',
          question: faq.question,
          answer: faq.answer,
          index
        }
      }));

      return await this.ingestFromArray(documents);
    } catch (error) {
      logger.error('Failed to ingest FAQ data:', error);
      return false;
    }
  }

  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = trimmedSentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  async getCollectionStats(): Promise<any> {
    return await this.qdrantService.getCollectionInfo();
  }
}

// Example usage function
export async function setupKnowledgeBase(
  qdrantService: QdrantService, 
  togetherService: TogetherAIService
): Promise<void> {
  const ingestionService = new DocumentIngestionService(qdrantService, togetherService);

  // Example: Add some default knowledge
  const defaultKnowledge = [
    {
      content: "This is an AI WhatsApp bot powered by Together AI and Qdrant vector database. It can answer questions based on the knowledge that has been provided to it.",
      metadata: { type: 'system_info' }
    },
    {
      content: "To get help, you can ask questions and the bot will search its knowledge base to provide relevant answers.",
      metadata: { type: 'usage_info' }
    }
  ];

  await ingestionService.ingestFromArray(defaultKnowledge);
  
  // You can add more knowledge by:
  // 1. Adding text files to a 'knowledge' directory
  // 2. Calling ingestionService.ingestDirectory('./knowledge')
  // 3. Adding FAQ data with ingestionService.ingestFAQ(faqArray)
  
  logger.info('Knowledge base setup completed');
} 