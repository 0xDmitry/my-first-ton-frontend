import { useEffect, useState } from "react";
import { Address, OpenedContract, toNano } from "ton-core";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: string;
    owner_address: string;
  }>();
  const [balance, setBalance] = useState<null | number>();

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQAIx0wvh_GQCZNYspzUh7AiRM9MT-f5n7z0Ow2-D2OW5T2b")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const dataResponse = await mainContract.getData();
      const balanceResponce = await mainContract.getBalance()
      setContractData({
        counter_value: dataResponse.number,
        recent_sender: dataResponse.recent_sender.toString(),
        owner_address: dataResponse.owner_address.toString(),
      });
      setBalance(balanceResponce.number)

      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    ...contractData,
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    sendIncrement: (value: number) => {
      return mainContract?.sendIncrement(sender, toNano(0.05), value);
    },
    sendDeposit: (value: number) => {
      return mainContract?.sendDeposit(sender, toNano(value));
    },
    sendWithdrawalRequest: (value: number) => {
      return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(value));
    }
  };
}