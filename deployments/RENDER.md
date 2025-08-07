# 🌐 Render Deployment Guide

Deploy your AI WhatsApp bot to **Render** with 750 free hours per month. Render offers excellent free tier for web services.

> **🔙 Back to**: [Deployment Guide](../DEPLOYMENT.md)  
> **⚡ Quick Setup**: [Quick Start Guide](../QUICK_START.md)

## 🎯 **Why Render?**

- ✅ **750 free hours/month** (31 days = 744 hours - runs 24/7!)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **GitHub integration** with auto-deploys
- ✅ **Built-in monitoring** and logs
- ✅ **PostgreSQL/Redis** add-ons available
- ✅ **Docker support** and flexible configurations
- ✅ **Global CDN** included

## 💰 **Free Tier Details**

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **Hours** | 750/month | Enough for 24/7 operation |
| **RAM** | 512MB | Sufficient for WhatsApp bot |
| **CPU** | 0.1 vCPU | Shared CPU resources |
| **Storage** | 1GB SSD | Persistent storage |
| **Bandwidth** | 100GB/month | Generous bandwidth |
| **Sleep Mode** | After 15 min idle | Wakes up automatically |

**Perfect for**: Small to medium WhatsApp bots with moderate traffic.

## 🚀 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**

Ensure your code is deployment-ready:

```bash
# 1. Verify package.json scripts
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

# 2. Ensure clean git repository
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### **Step 2: Create Render Account**

1. Go to [Render.com](https://render.com)
2. Click **"Get Started"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your repositories
5. Verify your email address

### **Step 3: Create Web Service**

1. **Dashboard**: Click **"New +"** button
2. **Service Type**: Select **"Web Service"**
3. **Repository**: Choose **"Build and deploy from a Git repository"**
4. **Connect Repository**: Select your bot repository
5. **Authorization**: Grant necessary permissions

### **Step 4: Configure Service Settings**

#### **Basic Settings**
```bash
Name: ai-whatsapp-bot
Region: Oregon (US West) or Frankfurt (Europe)
Branch: main
Runtime: Node
```

#### **Build Settings**
```bash
Build Command: npm install && npm run build
Start Command: npm start
```

#### **Advanced Settings**
```bash
Node Version: 18
Auto-Deploy: Yes (recommended)
```

### **Step 5: Set Environment Variables**

In the **Environment** section, add these variables:

```bash
# Required API Keys
TOGETHER_API_KEY=your_together_ai_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
ADMIN_NUMBERS=+1234567890,+0987654321

# Bot Configuration
USE_BAILEYS=true
WA_SESSION_NAME=wa-bot-session
NODE_ENV=production

# Optional
LOG_LEVEL=info
```

**💡 Pro Tip**: Render automatically sets `PORT` environment variable.

### **Step 6: Deploy**

1. **Review Settings**: Double-check all configurations
2. **Create Web Service**: Click the button
3. **Watch Build**: Monitor the build process in real-time
4. **Wait for Deploy**: First deployment takes 3-5 minutes

### **Step 7: Monitor Deployment**

Watch the build logs for:
```bash
==> Building...
Running build command 'npm install && npm run build'...
==> Build successful!

==> Deploying...
Starting service with 'npm start'...
[INFO] Server running on port 10000
[SUCCESS] Qdrant connection successful
[INFO] WhatsApp client initialized
==> Deploy successful!
```

### **Step 8: Connect WhatsApp**

#### **Option A: View Logs for QR Code**
1. Go to **"Logs"** tab in Render dashboard
2. Look for QR code ASCII art in logs
3. Scan with WhatsApp on your phone

#### **Option B: Access via Custom Domain**
1. Go to **"Settings"** tab
2. Note your Render URL: `https://your-app.onrender.com`
3. Visit URL if you have a web interface

### **Step 9: Test Your Bot**

