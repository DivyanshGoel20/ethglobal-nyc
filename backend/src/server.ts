import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple NFT API endpoint
app.post('/api/nfts', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Fetching NFTs for wallet: ${walletAddress}`);

    // Get OpenSea API key from environment variables
    const openseaApiKey = process.env.OPENSEA_API_KEY;
    if (!openseaApiKey) {
      throw new Error('OPENSEA_API_KEY environment variable is not set');
    }

    // Call the real MCP server with your access token
    const mcpResponse = await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}&limit=50&offset=0`, {
      method: 'GET',
      headers: {
        'X-API-KEY': openseaApiKey,
        'Accept': 'application/json',
      },
    });

    if (!mcpResponse.ok) {
      throw new Error(`MCP server error: ${mcpResponse.status}`);
    }

    const nftData = await mcpResponse.json();
    console.log(`✅ MCP Response received:`, nftData);

    // Transform the MCP response to match our frontend format
    const transformedData = {
      items: nftData.assets || []
    };

    console.log(`✅ Returning ${transformedData.items.length} NFTs from MCP server`);
    res.json(transformedData);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Failed to fetch NFT data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test endpoint - GET request to test API
app.get('/api/nfts', (req, res) => {
  res.json({
    message: 'API is working! Use POST /api/nfts with wallet address to get NFTs',
    test: 'This endpoint works - try POST with {"walletAddress": "0x..."}'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'NFT API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🎨 NFT API: http://localhost:${PORT}/api/nfts`);
  console.log(`✅ MCP integration active with OpenSea API`);
});
