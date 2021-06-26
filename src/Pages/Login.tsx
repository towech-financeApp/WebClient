/** Login.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Login Page for the App
 */
import React, { useContext, useState } from 'react';

// hooks
import UseForm from '../Hooks/UseForm';
import { AuthenticationTokenStore } from '../Hooks/ContextStore';

// Services
import AuthenticationService from '../Services/AuthenticationService';

// Models
import User from '../models/user';

// Utilities
import CheckNested from '../Utils/CheckNested';

const Login = (): JSX.Element => {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  // const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as User);
  const { dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // State for the form
  const loginForm = UseForm(loginCallback, {
    username: '',
    password: '',
    keepSession: false,
  });

  async function loginCallback() {
    try {
      const res = await authService.login(loginForm.values);

      dispatchAuthToken({ type: 'LOGIN', payload: { ...res.data, keepSession: loginForm.values.keepSession } });
    } catch (error: any) {
      if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors as User);
    }
  }

  return (
    <div className="content-centered-small">
      <h1>Login</h1>
      <form onSubmit={loginForm.onSubmit}>
        <input
          placeholder="Username/Email"
          name="username"
          type="text"
          value={loginForm.values.username}
          // error={errors.username ? true : false}
          onChange={loginForm.onChange}
        />
        <input
          //label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={loginForm.values.password}
          //error={errors.password ? true : false}
          onChange={loginForm.onChange}
        />
        <input
          type="checkbox"
          // label="Keep me logged in"
          name="keepSession"
          checked={loginForm.values.keepSession}
          onChange={loginForm.onChange}
        />
        <input type="submit" value="Submit" />
      </form>
      {/* Error box */}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
