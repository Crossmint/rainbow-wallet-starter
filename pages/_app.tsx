import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { crossmintRainbowWallet } from "../connectors/CrossmintConnector";

import {
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai],
  [publicProvider()]
);

export const connectors = connectorsForWallets([
  {
    groupName: "Pay with Credit Card",
    wallets: [
      crossmintRainbowWallet({
        chainId: 5,
        provider,
      }),
    ],
  },
  {
    groupName: "Pay with Crypto",
    wallets: [
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),
      injectedWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
