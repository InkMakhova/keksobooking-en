import {
  ADVERTS_NUMBER,
  DEFAULT_FILTER,
  RERENDER_DELAY,
  ACCURACY,
  ZOOM,
  DEFAULT_AVATAR_URL,
  MAIN_PIN_URL,
  PIN_URL,
  AccomodationTypes,
  IconSizes,
  MainCoordinates
} from './constants.js';
import {
  setBlockVisibility,
  setDisabledAttribute,
  isFilterMatched,
  isPriceMatched,
  isArrayFeaturesMatched,
  debounce
} from './util.js';
import {activatePage} from './page.js';
import {setAddressValue} from './form.js';

let allAdverts;

let enabledFeatures = [];

const mapBox = document.querySelector('.map');
const mapCanvas = mapBox.querySelector('#map-canvas');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');

const featureFieldset = document.querySelector('#housing-features');
const mapFeaturesFilters = featureFieldset.querySelectorAll('.map__checkbox');

const filterFields = {
  type: mapFilters.querySelector('#housing-type'),
  price: mapFilters.querySelector('#housing-price'),
  rooms: mapFilters.querySelector('#housing-rooms'),
  guests: mapFilters.querySelector('#housing-guests'),
};

const filterValues = {
  type: 'any',
  price: 'any',
  rooms: 'any',
  guests: 'any',
};

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
  iconUrl: MAIN_PIN_URL,
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

let markerGroup;

const saveData = (loadedData) => {
  allAdverts = loadedData;
};

const setDataErrorStatus = () => {
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
    avatar.src = DEFAULT_AVATAR_URL;
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
  markerGroup = L.layerGroup().addTo(map);

  adverts.forEach((element, index) => {
    const {lat, lng} = element.location;

    const icon = L.icon({
      iconUrl: PIN_URL,
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

  mapFilters.classList.remove('map__filters--disabled');
  setDisabledAttribute(mapFilterFields, false);
  setDisabledAttribute(mapFeaturesFilters, false);
};

//сбрасывает фильтры карты
const resetMap = () => {
  mainPinMarker.setLatLng(
    L.latLng(
      MainCoordinates.lat.toFixed(ACCURACY),
      MainCoordinates.lng.toFixed(ACCURACY)));
  map.setView([MainCoordinates.lat, MainCoordinates.lng], ZOOM);

  mapFilterFields.forEach((field) => {
    field.value = DEFAULT_FILTER;
  });

  Object.keys(filterValues).forEach((key) =>{
    filterValues[key] = DEFAULT_FILTER;
  });

  mapFeaturesFilters.forEach((filter) => {
    filter.checked = false;
  });

  enabledFeatures = [];

  markerGroup.remove();
  addBaloonsOnMap(allAdverts.slice(0, ADVERTS_NUMBER));
};

setAddressValue(MainCoordinates.lat, MainCoordinates.lng, ACCURACY);

mainPinMarker.addTo(map);
mainPinMarker.on('moveend', (evt) => {
  setAddressValue(evt.target.getLatLng().lat, evt.target.getLatLng().lng, ACCURACY);
});

//фильтрация
const applyFilter = () => {
  debounce(() => {
    markerGroup.remove();

    const filteredData = allAdverts.slice().filter((advert) => {
      const typeMatched = isFilterMatched(filterValues.type, advert.offer.type);
      const priceMatched = isPriceMatched(filterValues.price, advert.offer.price);
      const roomsMatched = isFilterMatched(filterValues.rooms, advert.offer.rooms);
      const guestsMatched = isFilterMatched(filterValues.guests, advert.offer.guests);
      const featuresMatched = isArrayFeaturesMatched(enabledFeatures, advert.offer.features);

      return typeMatched && priceMatched && roomsMatched && guestsMatched
        && featuresMatched;
    });
    addBaloonsOnMap(filteredData.slice(0, ADVERTS_NUMBER));
  }, RERENDER_DELAY)();
};

Object.keys(filterValues).forEach((key) => {
  filterFields[key].addEventListener('change', (evt) => {
    filterValues[key] = evt.target.value;
    applyFilter();
  });
});

featureFieldset.addEventListener('change', () => {
  const checkedFeatures = featureFieldset.querySelectorAll('input:checked');

  enabledFeatures = new Array(checkedFeatures.length)
    .fill(null)
    .map((_element, index) => checkedFeatures[index].value);

  applyFilter();
});

export {
  initMap,
  saveData,
  setDataErrorStatus,
  resetMap,
  addBaloonsOnMap
};
