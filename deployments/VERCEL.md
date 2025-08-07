# 📦 Vercel Deployment Guide

Deploy your AI WhatsApp bot to **Vercel** with generous free hobby plan. Vercel excels at serverless functions and edge computing.

> **🔙 Back to**: [Deployment Guide](../DEPLOYMENT.md)  
> **⚡ Quick Setup**: [Quick Start Guide](../QUICK_START.md)

## 🎯 **Why Vercel?**

- ✅ **Free hobby plan** with generous limits
- ✅ **Serverless functions** - automatic scaling
- ✅ **Edge network** - global performance
- ✅ **GitHub integration** - automatic deployments
- ✅ **Custom domains** with SSL
- ✅ **Environment variables** management
- ✅ **Real-time analytics** and monitoring

## 💰 **Free Tier Details**

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **Bandwidth** | 100GB/month | Generous bandwidth |
| **Functions** | 12 serverless functions | More than enough |
| **Executions** | 1M/month | High execution limit |
| **Duration** | 10s per function | Suitable for most operations |
| **Domains** | Unlimited | Custom domains included |
| **Team Members** | 3 | Small team collaboration |

**Perfect for**: Serverless WhatsApp bots with moderate to high traffic.

## ⚠️ **Important Considerations**

### **Serverless Limitations**
```bash
# WhatsApp persistent connections
- Baileys requires persistent WebSocket connections
- Serverless functions are stateless
- Session persistence needs external storage

# Recommended approach:
1. Use WhatsApp Business API (webhook-based)
2. Or hybrid approach with external session storage
```

### **Function Timeout**
```bash
# 10-second execution limit
- File processing must be optimized
- Large PDF/DOCX files may timeout
- Consider async processing for large files
```

## 🚀 **Step-by-Step Deployment**

### **Step 1: Adapt Code for Serverless**

#### **Create Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **Restructure for API Routes**
```bash
# Create API directory structure
mkdir -p api

# Move main logic to API routes
api/
├── index.ts          # Main entry point
├── webhook.ts        # WhatsApp webhook handler
├── chat.ts          # Chat API endpoint
├── health.ts        # Health check
└── widget.ts        # Web widget
```

#### **API Route Example**
```typescript
// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleWebhook } from '../src/whatsapp-business';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'GET') {
    return res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  }
  
  if (req.method === 'POST') {
    try {
      await handleWebhook(req.body);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

### **Step 2: Install Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Or use npx (no global install)
npx vercel --version
```

### **Step 3: Create Vercel Account**

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access repositories
5. Verify your email address

### **Step 4: Login and Initialize**

```bash
# Login to Vercel
vercel login

# Initialize project
vercel

# Follow the prompts:
# ? Set up and deploy "~/projects/wa-agent"? [Y/n] Y
# ? Which scope do you want to deploy to? [your-username]
# ? Link to existing project? [y/N] N
# ? What's your project's name? ai-whatsapp-bot
# ? In which directory is your code located? ./
```

### **Step 5: Configure Environment Variables**

#### **Via Vercel CLI**
```bash
# Add environment variables
vercel env add TOGETHER_API_KEY
# Enter value: your_together_ai_key_here

vercel env add QDRANT_URL  
# Enter value: https://your-cluster.qdrant.tech

vercel env add QDRANT_API_KEY
# Enter value: your_qdrant_api_key_here

vercel env add ADMIN_NUMBERS
# Enter value: +1234567890,+0987654321

vercel env add USE_WHATSAPP_BUSINESS
# Enter value: true

vercel env add WA_BUSINESS_ACCESS_TOKEN
# Enter value: your_whatsapp_business_token
```

#### **Via Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **"Settings"** > **"Environment Variables"**
4. Add variables for all environments (Production, Preview, Development)

### **Step 6: Deploy**

```bash
# Deploy to production
vercel --prod

# Or deploy with automatic settings
vercel deploy

# Watch deployment progress
# Vercel will show deployment URL when complete
```

### **Step 7: Configure WhatsApp Business API**

Since Vercel is serverless, use WhatsApp Business API:

