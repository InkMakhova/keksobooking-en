import {setDisabledAttribute} from './util.js';

const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');

const mapFilters = document.querySelector('.map__filters');
const mapFilterFields = mapFilters.querySelectorAll('select');
const mapFeaturesFilters = mapFilters
  .querySelector('#housing-features')
  .querySelectorAll('.map__checkbox');

const deactivatePage = () => {
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
  setDisabledAttribute(mapFeaturesFilters, true);
};

const activatePage = () => {
  adForm.classList.remove('ad-form--disabled');
  setDisabledAttribute(formFields, false);
};

export {
  deactivatePage,
  activatePage
};
