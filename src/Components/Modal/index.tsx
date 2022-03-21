/** Modal.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom modal component
 */
import React, { useRef, useEffect, useCallback } from 'react';
import './Modal.css';
import * as FaIcons from 'react-icons/fa';

// Components
import Loading from '../Loading';
import Button from '../Button';

interface Props {
  accept?: string | JSX.Element;
  children?: string | JSX.Element | JSX.Element[];
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept?: any;
  onClose?: any;
  title?: string;
  loading?: boolean;
}

const Modal = (props: Props): JSX.Element => {
  let theme = 'Modal__Body';
  if (props.loading) theme += ' loading';

  const modalRef = useRef();

  // Function that closes the modal
  const closeModal = () => {
    if (props.onClose) props.onClose();
    props.setModal(false);
  };

  // Function that handles the closing of the modal using ref
  const closeModalRef = (e: any) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  // Function that is executed when the OK button is pressed

  const confirmAction = (): void => {
    if (props.onAccept) props.onAccept();
    else props.setModal(false);
  };

  // Keypress detector
  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Escape' && props.showModal) {
        closeModal();
      }
    },
    [props.setModal, props.showModal],
  );

  // useEffect for the keypress
  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  return (
    // <div className="Modal">
    <div className={props.showModal ? 'Modal active' : 'Modal'}>
      <div className="Modal__background" ref={modalRef as any} onClick={closeModalRef}>
        <div className="Modal__Content">
          <div className="Modal__header">
            <Button className="Modal__header__button" onClick={closeModal}>
              <FaIcons.FaTimes />
            </Button>
            <div>
              <h1>{props.title ? props.title : ''}</h1>
            </div>
            {(props.accept || props.onAccept) && (
              <Button className="Modal__header__button right" onClick={confirmAction}>
                {props.accept ? props.accept : <FaIcons.FaCheck />}
              </Button>
            )}
          </div>
          <div className={theme}>
            {props.loading && <Loading className="Modal__spinner" />}
            {props.children}
          </div>
          {/* <div className="Modal__Footer">
            {(props.accept || props.onAccept) && (
              <div className="Modal__Confirm">
                <Button onClick={confirmAction}>{props.accept ? props.accept : 'OK'}</Button>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
