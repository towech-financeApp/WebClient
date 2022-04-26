/** App.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that holds all pages and views
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

// Pages
import Transactions from './Pages/Transactions';
import Login from './Pages/Login';
import Wallets from './Pages/Wallets';
import Settings from './Pages/Settings';
import PasswordReset from './Pages/PasswordReset/PasswordReset';
import VerifyAccount from './Pages/VerifyAccount/VerifyAccount';

// Components
import NotFound from './Components/NotFound';

// Hooks
import { AuthenticationTokenStore } from './Hooks/ContextStore';
import useToken from './Hooks/UseToken';
import useCategories from './Hooks/UseCategories';
import useWallets from './Hooks/UseWallets';

// Services
import AuthenticationService from './Services/AuthenticationService';

// Utils
import AuthRoute from './Utils/AuthRoute';

function App(): JSX.Element {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  const [authToken, dispatchAuthToken] = useToken('authToken');
  const [categories, dispatchCategories] = useCategories();
  const [wallets, dispatchWallets] = useWallets();
  const [loaded, setLoaded] = useState(false);

  // use Effect for first load
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        authService
          .refreshToken()
          .then((res) => {
            dispatchAuthToken({ type: 'LOGIN', payload: res.data });

            setLoaded(true);
          })
          .catch(() => {
            dispatchAuthToken({ type: 'LOGOUT', payload: { token: '', keepSession: false } });
            setLoaded(true);
          });
      }
    };
    firstLoad();
  }, []);

  return (
    <div className="App">
      <AuthenticationTokenStore.Provider
        value={{ authToken, dispatchAuthToken, categories, dispatchCategories, wallets, dispatchWallets }}
      >
        <Router>
          <Routes>
            <Route
              path="/home"
              element={
                <AuthRoute>
                  <Transactions />
                </AuthRoute>
              }
            />
            <Route
              path="/wallets/*"
              element={
                <AuthRoute>
                  <Wallets />
                </AuthRoute>
              }
            />
            <Route
              path="/settings/"
              element={
                <AuthRoute>
                  <Settings />
                </AuthRoute>
              }
            />
            <Route path="/reset" element={<PasswordReset.sendTokenPage />} />
            <Route path="/reset/*" element={<PasswordReset.setResetPassword />} />
            <Route path="/verify/*" element={<VerifyAccount.verifyPage />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthenticationTokenStore.Provider>
    </div>
  );
}

export default App;
