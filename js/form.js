import {
  isEscEvent,
  addClass,
  removeClass
} from './util.js';
import {
  MESSAGE_DELAY,
  TYPES,
  MAX_ROOM_NUMBER,
  MIN_CAPACITY,
  ACCURACY,
  AccomodationTypes,
  MinAccomodationPrices,
  MainCoordinates,
  DEFAULT_AVATAR_URL
} from './constants.js';
import {resetMap} from './map.js';
import {sendData} from './api.js';

const body = document.querySelector('body');
const adForm = document.querySelector('.ad-form');
const submitButton = adForm.querySelector('.ad-form__submit');
const reset = adForm.querySelector('.ad-form__reset');

const formFieldsets = adForm.querySelectorAll('.ad-form__element');

const avatar = adForm.querySelector('.ad-form-header__preview img');
const titleInput = adForm.querySelector('#title');
const addressInput = adForm.querySelector('#address');
const priceInput = adForm.querySelector('#price');
const typeInput = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');
const photoBox = adForm.querySelector('.ad-form__photo');

const successMessageTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

const errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

const errorMessage = errorMessageTemplate.cloneNode(true);

//set the address
const setAddressValue = (latitude, longitude, accuracy) => {
  addressInput.value = `${latitude.toFixed(accuracy)}, ${longitude.toFixed(accuracy)}`;
};

//validation of title
const titleInputHandler = () => {
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Required');
  } else if (!titleInput.validity.valueMissing && titleInput.value.length < titleInput.minLength) {
    titleInput.setCustomValidity(
      `The field must contain at least ${titleInput.minLength} characters. ${titleInput.minLength - titleInput.value.length} more characters.`);
  } else {
    titleInput.setCustomValidity('');
    removeClass(titleInput, 'ad-form__element--invalid');
  }

  titleInput.reportValidity();
};

//validation of the price
const priceInputHandler = () => {
  if (Number(priceInput.value) < MinAccomodationPrices[typeInput.value]) {
    priceInput.setCustomValidity(
      `Minimum price per accommodation type ${AccomodationTypes[typeInput.value]} - ${MinAccomodationPrices[typeInput.value]}€.`);
  } else if (Number(priceInput.value) > Number(priceInput.max)) {
    priceInput.setCustomValidity(`Maximum price - ${priceInput.max}€.`);
  } else {
    priceInput.setCustomValidity('');
    removeClass(priceInput, 'ad-form__element--invalid');
  }

  priceInput.reportValidity();
};

//validation of number of guests
const capacityChangeHandler = (guestsNumber, rooms) => {
  if (guestsNumber > rooms) {
    capacity.setCustomValidity('The number of guests does not match the number of rooms.');
  } else if (guestsNumber < rooms && rooms === MAX_ROOM_NUMBER && guestsNumber !== MIN_CAPACITY) {
    capacity.setCustomValidity('Too spacious.');
  } else if (rooms !== MAX_ROOM_NUMBER && guestsNumber === MIN_CAPACITY) {
    capacity.setCustomValidity('The number of guests does not match the number of rooms.');
  } else {
    capacity.setCustomValidity('');
    removeClass(capacity, 'ad-form__element--invalid');
  }

  capacity.reportValidity();
};

//gets a valid list of accommodation options for a given number of rooms
const setValidCapacityOptions = (rooms) => {
  capacityOptions.forEach((option) => {
    option.disabled = false;
  });

  if (rooms === MAX_ROOM_NUMBER) {
    capacityOptions.forEach((option) => {
      if (Number(option.value) !== MIN_CAPACITY) {
        option.disabled = true;
      }
    });
    return;
  }

  capacityOptions.forEach((option) => {
    if (rooms < Number(option.value) || Number(option.value) === MIN_CAPACITY) {
      option.disabled = true;
    }
  });
};

//sets check-in/out time
const timeChangeHandler = (field, evt) => {
  field.value = evt.target.value;
};

const closeMessage = (message) => {
  message.remove();
};

const errorMessageEscHandler = (evt) => {
  if (isEscEvent(evt)) {
    closeMessage(errorMessage);
    document.removeEventListener('keydown', errorMessageEscHandler);
  }
};

const showSuccessMessage = () => {
  const successMessage = successMessageTemplate.cloneNode(true);
  body.insertAdjacentElement('beforeend', successMessage);

  setTimeout(() => {
    closeMessage(successMessage);
  }, MESSAGE_DELAY);
};

const showErrorMessage = () => {
  body.insertAdjacentElement('beforeend', errorMessage);

  const closeButtonError = errorMessage.querySelector('.error__button');
  closeButtonError.addEventListener('click', () => {
    closeMessage(errorMessage);
  });

  errorMessage.addEventListener('click', () => {
    closeMessage(errorMessage);
  });

  document.addEventListener('keydown', errorMessageEscHandler);
};

const resetForm = () => {
  adForm.reset();
  avatar.src = DEFAULT_AVATAR_URL;
  setAddressValue(MainCoordinates.lat, MainCoordinates.lng, ACCURACY);
  priceInput.placeholder = MinAccomodationPrices[TYPES[1]];
  photoBox.hidden = false;

  formFieldsets.forEach((fieldset) => {
    fieldset.classList.remove('ad-form__element--invalid');
  });

  const uploadedPhotos = adForm.querySelectorAll('.photo-preview__photo');
  uploadedPhotos.forEach((photo) => {
    photo.remove();
  });
};

const reportDataSentSuccess = () => {
  showSuccessMessage();
  resetForm();
  resetMap();
};

//sets the price placeholder when loading the page
priceInput.placeholder = MinAccomodationPrices[typeInput.value];
//sets a valid value for the number of guests on page load
setValidCapacityOptions(Number(roomNumber.value));

titleInput.addEventListener('input', titleInputHandler);
priceInput.addEventListener('input', priceInputHandler);

roomNumber.addEventListener('change', (evt) => {
  setValidCapacityOptions(Number(evt.target.value));
  capacityChangeHandler(Number(capacity.value), Number(evt.target.value));
});

capacity.addEventListener('change', (evt) => {
  capacityChangeHandler(Number(evt.target.value), Number(roomNumber.value));
});

//changing the minimum price in placeholder depending on the placement type
typeInput.addEventListener('change', (evt) => {
  priceInput.placeholder = MinAccomodationPrices[evt.target.value];
  priceInputHandler();
});

//change of check-out / check-in time interdependently
timeIn.addEventListener('change', (evt) => {
  timeChangeHandler(timeOut, evt);
});
timeOut.addEventListener('change', (evt) => {
  timeChangeHandler(timeIn, evt);
});

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

reset.addEventListener('click', () => {
  resetMap();
  resetForm();
});

submitButton.addEventListener('click', () => {
  const invalidInputs = adForm.querySelectorAll('input:invalid');
  const invalidSelectors = adForm.querySelectorAll('select:invalid');

  invalidInputs.forEach((input) => {
    addClass(input, 'ad-form__element--invalid');
  });

  invalidSelectors.forEach((select) => {
    addClass(select, 'ad-form__element--invalid');
  });
});

export {
  setAddressValue,
  setUserFormSubmit,
  reportDataSentSuccess
};
