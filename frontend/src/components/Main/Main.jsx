import { useContext, useEffect, useState } from "react";
import Card from "./components/Card/Card.jsx";
import Popup from "./components/Popup/Popup.jsx";
import NewCard from "./components/Popup/components/NewCard/NewCard.jsx";
import EditProfile from "./components/Popup/components/EditProfile/EditProfile.jsx";
import EditAvatar from "./components/Popup/components/EditAvatar/EditAvatar.jsx";
import { INITIAL_PROFILE, LS_PROFILE_KEY } from "../../util/constants.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({
  cards = [],
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
  popup = null,
  onOpenPopup,
  onClosePopup,
}) {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileHydrated, setProfileHydrated] = useState(false);

  const contextValue = useContext(CurrentUserContext) ?? {};
  const { currentUser, handleUpdateUser, handleUpdateAvatar } = contextValue;
  const displayedUser = currentUser ?? profile;

  const openPopup = onOpenPopup ?? (() => {});
  const closePopup = onClosePopup ?? (() => {});
  const likeHandler = typeof onCardLike === "function" ? onCardLike : () => {};
  const deleteHandler =
    typeof onCardDelete === "function" ? onCardDelete : () => {};
  const addCardHandler =
    typeof onAddPlaceSubmit === "function" ? onAddPlaceSubmit : () => {};

  useEffect(() => {
    if (!currentUser) return;
    setProfile({
      name: currentUser.name ?? INITIAL_PROFILE.name,
      about: currentUser.about ?? INITIAL_PROFILE.about,
      avatar: currentUser.avatar ?? INITIAL_PROFILE.avatar,
    });
  }, [currentUser]);

  useEffect(() => {
    if (!profileHydrated) return;
    try {
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error("Falha ao salvar perfil no localStorage", err);
    }
  }, [profile, profileHydrated]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PROFILE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      setProfile({
        name: data?.name ?? INITIAL_PROFILE.name,
        about: data?.about ?? INITIAL_PROFILE.about,
        avatar: data?.avatar ?? INITIAL_PROFILE.avatar,
      });
    } catch (err) {
      console.error("Falha ao carregar perfil do localStorage", err);
    } finally {
      setProfileHydrated(true);
    }
  }, []);

  const newCardPopup = {
    title: "Novo local",
    children: <NewCard onAddPlaceSubmit={addCardHandler} />,
  };

  const editProfilePopup = {
    title: "Editar perfil",
    children: (
      <EditProfile
        defaultName={displayedUser.name}
        defaultAbout={displayedUser.about}
        onSubmit={handleUpdateUser}
      />
    ),
  };

  const editAvatarPopup = {
    type: "avatar",
    title: "Alterar foto de perfil",
    children: <EditAvatar onSubmit={handleUpdateAvatar} />,
  };

  return (
    <main className="content page__section">
      <section className="profile">
        <div className="profile__avatar-wrap">
          <img
            className="profile__avatar"
            src={displayedUser.avatar}
            alt={`Avatar de ${displayedUser.name ?? ""}`}
          />
          <button
            className="profile__avatar-edit-button"
            type="button"
            aria-label="Alterar avatar"
            onClick={() => openPopup(editAvatarPopup)}
          />
        </div>

        <div className="profile__info">
          <div className="profile__info-header">
            <h2 className="profile__name">{displayedUser.name}</h2>
            <button
              className="profile__edit-button"
              type="button"
              aria-label="Editar perfil"
              onClick={() => openPopup(editProfilePopup)}
            />
          </div>
          <p className="profile__about">{displayedUser.about}</p>
        </div>

        <button
          className="profile__add-button"
          type="button"
          aria-label="Adicionar novo local"
          onClick={() => openPopup(newCardPopup)}
        />
      </section>

      <section className="elements">
        <ul className="elements__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={likeHandler}
              onCardDelete={deleteHandler}
              handleOpenPopup={openPopup}
            />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup onClose={closePopup} title={popup.title} type={popup.type}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
