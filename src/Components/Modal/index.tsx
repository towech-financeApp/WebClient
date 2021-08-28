/** Modal.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom modal component
 */
import React, { useRef, useEffect, useCallback } from 'react';
import './Modal.css';
import { useSpring, animated } from 'react-spring';
import Button from '../Button';

interface Props {
  accept?: string;
  children?: JSX.Element | JSX.Element[];
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept?: any;
  onClose?: any;
  title?: string;
}

const Modal = (props: Props): JSX.Element => {
  const modalRef = useRef();

  const animation = useSpring({
    config: {
      duration: 250,
    },
    transform: props.showModal ? `translateY(0%)` : `translateY(200%)`,
  });

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
    <>
      {props.showModal ? (
        <div className="Modal__background" ref={modalRef as any} onClick={closeModalRef}>
          <animated.div style={animation} className="Modal">
            <div className="Modal__header">
              <div>
                <h1>{props.title ? props.title : ''}</h1>
              </div>
              <button className="Modal__close" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="Modal__Body">{props.children}</div>
            <div className="Modal__Footer">
              {(props.accept || props.onAccept) && (
                <div className="Modal__Confirm">
                  <Button onClick={confirmAction}>{props.accept ? props.accept : 'OK'}</Button>
                </div>
              )}
            </div>
          </animated.div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
