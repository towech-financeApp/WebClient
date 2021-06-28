/** Wallet.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Page that shows a wallets content
 */
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Hooks
import { AuthenticationTokenStore } from '../Hooks/ContextStore';

// Models
import { Transaction, Wallet } from '../models';

// Services
import TransactionService from '../Services/TransactionService';

// Utilities
import UseForm from '../Hooks/UseForm';
import CheckNested from '../Utils/CheckNested';

const WalletPage = (props: any): JSX.Element => {
  // Params
  const { walletid } = useParams<{ walletid: string }>();

  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  const [wallet, setWallet] = useState({} as Wallet);
  const [transactions, setTransactions] = useState([] as Transaction[]);

  // Create transaction form
  const newTransactionForm = UseForm(newTransactionCallback, {
    wallet_id: walletid,
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
          .getWalletTransactions(walletid)
          .then((res) => {
            setWallet(res.data.wallet);
            setTransactions(res.data.transactions);
          })
          .catch((err) => {
            // If it is a forbidden error, goes back to home
            if (err.response.status === 403) {
              props.history.push('/home');
            }
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

  return (
    <>
      <h3>Wallet</h3>
      <p>{JSON.stringify(wallet)}</p>
      <h4>Create Transaction</h4>
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
      <h4>Transactions</h4>
      {transactions.map((transaction) => (
        <div key={transaction._id}>
          <p>
            {transaction.concept} Amount:{transaction.amount} Date:{transaction.transactionDate}
          </p>
        </div>
      ))}

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
    </>
  );
};

export default WalletPage;
