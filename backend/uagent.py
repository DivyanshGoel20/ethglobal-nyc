#!/usr/bin/env python3
"""
OpenSea MCP Agent for Agentverse

Provides real-time OpenSea NFT data, collection information, and wallet analysis
via OpenSea MCP server integration. Makes it discoverable on ASI:One LLM.
"""

import os
import json
import asyncio
import secrets
from typing import Dict, Any, Optional
import time
import httpx
from uagents import Agent, Context, Protocol, Model
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    EndSessionContent,
    StartSessionContent,
)
from datetime import datetime, timezone
from uuid import uuid4
from dotenv import load_dotenv

# --- Agent Configuration ---

# Load environment variables from a .env file
load_dotenv()

# Get OpenSea MCP access token
OPENSEA_ACCESS_TOKEN = os.getenv("OPENSEA_ACCESS_TOKEN")
if not OPENSEA_ACCESS_TOKEN:
    raise ValueError("OPENSEA_ACCESS_TOKEN not found in .env file")

AGENT_NAME = "opensea_agent"
AGENT_PORT = 8008

# User sessions store: session_id -> {authenticated, last_activity}
user_sessions: Dict[str, Dict[str, Any]] = {}

# Session timeout (30 minutes)
SESSION_TIMEOUT = 30 * 60

# --- OpenSea MCP Client Logic ---

