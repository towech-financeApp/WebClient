/** Home.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

// hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Models
import { Transaction, Wallet } from '../../models';

// Components
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import RedirectToWallets from './RedirectToWallets';
import TransactionViewer from './TransactionViewer';
import WalletTotals from './walletTotals';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import GetParameters from '../../Utils/GetParameters';

// Styles
import './Home.css';
import NewTransactionForm from './NewTransactionForm';

const Home = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);
  const navigate = useNavigate();
  const location = useLocation();

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [selectedWallet_id, setSelectedWalletId] = useState(GetParameters(location.search, 'wallet') || '-1');
  const [headerTotal, setHeaderTotal] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [monthTotals, setMonthTotals] = useState({ earnings: 0, expenses: 0 });

  // Main API call
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);

        // Gets all the wallets of the client
        transactionService
          .getWallets()
          .then((res) => {
            // Gets the transactions for the selected wallet
            setWallets(res.data);

            loadTransactions(selectedWallet_id);
          })
          .catch(() => {
            // console.log(err.response);
          });
      }
    };
    firstLoad();
  });

  // Code that is run everytime the Wallets or the Transactions change
  useEffect(() => {
    setReport();
  }, [wallets, transactions]);

  // Code that is run everytime the selectedWalletId changes
  useEffect(() => {
    loadTransactions(selectedWallet_id);
  }, [selectedWallet_id]);

  // Adds a transaction to the list and recalculates the totals
  const addTransaction = (transaction: Transaction): void => {
    setTransactions([...transactions, transaction]);
  };

  // Edits a transaction from the list and recalculates the totals
  const editTransaction = (transaction: Transaction): void => {
    console.log('edit');
  };

  // Removes a transaction from the list
  const deleteTransaction = (transaction: Transaction): void => {
    setTransactions(transactions.filter((o) => o._id !== transaction._id));
  };

  // Gets the transactions from the API of the selected wallet
  const loadTransactions = async (walletId: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId);
    setTransactions(res.data.transactions);
  };

  // Reads the transactions and separates the income and expenses as well as the total in the header
  const setReport = (): void => {
    let earnings = 0;
    let expenses = 0;

    transactions.map((transaction) => {
      if (transaction.amount > 0) {
        earnings += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });

    setMonthTotals({ earnings, expenses });

    if (selectedWallet_id !== '-1') {
      setHeaderTotal(wallets.find((w) => w._id === selectedWallet_id)?.money || 0);
    } else {
      let nHeaderTotal = 0;
      wallets.map((w) => {
        nHeaderTotal += w.money;
      });

      setHeaderTotal(nHeaderTotal);
    }
  };

  // Redirects to the wallet when the header selector changes
  const changeSelectedWallet = (data: any): void => {
    if (data.target.options[data.target.selectedIndex].value !== selectedWallet_id) {
      navigate(`/home?wallet=${data.target.options[data.target.selectedIndex].value}`);
      setSelectedWalletId(data.target.options[data.target.selectedIndex].value);
    }
  };

  // Extracted HTML components
  const header = (
    <div className="Transactions__Header">
      <div>
        <select name="selected_wallet" onChange={changeSelectedWallet} value={selectedWallet_id}>
          <option value="-1">Total</option>
          {wallets.map((wallet: Wallet) => (
            <option value={wallet._id} key={wallet._id}>
              {wallet.name}
            </option>
          ))}
        </select>
        <div>{headerTotal}</div>
      </div>
      <Button accent className="Wallets__AddTop" onClick={() => setAddModal(true)}>
        Add Wallet
      </Button>
    </div>
  );

  return (
    <Page header={header} selected="Transactions">
      <div className="Transactions">
        <Button accent round className="Wallets__AddFloat" onClick={() => setAddModal(true)}>
          <FaIcons.FaPlus />
        </Button>
        <NewTransactionForm
          state={addModal}
          setState={setAddModal}
          addTransaction={addTransaction}
          wallets={wallets}
          selectedWallet={selectedWallet_id}
        />
        {wallets.length == 0 ? (
          <RedirectToWallets />
        ) : (
          <div className="Transactions__Content">
            <WalletTotals totals={monthTotals} />
            <TransactionViewer transactions={transactions} edit={editTransaction} delete={deleteTransaction} />
          </div>
        )}
      </div>
    </Page>
  );
};

export default Home;
