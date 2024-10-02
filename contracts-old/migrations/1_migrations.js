var Dex = artifacts.require("Dex");
var TestToken1 = artifacts.require("TestToken1");
var TestToken2 = artifacts.require("TestToken2");

module.exports = function(deployer) {
  deployer.deploy(Dex);
  deployer.deploy(TestToken1, 1000000000);
  deployer.deploy(TestToken2, 1000000000);
};
