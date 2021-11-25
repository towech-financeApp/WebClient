/** DataMonthSelector.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 * Component that handles the selection of months to display
 */
// Libraries
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import GetParameters from '../../Utils/GetParameters';

// Styles
import './Home.css';

// Components
import Button from '../../Components/Button';

interface Props {
  dataMonth: string;
  setDataMonth: React.Dispatch<React.SetStateAction<string>>;
}

const addMonths = (dataMonth: string, amount: number): string => {
  let year = parseInt(dataMonth.substr(0, 4));
  let month = parseInt(dataMonth.substr(4, 2));

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
  return `${dataMonth.substr(0, 4)}/${dataMonth.substr(4, 2)}`;
};

const DataMonthSelector = (props: Props): JSX.Element => {
  // Roter
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks for the selection buttons
  const [prevMonth, setPrevMonth] = useState(addMonths(props.dataMonth, -1));
  const [nextMonth, setNextMonth] = useState(addMonths(props.dataMonth, 1));

  //
  const setCurrentMonth = (amount: number): void => {
    // sets the buttons month to change
    setNextMonth(addMonths(nextMonth, amount));
    props.setDataMonth(addMonths(props.dataMonth, amount));
    setPrevMonth(addMonths(prevMonth, amount));

    // redirects to the new datamonth
    const walletId = GetParameters(location.search, 'wallet') || '-1';
    navigate(`/home?wallet=${walletId}&month=${addMonths(props.dataMonth, amount)}`);
  };

  return (
    <div className="Transactions__MonthSelector">
      <Button onClick={() => setCurrentMonth(-1)}>{displayDataMonth(prevMonth)}</Button>
      <Button accent>{displayDataMonth(props.dataMonth)}</Button>
      <Button onClick={() => setCurrentMonth(1)}>{displayDataMonth(nextMonth)}</Button>
    </div>
  );
};

export default DataMonthSelector;