```bash
# From your admin WhatsApp number:
/menu
# Should show admin control panel

/status  
# Should show system status

# Upload a test file
# Bot should process successfully
```

## 🔧 **Advanced Configuration**

### **Custom Domain Setup**

1. **Settings Tab**: Go to service settings
2. **Custom Domains**: Click "Add Custom Domain"
3. **Domain**: Enter your domain (e.g., `bot.yourdomain.com`)
4. **DNS Setup**: Add CNAME record:
   ```
   CNAME bot your-app.onrender.com
   ```
5. **SSL**: Render automatically provides SSL certificate

### **Environment Management**

#### **Via Dashboard**
- Go to **Environment** tab
- Add/edit variables
- Service automatically redeploys

#### **Via Render CLI** (Optional)
```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Set environment variables
render env set TOGETHER_API_KEY=your_key
render env set QDRANT_URL=your_url
```

### **Database Add-ons**

Add PostgreSQL or Redis if needed:

1. **New Service**: Click **"New +"**
2. **Database**: Choose **PostgreSQL** or **Redis**
3. **Configuration**: Set up database
4. **Connection**: Environment variables automatically added

### **Monitoring and Logs**

#### **Real-time Logs**
- **Logs Tab**: Live log streaming
- **Filtering**: Filter by log level
- **Download**: Export logs for analysis

#### **Metrics**
- **Metrics Tab**: CPU, RAM, network usage
- **Response Times**: HTTP response metrics
- **Uptime**: Service availability stats

#### **Alerts** (Paid plans)
- **Email Alerts**: Service down notifications
- **Slack Integration**: Team notifications
- **Custom Webhooks**: Custom integrations

### **Auto-Deploy Configuration**

#### **GitHub Integration**
```bash
# Automatic deployment on push
- Push to main branch → Auto-deploy
- Pull request previews (paid plans)
- Deploy hooks available
```

#### **Deploy Hooks**
```bash
# Manual deploy trigger
curl -X POST https://api.render.com/deploy/srv-your-service-id
```

## 📊 **Performance Optimization**

### **Sleep Mode Management**

Render's free tier sleeps after 15 minutes of inactivity:

```javascript
// Keep-alive strategy (optional)
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Optional: Self-ping to prevent sleep (use sparingly)
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    fetch(`${process.env.RENDER_EXTERNAL_URL}/health`)
      .catch(err => console.log('Health check failed:', err));
  }, 14 * 60 * 1000); // Every 14 minutes
}
```

### **Resource Optimization**

```javascript
// Optimize for 512MB RAM
- Minimize memory usage
- Use efficient data structures  
- Implement garbage collection
- Monitor memory in logs
```

### **Build Optimization**

```bash
# Faster builds
Build Command: npm ci && npm run build

# Cache optimization
- Use npm ci instead of npm install
- Minimize dependencies
- Use .renderignore for unnecessary files
```

## 🐛 **Troubleshooting**

### **Common Build Issues**

#### **Build Command Failed**
```bash
# Check package.json scripts
"scripts": {
  "start": "node dist/index.js",  // Must exist
  "build": "tsc"                  // Must exist
}

# Verify Node.js version
"engines": {
  "node": "18.x"
}
```

#### **TypeScript Build Errors**
```bash
# Test build locally first
npm run build

# Check tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

#### **Dependency Issues**
```bash
# Use exact versions in package.json
"dependencies": {
  "@whiskeysockets/baileys": "6.6.0",
  "express": "4.18.2"
}

# Clear npm cache if issues persist
npm cache clean --force
```

### **Runtime Issues**

#### **Service Won't Start**
```bash
# Check start command
Start Command: npm start

# Verify dist folder exists after build
ls -la dist/

# Check for missing environment variables
# All required vars must be set in Render dashboard
```

#### **WhatsApp Connection Issues**
```bash
# Check logs for QR code
# Look in Render Logs tab

