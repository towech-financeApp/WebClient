/** App.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that holds all pages and views
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

// TODO: Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Wallet from './Pages/Wallet';

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
  });

  return (
    <AuthenticationTokenStore.Provider value={{ authToken, dispatchAuthToken }}>
      <Router>
        <Container>
          <Switch>
            {/*Routes that can be accessed with or without credentials*/}
            {/*TODO: PasswordReset Pages*/}
            {/*Routes that can be accessed only without being logged in */}
            <AuthRoute notAuth exact path="/" Component={Login} />
            {/*Routes that can be accessed only while being logged in*/}
            <AuthRoute exact path="/home" Component={Home} />
            <AuthRoute exact path="/wallet/:walletid" Component={Wallet} />
            {/*TODO: Settings Page*/}
            {/* 404 - not found route*/}
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Router>
    </AuthenticationTokenStore.Provider>
  );
}

export default App;
