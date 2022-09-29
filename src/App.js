import React, { lazy, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { initialCrossword, WalletContext } from "./contexts/accounts";

import { Routes, Route } from "react-router-dom";
import Loadable from './utils/loadable'

import { Buffer } from "buffer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const Layout = Loadable(lazy(() => import("./component/Layout")));
const NFTList = Loadable(lazy(() => import("./pages/List")))
const RarityRank = Loadable(lazy(() => import("./pages/RarityRank")))

const Account = Loadable(lazy(() => import("./pages/account")))

// eslint-disable-next-line no-undef
globalThis.Buffer = Buffer;

export default function App() {
  const [wallet, setWallet] = useState(undefined);


  const init = useCallback(async () => {
    const wallet_ = await initialCrossword();
    setWallet(wallet_);
  }, []);

  useEffect(() => {
    init();
  }, [init]);



  return (
    <WalletContext.Provider value={wallet}>
      {/* <Suspense fallback={<Spinner />}> */}
      <Router>
        <Routes >
          <Route element={<Layout />}>
            <Route path="/" element={<NFTList />} />
            <Route path="/list" element={<NFTList />} />
            <Route path="/rankcheck" element={<RarityRank />} />
            <Route path="/mint" element={<NFTList />} />
            <Route path="/mylist" element={<Account />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
      {/* </Suspense> */}
    </WalletContext.Provider>
  );
}
