/** NewWalletForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new Wallet, it is a modal
 */
import React, { useContext, useState } from 'react';

// Components
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import Modal from '../../Components/Modal';
import Input from '../../Components/Input';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Wallet } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Wallets.css';

interface Props {
  addWallet: (wallet: Wallet) => void;
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
    money: 0,
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

  return (
    <>
      <Modal
        showModal={props.state}
        setModal={props.set}
        title="New Wallet"
        accept="Create"
        onAccept={newWalletCallback}
        onClose={() => {
          newWalletForm.clear();
          setErrors([]);
        }}
      >
        <form onSubmit={newWalletForm.onSubmit}>
          <Input
            error={errors.name ? true : false}
            label="Name"
            name="name"
            type="text"
            value={newWalletForm.values.name}
            onChange={newWalletForm.onChange}
          />
          <div className="NewWalletForm__Amount">
            <div className="NewWalletForm__Amount__Label">Amount:</div>
            <div className="NewWalletForm__Amount__Input">
              <Input
                error={errors.amount ? true : false}
                name="money"
                placeholder="0"
                type="number"
                value={newWalletForm.values.money}
                onChange={newWalletForm.onChange}
              />
            </div>
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
    </>
  );
};

export default NewWalletForm;
