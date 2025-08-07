# 🚂 Railway Deployment Guide

Deploy your AI WhatsApp bot to **Railway** with $5 free credit monthly. Railway is the **easiest** platform to deploy to.

> **🔙 Back to**: [Deployment Guide](../DEPLOYMENT.md)  
> **⚡ Quick Setup**: [Quick Start Guide](../QUICK_START.md)

## 🎯 **Why Railway?**

- ✅ **$5 free credit** per month (enough for small-medium bots)
- ✅ **Zero configuration** - just connect GitHub and deploy
- ✅ **Automatic HTTPS** and custom domains included
- ✅ **Built-in monitoring** and real-time logs
- ✅ **GitHub integration** with auto-deploys
- ✅ **PostgreSQL/Redis** add-ons available
- ✅ **Simple pricing** - pay only for what you use

## 💰 **Free Tier Details**

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **Credit** | $5/month | Resets monthly |
| **RAM** | 512MB-8GB | Pay per usage |
| **CPU** | Shared | Fair usage |
| **Storage** | 100GB | Persistent volumes |
| **Bandwidth** | 100GB | Outbound traffic |
| **Domains** | Unlimited | Custom domains free |

**Typical Usage**: A WhatsApp bot uses ~$2-4/month, well within the free credit.

## 🚀 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**

Ensure your code is ready for deployment:

```bash
# 1. Make sure you have a clean git repository
git status
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 2. Verify your package.json has correct scripts
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **Step 2: Create Railway Account**

1. Go to [Railway.app](https://railway.app)
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your repositories
5. Verify your email if prompted

### **Step 3: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository from the list
4. Click **"Deploy Now"**

Railway will automatically:
- Detect it's a Node.js project
- Install dependencies with `npm install`
- Build the project with `npm run build`
- Start with `npm start`

### **Step 4: Set Environment Variables**

1. Go to your project dashboard
2. Click on your service (usually shows your repo name)
3. Go to **"Variables"** tab
4. Add these environment variables:

```bash
# Required Variables
TOGETHER_API_KEY=your_together_ai_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
ADMIN_NUMBERS=+1234567890,+0987654321

# Optional Variables
USE_BAILEYS=true
WA_SESSION_NAME=wa-bot-session
PORT=3000
LOG_LEVEL=info
```

**💡 Tip**: Railway automatically sets `PORT` environment variable, but you can override it.

### **Step 5: Deploy and Monitor**

1. Railway will automatically redeploy after adding variables
2. Watch the **"Deployments"** tab for build progress
3. Check **"Logs"** tab for runtime logs
4. Look for the QR code in logs or access via the generated domain

### **Step 6: Connect WhatsApp**

1. **Option A**: View logs for QR code
   - Go to **"Logs"** tab
   - Look for QR code ASCII art
   - Scan with WhatsApp

2. **Option B**: Access via domain (if web interface available)
   - Go to **"Settings"** tab
   - Copy your Railway domain
   - Visit `https://your-app.railway.app`

### **Step 7: Test Your Bot**

```bash
# From your admin WhatsApp number, send:
/menu
# You should see the admin control panel

/status
# You should see system status

# Upload a PDF file
# Bot should process and confirm success
```

## 🔧 **Advanced Configuration**

### **Custom Domain Setup**

1. Go to **"Settings"** tab
2. Click **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain (e.g., `bot.yourdomain.com`)
5. Add the CNAME record to your DNS provider:
   ```
   CNAME bot your-app.railway.app
   ```

### **Environment Management**

