'use client';

import React, { useEffect, useState } from 'react';
import web3Modal from 'web3modal';

export default function ProfilePage() {
	const [address, setAddress] = useState('');

	// connect the metamask wallet
	const connectWallet = async () => {
		const web3Modal = new web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.BrowserProvider(connection);
		const signer = provider.getSigner();

		setAddress(await signer.getAddress());
	};

	return (
		<main className='flex flex-col items-center min-h-screen p-24 mt-16'>
			{/* Display the user's address */}
			<div>User Address: {address ? address : ''}</div>
			<div className='mt-8'>
				<button
					className='p-3 text-black bg-white border rounded-lg'
					onClick={() => connectWallet}
				>
					Connect Wallet
				</button>
			</div>
		</main>
	);
}
