import { fromNano } from "ton-core";
import { TonConnectButton } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

import "./App.css";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect()

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <b>Contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Contract Balance</b>
          <div className='Hint'>{contract_balance ? fromNano(contract_balance) : undefined}</div>
        </div>

        <div className='Card'>
          <b>Owner Address</b>
          <div>{owner_address?.slice(0, 30) + "..."}</div>
          <b>Counter Value</b>
          <div>{counter_value}</div>
          <b>Recent Sender</b>
          <div>{recent_sender?.slice(0, 30) + "..."}</div>
        </div>

        <a
          onClick={() => {
            showAlert();
          }}
        >
          Show Alert
        </a>
        <br/>

        {connected && (
          <>
            <a
              onClick={() => {
                sendIncrement(5);
              }}
            >
              Increment by 5
            </a>
            <br/>
            <a
              onClick={() => {
                sendDeposit(1);
              }}
            >
              Deposit 1 TON
            </a>
            <br/>
            <a
              onClick={() => {
                sendWithdrawalRequest(1);
              }}
            >
              Withdraw 1 TON
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
