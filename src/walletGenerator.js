import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { sha256 } from 'js-sha256'; // Fixed import

// This function will generate deterministic keypairs based on the parent public key
export const generateWallets = async (parentPublicKey, count, startIndex = 0) => {
  const wallets = [];
  
  // Use the parent public key as a seed for deterministic generation
  const seedBuffer = Buffer.from(parentPublicKey);
  
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    // Create a path similar to BIP44 but using the index directly
    const path = `m/44'/501'/${index}'`;
    
    // Derive the key using the parent public key and path
    const derivedKey = derivePath(path, seedBuffer.toString('hex'));
    
    // Create a Solana keypair from the derived key
    const keypair = Keypair.fromSeed(derivedKey.key.slice(0, 32));
    
    wallets.push({
      index,
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      path
    });
  }
  
  return wallets;
};

// Helper function to create a seed from a public key
const createSeedFromPublicKey = (publicKey) => {
  // Use SHA-256 to create a deterministic seed from the public key
  return Buffer.from(sha256.create().update(Buffer.from(publicKey)).digest());
};