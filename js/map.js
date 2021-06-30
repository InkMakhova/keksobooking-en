import {getAdvertsArray} from './data.js';
import {deactivatePage, activatePage, addressInput} from './form.js';

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

const ICON_SIZES = {
  mainPinWidth: 52,
  mainPinHeight: 52,
  pinWidth: 40,
  pinHeight: 40,
};

//деактивирует страницу при загрузке
deactivatePage();

const mapBox = document.querySelector('.map');
const mapCanvas = mapBox.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const map = L.map(mapCanvas)
  .on('load', () => activatePage())
  .setView([MAIN_COORDINATES.lat, MAIN_COORDINATES.lng], 12);

//инициализирует карту
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [ICON_SIZES.mainPinWidth, ICON_SIZES.mainPinHeight],
  iconAnchor: [ICON_SIZES.mainPinWidth / 2, ICON_SIZES.mainPinHeight],
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

const markerGroup = L.layerGroup().addTo(map);

function setAddressValue(latitude, longitude) {
  addressInput.value = `${latitude.toFixed(ACCURACY)}, ${longitude.toFixed(ACCURACY)}`;
}

function setBlockVisibility(block, isNoData) {
  if (isNoData) {
    block.classList.add('hidden');
  }
}

function createCard(advert) {
  const card = cardTemplate.cloneNode(true);

  const title = card.querySelector('.popup__title');
  setBlockVisibility(title, advert.offer.title === 0);
  title.textContent = advert.offer.title;

  const address = card.querySelector('.popup__text--address');
  setBlockVisibility(address, advert.offer.address === 0);
  address.textContent = advert.offer.address;

  const price = card.querySelector('.popup__text--price');
  setBlockVisibility(price, advert.offer.price === 0);
  price.textContent = `${String(advert.offer.price)} ₽/ночь`;

  const type = card.querySelector('.popup__type');
  setBlockVisibility(type, advert.offer.type === 0);
  type.textContent = ACCOMODATION_TYPE[advert.offer.type];

  const capacity = card.querySelector('.popup__text--capacity');
  setBlockVisibility(capacity, advert.offer.rooms === 0 && advert.offer.guests === 0);
  if (advert.offer.rooms === 0 && advert.offer.guests !== 0) {
    capacity.textContent = `Для ${String(advert.offer.guests)} гостей`;
  } else if (advert.offer.rooms !== 0 && advert.offer.guests === 0) {
    capacity.textContent = `${String(advert.offer.rooms)} комнаты`;
  } else {
    capacity.textContent = `${String(advert.offer.rooms)} комнаты для ${String(advert.offer.guests)} гостей`;
  }

  const time = card.querySelector('.popup__text--time');
  setBlockVisibility(time, (advert.offer.checkin === 0 && advert.offer.checkout === 0) || (advert.offer.checkin === 0 && advert.offer.checkout !== 0));
  if (advert.offer.checkout === 0) {
    time.textContent = `Заезд после ${advert.offer.checkin}`;
  } else {
    time.textContent = `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`;
  }

  const avatar = card.querySelector('.popup__avatar');
  if (advert.author.avatar === 0) {
    avatar.src = 'img/muffin-grey.svg';
  } else {
    avatar.src = advert.author.avatar;
  }

  const description = card.querySelector('.popup__description');
  setBlockVisibility(description, advert.offer.description === 0);
  description.textContent = advert.offer.description;

  const featuresList = card.querySelector('.popup__features');
  const photosList = card.querySelector('.popup__photos');

  //очищает список features и photos из шаблона
  featuresList.innerHTML = '';
  photosList.innerHTML = '';

  //заполняет features данными
  setBlockVisibility(featuresList, advert.offer.features === 0);
  advert.offer.features.forEach((element) => {
    const feature = cardTemplate.querySelector(`.popup__feature--${element}`).cloneNode(true);
    featuresList.appendChild(feature);
  });

  //заполняет photos данными
  setBlockVisibility(photosList, advert.offer.photos === 0);
  advert.offer.photos.forEach((element) => {
    const photo = cardTemplate.querySelector('.popup__photo').cloneNode(true);
    photo.src = element;
    photosList.appendChild(photo);
  });

  return card;
}

function addBaloonsOnMap(adverts) {
  adverts.forEach((element, index) => {
    const {lat, lng} = element.location;

    const icon = L.icon({
      iconUrl: 'img/pin.svg',
      iconSize: [ICON_SIZES.pinWidth, ICON_SIZES.pinHeight],
      iconAnchor: [ICON_SIZES.pinWidth / 2, ICON_SIZES.pinHeight],
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

setAddressValue(MAIN_COORDINATES.lat, MAIN_COORDINATES.lng);

mainPinMarker.addTo(map);
mainPinMarker.on('moveend', (evt) => {
  setAddressValue(evt.target.getLatLng().lat, evt.target.getLatLng().lng);
});

addBaloonsOnMap(getAdvertsArray());

export {MAIN_COORDINATES, setAddressValue};
