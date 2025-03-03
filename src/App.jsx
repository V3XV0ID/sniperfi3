import React, { useState, useEffect } from 'react';
import { connectToPhantom, getPhantomProvider } from './phantom';
import { generateWallets } from './walletGenerator';

function App({ fullPage = false }) {
  const [isConnected, setIsConnected] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [status, setStatus] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [publicKey, setPublicKey] = useState('');
  
  useEffect(() => {
    const checkConnection = async () => {
      // Wait for window.solana to be injected
      let attempts = 0;
      while (!window.solana && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (window.solana?.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          handleSuccessfulConnection(response.publicKey.toString());
        } catch (error) {
          setStatus('Please connect to Phantom wallet');
        }
      } else {
        setStatus('Waiting for Phantom wallet...');
      }
    };
    
    checkConnection();
  }, []);

  const handleSuccessfulConnection = (publicKey) => {
    setIsConnected(true);
    setPublicKey(publicKey);
    setStatus(`Connected to Phantom: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`);
  };
  
  const connectWallet = async () => {
    try {
      setStatus('Connecting to Phantom...');
      const publicKey = await connectToPhantom();
      handleSuccessfulConnection(publicKey);
    } catch (error) {
      setStatus(`Connection failed: ${error.message}`);
    }
  };
  
  const handleGenerateWallets = async () => {
    if (!isConnected) {
      setStatus('Please connect to Phantom first');
      return;
    }
    
    try {
      setStatus('Generating wallets...');
      const count = Math.min(100 - wallets.length, 10); // Generate 10 at a time, up to 100 total
      const newWallets = await generateWallets(publicKey, count, wallets.length);
      setWallets([...wallets, ...newWallets]);
      setStatus(`Generated ${count} new wallets`);
    } catch (error) {
      setStatus(`Generation failed: ${error.message}`);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard');
  };
  
  const openFullPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
  };
  
  return (
    <div className={`container ${fullPage ? 'full-page' : ''}`}>
      <div className="header">
        <h1>SniperFi3</h1>
        <p>HD Wallet connected to Phantom</p>
        {!fullPage && (
          <button className="full-page-button" onClick={openFullPage}>
            Open Full Page
          </button>
        )}
      </div>
      
      {!isConnected ? (
        <button className="connect-button" onClick={connectWallet}>
          Connect to Phantom
        </button>
      ) : (
        <>
          <div className="controls">
            <button 
              className="generate-button" 
              onClick={handleGenerateWallets}
              disabled={wallets.length >= 100}
            >
              Generate Wallets ({wallets.length}/100)
            </button>
          </div>
          
          <div className="wallet-list">
            {wallets.map((wallet, index) => (
              <div key={index} className="wallet-item">
                <div>
                  <div>#{index + 1}: {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}</div>
                </div>
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(wallet.privateKey)}
                >
                  Copy Key
                </button>
              </div>
            ))}
            {wallets.length === 0 && (
              <div className="empty-state">
                No wallets generated yet. Click "Generate Wallets" to create some.
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="status">{status}</div>
    </div>
  );
}

export default App;