/** Login.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Login Page for the App
 * Based from: https://codepen.io/meodai/pen/rNedxBa
 */
import { useContext, useState } from 'react';

// Components
import Checkbox from '../../Components/Checkbox';
import Input from '../../Components/Input';
import Loading from '../../Components/Loading';

// hooks
import UseForm from '../../Hooks/UseForm';
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Services
import AuthenticationService from '../../Services/AuthenticationService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Login.css';

const Login = (): JSX.Element => {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const { dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // State for the form
  const loginForm = UseForm(loginCallback, {
    username: '',
    password: '',
    keepSession: false,
  });

  async function loginCallback() {
    try {
      setErrors({});
      const res = await authService.login(loginForm.values, setLoading);

      dispatchAuthToken({ type: 'LOGIN', payload: { ...res.data, keepSession: loginForm.values.keepSession } });
    } catch (error: any) {
      if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors);
    }
  }

  return (
    <div className="Login">
      {/*Loading icon*/}
      {loading && (
        <div className="Login__loading">
          <Loading className="Login__spinner" />
        </div>
      )}
      {/* Content*/}
      <div className={loading ? 'loading' : ' '}>
        <h1>Login</h1>
        {/*Login form*/}
        <form onSubmit={loginForm.onSubmit}>
          <Input
            error={errors.login ? true : false}
            label="Email"
            name="username"
            type="text"
            value={loginForm.values.username}
            onChange={loginForm.onChange}
          />
          <Input
            error={errors.login ? true : false}
            label="Password"
            name="password"
            type="password"
            value={loginForm.values.password}
            onChange={loginForm.onChange}
          />
          <div className="Login__bottomRow">
            <Checkbox
              label="Keep me logged in"
              name="keepSession"
              checked={loginForm.values.keepSession}
              onChange={loginForm.onChange}
            />
            <input className="Login__submit" type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;