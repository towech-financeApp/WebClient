/** Page.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component used by all pages in the App
 */
import Loading from '../Loading';
import NavBar from '../NavBar';
import './Page.css';

interface Props {
  accent?: any;
  children?: JSX.Element | string;
  dark?: any;
  header?: JSX.Element | string;
  loading?: boolean;
  selected?: string;
}

const Page = (props: Props): JSX.Element => {
  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'Page';
  if (props.dark) theme = 'Page dark';
  if (props.accent) theme = 'Page accent';

  // If this item is selected, adds the color
  if (props.loading) theme += ' loading';

  return (
    <div className={theme}>
      <NavBar accent={props.accent} dark={props.dark} selected={props.selected} />
      <div>{props.header}</div>
      <div className="Page__content">{props.children}</div>
      {props.loading && <Loading className="Page__spinner" />}
    </div>
  );
};

export default Page;
