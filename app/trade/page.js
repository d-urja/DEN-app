'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import Web3Modal from 'web3modal';

import { energyMarketAddress } from '../../config';

// import EnergyMarketPlace from '../../artifacts/contracts/EnergyMarketplace.sol/EnergyMarketplace.json';

export default function CreateItem() {
	const [formInput, updateFormInput] = useState({
		price: '',
		name: '',
		description: '',
	});

	const router = useRouter();

	async function mintEnergy() {
		const { name, description, price } = formInput;
		if (!name || !description || !price) return;

		// Connect to the Ethereum network via Web3Modal
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.BrowserProvider(connection);
		const signer = provider.getSigner();

		// Deploy or connect to your EnergyMarketplace contract
		const contract = new ethers.Contract(
			energyMarketAddress,
			EnergyMarketPlace.abi,
			signer
		);

		try {
			// Mint a new energy token with the provided metadata
			const transaction = await contract.createToken(name, description, price);
			await transaction.wait();

			// Show feedback to the user that the minting was successful
			console.log('Energy minted successfully!');
		} catch (error) {
			console.error('Error minting energy:', error);
		}
	}

	async function listForSale() {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.BrowserProvider(connection);
		const signer = provider.getSigner();

		/* next, create the item */
		const price = ethers.parseUnits(formInput.price, 'ether');
		let contract = new ethers.Contract(
			energyMarketAddress,
			EnergyMarketPlace.abi,
			signer
		);
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();
		let transaction = await contract.createToken(price, {
			value: listingPrice,
		});
		await transaction.wait();

		router.push('/');
	}

	return (
		<div className='flex flex-col items-center justify-center mt-28 item-center'>
			{/* display the potential suppliers */}
			<div className='flex flex-col items-center justify-center w-full gap-4'>
				{/* listed trades */}
				<h1 className='text-xl font-semibold'>Listed Trades</h1>
				{/* Current Trades */}
				<div className='flex items-center justify-between w-1/2 p-2 text-black bg-white border border-gray-300 rounded-lg'>
					<div className='w-[80%]'>
						<h2>User1</h2>
					</div>
					<div className='flex items-center'>
						<div className='mr-8'>
							<p className='text-gray-500'>10</p>
						</div>
						<div className='flex items-center text-center rounded-lg'>
							<button className='w-full px-5 py-2 text-white bg-red-500 rounded-lg'>
								Sell
							</button>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-between w-1/2 p-2 text-black bg-white border border-gray-300 rounded-lg'>
					<div className='w-[80%]'>
						<h2>User2</h2>
					</div>
					<div className='flex items-center'>
						<div className='mr-8'>
							<p className='text-gray-500'>15</p>
						</div>
						<div className='flex items-center text-center rounded-lg'>
							<button className='w-full px-5 py-2 text-white bg-green-500 rounded-lg'>
								Buy
							</button>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-between w-1/2 p-2 text-black bg-white border border-gray-300 rounded-lg'>
					<div className='w-[80%]'>
						<h2>User3</h2>
					</div>
					<div className='flex items-center'>
						<div className='mr-8'>
							<p className='text-gray-500'>12</p>
						</div>
						<div className='flex items-center text-center rounded-lg'>
							<button className='w-full px-5 py-2 text-white bg-green-500 rounded-lg'>
								Buy
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* forms */}
			<h1 className='mt-8 text-xl font-semibold'>Place an order</h1>

			<div className='flex flex-col w-1/2 pb-12 dark:text-black'>
				<input
					placeholder='Token Id'
					className='p-4 mt-8 border rounded'
					onChange={(e) =>
						updateFormInput({ ...formInput, name: e.target.value })
					}
				/>
				<input
					placeholder='Energy Price in Eth'
					className='p-4 mt-2 border rounded'
					type='number'
					onChange={(e) =>
						updateFormInput({ ...formInput, description: e.target.value })
					}
				/>
				<input
					placeholder='Energy Type'
					className='p-4 mt-2 border rounded'
					onChange={(e) =>
						updateFormInput({ ...formInput, price: e.target.value })
					}
				/>
				<div className='flex w-full gap-4'>
					<button
						onClick={mintEnergy}
						className='flex-1 p-4 mt-4 font-bold text-white bg-green-500 rounded-lg shadow-lg'
					>
						Buy
					</button>
					<button className='flex-1 p-4 mt-4 font-bold text-white bg-red-500 rounded-lg shadow-lg'>
						Sell
					</button>
				</div>
			</div>
		</div>
	);
}
