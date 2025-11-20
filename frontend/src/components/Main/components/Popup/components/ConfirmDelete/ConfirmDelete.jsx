export default function ConfirmDelete({ onConfirm }) {
  function handleSubmit(e) {
    e.preventDefault();
    onConfirm();
  }

  return (
    <form className="form form_type_confirm" onSubmit={handleSubmit}>
      <button className="form__submit" type="submit">
        Sim
      </button>
    </form>
  );
}

