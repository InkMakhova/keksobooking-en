import {getAdvertsArray} from './data.js';

const map = document.querySelector('.map');
const mapCanvas = map.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const advertsArray = getAdvertsArray();

function getAccomodationType(name) {
  switch (name) {
    case 'flat':
      return 'Квартира';
    case 'bungalow':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    case 'hotel':
      return 'Отель';
    default:
      return 'Непонятно!';
  }
}

function createCard(advert) {
  const card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = advert.offer.title;
  card.querySelector('.popup__text--address').textContent = advert.offer.address;
  card.querySelector('.popup__text--price').textContent = `${String(advert.offer.price)} ₽/ночь`;
  card.querySelector('.popup__type').textContent = `${getAccomodationType(advert.offer.type)}`;
  card.querySelector('.popup__text--capacity').textContent = `${String(advert.offer.rooms)} комнаты для ${String(advert.offer.guests)} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`;

  const featuresList = card.querySelector('.popup__features');
  if (advert.offer.features.length === 0) {
    featuresList.style.display = 'none';
  }
  else {
    //очищает список features
    featuresList.querySelectorAll('.popup__feature').forEach((feature) => {
      feature.remove();
    });
    //добавляет в список features из данных
    advert.offer.features.forEach((element) => {
      const feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add(`popup__feature--${element}`);
      featuresList.appendChild(feature);
    });
  }

  if (advert.offer.description.length === 0) {
    card.querySelector('.popup__description').style.display = 'none';
  }
  else {
    card.querySelector('.popup__description').textContent = advert.offer.description;
  }

  const photosList = card.querySelector('.popup__photos');
  if (advert.offer.photos.length === 0) {
    photosList.style.display = 'none';
  }
  else {
    //удаляет список фото из шаблона
    photosList.querySelectorAll('.popup__photo').forEach((photo) => {
      photo.remove();
    });
    //добавляет фото из данных
    advert.offer.photos.forEach((element) => {
      const photo = document.createElement('img');
      photo.classList.add('popup__photo');
      photo.width = '45';
      photo.height = '40';
      photo.src = element;
      photosList.appendChild(photo);
    });
  }

  card.querySelector('.popup__avatar').src = advert.author.avatar;
  return card;
}

function createCardsArray() {
  const cardsArray = new Array(advertsArray.length).fill(null).map((_element, index) => createCard(advertsArray[index]));
  return cardsArray;
}

mapCanvas.append(createCardsArray()[2]);
