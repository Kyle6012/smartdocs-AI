import { QdrantClient } from '@qdrant/js-client-rest';
import { logger } from './utils';

export interface SearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface Document {
  content: string;
  metadata?: Record<string, any>;
}

export class QdrantService {
  private client: QdrantClient;
  private collectionName: string;
  private embeddingDimension: number;

  constructor(url: string, apiKey: string, collectionName: string = 'knowledge_base') {
    this.client = new QdrantClient({
      url,
      apiKey
    });
    this.collectionName = collectionName;
    this.embeddingDimension = 768; // m2-bert embedding dimension
  }

  async searchSimilar(query: string, generateEmbedding: (text: string) => Promise<number[]>, limit: number = 5): Promise<SearchResult[]> {
    try {
      const queryVector = await generateEmbedding(query);
      
      const searchResult = await this.client.search(this.collectionName, {
        vector: queryVector,
        limit,
        with_payload: true
      });

      return searchResult.map((result: any) => ({
        content: result.payload?.content as string || '',
        score: result.score,
        metadata: result.payload
      }));
    } catch (error) {
      logger.error('Failed to search in Qdrant:', error);
      return [];
    }
  }

  async ensureCollection(): Promise<boolean> {
    try {
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections.some(
        (collection: any) => collection.name === this.collectionName
      );

      if (!collectionExists) {
        logger.info(`Creating collection: ${this.collectionName}`);
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: this.embeddingDimension,
            distance: 'Cosine'
          }
        });
        logger.success(`Collection ${this.collectionName} created successfully`);
      } else {
        logger.info(`Collection ${this.collectionName} already exists`);
      }

      return true;
    } catch (error) {
      logger.error('Failed to ensure collection:', error);
      return false;
    }
  }

  async addDocuments(documents: Document[], generateEmbedding: (text: string) => Promise<number[]>): Promise<boolean> {
    try {
      await this.ensureCollection();

      const points = [];
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const embedding = await generateEmbedding(doc.content);
        
        points.push({
          id: Date.now() + i,
          vector: embedding,
          payload: {
            content: doc.content,
            ...doc.metadata
          }
        });
      }

      await this.client.upsert(this.collectionName, {
        points
      });

      logger.success(`Added ${documents.length} documents to ${this.collectionName}`);
      return true;
    } catch (error) {
      logger.error('Failed to add documents:', error);
      return false;
    }
  }

  async getCollectionInfo(): Promise<any> {
    try {
      const info = await this.client.getCollection(this.collectionName);
      return info;
    } catch (error) {
      logger.error('Failed to get collection info:', error);
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.getCollections();
      logger.success('Qdrant connection successful');
      return true;
    } catch (error) {
      logger.error('Qdrant connection failed:', error);
      return false;
    }
  }
} 