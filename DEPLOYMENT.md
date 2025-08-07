# 🚀 Deployment Guide

Deploy your AI WhatsApp bot to **free cloud platforms** with step-by-step instructions for each platform.

> **⚡ Quick Setup**: See [Quick Start Guide](QUICK_START.md)  
> **🔧 Environment Setup**: See [Environment Guide](ENVIRONMENT.md)

## 🌐 **Free Deployment Options**

| Platform | Free Tier | Best For | Setup Time | Difficulty |
|----------|-----------|----------|------------|------------|
| **[Railway](#railway-deployment)** | $5/month credit | Production apps | 5 min | ⭐ Easy |
| **[Render](#render-deployment)** | 750 hours/month | Web services | 10 min | ⭐⭐ Easy |
| **[Fly.io](#flyio-deployment)** | 3 shared VMs | Global deployment | 15 min | ⭐⭐⭐ Medium |
| **[Vercel](#vercel-deployment)** | Hobby plan | Serverless functions | 5 min | ⭐⭐ Easy |
| **[Heroku](#heroku-deployment)** | 1000 dyno hours | Traditional apps | 10 min | ⭐⭐ Easy |

## 🎯 **Recommended: Railway** (Easiest)

**Railway** offers $5/month free credit and is the easiest to set up.

### **Why Railway?**
- ✅ **$5 free credit** monthly (enough for small bots)
- ✅ **Zero configuration** deployment
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Built-in monitoring** and logs
- ✅ **GitHub integration** for auto-deploys

### **Railway Deployment Steps**

#### **Step 1: Prepare Your Code**
```bash
# Ensure your code is in a git repository
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### **Step 2: Deploy to Railway**
1. Go to [Railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will automatically detect Node.js and deploy

#### **Step 3: Set Environment Variables**
1. Go to your project dashboard
2. Click **"Variables"** tab
3. Add these environment variables:

```bash
TOGETHER_API_KEY=your_together_ai_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
ADMIN_NUMBERS=+1234567890,+0987654321
USE_BAILEYS=true
WA_SESSION_NAME=wa-bot-session
PORT=3000
```

#### **Step 4: Deploy**
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Your bot will be live!

#### **Step 5: Connect WhatsApp**
1. Check logs for QR code or access via Railway's domain
2. Scan QR code with WhatsApp
3. Test with `/menu` command

**🎉 Done!** Your bot is now deployed on Railway.

---

## 🌐 **Render Deployment**

**Render** offers 750 free hours per month (enough to run 24/7).

### **Step 1: Create Render Account**
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Verify your email

### **Step 2: Create Web Service**
1. Click **"New +"** > **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-whatsapp-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### **Step 3: Set Environment Variables**
In the **Environment** section, add:
```bash
TOGETHER_API_KEY=your_together_ai_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
ADMIN_NUMBERS=+1234567890
USE_BAILEYS=true
WA_SESSION_NAME=wa-bot-session
```

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. Wait for build and deployment
3. Access logs to see QR code

**📋 Render Setup**: [Detailed Guide](deployments/RENDER.md)

---

## 🚁 **Fly.io Deployment**

**Fly.io** offers 3 shared VMs free with global deployment.

### **Step 1: Install Fly CLI**
```bash
# macOS
brew install flyctl

# Linux/Windows
curl -L https://fly.io/install.sh | sh
```

### **Step 2: Login and Setup**
```bash
# Login to Fly.io
fly auth login

# Initialize your app
fly launch
# Choose app name, region, and configuration
```

### **Step 3: Set Environment Variables**
```bash
fly secrets set TOGETHER_API_KEY=your_together_ai_key_here
fly secrets set QDRANT_URL=https://your-cluster.qdrant.tech
fly secrets set QDRANT_API_KEY=your_qdrant_api_key_here
fly secrets set ADMIN_NUMBERS=+1234567890
fly secrets set USE_BAILEYS=true
fly secrets set WA_SESSION_NAME=wa-bot-session
```

### **Step 4: Deploy**
```bash
fly deploy
```

**📋 Fly.io Setup**: [Detailed Guide](deployments/FLYIO.md)

---

## 📦 **Vercel Deployment**

**Vercel** offers free hobby plan with serverless functions.

### **Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

### **Step 2: Login and Deploy**
```bash
vercel login
vercel
# Follow the prompts
```

### **Step 3: Set Environment Variables**
```bash
vercel env add TOGETHER_API_KEY
vercel env add QDRANT_URL
vercel env add QDRANT_API_KEY
vercel env add ADMIN_NUMBERS
```

**📋 Vercel Setup**: [Detailed Guide](deployments/VERCEL.md)

---

## 🔷 **Heroku Deployment**

**Heroku** offers 1000 free dyno hours per month.

### **Step 1: Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Other platforms: https://devcenter.heroku.com/articles/heroku-cli
```

### **Step 2: Create Heroku App**
```bash
heroku login
heroku create your-bot-name
```

### **Step 3: Set Environment Variables**
```bash
heroku config:set TOGETHER_API_KEY=your_together_ai_key_here
heroku config:set QDRANT_URL=https://your-cluster.qdrant.tech
heroku config:set QDRANT_API_KEY=your_qdrant_api_key_here
heroku config:set ADMIN_NUMBERS=+1234567890
heroku config:set USE_BAILEYS=true
heroku config:set WA_SESSION_NAME=wa-bot-session
```

### **Step 4: Deploy**
```bash
git push heroku main
```

**📋 Heroku Setup**: [Detailed Guide](deployments/HEROKU.md)

---

## 🔧 **Pre-Deployment Checklist**

Before deploying to any platform:

### **✅ Code Ready**
- [ ] All code committed to git
- [ ] `package.json` has correct start script
- [ ] `.env.example` file exists
- [ ] `.gitignore` includes `.env`

### **✅ API Keys Ready**
- [ ] Together AI API key obtained
- [ ] Qdrant cluster created and API key ready
- [ ] Admin phone numbers identified
- [ ] Environment variables documented

### **✅ Dependencies**
- [ ] All npm packages installed
- [ ] No dev dependencies in production build
- [ ] Node.js version specified in `package.json`

### **✅ Configuration**
```json
// package.json
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

## 🎯 **Post-Deployment Steps**

After successful deployment:

### **1. Test Your Bot**
1. **Check Logs**: Look for QR code or connection messages
2. **Scan QR Code**: Connect your WhatsApp
3. **Test Commands**: Send `/menu` from admin number
4. **Test File Upload**: Upload a PDF or DOCX file
5. **Test Web Widget**: Open your domain + `/widget.html`

### **2. Configure Custom Domain** (Optional)
Most platforms offer custom domain configuration:
- **Railway**: Settings > Domains
- **Render**: Settings > Custom Domains
- **Vercel**: Domains tab
- **Heroku**: Settings > Domains

### **3. Set Up Monitoring**
- **Railway**: Built-in monitoring dashboard
- **Render**: Logs and metrics available
- **Fly.io**: `fly logs` command
- **Vercel**: Functions dashboard
- **Heroku**: `heroku logs --tail`

### **4. Enable Auto-Deploys**
Connect GitHub for automatic deployments:
- Push to main branch → Automatic deployment
- Pull request previews (some platforms)
- Rollback capabilities

## 🔍 **Troubleshooting Deployment**

### **Common Issues**

#### **Build Failures**
```bash
# Check Node.js version
"engines": {
  "node": "18.x"
}

# Verify start script
"scripts": {
  "start": "node dist/index.js"
}
```

#### **Environment Variable Issues**
```bash
# Verify all required variables are set
TOGETHER_API_KEY=xxx
QDRANT_URL=xxx
QDRANT_API_KEY=xxx
ADMIN_NUMBERS=xxx
```

#### **Port Issues**
```javascript
// Use environment port or default
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### **WhatsApp Session Issues**
- Sessions may not persist across deployments
- Use volume mounts or external storage for production
- Consider WhatsApp Business API for production

### **Platform-Specific Issues**

#### **Railway**
- Check build logs in dashboard
- Verify environment variables are set
- Use Railway CLI for debugging: `railway logs`

#### **Render**
- Check build and deploy logs
- Verify start command is correct
- Free tier has sleep mode after 15 minutes

#### **Fly.io**
- Use `fly logs` to check application logs
- Verify `fly.toml` configuration
- Check VM resources and scaling

## 💰 **Cost Optimization**

### **Free Tier Limits**
- **Railway**: $5/month credit (monitor usage)
- **Render**: 750 hours/month (31 days = 744 hours)
- **Fly.io**: 3 shared VMs, 160GB/month bandwidth
- **Vercel**: 100GB bandwidth, 12 serverless functions
- **Heroku**: 1000 dyno hours/month

### **Tips to Stay Free**
1. **Monitor Usage**: Check platform dashboards regularly
2. **Optimize Resources**: Use efficient code and minimal dependencies
3. **Sleep Mode**: Some platforms sleep inactive apps (saves resources)
4. **Scaling**: Start with minimal resources, scale as needed

## 📚 **Next Steps**

After deployment:
- 🎓 **[User Training Guide](USER_TRAINING_GUIDE.md)** - Train your AI
- 👨‍💼 **[Admin Guide](ADMIN_GUIDE.md)** - Master admin commands
- 📄 **[File Processing](FILE_PROCESSING.md)** - Upload documents
- 🏗️ **[Architecture](ARCHITECTURE.md)** - Understand the system

## 🆘 **Need Help?**

- 📋 **Platform Guides**: Check `deployments/` folder for detailed guides
- 🐛 **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and fixes
- 💬 **[GitHub Issues](https://github.com/your-repo/issues)** - Report problems
- 📧 **Support**: Contact platform support if needed

---

**🎉 Congratulations!** Your AI WhatsApp bot is now deployed and accessible worldwide. Start training it with your content and enjoy your intelligent assistant! 🤖✨ 