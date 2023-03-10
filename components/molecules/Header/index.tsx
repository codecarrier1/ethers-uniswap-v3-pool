import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Button from "components/atoms/Button";
import Account from "components/molecules/Account";
import { injected } from "connectors";
import { useEagerConnect, useInactiveListener } from "hooks/useWeb3";

const Header = () => {
  const { account, activate, library, deactivate } = useWeb3React();

  const [activatingConnector, setActivatingConnector] = useState<any>();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <div className='px-5 flex items-center justify-end gap-5'>
      <a href='#'>
        <Button type='SECONDARY'>
          <div className='flex gap-1 items-center'>
            Join our community
            <FontAwesomeIcon icon={faDiscord} />
          </div>
        </Button>
      </a>
      <Account />
    </div>
  );
};

export default Header;
