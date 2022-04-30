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

        // calculates the new transactions
        action.payload.updateAmount.new.map((transaction) => {
          const multiplier = action.payload.updateAmount?.reverse ? -1 : 1;
          const index = item.findIndex((wallet) => wallet._id === transaction.wallet_id);

          if (index !== -1) {
            item[index].money =
              (item[index].money || 0) +
              (transaction.category.type === 'Income'
                ? multiplier * transaction.amount
                : -1 * multiplier * transaction.amount);
          }
        });

        // Reverses the old transactions if provided
        action.payload.updateAmount.old?.map((transaction) => {
          const multiplier = action.payload.updateAmount?.reverse ? 1 : -1;
          const index = item.findIndex((wallet) => wallet._id === transaction.wallet_id);

          if (index !== -1) {
            item[index].money =
              (item[index].money || 0) +
              (transaction.category.type === 'Income'
                ? multiplier * transaction.amount
                : -1 * multiplier * transaction.amount);
          }
        });
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
