// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dex {
  event EventAddToDexTradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventAddToDexTradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event EventAddToDexTradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventTradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventTradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event EventTradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventCanceledTradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event EventCanceledTradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event EventCanceledTradeEthForTokens (
    address sender,
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

  /* TradeTokensForTokens[] public tradeTokensForTokensArr;
  TradeTokensForEth[] public tradeTokensForEthArr;
  TradeEthForTokens[] public tradeEthForTokensArr; */

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

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;
    TradeTokensForTokens[] memory tradeTokensForTokensArrForAddress
      = tradesOfTokensForTokensOfAnAddress[msg.sender];

    TradeTokensForEth[] memory tradeTokensForEthArrForAddress
      = tradesOfTokensForEthOfAnAddress[msg.sender];

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == true) {
      for (uint i = 0; i < tradeTokensForTokensArrForAddress.length; i++) {
        if (tradeTokensForTokensArrForAddress[i].tradingTokenAddress == tradingTokenAddress
            && tradeTokensForTokensArrForAddress[i].alreadyTraded == false) {
          totalAllowanceRequired = tradeTokensForTokensArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
        }
      }
    }

    if (dexUsersMapping[msg.sender].tradeTokensForEth == true) {
      for (uint i = 0; i < tradeTokensForEthArrForAddress.length; i++) {
        if (tradeTokensForEthArrForAddress[i].tradingTokenAddress == tradingTokenAddress
            && tradeTokensForEthArrForAddress[i].alreadyTraded == false) {
          totalAllowanceRequired = tradeTokensForEthArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
        }
      }
    }

    require(tradingErc20.allowance(msg.sender, address(this)) >= totalAllowanceRequired, 'here1');

    require(tradingErc20.balanceOf(msg.sender) >= totalAllowanceRequired, 'here 2');

    /* require(tradingErc20.allowance(msg.sender, address(this)) == newAllowance); */

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

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;

    TradeTokensForTokens[] memory tradeTokensForTokensArrForAddress
      = tradesOfTokensForTokensOfAnAddress[msg.sender];

    TradeTokensForEth[] memory tradeTokensForEthArrForAddress
      = tradesOfTokensForEthOfAnAddress[msg.sender];

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == true) {
      for (uint i = 0; i < tradeTokensForTokensArrForAddress.length; i++) {
        if (tradeTokensForTokensArrForAddress[i].tradingTokenAddress == tradingTokenAddress
            && tradeTokensForTokensArrForAddress[i].alreadyTraded == false) {
          totalAllowanceRequired = tradeTokensForTokensArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
        }
      }
    }

    if (dexUsersMapping[msg.sender].tradeTokensForEth == true) {
      for (uint i = 0; i < tradeTokensForEthArrForAddress.length; i++) {
        if (tradeTokensForEthArrForAddress[i].tradingTokenAddress == tradingTokenAddress
            && tradeTokensForEthArrForAddress[i].alreadyTraded == false) {
          totalAllowanceRequired = tradeTokensForEthArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
        }
      }
    }

    /* for (uint i = 0; i < tradeTokensForEthArrForAddress.length; i++) {
      if (tradeTokensForEthArrForAddress[i].tradingTokenAddress == tradingTokenAddress) {
        totalAllowanceRequired = tradeTokensForEthArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
      }
    } */

    require(tradingErc20.allowance(msg.sender, address(this)) >= totalAllowanceRequired);
    require(tradingErc20.balanceOf(msg.sender) >= totalAllowanceRequired);

    tradesOfTokensForEthOfAnAddress[msg.sender].push(
      TradeTokensForEth(
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForEthAmount,
        false
    ));

    emit EventAddToDexTradeTokensForEth(
      msg.sender,
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

  /* function updateTokensToDexForTradeWithOtherTokens(
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  ) public {

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;
    TradeTokensForTokens[] memory tradeTokensForTokensArrForAddress
      = tradesOfTokensForTokensOfAnAddress[msg.sender];

    for (uint i = 0; i < tradeTokensForTokensArrForAddress.length; i++) {
      if (tradeTokensForTokensArrForAddress[i].tradingTokenAddress == tradingTokenAddress
          && tradeTokensForTokensArrForAddress[i].alreadyTraded == false
          && i != indexOfTrade) {
        totalAllowanceRequired = tradeTokensForTokensArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
      }
    }

    require(tradingErc20.allowance(msg.sender, address(this)) >= totalAllowanceRequired);
    require(tradingErc20.balanceOf(msg.sender) >= totalAllowanceRequired);

    tradesOfTokensForTokensOfAnAddress[msg.sender][indexOfTrade].tradingTokenAddress = tradingTokenAddress;
    tradesOfTokensForTokensOfAnAddress[msg.sender][indexOfTrade].tradingTokenAmount = tradingTokenAmount;
    tradesOfTokensForTokensOfAnAddress[msg.sender][indexOfTrade].tradingForTokenAddress = tradingForTokenAddress;
    tradesOfTokensForTokensOfAnAddress[msg.sender][indexOfTrade].tradingForTokenAmount = tradingForTokenAmount;
  }

  function updateTokensToDexForTradeWithEth(
    uint indexOfTrade,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  ) public {
    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;

    TradeTokensForEth[] memory tradeTokensForEthArrForAddress
      = tradesOfTokensForEthOfAnAddress[msg.sender];

    for (uint i = 0; i < tradeTokensForEthArrForAddress.length; i++) {
      if (tradeTokensForEthArrForAddress[i].tradingTokenAddress == tradingTokenAddress
          && tradeTokensForEthArrForAddress[i].alreadyTraded == false
          && i != indexOfTrade) {
        totalAllowanceRequired = tradeTokensForEthArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
      }
    }

    require(tradingErc20.allowance(msg.sender, address(this)) >= totalAllowanceRequired);
    require(tradingErc20.balanceOf(msg.sender) >= totalAllowanceRequired);

    tradesOfTokensForEthOfAnAddress[msg.sender][indexOfTrade].tradingTokenAddress = tradingTokenAddress;
    tradesOfTokensForEthOfAnAddress[msg.sender][indexOfTrade].tradingTokenAmount = tradingTokenAmount;
    tradesOfTokensForEthOfAnAddress[msg.sender][indexOfTrade].tradingForEthAmount = tradingForEthAmount;
  }

  function updateEthToDexForTradeWithTokens(
    uint indexOfTrade,
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  ) public payable {

    uint amountOfEthAlreadyInDex = tradesOfEthForTokensOfAnAddress[msg.sender][indexOfTrade].tradingEthAmount;

    if (tradingEthAmount - amountOfEthAlreadyInDex > 0) {
      require(msg.value == tradingEthAmount - amountOfEthAlreadyInDex);
    } else if (tradingEthAmount - amountOfEthAlreadyInDex < 0) {
      (bool sent,) = msg.sender.call{value: amountOfEthAlreadyInDex - tradingEthAmount}("");
      require(sent, "Failed to send Ether");
    }

    tradesOfEthForTokensOfAnAddress[msg.sender][indexOfTrade].tradingEthAmount = tradingEthAmount;
    tradesOfEthForTokensOfAnAddress[msg.sender][indexOfTrade].tradingForTokenAddress = tradingForTokenAddress;
    tradesOfEthForTokensOfAnAddress[msg.sender][indexOfTrade].tradingForTokenAmount = tradingForTokenAmount;
  } */

  /* struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  /* address tradingTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
  uint tradingTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
  address tradingForTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
  uint tradingForTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount; */

  function buyTokensFromOtherTokens(address sender, uint indexOfTrade) public {
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
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  /* event TradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  ) */

  // TradeTokensForEth

  /* struct TradeTokensForEth {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  } */

  /* address tradingTokenAddress = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
  uint tradingTokenAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
  uint tradingForEthAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount; */

  function buyTokensForEth(address sender, uint indexOfTrade) public payable {
    require(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded != true);

    ERC20 tradingErc20 = ERC20(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount);

    require(msg.value == tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount);

    (bool sent,) = sender.call{value: msg.value}("");
    require(sent, "Failed to send Ether");

    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeTokensForEth(
      sender,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount
    );
  }

  /* event TradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  ); */

  // TradeEthForTokens

  /* struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  /* uint tradingEthAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount;
  address tradingForTokenAddress = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
  uint tradingForTokenAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount; */

  function buyEthForTokens(address sender, uint indexOfTrade) public payable {
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
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  /* struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  /* address tradingTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
  uint tradingTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
  address tradingForTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
  uint tradingForTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount; */

  function cancelTradeForTokensWithTokens(address sender, uint indexOfTrade) public {
    require(msg.sender == sender);
    require(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventCanceledTradeTokensForTokens(
      sender,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  /* struct TradeTokensForEth {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  } */

  /* address tradingTokenAddress = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
  uint tradingTokenAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
  uint tradingForEthAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount; */

  function cancelTradeForTokensWithEth(address sender, uint indexOfTrade) public {
    require(msg.sender == sender);
    require(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventCanceledTradeTokensForEth(
      sender,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount,
      tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount
    );
  }

  /* struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  /* uint tradingEthAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount;
  address tradingForTokenAddress = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
  uint tradingForTokenAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount;
   */

  function cancelTradeForEthWithTokens(address sender, uint indexOfTrade) public payable {
    require(msg.sender == sender);
    require(tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded == false);

    tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    (bool sent,) = payable(msg.sender).call{value: tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    emit EventCanceledTradeEthForTokens(
      sender,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress,
      tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount
    );
  }

  struct AllTrades {
    TradeTokensForTokensForCall[] tradeTokensForTokensForCall;
    TradeTokensForEthForCall[] tradeTokensForEthForCall;
    TradeEthForTokensForCall[] tradeEthForTokensForCall;
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

  struct TradeTokensForTokensForCall {
    address sender;
    uint indexOfTradeOfAddress;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  /* function getTradesForTokensWithTokens() public view returns (TradeTokensForTokensForCall[] memory) {

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

    return tradeTokensForTokensResultArr;
  } */

  /* if (dexUsersMapping[dexUsersArr[i]].tradeTokensForTokens == true) { */

  struct TradeTokensForEthForCall {
    address sender;
    uint indexOfTradeOfAddress;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  }

  /* function getTradesForTokensWithEth() public view returns (TradeTokensForEthForCall[] memory) {

    uint amountOfTrades = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfTokensForEthOfAnAddress[dexUsersArr[i]].length; j++) {
        amountOfTrades = amountOfTrades + 1;
      }
    }

    TradeTokensForEthForCall[] memory tradeTokensForEthResultArr = new TradeTokensForEthForCall[](amountOfTrades);

    uint indexOfResultArr = 0;

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

    return tradeTokensForEthResultArr;
  } */

  struct TradeEthForTokensForCall {
    address sender;
    uint indexOfTradeOfAddress;
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  /* function getTradesForEthWithTokens() public view returns (TradeEthForTokensForCall[] memory) {

    uint amountOfTrades = 0;

    for (uint i = 0; i < dexUsersArr.length; i++) {
      for (uint j = 0; j < tradesOfEthForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
        amountOfTrades = amountOfTrades + 1;
      }
    }

    TradeEthForTokensForCall[] memory tradeEthForTokensResultArr = new TradeEthForTokensForCall[](amountOfTrades);

    uint indexOfResultArr = 0;

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

    return tradeEthForTokensResultArr;
  } */

  function getDexUsers() public view returns (address[] memory) {
    return dexUsersArr;
  }

  struct AllTradesOfAccount {
    TradeTokensForTokensForCall[] tradeTokensForTokensForCall;
    TradeTokensForEthForCall[] tradeTokensForEthForCall;
    TradeEthForTokensForCall[] tradeEthForTokensForCall;
  }

  /* function getAllTradesOfAccount(address sender) public view returns(AllTradesOfAccount memory) {
    AllTradesOfAccount memory allTradesOfAccount;

    allTradesOfAccount.tradeTokensForTokensForCall = new TradeTokensForTokensForCall[](tradesOfTokensForTokensOfAnAddress[sender].length);

    uint indexOfResultArr = 0;

    for (uint i = 0; i < tradesOfTokensForTokensOfAnAddress[sender].length; i++) {
      TradeTokensForTokens memory tradeTokensForTokens = tradesOfTokensForTokensOfAnAddress[sender][i];
      TradeTokensForTokensForCall memory tradeTokensForTokensForCall = TradeTokensForTokensForCall (
        sender,
        i,
        tradeTokensForTokens.tradingTokenAddress,
        tradeTokensForTokens.tradingTokenAmount,
        tradeTokensForTokens.tradingForTokenAddress,
        tradeTokensForTokens.tradingForTokenAmount,
        tradeTokensForTokens.alreadyTraded
      );

      allTradesOfAccount.tradeTokensForTokensForCall[indexOfResultArr] = tradeTokensForTokensForCall;
      indexOfResultArr = indexOfResultArr + 1;
    }

    allTradesOfAccount.tradeTokensForEthForCall = new TradeTokensForEthForCall[](tradesOfTokensForEthOfAnAddress[sender].length);

    indexOfResultArr = 0;

    for (uint i = 0; i < tradesOfTokensForEthOfAnAddress[sender].length; i++) {
      TradeTokensForEth memory tradeTokensForEth = tradesOfTokensForEthOfAnAddress[sender][i];
      TradeTokensForEthForCall memory tradeTokensForEthForCall = TradeTokensForEthForCall (
        sender,
        i,
        tradeTokensForEth.tradingTokenAddress,
        tradeTokensForEth.tradingTokenAmount,
        tradeTokensForEth.tradingForEthAmount,
        tradeTokensForEth.alreadyTraded
      );

      allTradesOfAccount.tradeTokensForEthForCall[indexOfResultArr] = tradeTokensForEthForCall;
      indexOfResultArr = indexOfResultArr + 1;
    }

    /* TradeEthForTokensForCall[] memory tradeEthForTokensResultArr = new TradeEthForTokensForCall[](tradesOfEthForTokensOfAnAddress[sender].length); */

    /* allTradesOfAccount.tradeEthForTokensForCall = new TradeEthForTokensForCall[](tradesOfEthForTokensOfAnAddress[sender].length);

    indexOfResultArr = 0;

    for (uint i = 0; i < tradesOfEthForTokensOfAnAddress[sender].length; i++) {
      TradeEthForTokens memory tradeEthForTokens = tradesOfEthForTokensOfAnAddress[sender][i];
      TradeEthForTokensForCall memory tradeEthForTokensForCall = TradeEthForTokensForCall (
        sender,
        i,
        tradeEthForTokens.tradingEthAmount,
        tradeEthForTokens.tradingForTokenAddress,
        tradeEthForTokens.tradingForTokenAmount,
        tradeEthForTokens.alreadyTraded
      );

      allTradesOfAccount.tradeEthForTokensForCall[indexOfResultArr] = tradeEthForTokensForCall;
      indexOfResultArr = indexOfResultArr + 1;
    }

    return allTradesOfAccount; */
  /* }  */
}
