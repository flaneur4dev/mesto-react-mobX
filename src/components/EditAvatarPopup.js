import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

import { observer } from 'mobx-react';
import { editAvatarPopupStore } from '../storage/PopupStore';
import { userStore } from '../storage/UserStore';

function EditAvatarPopup(props) {

  console.log('EditAvatar');

  useEffect(
    () => {
      if (editAvatarPopupStore.isOpen) {
        editAvatarPopupStore.setInputValues({ avatar: userStore.currentUser.avatar });
        editAvatarPopupStore.setIsSubmitDisabled(false);
      }
    },
    [editAvatarPopupStore.isOpen]
  )

  function handleInputChange({ target }) {
    editAvatarPopupStore.handleInputChange(target)
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onUpdateAvatar({ avatar: inputRef.current.value })
  }

  return (
    <PopupWithForm
      // title='Обновить аватар'
      // button={props.submitButton}
      // isDisabled={props.isDisabled}
      // isOpen={popupStore.isEditAvatarPopupOpen}
      // onClose={props.onClose}
      name='avatar-form'
      title={editAvatarPopupStore.popupTitle}
      button={editAvatarPopupStore.submitButtonTitle}
      isDisabled={editAvatarPopupStore.isSubmitDisabled}
      isOpen={editAvatarPopupStore.isOpen}
      onClose={editAvatarPopupStore.close}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__wrapper">
        <input
          type="url"
          className="popup__input"
          id="avatar-link"
          name="avatar"
          placeholder="Ссылка на аватар"
          pattern="^[^\s]+(\s.*)?$"
          required
          value={editAvatarPopupStore.inputValues.avatar || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{editAvatarPopupStore.validationMessage['avatar-link']}</span>
      </fieldset>
    </PopupWithForm>
  )
}

export default observer(EditAvatarPopup)
