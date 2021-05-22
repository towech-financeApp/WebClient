/** Login.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Login Page for the App
*/
import React, { useContext, useState } from 'react';

// hooks
import { useForm } from '../Hooks/useForm';
import { AuthenticationTokenStore } from '../Hooks/ContextStore';

// Services
import UserService from '../Services/UserService';

// Utilities
import checkNested from '../Utils/checkNested';

const Login = (props) => {
  const userService = new UserService();

  // Other hooks
  //const loading = false;
  const [errors, setErrors] = useState({});
  const { dispatchAuthToken } = useContext(AuthenticationTokenStore)
  // State for the form
  const loginForm = useForm(loginCallback, {
    username: '',
    password: '',
    keepSession: false,
  })

  async function loginCallback() {
    try {
      const res = await userService.login(loginForm.values, null);
      
      dispatchAuthToken({type: 'LOGIN', payload: {...res.data, keepSession: loginForm.values.keepSession}});
      props.history.push("/home");
    }
    catch (err) {
      if (checkNested(err, 'response', 'data', 'message', 'Error')) setErrors(err.response.data.message.Error);
      console.log(err.response);
    }
  }

  return (
    <div className='content-centered-small'>
      <h1>Login</h1>
      <form onSubmit={loginForm.onSubmit}>
        <input
          label='Username or email'
          placeholder='Username/Email'
          name='username'
          type='text'
          value={loginForm.values.username}
          //error={errors.username ? true : false}
          onChange={loginForm.onChange}
        />
        <input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={loginForm.values.password}
          //error={errors.password ? true : false}
          onChange={loginForm.onChange}
        />
        <input
          type="checkbox"
          label="Keep me logged in"
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
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Login;
