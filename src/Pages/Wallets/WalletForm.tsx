/** WalletForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding or editing a Wallet, it is a modal
 */
import React, { useContext, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import Errorbox from '../../Components/ErrorBox';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Objects } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Wallets.css';
import Button from '../../Components/Button';

interface Props {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialWallet?: Objects.Wallet;
}

const WalletForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, dispatchWallets } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [deleteWarn, setDeleteWarn] = useState(false);

  // Creates the new walletForm
  const walletForm = UseForm(null, {
    name: props.initialWallet?.name || '',
    money: props.initialWallet?.money?.toString() || '0',
    currency: props.initialWallet?.currency || 'MXN',
  });

  // Functions
  async function newWalletCallback() {
    try {
      // Sends the wallet to the API
      const res = await transactionService.newWallet(walletForm.values, setLoading);

      // Clears the form, sets wallets and closes the modal
      walletForm.clear();
      dispatchWallets({ type: 'ADD', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function editWalletCallback() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to edit a wallet without an initial wallet, stop messing with the app pls`,
        };

      const editedWallet = walletForm.values as Objects.Wallet;
      editedWallet._id = props.initialWallet._id;

      // Sends the wallet to the API
      const res = await transactionService.editWallet(editedWallet, setLoading);

      // Sets the wallet and closes the modal
      dispatchWallets({ type: 'EDIT', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      // If there is a 304 status, then the modal is closed
      if (err.response.status == 304) props.set(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function deleteWallet() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to delete a wallet without an initial wallet, stop messing with the app pls`,
        };

      await transactionService.deleteWallet(props.initialWallet._id, setLoading);

      dispatchWallets({ type: 'DELETE', payload: { wallets: [props.initialWallet] } });
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  return (
    <>
      <Modal
        showModal={props.state}
        setModal={props.set}
        loading={loading}
        title={props.initialWallet ? 'Edit Wallet' : 'New Wallet'}
        accept={acceptIcon}
        onAccept={() => {
          props.initialWallet ? editWalletCallback() : newWalletCallback();
        }}
        onClose={() => {
          walletForm.clear();
          setErrors([]);
        }}
      >
        <div className="NewWalletForm">
          {/* Main Wallet data */}
          <div className="NewWalletForm__MainWallet">
            {/* Form */}
            <div className="NewWalletForm__MainWallet__FirstRow">
              <div className="NewWalletForm__MainWallet__FirstRow__Icon" />
              <Input
                error={errors.name ? true : false}
                label="Name"
                name="name"
                type="text"
                value={walletForm.values.name}
                onChange={walletForm.onChange}
              />
            </div>
            <div className="NewWalletForm__MainWallet__SecondRow">
              <div className="NewWalletForm__MainWallet__SecondRow__Money">
                <Input
                  error={errors.amount ? true : false}
                  name="money"
                  type="number"
                  label="Money"
                  disabled={props.initialWallet ? true : false}
                  value={walletForm.values.money}
                  onChange={walletForm.onChange}
                />
              </div>
              <div className="NewWalletForm__MainWallet__SecondRow__Currency">
                <Input
                  error={errors.currency ? true : false}
                  name="currency"
                  type="text"
                  label="Currency"
                  value={walletForm.values.currency}
                  onChange={walletForm.onChange}
                />
              </div>
            </div>

            {/* Error Box */}
            <Errorbox errors={errors} setErrors={setErrors}></Errorbox>
          </div>

          {props.initialWallet && (
            <div>
              <Button warn className="NewWalletForm__Delete" onClick={() => setDeleteWarn(true)}>
                <>
                  <div className="NewWalletForm__Delete__Icon">
                    <FaIcons.FaTrashAlt />
                  </div>
                  Delete Wallet
                </>
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {props.initialWallet && (
        <Modal float setModal={setDeleteWarn} showModal={deleteWarn} accept="Delete" onAccept={deleteWallet}>
          <>
            <p>Are you sure you want to delete the wallet: {props.initialWallet.name}?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

export default WalletForm;