import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

import { observer } from 'mobx-react';
import { addPlacePopupStore } from '../storage/PopupStore';

function AddPlacePopup(props) {

  console.log('AddPlace');
  
  useEffect(
    () => {
      if (addPlacePopupStore.isOpen) {
        addPlacePopupStore.setInputValues({ name: '', link: '' });
        addPlacePopupStore.setIsSubmitDisabled(true);
      }
    },
    [addPlacePopupStore.isOpen]
  )

  function handleInputChange({ target }) {
    addPlacePopupStore.handleInputChange(target)
  }

  function handleSubmit(event) {
    event.preventDefault();
    // props.onAddPlace(inputValue)
  }

  return (
    <PopupWithForm
      // title='Новое место'
      // button={props.submitButton}
      // isDisabled={props.isDisabled}
      // isOpen={popupStore.isAddPlacePopupOpen}
      name='add-form'
      title={addPlacePopupStore.popupTitle}
      button={addPlacePopupStore.submitButtonTitle}
      isDisabled={addPlacePopupStore.isSubmitDisabled}
      isOpen={addPlacePopupStore.isOpen}
      onClose={addPlacePopupStore.close}
      // onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__wrapper">
        <input
          type="text"
          className="popup__input"
          id="name"
          name="name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          pattern="^[^\s]+(\s.*)?$"
          required
          value={addPlacePopupStore.inputValues.name || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{addPlacePopupStore.validationMessage.name}</span>
        <input
          type="url"
          className="popup__input"
          id="link"
          name="link"
          placeholder="Ссылка на картинку"
          pattern="^[^\s]+(\s.*)?$"
          required
          value={addPlacePopupStore.inputValues.link || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{addPlacePopupStore.validationMessage.link}</span>
      </fieldset>
    </PopupWithForm>
  )

}

export default observer(AddPlacePopup)
