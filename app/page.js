'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { energyMarketAddress } from '../config';
// import EnergyMarketPlace from '../artifacts/contracts/EnergyMarketplace.sol/EnergyMarketplace.json';
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

export default function Home() {
	const [nfts, setNfts] = useState([]);
	const [loadingState, setLoadingState] = useState(true);
	useEffect(() => {
		loadNFTs();
	}, []);
	async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		const provider = new ethers.providers.JsonRpcProvider();
		const contract = new ethers.Contract(
			marketplaceAddress,
			NFTMarketplace.abi,
			provider
		);
		const data = await contract.fetchMarketItems();

		/*
		 *  map over items returned from smart contract and format
		 *  them as well as fetch their token metadata
		 */
		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await contract.tokenURI(i.tokenId);
				const meta = await axios.get(tokenUri);
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
				};
				return item;
			})
		);
		setNfts(items);
		setLoadingState('true');
	}
	async function buyNft(nft) {
		/* needs the user to sign the transaction, so will use Web3Provider and sign it */
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			marketplaceAddress,
			NFTMarketplace.abi,
			signer
		);

		/* user will be prompted to pay the asking proces to complete the transaction */
		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
		const transaction = await contract.createMarketSale(nft.tokenId, {
			value: price,
		});
		await transaction.wait();
		loadNFTs();
	}

	useEffect(() => {
		loadNFTs();
	}, []);

	if (loadingState) {
		return (
			<main className='flex flex-col items-center justify-between min-h-screen p-24'>
				<div>
					<p>Loading...</p>
				</div>
			</main>
		);
	}

	return (
		<main className='flex flex-col items-center justify-between min-h-screen p-24'>
			<div>
				<p>{JSON.stringify(nfts)}</p>
			</div>
		</main>
	);
}
