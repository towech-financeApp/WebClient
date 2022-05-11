/** DataMonthSelector.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 * Component that handles the selection of months to display
 */
// Libraries
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetParameters from '../../Utils/GetParameters';

// Hooks
import { TransactionPageStore } from '../../Hooks/ContextStore';

// Styles
import './Transactions.css';

// Components
import Button from '../../Components/Button';

const addMonths = (dataMonth: string, amount: number): string => {
  let year = parseInt(dataMonth.substring(0, 4));
  let month = parseInt(dataMonth.substring(4, 6));

  // adds the month
  month += amount;

  // if the month is smaller than 1, the substracts years until finished
  while (month < 1) {
    year--;
    month += 12;
  }

  // if the month is bigger than 12 it adds years until finished
  while (month > 12) {
    year++;
    month -= 12;
  }

  return `${year}${month.toString().padStart(2, '0')}`;
};

const displayDataMonth = (dataMonth: string): string => {
  return `${dataMonth.substring(0, 4)}/${dataMonth.substring(4, 6)}`;
};

const DataMonthSelector = (): JSX.Element => {
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);

  // Roter
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks for the selection buttons
  const [prevMonth, setPrevMonth] = useState(addMonths(transactionState.dataMonth, -1));
  const [nextMonth, setNextMonth] = useState(addMonths(transactionState.dataMonth, 1));

  //
  const setCurrentMonth = (amount: number): void => {
    // sets the buttons month to change
    setNextMonth(addMonths(nextMonth, amount));
    dispatchTransactionState({
      type: 'SELECT-DATAMONTH',
      payload: { dataMonth: addMonths(transactionState.dataMonth, amount) },
    });
    setPrevMonth(addMonths(prevMonth, amount));

    // redirects to the new datamonth
    const walletId = GetParameters(location.search, 'wallet') || '-1';
    navigate(`/home?wallet=${walletId}&month=${addMonths(transactionState.dataMonth, amount)}`);
  };

  // TODO: Go to current month
  return (
    <div className="Transactions__MonthSelector">
      <Button className="Transactions__MonthSelector__Button" onClick={() => setCurrentMonth(-1)}>
        {displayDataMonth(prevMonth)}
      </Button>
      <Button className="Transactions__MonthSelector__Button selected">
        {displayDataMonth(transactionState.dataMonth)}
      </Button>
      <Button className="Transactions__MonthSelector__Button" onClick={() => setCurrentMonth(1)}>
        {displayDataMonth(nextMonth)}
      </Button>
    </div>
  );
};

export default DataMonthSelector;
