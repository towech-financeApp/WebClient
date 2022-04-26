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
import Checkbox from '../../Components/Checkbox';

interface Props {
  addTransaction?: (transaction: Objects.Transaction) => void;
  editTransaction?: (newTransaction: Objects.Transaction, oldTransaction: Objects.Transaction) => void;
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
  const [categories, setCategories] = useState({ Income: [] as Objects.Category[], Expense: [] as Objects.Category[] });
  const [deleteWarn, setDeleteWarn] = useState(false);
  // Category Selector Hooks
  const [categorySelector, setCategorySelector] = useState(false);
  const [categoryType, setCategoryType] = useState(1);
  const [selectCat, setSelectCat] = useState(null as Objects.Category | null);

  const transactionForm = UseForm(null, {
    wallet_id: props.initialTransaction?.wallet_id || props.selectedWallet || '',
    category_id: props.initialTransaction?.category._id || '-1',
    concept: props.initialTransaction?.concept || '',
    amount: props.initialTransaction?.amount || '',
    excludeFromReport: props.initialTransaction?.excludeFromReport || false,
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
      // Fetches the categories
      categoryService.getCategories().then((res) => {
        setCategories({
          Income: res.data.Income,
          Expense: res.data.Expense,
        });

        // Set selected wallet and category for edit
        if (props.initialTransaction) {
          setSelectedCategory(props.initialTransaction.category._id);
        } else {
          setSelectedCategory('-1');
        }
      });
    }
  }, [props.state]);

  function setSelectedCategory(id: string) {
    const allCats = [...categories.Expense, ...categories.Income];
    let selected: Objects.Category | undefined;

    switch (id) {
      case '-2':
        selected = { _id: '-2', name: 'Transfer', type: 'Expense', user_id: '-1', parent_id: '-1' };
        break;
      default:
        selected = allCats.find((cat) => cat._id === id);
    }

    transactionForm.values.category_id = id;
    setSelectCat(selected || null);
    setCategorySelector(false);
  }

  async function newTransactionCallback() {
    try {
      console.log(transactionForm.values);
      // if (newTransactionForm.values.category_id === '-2') {
      //   return console.log('Transfer');
      // }

      // // If no wallet was entered, returns an error
      // if (newTransactionForm.values.wallet_id === '' || newTransactionForm.values.wallet_id === '-1') {
      //   setErrors({ wallet_id: 'Select a wallet' });
      //   return;
      // }

      // // If no category was entered, returns an error
      // if (newTransactionForm.values.category_id === '' || newTransactionForm.values.category_id === '-1') {
      //   setErrors({ wallet_id: 'Select a category' });
      //   return;
      // }

      // // Sends the transaction to the API
      // const res = await transactionService.newTransaction(newTransactionForm.values);

      // // Clears the form, adds the transaction to the list and closes the modal
      // newTransactionForm.clear();

      // if (props.addTransaction) props.addTransaction(res.data);

      // props.setState(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err); //eslint-disable-line no-console
    }
  }

  async function editTransactionCallback() {
    try {
      if (transactionForm.values.category_id === '-2') {
        return;
      }

      // If no wallet was entered, returns an error
      if (transactionForm.values.wallet_id === '' || transactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // Sends the transaction to the API
      const res = await transactionService.editTransaction(props.initialTransaction?._id || '', transactionForm.values);

      props.setState(false);

      if (props.editTransaction)
        props.editTransaction(res.data, props.initialTransaction || ({} as Objects.Transaction));
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
          transactionForm.clear();
          setErrors([]);
        }}
      >
        <div className="NewTransactionForm">
          {/* Main Transaction data */}
          <div className="NewTransactionForm__Content">
            {/* Form */}
            <Input
              error={errors.amount ? true : false}
              label="Amount"
              name="amount"
              type="number"
              value={transactionForm.values.amount}
              onChange={transactionForm.onChange}
            />
            {/* Category selector */}
            <div
              className={
                props.initialTransaction?.transfer_id
                  ? 'NewTransactionForm__CategorySelector loading'
                  : 'NewTransactionForm__CategorySelector'
              }
              onClick={() => setCategorySelector(true)}
            >
              <div className="NewTransactionForm__CategorySelector__Icon" />
              <div className="NewTransactionForm__CategorySelector__Name">{selectCat?.name || 'Select Category'}</div>
              <div className="NewTransactionForm__CategorySelector__Triangle" />
            </div>

            {/* Regular and from wallet selector */}
            <WalletSelector
              wallets={props.wallets}
              onChange={transactionForm.onChange}
              name="wallet_id"
              value={transactionForm.values.wallet_id}
              visible={props.state}
            ></WalletSelector>

            {/* Concept field */}
            <Input
              error={errors.name ? true : false}
              label="Concept"
              name="concept"
              type="text"
              value={transactionForm.values.concept}
              onChange={transactionForm.onChange}
            />

            {/* Date field */}
            <Input
              error={errors.transactionDate ? true : false}
              label="Date"
              name="transactionDate"
              type="text"
              value={transactionForm.values.transactionDate}
              onChange={transactionForm.onChange}
            />
            {/* Exclude from report checkbox */}
            <Checkbox
              dark
              checked={transactionForm.values.excludeFromReport}
              name="excludeFromReport"
              label="Exclude transaction from report"
              onChange={transactionForm.onChange}
            ></Checkbox>

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

      {/* Category selector modal */}
      <Modal setModal={setCategorySelector} showModal={categorySelector}>
        <>
          <div className="NewTransactionForm__CategorySelector__Container">
            {!props.initialTransaction && (
              <div className={categoryType === 0 ? 'selected' : ''} onClick={() => setCategoryType(0)}>
                Other
              </div>
            )}
            <div className={categoryType === 1 ? 'selected' : ''} onClick={() => setCategoryType(1)}>
              Income
            </div>
            <div className={categoryType === 2 ? 'selected' : ''} onClick={() => setCategoryType(2)}>
              Expense
            </div>
          </div>
          <div className="NewTransactionForm__CategorySelector__ListContainer">
            {categoryType === 0 ? (
              <>
                <div
                  className="NewTransactionForm__CategorySelector__Category"
                  key="-2"
                  onClick={() => setSelectedCategory('-2')}
                >
                  <div className="NewTransactionForm__CategorySelector__Category__Icon" />
                  <div className="NewTransactionForm__CategorySelector__Category__Name">Transfer</div>
                </div>
              </>
            ) : categoryType === 1 ? (
              categories.Income.map((cat: Objects.Category) => (
                <div
                  className="NewTransactionForm__CategorySelector__Category"
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  <div className="NewTransactionForm__CategorySelector__Category__Icon" />
                  <div className="NewTransactionForm__CategorySelector__Category__Name">{cat.name}</div>
                </div>
              ))
            ) : (
              categories.Expense.map((cat: Objects.Category) => (
                <div
                  className="NewTransactionForm__CategorySelector__Category"
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  <div className="NewTransactionForm__CategorySelector__Category__Icon" />
                  <div className="NewTransactionForm__CategorySelector__Category__Name">{cat.name}</div>
                </div>
              ))
            )}
          </div>
        </>
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

interface WalletSelectorProps {
  error?: boolean;
  wallets: Objects.Wallet[];
  value?: string;
  onChange?: any;
  name?: string;
  visible: boolean;
}

const WalletSelector = (props: WalletSelectorProps): JSX.Element => {
  // Hooks
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null as Objects.Wallet | null);

  // Start useEffect only updates the when the form is visible
  useEffect(() => {
    if (props.visible) {
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible]);

  // Functions
  const searchAndSetView = (id: string): void => {
    const p = props.wallets.find((wallet) => wallet._id === id);
    setSelectedWallet(p || null);
  };

  const setWalletCallback = (id: string): void => {
    searchAndSetView(id);
    props.onChange({
      target: {
        type: 'custom-select',
        name: props.name,
        value: id,
      },
    });
    setShowModal(false);
  };

  return (
    <>
      <div
        className={props.error ? 'NewTransactionForm__WalletSelector error' : 'NewTransactionForm__WalletSelector'}
        onClick={() => setShowModal(true)}
      >
        <div className="NewTransactionForm__WalletSelector__Icon" />
        <div className="NewTransactionForm__WalletSelector__Name">{selectedWallet?.name || 'Select Wallet'}</div>
        <div className="NewTransactionForm__WalletSelector__Triangle" />
      </div>

      <div className="NewTransactionForm__WalletSelector__Modal">
        <Modal showModal={showModal} setModal={setShowModal} title="Select Wallet">
          <div className="NewTransactionForm__WalletSelector__Container">
            {props.wallets.map((wallet: Objects.Wallet) => (
              <div
                className="NewTransactionForm__WalletSelector__Wallet"
                key={wallet._id}
                onClick={() => setWalletCallback(wallet._id)}
              >
                <div className="NewTransactionForm__WalletSelector__Wallet__Container">
                  <div className="NewTransactionForm__WalletSelector__Wallet__Icon" />
                  <div className="NewTransactionForm__WalletSelector__Wallet__Name">{wallet.name}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default NewTransactionForm;
