/** Home.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Models
import { Transaction, Wallet } from '../../models';

// Components
import Page from '../../Components/Page';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import UseForm from '../../Hooks/UseForm';
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Home.css';

const Home = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [reports, setReports] = useState({ earnings: 0, expenses: 0 });

  // Create transaction form
  const newTransactionForm = UseForm(newTransactionCallback, {
    wallet_id: '',
    concept: '',
    amount: 0,
    transactionDate: '',
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
            loadTransactions('-1');
          })
          .catch(() => {
            // console.log(err.response);
          });
      }
    };
    firstLoad();
  });

  // Callbacks
  async function newTransactionCallback() {
    try {
      const res = await transactionService.newTransaction(newTransactionForm.values);

      newTransactionForm.clear();

      setTransactions([...transactions, res.data]);
    } catch (err) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      // console.log(err.response);
    }
  }

  // functions
  const calculateTotal = (): number => {
    let total = 0;

    wallets.map((wallet) => (total += wallet.money));

    return total;
  };

  const loadTransactions = async (walletId: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId);
    setTransactions(res.data.transactions);

    setReport(res.data.transactions);
  };

  const setReport = (transArr: Transaction[]): void => {
    let earnings = 0;
    let expenses = 0;

    transArr.map((transaction) => {
      if (transaction.amount > 0) {
        earnings += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });

    setReports({ earnings, expenses });
  };

  const header = (
    <div>
      <div>Total: {calculateTotal()}</div>
      {wallets.map((wallet) => (
        <div key={wallet._id}>
          {wallet.name}: {wallet.money}
        </div>
      ))}
    </div>
  );

  return (
    <Page header={header}>
      <div className="contents">
        {wallets.length == 0 ? (
          <div>
            <p>
              You have no wallets, add one in <Link to="wallets">Wallets</Link>
            </p>
          </div>
        ) : (
          <>
            {/*Report of the month*/}
            <div>
              in: {reports.earnings}
              <br />
              out: {reports.expenses}
            </div>
            <br />
            {/*Transactions*/}
            <div>
              {transactions.map((transaction) => (
                <div key={transaction._id}>
                  {transaction.concept}: {transaction.amount}
                  <br />
                  wallet: {transaction.wallet_id}
                </div>
              ))}
            </div>
            <br />
            {/*Add transaction button*/}
            <button onClick={() => setModal(true)}>Add Transaction</button>
            {/*Create wallet form*/}
            {/*TODO: Make form a modal*/}
            <div className={modal ? 'contents__addForm active' : 'contents__addForm'}>
              <button
                onClick={() => {
                  setErrors([]);
                  setModal(false);
                }}
              >
                Close
              </button>
              <form onSubmit={newTransactionForm.onSubmit}>
                <input
                  //label='Concept'
                  placeholder="Concept"
                  name="concept"
                  type="text"
                  value={newTransactionForm.values.concept}
                  //error={errors.concept ? true : false}
                  onChange={newTransactionForm.onChange}
                />
                <input
                  //label='Amount'
                  placeholder="0"
                  name="amount"
                  type="text"
                  value={newTransactionForm.values.amount}
                  //error={errors.amount ? true : false}
                  onChange={newTransactionForm.onChange}
                />
                <input
                  //label='Amount'
                  placeholder="WalletId"
                  name="wallet_id"
                  type="text"
                  value={newTransactionForm.values.wallet_id}
                  //error={errors.amount ? true : false}
                  onChange={newTransactionForm.onChange}
                />
                <input
                  //label='Date'
                  placeholder="YYYY-MM-DD"
                  name="transactionDate"
                  type="text"
                  value={newTransactionForm.values.transactionDate}
                  //error={errors.transactionDate ? true : false}
                  onChange={newTransactionForm.onChange}
                />
                <input type="submit" value="Create" />
              </form>
              {/* Error box */}
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
          </>
        )}
      </div>
    </Page>
  );
};

export default Home;
