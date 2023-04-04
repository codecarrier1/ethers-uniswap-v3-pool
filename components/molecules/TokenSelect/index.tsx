import React, { useState } from "react";
import OutsideClickHander from "react-outside-click-handler";
import Image from "next/image";
import { TOKENS } from "../../../constants";

interface ITokenSelectProps {
  selectedToken: string;
  handleChange: (v: string) => void;
}

const TokenSelect: React.FC<ITokenSelectProps> = ({
  selectedToken,
  handleChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='relative text-white flex-shrink-0'>
      <div
        className='bg-grey-300 hover:bg-grey-light flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer'
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className='w-3 h-5 relative'>
          <Image src={TOKENS[selectedToken].icon} layout='fill' alt='' />
        </div>
        {TOKENS[selectedToken].symbol}
      </div>
      {showDropdown && (
        <OutsideClickHander onOutsideClick={() => setShowDropdown(false)}>
          <div className='absolute top-full left-0 rounded-md bg-grey-300 flex flex-col overflow-hidden mt-1 z-10'>
            {Object.keys(TOKENS).map((token, index) => (
              <div
                className='bg-grey-300 hover:bg-grey-light flex items-center gap-1 px-2 py-1 cursor-pointer'
                onClick={() => {
                  handleChange(token);
                  setShowDropdown(false);
                }}
                key={index}
              >
                <div className='w-3 h-5 relative'>
                  <Image src={TOKENS[token].icon} layout='fill' alt='' />
                </div>
                {TOKENS[token].symbol}
              </div>
            ))}
          </div>
        </OutsideClickHander>
      )}
    </div>
  );
};

export default TokenSelect;
