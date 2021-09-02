/** WalletTotals.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows the sum of income and expense of the transactions
 */
// Styles
import './Home.css';

interface Props {
  totals: { earnings: number; expenses: number };
}

const WalletTotals = (props: Props): JSX.Element => {
  return (
    <div className="Transactions__Totals">
      <div className="Transactions__Totals__Items">
        <div>In: </div>
        <div>Out: </div>
        <div>Total: </div>
      </div>
      <div className="Transactions__Totals__Numbers">
        <div className="Transactions__Totals__Numbers__In"> + {props.totals.earnings.toFixed(2)}</div>
        <div className="Transactions__Totals__Numbers__Out"> - {props.totals.expenses.toFixed(2)} </div>
        <div> {(props.totals.earnings - props.totals.expenses).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default WalletTotals;
