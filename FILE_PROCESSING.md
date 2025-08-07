# 📄 File Processing Guide

Complete guide to training your AI WhatsApp bot with **PDF, DOCX, CSV, JSON, and text files**. Upload documents directly through WhatsApp for intelligent AI responses.

> **⚡ Quick Setup**: [Quick Start Guide](QUICK_START.md)  
> **👨‍💼 Admin Commands**: [Admin Guide](ADMIN_GUIDE.md)

## 🎯 **What You Can Upload**

Your AI bot can process and learn from these file types:

| File Type | Extension | Processing Method | Best For |
|-----------|-----------|-------------------|----------|
| **PDF** | `.pdf` | Text extraction | Documents, manuals, reports, brochures |
| **Word** | `.docx` | Text extraction | Proposals, contracts, documentation |
| **Text** | `.txt`, `.md` | Direct reading | FAQs, guides, plain documentation |
| **CSV** | `.csv` | Q&A parsing | Structured question-answer data |
| **JSON** | `.json` | Data parsing | Structured content, API responses |

## 📱 **How to Upload Files**

### **Step 1: Access File Upload**
From your admin WhatsApp number, use any of these commands:
```
/file       - Show file upload guide
/upload     - Same as /file
/bulk-train - Show bulk training options (includes files)
```

### **Step 2: Upload Your File**
1. **Attach File**: Use WhatsApp's paperclip (📎) button
2. **Select Document**: Choose your PDF, DOCX, or other file
3. **Send**: The bot automatically detects and processes it
4. **Confirmation**: Get detailed processing results

### **Step 3: Test AI Knowledge**
After upload, test that the AI learned the content:
```
You: "What does the document say about pricing?"
Bot: [AI response based on uploaded content]
```

## 📄 **PDF File Processing**

### **What PDFs Work Best**
- ✅ **Text-based PDFs** - Documents with selectable text
- ✅ **Reports and manuals** - Business documents
- ✅ **Brochures and flyers** - Marketing materials
- ❌ **Scanned images** - PDFs that are just images (no OCR yet)
- ❌ **Password protected** - Encrypted PDFs

### **PDF Processing Example**
```
Admin: [Uploads company-brochure.pdf]
Bot: 🎉 File Uploaded Successfully!

📄 File: company-brochure.pdf
📊 Processed: 12 content chunks
✅ Status: Added to AI knowledge base
🧠 Ready: AI can now answer questions about this content

What was added:
1. Our company provides web development services for small and medium businesses...
2. We specialize in React, Node.js, and TypeScript development with modern best practices...
3. Our pricing starts at $100/hour for development work. Contact us for custom quotes...
...and 9 more chunks

Type /menu for more training options! 🚀
```

### **PDF Best Practices**
- **File Size**: Keep under 10MB for best performance
- **Text Quality**: Ensure text is selectable (not scanned images)
- **Content Structure**: Well-organized documents work better
- **Language**: English works best (other languages may vary)

## 📝 **DOCX File Processing**

### **What DOCX Files Work Best**
- ✅ **Word documents** - .docx format (not .doc)
- ✅ **Business proposals** - Service descriptions, pricing
- ✅ **Documentation** - User guides, procedures
- ✅ **Contracts and agreements** - Terms and conditions
- ❌ **Complex formatting** - Tables and images may not process well

### **DOCX Processing Example**
```
Admin: [Uploads service-proposal.docx]
Bot: 🎉 File Uploaded Successfully!

📄 File: service-proposal.docx
📊 Processed: 8 content chunks
✅ Status: Added to AI knowledge base

What was added:
1. Service Proposal for Web Development. We offer comprehensive web development services...
2. Project Timeline: Phase 1 - Discovery and Planning (2 weeks), Phase 2 - Design (3 weeks)...
3. Investment: Total project cost is $15,000 with payment terms of 50% upfront...
...and 5 more chunks
```

### **DOCX Best Practices**
- **Use .docx format** (not older .doc format)
- **Simple formatting** works best
- **Clear headings** help with content organization
- **Avoid complex tables** - use simple text instead

## 📊 **CSV File Processing**

### **CSV Format Requirements**
Your CSV file should have this structure:
```csv
question,answer
"What are your business hours?","We're open Monday-Friday 9AM-5PM EST"
"How do I contact support?","Email us at support@company.com or call (555) 123-4567"
"What services do you offer?","We provide web development, mobile apps, and consulting"
```

