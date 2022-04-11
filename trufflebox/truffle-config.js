const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const fs = require('fs');
const mnemonic =  fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  // networks: {
  //   develop: {
  //     port: 8545
  //   }
  // },
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/3ee8defc27874a6a8b1c17134c522ebb")
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "^0.8.3"
    }
  }
};
