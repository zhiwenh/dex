import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import config from './config.json';

// const PRIVATE_KEY = '0x588d7e9c0ea609304dd765d10810eb2b002639131e78364400ab585ee61fb5b0';

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

  // const [, forceUpdate] = useReducer(x => x + 1, 0);

  // let searchedForTokenNameTrading = 'TestToken1';
  // let searchedForTokenNameForTrading;

  let tokensForTokensTrades;
  let tokensForEthTrades;
  let ethForTokensTrades;

  const dexJson = require('./Dex.json');
  const dexAbi = dexJson.abi;

  const erc20Json = require('./ERC20.json');
  const erc20Abi = erc20Json.abi;

  const provider = new ethers.JsonRpcProvider('http://localhost:8545');
  const dexInstance = new ethers.Contract(config.dexAddress, dexAbi, provider);

  useEffect(() => {
    async function getTrades() {
      console.log('here 8');
      let tradesOfTokensToTokens2 = await dexInstance.getTradesForTokensWithTokens();
      let tradesOfTokensToEth2 = await dexInstance.getTradesForTokensWithEth();
      let tradesOfEthToTokens2 = await dexInstance.getTradesForEthWithTokens();

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

    getTrades();

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

    getTokenAddressNamesForSelect();

    // setSearchedForTokenNameTrading('TestToken1');
  }, [tradesOfTokensToTokens, tradesOfTokensToEth, tradesOfEthToTokens]);


  // console.log('dex abi', dexAbi);
  //
  // console.log('config', config);
  // console.log('config dex address', config.dexAddress);

  // console.log('here');

  // useEffect(async () => {
  //   console.log('trades of tokens to tokens', tradesOfTokensToTokens);
  // },[tradesOfTokensToTokens]);

  // const fetchDexTrades = () => {
    // const tokenForTokensTradesDexReturn =

      // .then(trade => {
      //   console.log('trade', trade);
      //   console.log('trade.tradingTokenAddress', trade.tradingTokenAddress);
      //   const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
      //   const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);
      //
      //   const tradingErc20NamePromise = tradingErc20Instance.name();
      //   const tradingErc20SymbolPromise = tradingErc20Instance.symbol();
      //
      //   const tradingForErc20NamePromise = tradingForErc20Instance.name();
      //   const tradingForErc20SymbolPromise = tradingForErc20Instance.symbol();
      //
      //   Promise.all([
      //     tradingErc20NamePromise,
      //     tradingErc20SymbolPromise,
      //     tradingForErc20NamePromise,
      //     tradingForErc20SymbolPromise
      //   ])
      //     .then(res => {
      //       console.log('res', res);
      //       trade.tradingTokenName = res[0];
      //       trade.tradingTokenSymbol = res[1];
      //       trade.tradingForTokenName = res[2];
      //       trade.tradingForTokenSymbol = res[3];
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     })
      //
      //   setTradesOfTokensToTokens(trade);
      // })
      // .catch(err => {
      //   console.log(err);
      // })

    // const tokenForEthTradesDexReturn =

      // .then(trade => {
      //   const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
      //
      //   const tradingErc20NamePromise = tradingErc20Instance.name();
      //   const tradingErc20SymbolPromise = tradingErc20Instance.symbol();
      //
      //   Promise.all([
      //     tradingErc20NamePromise,
      //     tradingErc20SymbolPromise
      //   ])
      //     .then(res => {
      //       trade.tradingTokenName = res[0];
      //       trade.tradingTokenSymbol = res[1];
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     })
      //
      //
      //   setTradesOfTokensToEth(trade);
      // })
      // .catch(err => {
      //   console.log(err);
      // })
    // const ethForTokensTradesDexReturn



      // .then(trade => {
      //   const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);
      //
      //   const tradingForErc20NamePromise = tradingForErc20Instance.name();
      //   const tradingForErc20SymbolPromise = tradingForErc20Instance.symbol();
      //
      //   Promise.all([
      //     tradingForErc20NamePromise,
      //     tradingForErc20SymbolPromise
      //   ])
      //     .then(res => {
      //       trade.tradingForTokenName = res[0];
      //       trade.tradingForTokenSymbol = res[1];
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     })
      //
      //   setTradesOfEthToTokens(trade);
      // })
      // .catch(err => {
      //   console.log(err);
      // })

    // console.log('token for tokens trades dex return', tokenForTokensTradesDexReturn);
    // console.log('token for eth trades dex return', tokenForEthTradesDexReturn);
    // console.log('eth for tokens trades dex return', ethForTokensTradesDexReturn);

    // console.log('trades of eth to tokens 2', tradesOfEthToTokens);
  // }

  // fetchDexTrades();



  // let tradesOfTokensToTokens;
  // let tradesOfTokensToEth;
  // let tradesOfEthToTokens;

  // let tradesOfTokensToTokensJsx;
  // let tradesOfTokensToEthJsx;
  // let tradesOfEthToTokensJsx;

  // let tradesTokenNames = [];
  // let tradesTokenSymbols = [];
  // let tradesTokenAddresses = [];
  // let alreadyInTradesTokenAddresses = {};

  // let tradesForTokenNames = [];
  // let tradesForTokenSymbols = [];
  // let tradesForTokenAddresses = [];
  // let alreadyInTradesForTokenAddresses = {};

  console.log('tradesOfTokensToTokens', tradesOfTokensToTokens);

  function getTokensForTokensTradesJsx(tradesOfTokensToTokensArg) {
    if (tradesOfTokensToTokensArg) {
      const tradesOfTokensToTokensJsxIn = tradesOfTokensToTokensArg.map((trade, index) => {
          // trade.tradingTokenAddress

          console.log('trade in jsx maker already traded', trade.alreadyTraded);

          if (trade.alreadyTraded === true) {
            return;
          }

          // const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
          // const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);

          // const tradingErc20Name = await tradingErc20Instance.name();
          // const tradingErc20Symbol = await tradingErc20Instance.symbol();
          //
          // const tradingForErc20Name = await tradingForErc20Instance.name();
          // const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

          // console.log('trading erc20 name', tradingErc20Name);
          // console.log('searched for token name trading', searchedForTokenNameTrading);

          // if (tradingErc20Name !== searchedForTokenNameTrading) {
          //   console.log('here3');
          //   return;
          // }

          // if (!searchedForTokenNameTrading) {
          //   if (tradingForErc20Name !== searchedForTokenNameForTrading) {
          //     return;
          //   }
          // }

          // console.log('here2');


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
    if (tradesOfTokensToEthArg) {
      const tradesOfTokensToEthJsxIn = tradesOfTokensToEthArg.map((trade, index) => {

        if (trade.alreadyTraded === true) {
          return;
        }

        // const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
        //
        // const tradingErc20Name = await tradingErc20Instance.name();
        // const tradingErc20Symbol = await tradingErc20Instance.symbol();

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

      return tradesOfTokensToEthJsxIn;
    }
  }

  function getEthForTokensTradesJsx(tradesOfEthToTokensArg) {
    if (tradesOfEthToTokensArg) {
      const tradesOfEthToTokensJsxIn = tradesOfEthToTokensArg.map((trade, index) => {

        if (trade.alreadyTraded === true) {
          return;
        }

        // const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);
        // const tradingForErc20Name = await tradingForErc20Instance.name();
        // const tradingForErc20Symbol = await tradingForErc20Instance.symbol();

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

      return tradesOfEthToTokensJsxIn;
    }
  }

  // let tradesOfTokensToTokensFiltered;
  let tradesOfTokensToTokensJsx;
  if (tradesOfTokensToTokens) {
    console.log('here');
    const tradesOfTokensToTokensFiltered = tradesOfTokensToTokens.filter((trade) => {
      console.log('here2');
      console.log('trade.tradingTokenName', trade.tradingTokenName);
      console.log('searchedForTokenNameTrading', searchedForTokenNameTrading);

      return (
        trade.tradingTokenName === searchedForTokenNameTrading
        || trade.tradingForTokenName === searchedForTokenNameForTrading
        && trade.tradingTokenName !== undefined
        && trade.tradingForTokenName !== undefined
      );

    });

    console.log('tradesOfTokensToTokensFiltered', tradesOfTokensToTokensFiltered);

    tradesOfTokensToTokensJsx = getTokensForTokensTradesJsx(tradesOfTokensToTokensFiltered);
  }

  // let tradesOfTokensToEthFiltered;
  let tradesOfTokensToEthJsx;
  if (tradesOfTokensToEth) {
    const tradesOfTokensToEthFiltered = tradesOfTokensToEth.filter((trade) => {
      return (
        trade.tradingTokenName === searchedForTokenNameTrading
        && trade.tradingTokenName !== undefined
      );
    });

    tradesOfTokensToEthJsx = getTokensForEthTradesJsx(tradesOfTokensToEthFiltered);
  }

  // let tradesOfEthToTokensFiltered;
  let tradesOfEthToTokensJsx;
  if (tradesOfEthToTokens) {
    const tradesOfEthToTokensFiltered = tradesOfEthToTokens.filter((trade) => {
      return (
        trade.tradingForTokenName === searchedForTokenNameForTrading
        && trade.tradingForTokenName !== undefined
      );
    });

    tradesOfEthToTokensJsx = getEthForTokensTradesJsx(tradesOfEthToTokensFiltered);
  }

  // console.log('tradesOfTokensToTokensJsx', tradesOfTokensToTokensJsx);



  // await getTokenAddressesTokensForTokensTrades();
  // await getTokenAddressesTokensForEthTrades();
  // await getTokenAddressesEthForTokensTrades();
  //
  // async function getAllTrades() {
  //   console.log('here');
  //
  //   await getTokensForTokensTrades();
  //   await getTokensForEthTrades();
  //   await getEthForTokensTrades();
  //
  //   const trades = await Promise.all([
  //     tradesOfTokensToTokensPromise,
  //     tradesOfTokensToEthPromise,
  //     tradesOfEthToTokensPromise
  //   ]);
  //
  //   tradesOfTokensToTokens = trades[0];
  //   tradesOfTokensToEth = trades[1];
  //   tradesOfEthToTokens = trades[2];
  // }

  // await getAllTrades();
  /*
    {
      tradeTokensForTokensForCall: [],
      tradeTokensForEthForCall: [],
      tradeEthForTokensForCall []
    }

  */

  // let tradesTokenNames = [];
  // let alreadyInTradesTokenNames = {};
  //
  // let tradesForTokenNames = [];
  // let alreadyInTradesForTokenNames = {};

  // console.log('here');
  //
  // console.log('trades token names', tradesTokenNames);
  // console.log('trades token symbols', tradesTokenSymbols);
  // console.log('already in trades token addresses', alreadyInTradesTokenAddresses);
  //
  // console.log('trades for token names', tradesForTokenNames);
  // console.log('trades token symbols', tradesForTokenSymbols);
  // console.log('already in trades for token addresses', alreadyInTradesForTokenAddresses);

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

  let tradingByTokenName;
  let tradingByForTokenName;

  let tradingByTokenNameValue;
  let tradingByForTokenNameValue;

  // let tokensForEthTrades;
  // let ethForTokensTrades;

  function formSubmitForTrades(e) {
    e.preventDefault();

    const selectedValue = document.getElementById('select-for-trades').value;

    setSearchedForTokenNameTrading(selectedValue);

    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');

    // console.log('searched for token name trading in form submit', searchedForTokenNameTrading);

    // await getAllTrades();

    // forceUpdate();
    // forceUpdate();
    // tokensForTokensTrades = tokensForTokensTrades.filter(trade => {
    //   const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
    //   const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);
    //
    //   const tradingErc20Name = await tradingErc20Instance.name();
    //   const tradingErc20Symbol = await tradingErc20Instance.symbol();
    //
    //   const tradingForErc20Name = await tradingForErc20Instance.name();
    //   const tradingForErc20Symbol = await tradingForErc20Instance.symbol();
    // });
  }

  function cancelFormSubmitForTrades() {
    console.log('here 20 cancel form submit');
    setSearchedForTokenNameTrading(undefined);
  }

  function formSubmitForTradesFor(e) {
    e.preventDefault();

    const selectedValue = document.getElementById('select-for-trades-for').value;

    setSearchedForTokenNameForTrading(selectedValue);

    console.log('selectedValue', selectedValue);
    // searchedForTokenNameTrading = 'TestToken1';

    console.log('here5 in form submit');

    // console.log('searched for token name trading in form submit', searchedForTokenNameTrading);

    // await getAllTrades();

    // forceUpdate();
    // forceUpdate();
    // tokensForTokensTrades = tokensForTokensTrades.filter(trade => {
    //   const tradingErc20Instance = new ethers.Contract(trade.tradingTokenAddress, erc20Abi, provider);
    //   const tradingForErc20Instance = new ethers.Contract(trade.tradingForTokenAddress, erc20Abi, provider);
    //
    //   const tradingErc20Name = await tradingErc20Instance.name();
    //   const tradingErc20Symbol = await tradingErc20Instance.symbol();
    //
    //   const tradingForErc20Name = await tradingForErc20Instance.name();
    //   const tradingForErc20Symbol = await tradingForErc20Instance.symbol();
    // });
  }

  function cancelFormSubmitForTradesFor() {
    setSearchedForTokenNameForTrading(undefined);
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
        A decentralized exchange that trades on the Ethereum blockchain.
      </div>
      <div>
        <div>
          <div>
            Trade For This Token
          </div>
          <form onSubmit={formSubmitForTrades}>
            <select id="select-for-trades">
              <option defaultValue>Select</option>
              {tradesTokenNamesJsx}
            </select>
            <button type="submit">Submit</button>
          </form>
          <button onClick={cancelFormSubmitForTrades}>
            Cancel
          </button>
        </div>
        <div>
          <div>
            Trade This Token For Something Else
          </div>
          <form onSubmit={formSubmitForTradesFor}>
            <select id="select-for-trades-for">
              <option defaultValue>Select</option>
              {tradesForTokenNamesJsx}
            </select>
            <input type="submit" value="Submit" />
          </form>
          <button onClick={cancelFormSubmitForTradesFor}>
            Cancel
          </button>
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
