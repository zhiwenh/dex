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
  searchedForTokenAddressForTrading,
  savedTokensToTokensTrades,
  savedTokensToEthTrades,
  savedEthToTokensTrades,
  saveTokenToTokenTrades,
  saveTokenToEthTrades,
  saveEthToTokenTrades
}) {

  function recentlyCompletedAdderTokensToTokensTrades(index, completedBy) {
    console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);
    console.log('index', index);
    console.log('tradesOfTokensToTokens[index]', tradesOfTokensToTokens[index]);
    tradesOfTokensToTokens[index].recentlyCompleted = true;
    tradesOfTokensToTokens[index].completedBy = completedBy;
  }

  function recentlyCompletedAdderTokensToEthTrades(index, completedBy) {
    tradesOfTokensToTokens[index].recentlyCompleted = true;
    tradesOfTokensToTokens[index].completedBy = completedBy;
  }

  function recentlyCompletedAdderEthTokensTrades(index, completedBy) {
    tradesOfTokensToTokens[index].recentlyCompleted = true;
    tradesOfTokensToTokens[index].completedBy = completedBy;
  }

  console.log('here 5 in display trades');
  const account = getAccount(wagmiConfig);

  let tradesOfTokensToTokens2;
  let tradesOfTokensToEth2;
  let tradesOfEthToTokens2;

  if (tradesOfTokensToTokens) {
    console.log('here 6 in display trades');

    for (let i = 0; i < tradesOfTokensToTokens.length; i++) {
      const trade = tradesOfTokensToTokens[i];
      for (let j = 0; j < savedTokensToTokensTrades.length; j++) {
        const savedTrade = savedTokensToTokensTrades[j];

        if (trade.sender === savedTrade.sender
            && trade.indexOfTradeOfAddress === savedTrade.indexOfTrade) {
              trade.recentlyCompleted = true;
              trade.completedBy = savedTrade.completedBy;
            }
      }
    }

    for (let i = 0; i < tradesOfTokensToTokens.length; i++) {
      const trade = tradesOfTokensToTokens[i];
      if (trade.alreadyTraded === true && !trade.recentlyCompleted) {
        trade.toRemove = true;
      }
    }

    tradesOfTokensToTokens2 = tradesOfTokensToTokens.filter((trade) => {
      return (
        (trade.tradingTokenAddress === searchedForTokenAddressTrading
        || trade.tradingForTokenAddress === searchedForTokenAddressForTrading
        || (trade.recentlyCompleted === true && (trade.tradingTokenAddress === searchedForTokenAddressTrading || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)))
        && trade.tradingTokenAddress !== undefined
        && trade.tradingForTokenAddress !== undefined
        && trade.sender !== account.address
        && trade.toRemove !== true
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
              {trade.completedBy ? (
                <div>
                  <div>Trade Completed By</div>
                  <div>{trade.completedBy}</div>
                </div>)
                  : <MakeTokenToTokenTrade
                sender={trade.sender}
                index={index}
                indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
                tradingForTokenAddress={trade.tradingForTokenAddress}
                tradingForTokenAmount={trade.tradingForTokenAmount}
                recentlyCompletedAdderTokensToTokensTrades={recentlyCompletedAdderTokensToTokensTrades}
                getTrades={getTrades}
                savedTokensToTokensTrades={savedTokensToTokensTrades}
                saveTokenToTokenTrades={saveTokenToTokenTrades}
              />}
            </div>
          </div>
        )
    });
  }

  if (tradesOfTokensToEth) {
    for (let i = 0; i < tradesOfTokensToEth.length; i++) {
      const trade = tradesOfTokensToEth[i];
      for (let j = 0; j < savedTokensToEthTrades.length; j++) {
        const savedTrade = savedTokensToEthTrades[j];

        if (trade.sender === savedTrade.sender
            && trade.indexOfTradeOfAddress === savedTrade.indexOfTrade) {
              trade.recentlyCompleted = true;
              trade.completedBy = savedTrade.completedBy;
            }
      }
    }

    for (let i = 0; i < tradesOfTokensToEth.length; i++) {
      const trade = tradesOfTokensToEth[i];
      if (trade.alreadyTraded === true && !trade.recentlyCompleted) {
        trade.toRemove = true;
      }
    }

    console.log('tradesOfTokensToEth here 1', tradesOfTokensToEth);

    tradesOfTokensToEth2 = tradesOfTokensToEth.filter((trade) => {
      return ((trade.tradingTokenAddress === searchedForTokenAddressTrading
        || (trade.recentlyCompleted === true && trade.tradingTokenAddress === searchedForTokenAddressTrading))
        && trade.tradingTokenAddress !== undefined
        && trade.sender !== account.address
        && trade.toRemove !== true
      );
    }).map((trade, index) => {

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
          {trade.completedBy ? (
            <div>
              <div>Trade Completed By</div>
              <div>{trade.completedBy}</div>
            </div>)
              : <MakeEthToTokenTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
              tradingForEthAmount={trade.tradingForEthAmount}
              recentlyCompletedAdderTokensToEthTrades={recentlyCompletedAdderTokensToEthTrades}
              getTrades={getTrades}
              savedTokensToEthTrades={savedTokensToEthTrades}
              saveTokenToEthTrades={saveTokenToEthTrades}
            />}
          </div>
        </div>
      )
    });
  }

  if (tradesOfEthToTokens) {

    for (let i = 0; i < tradesOfEthToTokens.length; i++) {
      const trade = tradesOfEthToTokens[i];
      for (let j = 0; j < savedEthToTokensTrades.length; j++) {
        const savedTrade = savedEthToTokensTrades[j];

        if (trade.sender === savedTrade.sender
            && trade.indexOfTradeOfAddress === savedTrade.indexOfTrade) {
              trade.recentlyCompleted = true;
              trade.completedBy = savedTrade.completedBy;
            }
      }
    }

    for (let i = 0; i < tradesOfEthToTokens.length; i++) {
      const trade = tradesOfEthToTokens[i];
      if (trade.alreadyTraded === true && !trade.recentlyCompleted) {
        trade.toRemove = true;
      }
    }

    tradesOfEthToTokens2 = tradesOfEthToTokens.filter((trade) => {
      return ((trade.tradingForTokenAddress === searchedForTokenAddressForTrading
              || trade.recentlyCompleted === true && trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
              && trade.tradingForTokenAddress !== undefined
              && trade.sender !== account.address
              && trade.toRemove !== true
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
          {trade.completedBy ? (
            <div>
              <div>Trade Completed By</div>
              <div>{trade.completedBy}</div>
            </div>)
              :<MakeTokenToEthTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
              tradingForTokenAddress={trade.tradingForTokenAddress}
              tradingForTokenAmount={trade.tradingForTokenAmount}
              recentlyCompletedAdderEthTokensTrades={recentlyCompletedAdderEthTokensTrades}
              getTrades={getTrades}
              savedEthToTokensTrades={savedEthToTokensTrades}
              saveEthToTokenTrades={saveEthToTokenTrades}
            />}
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
            {tradesOfTokensToTokens2}
          </div>
        </div>
        <div className="trades-of-tokens-for-eth-wrap">
          <div className="trades-of-tokens-for-eth-header">
            Trades of Tokens for Eth
          </div>
          <div className="trades-of-tokens-for-eth">
            {tradesOfTokensToEth2}
          </div>
        </div>
        <div className="trades-of-eth-for-tokens-wrap">
          <div className="trades-of-eth-for-tokens-header">
            Trades of Eth for Tokens
          </div>
          <div className="trades-of-eth-for-tokens">
            {tradesOfEthToTokens2}
          </div>
        </div>
      </div>
    </div>
  )

}
