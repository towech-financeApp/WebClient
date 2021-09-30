/**WalletCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Wallet elements
 */
import { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as HiIcons from 'react-icons/hi';

// Hooks
import { AuthenticationTokenStore } from '../../Hooks/ContextStore';
import UseForm from '../../Hooks/UseForm';

// Components
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Input from '../../Components/Input';

// Models
import { Wallet } from '../../models';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Services
import TransactionService from '../../Services/TransactionService';

interface Props extends RouteComponentProps {
  wallet: Wallet;
  editWallet: (wallet: Wallet) => void;
  deleteWallet: (wallet: Wallet) => void;
}

const WalletCard = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(AuthenticationTokenStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDelete] = useState(false);
  const [editErrors, setEditErrors] = useState({} as any);

  // Edit wallet form
  const editWalletForm = UseForm(editWallet, {
    name: props.wallet.name,
  });

  async function editWallet() {
    try {
      const editedWallet = editWalletForm.values as Wallet;
      editedWallet._id = props.wallet._id;

      // Sends the wallet to the API
      const res = await transactionService.editWallet(editedWallet);

      // Sets the wallet and closes the modal
      props.editWallet(res.data);
      setEdit(false);
    } catch (err: any) {
      // If there is a 304 status, then the modal is closed
      if (err.response.status == 304) setEdit(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setEditErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function resetEditForm() {
    editWalletForm.values.name = props.wallet.name;
  }

  async function deleteWallet() {
    try {
      await transactionService.deleteWallet(props.wallet._id);

      props.deleteWallet(props.wallet);
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
      setDelete(false);
    }
  }

  return (
    <div className="WalletCard">
      <div className="WalletCard__Name" onClick={() => props.history.push(`/home?wallet=${props.wallet._id}`)}>
        {props.wallet.name}
      </div>
      <Button onClick={() => setEdit(true)}>
        <HiIcons.HiPencilAlt />
      </Button>
      <Button onClick={() => setDelete(true)}>
        <HiIcons.HiTrash />
      </Button>
      {/* Edit Wallet Modal */}
      <Modal
        showModal={showEdit}
        setModal={setEdit}
        title="Edit wallet"
        accept="Save"
        onAccept={editWallet}
        onClose={resetEditForm}
      >
        <form onSubmit={editWalletForm.onSubmit}>
          <Input
            error={editErrors.name ? true : false}
            label="Name"
            name="name"
            type="text"
            value={editWalletForm.values.name}
            onChange={editWalletForm.onChange}
          />
        </form>
        <div>
          {Object.keys(editErrors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(editErrors).map((value: any) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
      {/* Delete Wallet Modal */}
      <Modal
        showModal={showDelete}
        setModal={setDelete}
        title={`Delete ${props.wallet.name}`}
        accept="Delete"
        onAccept={deleteWallet}
      >
        <p>
          <br />
          Are you sure you want to delete this wallet?
          <br />
          <br /> This cannot be undone
        </p>
      </Modal>
    </div>
  );
};

export default WalletCard;
