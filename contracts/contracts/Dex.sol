// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Messages {
  struct TradeTokensForTokens {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  struct TradeTokensForEth {
    address sender;
    uint tradingTokenAddress;
    uint tradingTokenAmount;
    uint tradingForEthAmount;
    bool alreadyTraded;
  }

  struct TradeEthForTokens {
    address sender;
    uint tradingEthAmount;
    uint tradingForTokenAddress;
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
    uint tradingForTokenAmount) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    tradeTokensForTokensArr.push(
      TradeTokensForTokens(
        msg.sender,
        tradingTokenAddress,
        valueToTrade,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ))
  }

  function addTokenToDexForTradeWithEth(
    address tradingTokenAddress,
    uint tradingTokenAmount,
    uint tradingForEthAmount) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    tradeTokensForEthArr.push(
      TradeTokensForEth(
        msg.sender
        tradingTokenAddress,
        tradingTokenAmount,
        tradingForEthAmount,
        false
    ))
  }

  function addEthToDexForTradeWithToken(
    uint tradingEthAmount,
    address tradingForTokenAddress,
    uint tradingForTokenAmount) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    require(msg.value === ethAmount);
    tradeEthForTokensArr.push(
      TradeEthForTokens(
        msg.sender,
        tradingEthAmount,
        tradingForTokenAddress,
        tradingForTokenAmount,
        false
    ))
  }

  function buyTokenForAnotherToken(uint indexOfTrade) public {
    address originalErc20Address = tradeTokensForTokenArr[indexOfTrade].originalTokenAddress;
    address sender = tradeTokensForTokenArr[indexOfTrade].sender;
    uint originalTokenAmount = tradeTokensForTokenArr[indexOfTrade].originalTokenAmount;
    ERC20 memory originalErc20 = ERC20(originalErc20Address);
    originalErc20.transferFrom(sender, msg.sender, originalTokenAmount);
    address toTradeTokenAddress = tradeTokensForTokenArr[indexOfTrade].toTradeTokenAddress;
    uint toTradeTokenAmount = tradeTokensForTokenArr[indexOfTrade].toTradeTokenAmount;
    ERC20 memory tradingErc20 = ERC20(toTradeTokenAddress);
    tradingErc20.transfer(sender, toTradeTokenAmount);
    tradeTokensForTokenArr[indexOfTrade].alreadyTraded = true;
  }

  // TradeTokensForEth

  function buyTokensForEth(uint indexOfTrade) public {
    address originalErc20Address = tradeTokensForEthArr[indexOfTrade].originalTokenAddress;
    address sender = tradeTokensForEthArr[indexOfTrade].sender;
    uint originalTokenAmount = tradeTokensForEthArr[indexOfTrade].originalTokenAmount;
    uint toTradeEthAmount = tradeTokensForEthArr[indexOfTrade].toTradeEthAmount;
    ERC20 memory originalErc20 = ERC20(originalErc20Address);
    originalErc20.transferFrom(sender, msg.sender, originalTokenAmount);
    if (msg.value !== toTradeEthAmount) {
      revert();
    }
    (bool sent, bytes memory data) = sender.call{value: msg.value}("");
    require(sent, "Failed to send Ether");
    sender.transfer(msg.value);
    tradeTokensForEthArr[indexOfTrade].alreadyTraded = true;
  }

  // TradeEthForTokens

  function buyEthForTokens(uint indexOfTrade) public {
    address sender = tradeEthForTokensArr[indexOfTrade].sender;
    uint originalEthAmount = tradeEthForTokensArr[indexOfTrade].originalEthAmount;
    address toTradeTokenAddress = tradeEthForTokensArr[indexOfTrade].toTradeTokenAddress;
    uint toTradeTokenAmount = tradeEthForTokensArr[indexOfTrade].toTradeTokenAmount;
    ERC20 toTradeForErc20 = ERC20(toTradeTokenAddress);
    toTradeForErc20.transfer(sender, toTradeTokenAmount);
    (bool sent, bytes memory data) = _to.call{value: msg.value}("");
    (bool sent, bytes memory data) = payable(msg.sender).call{value: originalEthAmount}("");
    tradeEthForTokensArr[indexOfTrade].alreadyTraded = true;
  }
}
