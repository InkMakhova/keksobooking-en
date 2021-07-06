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
  setDisabledAttribute(formFields, true);

  mapFilters.classList.add('map__filters--disabled');
  setDisabledAttribute(mapFilterFields, true);
  setDisabledAttribute(mapFeaturesFilters, true);
};

const activatePage = () => {
  adForm.classList.remove('ad-form--disabled');
  setDisabledAttribute(formFields, false);
};

const activateMapFilters = () => {
  mapFilters.classList.remove('map__filters--disabled');
  setDisabledAttribute(mapFilterFields, false);
  setDisabledAttribute(mapFeaturesFilters, false);
};

export {
  deactivatePage,
  activatePage,
  activateMapFilters
};
