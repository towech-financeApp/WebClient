/** NavBar.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Navigation bar component
 */
import { useContext, useEffect, useRef, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Services
import AuthenticationService from '../../Services/AuthenticationService';

// Styles
import './NavBar.css';
import MenuItem from './MenuItem';

interface Props {
  accent?: boolean;
  dark?: boolean;
  selected?: string;
}

const NavBar = (props: Props): JSX.Element => {
  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'navBar';
  if (props.dark) theme = 'navBar dark';
  if (props.accent) theme = 'navBar accent';

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
    <div className={theme}>
      {/* Menu bar*/}
      <div className="navBar__selector" onClick={() => setSidebar(true)}>
        <FaIcons.FaBars />
      </div>
      {/*Navigation bar*/}
      <nav ref={menuRef} className={sidebar ? 'navBar__Menu active' : 'navBar__Menu'}>
        <MenuItem
          link="/home"
          label="Transactions"
          onClick={() => setSidebar(false)}
          accent={props.accent}
          dark={props.dark}
          selected={props.selected === 'Transactions'}
        >
          <FaIcons.FaMoneyCheckAlt />
        </MenuItem>
        <MenuItem
          link="/wallets"
          label="Wallets"
          onClick={() => setSidebar(false)}
          accent={props.accent}
          dark={props.dark}
          selected={props.selected === 'Wallets'}
        >
          <FaIcons.FaWallet />
        </MenuItem>
        <MenuItem
          link="/settings"
          label="Settings"
          onClick={() => setSidebar(false)}
          accent={props.accent}
          dark={props.dark}
          selected={props.selected === 'Settings'}
        >
          <FaIcons.FaCog />
        </MenuItem>
        <MenuItem label="Logout" onClick={logoutCallback} accent={props.accent} dark={props.dark}>
          <FaIcons.FaUserTimes />
        </MenuItem>
      </nav>
    </div>
  );
};

export default NavBar;
