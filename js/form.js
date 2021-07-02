import {isEscEvent} from './util.js';
import {
  TYPES,
  ACCOMODATION_TYPE,
  MIN_ACCOMODATION_PRICES,
  MAX_ROOM_NUMBER,
  MIN_CAPACITY,
  MAIN_COORDINATES,
  ACCURACY
} from './constants.js';
import {resetMap} from './map.js';
import {sendData} from './api.js';

const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');
const reset = adForm.querySelector('.ad-form__reset');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');
const mapFeaturesFilters = mapFilters
  .querySelector('#housing-features')
  .querySelectorAll('.map__checkbox');

const titleInput = adForm.querySelector('#title');
const addressInput = adForm.querySelector('#address');
const priceInput = adForm.querySelector('#price');
const typeInput = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');

const successMessageTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

const errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

//устанавливает значение адреса
const setAddressValue = (latitude, longitude, accuracy) => {
  addressInput.value = `${latitude.toFixed(accuracy)}, ${longitude.toFixed(accuracy)}`;
};

//валидация заголовка объявления
const validateTitle = () => {
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Обязательное поле для заполнения');
  } else if (!titleInput.validity.valueMissing && titleInput.value.length < titleInput.minLength) {
    titleInput.setCustomValidity(
      `Поле должно содержать минимум ${titleInput.minLength} символов. Еще ${titleInput.minLength - titleInput.value.length} символов.`);
  } else {
    titleInput.setCustomValidity('');
  }
};

//валидация поля цены
const validatePrice = () => {
  if (Number(priceInput.value) < MIN_ACCOMODATION_PRICES[typeInput.value]) {
    priceInput.setCustomValidity(
      `Минимальная цена за тип размещения ${ACCOMODATION_TYPE[typeInput.value]} - ${MIN_ACCOMODATION_PRICES[typeInput.value]} руб.`);
  } else if (Number(priceInput.value) > Number(priceInput.max)) {
    priceInput.setCustomValidity(`Максимальная цена - ${priceInput.max} руб.`);
  } else {
    priceInput.setCustomValidity('');
  }

  priceInput.reportValidity();
};

//валидация поля количества гостей
const validateCapacity = (guestsNumber, rooms) => {
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
};

//получает валидный список вариантов размещения при заданном количестве комнат
const getValidCapacityOptions = (rooms) => {
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
};

//устанавливает время заезда-выезда
const setTimeOption = (field, evt) => {
  field.value = evt.target.value;
};

const closeSuccessMessage = (message) => {
  message.remove();
};

const showSuccessMessage = () => {
  const successMessage = successMessageTemplate.cloneNode(true);
  adForm.insertAdjacentElement('beforeend', successMessage);
  setTimeout(() => {closeSuccessMessage(successMessage);}, 1000);
};

const closeErrorMessage = (message) => {
  message.remove();
};

const showErrorMessage = () => {
  const errorMessage = errorMessageTemplate.cloneNode(true);
  const closeButtonError = errorMessage.querySelector('.error__button');

  adForm.insertAdjacentElement('beforeend', errorMessage);
  closeButtonError.addEventListener('click', () => {
    closeErrorMessage(errorMessage);
  });
  errorMessage.addEventListener('mousedown', () => {
    closeErrorMessage(errorMessage);
  });
  document.addEventListener('keydown', (evt) => {
    if (isEscEvent(evt)) {
      closeErrorMessage(errorMessage);
    }
  });
};

//сбрасывает поля формы
const resetForm = () => {
  adForm.reset();
  setAddressValue(MAIN_COORDINATES.lat, MAIN_COORDINATES.lng, ACCURACY);
  priceInput.placeholder = MIN_ACCOMODATION_PRICES[TYPES[1]];
};

const reportDataSentSuccess = () => {
  showSuccessMessage();
  resetForm();
  resetMap();
};

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
reset.addEventListener('click', () => {
  resetMap();
  resetForm();
});

export {
  adForm,
  formFields,
  mapFilters,
  mapFilterFields,
  mapFeaturesFilters,
  setAddressValue,
  setUserFormSubmit,
  reportDataSentSuccess
};
