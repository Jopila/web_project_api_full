export default function ImagePopup({ card }) {
  if (!card) return null;
  const { name, link } = card;

  return (
    <>
      <img className="popup__image" src={link} alt={name} />
      <p className="popup__caption">{name}</p>
    </>
  );
}
