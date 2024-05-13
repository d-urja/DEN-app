'use client';

import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { providers } from 'ethers';

// import { energyMarketAddress, webSocketURL } from '../config';
// import EnergyMarketPlace from '../artifacts/contracts/EnergyMarketPlace.sol/EnergyMarketPlace.json';

export default function Home() {
	const [solarInfo, setSolarInfo] = useState({
		voltage: 0,
		current: 0,
		power: 0,
	});

	// randomly generate the solar info
	useEffect(() => {
		const interval = setInterval(() => {
			let newvoltage =
				Math.round((Math.random() * (3.5 - 2) + 2) * 1000) / 1000;

			let newcurrent = Math.random() * (3.5 - 2.5);
			setSolarInfo({
				voltage: newvoltage,
				current: newcurrent,
				power: Math.round(newvoltage * newcurrent) / 1000,
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<main className='flex flex-col items-center w-full min-h-screen mt-24'>
			<div className='w-4/5'>
				<h1 className='text-lg font-bold'>Solar Status</h1>
				<div className='flex w-full gap-8 mt-4 text-black'>
					{/* Current status */}
					{/* from the solar */}
					<div className='w-1/3 p-4 text-white bg-gray-800 rounded-lg'>
						<h1>Voltage (V)</h1>
						{/* generate 2-3.5 volatage randomly upto 3 decimal point */}
						<p>{solarInfo.voltage}</p>
					</div>
					<div className='w-1/3 p-4 text-white bg-gray-800 rounded-lg'>
						<h1>Current (mAh)</h1>
						{/* generate 2-3.5 current randomly upto 3 decimal point */}
						<p>{solarInfo.current}</p>
					</div>
					<div className='w-1/3 p-4 text-white bg-gray-800 rounded-lg'>
						<h1>Power (kWh)</h1>
						{/* calculate power = voltage * current */}
						<p>{solarInfo.power}</p>
					</div>
				</div>
			</div>
		</main>
	);
}
