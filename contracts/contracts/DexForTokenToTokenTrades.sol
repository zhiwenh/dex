// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexForTokenToTokenTrades {

  struct TradeTokensForTokens {
    address tradingTokenAddress;
    uint tradingTokenAmount;
    address tradingForTokenAddress;
    uint tradingForTokenAmount;
    bool alreadyTraded;
  }

  mapping(address => TradeTokensForTokens[]) public tradesOfTokensForTokensOfAnAddress;

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
          && tradeTokensForTokensArrForAddress[i].alreadyTraded == false) {
        totalAllowanceRequired = tradeTokensForTokensArrForAddress[i].tradingTokenAmount + totalAllowanceRequired;
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

}
