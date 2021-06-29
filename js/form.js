import {setDisabledAttribute} from './util.js';

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const formFields = adForm.querySelectorAll('fieldset');
const mapFilterFields = mapFilters.querySelectorAll('select');

const titleInput = adForm.querySelector('#title');
const addressInput = adForm.querySelector('#address');
const priceInput = adForm.querySelector('#price');
const typeInput = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');

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

const MAX_ROOM_NUMBER = 100;
const MIN_CAPACITY = 0;

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
    capacity.setCustomValidity('Количество гостей не соотвествует количеству комнат.');
  } else if (guestsNumber < rooms && rooms === MAX_ROOM_NUMBER && guestsNumber !== MIN_CAPACITY) {
    capacity.setCustomValidity('Слишком просторно.');
  } else if (rooms !== MAX_ROOM_NUMBER && guestsNumber === MIN_CAPACITY) {
    capacity.setCustomValidity('Количество гостей не соотвествует количеству комнат.');
  } else {
    capacity.setCustomValidity('');
  }

  capacity.reportValidity();
}

//получаем валидный список вариантов размещения при заданном количестве комнат
function getValidCapacityOptions(rooms) {
  capacityOptions.forEach((option) => option.disabled = false);
  if (rooms === MAX_ROOM_NUMBER) {
    capacityOptions.forEach((option) => {
      if (Number(option.value) !== MIN_CAPACITY) {
        option.disabled = true;
      }
    });
  } else {
    capacityOptions.forEach((option) => {
      if (rooms < Number(option.value) || Number(option.value) === MIN_CAPACITY) {
        option.disabled = true;
      }
    });
  }
}

//устанавливаем время заезда-выезда
function setTimeOption(field, evt) {
  field.value = evt.target.value;
}

//устанавливаем правильный плейсхолдер цены при загрузке страницы (если вдруг забыли поменять в разметке)
priceInput.placeholder = MIN_ACCOMODATION_PRICES[typeInput.value];
//устанавливаем валидное значение количества гостей при загрузке страницы
getValidCapacityOptions(Number(roomNumber.value));

titleInput.addEventListener('input', validateTitle);
priceInput.addEventListener('input', validatePrice);

roomNumber.addEventListener('change', (evt) => {
  getValidCapacityOptions(Number(evt.target.value));
  validateCapacity(Number(capacity.value), Number(evt.target.value));
});

capacity.addEventListener('change', (evt) => {
  validateCapacity(Number(evt.target.value), Number(roomNumber.value));
});

//изменение минимальной цены в placeholder в зависимости от выбора типа размещения
typeInput.addEventListener('change', (evt) => {
  priceInput.placeholder = MIN_ACCOMODATION_PRICES[evt.target.value];
  validatePrice();
});

timeIn.addEventListener('change', (evt) => {
  setTimeOption(timeOut, evt);
});
timeOut.addEventListener('change', (evt) => {
  setTimeOption(timeIn, evt);
});

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(evt.target);
});

export {deactivatePage, activatePage, addressInput};
