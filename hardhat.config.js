require('@nomicfoundation/hardhat-toolbox');
const fs = require('fs');

const privateKey = fs.readFileSync('.secret').toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: 'https://polygon-mumbai.infura.io/v3/519592b854de4d3e958d92c6c0a5d5a6',
			accounts: [privateKey],
		},
		mainnet: {
			url: 'https://polygon-mainnet.infura.io/v3/519592b854de4d3e958d92c6c0a5d5a6',
			accounts: [privateKey],
		},
	},
	solidity: '0.8.24',
};
