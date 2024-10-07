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

export function DisplayUserTrades({
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  tradesOfEthToTokens
}) {

  const account = getAccount(wagmiConfig);

  console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);

  if (tradesOfTokensToTokens) {
    tradesOfTokensToTokens = tradesOfTokensToTokens.filter(trade => {
      return trade.sender === account.address;
    }).map((trade, index) => {
      return (
        <div className="display-trades-of-tokens-for-tokens" key={index.toString()}>
          <div className="trade-of-tokens-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div className="trade-address-overflow">
              Sender
            </div>
            <div className="trade-of-tokens-for-tokens-sender">
              {trade.sender}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-index-wrap" className="trade-inner-wrap">
            <div>
              Index
            </div>
            <div className="trade-of-tokens-for-tokens-index">
              {Number(trade.indexOfTradeOfAddress)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading Token Name
            </div>
            <div>
              {trade.tradingTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading Token Symbol
            </div>
            <div>
              {trade.tradingTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Address
            </div>
            <div className="trade-address-overflow" className="trade-of-tokens-for-tokens-trading-token-address"mclassName="trade-inner-wrap">
              {trade.tradingTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Amount
            </div>
            <div>
              {Number(trade.tradingTokenAmount)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading For Token Name
            </div>
            <div>
              {trade.tradingForTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading For Token Symbol
            </div>
            <div>
              {trade.tradingForTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-for-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Address
            </div>
            <div className="trade-address-overflow">
              {trade.tradingForTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-for-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Amount
            </div>
            <div>
              {Number(trade.tradingForTokenAmount)}
            </div>
          </div>
          <div>
            <div>
              Trade Status
            </div>
            <div>
              {trade.alreadyTraded ? 'Traded' : 'Not Traded'}
            </div>
          </div>
        </div>
      )
    })
  }

  if (tradesOfTokensToEth) {
    tradesOfTokensToEth = tradesOfTokensToEth.filter(trade => {
      return trade.sender === account.address;
    }).map((trade, index) => {
      return (
        <div className="display-trade-of-tokens-for-eth" key={index.toString()}>
          <div className="trade-of-tokens-for-eth-sender-wrap" className="trade-inner-wrap">
            <div>
              Sender
            </div>
            <div>
              {trade.sender}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-index-wrap" className="trade-inner-wrap">
            <div>
              Index
            </div>
            <div>
              {Number(trade.indexOfTradeOfAddress)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading Token Name
            </div>
            <div>
              {trade.tradingTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading Token Symbol
            </div>
            <div>
              {trade.tradingTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Address
            </div>
            <div>
              {trade.tradingTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Amount
            </div>
            <div>
              {Number(trade.tradingTokenAmount)}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-for-eth-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading For Eth Amount
            </div>
            <div>
              {ethers.formatUnits(trade.tradingForEthAmount)}
            </div>
          </div>
          <div>
            <div>
              Trade Status
            </div>
            <div>
              {trade.alreadyTraded ? 'Traded' : 'Not Traded'}
            </div>
          </div>
        </div>
      );
    })
  }

  if (tradesOfEthToTokens) {
    tradesOfEthToTokens = tradesOfEthToTokens.filter(trade => {
      return trade.sender === account.address;
    }).map((trade, index) => {
      return (
        <div className="display-trade-of-eth-for-tokens" key={index.toString()}>
          <div className="trade-of-eth-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div>
              Sender
            </div>
            <div className="trade-address-overflow">
              {trade.sender}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-index-wrap" className="trade-inner-wrap">
            <div>
              Index
            </div>
            <div>
              {Number(trade.indexOfTradeOfAddress)}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-eth-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading Eth Amount
            </div>
            <div>
              {ethers.formatUnits(trade.tradingEthAmount)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading For Token Name
            </div>
            <div>
              {trade.tradingForTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
              Trading For Token Symbol
            </div>
            <div>
              {trade.tradingForTokenSymbol}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-for-token-addressx-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Address
            </div>
            <div>
              {trade.tradingForTokenAddress}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-for-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Amount
            </div>
            <div>
              {Number(trade.tradingForTokenAmount)}
            </div>
          </div>
          <div>
            <div>
              Trade Status
            </div>
            <div>
              {trade.alreadyTraded ? 'Traded' : 'Not Traded'}
            </div>
          </div>
        </div>
      )
    })
  }

  console.log('tradesOfTokensToTokens filtered', tradesOfTokensToTokens);
  console.log('tradesOfTokensToEth', tradesOfTokensToEth);
  console.log('tradesOfEthToTokens', tradesOfEthToTokens);

  return (
    <div className="display-user-trades-wrap">
      <div>
        <div>
          Tokens For Tokens Trades
        </div>
        <div>
          {tradesOfTokensToTokens}
        </div>
      </div>
      <div>
        <div>
          Tokens For Eth Trades
        </div>
        <div>
          {tradesOfTokensToEth}
        </div>
      </div>
      <div>
        <div>
          Eth For Tokens Trades
        </div>
        <div>
          {tradesOfEthToTokens}
        </div>
      </div>
    </div>
  )

}
