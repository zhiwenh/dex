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

export function MakeTokenToTokenTrade({
  sender,
  indexOfTradeOfAddress,
  tradingForTokenAddress,
  tradingForTokenAmount }) {

  const { hash, isPending, writeContract, error } = useWriteContract();

  async function approve() {
    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('here3');

    const erc20Instance = new ethers.Contract(tradingForTokenAddress, erc20Abi, provider);

    const allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);

    tradingForTokenAmount = Number(tradingForTokenAmount);

    console.log('allowanceForDex', allowanceForDex);
    console.log('tradingForTokenAmount', tradingForTokenAmount);
    if (Number(allowanceForDex) < tradingForTokenAmount) {
      await writeContract({
          address: tradingForTokenAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.dexAddress, tradingForTokenAmount]
        })
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
        functionName: 'buyTokensFromOtherTokens',
        args: [sender, indexOfTradeOfAddress]
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  console.log('error', error);
  return (
    <div className="add-tokens-for-tokens-trade-wrap">
      <div>
      </div>
      <div>
        <div className="make-tokens-trade-approve-header">
          Approve Tokens To Be Traded By Dex
        </div>
        <button className="make-token-trade-approve-button" onClick={approve}>{isPending ? 'Confirming...' : 'Approve Tokens'}</button>
      </div>
      <div>
        <button onClick={submit}>{isPending ? 'Confirming...' : 'Make Trade'} </button>
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
