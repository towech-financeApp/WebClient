/** Input.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom input component
 */

// Styles
import './Input.css';

interface Props {
  accent?: any;
  dark?: any;
  error?: boolean;
  label?: string;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: "text" | "password";
  value?: any;
}

const Input = (props: Props): JSX.Element => {
  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'input';
  if (props.dark) theme = 'input dark';
  if (props.accent) theme = 'input accent';

  // Adds the error outline if triggered
  if (props.error) theme += ' error';

  return (
    <div className={theme}>
      <input
        className="input__field"
        name={props.name}
        onChange={props.onChange}
        placeholder={props.placeholder ? props.placeholder : ' '}
        type={props.type}
        value={props.value}
      />
      {props.label && <label className="input__label">{props.label}</label>}
    </div>
  );
};

export default Input;
