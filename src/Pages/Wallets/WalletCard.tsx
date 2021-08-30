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

// Components
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';

// Models
import { Wallet } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';
import { useEffect } from 'react';

interface Props extends RouteComponentProps {
  wallet: Wallet;
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

  // This useEffect only exists so it doesn't update when the deleteWallet function is run,
  // thus avoiding the "state update on an unmounted component" error
  useEffect(() => {
    // Empty
  }, [deleteWallet]);

  async function editWallet() {
    console.log(`edit   ${props.wallet._id}`);
    setEdit(false);
  }

  async function deleteWallet() {
    try {
      await transactionService.deleteWallet(props.wallet._id);

      props.deleteWallet(props.wallet);
    } catch {
      // console.log(err.response);
    }
    setDelete(false);
  }

  return (
    // <div onClick={() => props.history.push('/test')}>Test</div>
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
      <Modal showModal={showEdit} setModal={setEdit} onAccept={editWallet}>
        Edit
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
