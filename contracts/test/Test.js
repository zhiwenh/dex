const Dex = artifacts.require("Dex");
const TestToken1 = artifacts.require("TestToken1");
const TestToken2 = artifacts.require("TestToken2");

contract("Dex", (accounts) => {
  it("should send 10000 test tokens 1 to second account", async () => {
    const testToken1Instance = await TestToken1.deployed();
    await testToken1Instance.transfer(accounts[1], 10000, {from: accounts[0]})

    const balance = await testToken1Instance.balanceOf(accounts[1]);

    assert.equal(balance, 10000, "10000 is in first account");
  });

  it("should send 10000 test tokens 2 to third account", async () => {
    const testToken2Instance = await TestToken2.deployed();
    await testToken2Instance.transfer(accounts[2], 10000, {from: accounts[0]})

    const balance = await testToken2Instance.balanceOf(accounts[2]);

    assert.equal(balance, 10000, "10000 is in second account");
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

    const tradesForTokensWithTokens = await dexInstance.getTradesForTokenWithToken();

    console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const allowance2 = await testToken1Instance.allowance(accounts[1], dexInstance.address);
    assert.equal(tradesForTokensWithTokens[0].sender, accounts[1], "Account 2 placed order");
    assert.equal(allowance2.toNumber(), 1100, "Dex has to be approved for the right amount of tokens");
  });

  it("the dex shouldn't make one more trade more than allowance expect to revert", async () => {
    const dexInstance = await Dex.deployed();
    const testToken1Instance = await TestToken1.deployed();
    const testToken2Instance = await TestToken2.deployed();

    await dexInstance.addTokensToDexForTradeWithOtherTokens(
      testToken1Instance.address,
      10,
      testToken2Instance.address,
      10,
      {from: accounts[1]}
    );

    console.log('allowance of dex contract', allowance.toNumber());

    const tradesForTokensWithTokens = await dexInstance.getTradesForTokenWithToken();

    console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const allowance2 = await testToken1Instance.allowance(accounts[1], dexInstance.address);
    assert.equal(tradesForTokensWithTokens[0].sender, accounts[1], "Account 2 placed order");
    assert.equal(allowance2.toNumber(), 1100, "Dex has to be approved for the right amount of tokens");
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

    let tradesForTokensWithTokens = await dexInstance.getTradesForTokenWithToken();

    console.log('trades for tokens with tokens before token trade', tradesForTokensWithTokens);

    await testToken2Instance.approve(dexInstance.address, 10, {from: accounts[2]});

    await dexInstance.buyTokensFromOtherTokens(accounts[1], 0, {from: accounts[2]});

    tradesForTokensWithTokens = await dexInstance.getTradesForTokenWithToken();
    //
    console.log('trades for tokens with tokens', tradesForTokensWithTokens);

    const balanceOfAccount3 = await testToken1Instance.balanceOf(accounts[2]);

    const tradesForTokensWithTokens2 = await dexInstance.getTradesForTokenWithToken();

    console.log('trades of tokens', tradesForTokensWithTokens2);

    console.log('balance of 3 of token 1', balanceOfAccount3.toNumber());
    // assert.equal(tradesForTokensWithTokens[0].sender, accounts[1], "Account 2 placed order");
  });

});
