// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Messages {
  struct TradeTokensForTokens {
    address sender;
    uint originalTokenAddress;
    uint originalTokenAmount;
    uint toTradeTokenAddress;
    uint toTradeTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForEth {
    address sender;
    uint originalTokenAddress;
    uint originalTokenAmount;
    uint toTradeEthAmount;
    bool alreadyTraded;
  }

  struct TradeEthForTokens {
    address sender;
    uint originalEthAmount;
    uint toTradeTokenAddress;
    uint toTradeTokenAmount;
    bool alreadyTraded;
  }

  TradeForTokens[] public tradeTokensForTokensArr;
  TradeTokensForEth[] public tradeTokensForEthArr;
  TradeEthForTokens[] public tradeEthForTokensArr;

  address owner;

  constructor(address _erc20Address) {
    owner = msg.sender;
  }

  function addTokenToDexForTradeWithAnotherToken(
    address _erc20Address,
    uint valueToTrade,
    address _tokenToTradeForAddress,
    uint valueToTradeFor) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    tradeTokensForTokensArr.push(
      TradeTokensForTokens(
        msg.sender,
        _erc20Address,
        valueToTrade,
        _tokenToTradeForAddress,
        valueToTradeFor,
        false
    ))
  }

  function addTokenToDexForTradeWithEth(
    address _erc20Address,
    uint valueToTrade,
    uint valueToTradeFor) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    tradeTokensForEthArr.push(
      TradeTokensForEth(
        msg.sender
        _erc20Address,
        valueToTrade,
        valueToTradeFor,
        false
    ))
  }

  function addEthToDexForTradeWithToken(
    uint ethAmount,
    address _erc20Address,
    uint valueToTrade,
    bool false) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    tradeEthForTokensArr.push(
      TradeEthForTokens(
        msg.sender,
        _erc20Address,
        valueToTrade,
        valueToTradeFor,
        false
    ))
  }

  function buyTokenFromAnotherToken(uint indexOfTrade) public {
    address originalErc20Address = tradeTokensForTokenArr[indexOfTrade].originalTokenAddress;
    address sender = tradeTokensForTokenArr[indexOfTrade].sender;
    uint originalTokenAmount = tradeTokensForTokenArr[indexOfTrade].originalTokenAmount;
    ERC20 originalErc20 = ERC20(originalErc20Address);
    ERC20 originalErc20.transferFrom(sender, msg.sender, originalTokenAmount);
    address toTradeTokenAddress = tradeTokensForTokenArr[indexOfTrade].toTradeTokenAddress;
    uint toTradeTokenAmount = tradeTokensForTokenArr[indexOfTrade].toTradeTokenAmount;
    ERC20 tradingErc20 = ERC20(toTradeTokenAddress);
    ERC20 tradingErc20.transfer(sender, toTradeTokenAmount);
    tradeTokensForTokenArr[indexOfTrade].alreadyTraded = true;
  }
}
