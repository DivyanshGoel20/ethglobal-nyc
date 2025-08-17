import React, { useState, useEffect } from 'react';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress: string;
  standard: string;
  createdAt: string;
  collection: {
    slug: string;
    name: string;
    imageUrl: string;
  };
  chain: {
    identifier: string;
    name: string;
  };
  attributes: Array<{
    traitType: string;
    value: string;
  }>;
  rarity?: {
    rank: number;
    rankPercentage: number;
    totalSupply: number;
  };
}

interface NFTGalleryProps {
  walletAddress: string;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({ walletAddress }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [groupedNFTs, setGroupedNFTs] = useState<Record<string, NFT[]>>({});

  // Fetch NFT data from MCP server
  useEffect(() => {
    if (walletAddress) {
      fetchNFTs();
    }
  }, [walletAddress]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      console.log(`🔍 Fetching NFTs for wallet: ${walletAddress}`);
      
      // Call the backend API which has access to MCP server
      const response = await fetch('http://localhost:3001/api/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (response.ok) {
        const data = await response.json();
        setNfts(data.items || []);
        
        // Group NFTs by chain
        const grouped = data.items.reduce((acc: Record<string, NFT[]>, nft: NFT) => {
          const chain = nft.chain.name;
          if (!acc[chain]) {
            acc[chain] = [];
          }
          acc[chain].push(nft);
          return acc;
        }, {});
        
        setGroupedNFTs(grouped);
      } else {
        console.error('Failed to fetch NFTs');
        setNfts([]);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const getChainIcon = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return '🔷';
      case 'base':
        return '🔵';
      case 'polygon':
        return '🟣';
      case 'matic':
        return '🟣';
      default:
        return '🔗';
    }
  };

  const getChainColor = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return '#627eea';
      case 'base':
        return '#0052ff';
      case 'polygon':
        return '#8247e5';
      case 'matic':
        return '#8247e5';
      default:
        return '#4ecdc4';
    }
  };

  if (loading) {
    return (
      <div className="nft-gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading your NFT collection...</p>
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="nft-gallery-empty">
        <div className="empty-icon">🎨</div>
        <h3>No NFTs Found</h3>
        <p>This wallet doesn't have any NFTs yet.</p>
      </div>
    );
  }

  const availableChains = Object.keys(groupedNFTs);
  const filteredNFTs = selectedChain === 'all' 
    ? nfts 
    : groupedNFTs[selectedChain] || [];

  return (
    <div className="nft-gallery">
      {/* Header */}
      <div className="gallery-header">
        <div className="gallery-title">
          <h2>🎨 Your NFT Collection</h2>
          <p className="wallet-address-display">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
        
        {/* Chain Filter */}
        <div className="chain-filter">
          <button
            className={`chain-filter-btn ${selectedChain === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedChain('all')}
          >
            🌐 All Chains ({nfts.length})
          </button>
          {availableChains.map(chain => (
            <button
              key={chain}
              className={`chain-filter-btn ${selectedChain === chain ? 'active' : ''}`}
              onClick={() => setSelectedChain(chain)}
              style={{ '--chain-color': getChainColor(chain) } as React.CSSProperties}
            >
              {getChainIcon(chain)} {chain} ({groupedNFTs[chain].length})
            </button>
          ))}
        </div>
      </div>

      {/* NFT Grid */}
      <div className="nft-grid">
        {filteredNFTs.map((nft, index) => (
          <div key={`${nft.contractAddress}-${nft.tokenId}`} className="nft-card">
            <div className="nft-image-container">
              <img 
                src={nft.imageUrl} 
                alt={nft.name}
                className="nft-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TkZUIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
              <div className="nft-chain-badge" style={{ backgroundColor: getChainColor(nft.chain.name) }}>
                {getChainIcon(nft.chain.name)} {nft.chain.name}
              </div>
            </div>
            
            <div className="nft-info">
              <h3 className="nft-name">{nft.name}</h3>
              <p className="nft-collection">{nft.collection.name}</p>
              
              {nft.rarity && (
                <div className="nft-rarity">
                  <span className="rarity-rank">Rank #{nft.rarity.rank}</span>
                  <span className="rarity-percentage">({nft.rarity.rankPercentage.toFixed(1)}%)</span>
                </div>
              )}
              
              {nft.attributes.length > 0 && (
                <div className="nft-attributes">
                  {nft.attributes.slice(0, 3).map((attr, idx) => (
                    <span key={idx} className="attribute-tag">
                      {attr.traitType}: {attr.value}
                    </span>
                  ))}
                  {nft.attributes.length > 3 && (
                    <span className="attribute-more">+{nft.attributes.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
