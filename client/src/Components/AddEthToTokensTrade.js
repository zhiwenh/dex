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

export function AddEthForTokensTrade() {
  const { hash, isPending, writeContract, error } = useWriteContract();
  const [errorMessage, setErrorMessage] = useState();

  async function submit() {
    // e.preventDefault()

    // console.log('e', e);
    const account = getAccount(wagmiConfig);

    let tradingEthAmount = document.getElementById('trading-eth-amount-3').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-3').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-3').value;

    tradingEthAmount = ethers.parseUnits(tradingEthAmount, 'ether');

    console.log('here 10');
    let balanceOfAccount = await provider.getBalance(account.address);

    console.log('here 11 balanceOfAccount', balanceOfAccount);

    balanceOfAccount = Number(balanceOfAccount);

    // balanceOfAccount = ethers.parseUnits(balanceOfAccount, 'ether');

    console.log('here 14');

    console.log('here 12');

    if (balanceOfAccount < tradingEthAmount) {
      setErrorMessage('Eth balance not enough')
      return;
    } else {
      setErrorMessage(undefined)
    }

    console.log('here 13');

    console.log('tradingEthAmount', tradingEthAmount);
    console.log('tradingForTokenAddress', tradingForTokenAddress);
    console.log('tradingForTokenAmount', tradingForTokenAmount);

    console.log('dexAbi', dexAbi);
    writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addEthToDexForTradeWithTokens',
        args: [tradingEthAmount, tradingForTokenAddress, tradingForTokenAmount],
        value: tradingEthAmount
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

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
