const hre = require('hardhat');

async function main() {
	// const EnergyMarketPlace = await hre.ethers.getContractFactory(
	// 	'EnergyMarketplace'
	// );
	const energyMarketplace = await hre.ethers.deployContract(
		'EnergyMarketplace'
	);
	await energyMarketplace.waitForDeployment();
	console.log(energyMarketplace);
	console.log('EnergyMarketplace deployed to:', energyMarketplace.target);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
