# 🚀 Complete Setup Guide

## 🎯 **What You Get**

✅ **WhatsApp AI Bot** (2 options: Free Baileys or Paid Business API)  
✅ **Website Chat Widget** (Embeddable on any website)  
✅ **Admin Command System** (Powerful `/` prefix commands for control)  
✅ **Normal User Experience** (Regular users chat naturally)  
✅ **Session Management** (Admin cleanup and system tools)  
✅ **Unified Training** (Train once, works everywhere)  
✅ **Admin Controls** (Train via WhatsApp chat)  
✅ **Advanced AI** (Together AI with Llama 2, Mixtral, etc.)  
✅ **Vector Search** (Qdrant for context-aware responses)  

## 📋 **Prerequisites**

1. **Node.js 18+** installed
2. **Together AI account** (for AI responses & embeddings)
3. **Qdrant database** (Aiven Cloud or self-hosted)
4. **WhatsApp setup** (choose one):
   - Option A: WhatsApp number for Baileys (free)
   - Option B: WhatsApp Business API account (paid)

## ⚡ **Quick Start**

### 1. **Clone & Install**
```bash
git clone <your-repo>
cd wa-agent
npm install
```

### 2. **Environment Setup**
```bash
cp env.example .env
# Edit .env with your API keys (see below)
```

### 3. **Choose WhatsApp Method**

#### **Option A: Baileys (Free, Easy)**
```bash
# In .env file:
USE_BAILEYS=true
USE_WHATSAPP_BUSINESS=false
WA_SESSION_NAME=wa-bot-session
```

#### **Option B: WhatsApp Business API (Paid, Professional)**
```bash
# In .env file:
USE_BAILEYS=false
USE_WHATSAPP_BUSINESS=true
WA_BUSINESS_ACCESS_TOKEN=your_token_here
WA_BUSINESS_PHONE_NUMBER_ID=your_phone_id_here
WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_verify_token_here
```

### 4. **Required API Keys**
```bash
# Together AI (Required)
TOGETHER_API_KEY=your_together_ai_key_here

# Qdrant (Required)
QDRANT_URL=https://your-cluster.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_key_here

# Admin Numbers
ADMIN_NUMBERS=+1234567890,+9876543210
```

### 5. **Start the Bot**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔧 **Detailed Setup**

### **Together AI Setup**
1. Go to [together.ai](https://together.ai)
2. Create account and get API key
3. Add to `.env`: `TOGETHER_API_KEY=your_key`

### **Qdrant Setup (Aiven Cloud)**
1. Go to [aiven.io](https://aiven.io)
2. Create Qdrant service
3. Get connection URL and API key
4. Add to `.env`:
   ```
   QDRANT_URL=https://your-cluster.aws.cloud.qdrant.io:6333
   QDRANT_API_KEY=your_key
   ```

### **WhatsApp Business API Setup**
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create app and add WhatsApp product
3. Get phone number ID and access token
4. Set webhook URL: `https://yourdomain.com/webhook/whatsapp`
5. Add to `.env`:
   ```
   WA_BUSINESS_ACCESS_TOKEN=your_token
   WA_BUSINESS_PHONE_NUMBER_ID=123456789
   WA_BUSINESS_WEBHOOK_VERIFY_TOKEN=your_verify_token
   ```

## 🌐 **Web Widget Setup**

### **Generate Widget Code**
1. Send `/menu` to your WhatsApp bot (as admin)
2. Choose option `5` (Generate Website Widget)
3. Follow prompts to customize
4. Copy the generated HTML code

### **Add to Website**
```html
<!-- Paste before closing </body> tag -->
<script>
  (function() {
    var chatConfig = {"botName":"Your Bot","primaryColor":"#2563eb"};
    // ... rest of generated code
  })();
</script>
```

### **Widget Features**
- 📱 **Mobile responsive**
- 🎨 **Customizable colors & branding**
- 💬 **Real-time chat**
- 🧠 **Same AI brain as WhatsApp**
- ⚡ **Instant responses**

## 🎓 **Training Your AI**

### **Via WhatsApp (Easy!)**
1. Send `/menu` to your bot
2. Choose training option:
   - `1` = Add FAQ (question & answer)
   - `2` = Add company info
   - `3` = Upload documents
   - `4` = Bulk training

### **Example Training Session**
```
You: /menu
Bot: [Shows menu]
You: 1
Bot: What question do customers ask?
You: What are your business hours?
Bot: What's the answer?
You: We're open Monday-Friday 9AM-5PM EST
Bot: Ready to train? Type YES
You: YES
Bot: 🎉 Training successful!
```

## 🚀 **Deployment**

### **Railway**
1. Connect GitHub repo to Railway
2. Add environment variables in dashboard
3. Deploy automatically

### **Render**
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

### **Fly.io**
```bash
flyctl launch
flyctl secrets set TOGETHER_API_KEY=your_key
flyctl secrets set QDRANT_URL=your_url
# ... add other secrets
flyctl deploy
```

## 🔧 **Configuration Options**

### **AI Models Available**
```bash
# In .env file:
TOGETHER_MODEL=meta-llama/Llama-2-70b-chat-hf    # Most capable
TOGETHER_MODEL=meta-llama/Llama-2-13b-chat-hf    # Faster
TOGETHER_MODEL=mistralai/Mixtral-8x7B-Instruct-v0.1  # High quality
```

### **Widget Customization**
```javascript
{
  "botName": "Your Assistant",
  "primaryColor": "#your-brand-color",
  "welcomeMessage": "Hello! How can we help?",
  "position": "bottom-right",
  "theme": "light"
}
```

## 📊 **Monitoring**

### **Health Check**
Visit: `https://yourdomain.com/health`

### **Active Sessions**
Send `/status` to WhatsApp bot (as admin)

## 🎯 **Best Practices**

### **Training Tips**
- Start with 10-20 common questions
- Write answers like you're talking to customers
- Be specific and helpful
- Test with real questions
- Update regularly

### **Widget Tips**
- Place widget on every page
- Use your brand colors
- Write welcoming messages
- Test on mobile devices
- Monitor chat sessions

## 🚨 **Troubleshooting**

### **Common Issues**

**WhatsApp not connecting:**
- Check QR code scan (Baileys)
- Verify webhook URL (Business API)
- Check API keys

**AI not responding:**
- Verify Together AI key
- Check Qdrant connection
- Ensure training data exists

**Widget not working:**
- Check embed code placement
- Verify server is running
- Test API endpoints

**Training not working:**
- Confirm admin number in .env
- Check Qdrant collection exists
- Verify embedding generation

### **Getting Help**
1. Check logs for error messages
2. Test individual components
3. Verify all API keys
4. Check network connectivity

## 🎉 **You're Ready!**

Your AI bot is now:
- ✅ **Responding on WhatsApp**
- ✅ **Available on your website**
- ✅ **Learning from training**
- ✅ **Ready for customers**

Train it well and watch it get smarter! 🧠✨

---

*Need help? Send `/help` to your WhatsApp bot or check the logs.* 