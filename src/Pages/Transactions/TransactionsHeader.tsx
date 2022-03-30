/** TransactionsHeader.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Header that allows to change the selected wallet
 */
// Libraries
import Modal from '../../Components/Modal';

// Models
import { Objects } from '../../models';

// Components
import { useState } from 'react';

// Styles
import './Transactions.css';

// Interfaces
interface HeaderProps {
  selectedWallet_id: string;
  wallets: Objects.Wallet[];
  onChange: (id: string) => void;
}

interface WalletProps {
  onClick: (id: string) => void;
  wallet?: Objects.Wallet;
}

const TransactionHeader = (props: HeaderProps): JSX.Element => {
  // Hooks
  const [showModal, setModal] = useState(false);

  // Functions
  const selectWallet = (id: string) => {
    props.onChange(id);
    setModal(false);
  };

  return (
    <>
      <div className="Transactions__Header" onClick={() => setModal(true)}>
        <div className="Transactions__Header__Icon">
          <div className="Transactions__Header__Icon__Triangle" />
          <div className="Transactions__Header__Icon__Circle" />
        </div>
        <div className="Transactions__Header__Wallet">
          <div className="Transactions__Header__Wallet__Name">{props.selectedWallet_id}</div>
          <div className="Transactions__Header__Wallet__Money">MONEYS</div>
        </div>
      </div>
      <div className="Transactions__Header__Modals">
        <Modal
          setModal={setModal}
          showModal={showModal}
        >
          <div className="Transactions__Header__Selector">
            <TransactionHeaderWallet onClick={selectWallet} />
          </div>
          <div className='Transactions__Header__Selector'>
            <div>

              {props.wallets.map((wallet: Objects.Wallet) => (<TransactionHeaderWallet onClick={selectWallet} wallet={wallet} />))}
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

const TransactionHeaderWallet = (props: WalletProps): JSX.Element => {
  return (
    <div className='Transactions__Header__Selector__Item' onClick={() => props.onClick(props.wallet?._id || '-1')}>
      <div className="Transactions__Header__Selector__Item__Icon" />
      <div>
        <div className="Transactions__Header__Selector__Item__Name">
          {props.wallet?.name || 'Total'}
        </div>
        <div className="Transactions__Header__Selector__Item__Money">
          {props.wallet?.currency || 'MXN'}: {props.wallet?.money || 0}
        </div>
      </div>
    </div>
  )
}

export default TransactionHeader;
