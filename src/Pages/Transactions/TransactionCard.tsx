/**TransactionCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Transaction elements
 */
import { useState } from 'react';
// import * as HiIcons from 'react-icons/hi';

// Hooks
// import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Components
// import Button from '../../Components/Button';
// import Modal from '../../Components/Modal';
import NewTransactionForm from './NewTransactionForm';

// Models
import { Objects } from '../../models';

// Services
// import TransactionService from '../../Services/TransactionService';

interface Props {
  wallets: Objects.Wallet[];
  transaction: Objects.Transaction;
  edit: (transaction: Objects.Transaction) => void;
  delete: (transaction: Objects.Transaction) => void;
}

const TransactionCard = (props: Props): JSX.Element => {
  // Context
  // const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  // const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [showEdit, setEdit] = useState(false);
  // const [showDelete, setDelete] = useState(false);

  const transDate = new Date(props.transaction.transactionDate);
  const amount = Math.abs(props.transaction.amount).toFixed(2);

  // async function deleteTransaction(): Promise<void> {
  //   try {
  //     await transactionService.deleteTransaction(props.transaction._id);

  //     props.delete(props.transaction);
  //   } catch (err: any) {
  //     console.log(err.response); // eslint-disable-line no-console
  //     setDelete(false);
  //   }
  // }

  return (
    <>
      <div className="TransactionCard" onClick={() => setEdit(true)}>
        <div className="TransactionCard__Icon" />
        <div className="TransactionCard__Content">
          <div className="TransactionCard__Content__Top">
            <div className="Transaction__Content__Top__Category">{props.transaction.category.name}</div>
            {props.transaction.category.type == 'Expense' ? (
              <div className="TransactionCard__Content__Top__Amount negative">- {amount}</div>
            ) : (
              <div className="TransactionCard__Content__Top__Amount"> + {amount}</div>
            )}
          </div>
          <div className="TransactionCard__Content__Bottom">
            <div className="TransactionCard__Content__Bottom__Concept">{props.transaction.concept}</div>
            <div className="TransactionCard__Content__Bottom__Date">
              {transDate.getDate().toString().padStart(2, '0')}-{(transDate.getMonth() + 1).toString().padStart(2, '0')}
              -{transDate.getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Wallet Modal */}
      <NewTransactionForm
        state={showEdit}
        setState={setEdit}
        addTransaction={props.edit}
        wallets={props.wallets}
        selectedWallet={null}
        initialTransaction={props.transaction}
      />
    </>
    //   {/* Edit Wallet Modal */}
    //   <NewTransactionForm
    //     state={showEdit}
    //     setState={setEdit}
    //     addTransaction={props.edit}
    //     wallets={props.wallets}
    //     selectedWallet={null}
    //     initialTransaction={props.transaction}
    //   />
    //   {/* Delete Transaction Modal */}
    //   <Modal
    //     showModal={showDelete}
    //     setModal={setDelete}
    //     title="Delete transaction"
    //     accept="Delete"
    //     onAccept={deleteTransaction}
    //   >
    //     <p>
    //       <br />
    //       Are you sure you want to delete this transaction?
    //       <br />
    //       <br /> This cannot be undone
    //     </p>
    //   </Modal>
    // </div>
  );
};

export default TransactionCard;
