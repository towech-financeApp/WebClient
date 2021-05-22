/** App.js
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

// Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Wallet from './Pages/Wallet';

// Components
import NotFound from './Components/NotFound';

// Hooks
import { AuthenticationTokenStore, UserStore } from './Hooks/ContextStore';
import { useToken } from './Hooks/useToken';

// Services
import UserService from './Services/UserService';

// Utils
import AuthRoute from './Utils/AuthRoute';

// Services
const userService = new UserService();

function App() {
  // Hooks
  const [authToken, dispatchAuthToken] = useToken('authToken');
  const [loaded, setLoaded] = useState(false);



  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);
        userService.refreshToken()
          .then(res => {
            dispatchAuthToken({ type: 'LOGIN', payload: res.data });
          })
          .catch(err => {
            //console.log(err.response);
            dispatchAuthToken({ type: 'LOGOUT' });
          })
      }
    };
    firstLoad();
  });

  return (
    <AuthenticationTokenStore.Provider value={{ authToken, dispatchAuthToken }}>
      <UserStore.Provider value={null}>
        <Router>
          <Container>
            {/*TODO: MenuBar*/}
            <Switch>
              {/*Routes that can be accessed with or without credentials*/}
              {/*TODO: PasswordReset Pages*/}
              {/*Routes that can be accessed only without being logged in */}
              <AuthRoute notAuth exact path='/' component={Login} />
              {/*Routes that can be accessed only while being logged in*/}
              <AuthRoute exact path='/home' component={Home} />
              <AuthRoute exact path='/wallet/:walletid' component={Wallet} />
              {/*TODO: Settings Page*/}
              {/* 404 - not found route*/}
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Router>
      </UserStore.Provider>
    </AuthenticationTokenStore.Provider>
  );
}

export default App;
