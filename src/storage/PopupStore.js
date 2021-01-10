import { makeAutoObservable } from 'mobx';
import { setCustomErrorMessages, defaultValidationMessage } from '../utils/utils';

class PopupStore {
  isOpen = false
  popupTitle
  submitButtonTitle
  isSubmitDisabled
  inputs = new Set()
  inputValues = {}
  validationMessage = defaultValidationMessage

  constructor(popupTitle, submitButtonTitle, isSubmitDisabled = false) {
    makeAutoObservable(this)

    this.popupTitle = popupTitle
    this.submitButtonTitle = submitButtonTitle
    this.isSubmitDisabled = isSubmitDisabled
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  setInputValues(newData) {
    this.inputValues = newData
    // console.log(this.inputValues);
  }

  setIsSubmitDisabled(isDisabled) {
    this.isSubmitDisabled = isDisabled
  }

  // validation(input) {
  //   setCustomErrorMessages(input);
  //   this.inputs.add(input);
  //   this.validationMessage = { ...this.validationMessage, [input.id]: input.validationMessage }
  // }

  handleInputChange(input) {
    this.setInputValues({ ...this.inputValues, [input.name]: input.value });

    setCustomErrorMessages(input);
    this.inputs.add(input);
    this.validationMessage = { ...this.validationMessage, [input.id]: input.validationMessage }
  
    this.setIsSubmitDisabled(!input.form.checkValidity());
  }

  handleEscClose = ({ key }) => {
    key === 'Escape' && this.close()
  }

  open() {
    document.addEventListener('keydown', this.handleEscClose)
    this.isOpen = true
  }

  close() {
    document.removeEventListener('keydown', this.handleEscClose)

    // setIsSubmitDisabled(defaultSubmitButtons);

    this.validationMessage = defaultValidationMessage;
    this.inputs.forEach(input => input.setCustomValidity(''));
    this.inputs.clear();

    this.isOpen = false;
    // this.setSelectedCard({ ...this.selectedCard, isOpen: false });
  }


    // setSelectedCard({ isOpen, card }) {
  //   this.addListener();
  //   this.selectedCard = { isOpen, currentCard: card }
  // }
}

export const addPlacePopupStore = new PopupStore('Новое место', 'Добавить', true);
export const editProfilePopupStore = new PopupStore('Редактировать профиль', 'Сохранить');
export const editAvatarPopupStore = new PopupStore('Обновить аватар', 'Сохранить');
export const confirmPopupStore = new PopupStore('Вы уверены', 'Да');
