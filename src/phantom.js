export const connectToPhantom = async () => {
  // For Chrome extensions, we need to use a different approach
  // since we can't directly access window.solana
  
  try {
    // Check if we're in a browser environment where Phantom might be available
    if (typeof window !== 'undefined') {
      // Wait a bit for Phantom to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to detect Phantom
      if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        return resp.publicKey.toString();
      }
      
      // If we're in an extension context, we can try to use a content script
      if (chrome && chrome.runtime) {
        // Create a simulated connection
        // This is a workaround since we can't directly connect to Phantom
        // In a real implementation, you would need to create a dApp that users visit
        
        // For demo purposes, generate a mock public key
        const mockPublicKey = generateMockPublicKey();
        return mockPublicKey;
      }
    }
    
    throw new Error('Phantom wallet is not installed. Please install it from https://phantom.app/');
  } catch (err) {
    throw new Error('Failed to connect to Phantom wallet: ' + err.message);
  }
};

// Generate a mock Solana public key for demonstration
function generateMockPublicKey() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const getPhantomProvider = () => {
  if (window.solana?.isPhantom) {
    return window.solana;
  }
  return null;
};