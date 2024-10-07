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

import './../App.css';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function AddTokensForTokensTrade({ getTrades, setSetTokenTrades, setRerender }) {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function submit(e) {
    e.preventDefault()

    // console.log('setSetTokenTrades', setSetTokenTrades);
    // console.log('e', e);

    const tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-1').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-1').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-1').value;

    const account = getAccount(wagmiConfig);

    console.log('account', account);

    const erc20Instance = new ethers.Contract(tradingTokenAddress, erc20Abi, provider);

    console.log('here3');

    let allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);
    allowanceForDex = Number(allowanceForDex);

    const allTrades = await dexInstance.getAllTrades();

    const tokensForTokensTrades = allTrades.tradeTokensForTokensForCall;
    const tokensForEthTrades = allTrades.tradeTokensForEthForCall;

    let totalAllowanceRequired = tradingTokenAmount;

    for (let i = 0; i < tokensForTokensTrades.length; i++) {
      if (tokensForTokensTrades[i].tradingTokenAddress === tradingTokenAddress) {
        totalAllowanceRequired = totalAllowanceRequired + Number(tokensForTokensTrades[i].tradingTokenAmount);
      }
    }

    for (let i = 0; i < tokensForEthTrades.length; i++) {
      if (tokensForEthTrades[i].tradingTokenAddress === tradingTokenAddress) {
        totalAllowanceRequired = totalAllowanceRequired + Number(tokensForEthTrades[i].tradingTokenAmount);
      }
    }

    console.log('allowanceForDex', allowanceForDex);
    console.log('totalAllowanceRequired', totalAllowanceRequired);
    if (allowanceForDex < totalAllowanceRequired) {
      await writeContract({
          address: tradingTokenAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.dexAddress, totalAllowanceRequired]
        })
    }

    console.log('allowanceForDex', allowanceForDex);

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForTokenAddress', tradingForTokenAddress);
    console.log('tradingForTokenAmount', tradingForTokenAmount);

    await writeContract({
      address: config.dexAddress,
      abi: dexAbi,
      functionName: 'addTokensToDexForTradeWithOtherTokens',
      args: [tradingTokenAddress, tradingTokenAmount, tradingForTokenAddress, tradingForTokenAmount]
    });

    // const { isLoading: trxIsProcessing } = waitForTransactionReceipt(wagmiConfig, {
    //   hash: hash,
    //   chainId: localhost.id,
    //   onError: error => {
    //     console.log(error);
    //   },
    //   onSuccess: async data => {
    //
    //   }
    // // setSetTokenTrades(true);
    // });
  }



  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function test() {
    if (isConfirmed) {
      await getTrades();
      console.log('getTrades');
      setRerender(true);
      console.log('setRerender');
    }
  }

  test();

  console.log('error', error);
  return (
    <div className="add-tokens-for-tokens-trade-wrap">
      <div className="add-trade-token-token-title">
        Make a Token For Token Trade Offer
      </div>
        <form onSubmit={submit}>
        <div>
          <div>
            Trading Token Address
          </div>
          <input name="trading-token-address" id="trading-token-address-1" required />
          <div>
            Trading Token Amount
          </div>
          <input name="trading-token-amount" id="trading-token-amount-1" required/>
          <div>
            Trading For Token Address
          </div><input name="trading-for-token-address" id="trading-for-token-address-1" required/>
          <div>
            Trading For Token Amount
          </div>
          <input name="trading-for-token-amount" id="trading-for-token-amount-1" required/>
        </div>
        <button type="submit">{isPending ? 'Confirming...' : 'Add Trade'} </button>
      </form>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error).shortMessage || error.message}</div>
        )}
    </div>
  )
}
