import {setDisabledAttribute} from './util.js';

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const formFields = adForm.querySelectorAll('fieldset');
const mapFilterFields = mapFilters.querySelectorAll('select');

const titleInput = adForm.querySelector('#title');
const priceInput = adForm.querySelector('#price');
const typeInput = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');

const MIN_ACCOMODATION_PRICES = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const ACCOMODATION_TYPE = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

priceInput.placeholder = MIN_ACCOMODATION_PRICES[typeInput.value];

function deactivatePage() {
  //добавляем стили неактивного состояния
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  //делаем поля формы и фильтры карты неактивными
  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
}

function activatePage() {
  //удаляем стили неактивного состояния
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  //делаем поля формы и фильтры карты активными
  setDisabledAttribute(formFields, false);
  setDisabledAttribute(mapFilterFields, false);
}

//валидация заголовка объявления
function validateTitle() {
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Обязательное поле для заполнения');
  } else if (!titleInput.validity.valueMissing && titleInput.value.length < titleInput.minLength) {
    titleInput.setCustomValidity(`Поле должно содержать минимум ${titleInput.minLength} символов. Еще ${titleInput.minLength - titleInput.value.length} символов.`);
  } else {
    titleInput.setCustomValidity('');
  }
}

//валидация поля цены
function validatePrice() {
  if (Number(priceInput.value) < MIN_ACCOMODATION_PRICES[typeInput.value]) {
    priceInput.setCustomValidity(`Минимальная цена за тип размещения ${ACCOMODATION_TYPE[typeInput.value]} - ${MIN_ACCOMODATION_PRICES[typeInput.value]} руб.`);
  } else if (Number(priceInput.value) > Number(priceInput.max)) {
    priceInput.setCustomValidity(`Максимальная цена - ${priceInput.max} руб.`);
  } else {
    priceInput.setCustomValidity('');
  }

  priceInput.reportValidity();
}

//валидация поля количества гостей
function validateCapacity(guestsNumber, rooms) {
  if (guestsNumber > rooms) {
    capacity.setCustomValidity('Количество гостей не соотвествует количеству комнат');
  } else if (guestsNumber < rooms && rooms === 100 && guestsNumber !== 0) {
    capacity.setCustomValidity('Слишком просторно.');
  } else if (guestsNumber === 0 && rooms === 100) {
    capacity.setCustomValidity('');
  } else if (guestsNumber <= rooms && guestsNumber !== 0) {
    capacity.setCustomValidity('');
  }

  capacity.reportValidity();
}

titleInput.addEventListener('input', validateTitle);
titleInput.addEventListener('invalid', validateTitle);

//изменение минимальной цены в placeholder в зависимости от выбора типа размещения
typeInput.addEventListener('change', (evt) => {
  priceInput.placeholder = MIN_ACCOMODATION_PRICES[evt.target.value];
  validatePrice();
});

priceInput.addEventListener('input', validatePrice);

roomNumber.addEventListener('change', (evt) => {
  capacityOptions.forEach((option) => option.style.display = 'block');
  if (evt.target.value === '100') {
    capacityOptions.forEach((option) => {
      if (option.value !== '0') {
        option.style.display = 'none';
      }
    });
  } else {
    capacityOptions.forEach((option) => {
      if (option.value > roomNumber.value || option.value === '0') {
        option.style.display = 'none';
      }
    });
  }
  validateCapacity(Number(capacity.value), Number(evt.target.value));
});

capacity.addEventListener('change', (evt) => {
  validateCapacity(Number(evt.target.value), Number(roomNumber.value));
});

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  validateCapacity(Number(capacity.value), Number(roomNumber.value));
  validatePrice();
  adForm.submit();
});

export {deactivatePage, activatePage};
