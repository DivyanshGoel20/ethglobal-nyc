import React from 'react';
import './App.css';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import DynamicWalletConnect from './components/DynamicWalletConnect';
import VoiceAgent from './components/VoiceAgent/VoiceAgent';

function App() {
  console.log('App component rendering...');
  
  const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Debug: Log what we're getting from environment
  console.log('Environment variables:', { environmentId, openaiApiKey });
  
  // Show loading state while checking environment variables
  if (environmentId === undefined || openaiApiKey === undefined) {
    return (
      <div className="App">
        <div className="loading-state">
          <h1>🔄 Loading...</h1>
          <p>Checking environment configuration...</p>
        </div>
      </div>
    );
  }
  
  // Use actual values if available, otherwise show setup page
  if (!environmentId || !openaiApiKey) {
    return (
      <div className="App">
        <div className="config-setup">
          <div className="config-header">
            <h1>🔧 Setup Required</h1>
            <p>Please configure your environment variables to get started</p>
          </div>
          
          <div className="config-steps">
            <div className="config-step">
              <h3>1. Create Environment File</h3>
              <p>Create a <code>.env</code> file (not a folder) in the <code>frontend</code> directory</p>
            </div>
            
            <div className="config-step">
              <h3>2. Add Required Variables</h3>
              <div className="env-vars">
                <div className="env-var">
                  <code>VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_id_here</code>
                  <span className={`status ${environmentId ? 'success' : 'error'}`}>
                    {environmentId ? '✅ Set' : '❌ Missing'}
                  </span>
                </div>
                <div className="env-var">
                  <code>VITE_OPENAI_API_KEY=your_openai_key_here</code>
                  <span className={`status ${openaiApiKey ? 'success' : 'error'}`}>
                    {openaiApiKey ? '✅ Set' : '❌ Missing'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="config-step">
              <h3>3. Get Your Keys</h3>
              <div className="key-sources">
                <a href="https://app.dynamic.xyz/" target="_blank" rel="noopener noreferrer" className="key-link">
                  🎯 Get Dynamic Environment ID
                </a>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="key-link">
                  🤖 Get OpenAI API Key
                </a>
              </div>
            </div>
            
            <div className="config-step">
              <h3>4. Restart Development Server</h3>
              <p>After creating the <code>.env</code> file, restart your dev server with <code>npm run dev</code></p>
            </div>
          </div>
          
          <div className="config-note">
            <p><strong>Note:</strong> The <code>.env</code> file is already in <code>.gitignore</code> and won't be committed to version control.</p>
          </div>
        </div>
      </div>
    );
  }
  


  console.log('Rendering main app with DynamicContextProvider...');
  
  // Add a fallback in case Dynamic context fails
  if (!environmentId || environmentId === 'undefined') {
    return (
      <div className="App">
        <div className="error-message">
          <h1>❌ Invalid Environment ID</h1>
          <p>Environment ID is invalid: {environmentId}</p>
          <p>Please check your .env file and restart the server.</p>
        </div>
      </div>
    );
  }
  
  try {
    return (
      <DynamicContextProvider
        settings={{
          environmentId: environmentId,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <div className="App">
          <header className="App-header">
            <h1>🎭 NFT Video Call</h1>
          </header>
          <main className="App-main">
            <DynamicWalletConnect openaiApiKey={openaiApiKey} />
          </main>
        </div>
      </DynamicContextProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="App">
        <div className="error-message">
          <h1>❌ Error Loading App</h1>
          <p>Something went wrong: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <p>Check the browser console for more details.</p>
        </div>
      </div>
    );
  }
}

export default App;
