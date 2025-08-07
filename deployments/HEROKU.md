# 🔷 Heroku Deployment Guide

Deploy your AI WhatsApp bot to **Heroku** with 1000 free dyno hours per month. Heroku is a traditional PaaS platform with excellent developer experience.

> **🔙 Back to**: [Deployment Guide](../DEPLOYMENT.md)  
> **⚡ Quick Setup**: [Quick Start Guide](../QUICK_START.md)

## 🎯 **Why Heroku?**

- ✅ **1000 free dyno hours/month** (about 700 hours of 24/7 uptime)
- ✅ **Traditional PaaS** - familiar deployment model
- ✅ **Add-ons ecosystem** - PostgreSQL, Redis, monitoring
- ✅ **Git-based deployment** - simple push to deploy
- ✅ **Heroku CLI** - powerful command-line tools
- ✅ **Process management** - automatic restarts and scaling
- ✅ **Custom domains** with SSL

## 💰 **Free Tier Details**

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **Dyno Hours** | 1000/month | ~23 days of 24/7 operation |
| **RAM** | 512MB | Per dyno |
| **CPU** | 1x-4x shared | Varies by load |
| **Storage** | Ephemeral | Files don't persist across restarts |
| **Add-ons** | Limited free tiers | PostgreSQL, Redis available |
| **Sleep Mode** | After 30 min idle | Wakes up on request |

**Perfect for**: Development, testing, and small production bots.

## 🚀 **Step-by-Step Deployment**

### **Step 1: Install Heroku CLI**

#### **macOS**
```bash
# Using Homebrew
brew tap heroku/brew && brew install heroku

# Or download from Heroku website
# https://devcenter.heroku.com/articles/heroku-cli
```

#### **Linux**
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# CentOS/RHEL
sudo yum install heroku

# Or snap
sudo snap install --classic heroku
```

#### **Windows**
```bash
# Download installer from:
# https://devcenter.heroku.com/articles/heroku-cli

