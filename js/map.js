import {getAdvertsArray} from './data.js';
import {deactivatePage, activatePage} from './form.js';

const map = document.querySelector('.map');
const mapCanvas = map.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const ACCOMODATION_TYPE = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const isMapLoaded = true;
function activatePageStatus() {
  if (isMapLoaded) {
    return activatePage();
  }
  return deactivatePage();
}

function createCard(advert) {
  const card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = advert.offer.title;
  card.querySelector('.popup__text--address').textContent = advert.offer.address;
  card.querySelector('.popup__text--price').textContent = `${String(advert.offer.price)} ₽/ночь`;
  card.querySelector('.popup__type').textContent = ACCOMODATION_TYPE[advert.offer.type];
  card.querySelector('.popup__text--capacity').textContent = `${String(advert.offer.rooms)} комнаты для ${String(advert.offer.guests)} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`;

  card.querySelector('.popup__avatar').src = advert.author.avatar;
  if (advert.offer.description.length === 0) {
    card.querySelector('.popup__description').style.display = 'none';
  } else {
    card.querySelector('.popup__description').textContent = advert.offer.description;
  }

  const featuresList = card.querySelector('.popup__features');
  const photosList = card.querySelector('.popup__photos');

  //очищает список features и photos из шаблона
  featuresList.innerHTML = '';
  photosList.innerHTML = '';

  //заполнение features данными
  if (advert.offer.features.length === 0) {
    featuresList.style.display = 'none';
  } else {
    advert.offer.features.forEach((element) => {
      const feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add(`popup__feature--${element}`);
      featuresList.appendChild(feature);
    });
  }

  //заполнение photos данными
  if (advert.offer.photos.length === 0) {
    photosList.style.display = 'none';
  } else {
    advert.offer.photos.forEach((element) => {
      const photo = document.createElement('img');
      photo.classList.add('popup__photo');
      photo.width = '45';
      photo.height = '40';
      photo.src = element;
      photosList.appendChild(photo);
    });
  }

  return card;
}

function createCardsArray() {
  const cardsArray = new Array(getAdvertsArray().length).fill(null).map((_element, index) => createCard(getAdvertsArray()[index]));
  return cardsArray;
}

mapCanvas.append(createCardsArray()[0]);
activatePageStatus();
