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

import { CancelTokensForTokensTrade } from './CancelTokensForTokensTrade.js';
import { CancelTokensForEthTrade } from './CancelTokensForEthTrade.js'
import { CancelEthForTokensTrade } from './CancelEthForTokensTrade.js';


const dexJson = require('./../Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./../ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

export function DisplayUserTrades({
  tradesOfTokensToTokens,
  tradesOfTokensToEth,
  tradesOfEthToTokens,
  completedTradesOfTokensToTokensEvents,
  completedTradesOfTokensToEthEvents,
  completedTradesOfEthToTokensEvents
}) {

  const account = getAccount(wagmiConfig);

  console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);

  if (tradesOfTokensToTokens) {
    tradesOfTokensToTokens = tradesOfTokensToTokens.filter(trade => {
      return trade.sender === account.address;
    }).map((trade, index) => {
      let orderCompletedBy;

      if (completedTradesOfTokensToTokensEvents) {
        completedTradesOfTokensToTokensEvents = completedTradesOfTokensToTokensEvents.filter(event => {
          return event.sender === account.address;
        });

        for (let i = 0; i < completedTradesOfTokensToTokensEvents.length; i++) {
          const event = completedTradesOfTokensToTokensEvents[i];

          console.log('event here sender 7', event.sender);
          console.log('trade here sender', trade.sender);

          console.log('event here indexOfTrade 7', event.indexOfTrade);
          console.log('trade here indexOfTrade 7', trade.indexOfTradeOfAddress);

          if ((event.sender === trade.sender) && (Number(event.indexOfTrade) === Number(trade.indexOfTradeOfAddress))) {
            orderCompletedBy = event.orderCompletedBy;
            console.log('orderCompletedBy here6', orderCompletedBy);
            break;
          }
        }
      }

      return (
        <div class="border rounded mb-1" className="display-user-trades-trade-box" className="display-trades-of-tokens-for-tokens" key={index.toString()}>
          <div className="trade-of-tokens-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div className="display-user-trades-sender">
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
              Traded Or Canceled Status
            </div>
            <div>
              {trade.alreadyTraded ? (orderCompletedBy ? 'Traded' : 'Canceled') : 'Not Traded Or Canceled'}
            </div>
          </div>
          <div className="display-user-trades-already-traded-or-canceled-wrap">
            {trade.alreadyTraded ? undefined : <CancelTokensForTokensTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
            />}
          </div>
          <div className="trade-inner-wrap">
            <div>
              {orderCompletedBy ? 'Order Completed By' : undefined}
            </div>
            <div>
              {orderCompletedBy ? orderCompletedBy : undefined}
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
      let orderCompletedBy;

      if (completedTradesOfTokensToEthEvents) {
        completedTradesOfTokensToEthEvents = completedTradesOfTokensToEthEvents.filter(event => {
          return event.sender === account.address;
        });

        for (let i = 0; i < completedTradesOfTokensToEthEvents.length; i++) {
          const event = completedTradesOfTokensToEthEvents[i];

          console.log('event here sender 7', event.sender);
          console.log('trade here sender', trade.sender);

          console.log('event here indexOfTrade 7', event.indexOfTrade);
          console.log('trade here indexOfTrade 7', trade.indexOfTradeOfAddress);

          if ((event.sender === trade.sender) && (Number(event.indexOfTrade) === Number(trade.indexOfTradeOfAddress))) {
            orderCompletedBy = event.orderCompletedBy;
            console.log('orderCompletedBy here6', orderCompletedBy);
            break;
          }
        }
      }

      return (
        <div class="border rounded mb-1" className="display-user-trades-trade-box" className="display-trade-of-tokens-for-eth" key={index.toString()}>
          <div className="trade-of-tokens-for-eth-sender-wrap" className="trade-inner-wrap">
            <div className="display-user-trades-sender">
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
              Traded Or Canceled Status
            </div>
            <div>
              {trade.alreadyTraded ? (orderCompletedBy ? 'Traded' : 'Canceled') : 'Not Traded Or Canceled'}
            </div>
          </div>
          <div className="display-user-trades-already-traded-or-canceled-wrap">
            {trade.alreadyTraded ? undefined : <CancelTokensForEthTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
            />}
          </div>
          <div className="trade-inner-wrap">
            <div>
              {orderCompletedBy ? 'Order Completed By' : undefined}
            </div>
            <div>
              {orderCompletedBy ? orderCompletedBy : undefined}
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
      let orderCompletedBy;

      if (completedTradesOfEthToTokensEvents) {
        completedTradesOfEthToTokensEvents = completedTradesOfEthToTokensEvents.filter(event => {
          return event.sender === account.address;
        });

        for (let i = 0; i < completedTradesOfEthToTokensEvents.length; i++) {
          const event = completedTradesOfEthToTokensEvents[i];

          console.log('event here sender 7', event.sender);
          console.log('trade here sender', trade.sender);

          console.log('event here indexOfTrade 7', event.indexOfTrade);
          console.log('trade here indexOfTrade 7', trade.indexOfTradeOfAddress);

          if ((event.sender === trade.sender) && (Number(event.indexOfTrade) === Number(trade.indexOfTradeOfAddress))) {
            orderCompletedBy = event.orderCompletedBy;
            console.log('orderCompletedBy here6', orderCompletedBy);
            break;
          }
        }
      }

      return (
        <div class="border rounded mb-1" className="display-trade-of-eth-for-tokens" key={index.toString()}>
          <div className="trade-of-eth-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div className="display-user-trades-sender">
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
              Traded Or Canceled Status
            </div>
            <div>
              {trade.alreadyTraded ? (orderCompletedBy ? 'Traded' : 'Canceled') : 'Not Traded Or Canceled'}
            </div>
          </div>
          <div className="display-user-trades-already-traded-or-canceled-wrap">
            {trade.alreadyTraded ? undefined : <CancelEthForTokensTrade
              sender={trade.sender}
              indexOfTradeOfAddress={trade.indexOfTradeOfAddress}
            />}
          </div>
          <div className="trade-inner-wrap">
            <div>
              {orderCompletedBy ? 'Order Completed By' : undefined}
            </div>
            <div>
              {orderCompletedBy ? orderCompletedBy : undefined}
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
      <div className="display-user-trades-your-trades-header">
        Your Trades
      </div>
      <div className="display-user-trades-description">
        These are the trades you listed on the dex. You also view completed and
        canceled orders. You can cancel these orders at anytime. When you cancel
        an order you get the ether you put in the smart contract back.
      </div>
      <div className="display-user-trades-trades-wrap">
        <div className="display-user-trades-tokens-for-tokens-wrap">
          <div className="display-user-trades-trade-header">
            Tokens For Tokens Trades
          </div>
          <div>
            {tradesOfTokensToTokens}
          </div>
        </div>
        <div className="display-user-trades-tokens-for-eth-wrap">
          <div className="display-user-trades-trade-header">
            Tokens For Eth Trades
          </div>
          <div>
            {tradesOfTokensToEth}
          </div>
        </div>
        <div className="display-user-trades-eth-for-tokens-wrap">
          <div className="display-user-trades-trade-header">
            Eth For Tokens Trades
          </div>
          <div>
            {tradesOfEthToTokens}
          </div>
        </div>
      </div>
    </div>
  )

}
