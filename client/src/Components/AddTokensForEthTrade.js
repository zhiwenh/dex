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

export function AddTokensForEthTrade({
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  getTrades
}) {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { data: hash2, isPending: isPending2, writeContract: writeContract2, error: error2 } = useWriteContract();

  const [errorMessage, setErrorMessage] = useState();
  const [isConfirmed2Check, setIsConfirmed2Check] = useState();

  const account = getAccount(wagmiConfig);

  async function approveTokens(e) {
    e.preventDefault();

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;

    if (!ethers.isAddress(tradingTokenAddress)) {
      setErrorMessage('Not valid trading token address');
      return;
    }

    if (isNaN(tradingTokenAmount)) {
      setErrorMessage('Trading token amount not a number');
      return;
    }

    let erc20Instance;
    let balanceOfToken;

    try {
      erc20Instance = new ethers.Contract(tradingTokenAddress, erc20Abi, provider);

      balanceOfToken = await erc20Instance.balanceOf(account.address);
      balanceOfToken = Number(balanceOfToken);
    } catch (error) {
      console.log(error);
    }


    if (balanceOfToken < tradingTokenAmount) {
      setErrorMessage('Balance of token not enough')
      return;
    } else {
      setErrorMessage(undefined);
    }

    let allowanceForDex;

    try {
      allowanceForDex = await erc20Instance.allowance(account.address, config.dexAddress);
      allowanceForDex = Number(allowanceForDex);
    } catch (error) {
      console.log(error);
      // setErrorMessage(error.error);
    }

    let totalAllowanceRequired = tradingTokenAmount;

    let allTrades;

    try {
      allTrades = await dexInstance.getAllTrades();
    } catch (error) {
      console.log(error);
    }

    const tokensForTokensTrades = allTrades.tradeTokensForTokensForCall;
    const tokensForEthTrades = allTrades.tradeTokensForEthForCall;

    for (let i = 0; i < tokensForTokensTrades.length; i++) {
      if (tokensForTokensTrades[i].sender === account.address &&
          tokensForTokensTrades[i].tradingTokenAddress === tradingTokenAddress
      ) {
        totalAllowanceRequired = totalAllowanceRequired + Number(tokensForTokensTrades[i].tradingTokenAmount);
      }
    }

    for (let i = 0; i < tokensForEthTrades.length; i++) {
      if (tokensForEthTrades[i].sender === account.address &&
          tokensForEthTrades[i].tradingTokenAddress === tradingTokenAddress
      ) {
        totalAllowanceRequired = totalAllowanceRequired + Number(tokensForEthTrades[i].tradingTokenAmount);
      }
    }

    if (allowanceForDex < totalAllowanceRequired) {
      try {
        await writeContract2({
            address: tradingTokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [config.dexAddress, totalAllowanceRequired]
          })
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMessage('Allowance for dex is enough already');
    }
  }

  async function submit() {
    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;
    const tradingForEthAmount = document.getElementById('trading-for-eth-amount-2').value;

    if (!ethers.isAddress(tradingTokenAddress)) {
      setErrorMessage('Not valid trading token address');
      return;
    }

    if (isNaN(tradingTokenAmount)) {
      setErrorMessage('Trading token amount not a number');
      return;
    }

    let tradingForEthAmountFormatted;
    try {
      tradingForEthAmountFormatted = ethers.parseUnits(tradingForEthAmount, 'ether');
    } catch (error) {
      console.log(error);
    }

    try {
      await writeContract({
          address: config.dexAddress,
          abi: dexAbi,
          functionName: 'addTokensToDexForTradeWithEth',
          args: [tradingTokenAddress, tradingTokenAmount, tradingForEthAmountFormatted]
        })
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash
    });

  if (isConfirmed) {
    getTrades();
  }

  const { isLoading: isConfirming2, isSuccess: isConfirmed2 } =
    useWaitForTransactionReceipt({
      hash: hash2
    });

  if (isConfirming2) {
    if (isConfirmed2Check === undefined) {
      setIsConfirmed2Check(true);
    }
  }

  return (
    <div className="add-tokens-for-eth-trade-wrap">
      <div className="add-trade-token-for-eth-title">
        Make a Token For Eth Offer
      </div>
        <div>
        <div>
          <div>
            Trading Token Address
          </div>
          <input class="border rounded" name="trading-token-address" id="trading-token-address-2" required />
          <div>
            Trading Token Amount
          </div>
          <input class="border rounded" name="trading-token-amount" id="trading-token-amount-2" required/>
          <div>
            Trading For Eth Amount
          </div>
          <input class="border rounded" name="trading-for-eth-amount" id="trading-for-eth-amount-2" required/>
        </div>
        <div>
          <div className="add-tokens-for-eth-trade-approve-header">
          </div>
          <div>
            <button class="border rounded p-1" className="add-tokens-for-eth-approve-button" onClick={approveTokens}>
              {isPending || isPending || isConfirming || isConfirming2 ? 'Confirming...' : 'Approve Tokens For Dex'}
            </button>
          </div>
        </div>
          <button class="border rounded p-1" onClick={isPending || isPending || isConfirming || isConfirming2 ? () => {} : submit}>{isPending || isConfirming ? 'Confirming...' : 'Add Trade'} </button>
        </div>
        <div>
          {isConfirmed2Check ? "Tokens have been approved" : undefined}
        </div>
        <div>
          {errorMessage ? errorMessage : undefined}
        </div>
        <div className="add-trade-transaction-hash-or-error">
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
