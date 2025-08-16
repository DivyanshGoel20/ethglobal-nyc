import React from 'react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import DynamicWalletConnect from './components/DynamicWalletConnect'
import './App.css'

function App() {
  // Get Dynamic Environment ID from environment variables
  const dynamicEnvironmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID

  // Check if environment ID is configured
  if (!dynamicEnvironmentId || dynamicEnvironmentId === 'YOUR_DYNAMIC_ENVIRONMENT_ID_HERE') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🎭 NFT Video Call App</h1>
          <p>Configuration Required</p>
        </header>

        <main className="App-main">
          <div className="connect-section">
            <h2>⚠️ Environment Not Configured</h2>
            <p>Please set up your Dynamic Environment ID:</p>
            <ol style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <li>Create a <code>.env</code> file in the frontend directory</li>
              <li>Add: <code>VITE_DYNAMIC_ENVIRONMENT_ID=your_actual_id_here</code></li>
              <li>Get your ID from <a href="https://app.dynamic.xyz/" target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4' }}>Dynamic Dashboard</a></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </main>

        <footer className="App-footer">
          <p>Built with ❤️ for ETHGlobal NYC</p>
        </footer>
      </div>
    )
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: [EthereumWalletConnectors] // ETH + Base (EVM chains)
      }}
    >
      <div className="App">
        <header className="App-header">
          <h1>🎭 NFT Video Call App</h1>
          <p>Connect your wallet to get started</p>
        </header>

        <main className="App-main">
          <DynamicWalletConnect />
        </main>

        <footer className="App-footer">
          <p>Built with ❤️ for ETHGlobal NYC</p>
        </footer>
      </div>
    </DynamicContextProvider>
  )
}

export default App
