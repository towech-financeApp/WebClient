/** WalletTotals.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows the sum of income and expense of the transactions
 */
// Utils
import ParseMoneyAmount from '../../Utils/ParseMoneyAmount';

// Styles
import './Transactions.css';

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
        <div className="Transactions__Totals__Numbers__In"> + {ParseMoneyAmount(props.totals.earnings)}</div>
        <div className="Transactions__Totals__Numbers__Out"> - {ParseMoneyAmount(props.totals.expenses)} </div>
        <div> {ParseMoneyAmount(props.totals.earnings - props.totals.expenses)}</div>
      </div>
    </div>
  );
};

export default WalletTotals;
