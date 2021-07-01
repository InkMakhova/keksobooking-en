import {setDisabledAttribute} from './util.js';
/*import {
  adForm,
  formFields,
  mapFilters,
  mapFilterFields,
  mapFeaturesFilters
} from './form.js';*/

const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');
const mapFeaturesFilters = mapFilters.querySelector('#housing-features').querySelectorAll('.map__checkbox');

const deactivatePage = () => {
  //добавляет стили неактивного состояния
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  //делает поля формы и фильтры карты неактивными
  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
  setDisabledAttribute(mapFeaturesFilters, true);

  console.log('1');
};

const activatePage = () => {
  //удаляет стили неактивного состояния
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  //делает поля формы и фильтры карты активными
  setDisabledAttribute(formFields, false);
  setDisabledAttribute(mapFilterFields, false);
  setDisabledAttribute(mapFeaturesFilters, false);
};

export {
  adForm,
  formFields,
  mapFilters,
  mapFilterFields,
  mapFeaturesFilters,
  deactivatePage,
  activatePage
};
