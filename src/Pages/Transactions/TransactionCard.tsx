/**TransactionCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Transaction elements
 */
// Libraries
import { useState } from 'react';

// Components
import NewTransactionForm from './TransactionForm';

// Models
import { Objects } from '../../models';

interface Props {
  transaction: Objects.Transaction;
}

const TransactionCard = (props: Props): JSX.Element => {
  // Hooks
  const [showEdit, setEdit] = useState(false);
  const transDate = new Date(props.transaction.transactionDate);
  const amount = Math.abs(props.transaction.amount).toFixed(2);

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
      <NewTransactionForm state={showEdit} setState={setEdit} initialTransaction={props.transaction} />
    </>
  );
};

export default TransactionCard;
