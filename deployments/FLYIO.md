# 🚁 Fly.io Deployment Guide

Deploy your AI WhatsApp bot to **Fly.io** with 3 shared VMs free and global edge deployment. Fly.io excels at global distribution and modern container deployment.

> **🔙 Back to**: [Deployment Guide](../DEPLOYMENT.md)  
> **⚡ Quick Setup**: [Quick Start Guide](../QUICK_START.md)

## 🎯 **Why Fly.io?**

- ✅ **3 shared VMs free** - run globally distributed
- ✅ **Global edge deployment** - deploy close to users
- ✅ **Modern container platform** - Docker-based deployment
- ✅ **Automatic scaling** - scale up/down based on demand
- ✅ **Persistent volumes** - data persistence across restarts
- ✅ **Custom domains** with automatic SSL
- ✅ **Built-in monitoring** and metrics

## 💰 **Free Tier Details**

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **VMs** | 3 shared VMs | 256MB RAM each |
| **CPU** | Shared CPU | Fair usage policy |
| **Storage** | 3GB persistent volumes | Per VM |
| **Bandwidth** | 160GB/month | Outbound traffic |
| **Regions** | All regions | Deploy globally |
| **IPv4** | 1 shared IPv4 | Custom domains supported |

**Perfect for**: Global WhatsApp bots with users worldwide.

## 🚀 **Step-by-Step Deployment**

### **Step 1: Install Fly CLI**

#### **macOS**
```bash
# Using Homebrew
brew install flyctl

# Or using curl
curl -L https://fly.io/install.sh | sh
```

#### **Linux**
```bash
# Using curl
curl -L https://fly.io/install.sh | sh

# Or download binary
wget https://github.com/superfly/flyctl/releases/latest/download/flyctl_Linux_x86_64.tar.gz
tar -xzf flyctl_Linux_x86_64.tar.gz
sudo mv flyctl /usr/local/bin/
```

#### **Windows**
```bash
# Using PowerShell
iwr https://fly.io/install.ps1 -useb | iex

# Or download from GitHub releases
# https://github.com/superfly/flyctl/releases
```

### **Step 2: Create Fly.io Account**

```bash
# Sign up and login
fly auth signup

# Or login if you have account
fly auth login

# Verify authentication
fly auth whoami
```

### **Step 3: Prepare Application**

#### **Create Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### **Create .dockerignore**
```bash
# .dockerignore
node_modules
.env
.git
README.md
Dockerfile
.dockerignore
```

#### **Update Package.json**
```json
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

### **Step 4: Initialize Fly Application**

```bash
# Initialize Fly app in your project directory
fly launch

# Follow the prompts:
# ? Choose an app name: ai-whatsapp-bot
# ? Choose a region: lax (Los Angeles)
# ? Would you like to set up a Postgresql database? No
# ? Would you like to set up an Upstash Redis database? No
# ? Create .dockerignore from 1 .gitignore files? Yes
```

### **Step 5: Configure fly.toml**

The `fly launch` command creates a `fly.toml` file. Update it:

```toml
# fly.toml
app = "ai-whatsapp-bot"
primary_region = "lax"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[mounts]
  source = "wa_sessions"
  destination = "/app/wa-bot-session"
```

### **Step 6: Create Persistent Volume**

```bash
# Create volume for WhatsApp sessions
fly volumes create wa_sessions --region lax --size 1

# Verify volume creation
fly volumes list
```

### **Step 7: Set Environment Variables**

```bash
# Set secrets (environment variables)
fly secrets set TOGETHER_API_KEY=your_together_ai_key_here
fly secrets set QDRANT_URL=https://your-cluster.qdrant.tech
fly secrets set QDRANT_API_KEY=your_qdrant_api_key_here
fly secrets set ADMIN_NUMBERS=+1234567890,+0987654321

# Bot configuration
fly secrets set USE_BAILEYS=true
fly secrets set WA_SESSION_NAME=wa-bot-session

# Optional secrets
fly secrets set LOG_LEVEL=info

# List all secrets
fly secrets list
```

### **Step 8: Deploy Application**

```bash
# Deploy to Fly.io
fly deploy

# Watch deployment logs
fly logs

# Check deployment status
fly status
```

### **Step 9: Monitor Deployment**

```bash
# Check application status
fly status

# View logs
fly logs --follow

# Check for successful deployment:
# "Starting instance"
# "Main child exited normally"
# "Starting clean up"
```

### **Step 10: Test Deployment**

```bash
# Get app URL
fly status

# Test health endpoint
curl https://ai-whatsapp-bot.fly.dev/health

# Check WhatsApp QR code in logs
fly logs --follow
```

### **Step 11: Connect WhatsApp**

```bash
# View logs for QR code
fly logs --follow

# Look for QR code ASCII art
# Scan with WhatsApp on your phone

# Test bot functionality
# Send /menu from admin number
```

## 🔧 **Advanced Configuration**

### **Multi-Region Deployment**

#### **Deploy to Multiple Regions**
```bash
# Clone app to different regions
fly scale count 1 --region lax  # Los Angeles
fly scale count 1 --region iad  # Washington D.C.
fly scale count 1 --region fra  # Frankfurt