Railway supports multiple environments:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Set variables via CLI
railway variables set TOGETHER_API_KEY=your_key
railway variables set QDRANT_URL=your_url
```

### **Database Add-ons**

Add PostgreSQL or Redis if needed:

1. Go to project dashboard
2. Click **"New"** > **"Database"**
3. Choose **PostgreSQL** or **Redis**
4. Connection details automatically added to environment

### **Monitoring and Logs**

Railway provides excellent monitoring:

1. **Real-time Logs**: Live log streaming
2. **Metrics**: CPU, RAM, Network usage
3. **Deployments**: History of all deployments
4. **Analytics**: Request metrics and performance

### **Auto-Deploy Setup**

Enable automatic deployments:

1. Go to **"Settings"** tab
2. **"Service"** section
3. **"Source Repo"** - ensure GitHub is connected
4. **"Auto-Deploy"** - enable for main branch

Now every push to main branch automatically deploys!

## 📊 **Monitoring Your Usage**

### **Check Usage Dashboard**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"Usage"** tab
3. Monitor your monthly credit usage

### **Typical Bot Usage**
```
Small bot (< 100 messages/day):     ~$1-2/month
Medium bot (100-1000 messages/day): ~$2-3/month
Large bot (1000+ messages/day):     ~$3-5/month
```

### **Usage Optimization**
- **Efficient Code**: Minimize CPU usage
- **Caching**: Cache AI responses when appropriate
- **Sleep Mode**: Railway automatically sleeps inactive apps
- **Resource Monitoring**: Use Railway's built-in metrics

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs in Railway dashboard
# Common issues:

# 1. Missing start script
"scripts": {
  "start": "node dist/index.js"  // Make sure this exists
}

# 2. TypeScript build issues
npm run build  // Test locally first

# 3. Missing dependencies
npm install    // Ensure all deps are in package.json
```

#### **Environment Variable Issues**
```bash
# In Railway Variables tab, ensure:
TOGETHER_API_KEY=together_abc123...  # Starts with 'together_'
QDRANT_URL=https://xyz.qdrant.tech   # Full HTTPS URL
ADMIN_NUMBERS=+1234567890            # Include country code
```

#### **WhatsApp Connection Issues**
```bash
# Check logs for:
[SUCCESS] Qdrant connection successful
[SUCCESS] Together AI connection successful
[INFO] WhatsApp client initialized

# If QR code doesn't appear, check:
- qrcode-terminal is installed
- USE_BAILEYS=true is set
- No port conflicts
```

#### **File Upload Issues**
```bash
# Ensure these packages are installed:
npm install pdf-parse mammoth

# Check logs for:
[INFO] Processing file upload: document.pdf
[SUCCESS] File Uploaded Successfully!
```

### **Performance Issues**

#### **Slow Response Times**
- Check Railway metrics for high CPU usage
- Optimize AI model choice (smaller models = faster)
- Implement caching for frequent queries

#### **Memory Issues**
- Monitor RAM usage in Railway dashboard
- Increase memory limit if needed (costs more)
- Optimize file processing for large documents

### **Getting Help**

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Support**: help@railway.app
- **Our Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 💡 **Pro Tips**

### **Development Workflow**
```bash
# 1. Develop locally
npm run dev

# 2. Test thoroughly
npm run build
npm start

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 4. Railway auto-deploys!
```

### **Environment Best Practices**
- Use Railway's environment variables (never commit .env)
- Set up different Railway projects for staging/production
- Use Railway CLI for quick deployments and debugging

### **Cost Management**
- Monitor usage regularly
- Use Railway's built-in metrics
- Optimize code for efficiency
- Consider upgrading if you exceed free tier consistently

## 🎯 **Next Steps**

After successful Railway deployment:

1. **Test Everything**:
   - WhatsApp connection and QR code
   - Admin commands (`/menu`, `/status`)
   - File upload functionality
   - Web widget (if applicable)

2. **Set Up Monitoring**:
   - Bookmark Railway dashboard
   - Set up alerts for high usage
   - Monitor logs for errors

3. **Train Your Bot**:
   - Follow [User Training Guide](../USER_TRAINING_GUIDE.md)
   - Upload your company documents
   - Test AI responses

4. **Custom Domain** (Optional):
   - Set up custom domain for professional look
   - Configure SSL (automatic with Railway)

## 📚 **Related Guides**

- 🔧 **[Environment Setup](../ENVIRONMENT.md)** - API keys and configuration
- 🎓 **[User Training Guide](../USER_TRAINING_GUIDE.md)** - Train your AI
- 👨‍💼 **[Admin Guide](../ADMIN_GUIDE.md)** - Master admin commands
- 🐛 **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and fixes

---

**🎉 Congratulations!** Your AI WhatsApp bot is now running on Railway with professional hosting, monitoring, and automatic deployments. Enjoy your intelligent assistant! 🤖✨

**Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) or create an issue on GitHub. 