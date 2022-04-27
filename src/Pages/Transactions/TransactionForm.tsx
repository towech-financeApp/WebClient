/** NewTransactionForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new transaction, it is a modal
 */
import React, { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import { MainStore, TransactionPageStore } from '../../Hooks/ContextStore';
import UseForm from '../../Hooks/UseForm';

// Models
import { Objects } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';
import Errorbox from '../../Components/ErrorBox';
import Checkbox from '../../Components/Checkbox';

interface Props {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialTransaction?: Objects.Transaction;
}

const TransactionForm = (props: Props): JSX.Element => {
  // Authentication Token Context
  const { authToken, dispatchAuthToken, dispatchWallets } = useContext(MainStore);
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);

  // Starts the servicees
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [deleteWarn, setDeleteWarn] = useState(false);

  const transactionForm = UseForm(null, {
    wallet_id: props.initialTransaction?.wallet_id || transactionState.selectedWallet || '',
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

  async function newTransactionCallback() {
    try {
      // console.log(transactionForm.values);
      // if (transactionForm.values.category_id === '-2') {
      //   return //console.log('Transfer');
      // }

      // If no wallet was entered, returns an error
      if (transactionForm.values.wallet_id === '' || transactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // If no category was entered, returns an error
      if (transactionForm.values.category_id === '' || transactionForm.values.category_id === '-1') {
        setErrors({ wallet_id: 'Select a category' });
        return;
      }

      // Sends the transaction to the API
      setLoading(true);
      const res = await transactionService.newTransaction(transactionForm.values);
      setLoading(false);

      // Clears the form, adds the transaction to the list and closes the modal
      transactionForm.clear();

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: [], updateAmount: { new: [res.data] } },
      });
      dispatchTransactionState({ type: 'ADD', payload: [res.data] });

      props.setState(false);
    } catch (err: any) {
      setLoading(false);
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
      setLoading(true);
      const res = await transactionService.editTransaction(props.initialTransaction?._id || '', transactionForm.values);
      setLoading(false);

      props.setState(false);

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: {
          wallets: [],
          updateAmount: { new: [res.data], old: props.initialTransaction ? [props.initialTransaction] : [] },
        },
      });

      dispatchTransactionState({ type: 'EDIT', payload: [res.data] });
    } catch (err: any) {
      setLoading(false);
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

      setLoading(true);
      await transactionService.deleteTransaction(props.initialTransaction._id);
      setLoading(false);

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: [], updateAmount: { new: [props.initialTransaction], reverse: true } },
      });
      dispatchTransactionState({ type: 'DELETE', payload: [props.initialTransaction] });
    } catch (err: any) {
      setLoading(false);
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
        loading={loading}
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
            <CategorySelector
              edit={props.initialTransaction ? true : false}
              error={errors.category_id ? true : false}
              name="category_id"
              onChange={transactionForm.onChange}
              transfer={props.initialTransaction?.transfer_id ? true : false}
              value={transactionForm.values.category_id}
              visible={props.state}
            ></CategorySelector>

            {/* Regular and from wallet selector */}
            <WalletSelector
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

      {/* delete transaction Modal */}
      {props.initialTransaction && (
        <Modal
          float
          setModal={setDeleteWarn}
          showModal={deleteWarn}
          accept="Delete"
          onAccept={deleteTransaction}
          loading={loading}
        >
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
  value?: string;
  onChange?: any;
  name?: string;
  visible: boolean;
}

const WalletSelector = (props: WalletSelectorProps): JSX.Element => {
  const { wallets } = useContext(MainStore);

  // Hooks
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null as Objects.Wallet | null);

  // Start useEffect only updates the when the form is visible
  useEffect(() => {
    if (props.visible && props.value !== (selectedWallet?._id || '-1')) {
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible]);

  // Functions
  const searchAndSetView = (id: string): void => {
    const p = wallets.find((wallet) => wallet._id === id);
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
            {wallets.map((wallet: Objects.Wallet) => (
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

interface CategorySelectorProps {
  error?: boolean;
  value?: string;
  onChange?: any;
  name?: string;
  visible: boolean;
  edit?: boolean;
  transfer?: boolean;
}

const CategorySelector = (props: CategorySelectorProps): JSX.Element => {
  const { categories } = useContext(MainStore);
  const [categoryType, setCategoryType] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null as Objects.Category | null);

  // Start useEffect only updates the when the form is visible
  useEffect(() => {
    if (props.visible && props.value !== (selectedCategory?._id || '-1')) {
      // TODO: When categories are editable, fetch to check if there are new ones
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible]);

  // Functions
  const searchAndSetView = (id: string): void => {
    const allCats = [...categories.Expense, ...categories.Income];
    let selected: Objects.Category | undefined;

    switch (id) {
      case '-2':
        selected = { _id: '-2', name: 'Transfer', type: 'Expense', user_id: '-1', parent_id: '-1' };
        break;
      default:
        selected = allCats.find((cat) => cat._id === id);
    }

    setSelectedCategory(selected || null);
  };

  const setCategoryCallback = (id: string): void => {
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
        className={
          props.transfer ? 'NewTransactionForm__CategorySelector loading' : 'NewTransactionForm__CategorySelector'
        }
        onClick={() => setShowModal(true)}
      >
        <div className="NewTransactionForm__CategorySelector__Icon" />
        <div className="NewTransactionForm__CategorySelector__Name">{selectedCategory?.name || 'Select Category'}</div>
        <div className="NewTransactionForm__CategorySelector__Triangle" />
      </div>

      <div className="NewTransactionForm__WalletSelector__Modal">
        <Modal setModal={setShowModal} showModal={showModal}>
          <>
            <div className="NewTransactionForm__CategorySelector__Container">
              {!props.edit && (
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
                    onClick={() => setCategoryCallback('-2')}
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
                    onClick={() => setCategoryCallback(cat._id)}
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
                    onClick={() => setCategoryCallback(cat._id)}
                  >
                    <div className="NewTransactionForm__CategorySelector__Category__Icon" />
                    <div className="NewTransactionForm__CategorySelector__Category__Name">{cat.name}</div>
                  </div>
                ))
              )}
            </div>
          </>
        </Modal>
      </div>
    </>
  );
};

export default TransactionForm;
