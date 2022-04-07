/** NewTransactionForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new transaction, it is a modal
 */
import React, { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Objects } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';
import CategoryService from '../../Services/CategoryService';

// Utilities
import CheckNested from '../../Utils/CheckNested';
import Errorbox from '../../Components/ErrorBox';
import { Wallet } from '../../models/objects';

interface Props {
  addTransaction: (transaction: Objects.Transaction) => void;
  deleteTransaction?: (transaction: Objects.Transaction) => void;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  wallets: Objects.Wallet[];
  selectedWallet: string | null;
  initialTransaction?: Objects.Transaction;
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
  const [deleteWarn, setDeleteWarn] = useState(false);
  const [walletSelector, setWalletSelector] = useState(false);

  const newTransactionForm = UseForm(newTransactionCallback, {
    wallet_id: props.initialTransaction?.wallet_id || props.selectedWallet || '',
    category_id: props.initialTransaction?.category._id || '-1',
    concept: props.initialTransaction?.concept || '',
    amount: props.initialTransaction?.amount || '',
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
    console.log(newTransactionForm.values);
    // try {
    //   // If no wallet was entered, returns an error
    //   if (newTransactionForm.values.wallet_id === '' || newTransactionForm.values.wallet_id === '-1') {
    //     setErrors({ wallet_id: 'Select a wallet' });
    //     return;
    //   }

    //   // If no category was entered, returns an error
    //   if (newTransactionForm.values.category_id === '' || newTransactionForm.values.category_id === '-1') {
    //     setErrors({ wallet_id: 'Select a category' });
    //     return;
    //   }

    //   // Sends the transaction to the API
    //   const res = await transactionService.newTransaction(newTransactionForm.values);

    //   // Clears the form, adds the transaction to the list and closes the modal
    //   newTransactionForm.clear();

    //   if (res.data.wallet_id === props.selectedWallet || props.selectedWallet === null) props.addTransaction(res.data);

    //   props.setState(false);
    // } catch (err: any) {
    //   if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
    //   else console.log(err); //eslint-disable-line no-console
    // }
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

  async function deleteTransaction() {
    try {
      if (!props.initialTransaction)
        throw {
          response: `Somehow you managed to delete a transaction without an initial transaction, stop messing with the app pls`,
        };

      await transactionService.deleteTransaction(props.initialTransaction._id);

      if (props.deleteTransaction) props.deleteTransaction(props.initialTransaction);
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  return (
    <>
      {/* Main transaction form */}
      <Modal
        showModal={props.state}
        setModal={props.setState}
        title={props.initialTransaction ? 'Edit Transaction' : 'New Transaction'}
        accept={acceptIcon}
        onAccept={() => {
          props.initialTransaction ? editTransactionCallback() : newTransactionCallback();
        }}
        onClose={() => {
          newTransactionForm.clear();
          setErrors([]);
        }}
      >
        <div className="NewTransactionForm">
          {/* Main Transaction data */}
          <div className="NewTransactionForm__Content">
            {/* Form */}
            <form onSubmit={newTransactionForm.onSubmit}>
              <Input
                error={errors.amount ? true : false}
                label="Amount"
                name="amount"
                type="number"
                value={newTransactionForm.values.amount}
                onChange={newTransactionForm.onChange}
              />
              <CategorySelector />
              <Input
                error={errors.name ? true : false}
                label="Concept"
                name="concept"
                type="text"
                value={newTransactionForm.values.concept}
                onChange={newTransactionForm.onChange}
              />
              <div className="NewTransactionForm__Content__Splitted" onClick={() => setWalletSelector(true)}>
                <div
                  className={
                    errors.category ? 'NewTransactionForm__WalletSelector error' : 'NewTransactionForm__WalletSelector'
                  }
                >
                  <div className="NewTransactionForm__WalletSelector__Icon" />
                  <div className="NewTransactionForm__WalletSelector__Name">Wallet</div>
                  <div className="NewTransactionForm__WalletSelector__Triangle" />
                </div>
                <div className="NewTransactionForm__Content__Date">
                  <Input
                    error={errors.transactionDate ? true : false}
                    label="Date"
                    name="transactionDate"
                    type="text"
                    value={newTransactionForm.values.transactionDate}
                    onChange={newTransactionForm.onChange}
                  />
                </div>
              </div>
              {/* <div className="Transactions__New__Modal__Bar">
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
                  {props.wallets.map((wallet: Objects.Wallet) => (
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
                  {categories.Expense.map((category: Objects.Category) => (
                    <option value={category._id} key={category._id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="-Income" disabled>
                    INCOME
                  </option>
                  {categories.Income.map((category: Objects.Category) => (
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
              </div> */}
            </form>

            {/* Error Box */}
            <Errorbox errors={errors} setErrors={setErrors} />
          </div>

          {/* Delete Transaction button */}
          {props.initialTransaction && (
            <div>
              <Button warn className="NewTransactionForm__Delete" onClick={() => setDeleteWarn(true)}>
                <>
                  <div className="NewTransactionForm__Delete__Icon">
                    <FaIcons.FaTrashAlt />
                  </div>
                  Delete Transaction
                </>
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Wallet selector modal */}
      <Modal showModal={walletSelector} setModal={setWalletSelector} title="Select Wallet">
        <div className="NewTrnsactionForm__WalletSelector__Container">
          {props.wallets.map((wallet: Wallet) => (
            <div id={wallet._id}>{wallet.name}</div>
          ))}
        </div>
      </Modal>

      {props.initialTransaction && (
        <Modal float setModal={setDeleteWarn} showModal={deleteWarn} accept="Delete" onAccept={deleteTransaction}>
          <>
            <p>Are you sure you want to delete this transaction?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

const CategorySelector = (): JSX.Element => {
  return <div>Selector</div>;
};

export default NewTransactionForm;
