import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  isLoggedIn,
  isChecking = false,
  redirectPath = "/signin",
  onRedirect,
}) {
  useEffect(() => {
    if (isChecking) return;
    if (!isLoggedIn && typeof onRedirect === "function") {
      onRedirect(redirectPath);
    }
  }, [isChecking, isLoggedIn, onRedirect, redirectPath]);

  if (isChecking) {
    return (
      <section className="auth page__section">
        <h1 className="auth__title">Carregando...</h1>
      </section>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
