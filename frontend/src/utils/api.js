class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._defaultHeaders = headers ?? {};
    this._token = null;
  }

  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Erro: ${res.status}`);
  }

  _composeHeaders(extra = {}) {
    const headers = {
      ...this._defaultHeaders,
      ...extra,
    };

    if (this._token) {
      headers.Authorization = `Bearer ${this._token}`;
    }

    return headers;
  }

  setToken(token) {
    this._token = token || null;
  }

  /* ----- Usuario ----- */
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }

  updateUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._composeHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  setUserInfo(data) {
    return this.updateUserInfo(data);
  }

  updateAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._composeHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  setUserAvatar(data) {
    return this.updateAvatar(data);
  }

  /* ----- Cards ----- */
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._composeHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }

  /* ----- Likes ----- */
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }

  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }

  changeLikeCardStatus(cardId, shouldLike) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: shouldLike ? "PUT" : "DELETE",
      headers: this._composeHeaders(),
    }).then(this._handleResponse);
  }
}

const api = new Api({
  baseUrl: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
