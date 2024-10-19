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

import { MakeTokenToTokenTrade } from './MakeTokenToTokenTrade.js';
import { MakeTokenToEthTrade } from './MakeTokenToEthTrade.js';
import { MakeEthToTokenTrade } from './MakeEthToTokenTrade.js';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function DisplayTrades({
  getTrades,
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  tradesOfEthToTokens,
  searchedForTokenAddressTrading,
  searchedForTokenAddressForTrading
}) {

  console.log('here 5 in display trades');
  const account = getAccount(wagmiConfig);

  if (tradesOfTokensToTokens) {
    console.log('here 6 in display trades');

    tradesOfTokensToTokens = tradesOfTokensToTokens.filter((trade) => {
      return (
        (trade.tradingTokenAddress === searchedForTokenAddressTrading
        || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
        && trade.tradingTokenAddress !== undefined
        && trade.tradingForTokenAddress !== undefined
        && trade.sender !== account.address
        && !trade.alreadyTraded
      )
    }).map((trade, index) => {
        return (
          <div class="border rounded mb-1" className="trade-of-tokens-for-tokens" key={index.toString()}>
            <div className="trades-sender" className="trade-of-tokens-for-tokens-sender-wrap" className="trade-inner-wrap">
              <div className="trade-address-overflow">
                Seller
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
            <div>
              <div className="what-they-will-be-trading-inner-header">
                What They Will Be Trading
              </div>
            </div>
            <div className="trade-inner-wrap">
              <div>
              </div>
              <div>
                {trade.tradingTokenName}
              </div>
            </div>
            <div className="trade-inner-wrap">
              <div>
              </div>
              <div>
                {trade.tradingTokenSymbol}
              </div>
            </div>
            <div className="trade-of-tokens-for-tokens-trading-token-address-wrap" className="trade-inner-wrap">
              <div>
                Token Address
              </div>
              <div className="trade-address-overflow" className="trade-of-tokens-for-tokens-trading-token-address"mclassName="trade-inner-wrap">
                {trade.tradingTokenAddress}
              </div>
            </div>
            <div className="trade-of-tokens-for-tokens-trading-token-amount-wrap" className="trade-inner-wrap">
              <div>
                Token Amount
              </div>
              <div>
                {Number(trade.tradingTokenAmount)}
              </div>
            </div>
            <div>
              <div class="what-you-will-be-trading-inner-header">
                What You Will Be Trading
              </div>
            </div>
            <div className="trade-inner-wrap">
              <div>
              </div>
              <div>
                {trade.tradingForTokenName}
              </div>
            </div>
            <div className="trade-inner-wrap">
              <div>
              </div>
              <div>
                {trade.tradingForTokenSymbol}
              </div>
            </div>
            <div className="trade-of-tokens-for-tokens-trading-for-token-address-wrap" className="trade-inner-wrap">
              <div>
                Token Address
              </div>
              <div className="trade-address-overflow">
                {trade.tradingForTokenAddress}
              </div>
            </div>
            <div className="trade-of-tokens-for-tokens-trading-for-token-amount-wrap" className="trade-inner-wrap">
              <div>
                Token Amount
              </div>
              <div>
                {Number(trade.tradingForTokenAmount)}
              </div>
            </div>
            <div className="make-token-trade-button-wrap">
              <MakeTokenToTokenTrade
                sender={trade.sender}
                indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
                tradingForTokenAddress={trade.tradingForTokenAddress}
                tradingForTokenAmount={trade.tradingForTokenAmount}
                getTrades={getTrades}
              />
            </div>
          </div>
        )
    });
  }

  if (tradesOfTokensToEth) {
    tradesOfTokensToEth = tradesOfTokensToEth.filter((trade) => {
      return (trade.tradingTokenAddress === searchedForTokenAddressTrading
        && trade.tradingTokenAddress !== undefined
        && trade.sender !== account.address
        && !trade.alreadyTraded
      );
    }).map((trade, index) => {
      if (trade.alreadyTraded === true) {
        return;
      }

      return (
        <div class="border rounded mb-1" className="trade-of-tokens-for-eth" key={index.toString()}>
          <div className="trades-sender" className="trade-of-tokens-for-eth-sender-wrap" className="trade-inner-wrap">
            <div>
              Seller
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
          <div>
            <div className="what-they-will-be-trading-inner-header">
              What They Will Be Trading
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {trade.tradingTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {trade.tradingTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-address-wrap" className="trade-inner-wrap">
            <div>
              Token Address
            </div>
            <div>
              {trade.tradingTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Token Amount
            </div>
            <div>
              {Number(trade.tradingTokenAmount)}
            </div>
          </div>
          <div>
            <div class="what-you-will-be-trading-inner-header">
              What You Will Be Trading
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-for-eth-amount-wrap" className="trade-inner-wrap">
            <div>
              Eth Amount
            </div>
            <div>
              {ethers.formatUnits(trade.tradingForEthAmount)}
            </div>
          </div>
          <div>
            <MakeEthToTokenTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
              tradingForEthAmount={trade.tradingForEthAmount}
              getTrades={getTrades}
            />
          </div>
        </div>
      )
    });
  }

  if (tradesOfEthToTokens) {
    tradesOfEthToTokens = tradesOfEthToTokens.filter((trade) => {
      return (trade.tradingForTokenAddress === searchedForTokenAddressForTrading
              && trade.tradingForTokenAddress !== undefined
              && trade.sender !== account.address
              && !trade.alreadyTraded
            )
    }).map((trade, index) => {
      return (
        <div class="border rounded mb-1" className="trade-of-eth-for-tokens" key={index.toString()}>
          <div className="trades-sender" className="trade-of-eth-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div>
              Seller
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
          <div>
            <div className="what-they-will-be-trading-inner-header">
              What They Will Be Trading
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-eth-amount-wrap" className="trade-inner-wrap">
            <div>
              Eth Amount
            </div>
            <div>
              {ethers.formatUnits(trade.tradingEthAmount)}
            </div>
          </div>
          <div>
            <div class="what-you-will-be-trading-inner-header">
              What You Will Be Trading
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {trade.tradingForTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {trade.tradingForTokenSymbol}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-for-token-addressx-wrap" className="trade-inner-wrap">
            <div>
              Token Address
            </div>
            <div>
              {trade.tradingForTokenAddress}
            </div>
          </div>
          <div className="trade-of-eth-for-tokens-trading-for-amount-wrap" className="trade-inner-wrap">
            <div>
              Token Amount
            </div>
            <div>
              {Number(trade.tradingForTokenAmount)}
            </div>
          </div>
          <div>
            <MakeTokenToEthTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
              tradingForTokenAddress={trade.tradingForTokenAddress}
              tradingForTokenAmount={trade.tradingForTokenAmount}
              getTrades={getTrades}
            />
          </div>
        </div>
      )
    });
  }


  return (
    <div id="trades-id" className="trades-wrap">
      <div className="trades-header">
        Trades
      </div>
      <div className="trades">
        <div className="trades-of-tokens-for-tokens-wrap">
          <div className="trades-of-tokens-for-tokens-header">
            Trades of Tokens For Tokens
          </div>
          <div className="trades-of-tokens-for-tokens">
            {tradesOfTokensToTokens}
          </div>
        </div>
        <div className="trades-of-tokens-for-eth-wrap">
          <div className="trades-of-tokens-for-eth-header">
            Trades of Tokens for Eth
          </div>
          <div className="trades-of-tokens-for-eth">
            {tradesOfTokensToEth}
          </div>
        </div>
        <div className="trades-of-eth-for-tokens-wrap">
          <div className="trades-of-eth-for-tokens-header">
            Trades of Eth for Tokens
          </div>
          <div className="trades-of-eth-for-tokens">
            {tradesOfEthToTokens}
          </div>
        </div>
      </div>
    </div>
  )

}
