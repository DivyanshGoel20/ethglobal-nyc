import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicConnectButton, DynamicUserProfile, DynamicNav } from '@dynamic-labs/sdk-react-core';
import NFTGallery from './NFTGallery';
import VoiceAgent from './VoiceAgent/VoiceAgent';

interface DynamicWalletConnectProps {
  openaiApiKey: string;
}

const DynamicWalletConnect: React.FC<DynamicWalletConnectProps> = ({ openaiApiKey }) => {
  console.log('DynamicWalletConnect rendering with openaiApiKey:', !!openaiApiKey);
  
  try {
    const { 
      user, 
      primaryWallet
    } = useDynamicContext();

  if (!user) {
    return (
      <div className="connect-section">
        <div className="hero-content">
          <div className="hero-icon">🎭</div>
          <h2>Welcome to NFT Video Call</h2>
          <p className="hero-description">
            Connect your wallet to join immersive video calls and interact with your NFTs through AI
          </p>
          
          <div className="connect-button-container">
            <DynamicConnectButton>
              <span className="button-content">
                <span className="button-icon">🚀</span>
                Connect Wallet
              </span>
            </DynamicConnectButton>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="connected-section">
        <div className="wallet-dashboard">
          {/* NFT Gallery - Main Content */}
          <div className="nft-gallery-section">
            <NFTGallery walletAddress={primaryWallet?.address || ''} />
          </div>

          {/* Dynamic Components - Right side */}
          <div className="dynamic-components-section">
            <div className="component-card">
              <DynamicNav />
            </div>
            
            {/* Voice Agent Component */}
            <div className="component-card voice-agent-card">
              <VoiceAgent openaiApiKey={openaiApiKey} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in DynamicWalletConnect:', error);
    return (
      <div className="error-message">
        <h3>❌ Error Loading Wallet Component</h3>
        <p>Something went wrong: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default DynamicWalletConnect;
