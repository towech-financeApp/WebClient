/** CategorySelecor
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Selector for categories
 */
// Libraries
import React, { useContext, useEffect, useState } from 'react';

// Components
import Modal from '../../Components/Modal';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Models
import { Objects } from '../../models';

// Utilities
import { IdIcons } from '../../Icons';

interface CategorySelectorProps {
  error?: boolean;
  value?: string;
  onChange?: any;
  name?: string;
  visible: boolean;
  edit?: boolean;
  parentSelector?: boolean;
  transfer?: boolean;
}

const CategorySelector = (props: CategorySelectorProps): JSX.Element => {
  const { categories } = useContext(MainStore);
  const [categoryType, setCategoryType] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null as Objects.Category | null);

  // Start useEffect, only updates the when the form is visible
  useEffect(() => {
    if (props.visible && props.value !== (selectedCategory?._id || '-1')) {
      // TODO: When categories are editable, fetch to check if there are new ones
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible]);

  // Functions
  const searchAndSetView = (id: string): void => {
    const allCats = [...categories.Expense, ...categories.Income];
    let selected: Objects.Category | undefined;

    switch (id) {
      case '-4':
        selected = { _id: '-4', name: 'None (Expense)', type: 'Expense', user_id: '-1', parent_id: '-1', icon_id: 0 };
        break;
      case '-3':
        selected = { _id: '-3', name: 'None (Income)', type: 'Income', user_id: '-1', parent_id: '-1', icon_id: 0 };
        break;
      case '-2':
        selected = { _id: '-2', name: 'Transfer', type: 'Expense', user_id: '-1', parent_id: '-1', icon_id: -2 };
        break;
      default:
        selected = allCats.find((cat) => cat._id === id);
    }

    setSelectedCategory(selected || null);
  };

  const setCategoryCallback = (id: string): void => {
    searchAndSetView(id);
    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: id,
        },
      });
    }
    setShowModal(false);
  };

  const getSelectedCategoryClass = (category: Objects.Category): string => {
    let output =
      category.parent_id === '-1'
        ? 'NewTransactionForm__CategorySelector__Category__Icon'
        : 'NewTransactionForm__CategorySelector__SubCategory__Icon';

    if (category._id === selectedCategory?._id) {
      output += ' selected';
    }

    return output;
  };

  return (
    <div className={props.transfer ? 'loading' : ''}>
      <div
        className={props.error ? 'NewTransactionForm__CategorySelector error' : 'NewTransactionForm__CategorySelector'}
        onClick={() => setShowModal(true)}
      >
        <IdIcons.Variable
          iconid={selectedCategory?.icon_id || 0}
          className="NewTransactionForm__CategorySelector__Icon"
        />
        <div className="NewTransactionForm__CategorySelector__Name">{selectedCategory?.name || 'Select Category'}</div>
        <div className="NewTransactionForm__CategorySelector__Triangle" />
      </div>

      <Modal setModal={setShowModal} showModal={showModal}>
        <>
          {/* Header selector */}
          <div className="NewTransactionForm__CategorySelector__Container">
            {!props.edit && !props.parentSelector && (
              <div className={categoryType === 0 ? 'selected' : ''} onClick={() => setCategoryType(0)}>
                Other
              </div>
            )}
            <div className={categoryType === 1 ? 'selected' : ''} onClick={() => setCategoryType(1)}>
              Income
            </div>
            <div className={categoryType === 2 ? 'selected' : ''} onClick={() => setCategoryType(2)}>
              Expense
            </div>
          </div>
          {/* Categories */}
          <div className="NewTransactionForm__CategorySelector__ListContainer">
            {/* None selector */}
            {props.parentSelector && (
              <div
                className="NewTransactionForm__CategorySelector__Category"
                onClick={() => setCategoryCallback(categoryType === 1 ? '-3' : '-4')}
              >
                <IdIcons.Variable
                  iconid={0}
                  className={getSelectedCategoryClass({
                    parent_id: '-1',
                    _id: categoryType === 1 ? '-3' : '-4',
                    icon_id: 0,
                    name: categoryType === 1 ? 'None (Income)' : 'None (Expense)',
                  } as Objects.Category)}
                />
                <div className="NewTransactionForm__CategorySelector__Category__Name">
                  {categoryType === 1 ? 'None (Income)' : 'None (Expense)'}
                </div>
              </div>
            )}
            {/* Other Categories */}
            {categoryType === 0 ? (
              <>
                <div
                  className="NewTransactionForm__CategorySelector__Category"
                  key="-2"
                  onClick={() => setCategoryCallback('-2')}
                >
                  <IdIcons.Variable
                    iconid={-2}
                    className={getSelectedCategoryClass({
                      parent_id: '-1',
                      _id: '-2',
                      icon_id: -2,
                      name: 'transfer',
                    } as Objects.Category)}
                  />
                  <div className="NewTransactionForm__CategorySelector__Category__Name">Transfer</div>
                </div>
              </>
            ) : categoryType === 1 ? (
              categories.Income.map((cat: Objects.Category) => (
                <div
                  className={
                    cat.parent_id === '-1'
                      ? 'NewTransactionForm__CategorySelector__Category'
                      : 'NewTransactionForm__CategorySelector__SubCategory'
                  }
                  key={cat._id}
                  onClick={() => setCategoryCallback(cat._id)}
                >
                  <IdIcons.Variable iconid={cat.icon_id} className={getSelectedCategoryClass(cat)} />
                  <div
                    className={
                      cat.parent_id === '-1'
                        ? 'NewTransactionForm__CategorySelector__Category__Name'
                        : 'NewTransactionForm__CategorySelector__SubCategory__Name'
                    }
                  >
                    {cat.name}
                  </div>
                </div>
              ))
            ) : (
              categories.Expense.map((cat: Objects.Category) => (
                <div
                  className={
                    cat.parent_id === '-1'
                      ? 'NewTransactionForm__CategorySelector__Category'
                      : 'NewTransactionForm__CategorySelector__SubCategory'
                  }
                  key={cat._id}
                  onClick={() => setCategoryCallback(cat._id)}
                >
                  <IdIcons.Variable iconid={cat.icon_id} className={getSelectedCategoryClass(cat)} />
                  <div
                    className={
                      cat.parent_id === '-1'
                        ? 'NewTransactionForm__CategorySelector__Category__Name'
                        : 'NewTransactionForm__CategorySelector__SubCategory__Name'
                    }
                  >
                    {cat.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      </Modal>
    </div>
  );
};

export default CategorySelector;
