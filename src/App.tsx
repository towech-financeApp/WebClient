/** App.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that holds all pages and views
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

// TODO: Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Wallets from './Pages/Wallets';

// Components
import NotFound from './Components/NotFound';

// Hooks
import { AuthenticationTokenStore } from './Hooks/ContextStore';
import useToken from './Hooks/UseToken';

// Services
import AuthenticationService from './Services/AuthenticationService';

// Utils
import AuthRoute from './Utils/AuthRoute';

function App(): JSX.Element {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  const [authToken, dispatchAuthToken] = useToken('authToken');
  const [loaded, setLoaded] = useState(false);

  // use Effect for first load
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);
        authService
          .refreshToken()
          .then((res) => {
            dispatchAuthToken({ type: 'LOGIN', payload: res.data });
          })
          .catch(() => {
            //console.log(err.response);
            dispatchAuthToken({ type: 'LOGOUT', payload: { token: '', keepSession: false } });
          });
      }
    };
    firstLoad();
  }, []);

  return (
    <div className="App">
      <AuthenticationTokenStore.Provider value={{ authToken, dispatchAuthToken }}>
        <Router>
          <Routes>
            {/*TODO: PasswordReset Pages*/}
            {/*TODO: Settings Page*/}
            <Route
              path="/home"
              element={
                <AuthRoute>
                  <Home />
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
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthenticationTokenStore.Provider>
    </div>
  );
}

export default App;
