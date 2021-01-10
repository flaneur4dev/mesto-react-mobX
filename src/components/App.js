import { useState, useEffect, useRef } from 'react';
import Loader from './Loader'
import Header from './Header'
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import { api } from '../utils/api';
import { confirmPopupStore } from '../storage/PopupStore';

import { observer } from 'mobx-react';

function App() {

  console.log('App');

  const [isAppLoading, setIsAppLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState({ isOpen: false, currentCard: {} });


  // 11 ---
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([
      // api.getUserData(),
      api.getInitialCards()
    ]).then(([ cards ]) => {
        // setCurrentUser(data);
        setCards(cards)
      })
      .catch(err => alert(err))
      .finally(() => setIsAppLoading(false))
  }, [])
  
    // console.log(cards);
    

  // const [saveButtonTitle, setSaveButtonTitle] = useState(defaultSubmitTitle.save);
  // const [addButtonTitle, setAddButtonTitle] = useState(defaultSubmitTitle.add);
  // const [confirmButtonTitle, setConfirmButtonTitle] = useState(defaultSubmitTitle.confirm );

  // const [isSubmitDisabled, setIsSubmitDisabled] = useState(defaultSubmitButtons);
  // const [validationMessage, setValidationMessage] = useState(defaultValidationMessage);
  
  // const inputsRef = useRef(new Set());

  // function handleChange(input) {
  //   setCustomErrorMessages(input);

  //   inputsRef.current.add(input);

  //   const isDisabled = !input.form.checkValidity();

  //   setIsSubmitDisabled(prevState => ({ ...prevState, [input.form.id]: isDisabled }));
  //   setValidationMessage(prevState => ({ ...prevState, [input.id]: input.validationMessage }));
  // }

  function handleUpdateUser(newUser) {
    // setSaveButtonTitle('Сохранение <span class ="dot">.</span>')

    api.updateUserData(newUser)
      .then(data => setCurrentUser(data))
      .catch(err => alert(err))
      .finally(() => {
        // setSaveButtonTitle(defaultSubmitTitle.save)
        closeAllPopups()
      })
  }

  function handleUpdateAvatar(newAvatar) {
    // setSaveButtonTitle('Сохранение <span class ="dot">.</span>')

    api.updateAvatar(newAvatar)
      .then(data => setCurrentUser(prevState => ({ ...prevState, avatar: data.avatar })))
      .catch(err => alert(err))
      .finally(() => {
        // setSaveButtonTitle(defaultSubmitTitle.save)
        closeAllPopups()
      })
  }

  function handleAddPlaceSubmit(newCard) {
    // setAddButtonTitle('Добавление <span class ="dot">.</span>')

    api.addCard(newCard)
      .then(card => setCards([ ...cards, card ]))
      .catch(err => alert(err))
      .finally(() => {
        // setAddButtonTitle(defaultSubmitTitle.add)
        closeAllPopups()
      })
  }

  const testRef = useRef();
  // console.log(testRef.current);

  function handleCardDelete(event) {
    event.preventDefault();

    // setConfirmButtonTitle('Удаление <span class ="dot">.</span>')

    api.deleteCard(testRef.current)
      .then(() => {
        const newCards = cards.filter(item => item._id !== testRef.current);
        setCards(newCards)
      })
      .catch(err => alert(err))
      .finally(() => {
        // setConfirmButtonTitle(defaultSubmitTitle.confirm)
        closeAllPopups()
      })
  }

  function handleCardLike(cardId, isLiked) {
    if (isLiked) {
      api.deleteLike(cardId)
        .then(card => {
          if (card.likes.some(item => item._id !== currentUser._id) || !card.likes.length) {
            const newCards = cards.map(item => item._id === cardId ? card : item);
            setCards(newCards)
          }
        })
        .catch(err => alert(err))
    } else {
      api.addLike(cardId)
        .then(card => {
          if (card.likes.some(item => item._id === currentUser._id)) {
            const newCards = cards.map(item => item._id === cardId ? card : item);
            setCards(newCards)
          }
        })
        .catch(err => alert(err))
    }
  }



  function handleEscClose({ key }) {
    key === 'Escape' && closeAllPopups()
  }

  function addListener() {
    document.onkeydown = handleEscClose;
  }
  // ---

  // function handleAddPlaceClick() {
  //   addListener();
  //   setIsAddPlacePopupOpen(true)
  // }

  // function handleEditProfileClick() {
  //   addListener();
  //   setIsEditProfilePopupOpen(true);
  // }

  // function handleEditAvatarClick() {
  //   addListener();
  //   setIsEditAvatarPopupOpen(true)
  // }

  function handleCardClick(card) {
    addListener();
    setSelectedCard({ isOpen: true, currentCard: card })
  }

  
  // ???
  function handleConfirmClick(cardId) {
    testRef.current = cardId;
    addListener();
    // setIsConfirmPopupOpen(true)
  }
  
  function closeAllPopups() {
    document.onkeydown = '';



    // setIsAddPlacePopupOpen(false);
    // setIsEditProfilePopupOpen(false);
    // setIsEditAvatarPopupOpen(false);
    setSelectedCard(prevState => ({ ...prevState, isOpen: false }));
    // setIsConfirmPopupOpen(false)
  }

  return (
    <div className="page">
      {isAppLoading && <Loader />}
      <Header />
      <Main
        cards={cards}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        // onCardDelete={handleConfirmClick}
      />
      <Footer />

      <AddPlacePopup
        onAddPlace={handleAddPlaceSubmit}
      />

      <EditProfilePopup
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup
        onUpdateAvatar={handleUpdateAvatar}
      />

      <PopupWithForm
        // title='Вы уверены'
        // button={confirmButtonTitle}
        // isOpen={isConfirmPopupOpen}
        // onClose={closeAllPopups}
        name='confirm-form'
        title={confirmPopupStore.popupTitle}
        button={confirmPopupStore.submitButtonTitle}
        isDisabled={confirmPopupStore.isSubmitDisabled}
        isOpen={confirmPopupStore.isOpen}
        onClose={confirmPopupStore.close}
        onSubmit={handleCardDelete}
       />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </div>
  )
}

export default observer(App)
