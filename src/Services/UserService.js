/** UserService.js 
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Class that makes requests to the UserService
 * - Manages the Login
 * - Logout
 * - Token Refreshing
*/
import customAxios from './customAxios';

export default class UserService {
  ROOT_URL = process.env.REACT_APP_USERSERVICE;
  instance = new customAxios(this.token, this.tokenDispatch);

  constructor(token, tokenDispatch) {
    this.token = token;
    this.tokenDispatch = tokenDispatch;
    this.instance = new customAxios(this.token, this.tokenDispatch);
  };

  async login(payload, loading) {
    return await this.instance.postCookie(`${this.ROOT_URL}/login`, payload, loading);
  }

  async logout() {
    return await this.instance.postCookie(`${this.ROOT_URL}/logout`, null);
  }

  async refreshToken(loading) {
    return await this.instance.postCookie(`${this.ROOT_URL}/refresh`, null, loading);
  }
}