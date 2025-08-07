# 🔧 Environment Setup Guide

Complete guide to setting up API keys and environment variables for your AI WhatsApp bot.

> **⚡ Quick Setup**: See [Quick Start Guide](QUICK_START.md)  
> **🚀 Ready to deploy**: See [Deployment Guide](DEPLOYMENT.md)

## 📋 **Environment Variables Overview**

Your bot needs several API keys and configuration settings. Here's what each one does:

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `TOGETHER_API_KEY` | ✅ Yes | AI responses & embeddings | [Together AI](https://api.together.xyz) |
| `QDRANT_URL` | ✅ Yes | Vector database URL | [Qdrant Cloud](https://qdrant.tech/documentation/cloud/) |
| `QDRANT_API_KEY` | ✅ Yes | Vector database access | [Qdrant Cloud](https://qdrant.tech/documentation/cloud/) |
| `ADMIN_NUMBERS` | ✅ Yes | WhatsApp admin numbers | Your phone numbers |
| `PORT` | ❌ No | Server port (default: 3000) | Any available port |
| `USE_BAILEYS` | ❌ No | Use WhatsApp Web API | true/false |
| `WA_SESSION_NAME` | ❌ No | WhatsApp session folder | Any name |

## 🔑 **Getting API Keys**

### **1. Together AI API Key** (Required)

**Together AI** provides the AI models and embedding generation for your bot.

#### **Step 1: Sign Up**
1. Go to [Together AI](https://api.together.xyz)
2. Click **"Sign Up"** (free account available)
3. Verify your email address

#### **Step 2: Get API Key**
1. Go to [API Keys page](https://api.together.xyz/settings/api-keys)
2. Click **"Create new API key"**
3. Copy your API key (starts with `together_`)

#### **Step 3: Choose Model**
Popular models (free tier available):
- `meta-llama/Llama-2-7b-chat-hf` - Good balance of speed/quality
- `meta-llama/Llama-2-13b-chat-hf` - Better quality, slower
- `mistralai/Mixtral-8x7B-Instruct-v0.1` - Excellent quality

```bash
TOGETHER_API_KEY=together_your_api_key_here
TOGETHER_MODEL=meta-llama/Llama-2-7b-chat-hf
```

### **2. Qdrant Vector Database** (Required)

**Qdrant** stores your bot's knowledge and provides intelligent context search.

#### **Step 1: Create Account**
1. Go to [Qdrant Cloud](https://qdrant.tech/documentation/cloud/)
2. Click **"Get Started"** (free 1GB tier)
3. Sign up with GitHub or email

#### **Step 2: Create Cluster**
1. Click **"Create Cluster"**
2. Choose **"Free Tier"** (1GB storage)
3. Select region closest to you
4. Wait for cluster creation (2-3 minutes)

#### **Step 3: Get Connection Details**
1. Click on your cluster name
2. Copy the **Cluster URL** (e.g., `https://xyz.qdrant.tech`)
3. Go to **"API Keys"** tab
4. Create new API key and copy it

```bash
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=knowledge_base
```

### **3. Admin Phone Numbers** (Required)

**Admin numbers** can use `/` commands to control and train the bot.

#### **Format Requirements**
- Include country code (e.g., `+1` for US)
- No spaces or special characters except `+`
- Multiple numbers separated by commas

```bash
# Single admin
ADMIN_NUMBERS=+1234567890

# Multiple admins
ADMIN_NUMBERS=+1234567890,+44987654321,+91123456789
```

#### **How to Find Your WhatsApp Number**
1. Open WhatsApp on your phone
2. Go to **Settings** > **Profile**
3. Your number is displayed at the top
4. Add country code if missing

## 📄 **Complete .env File**

Create `.env` file in your project root:

```bash
# ===========================================
# AI WHATSAPP BOT CONFIGURATION
# ===========================================

# Server Configuration
PORT=3000
LOG_LEVEL=info

# Together AI Configuration (Required)
TOGETHER_API_KEY=together_your_api_key_here
TOGETHER_MODEL=meta-llama/Llama-2-7b-chat-hf

# Qdrant Vector Database Configuration (Required)
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=knowledge_base

# WhatsApp Configuration
USE_BAILEYS=true
USE_WHATSAPP_BUSINESS=false
WA_SESSION_NAME=wa-bot-session

# Admin Configuration (Required)
# Format: +countrycode+number (e.g., +1234567890)
ADMIN_NUMBERS=+1234567890,+0987654321

# Optional: WhatsApp Business API
# (Only needed if USE_WHATSAPP_BUSINESS=true)
WA_BUSINESS_ACCESS_TOKEN=your_whatsapp_business_token
WA_BUSINESS_PHONE_NUMBER_ID=your_phone_number_id
WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
WA_BUSINESS_API_VERSION=v18.0
```

## 🔒 **Security Best Practices**

### **Environment File Security**
```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Set proper file permissions
chmod 600 .env
```

### **API Key Security**
- ✅ **Never share** API keys publicly
- ✅ **Use environment variables** in production
- ✅ **Rotate keys** regularly
- ✅ **Monitor usage** for unusual activity
- ❌ **Never commit** `.env` files to git
- ❌ **Never hardcode** keys in source code

### **Production Environment**
For production deployment, use your platform's environment variable system:
- **Railway**: Environment variables tab
- **Render**: Environment variables section
- **Fly.io**: `fly secrets` command
- **Vercel**: Environment variables dashboard
- **Heroku**: Config vars

## 🧪 **Testing Your Configuration**

### **Test API Keys**
```bash
# Start the bot
npm run dev

# Look for these success messages:
[SUCCESS] Qdrant connection successful
[SUCCESS] Together AI connection successful
[INFO] WhatsApp client initialized
```

### **Test Admin Access**
1. Start the bot and scan QR code
2. From your admin number, send: `/status`
3. You should see system status information

### **Test File Processing**
1. Send `/file` command
2. Upload a PDF or DOCX file
3. Bot should process and confirm success

## 🌐 **Environment for Different Platforms**

### **Local Development**
```bash
# Use .env file
cp .env.example .env
# Edit with your keys
npm run dev
```

### **Railway**
```bash
# Set via Railway dashboard or CLI
railway variables set TOGETHER_API_KEY=your_key
railway variables set QDRANT_URL=your_url
railway variables set QDRANT_API_KEY=your_key
railway variables set ADMIN_NUMBERS=+1234567890
```

### **Render**
```bash
# Set in Render dashboard Environment tab
TOGETHER_API_KEY=your_key
QDRANT_URL=your_url
QDRANT_API_KEY=your_key
ADMIN_NUMBERS=+1234567890
```

### **Fly.io**
```bash
# Set via fly CLI
fly secrets set TOGETHER_API_KEY=your_key
fly secrets set QDRANT_URL=your_url
fly secrets set QDRANT_API_KEY=your_key
fly secrets set ADMIN_NUMBERS=+1234567890
```

## ❌ **Common Issues**

### **"Missing Together AI API key"**
- Check `TOGETHER_API_KEY` is set correctly
- Verify API key is valid (starts with `together_`)
- Check for extra spaces or quotes

### **"Qdrant connection failed"**
- Verify `QDRANT_URL` format: `https://your-cluster.qdrant.tech`
- Check `QDRANT_API_KEY` is correct
- Ensure cluster is running (not paused)

### **"Admin access required"**
- Check `ADMIN_NUMBERS` format: `+1234567890`
- Include country code
- No spaces in phone numbers
- Comma-separated for multiple numbers

### **"Port already in use"**
- Change `PORT=3001` in `.env`
- Or kill existing process: `pkill -f "npm run dev"`

## 🆘 **Need Help?**

- 📚 **[Setup Guide](SETUP_GUIDE.md)** - Complete installation guide
- 🐛 **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and fixes
- ⚡ **[Quick Start](QUICK_START.md)** - Get running in 5 minutes
- 💬 **[GitHub Issues](https://github.com/your-repo/issues)** - Report problems

---

**Next Steps:**
- ✅ **Environment configured?** → [Start the bot](QUICK_START.md#start-the-bot)
- 🚀 **Ready to deploy?** → [Deployment Guide](DEPLOYMENT.md)
- 📚 **Want to learn more?** → [Architecture Guide](ARCHITECTURE.md) 