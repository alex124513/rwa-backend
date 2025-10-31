import { createWalletClient, createPublicClient, http, type Address, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
const isProduction = process.env.NODE_ENV === 'production';
const defaultDevPrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const rawPrivateKey =
  process.env.WALLET_KEY ?? (!isProduction ? defaultDevPrivateKey : undefined);

if (!rawPrivateKey) {
  throw new Error('WALLET_KEY is not set in environment variables');
}

function normalizePrivateKey(input: string): `0x${string}` {
  const trimmed = input.trim();
  // Remove accidental surrounding quotes
  const unquoted = trimmed.replace(/^['"`]{1}|['"`]{1}$/g, '');
  // Remove spaces inside
  const compact = unquoted.replace(/\s+/g, '');
  const hex = compact.startsWith('0x') ? compact : `0x${compact}`;
  if (hex.length !== 66) {
    throw new Error(
      'WALLET_KEY must be a 32-byte hex private key (64 hex chars, with or without 0x)'
    );
  }
  return hex as `0x${string}`;
}

const adminPrivateKey = normalizePrivateKey(rawPrivateKey);

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

