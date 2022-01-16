/** ChangePasswordForm.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Component used to change the email, it is a modal
 */
import React, { useContext, useState } from 'react';

// Components
import Input from '../../../Components/Input';
import Modal from '../../../Components/Modal';

// Hooks
import { AuthenticationTokenStore } from '../../../Hooks/ContextStore';
import UseForm from '../../../Hooks/UseForm';

// Services
import UserService from '../../../Services/UserService';

// Utilities
import CheckNested from '../../../Utils/CheckNested';

interface Props {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  resultState: () => void;
}

const ChangeEmailForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const userService = new UserService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);

  const changeEmailForm = UseForm(changeEmailCallback, {
    email: '',
  });

  // Functions
  async function changeEmailCallback() {
    try {
      // If the name is blank or unedited, just closes the modal
      await userService.updateEmail(changeEmailForm.values.email);

      changeEmailForm.clear();

      props.setState(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err); //eslint-disable-line no-console
    }
  }

  function clearModal() {
    changeEmailForm.clear();
    setErrors([]);
  }

  return (
    <div className="Settings__EditName__Modal">
      <Modal
        showModal={props.state}
        setModal={props.setState}
        title={'Change Name'}
        accept={'Save'}
        onAccept={changeEmailCallback}
        onClose={clearModal}
      >
        <form onSubmit={changeEmailForm.onSubmit}>
          <Input
            error={errors.password ? true : false}
            label="New email"
            name="email"
            type="text"
            value={changeEmailForm.values.email}
            onChange={changeEmailForm.onChange}
          />
        </form>
      </Modal>
    </div>
  );
};

export default ChangeEmailForm;