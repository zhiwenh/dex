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

export function AddTokensForTokensTrade({ getTrades, setSetTokenTrades, setRerender }) {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function approveTokens(e) {
    e.preventDefault();

    const tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-1').value;

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
      const hash = await writeContract({
          address: tradingTokenAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.dexAddress, totalAllowanceRequired]
        })
    }
  }

  async function submit() {
    const tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-1').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-1').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-1').value;

    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForTokenAddress', tradingForTokenAddress);
    console.log('tradingForTokenAmount', tradingForTokenAmount);

    const hash = await writeContract({
      address: config.dexAddress,
      abi: dexAbi,
      functionName: 'addTokensToDexForTradeWithOtherTokens',
      args: [tradingTokenAddress, tradingTokenAmount, tradingForTokenAddress, tradingForTokenAmount]
    });
  }

  function blank() {

  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="add-tokens-for-tokens-trade-wrap">
      <div className="add-trade-token-for-token-title">
        Make a Token For Token Offer
      </div>
        <div>
        <div>
          <div>
            Trading Token Address
          </div>
          <input class="border rounded" name="trading-token-address" id="trading-token-address-1" required />
          <div>
            Trading Token Amount
          </div>
          <input class="border rounded" name="trading-token-amount" id="trading-token-amount-1" required/>
          <div>
            Trading For Token Address
          </div><input class="border rounded" name="trading-for-token-address" id="trading-for-token-address-1" required/>
          <div>
            Trading For Token Amount
          </div>
          <input class="border rounded" name="trading-for-token-amount" id="trading-for-token-amount-1" required/>
        </div>
          <div>
            <div className="add-tokens-for-tokens-trade-approve-header">
            </div>
            <div>
              <button class="border rounded p-1" onClick={isPending ? blank : approveTokens} className="add-tokens-for-tokens-approve-button">
                {isPending ? 'Confirming...' : 'Approve Tokens For Dex'}
              </button>
            </div>
          </div>
          <button class="border rounded p-1" onClick={isPending ? blank : submit}>{isPending ? 'Confirming...' : 'Add Trade'} </button>
        </div>
        <div>
        <div>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div>Error: {(error).shortMessage || error.message}</div>
          )}
        </div>
      </div>
    </div>
  )
}
