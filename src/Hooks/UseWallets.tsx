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
  type: 'SET' | 'ADD' | 'EDIT' | 'DELETE' | 'UPDATE-AMOUNT';
  payload: {
    wallets: Objects.Wallet[];
    updateAmount?: {
      new: Objects.Transaction[];
      reverse?: boolean;
      old?: Objects.Transaction[];
    };
  };
}

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
    case 'UPDATE-AMOUNT':
      if (action.payload.updateAmount) {
        item = [...state];

        for (let i = 0; i < item.length; i++) {
          // calculates with the new transactions
          action.payload.updateAmount.new.map((x) => {
            const multiplier = action.payload.updateAmount?.reverse ? -1 : 1;

            item[i].money =
              (item[i].money || 0) +
              (x.category.type === 'Income' ? multiplier * x.amount : -1 * multiplier * x.amount);
          });

          // calculates with the old transactions
          action.payload.updateAmount.old?.map((x) => {
            const multiplier = action.payload.updateAmount?.reverse ? 1 : -1;

            item[i].money =
              (item[i].money || 0) +
              (x.category.type === 'Income' ? multiplier * x.amount : -1 * multiplier * x.amount);
          });
        }
      }

      return state;
    default:
      return state;
  }
};

/** useWallets
 * Reducer that stores the user wallets
 *
 * @param {Objects.Wallet[]} initial initial state of the wallets
 *
 * @returns {Objects.Wallet[]} Wallets
 * @returns {React.Dispatch<WalletAction>} The function to dispatch actions
 */
const useWallets = (initial?: Objects.Wallet[]): [Objects.Wallet[], React.Dispatch<WalletAction>] => {
  // The initial state is an empty array
  const initialState: Objects.Wallet[] = initial || [];

  // Reducer creation and returnal
  const [wallets, dispatch] = useReducer(reducer, initialState);
  return [wallets, dispatch];
};

export default useWallets;
