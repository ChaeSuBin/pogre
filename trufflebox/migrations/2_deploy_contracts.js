var CoinDispencer = artifacts.require("./CoinDispencer.sol");
var ThreItems = artifacts.require("./ThreItems.sol");

module.exports = function(deployer) {
  deployer.deploy(CoinDispencer);
  deployer.deploy(ThreItems);
};
