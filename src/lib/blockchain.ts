import { createWalletClient, createPublicClient, http, type Address, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY!;

if (!adminPrivateKey) {
  throw new Error('ADMIN_PRIVATE_KEY is not set in environment variables');
}

// Define local chain (Ganache)
const localChain = defineChain({
  id: 1337,
  name: 'Local',
  network: 'local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
});

// Create account from private key
const account = privateKeyToAccount(adminPrivateKey as `0x${string}`);

// Create public client for reading
export const publicClient = createPublicClient({
  chain: localChain,
  transport: http(rpcUrl),
});

// Create wallet client for writing (admin operations)
export const walletClient = createWalletClient({
  chain: localChain,
  account,
  transport: http(rpcUrl),
});

// Export admin address
export const adminAddress = account.address;

// Contract addresses
export const TWDT_ADDRESS = process.env.TWDT_ADDRESS as Address;
export const BANK_FACTORY_ADDRESS = process.env.BANK_FACTORY_ADDRESS as Address;

