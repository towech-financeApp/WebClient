/** RedirectToWallets.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The Componet shown in the transactions view when there are no wallets
 */
//Libraries
import { Link } from 'react-router-dom';
// Styles
import './Transactions.css';

const RedirectToWallets = (): JSX.Element => {
  return (
    <div className="NoWallets">
      <h1>
        You have no wallets, add one in <Link to="wallets">Wallets</Link>
      </h1>
    </div>
  );
};

export default RedirectToWallets;
