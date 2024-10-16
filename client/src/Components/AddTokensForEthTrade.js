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

export function AddTokensForEthTrade() {
  const { hash, isPending, writeContract, error } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();

  async function approveTokens(e) {
    e.preventDefault();

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;

    const account = getAccount(wagmiConfig);

    console.log('account', account);

    let erc20Instance;
    let balanceOfToken;

    try {
      erc20Instance = new ethers.Contract(tradingTokenAddress, erc20Abi, provider);
      console.log('here3');

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
      // console.log('error here 5',error);
      setErrorMessage(error.error);
    }

    const allTrades = await dexInstance.getAllTrades();

    const tokensForTokensTrades = allTrades.tradeTokensForTokensForCall;
    const tokensForEthTrades = allTrades.tradeTokensForEthForCall;

    let totalAllowanceRequired = tradingTokenAmount;

    console.log('here4');

    for (let i = 0; i < tokensForTokensTrades.length; i++) {
      if (tokensForTokensTrades[i].tradingTokenAddress === tradingTokenAddress) {
        totalAllowanceRequired = totalAllowanceRequired + Number(tokensForTokensTrades[i].tradingTokenAmount);
      }
    }

    console.log('here5');

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
  }

  async function submit() {
    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('here3');

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;
    const tradingForEthAmount = document.getElementById('trading-for-eth-amount-2').value;

    const tradingForEthAmountFormatted = ethers.parseUnits(tradingForEthAmount, 'ether');

    console.log('tradingForEthAmountFormatted', tradingForEthAmountFormatted);

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForEthAmount', tradingForEthAmount);

    console.log('dexAbi', dexAbi);
    await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addTokensToDexForTradeWithEth',
        args: [tradingTokenAddress, tradingTokenAmount, tradingForEthAmountFormatted]
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

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
              {isPending ? 'Confirming...' : 'Approve Tokens For Dex'}
            </button>
          </div>
        </div>
          <button class="border rounded p-1" onClick={isPending || isConfirming ? () => {} : submit}>{isPending || isConfirming ? 'Confirming...' : 'Add Trade'} </button>
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
