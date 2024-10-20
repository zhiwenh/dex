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

export function MakeTokenToEthTrade({
  sender,
  indexOfTradeOfAddress,
  tradingForTokenAddress,
  tradingForTokenAmount,
  getTrades,
  saveEthToTokenTrades
}) {

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { data: hash2, isPending: isPending2, writeContract: writeContract2, error: error2 } = useWriteContract();

  const account = getAccount(wagmiConfig);

  async function approve() {
    console.log('account', account);

    console.log('here3');

    const erc20Instance = new ethers.Contract(tradingForTokenAddress, erc20Abi, provider);

    let allowanceForDex;

    try {
      allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);
    } catch (error) {
      console.log(error);
    }

    tradingForTokenAmount = Number(tradingForTokenAmount);

    console.log('allowanceForDex', allowanceForDex);
    console.log('tradingForTokenAmount', tradingForTokenAmount);
    if (Number(allowanceForDex) < tradingForTokenAmount) {
      try {
        await writeContract2({
          address: tradingForTokenAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.dexAddress, tradingForTokenAmount]
        })
      } catch (error) {
         console.log(error);
      }
    }
  }

  async function submit(e) {
    e.preventDefault()

    console.log('e', e);

    const account = getAccount(wagmiConfig);

    tradingForTokenAmount = Number(tradingForTokenAmount);

    console.log('dexAbi', dexAbi);
    console.log('sender', sender);
    console.log('indexOfTradeOfAddress', indexOfTradeOfAddress);

    indexOfTradeOfAddress = Number(indexOfTradeOfAddress);

    console.log('indexOfTradeOfAddress', indexOfTradeOfAddress);

    await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'buyEthForTokens',
        args: [sender, indexOfTradeOfAddress]
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash
    })

  if (isConfirmed) {
    console.log('here 2 in isConfirmed');
    saveEthToTokenTrades(sender, indexOfTradeOfAddress, account.address);
    getTrades();
  }

  console.log('error', error);
  return (
    <div className="make-tokens-for-eth-trade-wrap">
      <div>
      </div>
      <div>
        <div className="make-tokens-trade-approve-header">
        </div>
        <button class="border rounded p-1 mb-1" className="make-token-trade-approve-button" onClick={isPending || isConfirming ? () => {} : approve}>{isPending ? 'Confirming...' : 'Approve Tokens For Dex'}</button>
      </div>
      <div>
        <button class="border rounded p-1" onClick={isPending || isConfirming ? () => {} : submit}>
          {isConfirmed ? 'Traded' : (isPending || isConfirming ? 'Confirming...' : 'Make Trade')}
        </button>
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
