import { useContext, useRef, useState } from "react";
import { HTTPS_URL_REGEX } from "../../../../../../util/constants.js";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext.js";

export default function EditAvatar({ onSubmit }) {
  const inputRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const { handleUpdateAvatar } = useContext(CurrentUserContext) ?? {};

  function getInputValue() {
    return inputRef.current?.value?.trim() ?? "";
  }

  function handleInputChange(event) {
    const value = event.target.value.trim();
    setIsValid(HTTPS_URL_REGEX.test(value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const value = getInputValue();
    if (!HTTPS_URL_REGEX.test(value)) return;

    const payload = { avatar: value };
    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (handleUpdateAvatar) {
        await handleUpdateAvatar(payload);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setIsValid(false);
    } catch (error) {
      console.error("Falha ao atualizar avatar", error);
    }
  }

  return (
    <form
      className="form"
      name="avatar-form"
      id="avatar-form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        className="form__input form__input_type_avatar"
        id="avatar-input"
        type="url"
        name="avatar"
        placeholder="URL do novo avatar"
        required
        autoComplete="off"
        onChange={handleInputChange}
      />
      <span className="form__input-error avatar-input-error"></span>

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

