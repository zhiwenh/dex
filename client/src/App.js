import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import config from './config.json';

import {
  useAccount,
  useEnsName,
  useEnsAvatar,
  Connector,
  useConnect,
  useDisconnect
} from 'wagmi';

import { AddTokensForTokensTrade } from './Components/AddTokensForTokensTrade.js';
import { AddTokensForEthTrade } from './Components/AddTokensForEthTrade.js';
import { AddEthForTokensTrade } from './Components/AddEthToTokensTrade.js';
import { ConnectWallet } from './Components/ConnectWallet.js'

const dexJson = require('./Dex.json');
const dexAbi = dexJson.abi;

const erc20Json = require('./ERC20.json');
const erc20Abi = erc20Json.abi;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

function App() {
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
  const [setTokenJsx, setSetTokenJsx] = useState(true);

  const [tradesOfTokensToTokensJsx, setTradesOfTokensToTokensJsx] = useState();
  const [tradesOfTokensToEthJsx, setTradesOfTokensToEthJsx] = useState();
  const [tradesOfEthToTokensJsx, setTradesOfEthToTokensJsx] = useState();

  let tokensForTokensTrades;
  let tokensForEthTrades;
  let ethForTokensTrades;

  const MyComponent = () => {
    const { address, isConnecting, isDisconnected } = useAccount();
    if (isConnecting) return <div>Connecting...</div>;
    if (isDisconnected) return <div>Disconnected</div>;
      return <div>Connected Wallet: {address}</div>;
  };

  function Profile() {
    const { address } = useAccount()
    const { data, error, status } = useEnsName({ address })
    if (status === 'pending') return <div>Loading ENS name</div>
    if (status === 'error')
      return <div>Error fetching ENS name: {error.message}</div>
    return <div>ENS name: {data}</div>
  }

  async function getTrades() {
    console.log('here 8');

    const trades = await dexInstance.getAllTrades();

    console.log('trades tradeTokensForTokensForCall', trades.tradeTokensForTokensForCall);
    let tradesOfTokensToTokens2 = trades.tradeTokensForTokensForCall;
    let tradesOfTokensToEth2 = trades.tradeTokensForEthForCall;
    let tradesOfEthToTokens2 = trades.tradeEthForTokensForCall;

    tradesOfTokensToTokens2 = await Promise.all(tradesOfTokensToTokens2.map(async(trade) => {
      const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
      const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);

      const tradingErc20Name = await tradingErc20Instance.name();
      const tradingErc20Symbol = await tradingErc20Instance.symbol();

      const tradingForErc20Name = await tradingForErc20Instance.name();
      const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingTokenAddress = trade.tradingTokenAddress;
      newTrade.tradingTokenAmount = trade.tradingTokenAmount;
      newTrade.tradingForTokenAddress = trade.tradingForTokenAddress;
      newTrade.tradingForTokenAmount = trade.tradingForTokenAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      console.log('new trade in map', newTrade);

      newTrade.tradingTokenName = tradingErc20Name;
      newTrade.tradingTokenSymbol = tradingErc20Symbol;

      newTrade.tradingForTokenName = tradingForErc20Name;
      newTrade.tradingForTokenSymbol = tradingForErc20Symbol;

      return newTrade;
    }));

    tradesOfTokensToEth2 = await Promise.all(tradesOfTokensToEth2.map(async(trade) => {
      const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);

      const tradingErc20Name = await tradingErc20Instance.name();
      const tradingErc20Symbol = await tradingErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingTokenAddress = trade.tradingTokenAddress;
      newTrade.tradingTokenAmount = trade.tradingTokenAmount;
      newTrade.tradingForEthAmount = trade.tradingForEthAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      newTrade.tradingTokenName = tradingErc20Name;
      newTrade.tradingTokenSymbol = tradingErc20Symbol;

      return newTrade;
    }));

    tradesOfEthToTokens2 = await Promise.all(tradesOfEthToTokens2.map(async(trade) => {
      const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);

      const tradingForErc20Name = await tradingForErc20Instance.name();
      const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

      const newTrade = {};

      newTrade.sender = trade.sender;
      newTrade.indexOfTradeOfAddress = trade.indexOfTradeOfAddress;
      newTrade.tradingEthAmount = trade.tradingEthAmount;
      newTrade.tradingForTokenAddress = trade.tradingForTokenAddress;
      newTrade.tradingForTokenAmount = trade.tradingForTokenAmount;
      newTrade.alreadyTraded = trade.alreadyTraded;

      newTrade.tradingForTokenName = tradingForErc20Name;
      newTrade.tradingForTokenSymbol = tradingForErc20Symbol;

      return newTrade;
    }));

    setTradesOfTokensToTokens(tradesOfTokensToTokens2);
    setTradesOfTokensToEth(tradesOfTokensToEth2);
    setTradesOfEthToTokens(tradesOfEthToTokens2);
  }

  if (setTokenTrades === true) {
    setSetTokenTrades(false);
    getTrades();
  }

  function getTokenAddressNamesForSelect() {
    console.log('here 9');
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
        console.log('here 10');
        for (let i = 0; i < tradesOfTokensToTokens.length; i++) {
          if (alreadyInTradesTokenAddresses[tradesOfTokensToTokens[i].tradingTokenAddress] === undefined) {
            console.log('here 6 tokensForTokensTrades', tokensForTokensTrades);

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
            tradesForTokenAddressesIn.push(tradesOfTokensToTokens[i].tradingTokenAddress);

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

    console.log('tradesTokenNamesIn', tradesTokenNamesIn);
    setTradesTokenNames(tradesTokenNamesIn);
    setTradesTokenSymbols(tradesTokenSymbolsIn);
    setTradesTokenAddresses(tradesTokenAddressesIn);

    setTradesForTokenNames(tradesForTokenNamesIn);
    setTradesForTokenSymbols(tradesForTokenSymbolsIn);
    setTradesForTokenAddresses(tradesForTokenAddressesIn);
  }

  if (tradesOfTokensToTokens && tradesOfTokensToEth && tradesOfEthToTokens) {
    if (setTokenNameAndAddresses === true) {
      setSetTokenNameAndAddresses(false);
      getTokenAddressNamesForSelect();
    }
  }

    // setSearchedForTokenNameTrading('TestToken1');


  console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);

  function getTokensForTokensTradesJsx(tradesOfTokensToTokensArg) {
    if (tradesOfTokensToTokensArg) {
      const tradesOfTokensToTokensJsxIn = tradesOfTokensToTokensArg.map((trade, index) => {
          // trade.tradingTokenAddress

          console.log('trade in jsx maker already traded', trade.alreadyTraded);

          if (trade.alreadyTraded === true) {
            return;
          }

          return (
            <div className="trade-of-tokens-for-tokens" key={index.toString()}>
              <div className="trade-of-tokens-for-tokens-sender-wrap" className="trade-inner-wrap">
                <div>
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
                <div className="trade-of-tokens-for-tokens-trading-token-address"mclassName="trade-inner-wrap">
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
                <div>
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
              <div className="trade-of-tokens-for-tokens-already-traded-wrap" className="trade-inner-wrap">
                <div>
                  Already Traded
                </div>
                <div>
                  {trade.alreadyTraded.toString()}
                </div>
              </div>
            </div>
          )
      });

      return tradesOfTokensToTokensJsxIn;
    }

  }

  function getTokensForEthTradesJsx(tradesOfTokensToEthArg) {
    let tradesOfTokensToEthJsxIn;
    if (tradesOfTokensToEthArg) {
      console.log('here 21');
      console.log('tradesOfTokensToEthArg', tradesOfTokensToEthArg);
      const tradesOfTokensToEthJsxIn = tradesOfTokensToEthArg.map((trade, index) => {

        if (trade.alreadyTraded === true) {
          return;
        }

        return (
          <div className="trade-of-tokens-for-eth" key={index.toString()}>
            <div className="trade-of-tokens-for-eth-sender-wrap" className="trade-inner-wrap">
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
            <div className="trade-of-tokens-for-eth-already-traded-wrap" className="trade-inner-wrap">
              <div>
                Already Traded
              </div>
              <div>
                {trade.alreadyTraded.toString()}
              </div>
            </div>
          </div>
        )
      });

      console.log('tradesOfTokensToEthJsxIn', tradesOfTokensToEthJsxIn);
      return tradesOfTokensToEthJsxIn;
    }
  }

  function getEthForTokensTradesJsx(tradesOfEthToTokensArg) {
    let tradesOfEthToTokensJsxIn;
    if (tradesOfEthToTokensArg) {

      console.log('here 22');

      let tradesOfEthToTokensJsxIn = tradesOfEthToTokensArg.map((trade, index) => {

        if (trade.alreadyTraded === true) {
          return;
        }

        return (
          <div className="trade-of-eth-for-tokens" key={index.toString()}>
            <div className="trade-of-eth-for-tokens-sender-wrap" className="trade-inner-wrap">
              <div>
                Seller
              </div>
              <div>
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
            <div className="trade-of-eth-for-tokens-already-traded-wrap" className="trade-inner-wrap">
              <div>
                Already Traded
              </div>
              <div>
                {trade.alreadyTraded.toString()}
              </div>
            </div>
          </div>
        )
      });

      console.log('tradesOfEthToTokensJsxIn', tradesOfEthToTokensJsxIn);
      return tradesOfEthToTokensJsxIn;
    }
  }

  // let tradesOfTokensToTokensFiltered;

  function getTradesOfTokensToTokensFiltered(tradesOfTokensToTokensIn) {
    let tradesOfTokensToTokensFiltered;
    console.log('searchedForTokenNameTrading', searchedForTokenNameTrading);
    if (tradesOfTokensToTokensIn) {
      console.log('tradesOfTokensToTokensIn', tradesOfTokensToTokensIn);
      tradesOfTokensToTokensFiltered = tradesOfTokensToTokensIn.filter((trade) => {
        // console.log('here2');
        // console.log('trade.tradingTokenName', trade.tradingTokenName);

        return (
          (trade.tradingTokenName === searchedForTokenNameTrading
          || trade.tradingForTokenName === searchedForTokenNameForTrading
          || trade.tradingTokenAddress === searchedForTokenAddressTrading
          || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
        );

      });

      console.log('tradesOfTokensToTokensFiltered', tradesOfTokensToTokensFiltered);

    }

    return tradesOfTokensToTokensFiltered;
  }

  // let tradesOfTokensToEthFiltered;

  function getTradesOfTokensToEthFiltered(tradesOfTokensToEthIn) {
    let tradesOfTokensToEthFiltered;
    if (tradesOfTokensToEthIn) {
      console.log('tradesOfTokensToEth', tradesOfTokensToEthIn);
      tradesOfTokensToEthFiltered = tradesOfTokensToEthIn.filter((trade) => {
        return (
          (trade.tradingTokenName === searchedForTokenNameTrading
          || trade.tradingTokenAddress === searchedForTokenAddressTrading)
        );
      });

      console.log('tradesOfTokensToEthFiltered', tradesOfTokensToEthFiltered);
    }

    return tradesOfTokensToEthFiltered;
  }

  // let tradesOfEthToTokensFiltered;

  function getTradesOfEthToTokensFiltered(tradesOfEthToTokensIn) {
    let tradesOfEthToTokensFilteredIn;
    if (tradesOfEthToTokensIn) {
      console.log('tradesOfEthToTokensIn', tradesOfEthToTokensIn);
      tradesOfEthToTokensFilteredIn = tradesOfEthToTokensIn.filter((trade) => {
        return (
          (trade.tradingForTokenName === searchedForTokenNameForTrading
          || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
        );
      });

    }
    return tradesOfEthToTokensFilteredIn;
  }

  function getAllTradesJsxFiltered() {
    const tradesOfTokensToTokensFiltered = getTradesOfTokensToTokensFiltered(tradesOfTokensToTokens);
    console.log('tradesOfTokensToTokensFiltered', tradesOfTokensToTokensFiltered);
    const tradesOfTokensToTokensJsxIn = getTokensForTokensTradesJsx(tradesOfTokensToTokensFiltered);

    const tradesOfTokensToEthFiltered = getTradesOfTokensToEthFiltered(tradesOfTokensToEth);
    console.log('tradesOfTokensToEthFiltered', tradesOfTokensToEthFiltered);
    const tradesOfTokensToEthJsxIn = getTokensForEthTradesJsx(tradesOfTokensToEthFiltered);

    const tradesOfEthToTokensFiltered = getTradesOfEthToTokensFiltered(tradesOfEthToTokens);
    console.log('tradesOfEthToTokensFiltered', tradesOfEthToTokensFiltered);
    const tradesOfEthToTokensJsxIn = getEthForTokensTradesJsx(tradesOfEthToTokensFiltered);

    console.log('tradesOfTokensToTokensJsxIn', tradesOfTokensToTokensJsxIn);

    setTradesOfTokensToTokensJsx(tradesOfTokensToTokensJsxIn);
    setTradesOfTokensToEthJsx(tradesOfTokensToEthJsxIn);
    setTradesOfEthToTokensJsx(tradesOfEthToTokensJsxIn);
    setSetTokenJsx(false);
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

  if (tradesTokenAddresses) {
    console.log('here2');
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

  if (tradesForTokenAddresses) {
    console.log('here2');
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

    const selectedValue = document.getElementById('select-for-trades').value;
    console.log('selectedValue', selectedValue);
    setSearchedForTokenNameTrading(selectedValue);
    console.log('searchedForTokenNameTrading', searchedForTokenNameTrading);
    setSetTokenJsx(true);
    console.log('searchedForTokenNameTrading', searchedForTokenNameTrading);

    getAllTradesJsxFiltered();
    console.log('searchedForTokenNameTrading', searchedForTokenNameTrading);

    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');
  }

  function cancelFormSubmitForTrades() {
    console.log('here 20 cancel form submit');

    setSearchedForTokenNameTrading(undefined);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
  }

  function formSubmitForTradesFor(e) {
    e.preventDefault();

    const selectedValue = document.getElementById('select-for-trades-for').value;

    setSearchedForTokenNameForTrading(selectedValue);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');


  }

  function cancelFormSubmitForTradesFor() {
    setSetTokenJsx(true);

    setSearchedForTokenNameForTrading(undefined);
  }

  function formSubmitForTradesAddress(e) {
    e.preventDefault();

    const selectedValue = document.getElementById('select-for-trades-addresses').value;

    setSearchedForTokenAddressTrading(selectedValue);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');


  }

  function cancelFormSubmitForTradesAddress() {
    console.log('here 20 cancel form submit');

    setSearchedForTokenAddressTrading(undefined);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
  }

  function formSubmitForTradesForAddress(e) {
    e.preventDefault();

    const selectedValue = document.getElementById('select-for-trades-for-addresses').value;

    setSearchedForTokenAddressForTrading(selectedValue);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here 11 in form submit for address');


  }

  function cancelFormSubmitForTradesForAddress(e) {
    console.log('here 20 cancel form submit');

    setSearchedForTokenAddressForTrading(undefined);
    setSetTokenJsx(true);
    getAllTradesJsxFiltered();
  }
  // await getTokensForTokensTrades();
  // await getTokensForEthTrades();
  // await getEthForTokensTrades();

  console.log('trades of eth to tokens jsx', tradesOfEthToTokensJsx);

  return (
    <div className="App">
      <div className="title">
        Dex
      </div>
      <div className="description">
        A decentralized exchange that trades for ERC20 tokens on the Ethereum blockchain.
      </div>
      <div>
        <ConnectWallet />
      </div>
      <div>
        <AddTokensForTokensTrade
          // getTrades={getTrades}
          // getTokenAddressNamesForSelect={getTokenAddressNamesForSelect}
          // setTokenTrades={setTokenTrades}
          // setSetTokenTrades={setSetTokenTrades}
        />
      </div>
      <div>
        <AddTokensForEthTrade />
      </div>
      <div>
        <AddEthForTokensTrade />
      </div>
      <div>
        <div>
          <div className="trade-token-title">
            Trade For This Token
          </div>
          <div>
            Search By Name
          </div>
          <div className="search-for-token-by-name-wrap">
            <select id="select-for-trades">
              {tradesTokenNamesJsx}
            </select>
            <button onClick={formSubmitForTrades}>Submit</button>
            <button onClick={cancelFormSubmitForTrades}>
              Cancel
            </button>
          </div>
          <div>
            Search By Address
          </div>
          <div className="search-for-token-by-address-wrap">
            <select id="select-for-trades-addresses">
              {tradesTokenAddressesJsx}
            </select>
            <button onClick={formSubmitForTradesAddress}>Submit</button>
            <button onClick={cancelFormSubmitForTradesAddress}>
              Cancel
            </button>
          </div>
        </div>
        <div>
          <div className="trade-for-token-title">
            Trade This Token For Something Else
          </div>
          <div>
            Search By Name
          </div>
          <div className="search-for-trading-for-token-by-name">
            <select id="select-for-trades-for">
              {tradesForTokenNamesJsx}
            </select>
            <button onClick={formSubmitForTradesFor}>Submit</button>
            <button onClick={cancelFormSubmitForTradesFor}>
              Cancel
            </button>
          </div>
          <div>
            Search By Address
          </div>
          <div className="search-for-trading-for-token-by-address">
            <select id="select-for-trades-for-addresses">
              {tradesForTokenAddressesJsx}
            </select>
            <button onClick={formSubmitForTradesForAddress}>Submit</button>
            <button onClick={cancelFormSubmitForTradesForAddress}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="trades-wrap">
        <div className="trades-header">
          Trades
        </div>
        <div className="trades">
          <div className="trades-of-tokens-for-tokens-wrap">
            <div className="trades-of-tokens-for-tokens-header">
              Trades of Tokens For Tokens
            </div>
            <div className="trades-of-tokens-for-tokens">
              {tradesOfTokensToTokensJsx}
            </div>
          </div>
          <div className="trades-of-tokens-for-eth-wrap">
            <div className="trades-of-tokens-for-eth-header">
              Trades of Tokens for Eth
            </div>
            <div className="trades-of-tokens-for-eth">
              {tradesOfTokensToEthJsx}
            </div>
          </div>
          <div className="trades-of-eth-for-tokens-wrap">
            <div className="trades-of-eth-for-tokens-header">
              Trades of Eth for Tokens
            </div>
            <div className="trades-of-eth-for-tokens">
              {tradesOfEthToTokensJsx}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
