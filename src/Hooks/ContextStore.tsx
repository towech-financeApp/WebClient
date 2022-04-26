/** ContextStore.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that contains the Context items for the whole WebClient
 */
import React, { createContext } from 'react';
import { TokenAction, TokenState } from './UseToken';
import { CategoryAction, CategoryState } from './UseCategories';
import { WalletAction } from './UseWallets';
import { Objects } from '../models';

// Context that holds the Refresh token for the API Calls
export const RefreshTokenStore = createContext(null);

// Context that holds the Authentication Token in order to make API Calls
export const AuthenticationTokenStore = createContext({
  // Token
  authToken: {} as TokenState,
  dispatchAuthToken: (() => {
    /*empty*/
  }) as React.Dispatch<TokenAction>,

  // Wallets
  wallets: [] as Objects.Wallet[],
  dispatchWallets: (() => {
    /*empty*/
  }) as React.Dispatch<WalletAction>,

  // Categories
  categories: {} as CategoryState,
  dispatchCategories: (() => {
    /*empty*/
  }) as React.Dispatch<CategoryAction>,
});

// Context that holds the User Data that is being displayed on the Client
export const UserStore = createContext(null);