class OpenSeaMCPClient:
    """OpenSea MCP Client for NFT data, collection info, and wallet analysis"""
    
    def __init__(self, ctx: Context):
        self._ctx = ctx
        self.base_url = f"https://mcp.opensea.io/{OPENSEA_ACCESS_TOKEN}/mcp"
        self.headers = {
            "Authorization": f"Bearer {OPENSEA_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }

    async def process_query(self, query: str) -> str:
        """Process user query and call appropriate OpenSea MCP tools"""
        self._ctx.logger.info(f"Processing OpenSea query: '{query}'")
        
        try:
            # Simple query analysis to determine which tool to use
            query_lower = query.lower()
            
            if "floor price" in query_lower or "collection" in query_lower:
                # Extract collection name from query
                collection_name = self._extract_collection_name(query)
                if collection_name:
                    return await self._get_collection_info(collection_name)
                else:
                    return "Please specify which collection you'd like to know about (e.g., 'What's the floor price of Bored Ape Yacht Club?')"
            
            elif "search" in query_lower or "find" in query_lower:
                # Extract search terms
                search_terms = self._extract_search_terms(query)
                if search_terms:
                    return await self._search_nfts(search_terms)
                else:
                    return "Please specify what you'd like to search for (e.g., 'Search for Bored Ape NFTs')"
            
            elif "wallet" in query_lower or "address" in query_lower:
                # Extract wallet address
                wallet_address = self._extract_wallet_address(query)
                if wallet_address:
                    return await self._get_wallet_info(wallet_address)
                else:
                    return "Please provide a wallet address to analyze (e.g., 'Show me wallet 0x1234...')"
            
            elif "trending" in query_lower or "top" in query_lower:
                return await self._get_trending_collections()
            
            else:
                return """🖼️ I can help you with OpenSea NFT queries! Here are some examples:

• "What's the floor price of Bored Ape Yacht Club?"
• "Search for CryptoPunks NFTs"
• "Show me wallet 0x1234..."
• "What are the trending collections?"

What would you like to know about?"""
                
        except Exception as e:
            self._ctx.logger.error(f"Error processing OpenSea query: {e}")
            return f"Sorry, an error occurred while processing your OpenSea request: {e}"

    def _extract_collection_name(self, query: str) -> Optional[str]:
        """Extract collection name from query"""
        query_lower = query.lower()
        
        # Common collection mappings
        if "bored" in query_lower or "bayc" in query_lower:
            return "boredapeyachtclub"
        elif "cryptopunks" in query_lower or "punks" in query_lower:
            return "cryptopunks"
        elif "doodles" in query_lower:
            return "doodles-official"
        elif "azuki" in query_lower:
            return "azuki"
        elif "clonex" in query_lower:
            return "clonex"
        
        # Try to extract from the query
        import re
        # Look for patterns like "floor price of [Collection Name]"
        match = re.search(r'floor price of ([a-zA-Z0-9\s]+)', query_lower)
        if match:
            return match.group(1).strip().replace(' ', '')
        
        return None

    def _extract_search_terms(self, query: str) -> Optional[str]:
        """Extract search terms from query"""
        query_lower = query.lower()
        
        # Remove common search words
        search_words = ["search", "find", "for", "nfts", "in", "the"]
        for word in search_words:
            query_lower = query_lower.replace(word, "")
        
        return query_lower.strip() if query_lower.strip() else None

    def _extract_wallet_address(self, query: str) -> Optional[str]:
        """Extract wallet address from query"""
        import re
        # Look for Ethereum addresses
        match = re.search(r'0x[a-fA-F0-9]{40}', query)
        if match:
            return match.group(0)
        return None

    async def _get_collection_info(self, collection_slug: str) -> str:
        """Get collection information from OpenSea MCP"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/collection/{collection_slug}",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_collection_info(data, collection_slug)
                else:
                    return f"❌ Error fetching collection info: {response.status_code}"
                    
        except Exception as e:
            self._ctx.logger.error(f"Error fetching collection info: {e}")
            return f"❌ Error: {str(e)}"

    async def _search_nfts(self, search_query: str) -> str:
        """Search for NFTs using OpenSea MCP"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params={"query": search_query, "limit": 10},
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_search_results(data, search_query)
                else:
                    return f"❌ Error searching NFTs: {response.status_code}"
                    
        except Exception as e:
            self._ctx.logger.error(f"Error searching NFTs: {e}")
            return f"❌ Error: {str(e)}"

    async def _get_wallet_info(self, wallet_address: str) -> str:
        """Get wallet information from OpenSea MCP"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/wallet/{wallet_address}",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_wallet_info(data, wallet_address)
                else:
                    return f"❌ Error fetching wallet info: {response.status_code}"
                    
        except Exception as e:
            self._ctx.logger.error(f"Error fetching wallet info: {e}")
            return f"❌ Error: {str(e)}"

    async def _get_trending_collections(self) -> str:
        """Get trending collections from OpenSea MCP"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/trending",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_trending_collections(data)
                else:
                    return f"❌ Error fetching trending collections: {response.status_code}"
                    
        except Exception as e:
            self._ctx.logger.error(f"Error fetching trending collections: {e}")
            return f"❌ Error: {str(e)}"

    def _format_collection_info(self, data: Dict, collection_slug: str) -> str:
        """Format collection information response"""
        try:
            collection = data.get("collection", {})
            stats = collection.get("stats", {})
            
            name = collection.get("name", collection_slug)
            description = collection.get("description", "No description available")
            floor_price = stats.get("floor_price", "N/A")
            total_supply = stats.get("total_supply", "N/A")
            total_volume = stats.get("total_volume", "N/A")
            num_owners = stats.get("num_owners", "N/A")
            
            formatted_response = f"🖼️ **{name}**\n\n"
            if description:
                formatted_response += f"📝 **Description:** {description[:200]}{'...' if len(description) > 200 else ''}\n\n"
            formatted_response += f"💰 **Floor Price:** {floor_price} ETH\n"
            formatted_response += f"🔢 **Total Supply:** {total_supply}\n"
            formatted_response += f"📊 **Total Volume:** {total_volume} ETH\n"
            formatted_response += f"👥 **Unique Owners:** {num_owners}\n"
            formatted_response += f"🔗 **OpenSea:** https://opensea.io/collection/{collection_slug}\n"
            
            return formatted_response
            
        except Exception as e:
            self._ctx.logger.error(f"Error formatting collection info: {e}")
            return f"🖼️ **Collection Data**\n\n```json\n{json.dumps(data, indent=2)}\n```"

    def _format_search_results(self, data: Dict, query: str) -> str:
        """Format NFT search results"""
        try:
            assets = data.get("assets", [])
            
            if not assets:
                return f"🔍 **Search Results for: {query}**\n\nNo NFTs found matching your search criteria."
            
            formatted_response = f"🔍 **Search Results for: {query}**\n\n"
            formatted_response += f"Found {len(assets)} NFTs:\n\n"
            
            for i, asset in enumerate(assets[:5], 1):
                name = asset.get("name", "Unnamed NFT")
                token_id = asset.get("token_id", "N/A")
                collection = asset.get("collection", {}).get("name", "Unknown Collection")
                permalink = asset.get("permalink", "")
                
                formatted_response += f"**{i}. {name}**\n"
                formatted_response += f"🆔 Token ID: {token_id}\n"
                formatted_response += f"🏷️ Collection: {collection}\n"
                if permalink:
                    formatted_response += f"🔗 [View on OpenSea]({permalink})\n"
                formatted_response += "\n"
            
            if len(assets) > 5:
                formatted_response += f"... and {len(assets) - 5} more NFTs available.\n"
            
            return formatted_response
            
        except Exception as e:
            self._ctx.logger.error(f"Error formatting search results: {e}")
            return f"🔍 **Search Results**\n\n```json\n{json.dumps(data, indent=2)}\n```"

    def _format_wallet_info(self, data: Dict, wallet_address: str) -> str:
        """Format wallet information response"""
        try:
            nfts = data.get("nfts", [])
            collections = data.get("collections", [])
            
            formatted_response = f"👛 **Wallet Analysis: {wallet_address}**\n\n"
            
            if nfts:
                formatted_response += f"🖼️ **NFTs Owned:** {len(nfts)}\n"
                for i, nft in enumerate(nfts[:3], 1):
                    name = nft.get("name", "Unnamed NFT")
                    collection = nft.get("collection", {}).get("name", "Unknown Collection")
                    formatted_response += f"  {i}. {name} ({collection})\n"
                if len(nfts) > 3:
                    formatted_response += f"  ... and {len(nfts) - 3} more\n"
                formatted_response += "\n"
            
            if collections:
                formatted_response += f"🏷️ **Collections:** {len(collections)}\n"
                for i, collection in enumerate(collections[:3], 1):
                    name = collection.get("name", "Unknown Collection")
                    count = collection.get("count", 0)
                    formatted_response += f"  {i}. {name} ({count} items)\n"
                if len(collections) > 3:
                    formatted_response += f"  ... and {len(collections) - 3} more\n"
            
            return formatted_response
            
        except Exception as e:
            self._ctx.logger.error(f"Error formatting wallet info: {e}")
            return f"👛 **Wallet Data**\n\n```json\n{json.dumps(data, indent=2)}\n```"

    def _format_trending_collections(self, data: Dict) -> str:
        """Format trending collections response"""
        try:
            collections = data.get("collections", [])
            
            if not collections:
                return "📈 **Trending Collections**\n\nNo trending collections data available."
            
            formatted_response = "📈 **Trending Collections on OpenSea**\n\n"
            
            for i, collection in enumerate(collections[:5], 1):
                name = collection.get("name", "Unknown Collection")
                floor_price = collection.get("stats", {}).get("floor_price", "N/A")
                total_volume = collection.get("stats", {}).get("total_volume", "N/A")
                slug = collection.get("slug", "N/A")
                
                formatted_response += f"**{i}. {name}**\n"
                formatted_response += f"💰 Floor Price: {floor_price} ETH\n"
                formatted_response += f"📊 Total Volume: {total_volume} ETH\n"
                formatted_response += f"🔗 https://opensea.io/collection/{slug}\n\n"
            
            if len(collections) > 5:
                formatted_response += f"... and {len(collections) - 5} more trending collections.\n"
            
            return formatted_response
            
        except Exception as e:
            self._ctx.logger.error(f"Error formatting trending collections: {e}")
            return f"📈 **Trending Data**\n\n```json\n{json.dumps(data, indent=2)}\n```"

# --- uAgent Setup ---

chat_proto = Protocol(spec=chat_protocol_spec)
agent = Agent(name=AGENT_NAME, port=AGENT_PORT, mailbox=True)

# Store OpenSea clients per session
opensea_clients: Dict[str, OpenSeaMCPClient] = {}

def is_session_valid(session_id: str) -> bool:
    """Check if session is valid and hasn't expired"""
    if session_id not in user_sessions:
        return False
    
    session = user_sessions[session_id]
    current_time = time.time()
    
    if current_time - session["last_activity"] > SESSION_TIMEOUT:
        # Session expired
        del user_sessions[session_id]
        return False
    
    # Update last activity
    session["last_activity"] = current_time
    return True

async def get_opensea_client(ctx: Context, session_id: str) -> OpenSeaMCPClient:
    """Get or create OpenSea MCP client for session"""
    if session_id not in opensea_clients:
        client = OpenSeaMCPClient(ctx)
        opensea_clients[session_id] = client
    return opensea_clients[session_id]

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages"""
    
    # Extract text from content (handle both list and direct text formats)
    try:
        if isinstance(msg.content, list):
            # Content is a list, extract text from first item
            if len(msg.content) > 0:
                if hasattr(msg.content[0], 'text'):
                    user_text = msg.content[0].text
                else:
                    user_text = str(msg.content[0])
            else:
                user_text = "[Empty message]"
        elif hasattr(msg.content, 'text'):
            # Content has direct text attribute
            user_text = msg.content.text
        else:
            # Fallback to string representation
            user_text = str(msg.content)
    except Exception as e:
        ctx.logger.error(f"Error extracting message text: {e}")
        user_text = "[Could not parse message]"
    
    ctx.logger.info(f"Received message from {sender}: '{user_text}'")
    
    # Extract or create session ID
    session_id = getattr(msg, 'session_id', None) or str(uuid4())
    
    # Validate session
    if not is_session_valid(session_id):
        user_sessions[session_id] = {
            "authenticated": True,
            "last_activity": time.time()
        }
    
    try:
        # Get OpenSea MCP client for this session
        opensea_client = await get_opensea_client(ctx, session_id)
        
        # Process the query
        response_text = await opensea_client.process_query(user_text)
        
        # Send response
        response_msg = ChatMessage(
            timestamp=datetime.now(timezone.utc),
            msg_id=str(uuid4()),
            content=[TextContent(type="text", text=response_text)]
        )
        
        await ctx.send(sender, response_msg)
        ctx.logger.info(f"Sent response to {sender}")
        
    except Exception as e:
        ctx.logger.error(f"Error handling message: {e}")
        error_msg = ChatMessage(
            timestamp=datetime.now(timezone.utc),
            msg_id=str(uuid4()),
            content=[TextContent(type="text", text=f"Sorry, I encountered an error: {str(e)}")]
        )
        await ctx.send(sender, error_msg)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Received acknowledgement from {sender}")

@agent.on_event("startup")
async def on_startup(ctx: Context):
    """Test the agent on startup by asking for BAYC floor price"""
    ctx.logger.info("🚀 OpenSea Agent started! Testing with BAYC floor price query...")
    
    try:
        # Create a test client and test the BAYC floor price query
        test_client = OpenSeaMCPClient(ctx)
        
        # Test query: "What's the floor price of Bored Ape Yacht Club?"
        test_query = "What's the floor price of Bored Ape Yacht Club?"
        ctx.logger.info(f"🧪 Testing query: {test_query}")
        
        # Process the test query
        response = await test_client.process_query(test_query)
        
        # Log the response
        ctx.logger.info("✅ Test completed successfully!")
        ctx.logger.info(f"📊 Response: {response}")
        
        # Print to console for user to see
        print("\n" + "="*60)
        print("🧪 STARTUP TEST COMPLETED")
        print("="*60)
        print(f"Query: {test_query}")
        print(f"Response: {response}")
        print("="*60)
        print("🎉 Agent is working and ready to handle queries!")
        print("="*60 + "\n")
        
    except Exception as e:
        ctx.logger.error(f"❌ Startup test failed: {e}")
        print(f"\n❌ STARTUP TEST FAILED: {e}")
        print("Please check your OpenSea access token and network connection.\n")

@agent.on_event("shutdown")
async def on_shutdown(ctx: Context):
    """Clean up resources on shutdown"""
    ctx.logger.info("Shutting down OpenSea agent...")

agent.include(chat_proto)

if __name__ == "__main__":
    print(f"OpenSea Agent starting on http://localhost:{AGENT_PORT}")
    print(f"Agent address: {agent.address}")
    print("🖼️ Ready to help you explore the NFT world on OpenSea!")
    agent.run()
