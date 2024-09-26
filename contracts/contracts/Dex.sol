// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Dex {

  event AddToDexTradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event AddToDexTradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event AddToDexTradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    uint tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event TradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event TradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event TradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    uint tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event CanceledTradeTokensForTokens (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  event CanceledTradeTokensForEth (
    address sender,
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount
  );

  event CanceledTradeEthForTokens (
    address sender,
    uint tradingEthAmount,
    uint tradingForTokenAddress,
    uint tradingForTokenAmount
  );

  struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForEth {
    address sender;
    address tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  }

  struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  TradeTokensForTokens[] public tradeTokensForTokensArr;
  TradeTokensForEth[] public tradeTokensForEthArr;
  TradeEthForTokens[] public tradeEthForTokensArr;

  address owner;

  constructor() {
    owner = msg.sender;
  }

  function addTokenToDexForTradeWithAnotherToken(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public returns (uint indexOfTrade) {

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    require(tradingErc20.balanceOf(msg.sender) >= tradingTokenAmount);

    uint newAllowance = tradingErc20.allowance(msg.sender, address(this)) + tradingTokenAmount;
    tradingErc20.approve(address(this), newAllowance);

    tradeTokensForTokensArr.push(
      TradeTokensForTokens(
        msg.sender,
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ));

    emit AddToDexTradeTokensForTokens(
      msg.sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForTokenAddress,
      tradingForTokenAmount,
    );

    return tradeTokensForTokensArr.length - 1;
  }

  function addTokenToDexForTradeWithEth(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount) public returns (uint indexOfTrade){

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    require(tradingErc20.balanceOf(msg.sender) >= tradingTokenAmount);

    uint newAllowance = tradingErc20.allowance(msg.sender, address(this)) + tradingTokenAmount;
    tradingErc20.approve(address(this), newAllowance);

    tradeTokensForEthArr.push(
      TradeTokensForEth(
        msg.sender
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForEthAmount,
        false
    ));

    emit AddToDexTradeTokensForEth(
      msg.sender
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForEthAmount
    );

    return tradeTokensForEthArr.length - 1;
  }

  function addEthToDexForTradeWithToken(
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public payable returns (uint indexOfTrade){

    require(msg.value === tradingEthAmount);

    tradeEthForTokensArr.push(
      TradeEthForTokens(
        msg.sender,
        tradingEthAmount,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ));

    emit AddToDexTradeEthForTokens(
      msg.sender,
      tradingEthAmount,
      tradingForTokenAddress,
      tradingForTokenAmount
    );

    return tradeEthForTokensArr.length - 1;
  }

  /* struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  function buyTokenForAnotherToken(uint indexOfTrade) public {
    require(tradeTokensForTokenArr[indexOfTrade].alreadyTraded !== true);
    address tradingTokenAddress = tradeTokensForTokenArr[indexOfTrade].tradingTokenAddress;
    address sender = tradeTokensForTokenArr[indexOfTrade].sender;
    uint tradingTokenAmount = tradeTokensForTokenArr[indexOfTrade].tradingTokenAmount;

    ERC20 memory tradingErc20 = ERC20(tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, originalTokenAmount);

    address tradingForTokenAddress = tradeTokensForTokenArr[indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradeTokensForTokenArr[indexOfTrade].tradingForTokenAmount;

    ERC20 memory tradingForErc20 = ERC20(tradingForTokenAddress);
    tradingForErc20.transfer(sender, tradingForTokenAmount);

    tradeTokensForTokenArr[indexOfTrade].alreadyTraded = true;

    emit TradeTokensForTokens(
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
    require(tradeTokensForEthArr[indexOfTrade].alreadyTraded !== true);
    address sender = tradeTokensForEthArr[indexOfTrade].sender;
    address tradingTokenAddress = tradeTokensForEthArr[indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradeTokensForEthArr[indexOfTrade].tradingTokenAmount;
    uint tradingForEthAmount = tradeTokensForEthArr[indexOfTrade].tradingForEthAmount;

    ERC20 memory tradingErc20 = ERC20(tradingTokenAddress);
    tradingErc20.transferFrom(sender, msg.sender, tradingTokenAmount);

    require(msg.value === tradingForEthAmount);

    (bool sent) = sender.call{value: msg.value}("");
    require(sent, "Failed to send Ether");

    tradeTokensForEthArr[indexOfTrade].alreadyTraded = true;

    emit TradeTokensForEth(
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

  function buyEthForTokens(uint indexOfTrade) public payable {
    require(tradeEthForTokensArr[indexOfTrade].alreadyTraded !== true);
    address sender = tradeEthForTokensArr[indexOfTrade].sender;
    uint tradingEthAmount = tradeEthForTokensArr[indexOfTrade].tradingEthAmount;
    address tradingForTokenAddress = tradeEthForTokensArr[indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradeEthForTokensArr[indexOfTrade].tradingForTokenAmount;

    ERC20 tradingForErc20 = ERC20(toTradeTokenAddress);
    tradingForErc20.transfer(sender, toTradeTokenAmount);

    (bool sent) = payable(msg.sender).call{value: tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    tradeEthForTokensArr[indexOfTrade].alreadyTraded = true;

    emit TradeEthForTokens(
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

  function cancelTradeForTokensWithTokens(uint indexOfTrade) public {
    tradeTokensForTokenArr[indexOfTrade].alreadyTraded = true;

    address sender = tradeTokensForTokenArr[indexOfTrade].sender;
    address tradingTokenAddress = tradeTokensForTokenArr[indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradeTokensForTokenArr[indexOfTrade].tradingTokenAmount;
    uint tradingForTokenAddress = tradeTokensForTokenArr[indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradeTokensForTokenArr[indexOfTrade].tradingForTokenAmount;

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint newAllowance = tradingErc20.allowance(msg.sender, address(this)) - tradingTokenAmount;
    tradingErc20.approve(address(this), newAllowance);

    emit CanceledTradeTokensForTokens(
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

  function cancelTradeForTokensWithEth(uint indexOfTrade) public {
    tradeTokensForEthArr[indexOfTrade].alreadyTraded = true;

    address sender = tradeTokensForEthArr[indexOfTrade].sender;
    address tradingTokenAddress = tradeTokensForEthArr[indexOfTrade].tradingTokenAddress;
    uint tradingTokenAmount = tradeTokensForEthArr[indexOfTrade].tradingTokenAmount;
    uint tradingForEthAmount = tradeTokensForEthArr[indexOfTrade].tradingForEthAmount;

    ERC20 tradingErc20 = ERC20(tradingTokenAddress);

    uint newTradingAllowance = tradingErc20.allowance(msg.sender, address(this)) - tradingTokenAmount;
    tradingErc20.approve(address(this), newTradingAllowance);

    emit CanceledTradeTokensForEth(
      sender,
      tradingTokenAddress,
      tradingTokenAmount,
      tradingForEthAmount,
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
    uint tradingEthAmount = tradeEthForTokensArr[indexOfTrade].tradingEthAmount;
    address tradingForTokenAddress = tradeEthForTokensArr[indexOfTrade].tradingForTokenAddress;
    uint tradingForTokenAmount = tradeEthForTokensArr[indexOfTrade].tradingForTokenAmount;

    (bool sent) = payable(msg.sender).call{value: tradingEthAmount}("");
    require(sent, "Failed to send Ether");

    emit CanceledTradeEthForTokens(
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

  function getTradesForTokenWithToken() public view returns (TradeTokensForTokens[] memory) {
    TradeTokensForTokens[] memory tradeTokensForTokensResultArr =
      new TradeTokensForTokens[](tradeTokensForTokensArr.length);

    for (uint i = 0; i < tradeTokensForTokensArr.length; i++) {
      tradeTokensForTokensResultArr.push(tradeTokensForTokensArr[i])
    }

    return tradeTokensForTokensResultArr;
  }

  function getTradesForTokenWithEth() public view returns (TradeTokensForEth[] memory) {
    TradeTokensForEth[] memory tradeTokensForEthResultArr =
      new TradeTokensForEth[](tradeTokensForEthArr.length);

    for (uint i = 0; i < tradeTokensForTokensArr.length; i++) {
      tradeTokensForTokensResultArr.push(tradeTokensForTokensArr[i])
    }

    return tradeTokensForTokensResultArr;
  }

  /* struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  } */

  function getTradesForEthWithToken() public view returns (TradeEthForToken[] memory) {
    TradeEthForToken[] memory tradeEthForTokensResultArr =
      new TradeEthForToken[](tradeEthForTokensArr.length);

    for (uint i = 0; i < tradeEthForTokensArr.length; i++) {
      tradeEthForTokensResultArr.push(tradeEthForTokensArr[i])
    }

    return tradeEthForTokensResultArr;
  }

}
