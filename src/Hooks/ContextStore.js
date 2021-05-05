/** ContextStore.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Component that contains the Context items for the whole WebClient
 */
import {createContext} from 'react';

// Context that holds the Refresh token for the API Calls
export const RefreshTokenStore = createContext(null);

// Context that holds the Authentication Token in order to make API Calls
export const AuthenticationTokenStore = createContext(null);

// Context that holds the User Data that is being displayed on the Client
export const UserStore = createContext(null);
