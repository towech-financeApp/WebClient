/** TransactionService.js 
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Class that makes requests to the TransactionService
 * - Manages Wallet creation and administration
 * - Manages Transaction administration
*/
import customAxios from './customAxios';

export default class TransactionService {
  ROOT_URL = process.env.REACT_APP_TRANSACTIONSERVICE;
  instance = new customAxios(this.token, this.tokenDispatch);

  constructor(token, tokenDispatch) {
    this.token = token;
    this.tokenDispatch = tokenDispatch;
    this.instance = new customAxios(this.token, this.tokenDispatch);
  };

  async getWallets(loading) {
    return await this.instance.get(`${this.ROOT_URL}/wallet`, loading);
  };

  async getWalletTransactions(walletid, loading) {
    return await this.instance.get(`${this.ROOT_URL}/wallet/${walletid}/transactions`, loading);
  };

  async newTransaction(payload, loading) {
    return await this.instance.post(`${this.ROOT_URL}/transaction`, payload, loading);
  };

  async newWallet(payload, loading) {
    return await this.instance.post(`${this.ROOT_URL}/wallet`, payload, loading);
  };
};
