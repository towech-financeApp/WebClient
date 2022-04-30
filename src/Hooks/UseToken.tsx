/** useToken.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Hook that holds a jwtToken state
 *
 * @param storageLocation Where in the browser storage the token is stored,
 *                        if not provided, does not uses the storage
 */
import React, { useReducer } from 'react';
import jwt_decode from 'jwt-decode';
import { Objects } from '../models';

/** getFromStorage
 * Gets a the value stored with the given key from the localStorage
 *
 * @param {string OPTIONAL} storageLocation
 *
 * @returns The value from storage
 */
const getFromStorage = (storageLocation?: string): string | null => {
  if (!storageLocation) return null;

  // First checks the session storage
  let contents = sessionStorage.getItem(storageLocation);

  // If not in the session storage, checks the local storage
  if (!contents) contents = localStorage.getItem(storageLocation);

  return contents;
};

/** setIntoStorage
 * Sets a value in the browser's Storage
 *
 * @param {string} storageLocation Key of the stored value
 * @param {any} content What will be stored
 * @param {boolean} forceLocal Flag that indicates if the stored value MUST be stored in the localStorage
 *
 */
const setIntoStorage = (storageLocation: string | undefined, content: any, forceLocal = false): void => {
  if (!storageLocation) return;

  // Stores the value in the session storage
  sessionStorage.setItem(storageLocation, content);

  // Stores the value into the localStorage if there is something already stored there
  // or if the forceLocal flag is set
  if (forceLocal || localStorage.getItem(storageLocation)) {
    localStorage.setItem(storageLocation, content);
  }
};

/** removeFromStorage
 * Removes a value from the browser's Storage
 *
 * @param {string} storageLocation Key of the stored value
 *
 */
const removeFromStorage = (storageLocation?: string): void => {
  if (!storageLocation) return;
  sessionStorage.removeItem(storageLocation);
  localStorage.removeItem(storageLocation);
};

// Extension of the user interface that also has the token, is used for the useToken reducer
export interface TokenState extends Objects.User.BackendUser {
  token: string;
}

// Object that defines the elements of the action for the reducer
export interface TokenAction {
  type: string;
  payload: {
    keepSession: boolean;
    token: string;
  };
}

/** useToken
 * Reducer that stores and manager the user token
 *
 * @param {string} storageLocation Key of the storage location of the token
 *
 * @returns {tokenState} state of the token
 * @returns {React.Dispatch<tokenAction>} The function to dispatch actions
 *
 */
const useToken = (storageLocation?: string): [TokenState, React.Dispatch<TokenAction>] => {
  // Retrieves the token from the browser storage, if not provided is null
  const storedToken: any = getFromStorage(storageLocation);

  // Converts the retrieved values into a tokenState object
  const initialState: TokenState = storedToken ? storedToken : {};

  // Reducer function, controls the dispatch commands
  function reducer(state: TokenState, action: TokenAction): TokenState {
    let item: TokenState;

    switch (action.type.toUpperCase()) {
      case 'LOGIN':
        item = jwt_decode(action.payload.token);
        item.token = action.payload.token;

        setIntoStorage(storageLocation, item, action.payload.keepSession);

        return item;
      case 'REFRESH':
        item = jwt_decode(action.payload.token);
        item.token = action.payload.token;
        return item
      case 'LOGOUT':
        removeFromStorage(storageLocation);
        return {} as TokenState;
      default:
        return state;
    }
  }

  // Creates the reducer
  const [token, dispatch] = useReducer(reducer, initialState);
  return [token, dispatch];
};

export default useToken;
