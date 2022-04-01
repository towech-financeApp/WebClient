/** TransactionViewer.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows all the given transactions
 */
// Models
import { Objects } from '../../models';

// Styles
import './Transactions.css';
import TransactionCard from './TransactionCard';

interface Props {
  wallets: Objects.Wallet[];
  transactions: Objects.Transaction[];
  edit: (transaction: Objects.Transaction) => void;
  delete: (transaction: Objects.Transaction) => void;
}

const TransactionViewer = (props: Props): JSX.Element => {
  return (
    <div className="Transactions__Viewer">
      {props.transactions.length == 0 ? (
        <div className="Transactions__Empty">
          <h1>There are no transactions for this period</h1>
        </div>
      ) : (
        <div className="Transactions__Viewer__List">
          {props.transactions.map((transaction: Objects.Transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              wallets={props.wallets}
              edit={props.edit}
              delete={props.delete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionViewer;
