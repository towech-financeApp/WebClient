/** TransactionService.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved.
 *
 * Class that makes requests to the UserService
 * - Manages changes in user information
 * - Allows an admin to manage other user accounts
 */
import React from 'react';
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';

// Models
import { User } from '../models';

export default class UserService {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private ROOT_URL: string = process.env.REACT_APP_WEBAPI || '';

  constructor(token?: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as TokenState);
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
  }

  async changePassword(
    values: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.put(`${this.ROOT_URL}/users/password`, values, loading);
  }

  /** editUser
   * Sends a patch request that edits the user
   */
  async editUser(
    id: string,
    user: User,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.patch(`${this.ROOT_URL}/users/${id}`, user, loading);
  }

  /** generateResetPassword Token
   * Sends the email of the uaser that wants to reset their password
   */
  async generateResetPasswordToken(
    email: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.post(`${this.ROOT_URL}/users/reset`, { username: email }, loading);
  }
}
