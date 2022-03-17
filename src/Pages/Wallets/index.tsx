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
import { Objects } from '../../models';

// Components
import NoWalletsCard from './NoWalletsCard';
import Page from '../../Components/Page';

// Services
import TransactionService from '../../Services/TransactionService';

// Styles
import './Wallets.css';
import Button from '../../Components/Button';
import NewWalletForm from './NewWalletForm';
import WalletCard from './WalletCard';

const Wallets = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);
  const [wallets, setWallets] = useState([] as Objects.Wallet[]);

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

  const addWallet = (wallet: Objects.Wallet): void => {
    setWallets([...wallets, wallet]);
  };

  const editWallet = (wallet: Objects.Wallet): void => {
    const editedWallets = wallets;

    for (const i in editedWallets) {
      if (editedWallets[i]._id == wallet._id) {
        editedWallets[i] = wallet;
        break;
      }
    }
    setWallets([...editedWallets]);
  };

  const deleteWallet = (wallet: Objects.Wallet): void => {
    setWallets(wallets.filter((o) => o._id !== wallet._id));
  };

  const header = (
    <div className="Wallets__Header">
      <div>
        <h1>Wallets</h1>
      </div>
      <Button accent className="Wallets__AddTop" onClick={() => setModal(true)}>
        Add Wallet
      </Button>
    </div>
  );

  return (
    <Page loading={!loaded} selected="Wallets" header={header}>
      <div className="Wallets">
        {/* Add Wallet button (mobile) */}
        <Button accent round className="Wallets__AddFloat" onClick={() => setModal(true)}>
          <FaIcons.FaPlus />
        </Button>

        {/*Add/edit wallet Form*/}
        <NewWalletForm state={modal} set={setModal} addWallet={addWallet} />

        {/*Lists all the wallets, if none available, returns a "No Wallets" text*/}
        {wallets.length == 0 ? (
          <NoWalletsCard />
        ) : (
          <div className="Wallets__Container">
            <div className="Wallets__Container__Section">
              {wallets.map((wallet) => (
                <WalletCard key={wallet._id} wallet={wallet} editWallet={editWallet} deleteWallet={deleteWallet} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default Wallets;
