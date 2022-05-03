/** TransactionsHeader.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Header that allows to change the selected wallet
 */
// Libraries
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// hooks
import { MainStore, TransactionPageStore } from '../../Hooks/ContextStore';

// Models
import { Objects } from '../../models';

// Components
import Modal from '../../Components/Modal';

// Utils
import ParseMoneyAmount from '../../Utils/ParseMoneyAmount';

// Styles
import './Transactions.css';

// Interfaces
interface WalletProps {
  onClick: (id: string) => void;
  wallet?: Objects.Wallet;
  total?: number;
}

const TransactionHeader = (): JSX.Element => {
  const { wallets } = useContext(MainStore);
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);
  const navigate = useNavigate();

  // Hooks
  const [showModal, setModal] = useState(false);

  // Functions
  const selectWallet = (id: string) => {
    if (id !== transactionState.selectedWallet) {
      navigate(`/home?wallet=${id}`);
      dispatchTransactionState({ type: 'SELECT-WALLET', payload: id });
    }
    setModal(false);
  };

  const getNameAndTotal = (
    wallets: Objects.Wallet[],
    selected: string,
  ): { name: string; total: number; money: number } => {
    const output = {
      name: 'Total',
      total: 0,
      money: 0,
    };

    for (let i = 0; i < wallets.length; i++) {
      output.total += wallets[i].money || 0;

      if (wallets[i]._id === selected) {
        output.name = wallets[i].name;
        output.money = wallets[i].money || 0;
      }
    }

    if (transactionState.selectedWallet === '-1') output.money = output.total;

    return output;
  };

  // Variables
  const displayed = getNameAndTotal(wallets, transactionState.selectedWallet);

  return (
    <>
      <div className="Transactions__Header" onClick={() => setModal(true)}>
        <div className="Transactions__Header__Icon">
          <div className="Transactions__Header__Icon__Triangle" />
          <div className="Transactions__Header__Icon__Circle" />
        </div>
        <div className="Transactions__Header__Wallet">
          <div className="Transactions__Header__Wallet__Name">{displayed.name}</div>
          <div className="Transactions__Header__Wallet__Money">
            MXN:&nbsp;
            <div className={displayed.money >= 0 ? '' : 'Transactions__Header__Wallet__Money__Amount'}>
              {ParseMoneyAmount(displayed.money)}
            </div>
          </div>
        </div>
      </div>
      <Modal setModal={setModal} showModal={showModal} title="Select a wallet">
        <div className="Transactions__Header__Selector">
          <TransactionHeaderWallet onClick={selectWallet} total={displayed.total} key="-1" />
        </div>
        <div className="Transactions__Header__Selector">
          {wallets.map((wallet: Objects.Wallet) => (
            <TransactionHeaderWallet onClick={selectWallet} wallet={wallet} key={wallet._id} />
          ))}
        </div>
      </Modal>
    </>
  );
};

const TransactionHeaderWallet = (props: WalletProps): JSX.Element => {
  return (
    <div className="Transactions__Header__Selector__Item" onClick={() => props.onClick(props.wallet?._id || '-1')}>
      <div className="Transactions__Header__Selector__Item__Icon" />
      <div className="Transactions__Header__Selector__Item__Text">
        <div className="Transactions__Header__Selector__Item__Name">{props.wallet?.name || 'Total'}</div>
        <div className="Transactions__Header__Selector__Item__Money">
          {props.wallet?.currency || 'MXN'}:{' '}
          {ParseMoneyAmount(props.wallet?.money || props.total)}
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
