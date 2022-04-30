/** UseTransactions.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Reducer for all the changes that the transactions can receive
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

// Utilities
import ParseDataMonth from '../Utils/ParseDataMonth';

export interface TransactionState {
  selectedWallet: string;
  dataMonth: string;
  report: { earnings: number; expenses: number };
  transactions: Objects.Transaction[];
}

export interface TransAction {
  type: 'SELECT-WALLET' | 'SELECT-DATAMONTH' | 'SET' | 'ADD' | 'EDIT' | 'DELETE';
  payload: any;
}

/** useWallets
 * Reducer that stores the user transactions
 *
 * @param {Objects.TransactionState} initial initial state of the transactions
 *
 * @returns {Objects.TransactionState} Wallets
 * @returns {React.Dispatch<TransAction>} The function to dispatch actions
 */
// Functions
const cleanAndSort = (
  input: Objects.Transaction[],
  selectedWallet: string,
  dataMonth: string,
): Objects.Transaction[] => {
  const cleaned = [] as Objects.Transaction[];
  input.map((x) => {
    if (
      (selectedWallet === '-1' || selectedWallet === x.wallet_id) &&
      `${x.transactionDate.toString().substring(0, 4)}${x.transactionDate.toString().substring(5, 7)}` === dataMonth
    ) {
      cleaned.push(x);
    }
  });

  const output = cleaned.sort((a, b) => {
    if (a.transactionDate > b.transactionDate) return -1;
    if (a.transactionDate < b.transactionDate) return 1;
    return 0;
  });

  return output;
};

// Reads the transactions and separates the income and expenses as well as the total in the header
const calculateReport = (
  input: Objects.Transaction[],
  selectedWallet: string,
): { earnings: number; expenses: number } => {
  let earnings = 0;
  let expenses = 0;

  input.map((x) => {
    if (!x.excludeFromReport && !(x.transfer_id && selectedWallet === '-1')) {
      if (x.category.type === 'Income') {
        earnings += x.amount;
      } else {
        expenses += x.amount;
      }
    }
  });
  return { earnings, expenses };
};

// Reducer function, controls the dispatch commands
const reducer = (state: TransactionState, action: TransAction): TransactionState => {
  let item: TransactionState;

  switch (action.type.toUpperCase().trim()) {
    case 'SELECT-WALLET':
      item = { ...state };
      item.selectedWallet = action.payload;

      return item;
    case 'SELECT-DATAMONTH':
      item = { ...state };
      item.dataMonth = ParseDataMonth(action.payload);

      return item;
    case 'SET':
      item = {
        dataMonth: action.payload.dataMonth,
        selectedWallet: action.payload.selectedWallet,
        transactions: cleanAndSort(action.payload.transactions, state.selectedWallet, ParseDataMonth(state.dataMonth)),
        report: { earnings: 0, expenses: 0 },
      };

      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    case 'ADD':
      item = { ...state };

      // only adds the transactions that are not already in the state
      action.payload.map((transaction: Objects.Transaction) => {
        if (state.selectedWallet === '-1' || state.selectedWallet === transaction.wallet_id) {
          const index = state.transactions.findIndex((x) => x._id === transaction._id);
          if (index === -1) {
            item.transactions.push(transaction);
          }
        }
      });

      item.transactions = cleanAndSort(item.transactions, state.selectedWallet, ParseDataMonth(state.dataMonth));
      item.report = calculateReport(item.transactions, item.selectedWallet);

      return item;
    case 'EDIT':
      item = { ...state };

      // only changes the transactions that are in the state
      action.payload.map((transaction: Objects.Transaction) => {
        const index = state.transactions.findIndex((x) => x._id === transaction._id);
        if (index >= 0) {
          item.transactions[index] = transaction;
        }
      });

      item.transactions = cleanAndSort(item.transactions, state.selectedWallet, ParseDataMonth(state.dataMonth));
      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    case 'DELETE':
      item = { ...state };

      // Filters the array
      item.transactions = state.transactions.filter((transaction) => {
        const index = action.payload.findIndex((x: Objects.Transaction) => x._id === transaction._id);
        return index < 0;
      });

      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    default:
      return state;
  }
};

const useTransactions = (initial?: TransactionState): [TransactionState, React.Dispatch<TransAction>] => {
  // The initial state is an empty array
  const initialState: TransactionState = initial || {
    selectedWallet: '-1',
    dataMonth: ParseDataMonth('-1'),
    report: { earnings: 0, expenses: 0 },
    transactions: [],
  };

  // Reducer creation and returnal
  const [transactions, dispatch] = useReducer(reducer, initialState);
  return [transactions, dispatch];
};

export default useTransactions;
