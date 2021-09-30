/** TransactionService.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the TransactionService
 * - Manages Wallet creation and administration
 * - Manages Transaction administration
 */
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';

// Models
import { Transaction, Wallet } from '../models';

export default class TransactionService {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private ROOT_URL: string = process.env.REACT_APP_WEBAPI || '';

  constructor(token?: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as TokenState);
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
  }

  async deleteTransaction(id: string, loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.delete(`${this.ROOT_URL}/transactions/${id}`, loading);
  }

  async deleteWallet(id: string, loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.delete(`${this.ROOT_URL}/wallets/${id}`, loading);
  }

  async editWallet(
    wallet: Wallet,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.patch(`${this.ROOT_URL}/wallets/${wallet._id}`, wallet, loading);
  }

  async getWallets(loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.get(`${this.ROOT_URL}/wallets`, loading);
  }

  async getWalletTransactions(
    walletid: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.get(`${this.ROOT_URL}/wallets/${walletid}/transactions`, loading);
  }

  async newTransaction(
    payload: Transaction,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.post(`${this.ROOT_URL}/transactions`, payload, loading);
  }

  async newWallet(
    payload: Wallet,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.post(`${this.ROOT_URL}/wallets`, payload, loading);
  }
}
