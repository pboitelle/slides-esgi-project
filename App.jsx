import React from "react";
import { Routes, Route } from "react-router-dom"
import { Inscription } from "./src/pages/Inscription"
import { Connexion } from "./src/pages/Connexion"
import { Account } from "./src/pages/Account/Account";
import { AccountHome } from "./src/pages/Account/AccountHome";
import { AccountPresentation } from "./src/pages/Account/AccountPresentation";
import { AccountInvitedPresentation } from "./src/pages/Account/AccountInvitedPresentation";

import WithNav from "./src/components/WithNav";
import WithoutNav from "./src/components/WithoutNav";

const App = () => {
  return (
    <>
      <Routes>

        <Route element={<WithNav />}>
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/" element={<Connexion />} />
        </Route>

        <Route path="/account" element={<Account />} >
          <Route path="/account/home" element={<AccountHome />} />
          <Route path="/account/home/:uuuid" element={<AccountPresentation />} />    
          <Route path="/account/home/invited/:user_id/:uuuid" element={<AccountInvitedPresentation />} />    
        </Route>

      </Routes>
    </>
  )
}

export default App;