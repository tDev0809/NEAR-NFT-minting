import React, { lazy, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { initialCrossword, WalletContext } from "./contexts/accounts";

import { Routes, Route } from "react-router-dom";
import Loadable from './utils/loadable'

import { MUISnackbar } from "./utils/Sanckbar";
import { Buffer } from "buffer";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const Layout = Loadable(lazy(() => import("./component/Layout")));
const NFTList = Loadable(lazy(() => import("./pages/List")))
const RarityRank = Loadable(lazy(() => import("./pages/RarityRank")))
const Mint = Loadable(lazy(() => import("./pages/Mint")))


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
            <Route path="/mint" element={<Mint />} />
            <Route path="/mylist" element={<Mint />} />
          </Route>
        </Routes>
      </Router>
      <MUISnackbar data={null} />
      {/* </Suspense> */}
    </WalletContext.Provider>
  );
}
