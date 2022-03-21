/**WalletCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Wallet elements
 */
import { useState } from 'react';

// Components
import NewWalletForm from './NewWalletForm';

// Models
import { Objects } from '../../models';

interface Props /*extends RouteComponentProps*/ {
  wallet: Objects.Wallet;
  editWallet: (wallet: Objects.Wallet) => void;
  deleteWallet: (wallet: Objects.Wallet) => void;
}

const WalletCard = (props: Props): JSX.Element => {
  // Hooks
  const [showEdit, setEdit] = useState(false);

  return (
    <>
      <div className="WalletCard" onClick={() => setEdit(true)}>
        <div className="WalletCard__Icon" />
        <div className="WalletCard__Info">
          <div className="WalletCard__Info__Name">{props.wallet.name}</div>
          <div className="WalletCard__Info__Money">
            {props.wallet.currency}:&nbsp;
            <div className={(props.wallet.money || 0) >= 0 ? '' : 'WalletCard__Info__Money__Amount'}>
              {(Math.round((props.wallet.money || 0) * 100) / 100).toFixed(2)}
            </div>
          </div>
        </div>
        {/* <div className="WalletCard__Name" onClick={() => navigate(`/home?wallet=${props.wallet._id}`)}>
          {props.wallet.name}
        </div> */}
      </div>
      {/*Modals. inside a div to ignore the margin set by the container*/}
      <div className="WalletCard__Modals">
        {/* Edit Wallet Modal */}
        <NewWalletForm
          editWallet={props.editWallet}
          deleteWallet={props.deleteWallet}
          set={setEdit}
          state={showEdit}
          initialWallet={props.wallet}
        />
        {/* Delete Wallet Modal */}
        {/* <Modal
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
        </Modal> */}
      </div>
    </>
  );
};

export default WalletCard;
