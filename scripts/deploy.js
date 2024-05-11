const hre = require('hardhat');

async function main() {
	const EnergyMarketPlace = await hre.ethers.getContractFactory(
		'EnergyMarketPlace'
	);
	const energyMarketPlace = await EnergyMarketPlace.deploy();
	await energyMarketPlace.waitForDeployment();
	console.log(energyMarketPlace);
	console.log('EnergyMarketplace deployed to:', energyMarketPlace.target);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
