import * as nearAPI from "near-api-js";
import { getConfig } from "../config/config";
import { createContext, useContext } from "react";

export async function initialCrossword() {

    const nearConfig = getConfig("mainnet");

    // create a keyStore for signing transactions using the user's key
    // which is located in the browser local storage after user logs in
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

    // Initializing connection to the NEAR testnet
    const near = await nearAPI.connect({ keyStore, ...nearConfig });

    // Initialize wallet connection
    const walletConnection = new nearAPI.WalletConnection(near, null);

    return walletConnection;
}

export const WalletContext = createContext(undefined);

const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('The WalletContext has not been defined.');
    }
    return context;
};

export { useWallet };