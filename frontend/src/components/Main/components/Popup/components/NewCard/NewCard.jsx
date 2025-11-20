import { useMemo, useState } from "react";
import { HTTPS_URL_REGEX } from "../../../../../../util/constants.js";

export default function NewCard({ onAddPlaceSubmit }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const isValid = useMemo(() => {
    const titleOk = title.trim().length >= 2 && title.trim().length <= 30;
    const urlOk = HTTPS_URL_REGEX.test(link.trim());
    return titleOk && urlOk;
  }, [title, link]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const payload = { title: title.trim(), link: link.trim() };
    if (onAddPlaceSubmit) {
      onAddPlaceSubmit(payload);
    }

    setTitle("");
    setLink("");
  }

  return (
    <form
      className="form"
      name="add-card-form"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input
        className="form__input form__input_type_title"
        id="title-input"
        type="text"
        name="title"
        placeholder="Titulo"
        minLength={2}
        maxLength={30}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <span className="form__input-error title-input-error"></span>

      <input
        className="form__input form__input_type_link"
        id="link-input"
        type="url"
        name="link"
        placeholder="URL da imagem"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required
      />
      <span className="form__input-error link-input-error"></span>

      <button
        className={`form__submit${!isValid ? " form__submit_disabled" : ""}`}
        type="submit"
        disabled={!isValid}
      >
        Salvar
      </button>
    </form>
  );
}

