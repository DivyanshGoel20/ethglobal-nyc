# 🚀 **Simple Setup Guide for uAgent MCP Server**

## 📋 **What This Does (The Big Picture)**

You're building an **AI-powered NFT assistant** that:
1. **Takes questions** from users (like "What's the floor price of Bored Ape?")
2. **Uses AI** to understand what they want
3. **Fetches real data** from OpenSea (current prices, NFT info)
4. **Returns answers** in a user-friendly way

## 🔄 **How It All Works Together**

```
User asks question → Frontend → MCP Server → uAgent → OpenSea API → Real NFT Data
```

### **File Roles:**
- **`mcp_server.py`** = Your web server (like a waiter taking orders)
- **`uagent.py`** = Your AI agent (like a smart assistant)
- **`test_uagent.py`** = Test script (makes sure everything works)
- **`requirements.txt`** = Shopping list of Python packages you need

## 🛠️ **Quick Setup (WSL/Linux)**

### **Step 1: Run the setup script**
```bash
cd backend
chmod +x simple_setup.sh
./simple_setup.sh
```

### **Step 2: Activate the environment**
```bash
source venv/bin/activate
```

### **Step 3: Test the uAgent**
```bash
python3 test_uagent.py
```
**Expected**: You should see "✅ Test agent started successfully!"

### **Step 4: Start the MCP server**
```bash
python3 mcp_server.py
```
**Expected**: Server starts at http://localhost:8000

## 🧪 **Test It Works**

1. **Open your browser** to http://localhost:8000
2. **You should see**: "OpenSea MCP Server is running!"
3. **Check the docs**: http://localhost:8000/docs

## 🔗 **Connect to Frontend**

Your React frontend is already configured to call `http://localhost:8000/api/mcp`

## 🚨 **If Something Goes Wrong**

### **Port 8000 already in use?**
```bash
# Find what's using the port
sudo netstat -tulpn | grep :8000

# Kill the process
sudo kill -9 <PID>
```

### **Permission denied?**
```bash
chmod +x simple_setup.sh
```

### **Python not found?**
```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip
```

## 🎯 **What You'll Get**

- ✅ **Working uAgent** that can process queries
- ✅ **MCP server** that your frontend can talk to
- ✅ **Real OpenSea data** for NFT questions
- ✅ **API endpoints** for collection info and searches

## 🌟 **Example Queries You Can Test**

- "What's the floor price of Bored Ape Yacht Club?"
- "Search for Bored Ape NFTs"
- "Show me Cryptopunks collection info"

---

**The goal**: Get real-time NFT data flowing from OpenSea → Your uAgent → Your Frontend! 🎉
