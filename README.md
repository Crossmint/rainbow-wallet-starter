# Rainbowkit integration for Crossmint

Use [Crossmint](https://www.crossmint.com) with [Rainbowkit](https://www.rainbowkit.com/) to create or link crypto wallets with your website or dApp.

## Instructions: Integrate Crossmint into your existing Rainbowkit deployment

1. Copy the Crossmint Rainbowkit wallet connector [source code](https://github.com/Crossmint/rainbow-wallet-starter/blob/main/connectors/CrossmintConnector.tsx) into your project. Note: at this time we haven't deployed it yet to NPM so you must copy and paste the code you see here in your own project.

2. Follow the example on [`_app.tsx`](https://github.com/Crossmint/rainbow-wallet-starter/blob/main/pages/_app.tsx) to integrate the Crossmint connector in your rainbowkit dialog.


## Instructions: Build and demo this sample project

You don't need to do this in order to integrate, but if you just want to demo a sample project with Crossmint integrated via Rainbowkit, you can follow the instructions below:


This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

### Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Learn More

To learn more about this stack, take a look at the following resources:

- [Crossmint Documentation](https://docs.crossmint.com/docs) - Learn how to use Crossmint to make it easy to integrate NFT wallets, minting and payments into your app.
- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

