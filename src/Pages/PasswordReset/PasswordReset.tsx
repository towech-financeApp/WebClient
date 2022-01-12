/** PasswordReset.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Login Page for the App
 * Based from: https://codepen.io/meodai/pen/rNedxBa
 */
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import Button from '../../Components/Button';
import Input from '../../Components/Input';

// hooks
import UseForm from '../../Hooks/UseForm';
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';

// Services
import UserService from '../../Services/UserService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './PasswordReset.css';

export default class PasswordReset {
  static sendTokenPage = (): JSX.Element => {
    const userService = new UserService();
    const navigate = useNavigate();
    const location = useLocation();

    // Hooks
    const [errors, setErrors] = useState({} as any);
    const [formSent, setFormSent] = useState(false);
    const { authToken } = useContext(AuthenticationTokenStore);

    // This page is only meant to be used when the user is not authenticated
    useEffect(() => {
      if (authToken.token) {
        navigate(location.state ? (location.state as any).path : '/home');
      }
    }, [authToken]);

    // State for the form
    const sendTokenForm = UseForm(sendTokenCallback, {
      username: '',
    });

    async function sendTokenCallback() {
      try {
        setErrors({});

        // trims the email and changes to lowercase
        sendTokenForm.values.username = sendTokenForm.values.username.trim().toLowerCase();

        await userService.generateResetPasswordToken(sendTokenForm.values.username);

        setFormSent(true);
        // sends the request
      } catch (error: any) {
        setFormSent(false);
        if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors);
      }
    }

    return (
      <div className="PasswordReset">
        {/*Form sent message*/}
        {formSent && (
          <div>
            <h1>Email sent</h1>
            <p>A password reset email has been sent.</p>
          </div>
        )}

        {/*Reset form*/}
        {!formSent && (
          <div>
            <h1>Reset password</h1>
            <form onSubmit={sendTokenForm.onSubmit}>
              <Input
                error={errors.username ? true : false}
                label="Email"
                name="username"
                type="text"
                value={sendTokenForm.values.username}
                onChange={sendTokenForm.onChange}
              />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        )}
      </div>
    );
  };
}
