const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const formFields = adForm.querySelectorAll('fieldset');
const mapFilterFields = mapFilters.querySelectorAll('select');

const adTitleInput = adForm.querySelector('#title');
const adPriceInput = adForm.querySelector('#price');
const adTypeInput = adForm.querySelector('#type');

const MIN_ACCOMODATION_PRICES = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const minPrice;

function deactivatePage() {
  //добавляем стили неактивного состояния
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  //делаем поля формы и фильтры карты неактивными
  formFields.forEach((field) => field.setAttribute('disabled', 'disabled'));
  mapFilterFields.forEach((field) => field.setAttribute('disabled', 'disabled'));
}

function activatePage() {
  //удаляем стили неактивного состояния
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  //делаем поля формы и фильтры карты активными
  formFields.forEach((field) => field.removeAttribute('disabled', 'disabled'));
  mapFilterFields.forEach((field) => field.removeAttribute('disabled', 'disabled'));
}

function getMinPrice() {
  return MIN_ACCOMODATION_PRICES[adTypeInput.value];
}

//валидация заголовка объявления
adTitleInput.addEventListener('input', () => {
  if (adTitleInput.value.length < adTitleInput.getAttribute('minlength')) {
    adTitleInput.setCustomValidity(`Минимальная длина объявления ${adTitleInput.getAttribute('minlength')} симв. Еще ${adTitleInput.getAttribute('minlength') - adTitleInput.value.length} симв.`);
  } else {
    adTitleInput.setCustomValidity('');
  }
  adTitleInput.reportValidity();
});

//валидация цены в зависимости от типа размещения
adTypeInput.addEventListener('change', (evt) => {
  minPrice = MIN_ACCOMODATION_PRICES[evt.target.value];
  adPriceInput.setAttribute('placeholder', MIN_ACCOMODATION_PRICES[evt.target.value]);
});

adPriceInput.addEventListener('input', () => {
  if (adPriceInput.validity.typeMismatch) {
    adPriceInput.setCustomValidity('Введите число!');
  } else if (adPriceInput.value < getMinPrice()) {
    adPriceInput.setCustomValidity(`Минимальная цена за тип размещения ${adTypeInput.value} - ${getMinPrice()} руб.`);
  } else if (adPriceInput.value > Number(adPriceInput.getAttribute('max'))) {
    adPriceInput.setCustomValidity(`Максимальная цена ${adPriceInput.getAttribute('max')}`);
  } else {
    adPriceInput.setCustomValidity('');
  }

  adPriceInput.reportValidity();
});

export {deactivatePage, activatePage};
