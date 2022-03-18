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
import { Objects } from '../../models';

// Components
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import DataMonthSelector from './DataMonthSelector';
import RedirectToWallets from './RedirectToWallets';
import TransactionViewer from './TransactionViewer';
import WalletTotals from './walletTotals';
import NewTransactionForm from './NewTransactionForm';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import GetParameters from '../../Utils/GetParameters';
import ParseDataMonth from '../../Utils/ParseDataMonth';

// Styles
import './Home.css';

const Home = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);
  const navigate = useNavigate();
  const location = useLocation();

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [wallets, setWallets] = useState([] as Objects.Wallet[]);
  const [selectedWallet_id, setSelectedWalletId] = useState(GetParameters(location.search, 'wallet') || '-1');
  const [dataMonth, setDataMonth] = useState(ParseDataMonth(GetParameters(location.search, 'month')));
  const [headerTotal, setHeaderTotal] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [transactions, setTransactions] = useState([] as Objects.Transaction[]);
  const [monthTotals, setMonthTotals] = useState({ earnings: 0, expenses: 0 });

  // Main API call
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded && authToken.token) {
        setLoaded(true);
        // Gets all the wallets of the client
        transactionService
          .getWallets()
          .then((res) => {
            // Sets the available wallets, the transactions are fetched later
            setWallets(res.data);
          })
          .catch(() => {
            // console.log(err.response);
          });
      }
    };
    firstLoad();
  }, []);

  // Code that is run everytime the Wallets or the Transactions change
  useEffect(() => {
    setReport();
  }, [wallets, transactions]);

  // Code that is run everytime the selectedWalletId changes
  useEffect(() => {
    loadTransactions(selectedWallet_id, dataMonth);
  }, [selectedWallet_id, dataMonth]);

  // Adds a transaction to the list and recalculates the totals
  const addTransaction = (transaction: Objects.Transaction): void => {
    setTransactions([...transactions, transaction]);
    setHeaderTotal(
      headerTotal + (transaction.category.type === 'Income' ? transaction.amount : -1 * transaction.amount),
    );
  };

  // Edits a transaction from the list and recalculates the totals
  const editTransaction = (transaction: Objects.Transaction): void => {
    // First, filters out the transaction
    let editedTransactions = transactions.filter((o) => o._id !== transaction._id);

    // Then adds it back if it is in the selected wallets and in the dataMonth
    if (
      (selectedWallet_id === '-1' || selectedWallet_id === transaction.wallet_id) &&
      dataMonth ===
        `${transaction.transactionDate.toString().substr(0, 4)}${transaction.transactionDate.toString().substr(5, 2)}`
    ) {
      editedTransactions = [...editedTransactions, transaction];
    }

    setTransactions(editedTransactions);
  };

  // Removes a transaction from the list
  const deleteTransaction = (transaction: Objects.Transaction): void => {
    setTransactions(transactions.filter((o) => o._id !== transaction._id));
  };

  // Gets the transactions from the API of the selected wallet
  const loadTransactions = async (walletId: string, dataMonth: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId, dataMonth);
    setTransactions(res.data);
  };

  // Reads the transactions and separates the income and expenses as well as the total in the header
  const setReport = (): void => {
    let earnings = 0;
    let expenses = 0;

    transactions.map((transaction) => {
      if (transaction.category.type === 'Income') {
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
        nHeaderTotal += w.money || 0;
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
          {wallets.map((wallet: Objects.Wallet) => (
            <option value={wallet._id} key={wallet._id}>
              {wallet.name}
            </option>
          ))}
        </select>
        <div>{headerTotal}</div>
      </div>
      <Button accent className="Wallets__AddTop" onClick={() => setAddModal(true)}>
        Add Transaction
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
            <DataMonthSelector dataMonth={dataMonth} setDataMonth={setDataMonth} />
            <TransactionViewer
              wallets={wallets}
              transactions={transactions}
              edit={editTransaction}
              delete={deleteTransaction}
            />
          </div>
        )}
      </div>
    </Page>
  );
};

export default Home;