#### **Webhook Configuration**
```bash
# Set webhook URL to your Vercel deployment
Webhook URL: https://your-app.vercel.app/api/webhook

# Verify token in environment variables
WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

#### **WhatsApp Business Setup**
```bash
# Required environment variables
WA_BUSINESS_ACCESS_TOKEN=your_access_token
WA_BUSINESS_PHONE_NUMBER_ID=your_phone_id
WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_verify_token
WA_BUSINESS_API_VERSION=v18.0
```

### **Step 8: Test Deployment**

#### **Test Endpoints**
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Webhook verification
curl "https://your-app.vercel.app/api/webhook?hub.verify_token=your_token&hub.challenge=test"

# Chat API
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello bot"}'
```

#### **Test WhatsApp Integration**
```bash
# Send message to your WhatsApp Business number
# Check Vercel function logs for processing
```

## 🔧 **Advanced Configuration**

### **Custom Domain Setup**

#### **Via Vercel Dashboard**
1. **Project Settings**: Go to project dashboard
2. **Domains**: Click "Domains" tab
3. **Add Domain**: Enter your domain
4. **DNS Configuration**: Add required records:
   ```
   CNAME www your-app.vercel.app
   A @ 76.76.19.61
   ```

#### **SSL Certificate**
- Vercel automatically provides SSL certificates
- Custom domains get automatic HTTPS
- Certificate renewal is automatic

### **Function Configuration**

#### **Optimize Function Performance**
```typescript
// api/chat.ts - Optimized for serverless
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Process chat message
    const response = await processChatMessage(req.body);
    return res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### **Environment-Specific Configuration**
```json
// vercel.json
{
  "functions": {
    "api/chat.ts": {
      "maxDuration": 10
    },
    "api/webhook.ts": {
      "maxDuration": 5
    }
  },
  "regions": ["iad1", "sfo1"]
}
```

### **Database Integration**

#### **Vercel KV (Redis-compatible)**
```bash
# Add Vercel KV for session storage
vercel integrate

