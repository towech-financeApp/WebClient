/** Wallets.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
import { useContext, useEffect, useState } from 'react';

// hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import UseForm from '../../Hooks/UseForm';

// Models
import { Wallet } from '../../models';

// Components
import NoWalletsCard from './NoWalletsCard';
import Page from '../../Components/Page';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Wallets.css';

const Wallets = (props: any): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [wallets, setWallets] = useState([] as Wallet[]);

  // Create wallet form
  const newWalletForm = UseForm(newWalletCallback, {
    name: '',
    money: 0,
  });

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

  // Callbacks
  async function deleteWalletCallback(id: string) {
    try {
      await transactionService.deleteWallet(id);

      setWallets(wallets.filter((wallet) => wallet._id !== id));
    } catch (err) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      // console.log(err.response);
    }
  }

  async function newWalletCallback() {
    try {
      const res = await transactionService.newWallet(newWalletForm.values);

      newWalletForm.clear();
      setWallets([...wallets, res.data]);
      setModal(false);
    } catch (err) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      // console.log(err.response);
    }
  }

  return (
    <Page header={<h1>Wallets</h1>} selected="Wallets">
      {wallets.length == 0 ? <NoWalletsCard /> : <div>SHOW WALLETS</div>}
      {/* <div>
        {/* List Wallets * /}
        {wallets.length == 0 ? (
          <div>No Wallets</div>
        ) : (
          <div>
            {wallets.map((wallet) => (
              <div key={wallet._id}>
                <p>
                  {wallet.name} Money:{wallet.money}
                  <button onClick={() => props.history.push(`/home?wallet=${wallet._id}`)}>Open</button>
                  <button onClick={() => deleteWalletCallback(wallet._id)}>Delete</button>
                </p>
              </div>
            ))}
          </div>
        )}

        {/*Add wallet button * /}
        <button onClick={() => setModal(true)}>Add Wallet</button>

        {/*Create wallet form* /}
        {/*TODO: Make form a modal* /}
        <div className={modal ? 'contents__addForm active' : 'contents__addForm'}>
          <button
            onClick={() => {
              setErrors([]);
              setModal(false);
            }}
          >
            Close
          </button>
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
          )}
        </div>
      </div> */}
    </Page>
  );
};

export default Wallets;
