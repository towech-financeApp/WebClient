/** Wallets.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
import { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Models
import { Wallet } from '../../models';

// Components
import NoWalletsCard from './NoWalletsCard';
import Page from '../../Components/Page';

// Services
import TransactionService from '../../Services/TransactionService';

// Styles
import './Wallets.css';
import Button from '../../Components/Button';
import NewWalletForm from './NewWalletForm';

const Wallets = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);
  // const [errors, setErrors] = useState({});
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

  // Callbacks
  // async function deleteWalletCallback(id: string) {
  //   try {
  //     await transactionService.deleteWallet(id);

  //     setWallets(wallets.filter((wallet) => wallet._id !== id));
  //   } catch (err) {
  //     if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
  //     // console.log(err.response);
  //   }
  // }

  const addWallet = (wallet: Wallet): void => {
    setWallets([...wallets, wallet]);
  };

  return (
    <Page
      loading={!loaded}
      selected="Wallets"
      header={
        <div className="Wallets__Header">
          <div>
            <h1>Wallets</h1>
          </div>
          <Button accent className="Wallets__AddTop" onClick={() => setModal(true)}>
            Add Wallet
          </Button>
        </div>
      }
    >
      <>
        <Button accent round className="Wallets__AddFloat" onClick={() => setModal(true)}>
          <FaIcons.FaPlus />
        </Button>
        <NewWalletForm state={modal} set={setModal} addWallet={addWallet} />
        {wallets.length == 0 ? <NoWalletsCard /> : <div>TODO: SHOW WALLETS</div>}
      </>
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
      </div> */}
    </Page>
  );
};

export default Wallets;
