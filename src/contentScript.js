// Listen for Phantom wallet injection
const checkForPhantom = setInterval(() => {
  if (window.solana && window.solana.isPhantom) {
    clearInterval(checkForPhantom);
    window.postMessage({ type: 'PHANTOM_INJECTED' }, '*');
  }
}, 100);