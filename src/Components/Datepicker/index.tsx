/** Datepicker.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Custom datepicker component
 */
// Libraries
import React, { useState, useRef } from 'react';

// Styles
import './Datepicker.css';

interface Props {
  label: string;
  name?: string;
  onChange?: any;
  value?: Date;
}

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getWeeksForMonth = (date: Date): (Date | null)[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay();
  const weeks: (Date | null)[][] = [[]];

  // Sets the current week as the 0 element
  let currentWeek = weeks[0];
  let currentDate = firstOfMonth;

  // First week, pushes the amount of nulls before the first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Goes through every day of the month
  while (currentDate.getMonth() === month) {
    // If the current week has 7 days, the currentWeek gets reset and is pushed as a new week
    if (currentWeek.length === 7) {
      currentWeek = [];
      weeks.push(currentWeek);
    }

    // Adds the date and goes to the next
    currentWeek.push(currentDate);
    currentDate = new Date(year, month, currentDate.getDate() + 1);
  }

  // Last week, pushes nulls to finish the week
  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }

  return weeks;
};

const displayDate = (date: Date): string => {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${day}/${month}/${year}`;
};

const Datepicker = (props: Props): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(props.value || new Date());
  const [weeks, setWeeks] = useState(getWeeksForMonth(selectedDate));
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef();

  // Functions
  const setDateCallback = (date: Date | null): void => {
    if (!date) return;

    setSelectedDate(date);

    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: date,
        },
      });
    }
    setShowPicker(false);
  };

  const closePickerRef = (e: any) => {
    if (pickerRef.current === e.target) {
      setShowPicker(false);
    }
  };

  const getDayKey = (i: number, j?: number): string => {
    return `${selectedDate.getFullYear}${selectedDate.getMonth}${i}_${j}`;
  };

  const compareDates = (a: Date | null, b: Date | null): boolean => {
    if (a === null || b === null) return false;

    if (a.getFullYear() === b.getFullYear()) {
      if (a.getMonth() === b.getMonth()) {
        if (a.getDate() === b.getDate()) {
          return true;
        }
      }
    }

    return false;
  };

  // // Keypress detector
  // const keyPress = useCallback(
  //   (e: KeyboardEvent) => {
  //     if (e.key === 'Escape' && showPicker) {
  //       closePickerRef(e);
  //     }
  //   },
  //   [setShowPicker, showPicker],
  // );

  // // useEffect for the keypress
  // useEffect(() => {
  //   document.addEventListener('keydown', keyPress);
  //   return () => document.removeEventListener('keydown', keyPress);
  // }, [keyPress]);

  return (
    <>
      {/* Input field */}
      <div className="Datepicker" onClick={() => setShowPicker(true)}>
        <input className="Datepicker__field" disabled={true} value={displayDate(selectedDate)} />
        {props.label && <label className="Datepicker__label">{props.label}</label>}
      </div>

      {/* Selector, doesn't use the modal component so this component is independent */}
      <div className={showPicker ? 'Datepicker__Container active' : 'Datepicker__Container'}>
        <div className="Datepicker__Container__Background" ref={pickerRef as any} onClick={closePickerRef}>
          <div className="Datepicker__Container__Content">
            <div className="Datepicker__Container__Content__Title">{months[selectedDate.getMonth()]}</div>
            <div className="Datepicker__Container__Content__Month">
              <div className="Datepicker__Container__Content__Month__Weekdays">
                {weekdays.map((day) => (
                  <div className="Datepicker__Container__Content__Month__Weekdays__Day" key={day}>
                    {day}
                  </div>
                ))}
              </div>
              {weeks.map((week, indexA) => (
                <div role="row" key={getDayKey(indexA)} className="Datepicker__Container__Content__Month__Week">
                  {week.map((day, indexB) => (
                    <div
                      key={getDayKey(indexA, indexB)}
                      className={
                        compareDates(day, selectedDate)
                          ? 'Datepicker__Container__Content__Month__Week__Day selected'
                          : 'Datepicker__Container__Content__Month__Week__Day'
                      }
                      onClick={() => setDateCallback(day)}
                    >
                      {day?.getDate()}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div onClick={() => setShowPicker(false)}>Close</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Datepicker;