# Or use Chocolatey
choco install heroku-cli
```

### **Step 2: Prepare Your Application**

#### **Verify Package.json**
```json
{
  "name": "ai-whatsapp-bot",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

#### **Create Procfile**
```bash
# Create Procfile in project root
echo "web: npm start" > Procfile

# Verify Procfile
cat Procfile
```

#### **Update Port Configuration**
```typescript
// src/index.ts - Ensure dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
```

### **Step 3: Initialize Git Repository**

```bash
# Initialize git if not already done
git init

# Add .gitignore
echo "node_modules/
.env
dist/
*.log" > .gitignore

# Add and commit files
git add .
git commit -m "Initial commit for Heroku deployment"
```

### **Step 4: Login to Heroku**

```bash
# Login to Heroku
heroku login

# This will open browser for authentication
# Or use CLI-only login
heroku login -i
```

### **Step 5: Create Heroku Application**

```bash
# Create new Heroku app
heroku create your-bot-name

# Or with specific region
heroku create your-bot-name --region us

# Verify app creation
heroku apps:info your-bot-name
```

### **Step 6: Configure Environment Variables**

#### **Set Required Variables**
```bash
# Together AI
heroku config:set TOGETHER_API_KEY=your_together_ai_key_here

# Qdrant
heroku config:set QDRANT_URL=https://your-cluster.qdrant.tech
heroku config:set QDRANT_API_KEY=your_qdrant_api_key_here

# Admin configuration
heroku config:set ADMIN_NUMBERS=+1234567890,+0987654321

# Bot configuration
heroku config:set USE_BAILEYS=true
heroku config:set WA_SESSION_NAME=wa-bot-session
heroku config:set NODE_ENV=production
```

#### **Optional Variables**
```bash
# Logging
heroku config:set LOG_LEVEL=info

# WhatsApp Business API (if used)
heroku config:set USE_WHATSAPP_BUSINESS=false
heroku config:set WA_BUSINESS_ACCESS_TOKEN=your_token
heroku config:set WA_BUSINESS_PHONE_NUMBER_ID=your_phone_id
```

#### **Verify Configuration**
```bash
# List all config vars
heroku config

# Get specific variable
heroku config:get TOGETHER_API_KEY
```

### **Step 7: Deploy to Heroku**

```bash
# Add Heroku remote (if not auto-added)
heroku git:remote -a your-bot-name

# Deploy to Heroku
git push heroku main

# Watch deployment logs
heroku logs --tail
```

### **Step 8: Monitor Deployment**

```bash
# Check application status
heroku ps

# View recent logs
heroku logs --tail

# Check for successful deployment messages:
# "Build succeeded"
# "Launching..."
# "State changed from starting to up"
```

### **Step 9: Scale and Test**

```bash
# Ensure at least one dyno is running
heroku ps:scale web=1

# Test the application
heroku open

# Or test specific endpoint
curl https://your-bot-name.herokuapp.com/health
```

### **Step 10: Connect WhatsApp**

#### **View QR Code in Logs**
```bash
# Watch logs for QR code
heroku logs --tail

# Look for QR code ASCII art
# Scan with WhatsApp on your phone
```

#### **Test Bot Functionality**
```bash
# From your admin WhatsApp number:
/menu    # Should show admin panel
/status  # Should show system status

# Upload a test file
# Bot should process successfully
```

## 🔧 **Advanced Configuration**

### **Add-ons Management**

#### **PostgreSQL (Optional)**
```bash
# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Get database URL
heroku config:get DATABASE_URL

# Connect to database
heroku pg:psql
```

#### **Redis (Optional)**
```bash
# Add Redis
heroku addons:create heroku-redis:mini

# Get Redis URL
heroku config:get REDIS_URL

# Redis CLI
heroku redis:cli
```

#### **Monitoring Add-ons**
```bash
# Add New Relic for monitoring
heroku addons:create newrelic:wayne

# Add Papertrail for logs
heroku addons:create papertrail:choklad

# List all add-ons
heroku addons
```

### **Custom Domain Setup**

#### **Add Custom Domain**
```bash
# Add domain to app
heroku domains:add bot.yourdomain.com

# Get DNS target
heroku domains

# Add CNAME record in your DNS provider:
# CNAME bot your-bot-name.herokuapp.com
```

#### **SSL Certificate**
```bash
# Add SSL certificate (requires paid dyno)
heroku certs:auto:enable

# Or add custom certificate
heroku certs:add server.crt server.key
```

### **Process Management**

#### **Scaling**
```bash
# Scale web dynos
heroku ps:scale web=1

# Scale worker dynos (if you have background jobs)
heroku ps:scale worker=1

# Check current scaling
heroku ps
```

#### **Process Types**
```bash
# Update Procfile for multiple processes
echo "web: npm start
worker: node dist/worker.js" > Procfile

# Deploy changes
git add Procfile
git commit -m "Add worker process"
git push heroku main
```

### **Environment Management**

#### **Multiple Environments**
```bash
# Create staging app
heroku create your-bot-name-staging

# Deploy to staging
git push staging main

# Promote staging to production
heroku pipelines:promote -a your-bot-name-staging
```

#### **Configuration Management**
```bash
# Copy config from one app to another
heroku config:set $(heroku config:get -s -a source-app) -a target-app

# Bulk update from file
heroku config:set $(cat .env.production)
```

## 📊 **Monitoring and Logging**

### **Application Logs**

#### **View Logs**
```bash
# Real-time logs
heroku logs --tail

# Specific number of lines
heroku logs -n 100

# Filter by source
heroku logs --source app

# Filter by dyno
heroku logs --dyno web.1
```

#### **Log Management**
```bash
# Add Papertrail for log management
heroku addons:create papertrail:choklad

# View logs in Papertrail
heroku addons:open papertrail
```

### **Performance Monitoring**

#### **Heroku Metrics**
```bash
# View app metrics
heroku logs --tail | grep "heroku\[router\]"

# Check dyno load
heroku ps:exec
```

#### **New Relic Integration**
```bash
# Add New Relic
heroku addons:create newrelic:wayne

# Configure New Relic
heroku config:set NEW_RELIC_APP_NAME="AI WhatsApp Bot"

# View New Relic dashboard
heroku addons:open newrelic
```

### **Health Checks**

#### **Built-in Health Check**
```typescript
// src/index.ts - Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  });
});
```

#### **External Monitoring**
```bash
# Use external services to monitor uptime
# Examples: UptimeRobot, Pingdom, StatusCake
# Set up HTTP checks on: https://your-bot-name.herokuapp.com/health
```

## 🐛 **Troubleshooting**

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Check build logs
heroku logs --tail

# Common issues:
# 1. Missing start script
echo '"start": "node dist/index.js"' # Must exist in package.json

# 2. Node version mismatch
echo '"engines": {"node": "18.x"}' # Specify in package.json

# 3. Build command missing
echo '"heroku-postbuild": "npm run build"' # Add to scripts
```

#### **Application Crashes**
```bash
# Check crash logs
heroku logs --tail

# Restart application
heroku restart

# Check dyno status
heroku ps

# Common crash causes:
# 1. Port binding issues
# 2. Environment variable missing
# 3. Memory limit exceeded
# 4. Unhandled exceptions
```

### **Runtime Issues**

#### **Memory Issues**
```bash
# Monitor memory usage
heroku logs --tail | grep "memory"

# Check for memory leaks
# Optimize code if consistently hitting 512MB limit

# Upgrade dyno type if needed
heroku ps:type web=standard-1x
```

#### **Sleep Mode Issues**
```bash
# Free dynos sleep after 30 minutes
# This is normal behavior

# Solutions:
# 1. Upgrade to paid dyno (no sleep)
# 2. Use external service to ping app
# 3. Accept sleep mode for low-traffic bots
```

#### **WhatsApp Connection Issues**
```bash
# Check for QR code in logs
heroku logs --tail | grep -A 20 "QR Code"

# Verify environment variables
heroku config:get ADMIN_NUMBERS

# Check session persistence
# Note: Heroku has ephemeral filesystem
# Sessions may be lost on dyno restart
```

### **Performance Issues**

#### **Slow Response Times**
```bash
# Check router logs
heroku logs --tail | grep "heroku\[router\]"

# Look for high response times
# service=1200ms (slow)
# service=50ms (good)

# Optimize code:
# 1. Reduce AI model size
# 2. Implement caching
# 3. Optimize database queries
```

#### **Timeout Issues**
```bash
# Heroku has 30-second request timeout
# For long-running operations:
# 1. Use background jobs
# 2. Implement async processing
# 3. Return early responses
```

## 💰 **Cost Management**

### **Free Tier Usage**

#### **Monitor Dyno Hours**
```bash
# Check dyno usage
heroku ps

# View billing information
heroku billing

# Typical usage:
# 24/7 operation: ~744 hours/month (within 1000 limit)
# With sleep mode: ~400-600 hours/month
```

#### **Optimize Usage**
```bash
# Strategies to stay within free tier:
# 1. Use sleep mode strategically
# 2. Scale down during low usage
# 3. Use scheduler for periodic tasks
# 4. Monitor add-on usage
```

### **Cost Optimization**

#### **Dyno Management**
```bash
# Scale down when not needed
heroku ps:scale web=0

# Scale up when needed
heroku ps:scale web=1

# Use scheduler for periodic tasks
heroku addons:create scheduler:standard
```

#### **Add-on Management**
```bash
# Monitor add-on costs
heroku addons

# Remove unused add-ons
heroku addons:destroy addon-name

# Upgrade only when necessary
```

## 🔄 **CI/CD and Development**

### **Deployment Pipeline**

#### **Heroku Pipeline**
```bash
# Create pipeline
heroku pipelines:create your-bot-pipeline

# Add apps to pipeline
heroku pipelines:add your-bot-name-staging --stage staging
heroku pipelines:add your-bot-name --stage production

# Promote from staging to production
heroku pipelines:promote -a your-bot-name-staging
```

#### **GitHub Integration**
```bash
# Connect GitHub repository
# Go to Heroku Dashboard > Deploy > GitHub
# Enable automatic deploys from main branch
```

### **Development Workflow**

```bash
# 1. Develop locally
npm run dev

# 2. Test build
npm run build
npm start

# 3. Deploy to staging
git push staging main

# 4. Test staging
curl https://your-bot-name-staging.herokuapp.com/health

# 5. Promote to production
heroku pipelines:promote -a your-bot-name-staging
```

### **Database Management**

#### **Database Migrations**
```bash
# Run migrations on deploy
echo "release: npm run migrate" >> Procfile

# Manual migration
heroku run npm run migrate

# Database backup
heroku pg:backups:capture
```

#### **Data Management**
```bash
# Connect to database
heroku pg:psql

# Import data
heroku pg:psql < data.sql

# Export data
heroku pg:psql -c "\copy table TO 'data.csv' CSV HEADER"
```

## 📚 **Best Practices**

### **Application Design**
```bash
# Heroku-friendly practices:
# 1. Use environment variables for configuration
# 2. Log to stdout/stderr
# 3. Handle graceful shutdowns
# 4. Use ephemeral filesystem appropriately
# 5. Design for horizontal scaling
```

### **Security**
```bash
# Security best practices:
# 1. Never commit secrets to git
# 2. Use Heroku config vars
# 3. Enable HTTPS
# 4. Rotate API keys regularly
# 5. Use least privilege access
```

### **Performance**
```bash
# Performance optimization:
# 1. Use CDN for static assets
# 2. Implement caching strategies
# 3. Optimize database queries
# 4. Use connection pooling
# 5. Monitor application metrics
```

## 🎯 **Next Steps**

After successful Heroku deployment:

1. **Test All Features**:
   - WhatsApp connection and QR code
   - Admin commands functionality
   - File upload processing
   - Web widget endpoints

2. **Set Up Monitoring**:
   - Add monitoring add-ons
   - Configure alerts
   - Set up external uptime monitoring

3. **Configure Domain** (Optional):
   - Add custom domain
   - Configure DNS records
   - Set up SSL certificate

4. **Optimize Performance**:
   - Monitor dyno metrics
   - Optimize resource usage
   - Implement caching strategies

5. **Plan for Scaling**:
   - Monitor dyno hours usage
   - Plan upgrade path if needed
   - Consider add-ons for production

## 📚 **Related Guides**

- 🔧 **[Environment Setup](../ENVIRONMENT.md)** - API keys and configuration
- 🎓 **[User Training Guide](../USER_TRAINING_GUIDE.md)** - Train your AI
- 👨‍💼 **[Admin Guide](../ADMIN_GUIDE.md)** - Master admin commands
- 🐛 **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and fixes
- 🚂 **[Railway Alternative](RAILWAY.md)** - Compare with Railway

---

**🎉 Congratulations!** Your AI WhatsApp bot is now running on Heroku with 1000 free dyno hours per month, professional PaaS hosting, and excellent developer tools! 🤖✨

**Note**: Remember that free dynos sleep after 30 minutes of inactivity. For 24/7 operation, consider upgrading to a paid dyno.

**Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) or create an issue on GitHub. 