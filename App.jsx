import React from "react";
import { Routes, Route } from "react-router-dom"
import { Inscription } from "./src/pages/Inscription"
import { Connexion } from "./src/pages/Connexion"
import { Navbar } from "./src/components/Navbar";
import { Account } from "./src/pages/Account/Account";
import { AccountHome } from "./src/pages/Account/AccountHome";
import { AccountPresentation } from "./src/pages/Account/AccountPresentation";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/" element={<Connexion />} />
        <Route path="/account" element={<Account />} >
          <Route path="/account/home" element={<AccountHome />} />
          <Route path="/account/:uuuid" element={<AccountPresentation />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;