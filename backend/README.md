# 🚀 uAgent MCP Server for OpenSea Integration

This backend provides a uAgent-powered MCP (Model Context Protocol) server that integrates with OpenSea API and provides a REST API for your frontend.

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Run the setup script (Windows)
python setup.py

# Or manually (Windows)
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# For Unix/Linux/Mac
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Test the uAgent
```bash
# Test basic uAgent functionality
python test_uagent.py
```

### 3. Run the MCP Server
```bash
# Start the server
python mcp_server.py
```

The server will be available at: http://localhost:8000

## 📡 API Endpoints

### Main MCP Endpoint
- **POST** `/api/mcp` - Process MCP queries
  ```json
  {
    "query": "What's the floor price of Bored Ape Yacht Club?",
    "type": "mcp_query"
  }
  ```

### Collection Information
- **GET** `/api/collection/{collection_slug}` - Get collection details
  - Example: `/api/collection/boredapeyachtclub`

### NFT Search
- **POST** `/api/search` - Search for NFTs
  ```json
  {
    "query": "Bored Ape",
    "collection_slug": "boredapeyachtclub",
    "chain": "ethereum",
    "limit": 20
  }
  ```

### Health Check
- **GET** `/health` - Server health status

## 🔧 How It Works

### 1. **uAgent Integration**
- The server runs a uAgent in the background
- Handles agent-to-agent communication
- Processes queries using OpenSea API

### 2. **OpenSea API Integration**
- Fetches real-time collection data
- Searches NFT items
- Provides floor prices, supply, volume data

### 3. **MCP Query Processing**
- Natural language query understanding
- Intent classification (floor price, search, general)
- Structured data responses

## 📊 Example Queries

### Floor Price Queries
- "What's the floor price of Bored Ape Yacht Club?"
- "Show me the floor price of Cryptopunks"
- "What's the current floor for Doodles?"

### Search Queries
- "Search for Bored Ape NFTs"
- "Find rare NFTs in the BAYC collection"
- "Show me trending NFTs"

### General Queries
- "What can you help me with?"
- "Tell me about NFT collections"

## 🎯 Response Format

### Collection Info Response
```json
{
  "type": "collection_info",
  "collection": "Bored Ape Yacht Club",
  "floor_price": "25.5",
  "floor_price_usd": "N/A",
  "total_supply": "10000",
  "total_volume": "1500000",
  "last_updated": "Now",
  "source": "opensea"
}
```

### NFT Search Response
```json
{
  "type": "nft_search_results",
  "query": "Bored Ape",
  "results": [
    {
      "name": "Bored Ape #1234",
      "token_id": "1234",
      "collection": "Bored Ape Yacht Club",
      "image_url": "https://...",
      "permalink": "https://...",
      "last_sale_price": "25.5"
    }
  ],
  "total_count": 20,
  "source": "opensea"
}
```

## 🔗 Frontend Integration

Your frontend VoiceAgent component is already configured to use this MCP server. It will:

1. **Send queries** to `/api/mcp`
2. **Receive structured data** from OpenSea
3. **Display results** in a user-friendly format
4. **Handle errors** gracefully

## 🚨 Troubleshooting

### Common Issues

1. **Port 8000 already in use**
   - Change the port in `mcp_server.py`
   - Update frontend URL accordingly

2. **OpenSea API rate limits**
   - The server includes error handling
   - Check your API key usage

3. **uAgent startup issues**
   - Run `python test_uagent.py` first
   - Check Python version (3.8+ required)

### Debug Mode
```bash
# Run with verbose logging
python mcp_server.py --debug
```

## 🔮 Future Enhancements

- [ ] Add more collection support
- [ ] Implement caching for API responses
- [ ] Add wallet balance queries
- [ ] Support for multiple chains
- [ ] Real-time price updates

## 📚 Documentation

- **FastAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

---

**Happy building! 🎉**
