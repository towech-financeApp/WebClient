/** ParseDataMonth.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 * Function that converts a datamonth parameter into a proper datamonth
 */
const ParseDataMonth = (dataMonth: string | null): string => {
  // Returns the current month if it is -1 or invalid
  if (!dataMonth || dataMonth === '-1' || dataMonth.length !== 6 || isNaN(parseInt(dataMonth))) {
    return `${new Date().getFullYear()}${('0' + (new Date().getMonth() + 1)).slice(-2)}`;
  }

  return dataMonth;
};

export default ParseDataMonth;
