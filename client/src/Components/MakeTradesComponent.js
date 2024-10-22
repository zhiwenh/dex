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

import { AddTokensForTokensTrade } from './AddTokensForTokensTrade.js';
import { AddTokensForEthTrade } from './AddTokensForEthTrade.js';
import { AddEthForTokensTrade } from './AddEthForTokensTrade.js';

import { DisplayUserTrades } from './DisplayUserTrades.js';

const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

const account = getAccount(wagmiConfig);

export function MakeTradesComponent({
  getTrades,
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  tradesOfEthToTokens,
  completedTradesOfTokensToTokensEvents,
  completedTradesOfTokensToEthEvents,
  completedTradesOfEthToTokensEvents
}) {
  const [recentlyAddedTokensToTokensTrades, setRecentlyAddedTokensToTokensTrades] = useState([]);

  let recentlyAddedTokensToTokensTrades2;

  function getRecentlyAddedTokensToTokensTradesJsx() {
    recentlyAddedTokensToTokensTrades2 = recentlyAddedTokensToTokensTrades.map((trade, index) => {
      console.log('here1 trade', trade);
      return (
        <div class="border rounded mb-1" className="recently-completed-trade-of-tokens-for-tokens" key={index.toString()}>
          <div className="trade-inner-wrap">
            <div>
              Seller
            </div>
            <div className="trade-of-tokens-for-tokens-sender">
              {trade.sender}
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
        </div>
      );
    });

    console.log('recentlyAddedTokensToTokensTrades2', recentlyAddedTokensToTokensTrades2);
  }

  function addToRecentlyAddedTokensToTokensTrades(
    tradingTokenAddress,
    tradingTokenAmount,
    tradingForTokenAddress,
    tradingForTokenAmount
  ) {
    const newObj = {};
    newObj.sender = account.address;
    newObj.tradingTokenAddress = tradingTokenAddress;
    newObj.tradingTokenAmount = tradingTokenAmount;
    newObj.tradingForTokenAddress = tradingForTokenAddress;
    newObj.tradingForTokenAmount = tradingForTokenAmount;

    console.log('newObj', newObj);
    recentlyAddedTokensToTokensTrades.push(newObj);
    setRecentlyAddedTokensToTokensTrades(recentlyAddedTokensToTokensTrades);
    console.log('recentlyAddedTokensToTokensTrades', recentlyAddedTokensToTokensTrades);
    getRecentlyAddedTokensToTokensTradesJsx();
  }


  const [recentlyAddedTokensToEthTrades, setRecentlyAddedTokensToEthTrades] = useState([]);
  function addToRecentlyAddedTokensToEthTrades(
    tradingTokenAddress,
    tradingTokenAmount,
    tradingForEthAmount
  ) {
    const newObj = {};
    newObj.sender = account.address;
    newObj.tradingTokenAddress = tradingTokenAddress;
    newObj.tradingTokenAmount = tradingTokenAmount;
    newObj.tradingForEthAmount = tradingForEthAmount;

    recentlyAddedTokensToEthTrades.push(newObj);
    setRecentlyAddedTokensToEthTrades(recentlyAddedTokensToEthTrades);
  }

  const [recentlyAddedEthToTokensTrades, setRecentlyAddedEthToTokensTrades] = useState([]);
  function addToRecentlyAddedEthToTokensTrades(
    tradingEthAmount,
    tradingForTokenAddresss,
    tradingForTokenAmount
  ) {
    const newObj = {};
    newObj.sender = account.address;
    newObj.tradingEthAmount = tradingEthAmount;
    newObj.tradingForTokenAddresss = tradingForTokenAddresss;
    newObj.tradingForTokenAmount = tradingForTokenAmount;
    recentlyAddedEthToTokensTrades.push(newObj);
    setRecentlyAddedEthToTokensTrades(recentlyAddedEthToTokensTrades);
  }

  const recentlyAddedEthToTokensTrades2 = recentlyAddedEthToTokensTrades.map((trade, index) => {
    console.log('here1 trade', trade);
    return (
      <div class="border rounded mb-1" className="recently-completed-trade-of-tokens-for-tokens" key={index.toString()}>
        <div className="trade-inner-wrap">
          <div>
            Seller
          </div>
          <div className="trade-of-tokens-for-tokens-sender">
            {trade.sender}
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
      </div>
    );
  });

  console.log('recentlyAddedTokensToTokensTrades2', recentlyAddedTokensToTokensTrades2);
  return (
    <div>
      <div id="make-trade-offers-id">
        <div className="trade-header-make-trade-offers">
          Make Offers
        </div>
        <div className="make-trade-offers-description">
          When you list a trade, other people can view them when searching for the token address.
          To make a token trade you first have to approve your tokens to be used by the dex.
          For ether trades it sends ether to the smart contract so that someone else can complete your order.
          To get your ether back you just have to cancel your order.
        </div>
        <div className="add-trades-wrap-inner">
          <div>
            <AddTokensForTokensTrade
              getTrades={getTrades}
              tradesOfTokensToTokens={tradesOfTokensToTokens}
              tradesOfTokensToEth={tradesOfTokensToEth}
              tradesOfEthToTokens={tradesOfEthToTokens}
              addToRecentlyAddedTokensToTokensTrades={addToRecentlyAddedTokensToTokensTrades}
            />
          </div>
          <div>
            <AddTokensForEthTrade
              tradesOfTokensToTokens={tradesOfTokensToTokens}
              tradesOfTokensToEth={tradesOfTokensToEth}
              getTrades={getTrades}
            />
          </div>
          <div>
            <AddEthForTokensTrade
              getTrades={getTrades}
            />
          </div>
        </div>
        <div className="add-trades-display-user-trades">
          <DisplayUserTrades
            tradesOfTokensToTokens={tradesOfTokensToTokens}
            tradesOfTokensToEth={tradesOfTokensToEth}
            tradesOfEthToTokens={tradesOfEthToTokens}
            completedTradesOfTokensToTokensEvents={completedTradesOfTokensToTokensEvents}
            completedTradesOfTokensToEthEvents={completedTradesOfTokensToEthEvents}
            completedTradesOfEthToTokensEvents={completedTradesOfEthToTokensEvents}
            getTrades={getTrades}
          />
        </div>
    </div>
  </div>
  )

}
