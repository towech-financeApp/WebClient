/** Input.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom input component
 */

// Styles
import { useState, useEffect } from 'react';
import './Input.css';

interface Props {
  error?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  value?: any;
}

const Input = (props: Props): JSX.Element => {
  const [display, setDisplay] = useState(`${props.value}`);

  // This useEffect is used when something external changes the value of the input
  useEffect(() => {
    if (props.type !== 'number') {
      setDisplay(`${props.value}`);
      return;
    }

    const formatSplit = props.value.split('.');
    const valueFormatted =
      formatSplit.length > 1
        ? `${formatSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${formatSplit[1]}`
        : `${formatSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

    setDisplay(`${valueFormatted}`);
  }, [props.value]);

  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'input';

  // Adds the error outline if triggered
  if (props.error) theme += ' error';

  const change = (e?: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e) return;

    // If the input is not of type number, it gets passed regularly
    if (props.type !== 'number') {
      props.onChange(e);
      return;
    }

    const initial = display === '0' ? e.target.value.replace('0', '') : e.target.value;

    // First removes all letters and commas and dots after the first
    const splitted = initial.split('.');
    let value = splitted.length > 1 ? `${splitted.shift()}.${splitted.join('')}` : `${splitted[0]}`;
    value = value.replace(/[^0-9.]/g, '');
    if (value.trim() === '') value = '0';

    if (value === display) return;
    e.target.value = value;

    props.onChange(e);
  };

  const getType = (): string => {
    if (!props.type) return 'text';
    if (props.type === 'number') return 'text';
    return props.type;
  };

  return (
    <div className={theme}>
      <input
        // className="input__field"
        className={props.type === 'number' ? 'input__field number' : 'input__field'}
        disabled={props.disabled}
        name={props.name}
        onChange={change}
        placeholder={props.placeholder ? props.placeholder : ' '}
        type={getType()}
        value={display}
      />
      {props.label && <label className="input__label">{props.label}</label>}
    </div>
  );
};

export default Input;
