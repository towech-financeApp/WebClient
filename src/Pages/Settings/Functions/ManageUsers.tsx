/** ManageUsers.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Component that allows an admin to manage users
 */
import React from 'react';

// Components
import Modal from '../../../Components/Modal';

// Interfaces
interface MenuProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default class ManageUsers {
  static Menu = (props: MenuProps): JSX.Element => {
    return (
      <Modal float showModal={props.state} setModal={props.setState} title={'Manage users'}>
        TODO
      </Modal>
    );
  };
}
