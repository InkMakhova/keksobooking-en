const GET_DATA_URL = 'https://23.javascript.pages.academy/keksobooking/data';

const SEND_DATA_URL = 'https://23.javascript.pages.academy/keksobooking';

const ADVERTS_NUMBER = 10;

const RERENDER_DELAY = 500;

const MESSAGE_DELAY = 1000;

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const MAX_ROOM_NUMBER = 100;
const MIN_CAPACITY = 0;

const DEFAULT_FILTER = 'any';

const ESC_KEY = ['Escape', 'Esc'];

const ACCURACY = 5;
const ZOOM = 12;

const DEFAULT_AVATAR_URL = 'img/muffin-grey.svg';

const AccomodationTypes = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const MinAccomodationPrices = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const INVALID_FIELD_BORDER = '2px solid red';

const PriceCategories = {
  middle: 'middle',
  low: 'low',
  high: 'high',
};

const MaxArrangePrices = {
  maxLow: 10000,
  maxMiddle: 50000,
};

const IconSizes = {
  mainPinWidth: 52,
  mainPinHeight: 52,
  pinWidth: 40,
  pinHeight: 40,
};

const MAIN_PIN_URL = 'img/main-pin.svg';
const PIN_URL = 'img/pin.svg';

const MainCoordinates = {
  lat: 35.68553153747553,
  lng: 139.75276363268588,
};

export {
  GET_DATA_URL,
  SEND_DATA_URL,
  ADVERTS_NUMBER,
  RERENDER_DELAY,
  MESSAGE_DELAY,
  FILE_TYPES,
  DEFAULT_FILTER,
  ESC_KEY,
  TYPES,
  MAX_ROOM_NUMBER,
  MIN_CAPACITY,
  ACCURACY,
  ZOOM,
  DEFAULT_AVATAR_URL,
  MAIN_PIN_URL,
  PIN_URL,
  INVALID_FIELD_BORDER,
  AccomodationTypes,
  MinAccomodationPrices,
  PriceCategories,
  MaxArrangePrices,
  IconSizes,
  MainCoordinates
};
