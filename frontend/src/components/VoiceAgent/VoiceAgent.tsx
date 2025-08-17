import React, { useState, useEffect, useRef } from 'react';
import './VoiceAgent.css';

interface VoiceAgentProps {
  openaiApiKey?: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ openaiApiKey }) => {
  console.log('VoiceAgent rendering...');
  
  const [voiceState, setVoiceState] = useState({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    response: ''
  });

  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  const [cryptoData, setCryptoData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition - temporarily disabled to prevent errors
  useEffect(() => {
    console.log('VoiceAgent useEffect running...');
    
    try {
      // Temporarily disable speech recognition to prevent errors
      setError('Voice recognition temporarily disabled. Use text input instead.');
      
      // Initialize speech synthesis only
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
        console.log('Speech synthesis initialized');
      }
    } catch (error) {
      console.error('Error in VoiceAgent useEffect:', error);
      setError('Failed to initialize voice features. Please refresh the page.');
    }

    return () => {
      // Cleanup
    };
  }, []);

  // Process voice command with OpenAI
  const processVoiceCommand = async (transcript: string) => {
    if (!openaiApiKey) {
      setError('OpenAI API key not provided');
      return;
    }

    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Call OpenAI to process the voice command
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful crypto and NFT assistant. Analyze the user's question and determine if they need data from OpenSea MCP. 
              If they ask about NFTs, collections, floor prices, or wallet data, respond with "MCP_QUERY:" followed by the specific query.
              Otherwise, provide a helpful response about crypto/NFTs. Keep responses concise and friendly.`
            },
            {
              role: 'user',
              content: transcript
            }
          ],
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Check if this is an MCP query
      if (aiResponse.includes('MCP_QUERY:')) {
        const mcpQuery = aiResponse.split('MCP_QUERY:')[1].trim();
        await fetchMCPData(mcpQuery, transcript);
      } else {
        // Regular AI response
        setVoiceState(prev => ({ 
          ...prev, 
          response: aiResponse, 
          isProcessing: false 
        }));
        speakResponse(aiResponse);
      }

    } catch (error) {
      setError(`Error processing voice command: ${error}`);
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Fetch data from OpenSea MCP
  const fetchMCPData = async (mcpQuery: string, originalQuestion: string) => {
    try {
      console.log(`🔍 MCP Query: ${mcpQuery}`);
      
      // Call your MCP server
      const response = await fetch('http://localhost:8000/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mcpQuery,
          type: 'mcp_query'
        })
      });

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`);
      }

      const mcpData = await response.json();
      console.log('MCP Response:', mcpData);

      setCryptoData(mcpData);

      // Generate response based on the data type
      let dataResponse = '';
      
      if (mcpData.type === 'collection_info') {
        dataResponse = `Based on your question "${originalQuestion}", here's what I found: The ${mcpData.collection} collection has a floor price of ${mcpData.floor_price} ETH. Total supply: ${mcpData.total_supply}, Total volume: ${mcpData.total_volume}.`;
      } else if (mcpData.type === 'nft_search_results') {
        dataResponse = `I found ${mcpData.total_count} NFTs matching "${mcpData.query}". Here are some examples: ${mcpData.results.slice(0, 3).map(nft => `${nft.name} from ${nft.collection}`).join(', ')}.`;
      } else if (mcpData.type === 'general_response') {
        dataResponse = mcpData.message;
      } else {
        dataResponse = `Here's the data for "${originalQuestion}": ${JSON.stringify(mcpData, null, 2)}`;
      }
      
      setVoiceState(prev => ({ 
        ...prev, 
        response: dataResponse, 
        isProcessing: false 
      }));
      
      speakResponse(dataResponse);

    } catch (error) {
      console.error('MCP Error:', error);
      setError(`Error fetching MCP data: ${error}`);
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Text-to-speech
  const speakResponse = (text: string) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: true }));
      };
      
      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      };

      synthesisRef.current.speak(utterance);
    }
  };

  // Start listening - temporarily disabled
  const startListening = () => {
    console.log('Voice recognition temporarily disabled');
    setError('Voice recognition is temporarily disabled. Please use the text input instead.');
  };

  // Stop listening - temporarily disabled
  const stopListening = () => {
    console.log('Voice recognition temporarily disabled');
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      setVoiceState(prev => ({ ...prev, transcript: textInput.trim() }));
      processVoiceCommand(textInput.trim());
      setTextInput('');
      setShowTextInput(false);
    }
  };

  try {
    return (
      <div className="voice-agent">
        <div className="voice-agent-header">
          <h2>🎙️ Crypto Voice Assistant</h2>
          <p>Ask me anything about NFTs, crypto, or blockchain!</p>
        </div>

        {/* Push-to-Talk Button */}
        <div className="voice-controls">
          <button
            className="push-to-talk disabled"
            disabled={true}
            title="Voice recognition temporarily disabled"
          >
            🎤 Voice Disabled
          </button>
          
          {/* Fallback Text Input */}
          <div className="text-input-fallback">
            <button
              type="button"
              className="text-input-toggle"
              onClick={() => setShowTextInput(!showTextInput)}
            >
              {showTextInput ? '🎤 Use Voice' : '⌨️ Type Instead'}
            </button>
            
            {showTextInput && (
              <form onSubmit={handleTextSubmit} className="text-input-form">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="text-input"
                  disabled={voiceState.isProcessing || voiceState.isSpeaking}
                />
                <button
                  type="submit"
                  className="text-submit-btn"
                  disabled={!textInput.trim() || voiceState.isProcessing || voiceState.isSpeaking}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="status-indicators">
          {voiceState.isListening && <div className="status listening">🎤 Listening...</div>}
          {voiceState.isProcessing && <div className="status processing">🤖 Processing...</div>}
          {voiceState.isSpeaking && <div className="status speaking">🔊 Speaking...</div>}
        </div>

        {/* Transcript */}
        {voiceState.transcript && (
          <div className="transcript-section">
            <h3>🎯 What you said:</h3>
            <p className="transcript">{voiceState.transcript}</p>
          </div>
        )}

        {/* AI Response */}
        {voiceState.response && (
          <div className="response-section">
            <h3>🤖 AI Response:</h3>
            <p className="response">{voiceState.response}</p>
          </div>
        )}

        {/* Crypto Data Display */}
        {cryptoData && (
          <div className="crypto-data-section">
            <h3>📊 Data from OpenSea MCP:</h3>
            <div className="crypto-data">
              <pre>{JSON.stringify(cryptoData, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-section">
            <h3>❌ Error:</h3>
            <p className="error">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h3>💡 How to use:</h3>
          <ul>
            <li>Hold the "Push to Talk" button and speak your question</li>
            <li>Ask about NFTs, collections, floor prices, or wallet data</li>
            <li>The AI will process your question and fetch relevant data</li>
            <li>You'll hear the response and see the data visually</li>
            <li>If voice doesn't work, use the "Type Instead" option below</li>
          </ul>
          
          <h4>🔧 Troubleshooting Voice Issues:</h4>
          <ul>
            <li><strong>Network Error:</strong> Check your internet connection and try again</li>
            <li><strong>Microphone Access:</strong> Allow microphone access when prompted</li>
            <li><strong>Browser Support:</strong> Use Chrome, Edge, or Safari for best results</li>
            <li><strong>HTTPS Required:</strong> Speech recognition works best over HTTPS</li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in VoiceAgent component:', error);
    return (
      <div className="voice-agent">
        <div className="error-section">
          <h3>❌ Voice Agent Error</h3>
          <p className="error">Something went wrong with the voice agent. Please refresh the page.</p>
          <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
};

export default VoiceAgent;
