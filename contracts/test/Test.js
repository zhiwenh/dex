const Dex = artifacts.require("Dex");
const TestToken1 = artifacts.require("TestToken1");
const TestToken2 = artifacts.require("TestToken2");

contract("Dex", (accounts) => {
  it("should send 10000 test tokens 1 to second account", async () => {
    const testToken1Instance = await TestToken1.deployed();
    await testToken1Instance.transfer(accounts[1], 100000, {from: accounts[0]})

    await testToken1Instance.transfer(accounts[3], 100000, {from: accounts[0]})

    const balance = await testToken1Instance.balanceOf(accounts[1]);

    assert.equal(balance, 100000, "100000 is in first account");
  });

  it("should send 10000 test tokens 2 to third account", async () => {
    const testToken2Instance = await TestToken2.deployed();
    await testToken2Instance.transfer(accounts[2], 100000, {from: accounts[0]})
    await testToken2Instance.transfer(accounts[4], 100000, {from: accounts[0]})

    const balance = await testToken2Instance.balanceOf(accounts[2]);

    assert.equal(balance, 100000, "100000 is in second account");
  });

  // address tradingTokenAddress,
  // uint tradingTokenAmount,
  // address tradingForTokenAddress,
  // uint tradingForTokenAmount

  it("should have the second user place a token for token order on dex", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken1Instance.approve(dexInstance.address, 1100, {from: accounts[1]});

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      1000,
      testToken2Instance.address,
      10,
      {from: accounts[1]}
    );

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      100,
      testToken2Instance.address,
      11,
      {from: accounts[1]}
    );

    console.log('account 2', accounts[1]);
    const allowance = await testToken1Instance.allowance(accounts[1], dexInstance.address);

    console.log('allowance of dex contract', allowance.toNumber());

    const dexUsers = await dexInstance.getDexUsers();

    console.log('dex users', dexUsers);

    // const tradesForTokensWithTokens = await dexInstance.getAllTrades();

    // console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const allowance2 = await testToken1Instance.allowance(accounts[1], dexInstance.address);
    // assert.equal(tradesForTokensWithTokens.tradeTokensForTokensForCall[0].sender, accounts[1], "Account 2 placed order");
    assert.equal(allowance2.toNumber(), 1100, "Dex has to be approved for the right amount of tokens");
  });

  it("the dex shouldn't make one more trade more than allowance expect to revert", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    let err;

    try {
      await dexInstance.addTokensToDexForTradeWithOtherTokens(
        testToken1Instance.address,
        10,
        testToken2Instance.address,
        10,
        {from: accounts[1]}
      );
    } catch (error) {
      err = error;
      console.log('error', error)
    }

    assert(err !== undefined, 'Error should be there');
  });

  it("should create a trade and then have account 3 make the trade", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken1Instance.approve(dexInstance.address, 2100, {from: accounts[1]});

    const allowance2 = await testToken1Instance.allowance(accounts[1], dexInstance.address);

    console.log('allowance of dex', allowance2.toNumber());

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      1000,
      testToken2Instance.address,
      10,
      {from: accounts[1]}
    );

    const allowance = await testToken1Instance.allowance(accounts[1], dexInstance.address);

    console.log('allowance of dex contract', allowance.toNumber());

    // let tradesForTokensWithTokens = await dexInstance.getAllTrades();

    // console.log('trades for tokens with tokens before token trade', tradesForTokensWithTokens);

    await testToken2Instance.approve(dexInstance.address, 10, {from: accounts[2]});

    await dexInstance.buyTokensFromOtherTokens(accounts[1], 0, {from: accounts[2]});

    // tradesForTokensWithTokens = await dexInstance.getAllTrades();
    //
    // console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const balanceOfAccount3 = await testToken1Instance.balanceOf(accounts[2]);

    // const tradesForTokensWithTokens2 = await dexInstance.getAllTrades();

    // console.log('trades of tokens', tradesForTokensWithTokens2);

    console.log('balance of 3 of token 1', balanceOfAccount3.toNumber());
    assert.equal(balanceOfAccount3, 1000, "Account 3 has 1000 tokens");
  });

  it("should have the 4th user place a token for token order on dex", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken1Instance.approve(dexInstance.address, 2100, {from: accounts[3]});

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      1000,
      testToken2Instance.address,
      10,
      {from: accounts[3]}
    );

    const allowance = await testToken1Instance.allowance(accounts[3], dexInstance.address);

    console.log('allowance of dex contract', allowance.toNumber());

    const dexUsers = await dexInstance.getDexUsers();

    console.log('dex users', dexUsers);

    // const tradesForTokensWithTokens = await dexInstance.getAllTrades();

    // console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const allowance2 = await testToken1Instance.allowance(accounts[3], dexInstance.address);

    // assert.equal(tradesForTokensWithTokens.tradeTokensForTokensForCall[3].sender, accounts[3], "Account 2 placed order");
    assert.equal(allowance2.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should have account 5 make the trade", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    const allowance = await testToken1Instance.allowance(accounts[4], dexInstance.address);

    console.log('allowance of dex contract', allowance.toNumber());

    // let tradesForTokensWithTokens = await dexInstance.getAllTrades();

    // console.log('trades for tokens with tokens before token trade', tradesForTokensWithTokens);

    await testToken2Instance.approve(dexInstance.address, 10, {from: accounts[4]});

    await dexInstance.buyTokensFromOtherTokens(accounts[3], 0, {from: accounts[4]});

    // tradesForTokensWithTokens = await dexInstance.getAllTrades();
    //
    // console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const balanceOfAccount5 = await testToken1Instance.balanceOf(accounts[4]);

    // const tradesForTokensWithTokens2 = await dexInstance.getAllTrades();

    // console.log('trades of tokens', tradesForTokensWithTokens2);

    console.log('balance of 5 of token 1', balanceOfAccount5.toNumber());
    // assert.equal(tradesForTokensWithTokens[0].sender, accounts[1], "Account 2 placed order");
  });

  it("should have the 2nd user place an order for token for eth", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken1Instance.approve(dexInstance.address, 2100, {from: accounts[1]});

    await dexInstance.addTokensToDexForTradeWithEth(
      testToken1Instance.address,
      1000,
      BigInt(1000000000000000000),
      {from: accounts[1]}
    );

    const allowance = await testToken1Instance.allowance(accounts[1], dexInstance.address);

    console.log('allowance of dex contract', allowance.toNumber());

    // const tradesForTokensWithEth = await dexInstance.getAllTrades();

    // console.log('trades for tokens with eth', tradesForTokensWithEth);

    // assert.equal(tradesForTokensWithEth.tradeTokensForEthForCall[0].sender, accounts[1], "Account 1 placed order");
    assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should have the 3rd user make the order for tokens for eth", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await dexInstance.buyTokensForEth(
      accounts[1],
      0,
      {from: accounts[2], value: 1000000000000000000
    });

    // const tradesForTokensWithEth = await dexInstance.getAllTrades();

    const balanceOf3rdAccount = await testToken1Instance.balanceOf(accounts[2]);

    console.log('token balance of 3rd account', balanceOf3rdAccount.toNumber());

    const ethBalanceOfAccount2 = await web3.eth.getBalance(accounts[1])
    console.log('eth balance of 2nd account', ethBalanceOfAccount2);

    const ethBalanceOfAccount3 = await web3.eth.getBalance(accounts[2])
    console.log('eth balance of 3nd account', ethBalanceOfAccount3);

    // console.log('trades for tokens with eth', tradesForTokensWithEth);

    assert.equal(balanceOf3rdAccount, 2000, "Token balance of account 3 is 2000");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should create an order for eth for tokens", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await dexInstance.addEthToDexForTradeWithTokens(
      BigInt(1000000000000000000),
      testToken2Instance.address,
      100,
      {from: accounts[1], value: 1000000000000000000}
    );

    const balanceOfDexContract = await web3.eth.getBalance(dexInstance.address);

    console.log('balance of dex contract', balanceOfDexContract);

    // const allTrades = await dexInstance.getAllTrades();

    const ethBalanceOfAccount2 = await web3.eth.getBalance(accounts[1])
    console.log('eth balance of 2nd account', ethBalanceOfAccount2);

    const ethBalanceOfAccount3 = await web3.eth.getBalance(accounts[2])
    console.log('eth balance of 3nd account', ethBalanceOfAccount3);

    // console.log('trades for eth with tokens', allTrades);

    // assert.equal(allTrades.tradeEthForTokensForCall[0].sender, accounts[1], "Account 1 placed order");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should create an order for eth for tokens", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken2Instance.approve(dexInstance.address, 100, {from: accounts[2]});

    await dexInstance.buyEthForTokens(accounts[1], 0, {from: accounts[2]});

    // const tradesForEthWithTokens = await dexInstance.getAllTrades();

    const ethBalanceOfAccount2 = await web3.eth.getBalance(accounts[1])
    console.log('eth balance of 2nd account', ethBalanceOfAccount2);

    const ethBalanceOfAccount3 = await web3.eth.getBalance(accounts[2])
    console.log('eth balance of 3nd account', ethBalanceOfAccount3);

    // console.log('trades for eth with tokens', tradesForEthWithTokens);

    const dexUsers = await dexInstance.getDexUsers();

    console.log('dex users', dexUsers);

    console.log('account 2', accounts[1]);

    console.log('account 4', accounts[3]);

    const balanceOfDexContract = await web3.eth.getBalance(dexInstance.address);

    console.log('balance of dex contract', balanceOfDexContract);

    const account2Token2Amount = await testToken2Instance.balanceOf(accounts[1]);

    assert.equal(account2Token2Amount.toNumber(), 110, "Account 2 should have a token 2 balance of 100");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should get all the trades of an address", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    const allTradesOfAccount2 = await dexInstance.getAllTradesOfAccount(accounts[1]);

    console.log('All trades of account 2', allTradesOfAccount2);

    assert.equal(allTradesOfAccount2.tradeTokensForTokensForCall[0].sender, accounts[1], "Account 2 should be the sender");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should get all the trades", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    // const allTrades = await dexInstance.getAllTrades();

    // console.log('All trades', allTrades);

    // assert.equal(allTrades.tradeTokensForTokensForCall[0].sender, accounts[1], "Account 2 should be the sender");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should cancel trades", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await dexInstance.cancelTradeForTokensWithTokens(accounts[1], 1, {from: accounts[1]});

    await testToken1Instance.approve(dexInstance.address, 2000, {from: accounts[1]});

    await dexInstance.addTokensToDexForTradeWithEth(
      testToken1Instance.address,
      1000,
      BigInt(1000000000000000000),
      {from: accounts[1]}
    );

    await dexInstance.cancelTradeForTokensWithEth(accounts[1], 1, {from: accounts[1]});

    await dexInstance.addEthToDexForTradeWithTokens(
      BigInt(1000000000000000000),
      testToken2Instance.address,
      100,
      {from: accounts[1], value: 1000000000000000000}
    );

    const balanceBeforeCancelOfAccount2 = await web3.eth.getBalance(accounts[1]);

    console.log('balance of account 2 before cancel', balanceBeforeCancelOfAccount2);

    await dexInstance.cancelTradeForEthWithTokens(accounts[1], 1, {from: accounts[1]});

    const balanceAfterCancelOfAccount2 = await web3.eth.getBalance(accounts[1]);

    console.log('balance of account 2 after cancel', balanceAfterCancelOfAccount2);

    // const allTrades = await dexInstance.getAllTrades();

    // console.log('All trades', allTrades);

    // assert.equal(allTrades.tradeTokensForTokensForCall[1].alreadyTraded, true, "Already traded for trade should be true");

    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });

  it("should add more trades", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await testToken1Instance.approve(dexInstance.address, 10000, {from: accounts[1]});

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      1000,
      testToken2Instance.address,
      1000,
      {from: accounts[1]}
    );

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      500,
      testToken2Instance.address,
      100,
      {from: accounts[1]}
    );

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      600,
      testToken2Instance.address,
      100,
      {from: accounts[1]}
    );

    await testToken2Instance.approve(dexInstance.address, 10000, {from: accounts[4]});

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken2Instance.address,
      600,
      testToken1Instance.address,
      100,
      {from: accounts[4]}
    );

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken2Instance.address,
      1000,
      testToken1Instance.address,
      300,
      {from: accounts[4]}
    );

    await testToken1Instance.approve(dexInstance.address, 10000, {from: accounts[3]});

    await dexInstance.addTokensToDexForTradeWithEth(
      testToken1Instance.address,
      3000,
      BigInt(1000000000000000000),
      {from: accounts[3]}
    );

    await dexInstance.addTokensToDexForTradeWithEth(
      testToken1Instance.address,
      5000,
      BigInt(2000000000000000000),
      {from: accounts[3]}
    );

    await dexInstance.addEthToDexForTradeWithTokens(
      BigInt(1000000000000000000),
      testToken2Instance.address,
      100,
      {from: accounts[4], value: 1000000000000000000}
    );

    await dexInstance.addEthToDexForTradeWithTokens(
      BigInt(1000000000000000000),
      testToken1Instance.address,
      100,
      {from: accounts[4], value: 1000000000000000000}
    );

    console.log('dex instance address', dexInstance.address);
    console.log('test token 1 address', testToken1Instance.address);
    console.log('test token 2 address', testToken2Instance.address);

    // const allTrades = await dexInstance.getAllTrades();

    // console.log('All trades', allTrades);

    // assert.equal(allTrades.tradeTokensForTokensForCall[0].sender, accounts[1], "Account 2 should be the sender");
    // assert.equal(allowance.toNumber(), 2100, "Dex has to be approved for the right amount of tokens");
  });
});
