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

export function CancelTokensForEthTrade({ sender, indexOfTradeOfAddress }) {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function cancel(e) {
    e.preventDefault();

    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('here3');

    await writeContract({
      address: config.dexAddress,
      abi: dexAbi,
      functionName: 'cancelTradeForTokensWithEth',
      args: [sender, indexOfTradeOfAddress]
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  console.log('error', error);
  return (
    <div>
      <button onClick={cancel}>Cancel Trade</button>
    </div>
  )
}