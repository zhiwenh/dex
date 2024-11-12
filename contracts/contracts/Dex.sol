// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dex {
  event EventAddToDexTradeTokensForTokens (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventAddToDexTradeTokensForEth (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event EventAddToDexTradeEthForTokens (
    address sender,
    uint indexOfTrade,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventTradeTokensForTokens (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount,
    address orderCompletedBy
  );

  event EventTradeTokensForEth (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount,
    address orderCompletedBy
  );

  event EventTradeEthForTokens (
    address sender,
    uint indexOfTrade,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount,
    address orderCompletedBy
  );

  event EventCanceledTradeTokensForTokens (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventCanceledTradeTokensForEth (
    address sender,
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event EventCanceledTradeEthForTokens (
    address sender,
    uint indexOfTrade,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  struct TradeTokensForTokens {
    address tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForEth {
    address tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  }

  struct TradeEthForTokens {
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForTokensForCall {
    address sender;
    uint indexOfTradeOfAddress;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForEthForCall {
    address sender;
    uint indexOfTradeOfAddress;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  }

  struct TradeEthForTokensForCall {
    address sender;
    uint indexOfTradeOfAddress;
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct AllTrades {
    TradeTokensForTokensForCall[] tradeTokensForTokensForCall;
    TradeTokensForEthForCall[] tradeTokensForEthForCall;
    TradeEthForTokensForCall[] tradeEthForTokensForCall;
  }

  mapping(address => TradeTokensForTokens[]) public tradesOfTokensForTokensOfAnAddress;
  mapping(address => TradeTokensForEth[]) public tradesOfTokensForEthOfAnAddress;
  mapping(address => TradeEthForTokens[]) public tradesOfEthForTokensOfAnAddress;

  struct TradeCategoriesOfDexUser {
    bool tradeTokensForTokens;
    bool tradeTokensForEth;
    bool tradeEthForTokens;
  }

  address[] public dexUsersArr;
  mapping(address => TradeCategoriesOfDexUser) dexUsersMapping;

  address owner;

  constructor() {
    owner = msg.sender;
  }

  function addTokensToDexForTradeWithOtherTokens(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public {

    require(tradingTokenAddress != tradingForTokenAddress);

    tradesOfTokensForTokensOfAnAddress[msg.sender].push(
      TradeTokensForTokens(
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ));

    emit EventAddToDexTradeTokensForTokens(
      msg.sender,
      tradesOfTokensForTokensOfAnAddress[msg.sender].length - 1,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
    );

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeTokensForTokens = true;

    } else if (dexUsersMapping[msg.sender].tradeTokensForTokens == false) {
      dexUsersMapping[msg.sender].tradeTokensForTokens = true;
    }
  }

  function addTokensToDexForTradeWithEth(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount) public {

    tradesOfTokensForEthOfAnAddress[msg.sender].push(
      TradeTokensForEth(
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForEthAmount,
        false
    ));

    emit EventAddToDexTradeTokensForEth(
      msg.sender,
      tradesOfTokensForEthOfAnAddress[msg.sender].length - 1,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForEthAmount
    );

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeTokensForEth = true;

    } else if (dexUsersMapping[msg.sender].tradeTokensForEth == false) {
      dexUsersMapping[msg.sender].tradeTokensForEth = true;
    }
  }

  function addEthToDexForTradeWithTokens(
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public payable {

    require(msg.value == tradingEthAmount);

    tradesOfEthForTokensOfAnAddress[msg.sender].push(
      TradeEthForTokens(
        tradingEthAmount,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ));

    emit EventAddToDexTradeEthForTokens(
      msg.sender,
      tradesOfEthForTokensOfAnAddress[msg.sender].length - 1,
      tradingEthAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
    );

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeEthForTokens = true;

    } else if (dexUsersMapping[msg.sender].tradeEthForTokens == false) {
      dexUsersMapping[msg.sender].tradeEthForTokens = true;
    }
  }

  function buyTokensFromTokens(address sender, uint indexOfTrade) public {
    require(sender != msg.sender);
    require(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded != true);

    ERC20 tradingErc20 = ERC20(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount);

    ERC20 tradingForErc20 = ERC20(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress);

    require(tradingForErc20.balanceOf(msg.sender) >= tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount, 'here1');
    require(tradingForErc20.allowance(msg.sender, address(this)) >= tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount, 'here2');

    tradingForErc20.transferFrom(msg.sender, sender, tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount);

    tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeTokensForTokens(
      sender,
      indexOfTrade,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount,
      msg.sender
    );
  }

  function buyTokensForEth(address sender, uint indexOfTrade) public payable {
    require(sender != msg.sender);
    require(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded != true);

    ERC20 tradingErc20 = ERC20(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount);

    require(msg.value == tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount);

    (bool sent,) = sender.call{value: msg.value}("");
    require(sent, "Failed to send Ether");

    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeTokensForEth(
      sender,
      indexOfTrade,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount,
      msg.sender
    );
  }

  function buyEthForTokens(address sender, uint indexOfTrade) public payable {
    require(sender != msg.sender);
    require(tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded != true);

    ERC20 tradingForErc20 = ERC20(tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress);
    require(tradingForErc20.balanceOf(msg.sender) >= tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount);

    require(tradingForErc20.allowance(msg.sender, address(this)) >= tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount);

    tradingForErc20.transferFrom(msg.sender, sender, tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount);

    (bool sent,) = payable(msg.sender).call{value: tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeEthForTokens(
      sender,
      indexOfTrade,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount,
      msg.sender
    );
  }

  function cancelTradeForTokensWithTokens(address sender, uint indexOfTrade) public {
    require(msg.sender == sender);
    require(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventCanceledTradeTokensForTokens(
      sender,
      indexOfTrade,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  function cancelTradeForTokensWithEth(address sender, uint indexOfTrade) public {
    require(msg.sender == sender);
    require(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventCanceledTradeTokensForEth(
      sender,
      indexOfTrade,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount
    );
  }

  function cancelTradeForEthWithTokens(address sender, uint indexOfTrade) public payable {
    require(msg.sender == sender);
    require(tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    (bool sent,) = payable(msg.sender).call{value: tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    emit EventCanceledTradeEthForTokens(
      sender,
      indexOfTrade,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  function getAllTrades() public view returns (AllTrades memory) {

    uint amountOfTrades = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfTokensForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
        amountOfTrades = amountOfTrades + 1;
      }
    }

    TradeTokensForTokensForCall[] memory tradeTokensForTokensResultArr = new TradeTokensForTokensForCall[](amountOfTrades);

    uint indexOfResultArr = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfTokensForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
        TradeTokensForTokens memory tradeTokensForTokens = tradesOfTokensForTokensOfAnAddress[dexUsersArr[i]][j];
        TradeTokensForTokensForCall memory tradeTokensForTokensForCall = TradeTokensForTokensForCall (
          dexUsersArr[i],
          j,
          tradeTokensForTokens.tradingTokenAddress,
          tradeTokensForTokens.tradingTokenAmount,
          tradeTokensForTokens.tradingForTokenAddress,
          tradeTokensForTokens.tradingForTokenAmount,
          tradeTokensForTokens.alreadyTraded
        );

        tradeTokensForTokensResultArr[indexOfResultArr] = tradeTokensForTokensForCall;

        indexOfResultArr = indexOfResultArr + 1;
      }
    }

    amountOfTrades = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfTokensForEthOfAnAddress[dexUsersArr[i]].length; j++) {
        amountOfTrades = amountOfTrades + 1;
      }
    }

    TradeTokensForEthForCall[] memory tradeTokensForEthResultArr = new TradeTokensForEthForCall[](amountOfTrades);

    indexOfResultArr = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfTokensForEthOfAnAddress[dexUsersArr[i]].length; j++) {
        TradeTokensForEth memory tradeTokensForEth = tradesOfTokensForEthOfAnAddress[dexUsersArr[i]][j];
        TradeTokensForEthForCall memory tradeTokensForEthForCall = TradeTokensForEthForCall (
          dexUsersArr[i],
          j,
          tradeTokensForEth.tradingTokenAddress,
          tradeTokensForEth.tradingTokenAmount,
          tradeTokensForEth.tradingForEthAmount,
          tradeTokensForEth.alreadyTraded
        );

        tradeTokensForEthResultArr[indexOfResultArr] = tradeTokensForEthForCall;
        indexOfResultArr = indexOfResultArr + 1;
      }
    }

    amountOfTrades = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfEthForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
        amountOfTrades = amountOfTrades + 1;
      }
    }

    TradeEthForTokensForCall[] memory tradeEthForTokensResultArr = new TradeEthForTokensForCall[](amountOfTrades);

    indexOfResultArr = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfEthForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
        TradeEthForTokens memory tradeEthForTokens = tradesOfEthForTokensOfAnAddress[dexUsersArr[i]][j];
        TradeEthForTokensForCall memory tradeEthForTokensForCall = TradeEthForTokensForCall (
          dexUsersArr[i],
          j,
          tradeEthForTokens.tradingEthAmount,
          tradeEthForTokens.tradingForTokenAddress,
          tradeEthForTokens.tradingForTokenAmount,
          tradeEthForTokens.alreadyTraded
        );

        tradeEthForTokensResultArr[indexOfResultArr] = tradeEthForTokensForCall;
        indexOfResultArr = indexOfResultArr + 1;
      }
    }

    AllTrades memory allTrades;

    allTrades.tradeTokensForTokensForCall = tradeTokensForTokensResultArr;
    allTrades.tradeTokensForEthForCall = tradeTokensForEthResultArr;
    allTrades.tradeEthForTokensForCall = tradeEthForTokensResultArr;

    return allTrades;
  }



  function getDexUsers() public view returns (address[] memory) {
    return dexUsersArr;
  }

  struct AllTradesOfAccount {
    TradeTokensForTokensForCall[] tradeTokensForTokensForCall;
    TradeTokensForEthForCall[] tradeTokensForEthForCall;
    TradeEthForTokensForCall[] tradeEthForTokensForCall;
  }

  fallback() external payable {

  }
}
