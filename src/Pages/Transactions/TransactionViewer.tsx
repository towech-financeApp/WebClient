/** TransactionViewer.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows all the given transactions
 */
// Libraries
import { useContext } from 'react';

// Models
import { Objects } from '../../models';

// Hooks
import { TransactionPageStore } from '../../Hooks/ContextStore';

// Styles
import './Transactions.css';
import TransactionCard from './TransactionCard';

const TransactionViewer = (): JSX.Element => {
  const { transactionState } = useContext(TransactionPageStore);

  return (
    <div
      className={transactionState.transactions.length == 0 ? 'Transactions__Viewer emptytrans' : 'Transactions__Viewer'}
    >
      {transactionState.transactions.length == 0 ? (
        <div className="Transactions__Empty">
          <h1>There are no transactions for this period</h1>
        </div>
      ) : (
        <div className="Transactions__Viewer__List">
          {transactionState.transactions.map((transaction: Objects.Transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
          <div className="Transactions__Viewer__Filler" />
        </div>
      )}
    </div>
  );
};

export default TransactionViewer;
