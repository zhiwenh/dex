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

import { ConnectWallet } from './Components/ConnectWallet.js';
import { MakeTokenToTokenTrade } from './Components/MakeTokenToTokenTrade.js';
import { MakeTokenToEthTrade } from './Components/MakeTokenToEthTrade.js';
import { MakeEthToTokenTrade } from './Components/MakeEthToTokenTrade.js';
import { DisplayTrades } from './Components/DisplayTrades.js';
import { DisplayUserTrades } from './Components/DisplayUserTrades.js';
import { DisplayYourCompletedTrades } from './Components/DisplayYourCompletedTrades';
import { MakeTradesComponent } from './Components/MakeTradesComponent.js';
import ContactForm from './Components/ContactForm.js';
import { TopNavBar } from './Components/TopNavBar.js'

import Select from 'react-select';

import ClipLoader from "react-spinners/ClipLoader";

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
  const [beenInPageLoaded, setBeenInPageLoaded] = useState(false);

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

  const [savedTokensToTokensTrades, setSavedTokensToTokensTrades] = useState([]);
  const [savedTokensToEthTrades, setSavedTokensToEthTrades] = useState([]);
  const [savedEthToTokensTrades, setSavedEthToTokensTrades] = useState([]);

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

  if (pageLoaded === false && beenInPageLoaded === false) {
    setBeenInPageLoaded(true);
    window.setTimeout(() => {
      if (pageLoaded === false) {
        setPageLoaded(true);
      }
    }, 10000);
  }


  async function getTrades() {
    if (getTradeStatus === true) {
      return;
    }

    setGetTradeStatus(true);
    let trades;

    try {
     trades = await dexInstance.getAllTrades();
    } catch (error) {
      setPageLoaded(true);
      setGetTradeStatus(false);
      return;
      console.log(error);
    }

    // setTrades(trades);

    let tradesOfTokensToTokens2 = trades.tradeTokensForTokensForCall;
    let tradesOfTokensToEth2 = trades.tradeTokensForEthForCall;
    let tradesOfEthToTokens2 = trades.tradeEthForTokensForCall;

    tradesOfTokensToTokens2 = tradesOfTokensToTokens2.map((trade) => {
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
    });

    tradesOfTokensToEth2 = tradesOfTokensToEth2.map((trade) => {
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
    });

    tradesOfEthToTokens2 = tradesOfEthToTokens2.map((trade) => {
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
    });

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

  function saveTokenToTokenTrades(sender, indexOfTrade, completedBy) {
    const newObj = {};
    newObj.sender = sender;
    newObj.indexOfTrade = indexOfTrade;
    newObj.completedBy = completedBy;

    for (let i = 0; i < savedTokensToTokensTrades.length; i++) {
      if (savedTokensToTokensTrades[i].sender === sender
        && savedTokensToTokensTrades[i].indexOfTrade === indexOfTrade) {
        return;
      }
    }

    savedTokensToTokensTrades.push(newObj);
    setSavedTokensToTokensTrades(savedTokensToTokensTrades);
  }

  function saveTokenToEthTrades(sender, indexOfTrade, completedBy) {
    const newObj = {};
    newObj.sender = sender;
    newObj.indexOfTrade = indexOfTrade;
    newObj.completedBy = completedBy;

    for (let i = 0; i < savedTokensToEthTrades.length; i++) {
      if (savedTokensToEthTrades[i].sender === sender
        && savedTokensToEthTrades[i].indexOfTrade === indexOfTrade) {
        return;
      }
    }

    savedTokensToEthTrades.push(newObj);
    setSavedTokensToEthTrades(savedTokensToEthTrades);
  }

  function saveEthToTokenTrades(sender, indexOfTrade, completedBy) {
    const newObj = {};
    newObj.sender = sender;
    newObj.indexOfTrade = indexOfTrade;
    newObj.completedBy = completedBy;

    for (let i = 0; i < savedEthToTokensTrades.length; i++) {
      if (savedEthToTokensTrades[i].sender === sender
        && savedEthToTokensTrades[i].indexOfTrade === indexOfTrade) {
        return;
      }
    }

    savedEthToTokensTrades.push(newObj);
    setSavedEthToTokensTrades(savedEthToTokensTrades);
  }

  function getTokenAddressNamesForSelect() {
    let alreadyInTradesTokenAddresses = {};
    let tradesTokenNamesIn = [];
    let tradesTokenSymbolsIn = [];
    let tradesTokenAddressesIn = [];

    let alreadyInTradesForTokenAddresses = {};
    let tradesForTokenNamesIn = [];
    let tradesForTokenSymbolsIn = [];
    let tradesForTokenAddressesIn = [];

    function getTokenAddressesTokensForTokensTrades() {
      if (tradesOfTokensToTokens) {
        for (let i = 0; i < tradesOfTokensToTokens.length; i++) {
          if (alreadyInTradesTokenAddresses[tradesOfTokensToTokens[i].tradingTokenAddress] === undefined
            && !tradesOfTokensToTokens[i].alreadyTraded
            && tradesOfTokensToTokens[i].sender !== account.address) {

            const name = tradesOfTokensToTokens[i].tradingTokenName;
            const symbol = tradesOfTokensToTokens[i].tradingTokenSymbol;

            tradesTokenNamesIn.push(name);
            tradesTokenSymbolsIn.push(symbol);
            tradesTokenAddressesIn.push(tradesOfTokensToTokens[i].tradingTokenAddress);

            alreadyInTradesTokenAddresses[tradesOfTokensToTokens[i].tradingTokenAddress] = true;
          }

          if (alreadyInTradesForTokenAddresses[tradesOfTokensToTokens[i].tradingForTokenAddress] === undefined
            && !tradesOfTokensToTokens[i].alreadyTraded
            && tradesOfTokensToTokens[i].sender !== account.address) {
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
          if (alreadyInTradesTokenAddresses[tradesOfTokensToEth[i].tradingTokenAddress] === undefined
            && !tradesOfTokensToEth[i].alreadyTraded
            && tradesOfTokensToEth[i].sender !== account.address) {

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
          if (alreadyInTradesForTokenAddresses[tradesOfEthToTokens[i].tradingForTokenAddress] === undefined
            && !tradesOfEthToTokens[i].alreadyTraded
            && tradesOfEthToTokens[i].sender !== account.address) {
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

    setCompletedTradesOfTokensToTokensEvents(completedTradesOfTokensToTokensEventsIn);
    setCompletedTradesOfTokensToEthEvents(completedTradesOfTokensToEthEventsIn);
    setCompletedTradesOfEthToTokensEvents(completedTradesOfEthToTokensEventsIn);
  }

    // setSearchedForTokenNameTrading('TestToken1');

  // let tradesOfTokensToTokensFiltered;
  let tradesOfTokensToTokensJsx;
  if (tradesOfTokensToTokens) {
    const tradesOfTokensToTokensFiltered = tradesOfTokensToTokens.filter((trade) => {
      return (
        (trade.tradingTokenAddress === searchedForTokenAddressTrading
        || trade.tradingForTokenAddress === searchedForTokenAddressForTrading)
        && trade.tradingTokenAddress !== undefined
        && trade.tradingForTokenAddress !== undefined
        && trade.sender !== account.address
      )
    });
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
  }

  let tradesTokenNamesJsx;

  if (tradesTokenNames) {
    tradesTokenNamesJsx = tradesTokenNames.map((trade, index) => {

      return (
        <option key={index.toString()}>
          {trade}
        </option>
      );
    });
  }

  let tradesForTokenNamesJsx;

  if (tradesForTokenNames) {
    tradesForTokenNamesJsx = tradesForTokenNames.map((trade, index) => {

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

    for (let i = 0; i < tradesTokenAddresses.length; i++) {
      const address = tradesTokenAddresses[i];
      tradesTokenAddressesOptionsForSelect.push({
        value: address,
        label: address
      });
    }

    tradesTokenAddressesJsx = tradesTokenAddresses.map((address, index) => {
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

    for (let i = 0; i < tradesForTokenAddresses.length; i++) {
      const address = tradesForTokenAddresses[i];
      tradesForTokenAddressesOptionsForSelect.push({
        value: address,
        label: address
      });
    }

    tradesForTokenAddressesJsx = tradesForTokenAddresses.map((address, index) => {

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

    // searchedForTokenNameTrading = 'TestToken1';

  }

  function cancelFormSubmitForTrades() {
    setSearchedForTokenNameTrading(undefined);
  }

  function formSubmitForTradesFor(e) {
    e.preventDefault();

    // const selectedValue = document.getElementById('select-for-trades-for').value;

    // setSearchedForTokenNameForTrading(selectedValue);

    // searchedForTokenNameTrading = 'TestToken1';
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
    setSearchedForTokenAddressTrading(selectedOptionForTradesAddresses.value);

    // searchedForTokenNameTrading = 'TestToken1';
  }

  function cancelFormSubmitForTradesAddress() {
    setSearchedForTokenAddressTrading(undefined);
    setSearchByTradingAddress(false);
    setSelectedOptionForTradesAddresses(undefined);
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
    // searchedForTokenNameTrading = 'TestToken1';
  }

  function cancelFormSubmitForTradesForAddress(e) {
    setSearchByTradingForAddress(false);
    setSearchedForTokenAddressForTrading(undefined);
    setSelectedOptionForTradesForAddresses(undefined);
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

  // function saveTokenToTokenTrades(sender, indexOfTrade, completedBy) {
  //   const newObj = {};
  //   newObj.sender = sender;
  //   newObj.indexOfTrade = indexOfTrade;
  //   newObj.completedBy = completedBy;
  //
  //   savedTokensToTokensTrades.push(newObj);
  //   setSavedTokensToTokensTrades(savedTokensToTokensTrades);
  // }
  //
  // function saveTokenToEthTrades(sender, indexOfTrade, completedBy) {
  //   const newObj = {};
  //   newObj.sender = sender;
  //   newObj.indexOfTrade = indexOfTrade;
  //   newObj.completedBy = completedBy;
  //
  //   savedTokensToEthTrades.push(newObj);
  //   setSavedTokensToEthTrades(savedTokensToEthTrades);
  // }
  //
  // function saveEthToTokenTrades(sender, indexOfTrade, completedBy) {
  //   const newObj = {};
  //   newObj.sender = sender;
  //   newObj.indexOfTrade = indexOfTrade;
  //   newObj.completedBy = completedBy;
  //
  //   savedEthToTokensTrades.push(newObj);
  //   setSavedEthToTokensTrades(savedEthToTokensTrades);
  // }

  function TopNavBarWrap() {
    return (
      <div>
        <TopNavBar
          getTrades={getTrades}
          setSavedTokensToTokensTrades={setSavedTokensToTokensTrades}
          setSavedTokensToEthTrades={setSavedTokensToEthTrades}
          setSavedEthToTokensTrades={setSavedEthToTokensTrades}
        />
      </div>
    );
  }

  function SearchForTrades() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBarWrap />
        </div>
        <div>
          <div id="search-for-trades-id" class="search-for-trades-wrap">
            <div>
              <div className="trade-token-title-search-for-trades">
                Search
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
                savedTokensToTokensTrades={savedTokensToTokensTrades}
                savedTokensToEthTrades={savedTokensToEthTrades}
                savedEthToTokensTrades={savedEthToTokensTrades}
                saveTokenToTokenTrades={saveTokenToTokenTrades}
                saveTokenToEthTrades={saveTokenToEthTrades}
                saveEthToTokenTrades={saveEthToTokenTrades}
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
          <TopNavBarWrap />
        </div>
        <div>
          <MakeTradesComponent
            getTrades={getTrades}
            tradesOfTokensToTokens={tradesOfTokensToTokens}
            tradesOfTokensToEth={tradesOfTokensToEth}
            tradesOfEthToTokens={tradesOfEthToTokens}
            completedTradesOfTokensToTokensEvents={completedTradesOfTokensToTokensEvents}
            completedTradesOfTokensToEthEvents={completedTradesOfTokensToEthEvents}
            completedTradesOfEthToTokensEvents={completedTradesOfEthToTokensEvents}
          />
        </div>
    </div>
    );
  }

  function Home() {
    return (
      <div>
        <div className="top-nav-bar-wrap">
          <TopNavBarWrap />
        </div>
        <div>
          <div className="title text-3xl font-bold">
            Dex
          </div>
          <div className="description-wrap">
            <div className="description">
              <div>
                A decentralized exchange that trades ERC-20 tokens on the Ethereum blockchain.
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
          <TopNavBarWrap />
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
          <TopNavBarWrap />
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
            <TopNavBarWrap />
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
      element:
        <div>
          <div>
            <TopNavBarWrap />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
    }
  ]);

  if (pageLoaded === false) {
    return (
      <div className="App">
        <ClipLoader className="spinner" />
      </div>
    )
  }

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
