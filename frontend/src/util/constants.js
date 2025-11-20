import defaultAvatar from "../images/avatar.jpg";

// LocalStorage keys
export const LS_PROFILE_KEY = "around.profile";
export const LS_CARDS_KEY = "around.cards";

// Perfil inicial (fallback)
export const INITIAL_PROFILE = {
  name: "Jacques Cousteau",
  about: "Explorador",
  avatar: defaultAvatar,
};

// Cards iniciais (Sprint 13)
export const INITIAL_CARDS = [
  {
    isLiked: false,
    likes: 0,
    _id: "5d1f0611d321eb4bdcd707dd",
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:10:57.741Z",
  },
  {
    isLiked: false,
    likes: 0,
    _id: "5d1f064ed321eb4bdcd707de",
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:11:58.324Z",
  },
  {
    isLiked: false,
    likes: 0,
    _id: "seed-bald-mountains",
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:12:21.000Z",
  },
  {
    isLiked: false,
    likes: 0,
    _id: "seed-latemar",
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:13:02.000Z",
  },
  {
    isLiked: false,
    likes: 0,
    _id: "seed-vanoise",
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:13:45.000Z",
  },
  {
    isLiked: false,
    likes: 0,
    _id: "seed-lago",
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
    owner: "5d1f0611d321eb4bdcd707dd",
    createdAt: "2019-07-05T08:14:19.000Z",
  },
];

// Regex simples para URLs https (para validação básica em formulários)
export const HTTPS_URL_REGEX = /^https:\/\/\S+/i;

