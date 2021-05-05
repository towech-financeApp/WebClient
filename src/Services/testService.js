/** UserService.js 
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Class that makes requests to the TestService
*/
import customAxios from './customAxios';

export default class TestService {
  ROOT_URL = process.env.REACT_APP_TESTSERVICE;
  instance = new customAxios(this.token, this.tokenDispatch);

  constructor(token, tokenDispatch) {
    this.token = token;
    this.tokenDispatch = tokenDispatch;
    this.instance = new customAxios(this.token, this.tokenDispatch);
  };

  async test(loading) {
    const res = await this.instance.get(`${this.ROOT_URL}/test`);
    return res;
  }

}