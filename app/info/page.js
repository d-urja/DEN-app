'use client';

import { useEffect, useState } from 'react';

import { webSocketURL } from '@/config';

export default function InfoPage() {
	const [socketConnection, setSocketConnection] = useState(null);
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

	return (
		<main className='flex flex-col items-center justify-between min-h-screen p-24'>
			{socketConnection != 'null' ? (
				<p>Sensors not detected</p>
			) : (
				<div>
					<p>Sensors connection successfull</p>
					<p>{JSON.stringify(data, null, 2)}</p>
					<div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
					<div className='w-full h-32'>
						<button onClick={() => sendData('00')}>Turn on</button>
					</div>
				</div>
			)}
		</main>
	);
}
