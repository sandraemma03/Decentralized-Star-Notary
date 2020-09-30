/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   rinkeby: {
//     host: "localhost",
//     port: 8545,
//     network_id: "4", // Rinkeby ID 4
//     from: "0xf78f54207fa70948dfff6cd90607f7ac8c59cac5", // account from which to deploy
//     gas: 6712390
//    }
// };

var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'easy attack extra urban lab patch water brisk clutch mansion trigger vocal';
var rinkebyAddress = 'https://rinkeby.infura.io/v3/b408752907754506a0caadadfd23cf4f'

module.exports = {
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, rinkebyAddress) 
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};