# Check distribution
fly status
```

#### **Regional Configuration**
```toml
# fly.toml - Multi-region setup
[env]
  PRIMARY_REGION = "lax"

[[services]]
  http_checks = []
  internal_port = 3000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### **Persistent Storage**

#### **Volume Management**
```bash
# Create additional volumes
fly volumes create data --region lax --size 1

# Snapshot volume
fly volumes snapshots create vol_1234567890

# List snapshots
fly volumes snapshots list vol_1234567890

# Restore from snapshot
fly volumes create data_restore --from-snapshot vs_1234567890
```

#### **Session Persistence**
```typescript
// src/whatsapp.ts - Use mounted volume
import path from 'path';

const sessionPath = process.env.NODE_ENV === 'production' 
  ? '/app/wa-bot-session'  // Mounted volume in production
  : './wa-bot-session';    // Local directory in development

const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
```

### **Custom Domain Setup**

#### **Add Custom Domain**
```bash
# Add domain to app
fly certs create bot.yourdomain.com

# Check certificate status
fly certs show bot.yourdomain.com

# Add DNS records:
# A record: @ -> your-app.fly.dev (get IP from fly ips list)
# CNAME record: bot -> your-app.fly.dev
```

#### **SSL Configuration**
```bash
# Fly.io automatically manages SSL certificates
# Check certificate status
fly certs check bot.yourdomain.com

# Force HTTPS in fly.toml
[http_service]
  force_https = true
```

### **Database Integration**

#### **Add PostgreSQL**
```bash
# Create PostgreSQL cluster
fly postgres create --name ai-bot-db

# Attach to app
fly postgres attach --app ai-whatsapp-bot ai-bot-db

# Connection string automatically added to secrets
# DATABASE_URL will be available in environment
```

#### **Add Redis**
```bash
# Create Upstash Redis
fly redis create

# Connection details added to secrets
# REDIS_URL will be available in environment
```

### **Monitoring and Scaling**

#### **Application Metrics**
```bash
# View app metrics
fly dashboard

# Check resource usage
fly metrics

# View machine details
fly machine list
```

#### **Auto-scaling Configuration**
```toml
# fly.toml - Auto-scaling
[http_service]
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  max_machines_running = 3

[http_service.concurrency]
  type = "requests"
  hard_limit = 1000
  soft_limit = 800
```

## 📊 **Performance Optimization**

### **Resource Optimization**

#### **Memory Management**
```toml
# fly.toml - Optimize memory
[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512  # Increase if needed (uses more of free tier)
```

#### **CPU Optimization**
```typescript
// Optimize for shared CPU
process.env.UV_THREADPOOL_SIZE = '2';  // Limit thread pool

// Use efficient event loop
setImmediate(() => {
  // Non-blocking operations
});
```

### **Network Optimization**

#### **Connection Pooling**
```typescript
// src/qdrant.ts - Connection pooling
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  timeout: 10000,
  // Connection pooling handled by HTTP client
});
```

#### **Caching Strategy**
```typescript
// Implement caching for frequently accessed data
const cache = new Map();

async function getCachedResponse(query: string) {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const response = await generateResponse(query);
  cache.set(query, response);
  
  // Expire cache after 1 hour
  setTimeout(() => cache.delete(query), 3600000);
  
  return response;
}
```

### **Global Distribution**

#### **Edge Caching**
```toml
# fly.toml - Edge configuration
[http_service]
  internal_port = 3000
  force_https = true
  
  [[http_service.checks]]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    path = "/health"
    timeout = "5s"
```

#### **Regional Optimization**
```bash
# Deploy closer to users
fly regions list  # See available regions

# Add regions based on user location
fly scale count 1 --region nrt  # Tokyo (Asian users)
fly scale count 1 --region lhr  # London (European users)
```

## 🐛 **Troubleshooting**

### **Deployment Issues**

#### **Build Failures**
```bash
# Check build logs
fly logs --follow

# Common issues:
# 1. Dockerfile errors
# 2. Missing dependencies
# 3. Build timeout

# Debug build locally
docker build -t ai-whatsapp-bot .
docker run -p 3000:3000 ai-whatsapp-bot
```

#### **Volume Issues**
```bash
# Check volume status
fly volumes list

# Volume not mounting:
# 1. Check fly.toml [mounts] section
# 2. Verify volume exists in same region
# 3. Check permissions

# Create volume in correct region
fly volumes create wa_sessions --region lax
```

### **Runtime Issues**

#### **Application Crashes**
```bash
# Check crash logs
fly logs

# Common causes:
# 1. Out of memory (256MB limit)
# 2. Unhandled exceptions
# 3. Port binding issues
# 4. Missing environment variables

# Debug with SSH
fly ssh console
```

#### **Connection Issues**
```bash
# Check network connectivity
fly status

# Test internal connectivity
fly ssh console
# Inside machine:
curl localhost:3000/health

# Check external connectivity
curl https://your-app.fly.dev/health
```

