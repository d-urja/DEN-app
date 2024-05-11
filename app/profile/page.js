'use client';

import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

export default function ProfilePage() {
	const [address, setAddress] = useState('');

	useEffect(() => {
		async function fetchAddress() {
			const web3Modal = new Web3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const accounts = await signer.getAddress();
			setAddress(accounts[0]);
		}

		fetchAddress();
	}, []);

	return (
		<main className='flex flex-col items-center justify-between min-h-screen p-24 mt-16'>
			{/* Display the user's address */}
			<div>User Address: {address}</div>
		</main>
	);
}
