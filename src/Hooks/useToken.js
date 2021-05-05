/** useToken.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Hook that holds a jwtToken state
 * 
 * @param storageLocation Where in the browser storage the token is stored,
 *                        if not provided, does not uses the storage
 */
import { useReducer } from 'react';

export const useToken = (storageLocation) => {
  // Retrieves the token from the browser storage, if not provided is null
  const initialState = !storageLocation ? null :
    sessionStorage.getItem(storageLocation) ? sessionStorage.getItem(storageLocation) :
      localStorage.getItem(storageLocation) ? localStorage.getItem(storageLocation) : null;

  // Reducer function, controls the dispatch commands
  function reducer(state, action) {
    switch (action.type.toUpperCase()) {
      case 'LOGIN':
        //console.log('login');
        return action.payload;
      case 'LOGOUT':
        //console.log('logout');
        return '';
      default:
        return state;
    }
  }

  // Creates the reducer
  const [token, dispatch] = useReducer(reducer, initialState);

  return [token, dispatch];
}