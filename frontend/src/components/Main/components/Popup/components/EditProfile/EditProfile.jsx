import { useContext, useEffect, useMemo, useState } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext.js";

export default function EditProfile({ defaultName = "", defaultAbout = "", onSubmit }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext) ?? {};
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultAbout);

  useEffect(() => {
    if (typeof defaultName === "string") setName(defaultName);
    if (typeof defaultAbout === "string") setDescription(defaultAbout);
  }, [defaultName, defaultAbout]);

  useEffect(() => {
    if (!currentUser) return;
    if (typeof currentUser.name === "string") setName(currentUser.name);
    if (typeof currentUser.about === "string") setDescription(currentUser.about);
  }, [currentUser]);

  const isValid = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    return (
      trimmedName.length >= 2 &&
      trimmedName.length <= 40 &&
      trimmedDescription.length >= 2 &&
      trimmedDescription.length <= 200
    );
  }, [name, description]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const payload = { name: name.trim(), about: description.trim() };
    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (handleUpdateUser) {
        await handleUpdateUser(payload);
      }
    } catch (error) {
      console.error("Falha ao atualizar perfil", error);
    }
  }

  return (
    <form className="form" name="profile-form" id="profile-form" noValidate onSubmit={handleSubmit}>
      <input
        className="form__input form__input_type_name"
        id="name-input"
        type="text"
        name="name"
        placeholder="Nome"
        minLength={2}
        maxLength={40}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <span className="form__input-error name-input-error"></span>

      <input
        className="form__input form__input_type_about"
        id="about-input"
        type="text"
        name="about"
        placeholder="Sobre mim"
        minLength={2}
        maxLength={200}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <span className="form__input-error about-input-error"></span>

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

