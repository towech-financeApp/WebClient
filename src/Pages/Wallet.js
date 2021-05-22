/** Wallet.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * 
 * Page that shows a wallets content
*/
import React, { useContext, useEffect, useState, } from 'react';
import { useParams } from "react-router-dom";

// Hooks
import { AuthenticationTokenStore, } from '../Hooks/ContextStore';

// Services
import TransactionService from '../Services/TransactionService';

// Utilities
import { useForm } from '../Hooks/useForm';
import checkNested from '../Utils/checkNested';


const Wallet = (props) => {
  // Params
  const { walletid } = useParams();

  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Services
  const transactionService = new TransactionService(authToken.token, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [wallet, setWallet] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Create transaction form
  const newTransactionForm = useForm(newTransactionCallback, {
    walletId: parseInt(walletid),
    concept: '',
    amount: 0,
    transactionDate: '',
  });

  // Main API call
  useEffect(() => {
    const firstLoad = async () => {
      if (!loaded) {
        setLoaded(true);
        transactionService.getWalletTransactions(walletid, null)
          .then(res =>{
            setWallet(res.data.wallet);
            setTransactions(res.data.transactions);
          })
          .catch(err => {
            // If it is a forbidden error, goes back to home
            if (err.response.status === 403) { props.history.push('/home') }
            console.log(err.response);
          })
      }
    };
    firstLoad();
  });

  // Callbacks
  async function newTransactionCallback() {
    try {
      console.log(newTransactionForm.values);
      const res = await transactionService.newTransaction(newTransactionForm.values, null);

      newTransactionForm.clear();

      setTransactions([...transactions, res.data]);
    }
    catch (err) {
      if (checkNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      console.log(err.response);
    }
  };

  return (
    <>
      <h3>Wallet</h3>
      <p>{JSON.stringify(wallet)}</p>
      <h4>Create Transaction</h4>
      <form onSubmit={newTransactionForm.onSubmit}>
      <input
          label='Concept'
          placeholder='Concept'
          name='concept'
          type='text'
          value={newTransactionForm.values.concept}
          //error={errors.concept ? true : false}
          onChange={newTransactionForm.onChange}
        />
        <input
          label='Amount'
          placeholder='0'
          name='amount'
          type='text'
          value={newTransactionForm.values.amount}
          //error={errors.amount ? true : false}
          onChange={newTransactionForm.onChange}
        />
        <input
          label='Date'
          placeholder='YYYY-MM-DD'
          name='transactionDate'
          type='text'
          value={newTransactionForm.values.transactionDate}
          //error={errors.transactionDate ? true : false}
          onChange={newTransactionForm.onChange}
        />
        <input type="submit" value="Create" />
      </form>
      <h4>Transactions</h4>
      {transactions.map(transaction => (
        <div key={transaction.transactionid}>
          <p>
            {transaction.concept} Amount:{transaction.amount} Date:{transaction.transactiondate}
          </p>
        </div>
      ))}
      
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

export default Wallet