# Choose Vercel KV
# Environment variables automatically added:
# KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN
```

#### **External Database**
```typescript
// Use external databases for persistence
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});
```

### **Monitoring and Analytics**

#### **Vercel Analytics**
```bash
# Enable analytics in dashboard
# View function performance
# Monitor error rates
# Track response times
```

#### **Custom Logging**
```typescript
// Enhanced logging for serverless
export default async function handler(req, res) {
  console.log('Function invoked:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  try {
    // Your logic here
  } catch (error) {
    console.error('Function error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
```

## 📊 **Performance Optimization**

### **Function Optimization**

#### **Cold Start Mitigation**
```typescript
// Keep connections warm
let qdrantClient;
let togetherClient;

export default async function handler(req, res) {
  // Reuse connections across invocations
  if (!qdrantClient) {
    qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  // Your logic here
}
```

#### **Response Optimization**
```typescript
// Optimize response times
export default async function handler(req, res) {
  // Early return for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Stream responses for large data
  res.setHeader('Content-Type', 'application/json');
  
  // Process and respond quickly
  const result = await processRequest(req.body);
  return res.json(result);
}
```

### **Resource Management**

#### **Memory Optimization**
```typescript
// Efficient memory usage
export default async function handler(req, res) {
  try {
    // Process request
    const result = await processRequest(req.body);
    return res.json(result);
  } finally {
    // Cleanup if needed
    // Memory is automatically cleaned between invocations
  }
}
```

#### **Timeout Handling**
```typescript
// Handle 10-second timeout
export default async function handler(req, res) {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Request timeout' });
    }
  }, 9000); // 9 seconds to be safe

  try {
    const result = await processRequest(req.body);
    clearTimeout(timeout);
    
    if (!res.headersSent) {
      return res.json(result);
    }
  } catch (error) {
    clearTimeout(timeout);
    
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
}
```

## 🐛 **Troubleshooting**

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common issues:

# 1. TypeScript errors
npm run build  # Test locally first

# 2. Missing dependencies
npm install --save @vercel/node

# 3. Incorrect file structure
# API routes must be in /api directory
```

#### **Function Errors**
```bash
# Check function logs in Vercel dashboard
# Look for:

# 1. Import errors
# 2. Environment variable issues
# 3. Timeout errors
# 4. Memory issues
```

### **WhatsApp Integration Issues**

#### **Webhook Verification Failed**
```bash
# Check webhook URL format
https://your-app.vercel.app/api/webhook

# Verify environment variables
WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_token

# Test webhook verification
curl "https://your-app.vercel.app/api/webhook?hub.verify_token=your_token&hub.challenge=test"
```

#### **Message Processing Errors**
```bash
# Check function logs for errors
# Common issues:
1. Timeout (>10 seconds)
2. Memory limits
3. API connection issues
4. Invalid message format
```

### **Performance Issues**

#### **Cold Starts**
```bash
# Function takes time to start
# Solutions:
1. Keep connections warm
2. Optimize imports
3. Use Vercel Pro for faster cold starts
4. Implement connection pooling
```

#### **Timeout Issues**
```bash
# Function exceeds 10-second limit
# Solutions:
1. Optimize processing logic
2. Use async processing
3. Split large operations
4. Use external workers for heavy tasks
```

## 💰 **Cost Management**

### **Free Tier Monitoring**

```bash
# Monitor usage in Vercel dashboard:
- Function executions
- Bandwidth usage
- Build minutes
- Team member count

# Typical bot usage:
Small bot: ~10K-50K executions/month
Medium bot: ~100K-500K executions/month
Large bot: May exceed free tier
```

### **Optimization Strategies**

```bash
# Stay within free limits:
1. Optimize function efficiency
2. Implement caching
3. Use webhooks efficiently
4. Monitor execution count
```

### **Upgrade Considerations**

Upgrade to Pro when:
- Exceeding 1M executions/month
- Need faster cold starts
- Require advanced analytics
- Need priority support

## 🔄 **CI/CD and Development**

### **Automatic Deployments**

```bash
# GitHub integration
- Push to main → Deploy to production
- Push to other branches → Deploy previews
- Pull requests → Preview deployments
```

### **Development Workflow**

```bash
# 1. Develop locally
vercel dev  # Local development server

# 2. Test functions
npm run build
vercel dev

# 3. Deploy preview
git push origin feature-branch
# Vercel creates preview deployment

# 4. Deploy production
git push origin main
# Automatic production deployment
```

### **Environment Management**

```bash
# Different environments
Production: main branch
Preview: feature branches
Development: Local with vercel dev

# Environment-specific variables
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview
vercel env add VARIABLE_NAME development
```

## 📚 **Best Practices**

### **Serverless Best Practices**
```bash
# Function design
- Keep functions small and focused
- Minimize cold start time
- Use connection pooling
- Implement proper error handling
```

### **Security**
```bash
# Environment variables
- Use Vercel's environment variables
- Never commit secrets
- Rotate API keys regularly
- Implement rate limiting
```

### **Performance**
```bash
# Optimization
- Cache responses when possible
- Use efficient algorithms
- Minimize external API calls
- Implement proper logging
```

## 🎯 **Next Steps**

After successful Vercel deployment:

1. **Test All Functions**:
   - Webhook verification
   - Message processing
   - File upload handling
   - Admin commands

2. **Set Up Monitoring**:
   - Enable Vercel Analytics
   - Monitor function performance
   - Set up error tracking

3. **Configure Custom Domain** (Optional):
   - Add your domain
   - Configure DNS records
   - Test SSL certificate

4. **Optimize Performance**:
   - Monitor cold starts
   - Optimize function execution
   - Implement caching strategies

## 📚 **Related Guides**

- 🔧 **[Environment Setup](../ENVIRONMENT.md)** - API keys and configuration
- 📱 **[WhatsApp Business API](../WHATSAPP_BUSINESS.md)** - Official API setup
- 🎓 **[User Training Guide](../USER_TRAINING_GUIDE.md)** - Train your AI
- 🐛 **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and fixes
- 🚂 **[Railway Alternative](RAILWAY.md)** - Compare with Railway

---

**🎉 Congratulations!** Your AI WhatsApp bot is now running on Vercel's global edge network with serverless functions, automatic scaling, and generous free tier limits! 🤖✨

**Note**: For persistent WhatsApp connections, consider using WhatsApp Business API or hybrid approaches with external session storage.

**Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) or create an issue on GitHub. 