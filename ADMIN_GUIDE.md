# 👨‍💼 Admin Guide

Complete guide to managing your AI WhatsApp bot using powerful admin commands. Master the `/` prefix commands for full bot control.

> **⚡ Quick Setup**: [Quick Start Guide](QUICK_START.md)  
> **📄 File Processing**: [File Processing Guide](FILE_PROCESSING.md)

## 🎯 **Admin vs Normal Users**

### **Normal Users** 
- Chat naturally with the bot
- Get AI responses based on trained knowledge
- No access to admin features
- Simple, conversational experience

### **Admin Users**
- All normal user features **PLUS**
- Use `/` commands for bot control
- Train and manage the AI
- Upload files and documents
- System monitoring and management
- Web widget configuration

## 🔑 **Becoming an Admin**

Admins are configured in the environment variables:

```bash
# In your .env file or deployment settings
ADMIN_NUMBERS=+1234567890,+0987654321,+44987654321

# Format requirements:
# - Include country code (+1, +44, +91, etc.)
# - No spaces or special characters except +
# - Comma-separated for multiple admins
```

## 📋 **Complete Admin Commands Reference**

### **Essential Commands**

#### **`/menu`** - Main Admin Control Panel
Shows the complete admin interface with all available options.

```
Admin: /menu
Bot: 🤖 AI Training Menu

Choose what you'd like to do:

📚 Training Options:
1️⃣ Add FAQ (Question & Answer)
2️⃣ Add Company Info
3️⃣ Upload Document/File
4️⃣ Bulk Training Mode

🌐 Web Integration:
5️⃣ Generate Website Widget
6️⃣ View Widget Status

⚙️ Management:
7️⃣ View Training Status
8️⃣ Add New Admin
9️⃣ Help & Instructions

Commands:
• /help - Show all commands
• /status - System status
• /cancel - Cancel current session
```

#### **`/help`** - Show All Available Commands
Displays comprehensive list of all admin commands.

```
Admin: /help
Bot: 🆘 Admin Help & Commands

Essential Commands:
• /menu - Main admin control panel
• /help - Show all commands
• /status - System status and statistics
• /cancel - Cancel current training session

Training Commands:
• /train - Start interactive training mode
• /add-faq - Quick FAQ addition
• /bulk-train - Bulk training with files
• /file - File upload instructions
• /upload - Same as /file

System Management:
• /clear - Clean up sessions and temp files
• /logs - View recent system logs
• /restart - Restart bot services
• /backup - Check knowledge base backup

Web Integration:
• /widget - Get website chat widget code

Type any command to get started!
```

#### **`/status`** - System Status and Statistics
Shows comprehensive system information and statistics.

```
Admin: /status
Bot: 📊 System Status Report

🤖 Bot Status: Online ✅
🔗 WhatsApp: Connected ✅
🧠 AI Service: Together AI ✅
📊 Vector DB: Qdrant Connected ✅

📈 Statistics:
• Knowledge Base: 156 documents
• Active Sessions: 3
• Admin Numbers: 2
• Uptime: 2 days, 14 hours

💾 Storage:
• Collection: knowledge_base
• Vector Count: 1,247
• Last Updated: 2 hours ago

🌐 Web Widget: Active ✅
• Sessions Today: 23
• Messages: 87

System Status: All systems operational 🟢
✅ Ready for training
```

#### **`/cancel`** - Cancel Current Operation
Cancels any ongoing training session or operation.

```
Admin: /cancel
Bot: ✅ Training session cancelled. Type /menu to start again.
```

### **Training Commands**

#### **`/train`** - Start Interactive Training Mode
Launches the full training interface (same as `/menu` → option 1).

```
Admin: /train
Bot: 📚 Training Mode Activated

Choose training method:
1️⃣ Add FAQ (Question & Answer pairs)
2️⃣ Add Company Information
3️⃣ Upload Document/File
4️⃣ Bulk Training Mode

Send the number of your choice or type /cancel to exit.
```

#### **`/add-faq`** - Quick FAQ Addition
Directly starts FAQ training mode.

```
Admin: /add-faq
Bot: 📝 Adding FAQ

Please send the question you want to add:

Admin: What are your business hours?
Bot: Great! Now send the answer to this question:

Admin: We're open Monday-Friday 9AM-5PM EST, closed weekends.
Bot: 🎉 FAQ Added Successfully!

Q: What are your business hours?
A: We're open Monday-Friday 9AM-5PM EST, closed weekends.

✅ Added to knowledge base
🧠 AI can now answer this question

Type /menu for more options!
```

