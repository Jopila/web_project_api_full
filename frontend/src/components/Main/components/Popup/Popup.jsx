import { useEffect, useId, useRef } from "react";

export default function Popup({ title, children, isOpen = true, onClose, type }) {
  const containerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    // Foca o botão de fechar ao abrir e adiciona Escape para fechar
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleContainerKeyDown(e) {
    if (e.key !== "Tab") return;
    const root = containerRef.current;
    if (!root) return;
    const focusable = root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) {
      e.preventDefault();
      closeBtnRef.current?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const typeClass = type ? ` popup_type_${type}` : "";

  return (
    <div
      className={`popup${typeClass} ${isOpen ? "popup_opened" : ""}`}
      onClick={(event) => {
        if (event.target.classList.contains("popup")) {
          onClose();
        }
      }}
    >
      <div
        ref={containerRef}
        className={`popup__container ${!title ? "popup__image-container" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `popup-title-${titleId}` : undefined}
        aria-label={!title ? "Visualização de imagem" : undefined}
        onKeyDown={handleContainerKeyDown}
      >
        <button
          ref={closeBtnRef}
          className="popup__close"
          type="button"
          aria-label="Fechar popup"
          onClick={onClose}
        />
        {title && (
          <h3 id={`popup-title-${titleId}`} className="popup__title">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
