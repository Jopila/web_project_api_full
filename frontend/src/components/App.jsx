import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import ConfirmDelete from "./Main/components/Popup/components/ConfirmDelete/ConfirmDelete.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import api from "../utils/api.js";
import {
  authorize,
  checkToken,
  clearToken,
  getToken,
  register,
  saveToken,
} from "../utils/auth.js";

const PUBLIC_ROUTES = new Set(["/signin", "/signup"]);
const VALID_ROUTES = new Set(["/", "/signin", "/signup"]);

const hasHistory =
  typeof window !== "undefined" && typeof window.history !== "undefined";

function normalizeRoute(pathname) {
  if (!pathname) return "/signin";
  const clean = pathname.split("?")[0].split("#")[0] || "/";
  if (!clean.startsWith("/")) return `/${clean}`;
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

function getInitialRoute() {
  if (!hasHistory) return "/signin";
  const normalized = normalizeRoute(window.location.pathname);
  return VALID_ROUTES.has(normalized) ? normalized : "/signin";
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [authToken, setAuthToken] = useState(() => getToken());

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [tooltipState, setTooltipState] = useState({
    isOpen: false,
    isSuccess: true,
    message: "",
  });

  useEffect(() => {
    if (!hasHistory) return undefined;

    const handlePopState = () => {
      const normalized = normalizeRoute(window.location.pathname);
      setCurrentRoute(VALID_ROUTES.has(normalized) ? normalized : "/signin");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((path, options = {}) => {
    const { replace = false } = options;
    const normalized = normalizeRoute(path);

    if (hasHistory) {
      setCurrentRoute((prev) => {
        if (prev === normalized) {
          if (replace) {
            window.history.replaceState(null, "", normalized);
          }
          return prev;
        }

        if (replace) {
          window.history.replaceState(null, "", normalized);
        } else {
          window.history.pushState(null, "", normalized);
        }
        return normalized;
      });
    } else {
      setCurrentRoute((prev) => (prev === normalized ? prev : normalized));
    }
  }, []);

  const showTooltip = useCallback((message, isSuccess = true) => {
    setTooltipState({
      isOpen: true,
      isSuccess,
      message,
    });
  }, []);

  const closeTooltip = useCallback(() => {
    setTooltipState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const resetAuthErrors = useCallback(() => {
    setLoginError("");
    setRegisterError("");
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    resetAuthErrors();
    navigate("/signin");
  }, [navigate, resetAuthErrors]);

  const handleNavigateToRegister = useCallback(() => {
    resetAuthErrors();
    navigate("/signup");
  }, [navigate, resetAuthErrors]);

  const handleClosePopup = useCallback(() => setPopup(null), []);
  const handleOpenPopup = useCallback((payload) => setPopup(payload), []);
  const syncToken = useCallback(
    (value) => {
      if (value) {
        saveToken(value);
        setAuthToken(value);
      } else {
        clearToken();
        setAuthToken(null);
      }
    },
    [clearToken, saveToken]
  );

  useEffect(() => {
    if (authToken) {
      api.setToken(authToken);
    } else {
      api.setToken(null);
    }
  }, [authToken]);

  const loadInitialData = useCallback(async (authProfile = null) => {
    try {
      const [userData, cardList] = await Promise.all([
        api.getUserInfo(),
        api.getInitialCards(),
      ]);

      const normalizedUserData =
        (userData && typeof userData === "object"
          ? userData.data ?? userData
          : {}) || {};
      const normalizedAuthProfile =
        authProfile && typeof authProfile === "object"
          ? authProfile.data ?? authProfile
          : {};

      const mergedUser = {
        ...normalizedUserData,
      };

      if (normalizedAuthProfile && typeof normalizedAuthProfile === "object") {
        if (normalizedAuthProfile.email && !mergedUser.email) {
          mergedUser.email = normalizedAuthProfile.email;
        }
        if (normalizedAuthProfile._id && !mergedUser._id) {
          mergedUser._id = normalizedAuthProfile._id;
        }
      }

      const normalizedCards = Array.isArray(cardList)
        ? cardList
        : Array.isArray(cardList?.data)
        ? cardList.data
        : [];

      setCurrentUser(mergedUser);
      setCards(normalizedCards);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Falha ao carregar dados iniciais", error);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const establishSession = useCallback(
    async (tokenValue, authProfile = null, { persistToken = true } = {}) => {
      if (tokenValue && persistToken) {
        syncToken(tokenValue);
      }
      api.setToken(tokenValue);
      setIsCheckingAuth(true);
      try {
        await loadInitialData(authProfile);
      } catch (error) {
        if (tokenValue && persistToken) {
          syncToken(null);
        }
        setCurrentUser(null);
        setCards([]);
        throw error;
      }
    },
    [loadInitialData, syncToken]
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      setLoginError("");
      setIsSubmittingAuth(true);
      try {
        const response = await authorize({ email, password });
        const token = response?.token;
        if (!token) {
          throw new Error("Token não recebido.");
        }
        const profile = await checkToken(token);
        await establishSession(token, profile);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Falha na autorização", error);
        setLoginError(
          error?.message ||
            "Não foi possível entrar. Verifique suas credenciais."
        );
      } finally {
        setIsSubmittingAuth(false);
      }
    },
    [establishSession, navigate]
  );

  const handleRegister = useCallback(
    async ({ email, password }) => {
      setRegisterError("");
      setIsSubmittingAuth(true);
      try {
        await register({ email, password });
        showTooltip("Vitória! Você precisa se registrar.", true);
        navigate("/signin", { replace: true });
      } catch (error) {
        console.error("Falha no registro", error);
        setRegisterError(
          error?.message || "Não foi possível concluir o cadastro."
        );
        showTooltip("Ops, algo deu errado! Por favor, tente novamente.", false);
      } finally {
        setIsSubmittingAuth(false);
      }
    },
    [navigate, showTooltip]
  );

  const handleLogout = useCallback(() => {
    syncToken(null);
    setCurrentUser(null);
    setCards([]);
    setIsLoggedIn(false);
    navigate("/signin", { replace: true });
  }, [navigate, syncToken]);

  useEffect(() => {
    if (!authToken) {
      setIsCheckingAuth(false);
      return;
    }

    setIsCheckingAuth(true);

    checkToken(authToken)
      .then((profile) =>
        establishSession(authToken, profile, { persistToken: false })
      )
      .catch((error) => {
        console.error("Token inválido", error);
        syncToken(null);
        setIsLoggedIn(false);
        setIsCheckingAuth(false);
        navigate("/signin", { replace: true });
      });
  }, [authToken, establishSession, navigate, syncToken]);

  useEffect(() => {
    if (!VALID_ROUTES.has(currentRoute)) {
      navigate(isLoggedIn ? "/" : "/signin", { replace: true });
    }
  }, [currentRoute, isLoggedIn, navigate]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const isAuthRoute = PUBLIC_ROUTES.has(currentRoute);

    if (!isLoggedIn && !isAuthRoute) {
      navigate("/signin", { replace: true });
    } else if (isLoggedIn && isAuthRoute) {
      navigate("/", { replace: true });
    }
  }, [currentRoute, isCheckingAuth, isLoggedIn, navigate]);

  const handleUpdateUser = useCallback(
    async (data) => {
      try {
        const updatedUser = await api.setUserInfo(data);
        setCurrentUser(updatedUser);
        handleClosePopup();
        return updatedUser;
      } catch (error) {
        console.error("Falha ao atualizar dados do usuario", error);
        throw error;
      }
    },
    [handleClosePopup]
  );

  const handleUpdateAvatar = useCallback(
    async (data) => {
      try {
        const updatedUser = await api.setUserAvatar(data);
        setCurrentUser(updatedUser);
        handleClosePopup();
        return updatedUser;
      } catch (error) {
        console.error("Falha ao atualizar avatar do usuario", error);
        throw error;
      }
    },
    [handleClosePopup]
  );

  const handleCardLike = useCallback(
    async (card) => {
      if (!card?._id) return null;

      const userId = currentUser?._id ?? null;
      const likesArray = Array.isArray(card.likes) ? card.likes : [];
      const derivedFromLikes = userId
        ? likesArray.some((like) => {
            const likeId =
              typeof like === "string"
                ? like
                : like && typeof like === "object"
                ? like._id ?? like.id ?? like.userId ?? null
                : null;
            return likeId === userId;
          })
        : false;

      const isLiked =
        typeof card.isLiked === "boolean" ? card.isLiked : derivedFromLikes;

      try {
        const updatedCard = await api.changeLikeCardStatus(card._id, !isLiked);
        setCards((prev) =>
          prev.map((c) => (c._id === updatedCard._id ? updatedCard : c))
        );
      } catch (error) {
        console.error("Falha ao atualizar like do card", error);
        throw error;
      }
    },
    [currentUser]
  );

  const performCardDelete = useCallback(async (card) => {
    if (!card?._id) return;
    try {
      await api.deleteCard(card._id);
      setCards((prevCards) =>
        prevCards.filter((currentCard) => currentCard._id !== card._id)
      );
    } catch (error) {
      console.error("Falha ao remover card", error);
      throw error;
    }
  }, []);

  const handleRequestCardDelete = useCallback(
    (card) => {
      if (!card?._id) return;
      const handleConfirm = async () => {
        try {
          await performCardDelete(card);
        } finally {
          handleClosePopup();
        }
      };

      handleOpenPopup({
        type: "confirm-delete",
        title: "Tem certeza?",
        cardId: card._id,
        children: <ConfirmDelete onConfirm={handleConfirm} />,
      });
    },
    [handleClosePopup, handleOpenPopup, performCardDelete]
  );

  const handleAddPlaceSubmit = useCallback(
    async ({ title, link }) => {
      try {
        const newCard = await api.addCard({
          name: title?.trim() ?? "",
          link: link?.trim() ?? "",
        });
        setCards((prevCards) => [newCard, ...prevCards]);
        handleClosePopup();
        return newCard;
      } catch (error) {
        console.error("Falha ao adicionar novo card", error);
        throw error;
      }
    },
    [handleClosePopup]
  );

  const currentUserContext = useMemo(
    () => ({
      currentUser,
      handleUpdateUser,
      handleUpdateAvatar,
    }),
    [currentUser, handleUpdateAvatar, handleUpdateUser]
  );
  let mainContent = null;

  if (currentRoute === "/signin") {
    mainContent = (
      <Login
        onSubmit={handleLogin}
        isSubmitting={isSubmittingAuth}
        errorMessage={loginError}
        onNavigateToRegister={handleNavigateToRegister}
      />
    );
  } else if (currentRoute === "/signup") {
    mainContent = (
      <Register
        onSubmit={handleRegister}
        isSubmitting={isSubmittingAuth}
        errorMessage={registerError}
        onNavigateToLogin={handleNavigateToLogin}
      />
    );
  } else if (currentRoute === "/") {
    mainContent = (
      <ProtectedRoute
        isLoggedIn={isLoggedIn}
        isChecking={isCheckingAuth}
        redirectPath="/signin"
        onRedirect={(path) => navigate(path, { replace: true })}
      >
        <Main
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleRequestCardDelete}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          popup={popup}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
        />
      </ProtectedRoute>
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <div className="page__content">
        <Header
          isLoggedIn={isLoggedIn}
          userEmail={currentUser?.email ?? ""}
          onLogout={handleLogout}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToRegister={handleNavigateToRegister}
          currentPath={currentRoute}
        />

        <div className="page__main">{mainContent}</div>

        <Footer />

        <InfoTooltip
          isOpen={tooltipState.isOpen}
          isSuccess={tooltipState.isSuccess}
          message={tooltipState.message}
          onClose={closeTooltip}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
