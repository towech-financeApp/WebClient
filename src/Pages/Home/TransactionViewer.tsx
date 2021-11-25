/** TransactionViewer.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows all the given transactions
 */
// Models
import { Transaction, Wallet } from '../../models';

// Styles
import './Home.css';
import TransactionCard from './TransactionCard';

interface Props {
  wallets: Wallet[];
  transactions: Transaction[];
  edit: (transaction: Transaction) => void;
  delete: (transaction: Transaction) => void;
}

const TransactionViewer = (props: Props): JSX.Element => {
  return (
    <div className="Transactions__Viewer">
      {props.transactions.length == 0 ? (
        <div className="NoWallets">
          <h1>There are no transactions</h1>
        </div>
      ) : (
        <div className="Transactions__Viewer__List">
          {props.transactions.map((transaction: Transaction) => (
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
