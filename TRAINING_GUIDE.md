# 🎯 Training Guide: How to Train Your WhatsApp AI Bot

## Overview

Your bot learns from training data using **vector embeddings** and **semantic search**. Here's how it works:

1. **Input**: You provide content (text, FAQs, documents)
2. **Processing**: Content is chunked and converted to vector embeddings
3. **Storage**: Vectors are stored in Qdrant database
4. **Retrieval**: When users ask questions, similar content is found and used as context
5. **Response**: Together AI generates responses using your custom context

## 🚀 Training Methods

### Method 1: Quick Start with Built-in Script

```bash
npm run ingest
```

This runs the default training script with example FAQ data and system information.

### Method 2: File-Based Training

**Step 1: Create knowledge directory**
```bash
mkdir knowledge
```

**Step 2: Add your files**
- `knowledge/faq.txt` - Questions and answers
- `knowledge/company-info.md` - Company details  
- `knowledge/policies.txt` - Policies and procedures
- `knowledge/products.json` - Product information

**Step 3: Run ingestion**
```bash
npm run ingest
```

### Method 3: Custom Training Script

Edit `scripts/ingest-knowledge.ts` to add your specific data:

```typescript
// Example: Customer service FAQ
const customerServiceFAQ = [
  {
    question: "How do I return an item?",
    answer: "Returns are accepted within 30 days with original receipt..."
  },
  {
    question: "What's your shipping policy?", 
    answer: "We offer free shipping on orders over $50..."
  }
];

await ingestionService.ingestFAQ(customerServiceFAQ);

// Example: Company policies
const policies = [
  {
    content: "Our privacy policy ensures customer data is protected...",
    metadata: { type: 'policy', category: 'privacy' }
  },
  {
    content: "Refund processing takes 3-5 business days...",
    metadata: { type: 'policy', category: 'refunds' }
  }
];

await ingestionService.ingestFromArray(policies);
```

## 📄 Supported Content Types

### 1. FAQ Format
```
Q: What are your business hours?
A: We're open Monday-Friday 9AM-5PM EST.

Q: How can I contact support?
A: Email us at support@company.com or call (555) 123-4567.
```

### 2. Markdown Documents
```markdown
# Product Information

## Premium Plan Features
- Unlimited API calls
- 24/7 support  
- Custom integrations
- Advanced analytics

## Pricing
$99/month for the Premium plan
```

### 3. JSON Data
```json
{
  "products": [
    {
      "name": "Basic Plan",
      "price": "$29/month",
      "features": ["10,000 API calls", "Email support"]
    }
  ]
}
```

### 4. Plain Text
```
Our company was founded in 2020 with the mission to democratize AI technology for small businesses. We believe every business should have access to powerful AI tools.
```

## 🔧 How the Training Process Works

### Step 1: Content Ingestion
```typescript
// Document is received
const document = {
  content: "Your business information here...",
  metadata: { type: 'company_info', category: 'about' }
};
```

### Step 2: Text Chunking
```typescript
// Long text is split into chunks (~1000 characters)
const chunks = [
  "Your business information here. We specialize in...",
  "Our services include web development, mobile apps...",
  "Contact us at info@company.com for more details..."
];
```

### Step 3: Embedding Generation
```typescript
// Each chunk becomes a 768-dimension vector
const embedding = await togetherAI.generateEmbedding(chunk);
// Result: [0.1, -0.3, 0.7, ...] (768 numbers)
```

### Step 4: Vector Storage
```typescript
// Stored in Qdrant with metadata
{
  id: 12345,
  vector: [0.1, -0.3, 0.7, ...],
  payload: {
    content: "Original text chunk",
    type: "company_info",
    category: "about"
  }
}
```

### Step 5: Query Time Retrieval
```typescript
// User asks: "What services do you offer?"
// 1. Convert question to embedding
// 2. Search similar vectors in Qdrant  
// 3. Retrieve top 3 most similar chunks
// 4. Use as context for AI response
```

## 📊 Training Data Best Practices

### ✅ Good Training Data
- **Specific**: "We offer web development starting at $5,000"
- **Complete**: Include context and details
- **Conversational**: Write as you'd speak to customers
- **Categorized**: Use metadata to organize content

### ❌ Poor Training Data
- **Vague**: "We offer various services"
- **Incomplete**: Missing important details
- **Technical jargon**: Without explanations
- **Unorganized**: No clear structure

## 🎯 Training Examples for Different Use Cases

### Customer Support Bot
```typescript
const supportData = [
  {
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page, enter your email, and check your inbox for reset instructions."
  },
  {
    question: "Why is my account locked?",
    answer: "Accounts are locked after 5 failed login attempts. Wait 30 minutes or contact support to unlock immediately."
  }
];
```

### E-commerce Bot
```typescript
const productData = [
  {
    content: "iPhone 15 Pro - $999 - Features: A17 Pro chip, titanium design, 48MP camera system. Available in Natural Titanium, Blue Titanium, White Titanium, Black Titanium.",
    metadata: { type: 'product', category: 'phones', brand: 'apple' }
  }
];
```

### Restaurant Bot
```typescript
const restaurantData = [
  {
    question: "What are your hours?",
    answer: "We're open Tuesday-Sunday 5PM-10PM. Closed Mondays. Kitchen stops taking orders at 9:30PM."
  },
  {
    question: "Do you take reservations?",
    answer: "Yes! Call (555) 123-4567 or book online. We recommend reservations for parties of 4+."
  }
];
```

## 🔍 Testing Your Training

### Check Collection Stats
```bash
# The ingestion script shows collection info
npm run ingest
# Look for: "Collection stats: { points_count: 25, ... }"
```

### Test with Sample Questions
Once trained, test by messaging your WhatsApp bot:
- "What services do you offer?"
- "What are your business hours?"  
- "How can I contact you?"

### Monitor Context Retrieval
Check the logs to see what context is being retrieved:
```
[INFO] Found 3 context results
[INFO] Processing message from +1234567890: what are your hours
```

## 🔄 Updating Training Data

### Add New Content
1. Add new files to `knowledge/` directory
2. Run `npm run ingest` again
3. New content is added to existing collection

### Replace All Content
1. Delete and recreate collection in Qdrant dashboard
2. Run `npm run ingest` with new data

### Continuous Training
Set up a cron job or webhook to automatically ingest new content from your CMS, database, or files.

## 🚨 Troubleshooting

### "No relevant context found"
- Add more training data covering the topic
- Use keywords that users are likely to ask about
- Check if embeddings are being generated correctly

### "Responses not accurate"
- Improve training data quality
- Add more specific examples
- Use better metadata categorization

### "Slow responses"
- Reduce chunk size in ingestion
- Limit similarity search results
- Consider using a faster Together AI model

## 📈 Advanced Training Tips

### 1. Use Metadata Strategically
```typescript
{
  content: "Premium support includes 24/7 phone support...",
  metadata: { 
    type: 'support', 
    plan: 'premium',
    priority: 'high',
    keywords: ['24/7', 'phone', 'premium', 'urgent']
  }
}
```

### 2. Create Topic-Specific Collections
- `customer_support` collection
- `product_info` collection  
- `company_policies` collection

### 3. Regular Training Updates
- Weekly: Add new FAQ items
- Monthly: Review and update existing content
- Quarterly: Analyze common questions and add missing topics

The key to great AI responses is **high-quality, comprehensive training data**! 🎯 