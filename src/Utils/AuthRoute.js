/** AuthRoute.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Route component with the ability to redirect depending if there is an Authentication Token
 */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Hooks
import { AuthenticationTokenStore } from '../Hooks/ContextStore';

const AuthRoute = ({ component: Component, notAuth, ...rest }) => {
  const { authToken } = useContext(AuthenticationTokenStore);

  // Checks the notAuth flag, if present, redirects when logged in
  const Comp = notAuth ? (
    <Route
      {...rest}
      render={props => authToken ? <Redirect to="/home" /> : <Component {...props} />}
    />
  ) : (
      <Route
        {...rest}
        render={props => authToken ? <Component {...props} /> : <Redirect to="/" />}
      />
    );

  return Comp;
}

export default AuthRoute;
