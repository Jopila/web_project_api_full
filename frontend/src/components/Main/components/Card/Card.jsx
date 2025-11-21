import { useContext, useMemo } from "react";
import ImagePopup from "../Popup/components/ImagePopup/ImagePopup.jsx";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

export default function Card({
  card,
  handleOpenPopup,
  onCardLike,
  onCardDelete,
}) {
  const { currentUser } = useContext(CurrentUserContext) ?? {};
  const userId = currentUser?._id ?? null;

  const { name = "", link = "", likes, owner } = card ?? {};

  // Deriva de likes *apenas se precisar*
  const derivedIsLiked = useMemo(() => {
    const likesArray = Array.isArray(likes) ? likes : [];
    return userId
      ? likesArray.some((like) => {
          const likeId =
            typeof like === "string"
              ? like
              : like && typeof like === "object"
              ? like._id ?? like.id ?? like.userId ?? null
              : null;
          return likeId === userId;
        })
      : false;
  }, [likes, userId]);

  // Preferir o que veio do backend (card.isLiked); fallback para o derivado
  const isLiked = card?.isLiked ?? derivedIsLiked;

  // Contador binário (pedido do tutor)
  const likeCount = isLiked ? 1 : 0;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`.trim();

  function handleLikeClick() {
    if (typeof onCardLike === "function") onCardLike(card);
  }

  function handleDeleteClick() {
    if (typeof onCardDelete === "function") onCardDelete(card);
  }

  function handleImageClick() {
    if (typeof handleOpenPopup !== "function") return;
    handleOpenPopup({
      type: "image",
      title: null,
      children: <ImagePopup card={card} />,
    });
  }

  return (
    <li className="card">
      {userId === owner && (
        <button
          className="card__delete-button"
          type="button"
          aria-label="Excluir"
          onClick={handleDeleteClick}
        />
      )}

      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={handleImageClick}
      />

      <div className="card__footer">
        <h2 className="card__title">{name}</h2>
        <div className="card__like-wrapper">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Curtir"
            aria-pressed={isLiked}
            onClick={handleLikeClick}
          />
          <span className="card__like-count">{likeCount}</span>
        </div>
      </div>
    </li>
  );
}
