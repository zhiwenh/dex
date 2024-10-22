import * as React from 'react';
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract }
  from 'wagmi';
import { ethers } from 'ethers';
import config from './../config.json';
import { getAccount } from '@wagmi/core';
import { wagmiConfig } from './../wagmiConfig.js';
import { useState, useRef, useMemo, memo } from "react";
import { waitForTransactionReceipt } from '@wagmi/core'
import { getTransactionReceipt } from '@wagmi/core'
import { localhost } from '@wagmi/core/chains'
import Input from 'rc-input';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function AddTokensForTokensTrade({
  getTrades,
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  tradesOfEthToTokens,
  addToRecentlyAddedTokensToTokensTrades
}) {
  const { data: hash, isPending, writeContract, error, onSuccess } = useWriteContract();
  const { data: hash2, isPending: isPending2, writeContract: writeContract2, error: error2 } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();
  const [pressedOnButton, setPressedOnButton] = useState(false);
  const [tradingTokenAddress2, setTradingTokenAddress2] = useState();
  const [tradingTokenAmount2, setTradingTokenAmount2] = useState();
  const [tradingForTokenAddress2, setTradingForTokenAddress2] = useState();
  const [tradingForTokenAmount2, setTradingForTokenAmount2] = useState();

  const inputRef = useRef(null);

  const account = getAccount(wagmiConfig);

  let isTraded = false;

  let tradingTokenAddressAssigned = false;
  let tradingTokenAddress;
  if (!tradingTokenAddress && tradingTokenAddressAssigned === true) {
    tradingTokenAddress = document.getElementById('trading-token-address-1').value;
  }

  let tradingTokenAmountAssigned = false;
  let tradingTokenAmount;
  if (tradingTokenAmountAssigned === true) {
    tradingTokenAmount = document.getElementById('trading-token-amount-1').value;
  }

  let tradingForTokenAddressAssigned = false;
  let tradingForTokenAddress;
  if (tradingForTokenAddressAssigned === true) {
    tradingForTokenAddress = document.getElementById('trading-for-token-address-1').value;
  }

  let tradingForTokenAmountAssigned = false;
  let tradingForTokenAmount;
  if (tradingForTokenAmountAssigned === true) {
    tradingForTokenAmount = document.getElementById('trading-for-token-amount-1').value;
  }

  async function approveTokens(e) {
    e.preventDefault();

    tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    tradingTokenAmount = document.getElementById('trading-token-amount-1').value;

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    if (!ethers.isAddress(tradingTokenAddress)) {
      setErrorMessage('Not valid trading token address');
      return;
    }

    if (isNaN(tradingTokenAmount)) {
      setErrorMessage('Trading token amount not a number');
      return;
    }

    console.log('account', account);

    let erc20Instance;
    let balanceOfToken;

    try {
       erc20Instance = new ethers.Contract(tradingTokenAddress, erc20Abi, provider);
       console.log('here3');
       balanceOfToken = await erc20Instance.balanceOf(account.address);
       console.log('here4');
       balanceOfToken = Number(balanceOfToken);
    } catch (error) {
      console.log(error);
    }

    console.log('here3');

    if (balanceOfToken < tradingTokenAmount) {
      setErrorMessage('Balance of token not enough');
      setPressedOnButton(false);
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

    console.log('allowanceForDex', allowanceForDex);
    console.log('totalAllowanceRequired', totalAllowanceRequired);
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
        return;
      }
    } else {
      setErrorMessage('Allowance for dex is enough already');
    }
  }

  async function submit() {
    tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    tradingTokenAmount = document.getElementById('trading-token-amount-1').value;
    tradingForTokenAddress = document.getElementById('trading-for-token-address-1').value;
    tradingForTokenAmount = document.getElementById('trading-for-token-amount-1').value;

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    if (!ethers.isAddress(tradingTokenAddress)) {
      setErrorMessage('Not valid trading token address');
      return;
    }

    if (!ethers.isAddress(tradingForTokenAddress)) {
      setErrorMessage('Not valid trading for token address');
      return;
    }

    if (isNaN(tradingTokenAmount)) {
      setErrorMessage('Trading token amount not a number');
      return;
    }

    if (isNaN(tradingForTokenAmount)) {
      setErrorMessage('Trading for token amount not a number');
      return;
    }

    let erc20Instance;
    let balanceOfToken;

    try {
       erc20Instance = new ethers.Contract(tradingTokenAddress, erc20Abi, provider);
       console.log('here3');
       balanceOfToken = await erc20Instance.balanceOf(account.address);
       console.log('here4');
       balanceOfToken = Number(balanceOfToken);

    } catch (error) {
      console.log(error);
    }

    console.log('here3');

    if (balanceOfToken < tradingTokenAmount) {
      setErrorMessage('Balance of token not enough');
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

    console.log('allowanceForDex', allowanceForDex);
    console.log('totalAllowanceRequired', totalAllowanceRequired);
    if (allowanceForDex < totalAllowanceRequired) {
      setErrorMessage('Dex allowance not enough');
      return;
    } else {
      setErrorMessage(undefined);
    }

    console.log('account', account);

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForTokenAddress', tradingForTokenAddress);
    console.log('tradingForTokenAmount', tradingForTokenAmount);

    console.log('writeContract', writeContract);

    try {
      await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addTokensToDexForTradeWithOtherTokens',
        args: [tradingTokenAddress, tradingTokenAmount, tradingForTokenAddress, tradingForTokenAmount]
      });
    } catch (error) {
      return;
    }

    tradingTokenAddressAssigned = true;
    tradingTokenAmountAssigned = true;
    tradingForTokenAddressAssigned = true;
    tradingForTokenAmountAssigned = true;

    setTradingTokenAddress2(tradingTokenAddress);
    setTradingTokenAmount2(tradingTokenAmount)
    setTradingForTokenAddress2(tradingForTokenAddress);
    setTradingForTokenAmount2(tradingForTokenAmount);
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash
    });

  console.log('tradingTokenAddress here 4', tradingTokenAddress);

  if (isConfirmed) {
    console.log('here 2 in isConfirmed');
    console.log('tradingTokenAddress here 2', tradingTokenAddress);
    // addToRecentlyAddedTokensToTokensTrades(
    //   tradingTokenAddress,
    //   tradingTokenAmount,
    //   tradingForTokenAddress,
    //   tradingForTokenAmount
    // );
    isTraded = true;
    getTrades();
  }

  const { isLoading: isConfirming2, isSuccess: isConfirmed2 } =
    useWaitForTransactionReceipt({
      hash: hash2
    });

  // onSuccess(() => {
  //   console.log('here 3 onSuccess');
  //   getTrades();
  // });

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
          <div>
            <input class="border rounded"
              name="trading-token-address"
              id="trading-token-address-1"
              required />
            <div>
              Trading Token Amount
            </div>
            <input class="border rounded"
              name="trading-token-amount"
              id="trading-token-amount-1"
              required/>
            <div>
              Trading For Token Address
            </div>
              <input
                class="border rounded"
                name="trading-for-token-address"
                id="trading-for-token-address-1"
                required/>
            <div>
              Trading For Token Amount
            </div>
            <input
              class="border rounded"
              name="trading-for-token-amount"
              id="trading-for-token-amount-1"
              required/>
          </div>
        </div>
          <div>
            <div className="add-tokens-for-tokens-trade-approve-header">
            </div>
            <div>
              <button class="border rounded p-1" onClick={isPending || isPending2 || isConfirming || isConfirming2 ? () => {} : approveTokens} className="add-tokens-for-tokens-approve-button">
                {isPending || isPending2 || isConfirming || isConfirming2 ? 'Confirming...' : 'Approve Tokens For Dex'}
              </button>
            </div>
          </div>
          <button class="border rounded p-1" onClick={isPending || isPending2 || isConfirming || isConfirming2 ? () => {} : submit}>{isPending || isPending2 || isConfirming || isConfirming2 ? 'Confirming...' : 'Add Trade'} </button>
        </div>
        <div>
        <div>
          {errorMessage ? errorMessage : undefined}
        </div>
        <div>
          <div>
            {isTraded ? tradingTokenAddress2 : undefined}
          </div>
          <div>
            {isTraded ? tradingTokenAmount2 : undefined}
          </div>
          <div>
            {isTraded ? tradingForTokenAddress2 : undefined}
          </div>
          <div>
            {isTraded ? tradingForTokenAmount2 : undefined}
          </div>
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
    </div>
  )
}
