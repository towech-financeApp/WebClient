/** NewWalletForm.tsx
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

interface Props {
  addWallet: (wallet: Objects.Wallet) => void;
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
}

const NewWalletForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);

  // Creates the new walletForm
  const newWalletForm = UseForm(newWalletCallback, {
    name: '',
    money: '0',
    currency: 'MXN',
  });

  async function newWalletCallback() {
    try {
      // Sends the wallet to the API
      const res = await transactionService.newWallet(newWalletForm.values);

      // Clears the form, sets wallets and closes the modal
      newWalletForm.clear();
      props.addWallet(res.data);
      props.set(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      // console.log(err.response);
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  return (
    <>
      <Modal
        showModal={props.state}
        setModal={props.set}
        title="New Wallet"
        accept={acceptIcon}
        onAccept={newWalletCallback}
        onClose={() => {
          newWalletForm.clear();
          setErrors([]);
        }}
      >
        {/* Main Wallet data */}
        <div className="NewWalletForm__MainWallet">
          {/* Form */}
          <form onSubmit={newWalletForm.onSubmit}>
            <div className="NewWalletForm__MainWallet__FirstRow">
              <div className="NewWalletForm__MainWallet__FirstRow__Icon" />
              <Input
                error={errors.name ? true : false}
                label="Name"
                name="name"
                type="text"
                value={newWalletForm.values.name}
                onChange={newWalletForm.onChange}
              />
            </div>
            <div className="NewWalletForm__MainWallet__SecondRow">
              <div className="NewWalletForm__MainWallet__SecondRow__Money">
                <Input
                  error={errors.amount ? true : false}
                  name="money"
                  type="number"
                  label="Money"
                  value={newWalletForm.values.money}
                  onChange={newWalletForm.onChange}
                />
              </div>
              <div className="NewWalletForm__MainWallet__SecondRow__Currency">
                <Input
                  error={errors.currency ? true : false}
                  name="currency"
                  type="text"
                  label="Currency"
                  value={newWalletForm.values.currency}
                  onChange={newWalletForm.onChange}
                />
              </div>
            </div>
          </form>
          {/* Error Box */}
          <Errorbox errors={errors} setErrors={setErrors}></Errorbox>
        </div>
      </Modal>
    </>
  );
};

export default NewWalletForm;
