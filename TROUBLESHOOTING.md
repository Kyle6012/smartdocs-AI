# 🐛 Troubleshooting Guide

Complete guide to fixing common issues with your AI WhatsApp bot. Find solutions to setup, deployment, and operational problems.

> **⚡ Quick Setup**: [Quick Start Guide](QUICK_START.md)  
> **🔧 Environment**: [Environment Setup](ENVIRONMENT.md)

## 🚨 **Common Issues Quick Reference**

| Issue | Quick Fix | Guide Section |
|-------|-----------|---------------|
| QR code not showing | Install `qrcode-terminal` | [WhatsApp Issues](#whatsapp-issues) |
| Bot not responding | Check admin numbers | [Admin Issues](#admin-issues) |
| File upload fails | Check file format | [File Processing](#file-processing-issues) |
| Connection errors | Verify API keys | [API Issues](#api-connection-issues) |
| Deployment fails | Check build scripts | [Deployment Issues](#deployment-issues) |
| Port already in use | Change port or kill process | [Server Issues](#server-issues) |

## 🔧 **Setup and Installation Issues**

### **Node.js and Dependencies**

#### **"npm install" fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (requires 18+)
node --version  # Should be 18.0.0 or higher
```

#### **TypeScript compilation errors**
```bash
# Install TypeScript globally
npm install -g typescript

# Check tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "types": ["node"]
  }
}

# Rebuild
npm run build
```

#### **Missing dependencies**
```bash
# Install all required packages
npm install @whiskeysockets/baileys @qdrant/js-client-rest express axios dotenv chalk uuid qrcode-terminal pdf-parse mammoth

# Install dev dependencies
npm install --save-dev @types/node @types/express @types/uuid @types/qrcode-terminal @types/pdf-parse typescript tsx
```

### **Environment Configuration**

#### **".env file not found"**
```bash
# Create .env file from example
cp .env.example .env

# Or create manually
touch .env

# Add required variables
echo "TOGETHER_API_KEY=your_key_here" >> .env
echo "QDRANT_URL=https://your-cluster.qdrant.tech" >> .env
echo "QDRANT_API_KEY=your_qdrant_key" >> .env
echo "ADMIN_NUMBERS=+1234567890" >> .env
```

#### **Environment variables not loading**
```bash
# Check .env file exists and has content
cat .env

# Verify dotenv is installed
npm list dotenv

# Check file permissions
ls -la .env  # Should be readable

# Test loading
node -e "require('dotenv').config(); console.log(process.env.TOGETHER_API_KEY)"
```

## 🔑 **API Connection Issues**

### **Together AI Issues**

#### **"Missing Together AI API key"**
```bash
# Check environment variable
echo $TOGETHER_API_KEY

# Verify in .env file
grep TOGETHER_API_KEY .env

# Test API key format
# Should start with: together_
TOGETHER_API_KEY=together_abc123...
```

#### **"Together AI API error: 401"**
```bash
# API key is invalid or expired
1. Go to https://api.together.xyz/settings/api-keys
2. Check if key is active
3. Create new key if needed
4. Update .env file
5. Restart bot
```

#### **"Together AI API error: 400"**
```bash
# Bad request - check model name
TOGETHER_MODEL=meta-llama/Llama-2-7b-chat-hf  # Correct format

# Verify model exists
# Check Together AI documentation for available models
```

#### **"Together AI API error: 429"**
```bash
# Rate limit exceeded
1. Wait a few minutes
2. Check your usage on Together AI dashboard
3. Consider upgrading plan
4. Implement request throttling
```

### **Qdrant Issues**

#### **"Qdrant connection failed"**
```bash
# Check URL format
QDRANT_URL=https://your-cluster.qdrant.tech  # Must include https://

# Verify cluster is running
# Login to Qdrant Cloud dashboard
# Check cluster status

# Test connection
curl -X GET "https://your-cluster.qdrant.tech/collections" \
  -H "api-key: your_api_key"
```

#### **"Collection already exists" error**
```bash
# This is usually not an error - it's informational
# The bot will use the existing collection

# To reset collection (DANGER: deletes all data):
# 1. Login to Qdrant dashboard
# 2. Delete collection manually
# 3. Restart bot (will recreate)
```

#### **"Qdrant API error: 403"**
```bash
# API key is invalid
1. Check QDRANT_API_KEY in .env
2. Go to Qdrant dashboard > API Keys
3. Verify key is active
4. Create new key if needed
```

#### **"Qdrant API error: 404"**
```bash
# Collection not found
# Let bot auto-create collection:
1. Ensure QDRANT_COLLECTION_NAME is set
2. Restart bot
3. Check logs for collection creation

# Or create manually in Qdrant dashboard
```

## 📱 **WhatsApp Issues**

### **QR Code Problems**

#### **QR code not showing**
```bash
# Install qrcode-terminal
npm install qrcode-terminal

# Check if package is imported
grep "qrcode-terminal" src/whatsapp.ts

# Verify USE_BAILEYS is set
USE_BAILEYS=true

# Check logs for errors
npm run dev | grep -i qr
```

#### **QR code shows but won't scan**
```bash
# Try different terminal
# Some terminals don't render QR codes well

# Use smaller QR code
QRCode.generate(qr, { small: true });

# Check terminal size
# Make sure terminal is wide enough

# Try different device
# Some phones have scanning issues
```

#### **"WhatsApp logged out" repeatedly**
```bash
# Clear WhatsApp session
rm -rf wa-bot-session/

# Check session permissions
chmod 755 wa-bot-session/

# Verify session name
WA_SESSION_NAME=wa-bot-session  # Match folder name

# Check for multiple bot instances
ps aux | grep node
# Kill duplicate processes
```

### **Connection Issues**

#### **"Connection closed, reconnecting..."**
```bash
# This is normal - WhatsApp periodically disconnects
# Bot should automatically reconnect

# If persistent:
1. Check internet connection
2. Restart bot
3. Clear session and re-scan QR
4. Check WhatsApp server status
```

#### **"WhatsApp client not initialized"**
```bash
# Check USE_BAILEYS setting
USE_BAILEYS=true

# Verify WhatsApp service initialization
# Check logs for initialization errors

# Restart with clean session
rm -rf wa-bot-session/
npm run dev
```

## 👨‍💼 **Admin Issues**

### **Admin Commands Not Working**

#### **"Admin access required"**
```bash
# Check ADMIN_NUMBERS format
ADMIN_NUMBERS=+1234567890,+0987654321  # Include country code, no spaces

# Verify your WhatsApp number
# Go to WhatsApp > Settings > Profile
# Check exact number format

# Test with exact format
ADMIN_NUMBERS=+15551234567  # Example US number
```

#### **"/menu command not recognized"**
```bash
# Check if you're an admin
grep ADMIN_NUMBERS .env

# Verify number format matches exactly
# WhatsApp number: +1 (555) 123-4567
# .env format: +15551234567

# Test admin status
/status  # Should work for admins
```

### **Training Issues**

#### **Training session stuck**
```bash
# Cancel current session
/cancel

# Clear all sessions
/clear

# Check session state
/status

# Restart if needed
/restart
```

#### **Bot doesn't remember training**
```bash
# Check if training was successful
/status  # Look for document count

# Verify Qdrant connection
# Check logs for "Added X documents"

# Test with specific question from training
"Tell me about [specific topic you trained]"
```

## 📄 **File Processing Issues**

### **File Upload Problems**

#### **"File format not supported"**
```bash
# Supported formats only:
✅ .pdf, .docx, .txt, .md, .csv, .json
❌ .doc, .ppt, .xlsx, .rtf, .pages

# Check file extension
ls -la your-file.pdf  # Verify actual extension

# Rename if needed
mv document.PDF document.pdf  # Lowercase extension
```

#### **"No content could be extracted"**
```bash
# PDF issues:
- File might be scanned images (no text)
- Password protected PDF
- Corrupted file

# DOCX issues:
- Old .doc format (not supported)
- Corrupted file
- Complex formatting

# Solutions:
1. Re-save file in correct format
2. Use "Save As" to create clean version
3. Try different file
```

#### **"File processing error"**
```bash
# Check file size
ls -lh your-file.pdf  # Should be < 10MB

# Verify file integrity
file your-file.pdf  # Should show correct type

# Check dependencies
npm list pdf-parse mammoth

# Reinstall if needed
npm install pdf-parse mammoth
```

### **Processing Performance**

#### **Slow file processing**
```bash
# Large files take longer
# Optimize file size:
1. Compress PDF
2. Remove images from documents
3. Split large files into smaller ones

# Check server resources
# Monitor memory and CPU usage
```

#### **Processing timeout**
```bash
# Increase timeout for large files
# Or split into smaller files

# Check server logs for memory errors
# May need more RAM on deployment platform
```

## 🖥️ **Server Issues**

### **Port and Network Issues**

#### **"Port already in use"**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev

# Or kill all node processes
pkill -f node
```

#### **"EADDRINUSE" error**
```bash
# Kill existing server
pkill -f "npm run dev"

# Wait and restart
sleep 2 && npm run dev

# Use different port
echo "PORT=3001" >> .env
```

### **Memory and Performance**

#### **"Out of memory" errors**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/index.js

# Or in package.json:
"scripts": {
  "start": "node --max-old-space-size=4096 dist/index.js"
}

# Check for memory leaks
# Monitor with /status command
```

#### **Slow response times**
```bash
# Check system resources
/status  # Look for performance metrics

# Optimize:
1. Use smaller AI models
2. Reduce context length
3. Implement caching
4. Upgrade deployment resources
```

## 🚀 **Deployment Issues**

### **Build Failures**

#### **TypeScript compilation errors**
```bash
# Check tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

# Install dev dependencies
npm install --save-dev typescript @types/node

# Test build locally
npm run build
```

#### **Missing start script**
```bash
# Verify package.json scripts
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  }
}

# Test locally
npm run build
npm start
```

### **Environment Variables on Cloud**

#### **Variables not set in production**
```bash
# Railway
railway variables set TOGETHER_API_KEY=your_key

# Render
# Set in dashboard Environment tab

# Fly.io
fly secrets set TOGETHER_API_KEY=your_key

# Vercel
vercel env add TOGETHER_API_KEY

# Heroku
heroku config:set TOGETHER_API_KEY=your_key
```

#### **Production vs development config**
```bash
# Use platform-specific environment variables
# Never commit .env to git

# Check environment in logs
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
```

### **Platform-Specific Issues**

#### **Railway deployment fails**
```bash
# Check build logs in Railway dashboard
# Common issues:
1. Missing start script
2. Wrong Node.js version
3. Build timeout

# Solutions:
1. Set "engines" in package.json
2. Optimize build process
3. Check Railway service logs
```

#### **Render deployment fails**
```bash
# Check build command
Build Command: npm install && npm run build
Start Command: npm start

# Verify Node.js version
"engines": {
  "node": "18.x"
}

# Check logs for specific errors
```

## 🔍 **Debugging Techniques**

### **Log Analysis**

#### **Enable detailed logging**
```bash
# Set log level
LOG_LEVEL=debug

# Add custom logging
console.log('Debug info:', variable);
logger.info('Status:', status);
logger.error('Error:', error);
```

#### **Check specific logs**
```bash
# WhatsApp connection
grep -i "whatsapp" logs

# API errors
grep -i "error" logs

# File processing
grep -i "file" logs

# Admin commands
grep -i "admin" logs
```

### **Testing Components**

#### **Test API connections**
```bash
# Test Together AI
curl -X POST "https://api.together.xyz/v1/chat/completions" \
  -H "Authorization: Bearer your_key" \
  -H "Content-Type: application/json" \
  -d '{"model":"meta-llama/Llama-2-7b-chat-hf","messages":[{"role":"user","content":"test"}]}'

# Test Qdrant
curl -X GET "https://your-cluster.qdrant.tech/collections" \
  -H "api-key: your_key"
```

#### **Test individual features**
```bash
# Test admin commands
/status
/menu
/help

# Test file processing
# Upload a small test file

# Test normal chat
# Send regular message as non-admin
```

## 🆘 **Getting Help**

### **Self-Diagnosis Checklist**

Before asking for help, check:

- [ ] All environment variables are set correctly
- [ ] API keys are valid and active
- [ ] Node.js version is 18 or higher
- [ ] All dependencies are installed
- [ ] Port is not in use by another process
- [ ] Internet connection is stable
- [ ] File formats are supported
- [ ] Admin numbers include country codes

### **Collecting Debug Information**

When reporting issues, include:

```bash
# System information
node --version
npm --version
cat package.json | grep version

# Environment check (remove sensitive data)
env | grep -E "(TOGETHER|QDRANT|ADMIN)" | sed 's/=.*/=***/'

# Recent logs
tail -50 logs/app.log

# Error details
# Copy exact error message and stack trace
```

### **Where to Get Help**

- 📚 **Documentation**: Check all guides in this repository
- 🐛 **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 **Email**: support@yourproject.com

### **Community Resources**

- **Together AI**: [Discord](https://discord.gg/together-ai)
- **Qdrant**: [Discord](https://discord.gg/qdrant)
- **Baileys**: [GitHub Issues](https://github.com/WhiskeySockets/Baileys/issues)
- **Node.js**: [Official Docs](https://nodejs.org/docs)

## 📚 **Related Guides**

- ⚡ **[Quick Start Guide](QUICK_START.md)** - Basic setup
- 🔧 **[Environment Setup](ENVIRONMENT.md)** - API keys and configuration
- 🚀 **[Deployment Guide](DEPLOYMENT.md)** - Cloud deployment
- 👨‍💼 **[Admin Guide](ADMIN_GUIDE.md)** - Admin commands
- 📄 **[File Processing](FILE_PROCESSING.md)** - File upload issues

---

**🔧 Still having issues?** Don't worry! Most problems have simple solutions. Check the specific guide sections above, and if you're still stuck, create an issue on GitHub with your debug information. We're here to help! 🤖✨ 