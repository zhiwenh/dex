import * as React from 'react'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract }
  from 'wagmi';
import { ethers } from 'ethers';
import config from './../config.json';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);


export function AddTokensForTokensTrade() {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function submit(e) {
    e.preventDefault()

    console.log('e', e);

    const tradingTokenAddress = document.getElementById('trading-token-address-1').value;
    const tradingTokenAmount = document.getElementById('trading-token-amount-1').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-1').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-1').value;

    console.log('tradingTokenAddress', tradingTokenAddress);
    console.log('tradingTokenAmount', tradingTokenAmount);
    console.log('tradingForTokenAddress', tradingForTokenAddress);
    console.log('tradingForTokenAmount', tradingForTokenAmount);

    console.log('dexAbi', dexAbi);
    writeContract({
        address: config.dexAddress,
        abi: dexAbi,
        functionName: 'addTokensToDexForTradeWithOtherTokens',
        args: [tradingTokenAddress, tradingTokenAmount, tradingForTokenAddress, tradingForTokenAmount]
      })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  console.log('error', error);
  return (
    <div>
      <form onSubmit={submit}>
        <input name="trading-token-address" id="trading-token-address-1" required />
        <input name="trading-token-amount" id="trading-token-amount-1" required/>
        <input name="trading-for-token-address" id="trading-for-token-address-1" required/>
        <input name="trading-for-token-amount" id="trading-for-token-amount-1" required/>
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
