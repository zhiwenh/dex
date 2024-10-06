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

export function AddEthForTokensTrade() {
  const { hash, isPending, writeContract, error } = useWriteContract();

  async function submit(e) {
    e.preventDefault()

    console.log('e', e);

    let tradingEthAmount = document.getElementById('trading-eth-amount-3').value;
    const tradingForTokenAddress = document.getElementById('trading-for-token-address-3').value;
    const tradingForTokenAmount = document.getElementById('trading-for-token-amount-3').value;

    tradingEthAmount = ethers.parseUnits(tradingEthAmount, 'ether');

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

  console.log('error', error);

  return (
    <div className="add-eth-for-tokens-trade-wrap">
      <div>
        Make a Eth For Token Trade Offer
      </div>
        <form onSubmit={submit}>
        <div>
          <div>
            Trading Eth Amount
          </div>
          <input name="trading-token-amount" id="trading-eth-amount-3" required/>
          <div>
            Trading For Token Address
          </div><input name="trading-for-token-address" id="trading-for-token-address-3" required/>
          <div>
            Trading For Token Amount
          </div>
          <input name="trading-for-token-amount" id="trading-for-token-amount-3" required/>
        </div>
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
