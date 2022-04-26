/** UseWallets.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Reducer for all the changes that the wallets can receive
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

export interface WalletAction {
  type: 'SET' | 'ADD' | 'EDIT' | 'DELETE';
  payload: {
    wallets: Objects.Wallet[];
  };
}

/** useWallets
 * Reducer that stores the user categories
 *
 * @param {Objects.Wallet[]} initial initial state of the wallets
 *
 * @returns {Objects.Wallet[]} Wallets
 * @returns {React.Dispatch<WalletAction>} The function to dispatch actions
 */
const useWallets = (initial?: Objects.Wallet[]): [Objects.Wallet[], React.Dispatch<WalletAction>] => {
  // The initial state is an empty array
  const initialState: Objects.Wallet[] = initial || [];

  // Reducer function, controls the dispatch commands
  const reducer = (state: Objects.Wallet[], action: WalletAction): Objects.Wallet[] => {
    let item: Objects.Wallet[];

    switch (action.type.toUpperCase().trim()) {
      case 'SET':
        item = action.payload.wallets;
        return item;
      case 'ADD':
        item = [...state];

        // only adds the wallets that are not already in the state
        action.payload.wallets.map((wallet) => {
          const index = state.findIndex((x) => x._id === wallet._id);
          if (index === -1) state.push(wallet);
        });

        return item;
      case 'EDIT':
        item = [...state];

        // only changes the wallets that are already in the state
        action.payload.wallets.map((wallet) => {
          const index = state.findIndex((x) => x._id === wallet._id);
          if (index >= 0) state[index] = wallet;
        });

        return item;
      case 'DELETE':
        item = state.filter((wallet) => {
          const index = action.payload.wallets.findIndex((x) => x._id === wallet._id);
          return index < 0;
        });
        return item;
      default:
        return state;
    }
  };

  // Reducer creation and returnal
  const [wallets, dispatch] = useReducer(reducer, initialState);
  return [wallets, dispatch];
};

export default useWallets;
