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
import jwt_decode from 'jwt-decode';

const getFromStorage = (storageLocation) => {
  if (!storageLocation) return null;

  var contents = sessionStorage.getItem(storageLocation);

  if (!contents) contents = localStorage.getItem(storageLocation);

  return contents;
}

const setIntoStorage = (storageLocation, content, forceLocal = false) => {
  if (!storageLocation) return;

  sessionStorage.setItem(storageLocation, content);

  // Stores it into the localStorage if it was previously stored or the
  // forceLocal flag is set
  if (forceLocal || localStorage.getItem(storageLocation)) {
    localStorage.setItem(storageLocation, content)
  }
}

const removeFromStorage = (storageLocation) => {
  sessionStorage.removeItem(storageLocation);
  localStorage.removeItem(storageLocation);
}

export const useToken = (storageLocation) => {
  // Retrieves the token from the browser storage, if not provided is null
  const initialState = getFromStorage(storageLocation);

  // Reducer function, controls the dispatch commands
  function reducer(state, action) {
    switch (action.type.toUpperCase()) {
      case 'LOGIN':
        const deco = jwt_decode(action.payload.token);

        setIntoStorage(storageLocation, { token: action.payload.token, ...deco }, action.payload.keepSession)

        return { token: action.payload.token, ...deco };
      case 'LOGOUT':
        //console.log('logout');
        removeFromStorage(storageLocation);
        return '';
      default:
        return state;
    }
  }

  // Creates the reducer
  const [token, dispatch] = useReducer(reducer, initialState);

  return [token, dispatch];
}