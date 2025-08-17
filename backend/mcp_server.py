#!/usr/bin/env python3
"""
MCP Server that integrates with uAgent and provides REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import httpx
import asyncio
import json
from uagents import Agent, Context
# Remove the import that doesn't exist in this version

# Create FastAPI app
app = FastAPI(title="OpenSea MCP Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uAgent
mcp_agent = Agent(
    name="opensea_mcp_agent",
    seed="opensea-mcp-secret-key",
)

# OpenSea API configuration
OPENSEA_API_KEY = "dKY4AHXhZDJR7Afp9dqfxwC2VLU4AZ13rsLBH6VGDG"
OPENSEA_BASE_URL = "https://api.opensea.io/api/v1"

# Pydantic models for API requests
class MCPQuery(BaseModel):
    query: str
    type: Optional[str] = "general"

class CollectionQuery(BaseModel):
    collection_slug: str

class SearchQuery(BaseModel):
    query: str
    collection_slug: Optional[str] = None
    chain: Optional[str] = "ethereum"
    limit: Optional[int] = 20

# OpenSea API functions
async def get_collection_info(collection_slug: str) -> Dict[str, Any]:
    """Get collection information from OpenSea"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{OPENSEA_BASE_URL}/collection/{collection_slug}",
            headers={"X-API-KEY": OPENSEA_API_KEY}
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "type": "collection_info",
                "collection": data.get("collection", {}).get("name", collection_slug),
                "floor_price": data.get("collection", {}).get("stats", {}).get("floor_price", "N/A"),
                "floor_price_usd": "N/A",  # OpenSea doesn't provide this directly
                "total_supply": data.get("collection", {}).get("stats", {}).get("total_supply", "N/A"),
                "total_volume": data.get("collection", {}).get("stats", {}).get("total_volume", "N/A"),
                "last_updated": "Now",
                "source": "opensea"
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=f"OpenSea API error: {response.text}")

async def search_nft_items(query: str, collection_slug: Optional[str] = None, chain: str = "ethereum", limit: int = 20) -> Dict[str, Any]:
    """Search NFT items from OpenSea"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        params = {
            "query": query,
            "chain": chain,
            "limit": limit
        }
        
        if collection_slug:
            params["collection"] = collection_slug
            
        response = await client.get(
            f"{OPENSEA_BASE_URL}/assets",
            params=params,
            headers={"X-API-KEY": OPENSEA_API_KEY}
        )
        
        if response.status_code == 200:
            data = response.json()
            assets = data.get("assets", [])
            
            return {
                "type": "nft_search_results",
                "query": query,
                "results": [
                    {
                        "name": asset.get("name", "Unnamed"),
                        "token_id": asset.get("token_id", "N/A"),
                        "collection": asset.get("collection", {}).get("name", "Unknown"),
                        "image_url": asset.get("image_url", ""),
                        "permalink": asset.get("permalink", ""),
                        "last_sale_price": asset.get("last_sale", {}).get("total_price", "N/A") if asset.get("last_sale") else "N/A"
                    }
                    for asset in assets[:limit]
                ],
                "total_count": len(assets),
                "source": "opensea"
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=f"OpenSea API error: {response.text}")

# API endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "OpenSea MCP Server is running!", "status": "active"}

@app.post("/api/mcp")
async def process_mcp_query(mcp_query: MCPQuery):
    """Process MCP queries from frontend"""
    try:
        query_lower = mcp_query.query.lower()
        
        # Handle different types of queries
        if "floor price" in query_lower or "collection" in query_lower:
            # Extract collection name (simplified - you can improve this)
            if "bored" in query_lower or "bayc" in query_lower:
                collection_slug = "boredapeyachtclub"
            elif "cryptopunks" in query_lower:
                collection_slug = "cryptopunks"
            elif "doodles" in query_lower:
                collection_slug = "doodles-official"
            else:
                # Default to BAYC for now
                collection_slug = "boredapeyachtclub"
            
            result = await get_collection_info(collection_slug)
            return result
            
        elif "search" in query_lower or "find" in query_lower:
            # Extract search terms
            search_terms = mcp_query.query.replace("search", "").replace("find", "").strip()
            result = await search_nft_items(search_terms, limit=10)
            return result
            
        else:
            # General query - try to determine intent
            if any(word in query_lower for word in ["nft", "token", "asset"]):
                result = await search_nft_items(mcp_query.query, limit=5)
                return result
            else:
                return {
                    "type": "general_response",
                    "message": "I can help with NFT collection information, floor prices, and item searches. Try asking about specific collections or searching for NFTs!",
                    "suggestions": [
                        "What's the floor price of Bored Ape Yacht Club?",
                        "Search for Bored Ape NFTs",
                        "Show me Cryptopunks collection info"
                    ]
                }
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/api/collection/{collection_slug}")
async def get_collection(collection_slug: str):
    """Get collection information"""
    try:
        result = await get_collection_info(collection_slug)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching collection: {str(e)}")

@app.post("/api/search")
async def search_items(search_query: SearchQuery):
    """Search NFT items"""
    try:
        result = await search_nft_items(
            search_query.query,
            search_query.collection_slug,
            search_query.chain,
            search_query.limit
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching items: {str(e)}")

# uAgent integration
@mcp_agent.on_event("startup")
async def agent_startup(ctx: Context):
    """Agent startup event"""
    ctx.logger.info("🚀 MCP Agent started and ready to process queries!")

@mcp_agent.on_query()
async def handle_agent_query(ctx: Context, sender: str, query: str):
    """Handle queries from other agents"""
    ctx.logger.info(f"Received agent query: {query}")
    
    try:
        # Process the query using our MCP logic
        if "floor price" in query.lower():
            result = await get_collection_info("boredapeyachtclub")
        else:
            result = await search_nft_items(query, limit=5)
            
        await ctx.send(sender, result)
    except Exception as e:
        await ctx.send(sender, {"error": str(e)})

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "agent_address": str(mcp_agent.address)}

if __name__ == "__main__":
    import uvicorn
    
    # Start the uAgent in the background
    async def start_agent():
        await mcp_agent.start()
    
    # Run the agent in the background
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.create_task(start_agent())
    
    # Start the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
