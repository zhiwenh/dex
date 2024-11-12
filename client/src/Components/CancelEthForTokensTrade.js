import * as React from 'react'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract }
  from 'wagmi';
import { ethers } from 'ethers';
import config from './../config.json';
import { getAccount } from '@wagmi/core';
import { wagmiConfig } from './../wagmiConfig.js';
import { useState } from "react";
import { waitForTransactionReceipt } from '@wagmi/core'
import { getTransactionReceipt } from '@wagmi/core'
import { localhost } from '@wagmi/core/chains'

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function CancelEthForTokensTrade({ sender, indexOfTradeOfAddress, getTrades }) {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();

  const account = getAccount(wagmiConfig);

  async function cancel(e) {
    e.preventDefault();

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    await writeContract({
      address: config.dexAddress,
      abi: dexAbi,
      functionName: 'cancelTradeForEthWithTokens',
      args: [sender, indexOfTradeOfAddress]
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  if (isConfirmed) {
    getTrades();
  }

  console.log('error', error);
  return (
    <div>
      <button class="border rounded p-1" onClick={isPending || isConfirming ? () => {} : cancel}>Cancel Trade</button>
    </div>
  )
}
