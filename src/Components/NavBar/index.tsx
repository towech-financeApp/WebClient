/** NavBar.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Navigation bar component
 */
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

// Hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Services
import AuthenticationService from '../../Services/AuthenticationService';

// Styles
import './NavBar.css';

const NavBar = (): JSX.Element => {
  // Context
  const { dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const authService = new AuthenticationService();

  // Hooks
  const [sidebar, setSidebar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Adds the mouse listener event, it is used to close the sidebar when a click
  // outside the menu is made
  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (menuRef.current) {
        if (!menuRef.current.contains(event.target as Node) && sidebar) {
          setSidebar(false);
        }
      }
    });
  });

  // Callbacks
  async function logoutCallback() {
    try {
      await authService.logout();
    } catch (err) {
      // console.log(err);
    }

    dispatchAuthToken({ type: 'LOGOUT', payload: { keepSession: false, token: '' } });
  }

  return (
    <div className="navBar">
      {/* Menu bar*/}
      <div className="navBar__selector" onClick={() => setSidebar(true)}>
        <FaIcons.FaBars />
      </div>
      {/*Navigation bar*/}
      <nav ref={menuRef} className={sidebar ? 'navBar__Menu active' : 'navBar__Menu'}>
        <ul className="navBar__Menu__items">
          <li key="transactions" onClick={() => setSidebar(false)}>
            <Link to="/home">
              <FaIcons.FaWallet />
              <span>Transactions</span>
            </Link>
          </li>
          <li key="wallets" onClick={() => setSidebar(false)}>
            <Link to="/wallets">
              <FaIcons.FaWallet />
              <span>Wallets</span>
            </Link>
          </li>
          <li key="logout">
            <button onClick={logoutCallback}>
              <FaIcons.FaUserTimes />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
