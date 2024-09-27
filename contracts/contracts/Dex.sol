// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

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

  TradeTokensForTokens[] public tradeTokensForTokensArr;
  TradeTokensForEth[] public tradeTokensForEthArr;
  TradeEthForTokens[] public tradeEthForTokensArr;

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

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeTokensForTokens = true;

    } else if (dexUsersMapping[msg.sender].tradeTokensForTokens == false) {
      dexUsersMapping[msg.sender].tradeTokensForTokens = true;
    }

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;
    TradeTokensForTokens[] memory tradeTokensForTokensArrForAddress
      = tradesOfTokensForTokensOfAnAddress[msg.sender];

    for (uint i = 0; i < tradeTokensForTokensArrForAddress.length; i++) {
      if (tradeTokensForTokensArrForAddress[i].tradingTokenAddress == tradingTokenAddress
          && tradeTokensForTokensArrForAddress[i].alreadyTraded == false)
        ) {
        uint tradingTokenAmountForTrade = tradeTokensForTokensArrForAddress[i].tradingTokenAmount;
        totalAllowanceRequired = tradingTokenAmountForTrade + totalAllowanceRequired;
      }
    }

    require(tradingErc20.allowance(msg.sender, address(this)) >= totalAllowanceRequired);
    require(tradingErc20.balanceOf(msg.sender) >= totalAllowanceRequired);

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
  }

  function addTokensToDexForTradeWithEth(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount) public {

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeTokensForEth = true;

    } else if (dexUsersMapping[msg.sender].tradeTokensForEth == false) {
      dexUsersMapping[msg.sender].tradeTokensForEth = true;
    }

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint totalAllowanceRequired = tradingTokenAmount;
    TradeTokensForEth[] memory tradeTokensForEthArrForAddress
      = tradesOfTokensForEthOfAnAddress[msg.sender];

    for (uint i = 0; i < tradeTokensForEthArrForAddress.length; i++) {
      if (tradeTokensForEthArrForAddress[i].tradingTokenAddress == tradingTokenAddress) {
        uint tradingTokenAmountForTrade = tradeTokensForEthArrForAddress[i].tradingTokenAmount;
        totalAllowanceRequired = tradingTokenAmountForTrade + totalAllowanceRequired;
      }
    }

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
  }

  function addEthToDexForTradeWithTokens(
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public payable {

    if (dexUsersMapping[msg.sender].tradeTokensForTokens == false &&
        dexUsersMapping[msg.sender].tradeTokensForEth == false &&
        dexUsersMapping[msg.sender].tradeEthForTokens == false) {
          dexUsersArr.push(msg.sender);
          dexUsersMapping[msg.sender].tradeEthForTokens = true;

    } else if (dexUsersMapping[msg.sender].tradeEthForTokens == false) {
      dexUsersMapping[msg.sender].tradeEthForTokens = true;
    }

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
  }

  /* struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  function buyTokensFromOtherTokens(address sender, uint indexOfTrade) public {
    require(tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded != true);
    address tradingTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount;

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradingTokenAmount);

    address tradingForTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount;

    ERC20 tradingForErc20 = ERC20(tradingForTokenAddress);

    require(tradingForErc20.balanceOf(msg.sender) >= tradingForTokenAmount);
    require(tradingForErc20.allowance(msg.sender, address(this)) >= tradingForTokenAmount)

    tradingForErc20.transferFrom(msg.sender, sender, tradingForTokenAmount);

    tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeTokensForTokens(
      sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
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

  function buyTokensForEth(uint indexOfTrade) public payable {
    require(tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded != true);
    address sender = tradeTokensForEthArr[indexOfTrade].sender;
    address tradingTokenAddress = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
    uint tradingForEthAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount;

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradingTokenAmount);

    require(msg.value == tradingForEthAmount);

    (bool sent,) = sender.call{value: msg.value}("");
    require(sent, "Failed to send Ether");

    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeTokensForEth(
      sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForEthAmount
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

  function buyEthForTokens(address sender, uint indexOfTrade) public payable {
    require(tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded != true);
    uint tradingEthAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingEthAmount;
    address tradingForTokenAddress = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount;

    ERC20 tradingForErc20 = ERC20(tradingForTokenAddress);
    require(tradingForErc20.balanceOf(msg.sender) >= tradingForTokenAmount);
    tradingForErc20.transfer(sender, tradingForTokenAmount);

    ERC20 tradingForErc20 = ERC20(tradingForTokenAddress);

    require(tradingForErc20.balanceOf(msg.sender) >= tradingForTokenAmount);
    require(tradingForErc20.allowance(msg.sender, address(this)) >= tradingForTokenAmount)

    tradingForErc20.transferFrom(msg.sender, sender, tradingForTokenAmount);

    (bool sent,) = payable(msg.sender).call{value: tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    tradesOfEthForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    emit EventTradeEthForTokens(
      sender,
      tradingEthAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
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

  function cancelTradeForTokensWithTokens(address sender, uint indexOfTrade) public {
    tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    address sender = tradeTokensForTokensArr[indexOfTrade].sender;

    require(msg.sender == sender);

    address tradingTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
    address tradingForTokenAddress = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradesOfTokensForTokensOfAnAddress[sender][indexOfTrade].tradingForTokenAmount;

    emit EventCanceledTradeTokensForTokens(
      sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
    );
  }

  /* struct TradeTokensForEth {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  } */

  function cancelTradeForTokensWithEth(address sender, uint indexOfTrade) public {
    tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].alreadyTraded = true;

    require(msg.sender == sender);

    address tradingTokenAddress = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingTokenAmount;
    uint tradingForEthAmount = tradesOfTokensForEthOfAnAddress[sender][indexOfTrade].tradingForEthAmount;

    emit EventCanceledTradeTokensForEth(
      sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForEthAmount
    );
  }

  /* struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  function cancelTradeForEthWithTokens(uint indexOfTrade) public payable {
    tradeEthForTokensArr[indexOfTrade].alreadyTraded = true;

    address sender = tradeEthForTokensArr[indexOfTrade].sender;

    require(msg.sender == sender);

    uint tradingEthAmount = tradeEthForTokensArr[indexOfTrade].tradingEthAmount;
    address tradingForTokenAddress = tradeEthForTokensArr[indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradeEthForTokensArr[indexOfTrade].tradingForTokenAmount;

    (bool sent,) = payable(msg.sender).call{value: tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    emit EventCanceledTradeEthForTokens(
      sender,
      tradingEthAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
    );
  }

  /* event TradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    uint tradingForTokenAddress,
    uint tradingForTokenAmount
  ); */

  /* struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  struct TradeTokensForTokensForReturn {
    address sender;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  function getTradesForTokenWithToken() public view returns (TradeTokensForTokens[] memory) {

    TradeTokensForTokensForReturn[] memory tradeTokensForTokensResultArr =
      new TradeTokensForTokensForReturn[];

    for (uint i = 0; i < dexUsersArr.length; i++) {
      if (dexUsersMapping[dexUsersArr[i]].tradeTokensForTokens == true) {
        for (let j = 0; j < tradesOfTokensForTokensOfAnAddress[dexUsersArr[i]].length; j++) {
          TradeTokensForTokens tradeTokensForTokens = tradesOfTokensForTokensOfAnAddress[dexUsersArr[i]][j];
          TradeTokensForTokensForReturn tradeTokensForTokensForReturn = TradeTokensForTokensForReturn (
            dexUsersArr[i],
            tradeTokensForTokens.tradingTokenAddress,
            tradeTokensForTokens.tradingTokenAmount,
            tradeTokensForTokens.tradingForTokenAddress,
            tradeTokensForTokens.tradingForTokenAmount,
            tradeTokensForTokens.alreadyTraded
          );

          tradeTokensForTokensResultArr.push(tradeTokensForTokensForReturn)
        }
      }
    }

    for (uint i = 0; i < tradeTokensForTokensArr.length; i++) {
      tradeTokensForTokensResultArr[i] = tradeTokensForTokensArr[i];
    }

    return tradeTokensForTokensArr;
  }

  function getTradesForTokensWithEth() public view returns (TradeTokensForEth[] memory) {
    /* TradeTokensForEth[] memory tradeTokensForEthResultArr =
      new TradeTokensForEth[](tradeTokensForEthArr.length);

    for (uint i = 0; i < tradeTokensForEthArr.length; i++) {
      tradeTokensForEthResultArr[i] = tradeTokensForEthArr[i];
    } */

    return tradeTokensForEthArr;
  }

  /* struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  function getTradesForEthWithTokens() public view returns (TradeEthForTokens[] memory) {
    /* TradeEthForTokens[] memory tradeEthForTokensResultArr =
      new TradeEthForTokens[](tradeEthForTokensArr.length);

    for (uint i = 0; i < tradeEthForTokensArr.length; i++) {
      tradeEthForTokensResultArr[i] = tradeEthForTokensArr[i];
    } */

    return tradeEthForTokensArr;
  }

}
