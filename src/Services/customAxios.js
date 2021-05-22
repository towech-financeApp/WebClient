/** UserService.js 
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Axios instance that can use and refresh the authToken
*/
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Functions
/** getAuthToken
 * makes a request to refresh the authentication token
 */
async function getAuthToken(tokenDispatch) {
  try {
    const res = await axios.post(`${process.env.REACT_APP_USERSERVICE}/refresh`, null, { withCredentials: true });
    tokenDispatch({ type: 'LOGIN', payload: res.data });
    return res.data.token;
  }
  catch (err) { throw err }

}

// declares the instance
const mAxios = (token, tokenDispatch) => {
  // Axios instance for making requests
  const axiosInstance = axios.create();

  // If a token dispatch is given, then sets the interceptors
  if (tokenDispatch) {
    axiosInstance.interceptors.request.use(async function (config) {

      let nuToken = token;

      // If there is no authToken, gets a new one
      if (!token) { nuToken = await getAuthToken(tokenDispatch); }
      // If there is one, checks if it isn't expired
      else {
        const decodedToken = jwtDecode(token);
        // If the authToken is expired, gets a newOne
        if (decodedToken.exp * 1000 < Date.now()) { nuToken = await getAuthToken(tokenDispatch); }
      }

      // sets the token as header
      config.headers["Authorization"] = `Bearer ${nuToken}`;

      return config;
    },
      function (error) {
        console.log('api-request-error');
        return Promise.reject(error);
      });
  }

  return axiosInstance;
}

// Exports a class that contains the instance, this way it also can have the most
// basic structure for each method.
export default class customAxios {
  constructor(token, tokenDispatch) {
    this.token = token;
    this.tokenDispatch = tokenDispatch;
  };

  async get(url, loading) {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token, this.tokenDispatch).get(url);
      //const res = await axios.get(url);
      if (loading) loading(false);
      return res;
    }
    catch (err) {
      if (loading) loading(false);
      throw err;
    }
  };

  async post(url, payload, loading) {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token, this.tokenDispatch).post(url, payload);
      if (loading) loading(false);
      return res;
    }
    catch (err) {
      if (loading) loading(false);
      throw err;
    }
  };

  async postCookie(url, payload, loading) {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token, this.tokenDispatch).post(url, payload, { withCredentials: true });
      if (loading) loading(false);
      return res;
    }
    catch (err) {
      if (loading) loading(false);
      throw err;
    }
  };

  async patch(url, payload, loading) {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token, this.tokenDispatch).patch(url, payload);
      if (loading) loading(false);
      return res;
    }
    catch (err) {
      if (loading) loading(false);
      throw err;
    }
  };

  async delete(url, loading) {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token, this.tokenDispatch).delete(url);
      if (loading) loading(false);
      return res;
    }
    catch (err) {
      if (loading) loading(false);
      throw err;
    }
  };

}