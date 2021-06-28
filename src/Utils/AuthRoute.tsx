/** AuthRoute.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Route component with the ability to redirect depending if there is an Authentication Token
 */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Hooks
import { AuthenticationTokenStore } from '../Hooks/ContextStore';

const AuthRoute = ({ Component: Component, notAuth, ...rest }: any): JSX.Element => {
  const { authToken } = useContext(AuthenticationTokenStore);

  // Checks the notAuth flag, if present, redirects when logged in
  const Comp = notAuth ? (
    // Unauthenticated Route
    <Route {...rest} render={(props) => (authToken.token ? <Redirect to="/home" /> : <Component {...props} />)} />
  ) : (
    // Authenticated Route
    <Route {...rest} render={(props) => (authToken.token ? <Component {...props} /> : <Redirect to="/" />)} />
  );

  return Comp;
};

export default AuthRoute;
