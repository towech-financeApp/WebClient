/** NewTransactionForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new transaction, it is a modal
 */
import React, { useContext, useEffect, useState } from 'react';

// Components
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Category, Transaction, Wallet } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';
import CategoryService from '../../Services/CategoryService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

interface Props {
  addTransaction: (transaction: Transaction) => void;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  wallets: Wallet[];
  selectedWallet: string | null;
  initialTransaction?: Transaction;
}

const NewTransactionForm = (props: Props): JSX.Element => {
  // Authentication Token Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the servicees
  const transactionService = new TransactionService(authToken, dispatchAuthToken);
  const categoryService = new CategoryService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);
  const [categories, setCategories] = useState({ Income: [], Expense: [] });

  const newTransactionForm = UseForm(newTransactionCallback, {
    wallet_id: props.initialTransaction?.wallet_id || props.selectedWallet || '',
    category_id: props.initialTransaction?.category._id || '-1',
    concept: props.initialTransaction?.concept || '',
    amount: props.initialTransaction?.amount || 0,
    transactionDate:
      props.initialTransaction?.transactionDate?.toString().substr(0, 10) ||
      `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date()
        .getDate()
        .toString()
        .padStart(2, '0')}`,
  });

  // Calls the service for the categories
  // TODO: Needs to be optimized with a cache
  useEffect(() => {
    if (props.state == true) {
      categoryService.getCategories().then((res) => {
        setCategories({
          Income: res.data.Income,
          Expense: res.data.Expense,
        });
      });
    }
  }, [props.state]);

  // Functions
  async function newTransactionCallback() {
    try {
      // If no wallet was entered, returns an error
      if (newTransactionForm.values.wallet_id === '' || newTransactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // If no category was entered, returns an error
      if (newTransactionForm.values.category_id === '' || newTransactionForm.values.category_id === '-1') {
        setErrors({ wallet_id: 'Select a category' });
        return;
      }

      // Sends the transaction to the API
      const res = await transactionService.newTransaction(newTransactionForm.values);

      // Clears the form, adds the transaction to the list and closes the modal
      newTransactionForm.clear();

      if (res.data.wallet_id === props.selectedWallet || props.selectedWallet === null) props.addTransaction(res.data);

      props.setState(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err); //eslint-disable-line no-console
    }
  }

  async function editTransactionCallback() {
    try {
      // If no wallet was entered, returns an error
      if (newTransactionForm.values.wallet_id === '' || newTransactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // Sends the transaction to the API
      const res = await transactionService.editTransaction(
        props.initialTransaction?._id || '',
        newTransactionForm.values,
      );

      props.setState(false);

      props.addTransaction(res.data);
    } catch (err: any) {
      if (err.response.status === 304) props.setState(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); //eslint-disable-line no-console
    }
  }

  return (
    <div className="Transactions__New__Modal">
      <Modal
        showModal={props.state}
        setModal={props.setState}
        title={props.initialTransaction ? 'Edit Transaction' : 'New Transaction'}
        accept={props.initialTransaction ? 'Save' : 'Create'}
        onAccept={() => {
          props.initialTransaction ? editTransactionCallback() : newTransactionCallback();
        }}
        onClose={() => {
          newTransactionForm.clear();
          setErrors([]);
        }}
      >
        <form onSubmit={newTransactionForm.onSubmit}>
          <div className="Transactions__New__Modal__Bar">
            <Input
              error={errors.transactionDate ? true : false}
              label="Date"
              name="transactionDate"
              type="text"
              value={newTransactionForm.values.transactionDate}
              onChange={newTransactionForm.onChange}
            />
            <Input
              error={errors.amount ? true : false}
              label="Amount"
              name="amount"
              type="number"
              value={newTransactionForm.values.amount}
              onChange={newTransactionForm.onChange}
            />
          </div>
          <div className="Transactions__New__Modal__Bar">
            <select
              name="wallet_id"
              onChange={newTransactionForm.onChange}
              defaultValue={newTransactionForm.values.wallet_id}
            >
              <option value="-1" disabled>
                Select Wallet
              </option>
              {props.wallets.map((wallet: Wallet) => (
                <option value={wallet._id} key={wallet._id}>
                  {wallet.name}
                </option>
              ))}
            </select>
            <select 
              name="category_id"
              onChange={newTransactionForm.onChange}
              defaultValue={newTransactionForm.values.category_id}
            >
              <option value="-1" disabled>
                Select Category
              </option>
              <option value="-Expense" disabled>
                EXPENSE
              </option>
              {categories.Expense.map((category: Category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
              <option value="-Income" disabled>
                INCOME
              </option>
              {categories.Income.map((category: Category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Input
              error={errors.name ? true : false}
              label="Concept"
              name="concept"
              type="text"
              value={newTransactionForm.values.concept}
              onChange={newTransactionForm.onChange}
            />
          </div>
        </form>
        <div>
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
      </Modal>
    </div>
  );
};

export default NewTransactionForm;
