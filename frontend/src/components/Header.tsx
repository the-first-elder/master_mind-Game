import { useAccount, useDisconnect } from "@starknet-react/core";
import React from "react";
import ConnectModal from "./starknet/ConnectModal";

export default function Header() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="sticky justify-between items-center flex flex-row px-4 p-1">
      <a href="/" className="text-white text-2xl font-semibold">🤯 Mastermind</a>
      {address ? (
        <div className="flex gap-10 items-end bg-zinc-100 rounded-md px-6 py-2">
          <p className="font-semibold">{`${address.slice(
            0,
            6
          )}...${address.slice(-4)}`}</p>
          <p
            onClick={() => disconnect()}
            className="cursor-pointer font-bold bg-[#333862] text-white py-1 px-2 rounded text-black/50"
          >
            Disconnect
          </p>
        </div>
      ) : (
        <ConnectModal />
      )}
    </div>
  );
}
