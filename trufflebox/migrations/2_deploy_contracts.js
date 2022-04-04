const CoinDispencer = artifacts.require("./CoinDispencer.sol");
const ThreItems = artifacts.require("./ThreItems.sol");
const ToknBridg = artifacts.require("./ToknBridge.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CoinDispencer);
  await deployer.deploy(ThreItems);

  // const erc20 = CoinDispencer.address;
  // const erc721 = ThreItems.address;
  //console.log(ThreItems.address);

  await deployer.deploy(ToknBridg, CoinDispencer.address, ThreItems.address);

  console.log(CoinDispencer.address);
  console.log(ThreItems.address);
};
