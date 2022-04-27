/** Transactions.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Transactions Page for the App
 */
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

// hooks
import { MainStore, TransactionPageStore } from '../../Hooks/ContextStore';
import useTransactions from '../../Hooks/UseTransactions';

// Components
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import DataMonthSelector from './DataMonthSelector';
import RedirectToWallets from './RedirectToWallets';
import TransactionViewer from './TransactionViewer';
import WalletTotals from './walletTotals';
import TransactionForm from './TransactionForm';

// Services
import TransactionService from '../../Services/TransactionService';
import CategoryService from '../../Services/CategoryService';

// Utilities
import GetParameters from '../../Utils/GetParameters';
import ParseDataMonth from '../../Utils/ParseDataMonth';

// Styles
import './Transactions.css';
import TransactionHeader from './TransactionsHeader';
import Loading from '../../Components/Loading';

const Transactions = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, wallets, dispatchWallets, dispatchCategories } = useContext(MainStore);
  const navigate = useNavigate();
  const location = useLocation();

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);
  const categoryService = new CategoryService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionState, dispatchTransactionState] = useTransactions({
    selectedWallet: GetParameters(location.search, 'wallet') || '-1',
    dataMonth: ParseDataMonth(GetParameters(location.search, 'month')),
    report: { earnings: 0, expenses: 0 },
    transactions: [],
  });

  const [addModal, setAddModal] = useState(false);

  // Main API call
  useEffect(() => {
    if (!loaded && authToken.token) {
      // Gets all the wallets of the client
      transactionService
        .getWallets()
        .then((res) => {
          // Sets the available wallets, the transactions are fetched later
          dispatchWallets({ type: 'SET', payload: { wallets: res.data } });
          setLoaded(true);
        })
        .catch(() => {
          // console.log(err.response);
          setLoaded(true);
        });

      // Gets all the categories
      categoryService.getCategories().then((catRes) => {
        dispatchCategories({
          type: 'UPDATE',
          payload: catRes.data,
        });
      });
    }
  }, []);

  // Code that is run everytime the selectedWalletId changes
  useEffect(() => {
    loadTransactions(transactionState.selectedWallet, transactionState.dataMonth);
  }, [transactionState.selectedWallet, transactionState.dataMonth]);

  // Gets the transactions from the API of the selected wallet
  const loadTransactions = async (walletId: string, dataMonth: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId, dataMonth, setLoadingTransactions);
    dispatchTransactionState({
      type: 'SET',
      payload: {
        dataMonth: transactionState.dataMonth,
        selectedWallet: transactionState.selectedWallet,
        transactions: res.data,
      },
    });
  };

  // Redirects to the wallet when the header selector changes
  const changeSelectedWallet = (data: string): void => {
    if (data !== transactionState.selectedWallet) {
      navigate(`/home?wallet=${data}`);
      dispatchTransactionState({ type: 'SELECT-WALLET', payload: data });
    }
  };

  // Extracted HTML components
  const header =
    loaded && wallets.length > 0 ? (
      <TransactionHeader selectedWallet_id={transactionState.selectedWallet} onChange={changeSelectedWallet} />
    ) : (
      <></>
    );

  return (
    <TransactionPageStore.Provider value={{ transactionState, dispatchTransactionState }}>
      <Page loading={!loaded} header={header} selected="Transactions">
        {loaded ? (
          <div className="Transactions">
            {wallets.length == 0 ? (
              <RedirectToWallets />
            ) : (
              <>
                <div className="Transactions__Content">
                  <DataMonthSelector />
                  {!loadingTransactions ? (
                    <>
                      {transactionState.transactions.length > 0 && <WalletTotals totals={transactionState.report} />}
                      <TransactionViewer />
                    </>
                  ) : (
                    <div className="Transactions__Content__Loading">
                      <Loading className="Transactions__Spinner" />
                    </div>
                  )}
                </div>
                <Button accent round className="Wallets__AddFloat" onClick={() => setAddModal(true)}>
                  <FaIcons.FaPlus />
                </Button>
                <TransactionForm state={addModal} setState={setAddModal} />
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </Page>
    </TransactionPageStore.Provider>
  );
};

export default Transactions;
