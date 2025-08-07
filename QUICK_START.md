# ⚡ Quick Start Guide

Get your AI WhatsApp bot running in **5 minutes**! This guide gets you up and running with minimal setup.

> **📚 For detailed setup**: See [Complete Setup Guide](SETUP_GUIDE.md)  
> **🚀 For deployment**: See [Deployment Guide](DEPLOYMENT.md)

## 🎯 **What You'll Have**
- ✅ AI WhatsApp bot responding to messages
- ✅ File upload training (PDF, DOCX, etc.)
- ✅ Admin commands for bot control
- ✅ Web chat widget for your website

## 📋 **Prerequisites** (2 minutes)

1. **Node.js 18+** installed ([Download](https://nodejs.org))
2. **WhatsApp number** for the bot
3. **API Keys** (free accounts):
   - [Together AI](https://api.together.xyz) - Free tier available
   - [Qdrant Cloud](https://qdrant.tech/documentation/cloud/) - Free tier 1GB

## 🚀 **Installation** (2 minutes)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd wa-agent
npm install

# 2. Setup environment
cp .env.example .env
```

## 🔧 **Configuration** (1 minute)

Edit `.env` file with your API keys:

```bash
# Required API Keys
TOGETHER_API_KEY=your_together_ai_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here

# Admin WhatsApp numbers (include country code)
ADMIN_NUMBERS=+1234567890,+0987654321

# Bot settings
USE_BAILEYS=true
WA_SESSION_NAME=wa-bot-session
PORT=3000
```

> **🔑 Getting API Keys**: See [Environment Setup](ENVIRONMENT.md) for detailed instructions

## ▶️ **Start the Bot** (30 seconds)

```bash
npm run dev
```

**You'll see:**
```
[INFO] Server running on port 3000
[SUCCESS] Qdrant connection successful
[INFO] WhatsApp client initialized
[INFO] 🔗 WhatsApp QR Code received! Please scan with your phone:

============================================================
📱 SCAN THIS QR CODE WITH YOUR WHATSAPP:
============================================================
[QR CODE APPEARS HERE]
============================================================
```

## 📱 **Connect WhatsApp** (30 seconds)

1. **Open WhatsApp** on your phone
2. **Go to Settings** > **Linked Devices**
3. **Tap "Link a Device"**
4. **Scan the QR code** in your terminal
5. **Wait for connection** confirmation

**Success message:**
```
[SUCCESS] 🎉 WhatsApp connected successfully! You can now use the bot.
```

## 🎉 **Test Your Bot** (30 seconds)

### **Normal User Test**
Send any message to your bot's WhatsApp number:
```
You: "Hello!"
Bot: "Hello! I'm your AI assistant. How can I help you today?"
```

### **Admin Test**
From your admin number, try:
```
You: "/menu"
Bot: [Shows admin control panel with all options]

You: "/status"
Bot: [Shows system status and statistics]
```

### **File Upload Test**
```
You: "/file"
Bot: [Shows file upload instructions]

You: [Attach a PDF or DOCX file]
Bot: "🎉 File Uploaded Successfully! AI can now answer questions about this content."
```

## 🌐 **Test Web Widget** (Optional)

Open `test-widget.html` in your browser to test the web chat widget:

```bash
# Open in browser
open test-widget.html
# or
firefox test-widget.html
```

## ✅ **You're Done!**

Your AI WhatsApp bot is now running with:
- ✅ **WhatsApp Integration** - Responds to messages
- ✅ **Admin Commands** - Full control via `/` commands
- ✅ **File Processing** - Upload PDFs, DOCX, etc.
- ✅ **Web Widget** - Embeddable chat for websites
- ✅ **Vector Database** - Intelligent context-aware responses

## 📚 **Next Steps**

### **Learn More**
- **[User Training Guide](USER_TRAINING_GUIDE.md)** - Train your AI with content
- **[Admin Guide](ADMIN_GUIDE.md)** - Master all admin commands
- **[File Processing](FILE_PROCESSING.md)** - Upload documents for training

### **Deploy to Production**
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to free cloud platforms
- **[Railway](deployments/RAILWAY.md)** - Recommended for beginners
- **[Render](deployments/RENDER.md)** - Great free tier

### **Customize**
- **[Architecture](ARCHITECTURE.md)** - Understand the system
- **[API Reference](API_REFERENCE.md)** - Integrate with other systems
- **[Environment](ENVIRONMENT.md)** - Advanced configuration

## 🆘 **Troubleshooting**

### **Common Issues**

**QR Code Not Showing?**
```bash
# Install missing package
npm install qrcode-terminal
npm run dev
```

**Connection Failed?**
- Check your internet connection
- Verify API keys in `.env`
- See [Troubleshooting Guide](TROUBLESHOOTING.md)

**Bot Not Responding?**
- Ensure you're an admin (check `ADMIN_NUMBERS` in `.env`)
- Try `/menu` command first
- Check server logs for errors

### **Need Help?**
- 📚 **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed instructions
- 🐛 **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and fixes
- 💬 **[GitHub Issues](https://github.com/your-repo/issues)** - Report bugs

---

**🎉 Congratulations!** You now have a fully functional AI WhatsApp bot. Start training it with your content and deploy it to the cloud! 🚀

**Next**: [Train your AI](USER_TRAINING_GUIDE.md) | [Deploy to cloud](DEPLOYMENT.md) 