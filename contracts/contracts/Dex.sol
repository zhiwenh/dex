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
    uint valueOfTokensToTrade) public {
    ERC20 erc20 = ERC20(_erc20Address);
    erc20.approve(address(this), value);
    require(msg.value === ethAmount);
    tradeEthForTokensArr.push(
      TradeEthForTokens(
        msg.sender,
        ethAmount,
        _erc20Address,
        valueOfTokensToTrade,
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
    ERC20 mtoTradeForErc20 = ERC20(toTradeTokenAddress);
    toTradeForErc20.transfer(sender, toTradeTokenAmount);
    payable(msg.sender).transfer(originalEthAmount);
    tradeEthForTokensArr[indexOfTrade].alreadyTraded = true;
  }
}
