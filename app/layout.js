import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Decentralized Energy Network',
	description: 'A decentralized energy network for the future',
};

const navItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Trade', href: '/trade' },
	{ name: 'Profile', href: '/profile' },
];

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className + 'relative w-full h-full'}>
				<header className='flex items-center justify-center'>
					<nav className='absolute flex items-center justify-center p-3 border w-[80%] border-gray-600 rounded-lg bg-opacity-45 top-4'>
						<ul className='flex gap-2'>
							{navItems.map((item) => (
								<li
									key={item.name}
									className='p-2 bg-opacity-50 rounded-lg hover:bg-gray-300 hover:text-gray-800'
								>
									<Link
										className='p-2 bg-opacity-50 rounded-lg hover:bg-gray-300 hover:text-gray-800'
										href={item.href}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</header>
				<div>{children}</div>
			</body>
		</html>
	);
}
