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

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function MakeEthToTokenTrade({
  sender,
  indexOfTradeOfAddress,
  tradingForEthAmount
   }) {

  const { hash, isPending, writeContract, error } = useWriteContract();

  async function submit(e) {
    e.preventDefault()

    console.log('e', e);

    const account = getAccount(wagmiConfig);

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
      hash,
    })

  console.log('error', error);
  return (
    <div className="add-tokens-for-eth-trade-wrap">
      <div>
      </div>
      <div>
        <button class="border rounded p-1" onClick={submit}>{isPending ? 'Confirming...' : 'Make Trade'} </button>
      </div>
      <div>
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
