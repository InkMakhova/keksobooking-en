const ADVERTS_NUMBER = 10;

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const ACCOMODATION_TYPE = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const MIN_ACCOMODATION_PRICES = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const MAX_ROOM_NUMBER = 100;
const MIN_CAPACITY = 0;

const CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

const ICON_SIZES = {
  mainPinWidth: 52,
  mainPinHeight: 52,
  pinWidth: 40,
  pinHeight: 40,
};

const MAIN_COORDINATES = {
  lat: 35.68553153747553,
  lng: 139.75276363268588,
};

const ACCURACY = 5;

const DEFAULT_AVATAR = 'img/muffin-grey.svg';

export {ADVERTS_NUMBER, TYPES, ACCOMODATION_TYPE, MIN_ACCOMODATION_PRICES, MAX_ROOM_NUMBER, MIN_CAPACITY, CHECK_TIMES, ICON_SIZES, MAIN_COORDINATES, ACCURACY, DEFAULT_AVATAR};
