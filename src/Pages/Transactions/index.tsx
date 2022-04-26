/** Transactions.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Transactions Page for the App
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
import TransactionForm from './TransactionForm';

// Services
import TransactionService from '../../Services/TransactionService';
import CategoryService from '../../Services/CategoryService';

// Utilities
import GetParameters from '../../Utils/GetParameters';
import ParseDataMonth from '../../Utils/ParseDataMonth';

// Styles
import './Transactions.css';
import TransactionHeader from './TransactionsHeader';
import Loading from '../../Components/Loading';

const Transactions = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, wallets, dispatchWallets, dispatchCategories } =
    useContext(AuthenticationTokenStore);
  const navigate = useNavigate();
  const location = useLocation();

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);
  const categoryService = new CategoryService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
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
        // Gets all the wallets of the client
        transactionService
          .getWallets()
          .then((res) => {
            // Sets the available wallets, the transactions are fetched later
            dispatchWallets({ type: 'SET', payload: { wallets: res.data } });
            setLoaded(true);
          })
          .catch(() => {
            // console.log(err.response);
            setLoaded(true);
          });

        // Gets all the categories
        categoryService.getCategories().then((catRes) => {
          dispatchCategories({
            type: 'UPDATE',
            payload: catRes.data,
          });
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
    if (selectedWallet_id === '-1' || selectedWallet_id === transaction.wallet_id) {
      setTransactions([...transactions, transaction]);
      setHeaderTotal(
        headerTotal + (transaction.category.type === 'Income' ? transaction.amount : -1 * transaction.amount),
      );
    }

    // Updates the wallets
    updateWalletAmounts(transaction);
  };

  // Edits a transaction from the list and recalculates the totals
  const editTransaction = (newTransaction: Objects.Transaction, oldTransaction: Objects.Transaction): void => {
    if (selectedWallet_id === '-1' || selectedWallet_id === newTransaction.wallet_id) {
      // First, filters out the transaction
      let editedTransactions = transactions.filter((o) => o._id !== newTransaction._id);
      // Then adds it back if it is in the selected wallets and in the dataMonth
      if (
        (selectedWallet_id === '-1' || selectedWallet_id === newTransaction.wallet_id.toString()) &&
        dataMonth ===
          `${newTransaction.transactionDate.toString().substring(0, 4)}${newTransaction.transactionDate
            .toString()
            .substring(5, 7)}`
      ) {
        editedTransactions = [...editedTransactions, newTransaction];
      }

      setTransactions(editedTransactions);
    }
    updateWalletAmounts(oldTransaction, true, newTransaction);
  };

  // Removes a transaction from the list
  const deleteTransaction = (transaction: Objects.Transaction): void => {
    setTransactions(transactions.filter((o) => o._id !== transaction._id));

    updateWalletAmounts(transaction, true);
  };

  // Gets the transactions from the API of the selected wallet
  const loadTransactions = async (walletId: string, dataMonth: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId, dataMonth, setLoadingTransactions);
    setTransactions(res.data);
  };

  // Reads the transactions and separates the income and expenses as well as the total in the header
  const setReport = (): void => {
    let earnings = 0;
    let expenses = 0;

    transactions.map((transaction) => {
      if (!transaction.excludeFromReport && !(transaction.transfer_id && selectedWallet_id === '-1')) {
        if (transaction.category.type === 'Income') {
          earnings += transaction.amount;
        } else {
          expenses += transaction.amount;
        }
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
  const changeSelectedWallet = (data: string): void => {
    if (data !== selectedWallet_id) {
      navigate(`/home?wallet=${data}`);
      setSelectedWalletId(data);
    }
  };

  // Updates the wallets amount given a Transaction
  const updateWalletAmounts = (
    transaction: Objects.Transaction,
    reverse = false,
    newTransaction?: Objects.Transaction,
  ): void => {
    const newWallets: Objects.Wallet[] = wallets;
    for (let i = 0; i < newWallets.length; i++) {
      if (newWallets[i]._id === transaction.wallet_id) {
        if (reverse) {
          newWallets[i].money =
            (newWallets[i].money || 0) -
            (transaction.category.type === 'Income' ? transaction.amount : -1 * transaction.amount);
        } else {
          newWallets[i].money =
            (newWallets[i].money || 0) +
            (transaction.category.type === 'Income' ? transaction.amount : -1 * transaction.amount);
        }
      }
    }

    // New transaction in case it exists
    if (newTransaction) {
      for (let i = 0; i < newWallets.length; i++) {
        if (newWallets[i]._id === newTransaction.wallet_id) {
          if (!reverse) {
            newWallets[i].money =
              (newWallets[i].money || 0) -
              (newTransaction.category.type === 'Income' ? newTransaction.amount : -1 * newTransaction.amount);
          } else {
            newWallets[i].money =
              (newWallets[i].money || 0) +
              (newTransaction.category.type === 'Income' ? newTransaction.amount : -1 * newTransaction.amount);
          }
        }
      }
    }

    dispatchWallets({ type: 'SET', payload: { wallets: newWallets } });
  };

  // Extracted HTML components
  const header =
    loaded && wallets.length > 0 ? (
      <TransactionHeader selectedWallet_id={selectedWallet_id} onChange={changeSelectedWallet} />
    ) : (
      <></>
    );

  return (
    <Page loading={!loaded} header={header} selected="Transactions">
      {loaded ? (
        <div className="Transactions">
          {wallets.length == 0 ? (
            <RedirectToWallets />
          ) : (
            <>
              <div className="Transactions__Content">
                <DataMonthSelector dataMonth={dataMonth} setDataMonth={setDataMonth} />
                {!loadingTransactions ? (
                  <>
                    {transactions.length > 0 && <WalletTotals totals={monthTotals} />}
                    <TransactionViewer transactions={transactions} edit={editTransaction} delete={deleteTransaction} />
                  </>
                ) : (
                  <div className="Transactions__Content__Loading">
                    <Loading className="Transactions__Spinner" />
                  </div>
                )}
              </div>
              <Button accent round className="Wallets__AddFloat" onClick={() => setAddModal(true)}>
                <FaIcons.FaPlus />
              </Button>
              <TransactionForm
                state={addModal}
                setState={setAddModal}
                addTransaction={addTransaction}
                selectedWallet={selectedWallet_id}
              />
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </Page>
  );
};

export default Transactions;
