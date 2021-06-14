import {getRandomInteger, getRandomFloat} from './util.js';

const ADVERTS_NUMBER = 10;
const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

function getAdvertAuthor(userNumber) {
  const number = userNumber < 10 ? `0${userNumber}` : String(userNumber);
  return {
    avatar: `img/avatars/user${number}.png`,
  };
}

function getAdvertAdress(locationX, locationY) {
  return `${locationX}, ${locationY}`;
}

function getAdvertOffer(location) {
  return {
    title: 'Идеальное жилье для любителей музыки',
    address: getAdvertAdress(location.lat, location.lng),
    price: getRandomInteger(1, 100000),
    type: TYPES[getRandomInteger(0, TYPES.length-1)],
    rooms: getRandomInteger(1, 10),
    guests: getRandomInteger(1, 20),
    checkin: CHECK_TIMES[getRandomInteger(0, CHECK_TIMES.length-1)],
    checkout: CHECK_TIMES[getRandomInteger(0, CHECK_TIMES.length-1)],
    features: FEATURES.slice(0, getRandomInteger(0, FEATURES.length-1)),
    description: 'Сосед — бас-гитарист группы, играет в составе своей группы с 20-00 до 03-00 за стенкой — в это время вы забудете о своем сне и получите великолепные впечатления от тяжелой музыки. Летом эти впечатления усилятся — открыты окна — больше музыки. В квартире снизу жильцы подыгрывают группе, громко стуча по батарее, они делают это уже 2-й год — безрезультатно. Если Вы — любитель хард-рока и спартанской обстановки — эта квартира по доступной цене для Вас ',
    photos: PHOTOS.slice(0, getRandomInteger(0, PHOTOS.length-1)),
  };
}

function getAdvertLocation() {
  return {
    lat: getRandomFloat(35.65, 35.7, 5),
    lng: getRandomFloat(139.7, 139.8, 5),
  };
}

function getAdvert(index) {
  const location = getAdvertLocation();
  return {
    author: getAdvertAuthor(index),
    offer: getAdvertOffer(location),
    location: location,
  };
}

const ADVERTS = new Array(ADVERTS_NUMBER).fill(null).map((_element, index) => getAdvert(index + 1));