# Verify environment variables
TOGETHER_API_KEY=together_xxx
QDRANT_URL=https://xxx.qdrant.tech
ADMIN_NUMBERS=+1234567890
```

#### **Memory Issues**
```bash
# Monitor memory usage in logs
# Optimize code if exceeding 512MB

# Check for memory leaks
# Use /status command to monitor
```

### **Performance Issues**

#### **Slow Response Times**
```bash
# Check Render metrics
# Monitor CPU and memory usage

# Optimize:
1. Use smaller AI models
2. Implement caching
3. Reduce context size
4. Upgrade to paid plan if needed
```

#### **Sleep Mode Issues**
```bash
# Service sleeping after 15 minutes
# This is normal for free tier

# Solutions:
1. Upgrade to paid plan (no sleep)
2. Implement keep-alive (use sparingly)
3. Accept sleep mode for low-traffic bots
```

## 💰 **Cost Management**

### **Free Tier Usage**

Monitor your usage:
```bash
# Check dashboard for:
- Hours used this month
- Bandwidth consumption
- Build minutes used

# Typical bot usage:
Small bot: ~500-600 hours/month
Medium bot: ~700-750 hours/month (full usage)
```

### **Optimization Tips**

```bash
# Stay within free tier:
1. Optimize code efficiency
2. Use sleep mode strategically
3. Monitor bandwidth usage
4. Minimize build frequency
```

### **Upgrading Options**

When to upgrade to paid plan:
- Need more than 750 hours/month
- Want to eliminate sleep mode
- Need more RAM (1GB+)
- Require faster CPU
- Need advanced features

## 🔄 **CI/CD and Development**

### **Development Workflow**

```bash
# 1. Develop locally
npm run dev

# 2. Test build
npm run build
npm start

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 4. Render auto-deploys!
```

### **Branch Deployments**

```bash
# Deploy different branches
- main branch → Production
- staging branch → Staging service (separate)
- feature branches → Manual deploys
```

### **Environment Separation**

```bash
# Multiple environments
Production: main branch
Staging: staging branch  
Development: Local only

# Different environment variables per service
```

## 📚 **Best Practices**

### **Security**
```bash
# Environment variables
- Never commit API keys
- Use Render's environment variables
- Rotate keys regularly
- Monitor for security issues
```

### **Monitoring**
```bash
# Regular checks
- Monitor service health
- Check logs for errors
- Watch resource usage
- Test functionality regularly
```

### **Backup Strategy**
```bash
# Code backup
- Git repository (primary)
- Multiple remotes recommended

# Data backup  
- Qdrant Cloud handles vector data
- Export configurations regularly
```

## 🎯 **Next Steps**

After successful Render deployment:

1. **Test Everything**:
   - WhatsApp connection and QR code
   - Admin commands functionality
   - File upload processing
   - Web widget (if applicable)

2. **Set Up Monitoring**:
   - Bookmark Render dashboard
   - Monitor resource usage
   - Set up external monitoring (optional)

3. **Configure Domain** (Optional):
   - Set up custom domain
   - Configure DNS records
   - Test SSL certificate

4. **Train Your Bot**:
   - Follow [User Training Guide](../USER_TRAINING_GUIDE.md)
   - Upload company documents
   - Test AI responses

## 📚 **Related Guides**

- 🔧 **[Environment Setup](../ENVIRONMENT.md)** - API keys and configuration
- 🎓 **[User Training Guide](../USER_TRAINING_GUIDE.md)** - Train your AI
- 👨‍💼 **[Admin Guide](../ADMIN_GUIDE.md)** - Master admin commands
- 🐛 **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and fixes
- 🚂 **[Railway Alternative](RAILWAY.md)** - Compare with Railway

---

**🎉 Congratulations!** Your AI WhatsApp bot is now running on Render with 750 free hours per month, automatic HTTPS, and professional hosting. Perfect for small to medium bots! 🤖✨

**Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) or create an issue on GitHub. 