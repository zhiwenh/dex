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
  index,
  recentlyCompletedAdderTokensToTokensTrades,
  getTrades,
  savedTokensToTokensTrades,
  saveTokenToTokenTrades
}) {

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { data: hash2, isPending: isPending2, writeContract: writeContract2, error: error2 } = useWriteContract();

  const [errorMessage, setErrorMessage] = useState();

  const account = getAccount(wagmiConfig);

  async function approve() {

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

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

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    const erc20Instance = new ethers.Contract(tradingForTokenAddress, erc20Abi, provider);

    let tokenBalance;

    try {
      tokenBalance = await erc20Instance.balanceOf(account.address);
    } catch (error) {
      console.log(error);
    }

    if (tokenBalance < tradingForTokenAmount) {
      setErrorMessage('Balance of token not enough');
      return;
    } else {
      setErrorMessage(undefined);
    }

    let allowanceForDex;

    try {
      allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);
    } catch (error) {
      console.log(error);
    }

    if (allowanceForDex < tradingForTokenAmount) {
      setErrorMessage('Dex allowance not enough');
      return;
    } else {
      setErrorMessage(undefined);
    }

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
      hash: hash
    })

  if (isConfirmed) {
    console.log('here 2 in isConfirmed');
    saveTokenToTokenTrades(sender, indexOfTradeOfAddress, account.address);
    getTrades();
  }

  const { isLoading: isConfirming2, isSuccess: isConfirmed2 } =
    useWaitForTransactionReceipt({
      hash: hash2
    });

  console.log('error', error);
  return (
    <div className="make-tokens-for-tokens-trade-wrap">
      <div>
      </div>
      <div>
        <div className="make-tokens-trade-approve-header">
        </div>
        <button class="border rounded p-1 mb-1" className="make-token-trade-approve-button" onClick={(isPending || isPending2 || isConfirming || isConfirming2) ? () => {} : approve}>{isPending || isPending2 || isConfirming || isConfirming2 ? 'Confirming...' : 'Approve Tokens For Dex'}</button>
      </div>
      <div>
        <button class="border rounded p-1" onClick={(isPending || isPending2 || isConfirming || isConfirming2) ? () => {} : submit}>
          {isConfirmed ? 'Traded' : (isPending || isPending2 || isConfirming || isConfirming2) ? 'Confirming...' : 'Make Trade'}
        </button>
      </div>
      <div>
        {errorMessage ? errorMessage : undefined}
      </div>
      <div className="make-trade-error-transaction">
        {hash ? <div>Transaction Hash: {hash}</div> : undefined}
        {isConfirming ? <div>Waiting for confirmation...</div> : undefined}
        {isConfirmed ? <div>Transaction confirmed.</div> : undefined}
        {error ? (
          <div>Error: {(error).shortMessage || error.message}</div>
        ) : undefined }
      </div>
    </div>
  )
}
