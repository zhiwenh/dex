import * as React from 'react';
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

export function MakeTokenToTokenTrade({
  sender,
  indexOfTradeOfAddress,
  tradingForTokenAddress,
  tradingForTokenAmount,
}) {

  const { hash, isPending, writeContract, error } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();

  async function approve() {
    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('here3');

    const erc20Instance = new ethers.Contract(tradingForTokenAddress, erc20Abi, provider);

    console.log('here3');

    let balanceOfToken = await erc20Instance.balanceOf(account.address);
    balanceOfToken = Number(balanceOfToken);

    if (balanceOfToken < tradingForTokenAmount) {
      setErrorMessage('Balance of token not enough')
      return;
    } else {
      setErrorMessage(undefined);
    }

    const allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);

    tradingForTokenAmount = Number(tradingForTokenAmount);

    console.log('allowanceForDex', allowanceForDex);
    console.log('tradingForTokenAmount', tradingForTokenAmount);
    if (Number(allowanceForDex) < tradingForTokenAmount) {
      try {
        await writeContract({
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

    try {
      await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'buyTokensFromTokens',
        args: [sender, indexOfTradeOfAddress]
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
    <div className="add-tokens-for-tokens-trade-wrap">
      <div>
      </div>
      <div>
        <div className="make-tokens-trade-approve-header">
        </div>
        <button class="border rounded p-1 mb-1" className="make-token-trade-approve-button" onClick={approve}>{isPending ? 'Confirming...' : 'Approve Tokens For Dex'}</button>
      </div>
      <div>
        <button class="border rounded p-1" onClick={isPending || isConfirming ? () => {} : submit}>{isPending || isConfirming ? 'Confirming...' : 'Make Trade'} </button>
      </div>
      <div>
        {errorMessage ? errorMessage : undefined}
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
