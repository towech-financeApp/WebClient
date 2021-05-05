/** Login.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Home Page for the App
*/
import React, { useContext } from 'react';

// hooks
import { AuthenticationTokenStore, } from '../Hooks/ContextStore';

// Services
import UserService from '../Services/UserService';
import TestService from '../Services/testService';

// TODO: Build page

function Home() {
  // Context
  const {authToken, dispatchAuthToken} = useContext(AuthenticationTokenStore);
  
  // Services
  const userService = new UserService();
  const testService = new TestService(authToken, dispatchAuthToken);

  async function testCallback() {
    try {
      const res = await testService.test(null);
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
  }

  async function logoutCallback() {
    try {
      await userService.logout();
    }catch (err){ console.log(err); }

    dispatchAuthToken({type: 'LOGOUT'})
  }

  return (
    <>
      <h3>Home</h3>
      <p>{authToken}</p>
      <button onClick={testCallback}>Test</button>
      <button onClick={logoutCallback}>Logout</button>
    </>
  )
}

export default Home