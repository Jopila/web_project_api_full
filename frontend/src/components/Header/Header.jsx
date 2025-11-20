import { useState } from "react";
import logo from "../../images/Logo.png";
import navIcon from "../../images/icon-nav.png";
import closeIcon from "../../images/icon-close.png";

export default function Header({
  isLoggedIn = false,
  userEmail = "",
  onLogout,
  onNavigateToLogin,
  onNavigateToRegister,
  currentPath = "/",
}) {
  const isOnLogin = currentPath === "/signin";
  const isOnRegister = currentPath === "/signup";
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
    setMobileMenuOpen(false);
  };

  const headerClassNames = [
    "header",
    "page__section",
    isLoggedIn ? "header--logged" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const navClassNames = ["header__nav", !isLoggedIn ? "header__nav--public" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassNames}>
      {isLoggedIn && (
        <div
          className={`header__drawer ${
            isMobileMenuOpen ? "header__drawer--open" : ""
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          {userEmail && (
            <span className="header__drawer-email">{userEmail}</span>
          )}
          <button
            className="header__drawer-link"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      )}
      <div className="header__top-row">
        <img className="header__logo" src={logo} alt="Around The U.S. logo" />
        {isLoggedIn && (
          <button
            className="header__menu-toggle"
            type="button"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={toggleMobileMenu}
            onMouseEnter={(e) => e.currentTarget.classList.add("header__menu-toggle--hover")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("header__menu-toggle--hover")}
          >
            <img
              src={isMobileMenuOpen ? closeIcon : navIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      <nav className={navClassNames}>
        {isLoggedIn ? (
          <>
            {userEmail && <span className="header__email">{userEmail}</span>}
            <button className="header__link" type="button" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : isOnLogin ? (
          <button
            className="header__link"
            type="button"
            onClick={onNavigateToRegister}
          >
            Inscrever-se
          </button>
        ) : isOnRegister ? (
          <button
            className="header__link"
            type="button"
            onClick={onNavigateToLogin}
          >
            Entrar
          </button>
        ) : null}
      </nav>
    </header>
  );
}
