/** NewTransactionForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new transaction, it is a modal
 */
import React, { useContext, useState } from 'react';

// Components
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Transaction, Wallet } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

interface Props {
  addTransaction: (transaction: Transaction) => void;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  wallets: Wallet[];
  selectedWallet: string | null;
}

const NewTransactionForm = (props: Props): JSX.Element => {
  // Authentication Token Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the servicees
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);

  const newTransactionForm = UseForm(newTransactionCallback, {
    wallet_id: props.selectedWallet || '',
    concept: '',
    amount: 0,
    transactionDate: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
  });

  // Functions
  async function newTransactionCallback() {
    try {
      // If no wallet was entered, returns an error
      if (newTransactionForm.values.wallet_id === '') {
        setErrors({ wallet_id: 'Select a wallet' });
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
      //else console.log(err.response); //eslint-disable-line no-console
    }
  }

  return (
    <div className="Transactions__New__Modal">
      <Modal
        showModal={props.state}
        setModal={props.setState}
        title="NewTransaction"
        accept="Create"
        onAccept={newTransactionCallback}
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
              <option value="" disabled hidden>
                Select Wallet
              </option>
              {props.wallets.map((wallet: Wallet) => (
                <option value={wallet._id} key={wallet._id}>
                  {wallet.name}
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
