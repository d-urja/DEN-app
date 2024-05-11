import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Decentralized Energy Network',
	description: 'A decentralized energy network for the future',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<nav>
					<ul>
						<li>
							<Link href='/'>Home</Link>
						</li>
						<li>
							<Link href='/info'>Info</Link>
						</li>
					</ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
