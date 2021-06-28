/** UserService.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the UserService
 * - Manages the Login
 * - Logout
 * - Token Refreshing
 */
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';

export default class AuthenticationService {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private ROOT_URL: string = process.env.REACT_APP_WEBAPI + '/authentication';

  constructor(token?: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as TokenState);
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
  }

  async login(payload: any, loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.postCookie(`${this.ROOT_URL}/login`, payload, loading);
  }

  async logout(): Promise<AxiosResponse<any>> {
    return await this.instance.postCookie(`${this.ROOT_URL}/logout`, null);
  }

  async refreshToken(loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.postCookie(`${this.ROOT_URL}/refresh`, null, loading);
  }
}
