# Simple Swap App on Uniswap V3

This is a simple swap application on ETH-TEST_TOKEN liquidity pool on Uniswap V3.

This is created by using React.js, Next.js, TypeScript, TailwindCSS, and Ethers.js.

Deployed here.

https://volume-fi-danny-frontend-assignment.vercel.app/

# Steps to run

- `yarn` or `yarn install`
- `yarn dev`
- `.env` file
  NEXT_PUBLIC_RPC_URL_1=https://mainnet.infura.io/v3/{INFURA_API_KEY}
  NEXT_PUBLIC_RPC_URL_5=https://goerli.infura.io/v3/{INFURA_API_KEY}

# Token & LP Information

- TEST_TOKEN Address: 0xb14f00ccac24c571fbd846a30c5e8fc28316f996

# User Stories

- ETH-TEST_TOKEN Flow

  1. Connect wallet.
  2. Input ETH Amount.
  3. Click swap.
  4. Wrap ETH to WETH.
  5. Send transaction to Uniswap Router
  6. See a toast if success.

- TEST_TOKEN-ETH Flow
  1. Connect wallet.
  2. Input TEST_TOKEN Amount.
  3. Click swap.
  4. Send transaction to Uniswap Router
  5. Unwrap WETH to ETH.
  6. See a toast if success.