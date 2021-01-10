import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

import { observer } from 'mobx-react';
import { editProfilePopupStore } from '../storage/PopupStore';
import { userStore } from '../storage/UserStore';

function EditProfilePopup(props) {

  console.log('EditProfile');

  useEffect(
    () => {
      if (editProfilePopupStore.isOpen) {
        editProfilePopupStore.setInputValues({ name: userStore.currentUser.name, about: userStore.currentUser.about });
        editProfilePopupStore.setIsSubmitDisabled(false);
      }
    },
    [editProfilePopupStore.isOpen]
  )

  function handleInputChange({ target }) {
    editProfilePopupStore.handleInputChange(target)
  }

  function handleSubmit(event) {
    event.preventDefault();
    // props.onUpdateUser(inputValue)
  }

  return (
    <PopupWithForm
      // title='Редактировать профиль'
      // button={props.submitButton}
      // isDisabled={props.isDisabled}
      // isOpen={popupStore.isEditProfilePopupOpen}
      name='edit-form'
      title={editProfilePopupStore.popupTitle}
      button={editProfilePopupStore.submitButtonTitle}
      isDisabled={editProfilePopupStore.isSubmitDisabled}
      isOpen={editProfilePopupStore.isOpen}
      onClose={editProfilePopupStore.close}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__wrapper">
        <input
          type="text"
          className="popup__input"
          id="person"
          name="name"
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          pattern="^[^\s]+(\s.*)?$"
          required
          value={editProfilePopupStore.inputValues.name || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{editProfilePopupStore.validationMessage.person}</span>
        <input
          type="text"
          className="popup__input"
          id="about"
          name="about"
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          pattern="^[^\s]+(\s.*)?$"
          required
          value={editProfilePopupStore.inputValues.about || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{editProfilePopupStore.validationMessage.about}</span>
      </fieldset>
    </PopupWithForm>
  )
}

export default observer(EditProfilePopup)
