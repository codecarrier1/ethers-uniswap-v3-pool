export const DEFAULT_CHAIN_ID = 5;
export const CHAINS = {
  5: {
    name: "Goerli Testnet",
    rpc: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    explorer: "https://goerli.etherscan.io",
    icon: "/icons/ethereum.svg",
  },
};

interface IToken {
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
}

export const TOKENS: { [key: string]: IToken } = {
  ETH: {
    symbol: "ETH",
    decimals: 18,
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    icon: "/icons/ethereum.svg",
  },
  TEST_TOKEN: {
    symbol: "TEST_TOKEN",
    decimals: 18,
    address: "0xb14f00ccac24c571fbd846a30c5e8fc28316f996",
    icon: "/icons/test_token.svg",
  },
};

export const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
