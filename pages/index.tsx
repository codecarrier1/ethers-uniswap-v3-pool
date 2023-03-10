import React, { useEffect, useState, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";
import Layout from "components/organisms/Layout";
import Header from "components/molecules/Header";
import TokenInput from "components/molecules/TokenInput";
import Button from "components/atoms/Button";
import {
  TOKENS,
  DEFAULT_CHAIN_ID,
  UNISWAP_V3_FACTORY,
  UNISWAP_V3_ROUTER,
} from "../constants";
import ERC20ABI from "../constants/ABI/BasicERC20.json";
import UniswapV3FactoryABI from "../constants/ABI/UniswapV3Factory.json";
import UniswapV3PoolABI from "../constants/ABI/UniswapV3Pool.json";
import UniswapV3RouterABI from "../constants/ABI/UniswapV3Router.json";
import WETHABI from "../constants/ABI/WETH.json";

const IndexPage = () => {
  const { chainId, library, account } = useWeb3React();

  const [sellToken, setSellToken] = useState("ETH");
  const [buyToken, setBuyToken] = useState("TEST_TOKEN");
  const [sellAmount, setSellAmount] = useState("0");
  const [buyAmount, setBuyAmount] = useState("0");
  const [balances, setBalances] = useState<{ [key: string]: ethers.BigNumber }>(
    {}
  );
  const [price, setPrice] = useState(0);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [wrappingEth, setWrappingEth] = useState(false);
  const [unwrappingEth, setUnwrappingEth] = useState(false);
  const [txHash, setTxHash] = useState("");

  const fetchPrice = async (sellToken: string, buyToken: string) => {
    setFetchingPrice(true);
    try {
      if (sellToken === buyToken) {
        setPrice(1);
        setFetchingPrice(false);
        return 1;
      }
      const FactoryContract = new ethers.Contract(
        UNISWAP_V3_FACTORY,
        UniswapV3FactoryABI,
        library
      );
      const V3pool = await FactoryContract.getPool(
        TOKENS[sellToken].address,
        TOKENS[buyToken].address,
        500
      );
      const poolContract = new ethers.Contract(
        V3pool,
        UniswapV3PoolABI,
        library
      );
      const slot0 = await poolContract.slot0();
      const sqrtPriceX96 = slot0.sqrtPriceX96.toString();
      let token0Decimals = TOKENS[sellToken].decimals;
      let token1Decimals = TOKENS[buyToken].decimals;
      const buyOneOfToken0 =
        (sqrtPriceX96 * sqrtPriceX96 * 10 ** token0Decimals) /
        10 ** token1Decimals /
        2 ** 192;
      const buyOneOfToken1 = parseFloat(
        (1 / buyOneOfToken0).toFixed(token0Decimals)
      );
      setPrice(buyOneOfToken1);
      setFetchingPrice(false);
      return sellToken === "ETH" ? buyOneOfToken1 : buyOneOfToken0;
    } catch (err) {
      console.log("fetchPrice - ", err);
    }
    setFetchingPrice(false);
  };

  const fetchBalances = async () => {
    try {
      if (chainId === DEFAULT_CHAIN_ID && account) {
        await Promise.all(
          Object.keys(TOKENS).map(async token => {
            if (token === "ETH") {
              const ethBalance = await library.getBalance(account);
              setBalances(balances => ({ ...balances, [token]: ethBalance }));
            } else {
              const tokenContract = new ethers.Contract(
                TOKENS[token].address,
                ERC20ABI,
                library.getSigner()
              );
              const tokenBalance = await tokenContract.balanceOf(account);
              setBalances(balances => ({ ...balances, [token]: tokenBalance }));
            }
          })
        );
      } else {
        setBalances({});
      }
    } catch (err) {
      console.log("fetchBalances - ", err);
    }
  };

  const handleChangeSellToken = async (v: string) => {
    setSellToken(v);
    const newPrice = await fetchPrice(v, buyToken);
    if (!sellAmount || sellAmount === "0") {
      setBuyAmount("0");
      return;
    }
    setBuyAmount((newPrice * parseFloat(sellAmount)).toString());
  };

  const handleChangeBuyToken = async (v: string) => {
    setBuyToken(v);
    const newPrice = await fetchPrice(sellToken, v);
    if (!sellAmount || sellAmount === "0") {
      setBuyAmount("0");
      return;
    }
    setBuyAmount((newPrice * parseFloat(sellAmount)).toString());
  };

  const handleChangeSellAmount = async (v: string) => {
    setSellAmount(v);
    const newPrice = await fetchPrice(sellToken, buyToken);
    if (!v || v === "0") {
      setBuyAmount("0");
      return;
    }
    setBuyAmount((newPrice * parseFloat(v)).toString());
  };

  const handleChangeBuyAmount = async (v: string) => {
    const newPrice = await fetchPrice(buyToken, sellToken);
    setBuyAmount(v);
    if (!v || v === "0") {
      setSellAmount("0");
      return;
    }
    setSellAmount((newPrice * parseFloat(v)).toString());
  };

  const handleExchangeTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount("0");
    setBuyAmount("0");
  };

  const handleSwap = async () => {
    try {
      setSwapping(true);
      setTxHash("");
      const routerContract = new ethers.Contract(
        UNISWAP_V3_ROUTER,
        UniswapV3RouterABI,
        library.getSigner()
      );
      const tokenContract = new ethers.Contract(
        TOKENS[sellToken].address,
        ERC20ABI,
        library.getSigner()
      );
      const allowance = await tokenContract.allowance(
        account,
        UNISWAP_V3_ROUTER
      );
      const sellAmountBN = ethers.utils.parseUnits(
        sellAmount,
        TOKENS[sellToken].decimals
      );

      // Approve additional tokens
      if (sellAmountBN.gt(allowance)) {
        const approveTx = await tokenContract.approve(
          UNISWAP_V3_ROUTER,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();
      }

      // Wrapping ETH
      if (sellToken === "ETH") {
        const tokenContract = new ethers.Contract(
          TOKENS[sellToken].address,
          WETHABI,
          library.getSigner()
        );
        const wethBalance = await tokenContract.balanceOf(account);
        if (sellAmountBN.gt(wethBalance)) {
          setWrappingEth(true);
          const wrapEthTx = await tokenContract.deposit({
            value: sellAmountBN.sub(wethBalance),
          });
          await wrapEthTx.wait();
          setWrappingEth(false);
        }
      }

      const swapTx = await routerContract.exactInputSingle({
        tokenIn: TOKENS[sellToken].address,
        tokenOut: TOKENS[buyToken].address,
        fee: 500,
        recipient: account,
        deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
        amountIn: sellAmountBN,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      });
      setTxHash(swapTx.hash);
      await swapTx.wait();

      toast.success(
        <>
          Transaction was successful.{" "}
          <a
            href={`https://goerli.etherscan.io/tx/${swapTx.hash}`}
            target='_blank'
          >
            Check on explorer.
          </a>
        </>
      );

      if (buyToken === "ETH") {
        const tokenContract = new ethers.Contract(
          TOKENS[buyToken].address,
          WETHABI,
          library.getSigner()
        );
        const wethBalance = await tokenContract.balanceOf(account);
        if (wethBalance.gt(ethers.BigNumber.from(0))) {
          setUnwrappingEth(true);
          const withdrawEthTx = await tokenContract.withdraw(wethBalance);
          await withdrawEthTx.wait();
          setUnwrappingEth(false);
        }
      }
      setSellAmount("0");
      setBuyAmount("0");
      fetchBalances();
    } catch (err) {
      console.log("handleSwap - ", err);
      toast.error("Sorry. Something went wrong. Try again later.");
    }
    setSwapping(false);
    setWrappingEth(false);
    setUnwrappingEth(false);
  };

  useEffect(() => {
    if (chainId === DEFAULT_CHAIN_ID && account && library) {
      fetchBalances();
    } else {
      setBalances({});
    }
  }, [account, chainId, library]);

  return (
    <Layout>
      <Header />
      <div className='flex-grow'>
        <div className='w-[400px] mt-20 mx-auto p-5 rounded-lg border boder-white'>
          <h1 className='text-white text-2xl font-bold'>Swap</h1>
          <div className='mt-5 flex flex-col gap-1'>
            <TokenInput
              tokenAmount={sellAmount}
              selectedToken={sellToken}
              handleChangeAmount={handleChangeSellAmount}
              handleChangeToken={handleChangeSellToken}
              balance={balances[sellToken]}
            />
            <div className='relative'>
              <div className='absolute -top-[10px] left-1/2 transform -translate-x-1/2 flex justify-center items-center text-white text-xl'>
                <FontAwesomeIcon
                  className='cursor-pointer'
                  fill='white'
                  icon={faCircleArrowDown}
                  onClick={handleExchangeTokens}
                />
              </div>
            </div>
            <TokenInput
              tokenAmount={buyAmount}
              selectedToken={buyToken}
              handleChangeAmount={handleChangeBuyAmount}
              handleChangeToken={handleChangeBuyToken}
              balance={balances[buyToken]}
            />
          </div>
          <div className='mt-2 min-h-4'>
            {fetchingPrice && (
              <p className='text-white text-xs'>Fetching price ...</p>
            )}
            {!fetchingPrice &&
              price &&
              sellAmount &&
              buyAmount &&
              !wrappingEth && (
                <p className='text-white text-xs'>
                  You will get: ~ {buyAmount} {buyToken} tokens
                </p>
              )}
            {wrappingEth && (
              <p className='text-white text-xs'>Wrapping ETH to WETH</p>
            )}
            {unwrappingEth && (
              <p className='text-white text-xs'>Unwrapping WETH to ETH</p>
            )}
            {swapping && txHash && (
              <p className='text-white text-xs'>
                Swapping...{" "}
                <a
                  href={`https://goerli.etherscan.io/tx/${txHash}`}
                  target='_blank'
                >
                  Check on explorer
                </a>
              </p>
            )}
          </div>
          <div className='mt-2'>
            <Button
              className='w-full'
              type='PRIMARY'
              disabled={
                fetchingPrice ||
                !sellAmount ||
                !buyAmount ||
                sellAmount === "0" ||
                buyAmount === "0" ||
                sellToken === buyToken ||
                swapping ||
                chainId !== DEFAULT_CHAIN_ID
              }
              onClick={handleSwap}
              loading={swapping}
            >
              {swapping ? "Swapping" : "Swap"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
