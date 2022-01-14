/** Home.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Settings Page for the App
 */
import { useContext, useState } from 'react';

// Components
import Page from '../../Components/Page';
import SettingCard from './SettingCard';

// Hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Styles
import './Settings.css';
import EditNameForm from './Functions/EditNameForm';
import ChangePasswordForm from './Functions/ChangePasswordForm';
import ChangeEmailForm from './Functions/ChangeEmailForm';

const Settings = (): JSX.Element => {
  // Context
  const { authToken } = useContext(AuthenticationTokenStore);

  // Hooks
  const [editNameModal, setEditNameModal] = useState(false);
  const [changePassModal, setChangePassModal] = useState(false);
  const [changeEmailModal, setChangeEmailModal] = useState(false);

  // Functions

  // Only refreshes the page and allows a new token to regenerate the user data
  async function editUser() {
    window.location.reload();
  }

  const header = <h1>Settings</h1>;

  return (
    <Page header={header} selected="Settings">
      <div className="Settings">
        <div className="Settings__Container">
          <SettingCard
            title="Change name"
            onClick={() => {
              setEditNameModal(true);
            }}
          />
          <SettingCard
            title="Change email"
            onClick={() => {
              setChangeEmailModal(true);
            }}
          />
          <SettingCard
            title="Change password"
            onClick={() => {
              setChangePassModal(true);
            }}
          />
          {authToken.role === 'admin' && (
            <SettingCard
              title="Manage users"
              onClick={() => {
                console.log('Manage users');
              }}
            />
          )}
        </div>
        <EditNameForm state={editNameModal} setState={setEditNameModal} resultState={editUser} />
        <ChangePasswordForm state={changePassModal} setState={setChangePassModal} resultState={editUser} />
        <ChangeEmailForm state={changeEmailModal} setState={setChangeEmailModal} resultState={editUser} />
      </div>
    </Page>
  );
};

export default Settings;
