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
  dark?: any;
  loading?: boolean;
  header?: JSX.Element | string;
  children?: JSX.Element | string;
}

const Page = (props: Props): JSX.Element => {
  return (
    <div className={props.loading ? 'Page loading' : 'Page'}>
      <NavBar />
      <div>{props.header}</div>
      <div>{props.children}</div>
      {props.loading && <Loading className="Page__spinner" />}
    </div>
  );
};

export default Page;