### **Performance Issues**

#### **High Memory Usage**
```bash
# Monitor memory
fly metrics

# If consistently hitting 256MB:
# 1. Optimize code
# 2. Increase VM memory
# 3. Implement garbage collection

# Increase memory
fly scale memory 512
```

#### **Slow Response Times**
```bash
# Check response times in logs
fly logs | grep "response_time"

# Optimize:
# 1. Add caching
# 2. Optimize database queries
# 3. Use CDN for static assets
# 4. Deploy to multiple regions
```

### **WhatsApp Specific Issues**

#### **Session Persistence**
```bash
# Check volume mount
fly ssh console
ls -la /app/wa-bot-session

# If sessions not persisting:
# 1. Verify volume mount in fly.toml
# 2. Check volume permissions
# 3. Ensure correct path in code
```

#### **QR Code Issues**
```bash
# Check for QR code in logs
fly logs --follow | grep -A 20 "QR Code"

# If QR code not showing:
# 1. Check qrcode-terminal installation
# 2. Verify USE_BAILEYS=true
# 3. Check terminal width in logs
```

## 💰 **Cost Management**

### **Free Tier Usage**

```bash
# Monitor resource usage
fly dashboard

# Check current usage:
- VM hours used
- Bandwidth consumed
- Volume storage used

# Typical usage for WhatsApp bot:
Small bot: ~1-2 VMs (within free tier)
Medium bot: ~2-3 VMs (may exceed free tier)
Large bot: Requires paid plan
```

### **Optimization Strategies**

```bash
# Stay within free tier:
# 1. Use auto-stop/start machines
# 2. Optimize memory usage
# 3. Use efficient algorithms
# 4. Monitor bandwidth usage
# 5. Use shared CPU efficiently
```

### **Scaling Considerations**

```bash
# When to upgrade:
- Consistently using all 3 VMs
- High memory usage (>256MB)
- Need dedicated CPU
- Require more storage
- Need premium support
```

## 🔄 **CI/CD and Development**

### **GitHub Actions Integration**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: superfly/flyctl-actions/setup-flyctl@master
      
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### **Development Workflow**

```bash
# 1. Develop locally
npm run dev

# 2. Test with Docker
docker build -t ai-whatsapp-bot .
docker run -p 3000:3000 --env-file .env ai-whatsapp-bot

# 3. Deploy to staging
fly deploy --config fly.staging.toml

# 4. Test staging
curl https://ai-whatsapp-bot-staging.fly.dev/health

# 5. Deploy to production
fly deploy
```

### **Environment Management**

```bash
# Multiple environments
# Create separate apps for different environments

# Staging
fly apps create ai-whatsapp-bot-staging
fly deploy --app ai-whatsapp-bot-staging

# Production
fly apps create ai-whatsapp-bot-prod
fly deploy --app ai-whatsapp-bot-prod
```

## 📚 **Best Practices**

### **Application Design**
```bash
# Fly.io best practices:
# 1. Design for ephemeral machines
# 2. Use persistent volumes for data
# 3. Handle graceful shutdowns
# 4. Implement health checks
# 5. Use environment variables for config
```

### **Security**
```bash
# Security practices:
# 1. Use fly secrets for sensitive data
# 2. Enable HTTPS force redirect
# 3. Implement rate limiting
# 4. Use least privilege access
# 5. Regular security updates
```

### **Performance**
```bash
# Performance optimization:
# 1. Use auto-scaling appropriately
# 2. Implement caching strategies
# 3. Optimize for shared CPU
# 4. Use global distribution
# 5. Monitor resource usage
```

## 🎯 **Next Steps**

After successful Fly.io deployment:

1. **Test Global Distribution**:
   - Deploy to multiple regions
   - Test performance from different locations
   - Verify session persistence

2. **Set Up Monitoring**:
   - Enable Fly.io metrics
   - Set up external monitoring
   - Configure alerts

3. **Configure Custom Domain** (Optional):
   - Add your domain
   - Configure DNS records
   - Test SSL certificate

4. **Optimize Performance**:
   - Monitor resource usage
   - Implement caching
   - Optimize for global users

5. **Plan Scaling Strategy**:
   - Monitor free tier usage
   - Plan upgrade path
   - Consider regional distribution

## 📚 **Related Guides**

- 🔧 **[Environment Setup](../ENVIRONMENT.md)** - API keys and configuration
- 🎓 **[User Training Guide](../USER_TRAINING_GUIDE.md)** - Train your AI
- 👨‍💼 **[Admin Guide](../ADMIN_GUIDE.md)** - Master admin commands
- 🐛 **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and fixes
- 🚂 **[Railway Alternative](RAILWAY.md)** - Compare with Railway

---

**🎉 Congratulations!** Your AI WhatsApp bot is now running on Fly.io's global edge network with 3 free VMs, persistent storage, and worldwide distribution! 🤖✨

**Pro Tip**: Fly.io excels at global deployment. Consider deploying to multiple regions to serve users worldwide with low latency.

**Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) or create an issue on GitHub. 