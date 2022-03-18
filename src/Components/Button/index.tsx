/** Button.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom button component
 */
// Styles
import './Button.css';

interface Props {
  accent?: boolean;
  children?: JSX.Element | string;
  className?: string;
  dark?: boolean;
  round?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: any;
}

const Button = (props: Props): JSX.Element => {
  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'button';
  if (props.dark) theme = 'button dark';
  if (props.accent) theme = 'button accent';

  // Sets the roundness of the button
  if (props.round) theme += ' round';

  // Sets the button as transparent

  return (
    <button className={`${theme} ${props.className}`} type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
