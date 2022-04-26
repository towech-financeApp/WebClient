/** UseCategories.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Hook that holds all the categories of a user, meant to be used in conjunction with
 * a store to create a cache
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

/** useCategories
 * Reducer that stores the user categories
 *
 * @param {TokenState} token state of the user token
 * @param {React.Dispatch<TokenAction>} tokenDispatch dispatch of the user token
 *
 * @returns {Objects.Category[]} categories
 * @returns {React.Dispatch<categoryAction>} The function to dispatch actions
 *
 */

export interface CategoryState {
  Income: Objects.Category[];
  Expense: Objects.Category[];
}

export interface CategoryAction {
  type: 'SET' | 'UPDATE';
  payload: {
    Income: Objects.Category[];
    Expense: Objects.Category[];
  };
}

const useCategories = (initial?: CategoryState): [CategoryState, React.Dispatch<CategoryAction>] => {
  // The initial state is an empty array
  const initialState: CategoryState = initial || { Income: [], Expense: [] };

  // Reducer function, controls the dispatch commands
  const reducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    let item: CategoryState;

    switch (action.type.toUpperCase().trim()) {
      case 'SET':
        item = {
          Income: action.payload.Income,
          Expense: action.payload.Expense,
        };
        return item;
      case 'UPDATE':
        item = { Income: state.Income, Expense: state.Expense };

        action.payload.Income.map((cat) => {
          const index = state.Income.findIndex((x) => x._id === cat._id);
          if (index === -1) state.Income.push(cat);
        });

        action.payload.Expense.map((cat) => {
          const index = state.Expense.findIndex((x) => x._id === cat._id);
          if (index === -1) state.Expense.push(cat);
        });

        return item;
      default:
        return state;
    }
  };

  // Reducer creation and returnal
  const [categories, dispatch] = useReducer(reducer, initialState);
  return [categories, dispatch];
};

export default useCategories;
