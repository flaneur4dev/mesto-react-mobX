import { memo, useState, useEffect, useContext } from 'react';
import Card from './Card';
import { api } from '../utils/api';

// import { observer } from 'mobx-react';
// import { popupStore } from '../storage/PopupStore';
import { addPlacePopupStore, editProfilePopupStore, editAvatarPopupStore, confirmPopupStore } from '../storage/PopupStore';
import { userStore } from '../storage/UserStore';

function Main(props) {

  console.log('Main');

  useEffect(() => {
    Promise.all([
      api.getUserData(),
      // api.getInitialCards()
    ]).then(([ data ]) => {
      userStore.setCurrentUser(data);
        // setCards(cards)
      })
      .catch(err => alert(err))
      // .finally(() => setIsAppLoading(false))
  }, [])



  const [tipStyle, setTipStyle] = useState({ display: 'none', top: '', left: '' });
  const [tipContent, setTipContent] = useState('');

  function handleTipOpen({ clientX, clientY, target: { scrollWidth, clientWidth, textContent } }) {
    if (scrollWidth > clientWidth) {
      setTipStyle({
        display: 'block',
        top: `${clientY + window.pageYOffset + 10}px`,
        left: `${clientX + window.pageXOffset + 10}px`,
      })
      setTipContent(textContent)
    }
  }

  function handleTipClose() {
    setTipStyle(prevState => ({ ...prevState, display: 'none' }))
  }

  return (
    <main className="page__section">
      <section className="profile">
        <div className="profile__container">
          <img
            // src={currentUser.avatar}
            src={userStore.currentUser.avatar}
            className="profile__image"
            name="avatar-button"
            alt="Аватар"
            onClick={() => editAvatarPopupStore.open()}
          />
        </div>

        <div className="profile__wrapper">
          <h1 className="profile__title" onMouseMove={handleTipOpen} onMouseLeave={handleTipClose}>
            {userStore.currentUser.name}
          </h1>
          <button
            className="profile__button profile__button_type_edit-button"
            type="button"
            name="edit-button"
            // onClick={props.onEditProfile}
            onClick={() => editProfilePopupStore.open()}
          />
          <p className="profile__subtitle" onMouseMove={handleTipOpen} onMouseLeave={handleTipClose}>
            {userStore.currentUser.about}
          </p>
        </div>

        <button
          className="profile__button profile__button_type_add-button"
          type="button"
          name="add-button"
          // onClick={props.onAddPlace}
          onClick={() => addPlacePopupStore.open()}
        />
      </section>

      {props.cards.length
          ? (
            <section className="elements">
              {props.cards.map(card => (
                <Card
                  key={card._id}
                  card={card}
                  // userId={currentUser._id}
                  userId={userStore.currentUser._id}
                  onCardClick={props.onCardClick}
                  onCardLike={props.onCardLike}
                  // onCardDelete={props.onCardDelete}
                  onCardDelete={confirmPopupStore.open}
                  handleTipOpen={handleTipOpen}
                  handleTipClose={handleTipClose}
                />
              ))}
            </section>
            )
          : <div style={{ textAlign: 'center', fontSize: '20px' }}>Список пуст</div>
      }

      <span className="tip" style={tipStyle}>{tipContent}</span>
    </main>
  )
}

export default memo(Main)
// export default observer(Main)
