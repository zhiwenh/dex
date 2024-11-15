import * as React from 'react';
import { useState } from 'react';
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract }
  from 'wagmi';
import { ethers } from 'ethers';
import config from './../config.json';

import { wagmiConfig } from './../wagmiConfig.js';

import { getAccount } from '@wagmi/core';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function AddEthForTokensTrade({ getTrades }) {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();

  const account = getAccount(wagmiConfig);

  async function submit() {
    // e.preventDefault()

    // console.log('e', e);

    if (!account.address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    let tradingEthAmount = document.getElementById('trading-eth-amount-3').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-3').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-3').value;

    if (!ethers.isAddress(tradingForTokenAddress)) {
      setErrorMessage('Not valid trading for token address');
      return;
    }

    if (isNaN(tradingForTokenAmount)) {
      setErrorMessage('Trading for token amount not a number');
      return;
    }

    try {
      tradingEthAmount = ethers.parseUnits(tradingEthAmount, 'ether');
    } catch (error) {
      console.log(error);
    }

    let balanceOfAccount;

    try {
      balanceOfAccount = await provider.getBalance(account.address);
    } catch (error) {
      console.log(error);
    }

    balanceOfAccount = Number(balanceOfAccount);

    // balanceOfAccount = ethers.parseUnits(balanceOfAccount, 'ether');

    if (balanceOfAccount < tradingEthAmount) {
      setErrorMessage('Eth balance not enough')
      return;
    } else {
      setErrorMessage(undefined)
    }

    try {
      writeContract({
          address: config.dexAddress,
          abi: dexAbi,
          functionName: 'addEthToDexForTradeWithTokens',
          args: [tradingEthAmount, tradingForTokenAddress, tradingForTokenAmount],
          value: tradingEthAmount
        })
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
      onSuccess(data) {
        console.log('onSuccess here 5');
        getTrades();
      }
    });

  if (isConfirmed) {
    getTrades();
  }

  return (
    <div className="add-eth-for-tokens-trade-wrap">
      <div className="add-trade-eth-for-token-title">
        Make a Eth For Token Offer
      </div>
        <div>
        <div>
          <div>
            Trading Eth Amount
          </div>
          <input class="border rounded" name="trading-token-amount" id="trading-eth-amount-3" required/>
          <div>
            Trading For Token Address
          </div><input class="border rounded" name="trading-for-token-address" id="trading-for-token-address-3" required/>
          <div>
            Trading For Token Amount
          </div>
          <input class="border rounded mb-1" name="trading-for-token-amount border-gray-300" id="trading-for-token-amount-3" required/>
        </div>
          <button class="border rounded p-1" className="add-eth-for-tokens-trade-button" onClick={isPending || isConfirming ? () => {} : submit}>{isPending || isConfirming ? 'Confirming...' : 'Add Trade'}</button>
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
