import type { Metadata } from 'next';
import './globals.scss';
import styles from '../src/styles/layout.module.scss'
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import logo from '../src/assets/zKubeLogo.svg';
import { Web3Provider } from '../src/providers/Web3Provider';
import { ConnectButton } from '../src/components/ConnectButton';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'zKubes',
  description: 'Zero-Knowledge Cube Composer game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Web3Provider>
        <body className={roboto.className}>
          <header className={styles.header}>
            <Image src={logo} alt="logo" className={styles.logo} />
            <div className={styles.connectButton}>
              <ConnectButton />
            </div>
          </header>
          {children}
        </body>
      </Web3Provider>
    </html>
  );
}
