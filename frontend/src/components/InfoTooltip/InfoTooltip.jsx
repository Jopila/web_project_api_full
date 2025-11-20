import successIcon from "../../images/check-icon.png";
import failIcon from "../../images/uncheck-button.png";
import closeIcon from "../../images/icon-close.png";

export default function InfoTooltip({
  isOpen,
  isSuccess = true,
  message = "",
  onClose,
}) {
  if (!isOpen) return null;

  const icon = isSuccess ? successIcon : failIcon;
  const altText = isSuccess ? "Sucesso" : "Erro";

  return (
    <div className="tooltip">
      <div className="tooltip__overlay" onClick={onClose} />
      <div className="tooltip__container">
        <button
          className="tooltip__close"
          type="button"
          aria-label="Fechar"
          onClick={onClose}
        >
          <img
            className="tooltip__close-icon"
            src={closeIcon}
            alt="Fechar"
          />
        </button>
        <img className="tooltip__icon" src={icon} alt={altText} />
        <h2 className="tooltip__message">{message}</h2>
      </div>
    </div>
  );
}