#### **`/bulk-train`** - Bulk Training Mode
Shows bulk training options including file upload.

```
Admin: /bulk-train
Bot: 📚 Bulk Training

Text Format:
Send multiple FAQ pairs like this:

Q: Your question here?
A: Your answer here.

Q: Another question?
A: Another answer.

File Upload:
📎 Attach any of these file types:
• .txt files with FAQ content
• .md files with documentation
• .csv files with Q&A pairs
• .json files with structured data
• .pdf files with documents/manuals
• .docx files with Word documents

Just attach the file and I'll process it automatically! 🚀
```

#### **`/file`** or **`/upload`** - File Upload Instructions
Shows detailed file upload guide.

```
Admin: /file
Bot: 📎 File Upload Training

Supported file types:
• Text files (.txt, .md) - Documentation, FAQs, guides
• CSV files (.csv) - Structured Q&A data
• JSON files (.json) - Structured training data
• PDF files (.pdf) - Documents, manuals, reports
• Word files (.docx) - Word documents, proposals

How to upload:
1. Attach your file to a WhatsApp message
2. Send it to me
3. I'll automatically process and train on the content

File format examples:

FAQ Text File:
```
Q: What are your business hours?
A: We're open Monday-Friday 9AM-5PM

Q: How do I contact support?
A: Email us at support@company.com
```

CSV Format:
```
question,answer
"What services do you offer?","We provide web design and development"
"What are your rates?","Our rates start at $100/hour"
```

Ready to upload? Just attach your file! 📁
```

### **System Management Commands**

#### **`/clear`** or **`/cleanup`** - Clean Up Sessions
Clears training sessions and temporary files while preserving important data.

```
Admin: /clear
Bot: 🧹 Session Cleanup Complete

✅ Cleared 5 training sessions
🗑️ Removed temporary files
💾 WhatsApp auth session preserved
🔄 System refreshed

Status: All clean! 🟢
```

#### **`/logs`** - View Recent System Logs
Shows recent system activity and logs.

```
Admin: /logs
Bot: 📋 Recent System Logs

[2024-01-15 10:30:15] System status check
[2024-01-15 10:25:42] Training session completed
[2024-01-15 10:20:18] WhatsApp connection stable
[2024-01-15 10:15:33] Vector database sync complete
[2024-01-15 10:10:07] File upload processed: company-faq.pdf

🔍 Full Logs:
Check server console for detailed logs

📊 Quick Stats:
• Active Sessions: 2
• Admin Numbers: 3
• System Status: Online 🟢

Type /status for more details.
```

#### **`/restart`** - Restart Bot Services
Restarts bot services (training sessions are cleared).

```
Admin: /restart
Bot: 🔄 Service Restart Initiated

✅ Training sessions cleared
🔄 Services refreshing...
⚡ System will be back online shortly

Note: WhatsApp connection maintained
Status: Restarting... 🟡

Type /status in a few seconds to check.
```

#### **`/backup`** - Check Knowledge Base Backup
Shows backup status and knowledge base information.

```
Admin: /backup
Bot: 💾 Knowledge Base Backup

📊 Current Stats:
• Total Documents: 1,247
• Collection: knowledge_base
• Backup Time: 2024-01-15 10:30:00

✅ Backup Status:
Vector database is automatically backed up by Qdrant Cloud

🔒 Data Security:
• All embeddings stored securely
• Training data preserved
• Admin settings maintained

Note: For manual export, use Qdrant dashboard
Type /status for system overview.
```

### **Web Integration Commands**

#### **`/widget`** - Get Website Chat Widget
Generates embeddable chat widget code for websites.

```
Admin: /widget
Bot: 🌐 Website Widget Code

📋 Quick Embed Code:
```html
<script>
(function() {
  var chatWidget = document.createElement('div');
  chatWidget.innerHTML = '<iframe src="https://your-bot.railway.app/widget.html" width="350" height="500" frameborder="0"></iframe>';
  document.body.appendChild(chatWidget);
})();
```

🎨 Customization:
• Change colors, position, theme
• Modify bot name and messages
• Responsive design included

🚀 Installation:
1. Copy code above
2. Paste before </body> tag
3. Save and publish

✨ Features:
• Same AI as WhatsApp bot
• All your training included
• Mobile-friendly design

Type /menu for more options!
```

## 🔄 **Admin Workflows**

### **Initial Bot Setup**
```
1. /status          # Check system status
2. /menu            # Access main menu
3. Upload company info files
4. /add-faq         # Add basic FAQs
5. Test responses   # Send normal questions
6. /widget          # Get website embed code
```

