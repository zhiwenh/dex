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

export function DisplayYourCompletedTrades({
  completedTradesOfTokensToTokensEvents,
  completedTradesOfTokensToEthEvents,
  completedTradesOfEthToTokensEvents
}) {

  const account = getAccount(wagmiConfig);

  if (completedTradesOfTokensToTokensEvents) {
    completedTradesOfTokensToTokensEvents = completedTradesOfTokensToTokensEvents.filter(event => {
      return event.orderCompletedBy === account.address;
    }).map((event, index) => {
      return (
        <div class="border rounded mb-1" className="display-user-trades-trade-box" className="display-trades-of-tokens-for-tokens" key={index.toString()}>
          <div className="trade-of-tokens-for-tokens-sender-wrap" className="trade-inner-wrap">
            <div className="display-user-trades-sender">
              Sender
            </div>
            <div className="trade-of-tokens-for-tokens-sender">
              {event.sender}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-index-wrap" className="trade-inner-wrap">
            <div>
              Index
            </div>
            <div className="trade-of-tokens-for-tokens-index">
              {Number(event.indexOfTrade)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Address
            </div>
            <div className="trade-address-overflow" className="trade-of-tokens-for-tokens-trading-token-address"mclassName="trade-inner-wrap">
              {event.tradingTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Amount
            </div>
            <div>
              {Number(event.tradingTokenAmount)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingForTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingForTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-for-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Address
            </div>
            <div className="trade-address-overflow">
              {event.tradingForTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-tokens-trading-for-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading For Token Amount
            </div>
            <div>
              {Number(event.tradingForTokenAmount)}
            </div>
          </div>
          <div>
            <div>
              Order Completed By
            </div>
            <div>
              {event.orderCompletedBy}
            </div>
          </div>
        </div>
      )
    })
  }

  if (completedTradesOfTokensToEthEvents) {
    completedTradesOfTokensToEthEvents = completedTradesOfTokensToEthEvents.filter(event => {
      return event.orderCompletedBy === account.address;
    }).map((event, index) => {
      return (
        <div class="border rounded mb-1" className="display-user-trades-trade-box" className="display-trades-of-tokens-for-tokens" key={index.toString()}>
          <div className="trade-of-tokens-for-eth-sender-wrap" className="trade-inner-wrap">
            <div className="display-user-trades-sender">
              Sender
            </div>
            <div>
              {event.sender}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-index-wrap" className="trade-inner-wrap">
            <div>
              Index
            </div>
            <div>
              {Number(event.indexOfTrade)}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingTokenName}
            </div>
          </div>
          <div className="trade-inner-wrap">
            <div>
            </div>
            <div>
              {event.tradingTokenSymbol}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-address-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Address
            </div>
            <div>
              {event.tradingTokenAddress}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-token-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading Token Amount
            </div>
            <div>
              {Number(event.tradingTokenAmount)}
            </div>
          </div>
          <div className="trade-of-tokens-for-eth-trading-for-eth-amount-wrap" className="trade-inner-wrap">
            <div>
              Trading For Eth Amount
            </div>
            <div>
              {ethers.formatUnits(event.tradingForEthAmount)}
            </div>
          </div>
          <div>
            <div>
              Order Completed By
            </div>
            <div>
              {event.orderCompletedBy}
            </div>
          </div>
        </div>
      );
    })
  }

  if (completedTradesOfEthToTokensEvents) {
    completedTradesOfEthToTokensEvents = completedTradesOfEthToTokensEvents.filter(trade => {
      return trade.orderCompletedBy === account.address;
    }).map((trade, index) => {
      return (
        <div class="border rounded mb-1" className="display-user-trades-trade-box" className="display-trades-of-tokens-for-tokens" key={index.toString()}>
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
              {Number(trade.indexOfTrade)}
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
              Order Completed By
            </div>
            <div>
              {trade.orderCompletedBy}
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="display-completed-trades-wrap">
      <div className="display-user-trades-your-trades-header">
        Completed Trades
      </div>
      <div className="display-completed-trades-description">
        These are the orders you traded for and completed.
      </div>
      <div className="display-completed-trades-wrap-inner">
        {completedTradesOfTokensToTokensEvents}{completedTradesOfTokensToEthEvents}{completedTradesOfEthToTokensEvents}
      </div>
    </div>
  )

  // return (
  //   <div className="display-completed-trades-wrap">
  //     <div className="display-user-trades-your-trades-header">
  //       Completed Trades
  //     </div>
  //     <div className="display-completed-trades-description">
  //       These are the orders you traded for and completed.
  //     </div>
  //     <div className="display-completed-trades-trades-wrap">
  //       <div className="display-completed-trades-tokens-for-tokens-wrap">
  //         <div className="display-completed-trades-trade-header">
  //           Tokens For Tokens Trades
  //         </div>
  //         <div>
  //           {completedTradesOfTokensToTokensEvents}
  //         </div>
  //       </div>
  //       <div className="display-completed-trades-tokens-for-eth-wrap">
  //         <div className="display-completed-trades-trade-header">
  //           Tokens For Eth Trades
  //         </div>
  //         <div>
  //           {completedTradesOfTokensToEthEvents}
  //         </div>
  //       </div>
  //       <div className="display-completed-trades-eth-for-tokens-wrap">
  //         <div className="display-completed-trades-trade-header">
  //           Eth For Tokens Trades
  //         </div>
  //         <div>
  //           {completedTradesOfEthToTokensEvents}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

}
