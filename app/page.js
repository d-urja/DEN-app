'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { webSocketURL } from '@/config';

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [energySources, setEnergySources] = useState([]);

	// socket data
	const [socketConnection, setSocketConnection] = useState(null);
	const [data, setData] = useState(null);

	// init web socket
	useEffect(() => {
		const ws = new WebSocket(webSocketURL);
		ws.onopen = () => {
			console.log('WebSocket connected');
			console.log(ws);
			setSocketConnection(ws);
		};
		ws.onmessage = (message) => {
			const data = JSON.parse(message.data);
			setData(data);
		};
		return () => {
			ws.close();
		};
	}, []);

	const sendData = (data) => {
		socketConnection.send(JSON.stringify({ activateRelays: data }));
	};

	// buy/sell energy
	async function buyEnergy(energy) {}

	return (
		<main className='flex flex-col items-center justify-between min-h-screen p-24'>
			<div>
				<p>Hello</p>
			</div>
		</main>
	);
}
