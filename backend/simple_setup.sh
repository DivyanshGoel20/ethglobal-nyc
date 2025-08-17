#!/bin/bash

echo "🚀 Setting up uAgent MCP Server on WSL..."
echo "=========================================="

# Check Python version
python3 --version

# Remove existing venv if it exists
if [ -d "venv" ]; then
    echo "🔄 Removing existing virtual environment..."
    rm -rf venv
fi

# Create new virtual environment
echo "🔄 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "🔄 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "🔄 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Activate the virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Test the uAgent:"
echo "   python3 test_uagent.py"
echo ""
echo "3. Run the MCP server:"
echo "   python3 mcp_server.py"
echo ""
echo "🌐 The server will be available at: http://localhost:8000"
echo "📚 API documentation: http://localhost:8000/docs"
