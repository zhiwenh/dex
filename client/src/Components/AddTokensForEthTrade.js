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

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function AddTokensForEthTrade() {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function approveTokens(e) {
    e.preventDefault();

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;

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

  async function submit(e) {
    e.preventDefault()

    console.log('e', e);

    const account = getAccount(wagmiConfig);

    console.log('account', account);

    console.log('here3');

    const tradingTokenAddress = document.getElementById('trading-token-address-2').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-2').value;
    let tradingForEthAmount = document.getElementById('trading-for-eth-amount-2').value;

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForEthAmount', tradingForEthAmount);

    console.log('dexAbi', dexAbi);
    await writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addTokensToDexForTradeWithEth',
        args: [tradingTokenAddress, tradingTokenAmount, tradingForEthAmount]
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  console.log('error', error);
  return (
    <div className="add-tokens-for-eth-trade-wrap">
    <div>
      Make a Token For Eth Trade Offer
    </div>
      <form onSubmit={submit}>
      <div>
        <div>
          Trading Token Address
        </div>
        <input name="trading-token-address" id="trading-token-address-2" required />
        <div>
          Trading Token Amount
        </div>
        <input name="trading-token-amount" id="trading-token-amount-2" required/>
        <div>
          Trading For Eth Amount
        </div>
        <input name="trading-for-eth-amount" id="trading-for-eth-amount-2" required/>
      </div>
      <div>
        <div>
          Approve Tokens To Be Traded By Dex
        </div>
        <div>
          <button onClick={approveTokens}>
            {isPending ? 'Confirming...' : 'Approve Tokens'}
          </button>
        </div>
      </div>
        <button type="submit">{isPending || isConfirming ? 'Confirming...' : 'Add Trade'} </button>
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