### **CSV Processing Example**
```
Admin: [Uploads faq-data.csv]
Bot: 🎉 File Uploaded Successfully!

📄 File: faq-data.csv
📊 Processed: 25 content chunks
✅ Status: Added to AI knowledge base

What was added:
1. Q: What are your business hours? A: We're open Monday-Friday 9AM-5PM EST
2. Q: How do I contact support? A: Email us at support@company.com or call (555) 123-4567
3. Q: What services do you offer? A: We provide web development, mobile apps, and consulting
...and 22 more chunks
```

### **CSV Best Practices**
- **First row**: Must be `question,answer`
- **Quotes**: Use quotes around text with commas
- **Encoding**: Save as UTF-8 for special characters
- **Size**: Keep reasonable (< 1000 rows for best performance)

## 🔧 **JSON File Processing**

### **Supported JSON Formats**

#### **FAQ Format**
```json
[
  {
    "question": "What is your refund policy?",
    "answer": "We offer a 30-day money-back guarantee on all services"
  },
  {
    "question": "Do you offer custom development?",
    "answer": "Yes, we create custom solutions tailored to your business needs"
  }
]
```

#### **Content Format**
```json
[
  {
    "title": "About Our Company",
    "content": "We are a full-service web development agency with over 10 years of experience..."
  },
  {
    "title": "Our Services",
    "content": "We offer web development, mobile apps, e-commerce solutions, and digital marketing..."
  }
]
```

### **JSON Processing Example**
```
Admin: [Uploads company-info.json]
Bot: 🎉 File Uploaded Successfully!

📄 File: company-info.json
📊 Processed: 15 content chunks
✅ Status: Added to AI knowledge base

What was added:
1. Q: What is your refund policy? A: We offer a 30-day money-back guarantee...
2. About Our Company: We are a full-service web development agency...
3. Our Services: We offer web development, mobile apps, e-commerce solutions...
```

## 📋 **Text File Processing**

### **Supported Text Formats**
- **`.txt`** - Plain text files
- **`.md`** - Markdown files

### **Text File Best Practices**
```
# Company Information

## About Us
We are a leading web development company specializing in modern technologies.

## Services
- Web Development (React, Vue, Angular)
- Backend Development (Node.js, Python, PHP)
- Mobile Apps (React Native, Flutter)
- Cloud Solutions (AWS, Azure, GCP)

## Contact
Email: hello@company.com
Phone: (555) 123-4567
Website: https://company.com
```

### **Text Processing Example**
```
Admin: [Uploads company-info.txt]
Bot: 🎉 File Uploaded Successfully!

📄 File: company-info.txt
📊 Processed: 6 content chunks
✅ Status: Added to AI knowledge base

What was added:
1. Company Information. About Us: We are a leading web development company...
2. Services: Web Development (React, Vue, Angular), Backend Development...
3. Contact: Email: hello@company.com, Phone: (555) 123-4567...
```

## 🔄 **How File Processing Works**

### **Technical Process**
```
File Upload (WhatsApp)
        ↓
File Type Detection (.pdf, .docx, etc.)
        ↓
Content Extraction
├── PDF: pdf-parse library
├── DOCX: mammoth library  
├── CSV: Custom parser
├── JSON: JSON.parse
└── TXT: Direct reading
        ↓
Text Chunking (1000 characters optimal)
        ↓
Embedding Generation (Together AI)
        ↓
Vector Storage (Qdrant Database)
        ↓
Ready for AI Responses!
```

### **Chunking Strategy**
- **Chunk Size**: 1000 characters for optimal AI processing
- **Context Preservation**: Maintains relationships between content
- **Metadata Tracking**: Source file, chunk index, timestamps
- **Smart Splitting**: Splits on sentences when possible

### **Embedding and Storage**
- **Vector Generation**: Each chunk becomes a 768-dimensional vector
- **Similarity Search**: Finds relevant content using cosine similarity
- **Context Retrieval**: Gets top 3 most relevant chunks (score > 0.7)
- **AI Integration**: Combines context with user question for intelligent responses

## 🎯 **Advanced File Training**

### **Bulk File Upload**
Upload multiple files in sequence:
```
Admin: /bulk-train
Bot: [Shows bulk training options]

Admin: [Upload file 1]
Bot: [Processes file 1]

Admin: [Upload file 2]  
Bot: [Processes file 2]

Admin: [Upload file 3]
Bot: [Processes file 3]
```

