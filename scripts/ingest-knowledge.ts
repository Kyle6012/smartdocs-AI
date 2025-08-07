import dotenv from 'dotenv';
import { TogetherAIService } from '../src/together';
import { QdrantService } from '../src/qdrant';
import { DocumentIngestionService } from '../src/document-ingestion';
import { logger } from '../src/utils';

dotenv.config();

async function main() {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error('Missing TOGETHER_API_KEY environment variable');
    }

    if (!process.env.QDRANT_URL) {
      throw new Error('Missing QDRANT_URL environment variable');
    }

    // Initialize services
    const togetherService = new TogetherAIService(process.env.TOGETHER_API_KEY);
    const collectionName = process.env.QDRANT_COLLECTION_NAME || 'knowledge_base';
    const qdrantService = new QdrantService(
      process.env.QDRANT_URL,
      process.env.QDRANT_API_KEY || '',
      collectionName
    );

    const ingestionService = new DocumentIngestionService(qdrantService, togetherService);

    // Test connections
    await qdrantService.testConnection();
    await qdrantService.ensureCollection();

    // Example: Ingest FAQ data
    const faqData = [
      {
        question: "What is this bot?",
        answer: "This is an AI WhatsApp bot powered by Together AI and Qdrant vector database. It can answer questions based on its knowledge base."
      },
      {
        question: "How do I use this bot?",
        answer: "Simply send a message to this WhatsApp number and the bot will respond with helpful information based on its training data."
      },
      {
        question: "What can you help me with?",
        answer: "I can help answer questions about topics in my knowledge base. Ask me anything and I'll search for relevant information to help you."
      }
    ];

    logger.info('Ingesting FAQ data...');
    await ingestionService.ingestFAQ(faqData);

    // Example: Ingest documents from a directory (if it exists)
    try {
      await ingestionService.ingestDirectory('./knowledge');
      logger.info('Ingested documents from ./knowledge directory');
    } catch (error) {
      logger.warn('No ./knowledge directory found or accessible');
    }

    // Example: Ingest custom documents
    const customDocuments = [
      {
        content: "This AI assistant is designed to be helpful, harmless, and honest. It will do its best to provide accurate information based on its training data.",
        metadata: { type: 'system_info', topic: 'ai_behavior' }
      },
      {
        content: "The bot uses vector similarity search to find relevant context from its knowledge base before generating responses.",
        metadata: { type: 'technical_info', topic: 'how_it_works' }
      }
    ];

    logger.info('Ingesting custom documents...');
    await ingestionService.ingestFromArray(customDocuments);

    // Get collection stats
    const stats = await ingestionService.getCollectionStats();
    logger.info('Collection stats:', stats);

    logger.success('Knowledge ingestion completed successfully!');
  } catch (error) {
    logger.error('Failed to ingest knowledge:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 