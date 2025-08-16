import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicConnectButton, DynamicUserProfile, DynamicNav } from '@dynamic-labs/sdk-react-core';

const DynamicWalletConnect: React.FC = () => {
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
          
          <div className="wallet-status-card">
            <div className="status-indicator disconnected">
              <div className="status-dot"></div>
              <span>Wallet Not Connected</span>
            </div>
          </div>

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
        {/* Main Wallet Info - Positioned prominently */}
        <div className="wallet-main-section">
          <div className="wallet-card main-wallet">
            <div className="card-header">
              <h3>🎉 Wallet Connected!</h3>
              <div className="status-badge connected">
                <span className="status-dot"></span>
                Connected
              </div>
            </div>
            
            <div className="wallet-details">
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <code className="wallet-address">
                  {primaryWallet?.address || 'Unknown'}
                </code>
              </div>
              <div className="detail-row">
                <span className="detail-label">Chain:</span>
                <span className="chain-badge">{primaryWallet?.chain || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Components - Right side */}
        <div className="dynamic-components-section">
          <div className="component-card">
            <h3>User Profile</h3>
            <DynamicUserProfile />
          </div>

          <div className="component-card">
            <h3>Navigation</h3>
            <DynamicNav />
          </div>
        </div>

        {/* Progress Steps - Bottom */}
        <div className="progress-section">
          <h3>Ready for the Next Level?</h3>
          <div className="steps-grid">
            <div className="step-item completed">
              <div className="step-icon">✅</div>
              <div className="step-content">
                <h4>Wallet Connected</h4>
                <p>Your wallet is ready</p>
              </div>
            </div>
            
            <div className="step-item active">
              <div className="step-icon">🔄</div>
              <div className="step-content">
                <h4>Fetching NFTs</h4>
                <p>Loading your collection</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-icon">📹</div>
              <div className="step-content">
                <h4>Join Video Call</h4>
                <p>Enter the metaverse</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-icon">🤖</div>
              <div className="step-content">
                <h4>AI Agent</h4>
                <p>Interact with your NFTs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicWalletConnect;
