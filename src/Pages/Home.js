/** Home.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Home Page for the App
*/
import React, { useContext, useEffect, useState, } from 'react';

// hooks
import { AuthenticationTokenStore, } from '../Hooks/ContextStore';

// Services
import UserService from '../Services/UserService';
import TransactionService from '../Services/TransactionService';

// Utilities
import { useForm } from '../Hooks/useForm';
import checkNested from '../Utils/checkNested';

// TODO: Build page

const Home = (props) => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Services
  const userService = new UserService();
  const transactionService = new TransactionService(authToken.token, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  const [wallets, setWallets] = useState([]);

  // Create Wallet form
  const newWalletForm = useForm(newWalletCallback, {
    name: '',
    money: 0,
  });

  // Main API call
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);
        transactionService.getWallets()
          .then(res => {
            setWallets(res.data);
          })
          .catch(err => {
            console.log(err.response);
          })
      }
    };
    firstLoad();
  });

  // Callbacks
  async function logoutCallback() {
    try {
      await userService.logout();
    } catch (err) { console.log(err); }

    dispatchAuthToken({ type: 'LOGOUT' })
  };

  async function newWalletCallback() {
    try {
      const res = await transactionService.newWallet(newWalletForm.values, null);

      newWalletForm.clear();
      setWallets([...wallets, res.data]);
    }
    catch (err) {
      if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      console.log(err.response);
    }
  };

  return (
    <>
      <h3>Home</h3>
      <button onClick={logoutCallback}>Logout</button>
      <br />
      <h4>Wallets</h4>
      {wallets.map(wallet => (
        <div key={wallet.walletid}>
          <p>
            {wallet.name} Money:{wallet.money}
            <button onClick={() => props.history.push(`/wallet/${wallet.walletid}`)}>Open</button>
          </p>
        </div>
      ))}
      <h4>Create Wallet</h4>
      <form onSubmit={newWalletForm.onSubmit}>
        <input
          label='Name'
          placeholder='Name'
          name='name'
          type='text'
          value={newWalletForm.values.name}
          //error={errors.name ? true : false}
          onChange={newWalletForm.onChange}
        />
        <input
          label='Amount'
          placeholder='0'
          name='money'
          type='text'
          value={newWalletForm.values.money}
          //error={errors.money ? true : false}
          onChange={newWalletForm.onChange}
        />
        <input type="submit" value="Create" />
      </form>
      {/* Error box */}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default Home