import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import config from './config.json';
import { wagmiConfig } from './wagmiConfig.js';

import {
  useAccount,
  useEnsName,
  useEnsAvatar,
  Connector,
  useConnect,
  useDisconnect
} from 'wagmi';

import {
  getAccount,
  watchAccount
}  from '@wagmi/core'

import { AddTokensForTokensTrade } from './Components/AddTokensForTokensTrade.js';
import { AddTokensForEthTrade } from './Components/AddTokensForEthTrade.js';
import { AddEthForTokensTrade } from './Components/AddEthToTokensTrade.js';
import { ConnectWallet } from './Components/ConnectWallet.js';
import { MakeTokenToTokenTrade } from './Components/MakeTokenToTokenTrade.js';
import { MakeTokenToEthTrade } from './Components/MakeTokenToEthTrade.js';
import { MakeEthToTokenTrade } from './Components/MakeEthToTokenTrade.js';
import { DisplayTrades } from './Components/DisplayTrades.js';
import { DisplayUserTrades } from './Components/DisplayUserTrades.js';
import { DisplayYourCompletedTrades } from './Components/DisplayYourCompletedTrades';
import { TopNavBar } from './Components/TopNavBar.js'


import Select from 'react-select';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const dexJson = require('./Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

function App() {
  const [trades, setTrades] = useState();
  const [tradesOfTokensToTokens, setTradesOfTokensToTokens] = useState();
  const [tradesOfTokensToEth, setTradesOfTokensToEth] = useState();
  const [tradesOfEthToTokens, setTradesOfEthToTokens] = useState();

  const [tradesTokenNames, setTradesTokenNames] = useState();
  const [tradesTokenSymbols, setTradesTokenSymbols] = useState();
  const [tradesTokenAddresses, setTradesTokenAddresses] = useState();

  const [tradesForTokenNames, setTradesForTokenNames] = useState();
  const [tradesForTokenSymbols, setTradesForTokenSymbols] = useState();
  const [tradesForTokenAddresses, setTradesForTokenAddresses] = useState();

  const [searchedForTokenNameTrading, setSearchedForTokenNameTrading] = useState();
  const [searchedForTokenNameForTrading, setSearchedForTokenNameForTrading] = useState();

  const [searchedForTokenAddressTrading, setSearchedForTokenAddressTrading] = useState();
  const [searchedForTokenAddressForTrading, setSearchedForTokenAddressForTrading] = useState();

  const [setTokenTrades, setSetTokenTrades] = useState(true);
  const [setTokenNameAndAddresses, setSetTokenNameAndAddresses] = useState(true);

  const [rerender, setRerender] = useState();

  const [pageLoaded, setPageLoaded] = useState(false);
  const [gotTrades, setGotTrades] = useState(false);

  const [getTradeStatus, setGetTradeStatus] = useState(false);
  // tradesOfTokensToTokensJsx
  const [searchByTradingAddress,  setSearchByTradingAddress] = useState(false);
  const [searchByTradingForAddress,  setSearchByTradingForAddress] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedOptionForTradesAddresses, setSelectedOptionForTradesAddresses] = useState(null);
  const [selectedOptionForTradesForAddresses, setSelectedOptionForTradesForAddresses] = useState(null);

  const [completedTradesOfTokensToTokensEvents, setCompletedTradesOfTokensToTokensEvents] = useState();
  const [completedTradesOfTokensToEthEvents, setCompletedTradesOfTokensToEthEvents] = useState();
  const [completedTradesOfEthToTokensEvents, setCompletedTradesOfEthToTokensEvents] = useState();

  const [tradingTokenAddressInputAddTokenToToken, setTradingTokenAddressInputAddTokenToToken] = useState('');
  const [tradingTokenAmountInputAddTokenToToken, setTradingTokenAmountInputAddTokenToToken] = useState('');
  const [tradingForTokenAddressAddTokenToToken, setTradingForTokenAddressAddTokenToToken] = useState('');
  const [tradingForTokenAmountAddTokenToToken, setTradingForTokenAmountAddTokenToToken] = useState('');

  let tokensForTokensTrades;
  let tokensForEthTrades;
  let ethForTokensTrades;

  const account = getAccount(wagmiConfig);

  // const MyComponent = () => {
  //   const { address, isConnecting, isDisconnected } = useAccount();
  //   if (isConnecting) return <div>Connecting...</div>;
  //   if (isDisconnected) return <div>Disconnected</div>;
  //     return <div>Connected Wallet: {address}</div>;
  // };
  //
  // function Profile() {
  //   const { address } = useAccount()
  //   const { data, error, status } = useEnsName({ address })
  //   if (status === 'pending') return <div>Loading ENS name</div>
  //   if (status === 'error')
  //     return <div>Error fetching ENS name: {error.message}</div>
  //   return <div>ENS name: {data}</div>
  // }

  async function getTrades() {
    if (getTradeStatus === true) {
      return;
    }

    setGetTradeStatus(true);
    console.log('called getTrades');

    let trades;

    try {
     trades = await dexInstance.getAllTrades();
    } catch (error) {
      return;
      console.log(error);
    }

    // setTrades(trades);

    let tradesOfTokensToTokens2 = trades.tradeTokensForTokensForCall;
    let tradesOfTokensToEth2 = trades.tradeTokensForEthForCall;
    let tradesOfEthToTokens2 = trades.tradeEthForTokensForCall;

    tradesOfTokensToTokens2 = await Promise.all(tradesOfTokensToTokens2.map(async(trade) => {
      // const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
      // const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);

      // const tradingErc20Name = await tradingErc20Instance.name();
      // const tradingErc20Symbol = await tradingErc20Instance.symbol();

      // const tradingForErc20Name = await tradingForErc20Instance.name();
      // const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingTokenAddress = trade.tradingTokenAddress;
      newTrade.tradingTokenAmount = trade.tradingTokenAmount;
      newTrade.tradingForTokenAddress = trade.tradingForTokenAddress;
      newTrade.tradingForTokenAmount = trade.tradingForTokenAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      // newTrade.tradingTokenName = tradingErc20Name;
      // newTrade.tradingTokenSymbol = tradingErc20Symbol;
      //
      // newTrade.tradingForTokenName = tradingForErc20Name;
      // newTrade.tradingForTokenSymbol = tradingForErc20Symbol;

      return newTrade;
    }));

    tradesOfTokensToEth2 = await Promise.all(tradesOfTokensToEth2.map(async(trade) => {
      // const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
      //
      // const tradingErc20Name = await tradingErc20Instance.name();
      // const tradingErc20Symbol = await tradingErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingTokenAddress = trade.tradingTokenAddress;
      newTrade.tradingTokenAmount = trade.tradingTokenAmount;
      newTrade.tradingForEthAmount = trade.tradingForEthAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      // newTrade.tradingTokenName = tradingErc20Name;
      // newTrade.tradingTokenSymbol = tradingErc20Symbol;

      return newTrade;
    }));

    tradesOfEthToTokens2 = await Promise.all(tradesOfEthToTokens2.map(async(trade) => {
      // const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);

      // const tradingForErc20Name = await tradingForErc20Instance.name();
      // const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingEthAmount = trade.tradingEthAmount;
      newTrade.tradingForTokenAddress = trade.tradingForTokenAddress;
      newTrade.tradingForTokenAmount = trade.tradingForTokenAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      // newTrade.tradingForTokenName = tradingForErc20Name;
      // newTrade.tradingForTokenSymbol = tradingForErc20Symbol;

      return newTrade;
    }));

    console.log('tradesOfTokensToTokens2', tradesOfTokensToTokens2);
    console.log('tradesOfTokensToEth2', tradesOfTokensToEth2);
    console.log('tradesOfEthToTokens2', tradesOfEthToTokens2);

    setTradesOfTokensToTokens(tradesOfTokensToTokens2);
    setTradesOfTokensToEth(tradesOfTokensToEth2);
    setTradesOfEthToTokens(tradesOfEthToTokens2);

    if (gotTrades === false) {
      setGotTrades(true);
    }

    setGetTradeStatus(false);
    setSetTokenNameAndAddresses(true);
    getTokenAddressNamesForSelect();
    getCompletedTradesEvents();
    setPageLoaded(true);
  }

  if (setTokenTrades === true) {
    setSetTokenTrades(false);
    getTrades();
  }

  function getTokenAddressNamesForSelect() {
    console.log('called getTokenAddressNamesForSelect');
    let alreadyInTradesTokenAddresses = {};
    let tradesTokenNamesIn = [];
    let tradesTokenSymbolsIn = [];
    let tradesTokenAddressesIn = [];

    let alreadyInTradesForTokenAddresses = {};
    let tradesForTokenNamesIn = [];
    let tradesForTokenSymbolsIn = [];
    let tradesForTokenAddressesIn = [];

    function getTokenAddressesTokensForTokensTrades() {
      console.log('here 7');
      if (tradesOfTokensToTokens) {
        console.log('getTokenAddressesTokensForTokensTrades here 10');
        console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);
        for (let i = 0; i < tradesOfTokensToTokens.length; i++) {
          if (alreadyInTradesTokenAddresses[tradesOfTokensToTokens[i].tradingTokenAddress] === undefined) {

            const name = tradesOfTokensToTokens[i].tradingTokenName;
            const symbol = tradesOfTokensToTokens[i].tradingTokenSymbol;

            tradesTokenNamesIn.push(name);
            tradesTokenSymbolsIn.push(symbol);
            tradesTokenAddressesIn.push(tradesOfTokensToTokens[i].tradingTokenAddress);

            console.log('here 12 tradesTokenNamesIn', tradesTokenNamesIn);
            alreadyInTradesTokenAddresses[tradesOfTokensToTokens[i].tradingTokenAddress] = true;
          }

          if (alreadyInTradesForTokenAddresses[tradesOfTokensToTokens[i].tradingForTokenAddress] === undefined) {
            const name = tradesOfTokensToTokens[i].tradingForTokenName;
            const symbol = tradesOfTokensToTokens[i].tradingForTokenSymbol;

            tradesForTokenNamesIn.push(name);
            tradesForTokenSymbolsIn.push(symbol);
            tradesForTokenAddressesIn.push(tradesOfTokensToTokens[i].tradingForTokenAddress);

            alreadyInTradesForTokenAddresses[tradesOfTokensToTokens[i].tradingForTokenAddress] = true;
          }
        }
      }
    }

    function getTokenAddressesTokensForEthTrades() {
      if (tradesOfTokensToEth){
        for (let i = 0; i < tradesOfTokensToEth.length; i++) {
          if (alreadyInTradesTokenAddresses[tradesOfTokensToEth[i].tradingTokenAddress] === undefined) {

            const name = tradesOfTokensToEth[i].tradingTokenName;
            const symbol = tradesOfTokensToEth[i].tradingTokenSymbol;

            tradesTokenNamesIn.push(name);
            tradesTokenSymbolsIn.push(symbol);
            tradesTokenAddressesIn.push(tradesOfTokensToEth[i].tradingTokenAddress);

            alreadyInTradesTokenAddresses[tradesOfTokensToEth[i].tradingTokenAddress] = true;
          }
        }
      }
    }

    function getTokenAddressesEthForTokensTrades() {
      if (tradesOfEthToTokens) {
        for (let i = 0; i < tradesOfEthToTokens.length; i++) {
          if (alreadyInTradesForTokenAddresses[tradesOfEthToTokens[i].tradingForTokenAddress] === undefined) {
            const name = tradesOfEthToTokens[i].tradingForTokenName;
            const symbol = tradesOfEthToTokens[i].tradingForTokenSymbol;

            tradesForTokenNamesIn.push(name);
            tradesForTokenSymbolsIn.push(symbol);
            tradesForTokenAddressesIn.push(tradesOfEthToTokens[i].tradingForTokenAddress);

            alreadyInTradesForTokenAddresses[tradesOfEthToTokens[i].tradingForTokenAddress] = true;
          }
        }
      }
    }


    getTokenAddressesTokensForTokensTrades();
    getTokenAddressesTokensForEthTrades();
    getTokenAddressesEthForTokensTrades();

    console.log('alreadyInTradesForTokenAddresses', alreadyInTradesForTokenAddresses);

    console.log('tradesTokenAddressesIn', tradesTokenAddressesIn);

    console.log('tradesForTokenAddressesIn', tradesForTokenAddressesIn);

    console.log('tradesTokenNamesIn', tradesTokenNamesIn);

    setTradesTokenNames(tradesTokenNamesIn);
    setTradesTokenSymbols(tradesTokenSymbolsIn);
    setTradesTokenAddresses(tradesTokenAddressesIn);

    setTradesForTokenNames(tradesForTokenNamesIn);
    setTradesForTokenSymbols(tradesForTokenSymbolsIn);
    setTradesForTokenAddresses(tradesForTokenAddressesIn);
  }

  if (setTokenNameAndAddresses) {
    setSetTokenNameAndAddresses(false);
    getTokenAddressNamesForSelect();
  }

  async function getCompletedTradesEvents() {
    let completedTradesOfTokensToTokensEventsIn = await dexInstance.queryFilter("EventTradeTokensForTokens", 0, 'latest');
    let completedTradesOfTokensToEthEventsIn = await dexInstance.queryFilter("EventTradeTokensForEth", 0, 'latest');
    let completedTradesOfEthToTokensEventsIn = await dexInstance.queryFilter("EventTradeEthForTokens", 0, 'latest');

    console.log('completedTradesOfTokensToEthEventsIn', completedTradesOfTokensToEthEventsIn);
    console.log('completedTradesOfEthToTokensEventsIn', completedTradesOfEthToTokensEventsIn);

    // event EventTradeTokensForTokens (
    //   address sender,
    //   address tradingTokenAddress,
    //   uint tradingTokenAmount,
    //   address tradingForTokenAddress,
    //   uint tradingForTokenAmount,
    //   address orderCompletedBy
    // );

    completedTradesOfTokensToTokensEventsIn = completedTradesOfTokensToTokensEventsIn.map(event => {
      const newEvent = {};

      newEvent.sender = event.args[0];
      newEvent.indexOfTrade = event.args[1];
      newEvent.tradingTokenAddress = event.args[2];
      newEvent.tradingTokenAmount = event.args[3];
      newEvent.tradingForTokenAddress = event.args[4];
      newEvent.tradingForTokenAmount = event.args[5];
      newEvent.orderCompletedBy = event.args[6];

      return newEvent;
    });

    console.log('completedTradesOfTokensToTokensEventsIn mapped', completedTradesOfTokensToTokensEventsIn);

    // event EventTradeTokensForEth (
    //   address sender,
    //   address tradingTokenAddress,
    //   uint tradingTokenAmount,
    //   uint tradingForEthAmount,
    //   address orderCompletedBy
    // );

    completedTradesOfTokensToEthEventsIn = completedTradesOfTokensToEthEventsIn.map(event => {
       const newEvent = {};

       newEvent.sender = event.args[0];
       newEvent.indexOfTrade = event.args[1];
       newEvent.tradingTokenAddress = event.args[2];
       newEvent.tradingTokenAmount = event.args[3];
       newEvent.tradingForEthAmount = event.args[4];
       newEvent.orderCompletedBy = event.args[5];

       return newEvent;
    });

    console.log('completedTradesOfTokensToEthEventsIn', completedTradesOfTokensToEthEventsIn);

    // completedTradesOfTokensToEthEventsIn

    // event EventTradeEthForTokens (
    //   address sender,
    //   uint tradingEthAmount,
    //   address tradingForTokenAddress,
    //   uint tradingForTokenAmount,
    //   address orderCompletedBy
    // );

    completedTradesOfEthToTokensEventsIn = completedTradesOfEthToTokensEventsIn.map(event => {
      const newEvent = {};

      newEvent.sender = event.args[0];
      newEvent.indexOfTrade = event.args[1];
      newEvent.tradingEthAmount = event.args[2];
      newEvent.tradingForTokenAddress = event.args[3];
      newEvent.tradingForTokenAmount = event.args[4];
      newEvent.orderCompletedBy = event.args[5];

      return newEvent;
    });

    console.log('tradesOfTokensToTokens here5', tradesOfTokensToTokens);

    if (tradesOfTokensToTokens) {
      for (let i = 0; i < completedTradesOfTokensToTokensEventsIn.length; i++) {
        const trade1 = completedTradesOfTokensToTokensEventsIn[i];

        for (let j = 0; j < tradesOfTokensToTokens.length; j++) {
          const trade2 = tradesOfTokensToTokens[j];
          if ((trade1.sender === trade2.sender) && (trade1.indexOfTrade === trade2.indexOfTrade)) {
            tradesOfTokensToTokens[j].orderCompletedBy = trade1.orderCompletedBy;
          }
        }
      }
    }

    if (tradesOfTokensToEth) {
      for (let i = 0; i < completedTradesOfTokensToEthEventsIn.length; i++) {
        const trade1 = completedTradesOfTokensToEthEventsIn[i];

        for (let j = 0; j < tradesOfTokensToEth.length; j++) {
          const trade2 = tradesOfTokensToEth[j];
          if ((trade1.sender === trade2.sender) && (trade1.indexOfTrade === trade2.indexOfTrade)) {
            tradesOfTokensToEth[j].orderCompletedBy = trade1.orderCompletedBy;
          }
        }
      }
    }

    if (tradesOfEthToTokens) {
      for (let i = 0; i < completedTradesOfEthToTokensEventsIn.length; i++) {
        const trade1 = completedTradesOfEthToTokensEventsIn[i];

        for (let j = 0; j < tradesOfEthToTokens.length; j++) {
          const trade2 = tradesOfEthToTokens[j];
          if ((trade1.sender === trade2.sender) && (trade1.indexOfTrade === trade2.indexOfTrade)) {
            tradesOfEthToTokens[j].orderCompletedBy = trade1.orderCompletedBy;
          }
        }
      }
    }

    // setTradesOfTokensToTokens(tradesOfTokensToTokens);
    // setTradesOfTokensToEth(tradesOfTokensToEth);
    // setTradesOfEthToTokens(tradesOfEthToTokens);

    console.log('tradesOfTokensToTokens added completed by', tradesOfTokensToTokens);

    setCompletedTradesOfTokensToTokensEvents(completedTradesOfTokensToTokensEventsIn);
    setCompletedTradesOfTokensToEthEvents(completedTradesOfTokensToEthEventsIn);
    setCompletedTradesOfEthToTokensEvents(completedTradesOfEthToTokensEventsIn);
  }

    // setSearchedForTokenNameTrading('TestToken1');


  console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);

  function getTokensForTokensTradesJsx(tradesOfTokensToTokensArg) {
    if (tradesOfTokensToTokensArg) {
      const tradesOfTokensToTokensJsxIn = tradesOfTokensToTokensArg.map((trade, index) => {
          // trade.tradingTokenAddress

          if (trade.alreadyTraded === true) {
            return;
          }

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
                />
              </div>
            </div>
          )
      });

      return tradesOfTokensToTokensJsxIn;
    }

  }

  function getTokensForEthTradesJsx(tradesOfTokensToEthArg) {
    if (tradesOfTokensToEthArg) {

      console.log('here 21');
      console.log('tradesOfTokensToEthArg', tradesOfTokensToEthArg);
      const tradesOfTokensToEthJsxIn = tradesOfTokensToEthArg.map((trade, index) => {

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
              />
            </div>
          </div>
        )
      });

      console.log('tradesOfTokensToEthJsxIn', tradesOfTokensToEthJsxIn);
      return tradesOfTokensToEthJsxIn;
    }
  }

  function getEthForTokensTradesJsx(tradesOfEthToTokensArg) {
    if (tradesOfEthToTokensArg) {

      console.log('here 22');

      const tradesOfEthToTokensJsxIn = tradesOfEthToTokensArg.map((trade, index) => {

        if (trade.alreadyTraded === true) {
          return;
        }

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
              />
            </div>
          </div>
        )
      });

      console.log('tradesOfEthToTokensJsxIn', tradesOfEthToTokensJsxIn);
      return tradesOfEthToTokensJsxIn;
    }
  }

  // let tradesOfTokensToTokensFiltered;
  let tradesOfTokensToTokensJsx;
  if (tradesOfTokensToTokens) {
    console.log('here');
    const tradesOfTokensToTokensFiltered = tradesOfTokensToTokens.filter((trade) => {
      return (
        (trade.tradingTokenAddress === searchedForTokenAddressTrading
        || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
        && trade.tradingTokenAddress !== undefined
        && trade.tradingForTokenAddress !== undefined
        && trade.sender !== account.address
      )
    });

    console.log('tradesOfTokensToTokensFiltered', tradesOfTokensToTokensFiltered);

    tradesOfTokensToTokensJsx = getTokensForTokensTradesJsx(tradesOfTokensToTokensFiltered);
  }

  // let tradesOfTokensToEthFiltered;
  let tradesOfTokensToEthJsx;
  if (tradesOfTokensToEth) {
    const tradesOfTokensToEthFiltered = tradesOfTokensToEth.filter((trade) => {
      return (trade.tradingTokenAddress === searchedForTokenAddressTrading
        && trade.tradingTokenAddress !== undefined
        && trade.sender !== account.address
      )

    });

    console.log('tradesOfTokensToEthFiltered', tradesOfTokensToEthFiltered);

    tradesOfTokensToEthJsx = getTokensForEthTradesJsx(tradesOfTokensToEthFiltered);
  }

  // let tradesOfEthToTokensFiltered;
  let tradesOfEthToTokensJsx;
  if (tradesOfEthToTokens) {
    const tradesOfEthToTokensFiltered = tradesOfEthToTokens.filter((trade) => {
      return (trade.tradingForTokenAddress === searchedForTokenAddressForTrading
              && trade.tradingForTokenAddress !== undefined
              && trade.sender !== account.address
            )
    });

    console.log('tradesOfEthToTokensFiltered', tradesOfEthToTokensFiltered);

    tradesOfEthToTokensJsx = getEthForTokensTradesJsx(tradesOfEthToTokensFiltered);
  }

  let tradesTokenNamesJsx;

  if (tradesTokenNames) {
    console.log('here 3 and tradesTokenNames', tradesTokenNames);
    tradesTokenNamesJsx = tradesTokenNames.map((trade, index) => {
      console.log('trade', trade);

      return (
        <option key={index.toString()}>
          {trade}
        </option>
      );
    });
  }

  console.log('tradesTokenNamesJsx', tradesTokenNamesJsx);
  let tradesForTokenNamesJsx;

  if (tradesForTokenNames) {
    console.log('here2');
    tradesForTokenNamesJsx = tradesForTokenNames.map((trade, index) => {
      // console.log('trade', trade);

      return (
        <option key={index.toString()}>
          {trade}
        </option>
      );
    });
  }

  let tradesTokenAddressesJsx;

  const tradesTokenAddressesOptionsForSelect = [];
  if (tradesTokenAddresses) {
    console.log('here2');

    for (let i = 0; i < tradesTokenAddresses.length; i++) {
      const address = tradesTokenAddresses[i];
      tradesTokenAddressesOptionsForSelect.push({
        value: address,
        label: address
      });
    }

    tradesTokenAddressesJsx = tradesTokenAddresses.map((address, index) => {
      // console.log('trade', trade);

      return (
        <option key={index.toString()}>
          {address}
        </option>
      );
    });
  }

  let tradesForTokenAddressesJsx;

  const tradesForTokenAddressesOptionsForSelect = [];
  if (tradesForTokenAddresses) {
    console.log('here2');

    for (let i = 0; i < tradesForTokenAddresses.length; i++) {
      const address = tradesForTokenAddresses[i];
      tradesForTokenAddressesOptionsForSelect.push({
        value: address,
        label: address
      });
    }

    tradesForTokenAddressesJsx = tradesForTokenAddresses.map((address, index) => {
      // console.log('trade', trade);

      return (
        <option key={index.toString()}>
          {address}
        </option>
      );
    });
  }

  let tradingByTokenName;
  let tradingByForTokenName;

  let tradingByTokenNameValue;
  let tradingByForTokenNameValue;

  // let tokensForEthTrades;
  // let ethForTokensTrades;

  function formSubmitForTrades(e) {
    e.preventDefault();

    // const selectedValue = document.getElementById('select-for-trades').value;

    // setSearchedForTokenNameTrading(selectedValue);

    // console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');
  }

  function cancelFormSubmitForTrades() {
    console.log('here 20 cancel form submit');
    setSearchedForTokenNameTrading(undefined);
  }

  function formSubmitForTradesFor(e) {
    e.preventDefault();

    // const selectedValue = document.getElementById('select-for-trades-for').value;

    // setSearchedForTokenNameForTrading(selectedValue);

    // console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');


  }

  function cancelFormSubmitForTradesFor() {
    setSearchedForTokenNameForTrading(undefined);
  }

  function formSubmitForTradesAddress(e) {
    e.preventDefault();

    if (!selectedOptionForTradesAddresses) {
      return;
    }
    // const selectedValue = document.getElementById('select-for-trades-addresses').value;

    setSearchByTradingAddress(true);
    setSearchedForTokenAddressForTrading(undefined);
    setSelectedOptionForTradesForAddresses(undefined);
    console.log('selectedOptionForTradesAddresses', selectedOptionForTradesAddresses);
    setSearchedForTokenAddressTrading(selectedOptionForTradesAddresses.value);

    console.log('selectedOptionForTradesAddresses', selectedOptionForTradesAddresses);

    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');


  }

  function cancelFormSubmitForTradesAddress() {
    console.log('here 20 cancel form submit');
    setSearchedForTokenAddressTrading(undefined);
    setSearchByTradingAddress(false);
  }

  function formSubmitForTradesForAddress(e) {
    e.preventDefault();

    if (!selectedOptionForTradesForAddresses) {
      return;
    }

    // const selectedValue = document.getElementById('select-for-trades-for-addresses').value;

    setSearchByTradingForAddress(true);
    setSearchedForTokenAddressTrading(undefined);
    setSelectedOptionForTradesAddresses(undefined);

    setSearchedForTokenAddressForTrading(selectedOptionForTradesForAddresses.value);

    console.log('selectedOptionForTradesForAddresses', selectedOptionForTradesForAddresses);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here 11 in form submit for address');


  }

  function cancelFormSubmitForTradesForAddress(e) {
    console.log('here 20 cancel form submit');
    setSearchByTradingForAddress(false);
    setSearchedForTokenAddressForTrading(undefined);
  }
  // await getTokensForTokensTrades();
  // await getTokensForEthTrades();
  // await getEthForTokensTrades();

  // if (pageLoaded === false) {
  //   return (
  //     <div className="loading-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  function SearchForTrades() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div>
          <div id="search-for-trades-id" class="search-for-trades-wrap">
            <div>
              <div className="trade-token-title-search-for-trades">
                Search For Trades
              </div>
              <div className="search-for-trades-description">
                Search for tokens by their token address.
              </div>
              <div className="trade-for-token-title-search-by-what-they-will-be-trading">
                Search By What They Will Be Trading
              </div>
              <div>
                Search By Address
              </div>
              <div className="flex flex-col mb-1" className="search-for-token-by-address-wrap">
                <Select
                  defaultValue={selectedOptionForTradesAddresses}
                  onChange={setSelectedOptionForTradesAddresses}
                  options={tradesTokenAddressesOptionsForSelect}
                  className="select-for-addresses"
                />
                <div class="mt-1">
                  <button class="border rounded p-1 mr-1 ml-1" onClick={formSubmitForTradesAddress}>Submit</button>
                  <button class="border rounded p-1" onClick={cancelFormSubmitForTradesAddress}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="trade-for-token-title-search-by-what-you-will-be-trading">
                Search By What You Will Be Trading
              </div>
              <div>
                Search By Address
              </div>
              <div className="search-for-trading-for-token-by-address">
                <Select
                  defaultValue={selectedOptionForTradesForAddresses}
                  onChange={setSelectedOptionForTradesForAddresses}
                  options={tradesForTokenAddressesOptionsForSelect}
                  className="select-for-addresses-for"
                />
                <div>
                  <button class="border rounded p-1 mr-1 ml-1" onClick={formSubmitForTradesForAddress}>Submit</button>
                  <button class="border rounded p-1" onClick={cancelFormSubmitForTradesForAddress}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div>
              <DisplayTrades
                getTrades={getTrades}
                tradesOfTokensToTokens={tradesOfTokensToTokens}
                tradesOfTokensToEth={tradesOfTokensToEth}
                tradesOfEthToTokens={tradesOfEthToTokens}
                searchedForTokenAddressTrading={searchedForTokenAddressTrading}
                searchedForTokenAddressForTrading={searchedForTokenAddressForTrading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function MakeTrades() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div id="make-trade-offers-id">
          <div className="trade-header-make-trade-offers">
            Make Trade Offers
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
                setSetTokenTrades={setSetTokenTrades}
                setRerender={setRerender}
                tradesOfTokensToTokens={tradesOfTokensToTokens}
                tradesOfTokensToEth={tradesOfTokensToEth}
                tradesOfEthToTokens={tradesOfEthToTokens}
                tradingTokenAddressInputAddTokenToToken={tradingTokenAddressInputAddTokenToToken}
                setTradingTokenAddressInputAddTokenToToken={setTradingTokenAddressInputAddTokenToToken}
                tradingTokenAmountInputAddTokenToToken={tradingTokenAmountInputAddTokenToToken}
                setTradingTokenAmountInputAddTokenToToken={setTradingTokenAmountInputAddTokenToToken}
                tradingForTokenAddressAddTokenToToken={tradingForTokenAddressAddTokenToToken}
                setTradingForTokenAddressAddTokenToToken={setTradingForTokenAddressAddTokenToToken}
                tradingForTokenAmountAddTokenToToken={tradingForTokenAmountAddTokenToToken}
                setTradingForTokenAmountAddTokenToToken={setTradingForTokenAmountAddTokenToToken}
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
      </div>
    </div>
    );
  }

  function Home() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div>
          <div className="title text-3xl font-bold">
            Dex
          </div>
          <div className="description-wrap">
            <div className="description">
              <div>
                A decentralized exchange that trades ERC20 tokens on the Ethereum blockchain.
                All transactions are done through a single smart contract.
              </div>
              <br />
              <div>
                To use this dex you first need to connect your wallet. All your previous trades
                are linked up to your account, and you can view them at anytime and cancel them.
              </div>
              <br />
              <div>
                To start trading, you need to know the token smart contract address for the token
                you are trying to trade or are trading for. You can make trade offers
                that will be completed by someone else. You can also search for a particular token by
                its address and trade for it if someone else has posted an offer for it.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Contact() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div>
          <div id="contact-id" className="bottom-nav-bar-contact">
            Contact
          </div>
          <div className="bottom-nav-bar-email">
            My email is zhiwen555@gmail.com
          </div>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/wallet",
      element:
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div id="wallet-id">
          <ConnectWallet
            getTrades={getTrades}
          />
        </div>
      </div>
    },
    {
      path: "/search-for-trades",
      element: <SearchForTrades />,
    },
    {
      path: "/make-trades",
      element: <MakeTrades />
    },
    {
      path: "/your-trades",
      element:
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBar />
        </div>
        <div id="your-trades-id" className="display-trades-wrap">
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
    },
    {
      path: "/completed-trades",
      element:
        <div>
          <div className="top-nav-bar-wrap">
            <TopNavBar />
          </div>
          <DisplayYourCompletedTrades
            completedTradesOfTokensToTokensEvents={completedTradesOfTokensToTokensEvents}
            completedTradesOfTokensToEthEvents={completedTradesOfTokensToEthEvents}
            completedTradesOfEthToTokensEvents={completedTradesOfEthToTokensEvents}
          />
        </div>
    },
    {
      path: "/contact",
      element: <Contact />
    }
  ]);

  return (
    <div className="App">
      <div className="App-inner-wrap">
        <RouterProvider router={router} />
        <div className="bottom-nav-bar">

        </div>
      </div>
    </div>
  );
}

// <div>
//   Search By Name
// </div>

// <div className="search-for-token-by-name-wrap">
//   <select id="select-for-trades">
//     {tradesTokenNamesJsx}
//   </select>
//   <button onClick={formSubmitForTrades}>Submit</button>
//   <button onClick={cancelFormSubmitForTrades}>
//     Cancel
//   </button>
// </div>

// <div>
//   Search By Name
// </div>
// <div className="search-for-trading-for-token-by-name">
//   <select id="select-for-trades-for">
//     {tradesForTokenNamesJsx}
//   </select>
//   <button onClick={formSubmitForTradesFor}>Submit</button>
//   <button onClick={cancelFormSubmitForTradesFor}>
//     Cancel
//   </button>
// </div>

export default App;
