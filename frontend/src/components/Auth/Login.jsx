import { useCallback, useState } from "react";

export default function Login({
  onSubmit,
  isSubmitting = false,
  errorMessage = "",
  onNavigateToRegister,
}) {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (typeof onSubmit !== "function" || isSubmitting) return;
      onSubmit({
        email: formValues.email.trim(),
        password: formValues.password,
      });
    },
    [formValues, isSubmitting, onSubmit]
  );

  return (
    <section className="auth page__section">
      <h1 className="auth__title">Entrar</h1>
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <label className="auth__field">
          <input
            className="auth__input"
            type="email"
            name="email"
            placeholder="E-mail"
            value={formValues.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <span className="auth__underline" />
        </label>

        <label className="auth__field">
          <input
            className="auth__input"
            type="password"
            name="password"
            placeholder="Senha"
            value={formValues.password}
            onChange={handleChange}
            minLength={6}
            required
            autoComplete="current-password"
          />
          <span className="auth__underline" />
        </label>

        {errorMessage && <p className="auth__error">{errorMessage}</p>}

        <button
          className="auth__submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="auth__caption">
        Ainda não é membro?{" "}
        <button
          className="auth__link"
          type="button"
          onClick={onNavigateToRegister}
          disabled={isSubmitting}
        >
          Inscreva-se aqui!
        </button>
      </p>
    </section>
  );
}