### **File Organization Strategy**
- **Company Info**: Upload general company information first
- **Services**: Add detailed service descriptions
- **FAQs**: Include frequently asked questions
- **Policies**: Add terms, privacy policy, refund policy
- **Contact**: Include contact information and hours

### **Training Validation**
After uploading files, test the AI:
```
# Test general knowledge
"Tell me about your company"

# Test specific services  
"What web development services do you offer?"

# Test policies
"What is your refund policy?"

# Test contact info
"How can I contact support?"
```

## ❌ **Troubleshooting File Issues**

### **File Upload Failures**

#### **"No content could be extracted"**
- **PDF**: File might be scanned images (no selectable text)
- **DOCX**: File might be corrupted or password protected
- **Solution**: Try saving/exporting the file again

#### **"File processing error"**
- **Large files**: Keep under 10MB
- **Corrupted files**: Re-save the original file
- **Unsupported format**: Use supported extensions only

#### **"File format not supported"**
- **Check extension**: Must be .pdf, .docx, .txt, .md, .csv, .json
- **Case sensitivity**: Use lowercase extensions
- **File type**: Ensure actual file type matches extension

### **Content Quality Issues**

#### **AI doesn't seem to know uploaded content**
```bash
# Check if upload was successful
/status  # Shows system status and document count

# Test with specific questions from the document
"What does the document say about [specific topic]?"

# Re-upload if necessary
/file  # Upload again
```

#### **Partial content missing**
- **Large documents**: May be chunked, some parts might be less relevant
- **Complex formatting**: Tables and images don't process well
- **Solution**: Use simpler text formatting

### **Performance Issues**

#### **Slow processing**
- **Large files**: Break into smaller files
- **Complex documents**: Simplify formatting
- **Multiple files**: Upload one at a time

#### **Memory errors**
- **File size**: Keep under 10MB per file
- **Batch uploads**: Wait between uploads
- **Server resources**: Check deployment platform limits

## 📊 **File Processing Statistics**

### **Processing Performance**
| File Type | Avg Processing Time | Max Recommended Size |
|-----------|-------------------|---------------------|
| **PDF** | 5-15 seconds | 10MB |
| **DOCX** | 3-10 seconds | 5MB |
| **TXT/MD** | 1-3 seconds | 2MB |
| **CSV** | 2-5 seconds | 1MB |
| **JSON** | 1-3 seconds | 1MB |

### **Content Extraction Rates**
- **PDF (text-based)**: ~95% accuracy
- **PDF (scanned)**: Not supported (no OCR)
- **DOCX**: ~90% accuracy (simple formatting)
- **TXT/MD**: 100% accuracy
- **CSV**: 100% accuracy (proper format)
- **JSON**: 100% accuracy (valid JSON)

## 🚀 **Best Practices Summary**

### **File Preparation**
1. **Use supported formats**: PDF, DOCX, TXT, MD, CSV, JSON
2. **Keep files under 10MB** for best performance
3. **Use clear, simple formatting** (avoid complex tables/images)
4. **Ensure text is selectable** in PDFs
5. **Save as UTF-8** for special characters

### **Content Organization**
1. **Start with company basics** (about, services, contact)
2. **Add specific FAQs** for common questions
3. **Include policies** (terms, privacy, refund)
4. **Upload incrementally** and test between uploads
5. **Validate AI responses** after each upload

### **Training Strategy**
1. **Upload core documents first**
2. **Test AI responses** after each upload
3. **Add more specific content** based on gaps
4. **Use `/status`** to monitor document count
5. **Regular updates** as content changes

## 📚 **Related Guides**

- 🎓 **[User Training Guide](USER_TRAINING_GUIDE.md)** - Complete training walkthrough
- 👨‍💼 **[Admin Guide](ADMIN_GUIDE.md)** - All admin commands
- 🧠 **[Qdrant Guide](QDRANT_GUIDE.md)** - How vector database works
- 🏗️ **[Architecture](ARCHITECTURE.md)** - System design details

---

**🎉 Ready to train your AI?** Start uploading your documents and watch your bot become an expert on your content! 🤖📄✨

**Need help?** Check our [Troubleshooting Guide](TROUBLESHOOTING.md) or [Admin Guide](ADMIN_GUIDE.md) for more assistance. 