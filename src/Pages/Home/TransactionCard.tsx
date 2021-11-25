/**TransactionCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Transaction elements
 */
import { useContext, useState } from 'react';
import * as HiIcons from 'react-icons/hi';

// Hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Components
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';

// Models
import { Transaction } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

interface Props {
  transaction: Transaction;
  edit: (transaction: Transaction) => void;
  delete: (transaction: Transaction) => void;
}

const TransactionCard = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  //const [showEdit, setEdit] = useState(false);
  const [showDelete, setDelete] = useState(false);

  const transDate = new Date(props.transaction.transactionDate);
  const amount = Math.abs(props.transaction.amount).toFixed(2);

  // functions
  // async function editTransaction(transactionId: string): Promise<void> {
  // }

  async function deleteTransaction(): Promise<void> {
    try {
      await transactionService.deleteTransaction(props.transaction._id);

      props.delete(props.transaction);
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
      setDelete(false);
    }
  }

  return (
    <div className="TransactionCard">
      <div className="TransactionCard__Content">
        <div className="TransactionCard__Content__Data">
          <h4>{props.transaction.concept}</h4>
          {transDate.getDate().toString().padStart(2, '0')}-{(transDate.getMonth() + 1).toString().padStart(2, '0')}-
          {transDate.getFullYear()}
        </div>
        {props.transaction.amount < 0 ? (
          <div className="TransactionCard__Content__Amount negative">- {amount}</div>
        ) : (
          <div className="TransactionCard__Content__Amount"> + {amount}</div>
        )}
      </div>
      <Button onClick={props.edit}>
        <HiIcons.HiPencilAlt />
      </Button>
      <Button onClick={() => setDelete(true)}>
        <HiIcons.HiTrash />
      </Button>

      {/* Delete Transaction Modal */}
      <Modal
        showModal={showDelete}
        setModal={setDelete}
        title="Delete transaction"
        accept="Delete"
        onAccept={deleteTransaction}
      >
        <p>
          <br />
          Are you sure you want to delete this transaction?
          <br />
          <br /> This cannot be undone
        </p>
      </Modal>
    </div>
  );
};

export default TransactionCard;