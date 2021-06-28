import {getAdvertsArray} from './data.js';
import {deactivatePage, activatePage, addressInput} from './form.js';

deactivatePage();

const mapBox = document.querySelector('.map');
const mapCanvas = mapBox.querySelector('#map-canvas');
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

const MAIN_COORDINATES = {
  lat: 35.68553153747553,
  lng: 139.75276363268588,
};

const ACCURACY = 5;

const map = L.map(mapCanvas)
  .on('load', () => activatePage())
  .setView([MAIN_COORDINATES.lat, MAIN_COORDINATES.lng], 12);

const markerGroup = L.layerGroup().addTo(map);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: '/img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: MAIN_COORDINATES.lat,
    lng: MAIN_COORDINATES.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);
mainPinMarker.on('moveend', (evt) => {
  addressInput.value = `${evt.target.getLatLng().lat.toFixed(ACCURACY)}, ${evt.target.getLatLng().lng.toFixed(ACCURACY)}`;
});

addressInput.value = `${MAIN_COORDINATES.lat.toFixed(ACCURACY)}, ${MAIN_COORDINATES.lng.toFixed(ACCURACY)}`;

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

function addBaloonsOnMap(adverts) {
  adverts.forEach((element, index) => {
    const {lat, lng} = element.location;

    const icon = L.icon({
      iconUrl: '/img/pin.svg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const marker = L.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );

    marker
      .addTo(markerGroup)
      .bindPopup(
        createCard(adverts[index]),
        {
          keepInView: true,
        },
      );
  });
}

addBaloonsOnMap(getAdvertsArray());
