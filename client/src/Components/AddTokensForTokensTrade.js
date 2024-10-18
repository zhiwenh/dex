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
  tradesOfEthToTokens
}) {
  const { data: hash, isPending, writeContract, error, onSuccess } = useWriteContract();
  const { data: hash2, isPending: isPending2, writeContract: writeContract2, error: error2 } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();
  const [pressedOnButton, setPressedOnButton] = useState(false);
  const inputRef = useRef(null);

  async function approveTokens(e) {
    setPressedOnButton(true);
    e.preventDefault();

    const tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-1').value;

    const account = getAccount(wagmiConfig);

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
        setPressedOnButton(false);
        return;
      }
    }

    setPressedOnButton(false);
  }

  async function submit() {
    setPressedOnButton(true);

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

    console.log('writeContract', writeContract);

    try {
      await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addTokensToDexForTradeWithOtherTokens',
        args: [tradingTokenAddress, tradingTokenAmount, tradingForTokenAddress, tradingForTokenAmount],
        onSuccess: () => {
          console.log('onSuccess here 4');
          getTrades();
        }
      });
    } catch (error) {
      setPressedOnButton(false);
      return;
    }

    setPressedOnButton(false);
  }

  // function tradingTokenAddressInputOnChange(e) {
  //   console.log('tradingTokenAddressInputOnChange e', e);
  //   setTradingTokenAddressInputAddTokenToToken(e.target.value)
  //   const cursorPosition = e.target.selectionStart;
  //   inputRef.current.selectionStart = cursorPosition;
  //   inputRef.current.selectionEnd = cursorPosition;
  // }
  //
  // function tradingTokenAmountInputOnChange(e) {
  //   setTradingTokenAmountInputAddTokenToToken(e.target.value)
  // }
  //
  // function tradingTokenForAddressInputOnChange(e) {
  //   setTradingForTokenAddressAddTokenToToken(e.target.value)
  // }
  //
  // function tradingTokenForAmountInputOnChange(e) {
  //   setTradingForTokenAmountAddTokenToToken(e.target.value)
  // }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
      onSuccess(data) {
        console.log('onSuccess here 5');
        getTrades();
      }
    });

  // if (isConfirmed) {
  //   console.log('here 2 in isConfirmed');
  //   getTrades();
  // }

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
              <button class="border rounded p-1" onClick={isPending || isConfirming || pressedOnButton ? () => {} : approveTokens} className="add-tokens-for-tokens-approve-button">
                {isPending || isConfirming ? 'Confirming...' : 'Approve Tokens For Dex'}
              </button>
            </div>
          </div>
          <button class="border rounded p-1" onClick={isPending || isConfirming || pressedOnButton ? () => {} : submit}>{isPending || isConfirming ? 'Confirming...' : 'Add Trade'} </button>
        </div>
        <div>
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
    </div>
  )
}
