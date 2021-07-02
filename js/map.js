import {
  ACCURACY,
  ZOOM,
  AccomodationTypes,
  IconSizes,
  MainCoordinates
} from './constants.js';
import {setBlockVisibility} from './util.js';
import {activatePage} from './page.js';
import {setAddressValue} from './form.js';

const mapBox = document.querySelector('.map');
const mapCanvas = mapBox.querySelector('#map-canvas');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');
const mapFeaturesFilters = mapFilters
  .querySelector('#housing-features')
  .querySelectorAll('.map__checkbox');

const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const dataErrorMessageTemplate = document.querySelector('#data-error')
  .content
  .querySelector('.data-error');

const map = L.map(mapCanvas);

const initMap = () => {
  map
    .on('load', () => activatePage())
    .setView([MainCoordinates.lat, MainCoordinates.lng], ZOOM);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);
};

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [IconSizes.mainPinWidth, IconSizes.mainPinHeight],
  iconAnchor: [IconSizes.mainPinWidth / 2, IconSizes.mainPinHeight],
});

const mainPinMarker = L.marker(
  {
    lat: MainCoordinates.lat,
    lng: MainCoordinates.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const markerGroup = L.layerGroup().addTo(map);

const showDataErrorMessage = () => {
  const dataErrorMessage = dataErrorMessageTemplate.cloneNode(true);
  mapCanvas.insertAdjacentElement('beforeend', dataErrorMessage);
};

const createCard = (advert) => {
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
  type.textContent = AccomodationTypes[advert.offer.type];

  const capacity = card.querySelector('.popup__text--capacity');
  setBlockVisibility(capacity, advert.offer.rooms === 0 && advert.offer.guests === 0);
  if (advert.offer.rooms === 0 && advert.offer.guests !== 0) {
    capacity.textContent = `Для ${String(advert.offer.guests)} гостей`;
  } else if (advert.offer.rooms !== 0 && advert.offer.guests === 0) {
    capacity.textContent = `${String(advert.offer.rooms)} комнаты`;
  } else {
    capacity.textContent =
      `${String(advert.offer.rooms)} комнаты для ${String(advert.offer.guests)} гостей`;
  }

  const time = card.querySelector('.popup__text--time');
  setBlockVisibility(
    time,
    (advert.offer.checkin === 0 && advert.offer.checkout === 0)
     || (advert.offer.checkin === 0 && advert.offer.checkout !== 0));
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
  setBlockVisibility(featuresList, advert.offer.features === null);
  if (advert.offer.features) {
    advert.offer.features.forEach((element) => {
      const feature = cardTemplate.querySelector(`.popup__feature--${element}`).cloneNode(true);
      featuresList.appendChild(feature);
    });
  }

  //заполняет photos данными
  setBlockVisibility(photosList, advert.offer.photos === 0);
  if (advert.offer.photos) {
    advert.offer.photos.forEach((element) => {
      const photo = cardTemplate.querySelector('.popup__photo').cloneNode(true);
      photo.src = element;
      photosList.appendChild(photo);
    });
  }

  return card;
};

const addBaloonsOnMap = (adverts) => {
  adverts.forEach((element, index) => {
    const {lat, lng} = element.location;

    const icon = L.icon({
      iconUrl: 'img/pin.svg',
      iconSize: [IconSizes.pinWidth, IconSizes.pinHeight],
      iconAnchor: [IconSizes.pinWidth / 2, IconSizes.pinHeight],
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
};

//сбрасывает фильтры карты
const resetMap = () => {
  mainPinMarker.setLatLng(
    L.latLng(
      MainCoordinates.lat.toFixed(ACCURACY),
      MainCoordinates.lng.toFixed(ACCURACY)));
  map.setView([MainCoordinates.lat, MainCoordinates.lng], ZOOM);
  mapFilterFields.forEach((field) => field.value = 'any');
  mapFeaturesFilters.forEach((filter) => filter.checked = false);
};

setAddressValue(MainCoordinates.lat, MainCoordinates.lng, ACCURACY);

mainPinMarker.addTo(map);
mainPinMarker.on('moveend', (evt) => {
  setAddressValue(evt.target.getLatLng().lat, evt.target.getLatLng().lng, ACCURACY);
});

export {
  initMap,
  showDataErrorMessage,
  resetMap,
  addBaloonsOnMap
};

