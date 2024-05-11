'use client';

import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { providers } from 'ethers';

import { energyMarketAddress, webSocketURL } from '../config';
// import EnergyMarketPlace from '../artifacts/contracts/EnergyMarketplace.sol/EnergyMarketplace.json';
import EnergyMarketPlace from '../artifacts/contracts/EnergyMarketPlace.sol/EnergyMarketPlace.json';

export default function Home() {
	const [energyTokens, setEnergyTokens] = useState([]);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);

	const [socketConnection, setSocketConnection] = useState(null);
	// init web socket
	const ws = new WebSocket(webSocketURL);
	useEffect(() => {
		ws.onopen = () => {
			console.log('WebSocket connected');
			console.log(ws);
			setSocketConnection(ws);
		};
		ws.onmessage = (message) => {
			const data = JSON.parse(message.data);
			console.log(data);
			setData(data);
		};
		return () => {
			ws.close();
		};
	}, []);

	const sendData = (data) => {
		socketConnection.send(JSON.stringify({ activateRelays: data }));
	};

	if (loading) {
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
				<button onClick={() => sendData('0000')}>on</button>
				<button onClick={() => sendData('1111')}>turnOff</button>
			</div>
			<div>{}</div>
		</main>
	);
}
