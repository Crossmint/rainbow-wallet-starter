import {
  BlockchainTypes,
  CrossmintEnvironment,
  CrossmintEVMWalletAdapter,
} from "@crossmint/connect";
import { Wallet } from "@rainbow-me/rainbowkit";
import { Bytes, Signer } from "ethers";
import { Address, configureChains, Connector, ConnectorData } from "wagmi";

// Add your own string identifier for your project. You don't need to register this string anywhere, but it may be helpful when interacting with Crossmint support
export const CROSSMINT_UNIQUE_KEY = "KEY_UNIQUE_TO_YOUR_PROJECT";

export type GetProviderType = ReturnType<typeof configureChains>["provider"];

export interface CrossmintRainbowWalletProps {
  chainId: number;
  provider: ReturnType<typeof configureChains>["provider"];
}

export const crossmintRainbowWallet = ({
  chainId,
  provider,
}: CrossmintRainbowWalletProps): Wallet => ({
  id: "crossmintWallet",
  name: "Crossmint",
  iconUrl: "https://www.crossmint.com/assets/crossmint/logo.svg",
  iconBackground: "#000000",
  installed: true,
  hidden: () => false,
  createConnector: () => {
    const connector = new CrossmintConnector({
      options: {
        provider,
        chainId,
      },
    });
    return {
      connector,
    };
  },
});

const chainIdToCrossmintEnvironmentConfig = (
  chainId: number
): {
  environment: CrossmintEnvironment;
  blockchain: BlockchainTypes.ETHEREUM | BlockchainTypes.POLYGON; // TODO: BSC
} => {
  switch (chainId) {
    case 1:
      return {
        environment: CrossmintEnvironment.PROD,
        blockchain: BlockchainTypes.ETHEREUM,
      };
    case 5:
      return {
        environment: CrossmintEnvironment.STAGING,
        blockchain: BlockchainTypes.ETHEREUM,
      };
    case 137:
      return {
        environment: CrossmintEnvironment.PROD,
        blockchain: BlockchainTypes.POLYGON,
      };
    case 80001:
      return {
        environment: CrossmintEnvironment.STAGING,
        blockchain: BlockchainTypes.POLYGON,
      };
    default:
      throw new Error(`Unsupported chainId ${chainId}`);
  }
};

const chainIdToCrossmintAdapter = (
  chainId: number
): CrossmintEVMWalletAdapter => {
  const { environment, blockchain } =
    chainIdToCrossmintEnvironmentConfig(chainId);
  return new CrossmintEVMWalletAdapter({
    apiKey: CROSSMINT_UNIQUE_KEY,
    environment,
    chain: blockchain,
  });
};

interface ConnectorConfigParam {
  chainId?: number;
}

class CrossmintSigner extends Signer {
  private _address: string;
  private crossmintAdapter: CrossmintEVMWalletAdapter;

  constructor(address: string, crossmintAdapter: CrossmintEVMWalletAdapter) {
    super();

    this._address = address;
    this.crossmintAdapter = crossmintAdapter;
  }

  connect(provider: Signer["provider"]): CrossmintSigner {
    throw new Error("CrossmintSigner.connect() not supported");
  }

  async getAddress() {
    return this._address;
  }

  async signMessage(message: Bytes | string) {
    const signature = await this.crossmintAdapter.signMessage(
      message as string
    );
    return signature;
  }

  async signTransaction(): Promise<string> {
    throw new Error("CrossmintSigner.signTransaction() not supported");
  }
}

export interface CrossmintConnectorCtorProps
  extends ConstructorParameters<typeof Connector> {}

export class CrossmintConnector extends Connector {
  readonly id = "crossmintWallet";
  readonly name = "Crossmint";
  readonly ready = true;

  private crossmintAdapter: CrossmintEVMWalletAdapter;
  private provider: GetProviderType;
  private signer?: CrossmintSigner;
  private address?: Address;
  private chainId: number;
  private isCrossmintAuthorized: boolean;

  constructor(config: {
    options: {
      provider: GetProviderType;
      chainId: number;
    };
  }) {
    super(config);

    this.chainId = config.options.chainId;
    this.crossmintAdapter = chainIdToCrossmintAdapter(this.chainId);

    this.provider = config.options.provider;
    this.isCrossmintAuthorized = false;
  }

  async getProvider(config?: ConnectorConfigParam) {
    console.log("Crossmint getProvider");
    return this.provider({ chainId: this.chainId });
  }

  override async connect(
    config?: ConnectorConfigParam
  ): Promise<Required<ConnectorData>> {
    console.log("Connecting to Crossmint...");

    if (config?.chainId) {
      console.warn("Crossmint chainId changed:", config.chainId);
      this.chainId = config.chainId;
      this.crossmintAdapter = chainIdToCrossmintAdapter(this.chainId);
    }

    try {
      const address = await this.crossmintAdapter.connect();
      if (!address) {
        throw new Error("Crossmint connect error: address is undefined");
      }

      console.log("Crossmint connected:", address);
      this.isCrossmintAuthorized = true;
      this.address = address as Address;
      this.signer = new CrossmintSigner(address, this.crossmintAdapter);

      return {
        account: this.address,
        chain: {
          id: this.chainId,
          unsupported: false,
        },
        provider: this.provider({ chainId: this.chainId }),
      };
    } catch (error) {
      console.log(`Crossmint connect error: `, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.crossmintAdapter.disconnect();
    this.address = undefined;
  }

  async getAccount() {
    if (!this.address) {
      throw new Error("Crossmint account not found. Call connect() first.");
    }
    return this.address;
  }

  async getChainId() {
    return this.chainId;
  }

  async getSigner() {
    if (!this.signer) {
      throw new Error("Signer not found");
    }
    return this.signer;
  }

  async isAuthorized(): Promise<boolean> {
    return this.isCrossmintAuthorized;
  }

  async onAccountsChanged(accounts: string[]): Promise<void> {}
  async onChainChanged(chain: number | string): Promise<void> {}
  async onDisconnect(error: Error): Promise<void> {}
}
