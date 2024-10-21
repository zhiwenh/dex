import * as React from 'react'
import { useState } from 'react';
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract }
  from 'wagmi';
import { ethers } from 'ethers';
import config from './../config.json';

import { getAccount } from '@wagmi/core';

import { wagmiConfig } from './../wagmiConfig.js';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function MakeEthToTokenTrade({
  sender,
  indexOfTradeOfAddress,
  tradingForEthAmount,
  getTrades,
  saveTokenToEthTrades
   }) {
  const [errorMessage, setErrorMessage] = useState();

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const account = getAccount(wagmiConfig);

  async function submit(e) {
    e.preventDefault()

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    console.log('e', e);

    console.log('dexAbi', dexAbi);
    console.log('sender', sender);
    console.log('indexOfTradeOfAddress', indexOfTradeOfAddress);

    indexOfTradeOfAddress = Number(indexOfTradeOfAddress);

    console.log('indexOfTradeOfAddress', indexOfTradeOfAddress);

    try {
      await writeContract({
          address: config.dexAddress,
          abi: dexAbi,
          functionName: 'buyTokensForEth',
          args: [sender, indexOfTradeOfAddress],
          value: tradingForEthAmount
        })
    } catch (error) {
      console.log(error);
    }

  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash
    })

  if (isConfirmed) {
    console.log('here 2 in isConfirmed');
    saveTokenToEthTrades(sender, indexOfTradeOfAddress, account.address);
    getTrades();
  }

  console.log('error', error);
  return (
    <div className="make-tokens-for-eth-trade-wrap">
      <div>
      </div>
      <div>
        <button class="border rounded p-1" onClick={isPending || isConfirming ? () => {} : submit}>
          {isConfirmed ? 'Traded' : (isPending || isConfirming ? 'Confirming...' : 'Make Trade')}
        </button>
      </div>
      <div>
        {errorMessage ? errorMessage : undefined}
      </div>
      <div className="make-trade-error-transaction">
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error).shortMessage || error.message}</div>
        )}
      </div>
    </div>
  )
}