### **Daily Management**
```
1. /status          # Check system health
2. /logs            # Review recent activity
3. Handle user questions
4. Add new FAQs as needed
5. Upload new documents
```

### **Weekly Maintenance**
```
1. /status          # Full system check
2. /backup          # Verify backup status
3. /clear           # Clean up sessions
4. Review and update content
5. Test all major functions
```

### **Training New Content**
```
1. /file            # Review file upload guide
2. Upload documents # PDFs, DOCX, etc.
3. /add-faq         # Add specific Q&As
4. Test AI responses # Verify learning
5. /status          # Check document count
```

## 🎯 **Advanced Admin Features**

### **Multi-Admin Management**
- Multiple admins can work simultaneously
- Each admin has their own training session
- Commands are isolated per admin
- All admins see the same knowledge base

### **Session Management**
- Each admin has independent training sessions
- Sessions persist until `/cancel` or `/clear`
- System automatically manages session state
- Training data is immediately available to all users

### **File Upload Management**
- Supports multiple file types simultaneously
- Automatic content extraction and processing
- Real-time feedback on processing status
- Chunking optimization for AI performance

### **System Monitoring**
- Real-time status monitoring via `/status`
- Log access via `/logs` command
- Backup verification via `/backup`
- Performance metrics and statistics

## ⚡ **Quick Reference Card**

| Command | Purpose | Example |
|---------|---------|---------|
| `/menu` | Main admin panel | Full interface |
| `/status` | System status | Health check |
| `/train` | Start training | Interactive mode |
| `/file` | Upload files | PDF, DOCX, etc. |
| `/add-faq` | Quick FAQ | Q&A pairs |
| `/clear` | Cleanup | Clear sessions |
| `/widget` | Web embed | HTML code |
| `/help` | Show commands | Full list |
| `/cancel` | Cancel operation | Stop current task |

## 🔍 **Troubleshooting Admin Issues**

### **Command Not Working**
```bash
# Check if you're an admin
ADMIN_NUMBERS=+1234567890  # Must include your number

# Verify number format
+1234567890  # ✅ Correct (with country code)
1234567890   # ❌ Wrong (missing +)
+1 234 567 890  # ❌ Wrong (has spaces)
```

### **Training Not Working**
```bash
# Check system status
/status  # Look for errors

# Verify API keys
TOGETHER_API_KEY=together_xxx  # Must be valid
QDRANT_URL=https://xxx.qdrant.tech  # Must be accessible
```

### **File Upload Issues**
```bash
# Supported formats only
✅ .pdf, .docx, .txt, .md, .csv, .json
❌ .doc, .ppt, .xlsx, .rtf

# File size limits
✅ Under 10MB
❌ Over 10MB
```

### **Bot Not Responding**
```bash
# Check connection
/status  # System status

# Restart if needed
/restart  # Restart services

# Clear sessions
/clear  # Clean up
```

## 📚 **Related Guides**

- 📄 **[File Processing Guide](FILE_PROCESSING.md)** - Upload PDFs, DOCX, and more
- 🎓 **[User Training Guide](USER_TRAINING_GUIDE.md)** - Complete training walkthrough
- 🏗️ **[Architecture Guide](ARCHITECTURE.md)** - How the system works
- 🚀 **[Deployment Guide](DEPLOYMENT.md)** - Deploy to cloud platforms
- 🐛 **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Fix common issues

## 🎉 **Pro Tips**

### **Efficient Training**
1. **Start with basics**: Company info, services, contact
2. **Use file uploads**: Bulk process existing documents
3. **Add specific FAQs**: Handle common questions
4. **Test regularly**: Verify AI responses after training
5. **Update incrementally**: Add content as needed

### **System Management**
1. **Monitor regularly**: Use `/status` to check health
2. **Clean up weekly**: Use `/clear` to maintain performance
3. **Backup verification**: Check `/backup` monthly
4. **Log review**: Use `/logs` to spot issues early

### **User Experience**
1. **Train comprehensively**: Cover all user questions
2. **Test from user perspective**: Ask questions as a customer would
3. **Update content**: Keep information current
4. **Monitor conversations**: Learn from user interactions

---

**🎉 Congratulations!** You now have complete control over your AI WhatsApp bot. Use these admin commands to create an intelligent, helpful assistant that knows everything about your business! 🤖👨‍💼✨

**Need help?** Check our [Troubleshooting Guide](TROUBLESHOOTING.md) or [File Processing Guide](FILE_PROCESSING.md) for specific assistance. 