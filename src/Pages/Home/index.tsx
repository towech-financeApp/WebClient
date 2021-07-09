/** Home.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
import { useContext, useEffect, useState } from 'react';

// hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Models
import { Wallet } from '../../models';

// Components
import NavBar from '../../Components/NavBar';

// Services
import TransactionService from '../../Services/TransactionService';

// Styles
import './Home.css';
import { Link } from 'react-router-dom';

const Home = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [wallets, setWallets] = useState([] as Wallet[]);

  // Main API call
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);
        transactionService
          .getWallets()
          .then((res) => {
            setWallets(res.data);
          })
          .catch(() => {
            // console.log(err.response);
          });
      }
    };
    firstLoad();
  });

  return (
    <>
      <div className="Header">
        <NavBar />
        <h1>Transactions</h1>
      </div>
      <div className="contents">
        {wallets.length == 0 ? (
          <div>
            <p>
              You have no wallets, add one in <Link to="wallets">Wallets</Link>
            </p>
          </div>
        ) : (
          <div>TODO: Transaction controller</div>
        )}
      </div>
      {/* <h4>Wallets</h4>
      {wallets.map((wallet: Wallet) => (
        <div key={wallet._id}>
          <p>
            {wallet.name} Money:{wallet.money}
            <button onClick={() => props.history.push(`/wallet/${wallet._id}`)}>Open</button>
          </p>
        </div>
      ))}
      <h4>Create Wallet</h4>
      <form onSubmit={newWalletForm.onSubmit}>
        <input
          // label='Name'
          placeholder="Name"
          name="name"
          type="text"
          value={newWalletForm.values.name}
          //error={errors.name ? true : false}
          onChange={newWalletForm.onChange}
        />
        <input
          // label='Amount'
          placeholder="0"
          name="money"
          type="text"
          value={newWalletForm.values.money}
          //error={errors.money ? true : false}
          onChange={newWalletForm.onChange}
        />
        <input type="submit" value="Create" />
      </form>
      {/* Error box * /}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )} */}
    </>
  );
};

export default Home;
