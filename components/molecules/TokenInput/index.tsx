import React from "react";
import { ethers } from "ethers";
import TokenSelect from "components/molecules/TokenSelect";
import { TOKENS } from "../../../constants";

interface ITokenInputProps {
  tokenAmount: string;
  handleChangeAmount: (v: string) => void;
  selectedToken: string;
  handleChangeToken: (v: string) => void;
  balance?: ethers.BigNumber;
}

const TokenInput: React.FC<ITokenInputProps> = ({
  tokenAmount,
  selectedToken,
  handleChangeAmount,
  handleChangeToken,
  balance = ethers.BigNumber.from(0),
}) => {
  return (
    <div className='p-2 bg-grey rounded-lg'>
      <div className='flex items-center gap-4'>
        <input
          className='flex-grow text-lg text-white bg-transparent outline-none min-w-0'
          placeholder='0'
          type='number'
          value={tokenAmount}
          onChange={e => handleChangeAmount(e.target.value)}
        />
        <TokenSelect
          selectedToken={selectedToken}
          handleChange={handleChangeToken}
        />
      </div>
      <div className='mt-1 flex items-center justify-end'>
        <div className='text-xs text-white'>
          Balance:{" "}
          <span className='font-semibold'>
            {balance
              ? parseFloat(
                  ethers.utils.formatUnits(
                    balance,
                    TOKENS[selectedToken].decimals
                  )
                ).toFixed(3)
              : 0}
          </span>
        </div>
        <div
          className='text-primary text-xs cursor-pointer ml-2'
          onClick={() =>
            handleChangeAmount(
              balance
                ? ethers.utils.formatUnits(
                    balance,
                    TOKENS[selectedToken].decimals
                  )
                : "0"
            )
          }
        >
          Max
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
