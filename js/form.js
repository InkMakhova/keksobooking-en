import {setDisabledAttribute, isEscEvent} from './util.js';
import {TYPES, ACCOMODATION_TYPE, MIN_ACCOMODATION_PRICES, MAX_ROOM_NUMBER, MIN_CAPACITY, CHECK_TIMES, MAIN_COORDINATES, ACCURACY, DEFAULT_AVATAR} from './constants.js';
import {resetMap} from './map.js';
import {sendData} from './api.js';

const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');
const mapFeaturesFilters = mapFilters.querySelector('#housing-features').querySelectorAll('.map__checkbox');

const avatarImage = adForm.querySelector('.ad-form-header__preview').querySelector('img');
const titleInput = adForm.querySelector('#title');
const addressInput = adForm.querySelector('#address');
const priceInput = adForm.querySelector('#price');
const typeInput = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');
const descriptionInput = adForm.querySelector('#description');
const featuresFielset = adForm.querySelector('.features');
const featuresOptions = featuresFielset.querySelectorAll('.features__checkbox');
const uplodedPhotos = adForm.querySelectorAll('.ad-form__photo');

const successMessage = document.querySelector('#success')
  .content
  .querySelector('.success')
  .cloneNode(true);

const errorMessage = document.querySelector('#error')
  .content
  .querySelector('.error')
  .cloneNode(true);

const closeButtonError = errorMessage.querySelector('.error__button');

adForm.insertAdjacentElement('beforeend', successMessage);
adForm.insertAdjacentElement('beforeend', errorMessage);

successMessage.hidden = true;
errorMessage.hidden = true;

function deactivatePage() {
  //добавляет стили неактивного состояния
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  //делает поля формы и фильтры карты неактивными
  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
}

function activatePage() {
  //удаляет стили неактивного состояния
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  //делает поля формы и фильтры карты активными
  setDisabledAttribute(formFields, false);
  setDisabledAttribute(mapFilterFields, false);
}

//устанавливает значение адреса
function setAddressValue(latitude, longitude, accuracy) {
  addressInput.value = `${latitude.toFixed(accuracy)}, ${longitude.toFixed(accuracy)}`;
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

//получает валидный список вариантов размещения при заданном количестве комнат
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

//устанавливает время заезда-выезда
function setTimeOption(field, evt) {
  field.value = evt.target.value;
}

//сбрасывает поля формы
function resetForm() {
  avatarImage.src = DEFAULT_AVATAR;
  titleInput.value = '';
  setAddressValue(MAIN_COORDINATES.lat, MAIN_COORDINATES.lng, ACCURACY);
  typeInput.value = TYPES[1];
  priceInput.value = '';
  priceInput.placeholder = MIN_ACCOMODATION_PRICES[TYPES[1]];
  roomNumber.value = '1';
  capacity.value = '1';
  timeIn.value = CHECK_TIMES[0];
  timeOut.value = CHECK_TIMES[0];
  descriptionInput.value = '';
  featuresOptions.forEach((option) => option.checked = false);
  uplodedPhotos.forEach((photo) => photo.remove());
}

function closeSuccessMessage() {
  successMessage.hidden = true;
  document.removeEventListener('keydown', (evt) => {
    if (isEscEvent(evt)) {
      closeSuccessMessage();
    }
  });
  successMessage.removeEventListener('mousedown', closeSuccessMessage);
}

function showSuccessMessage() {
  successMessage.hidden = false;
  document.addEventListener('keydown', (evt) => {
    if (isEscEvent(evt)) {
      closeSuccessMessage();
    }
  });
  successMessage.addEventListener('mousedown', closeSuccessMessage);
}

function closeErrorMessage() {
  errorMessage.hidden = true;
  closeButtonError.removeEventListener('click', closeErrorMessage);
  errorMessage.removeEventListener('mousedown', closeErrorMessage);
}

function showErrorMessage() {
  errorMessage.hidden = false;
  closeButtonError.addEventListener('click', closeErrorMessage);
  errorMessage.addEventListener('mousedown', closeErrorMessage);
}

function reportDataSentSuccess() {
  showSuccessMessage();
  resetForm();
  resetMap();
}

//устанавливает плейсхолдер цены при загрузке страницы (если вдруг забыли поменять в разметке)
priceInput.placeholder = MIN_ACCOMODATION_PRICES[typeInput.value];
//устанавливает валидное значение количества гостей при загрузке страницы
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

//изменение времени выезда/заезда взаимозависимо
timeIn.addEventListener('change', (evt) => {
  setTimeOption(timeOut, evt);
});
timeOut.addEventListener('change', (evt) => {
  setTimeOption(timeIn, evt);
});

//отправка формы
const setUserFormSubmit = (onSuccess) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      () => onSuccess(),
      () => showErrorMessage(),
      new FormData(evt.target),
    );
  });
};

//очистка формы
adForm.addEventListener('reset', (evt) => {
  evt.preventDefault();
  resetMap();
  resetForm();
});

export {deactivatePage, activatePage, setAddressValue, mapFilterFields, mapFeaturesFilters, setUserFormSubmit, reportDataSentSuccess};
