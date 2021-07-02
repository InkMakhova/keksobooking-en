import {setDisabledAttribute} from './util.js';
import {
  adForm,
  formFields,
  mapFilters,
  mapFilterFields,
  mapFeaturesFilters
} from './form.js';

const deactivatePage = () => {
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
  setDisabledAttribute(mapFeaturesFilters, true);
};

const activatePage = () => {
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  setDisabledAttribute(formFields, false);
  setDisabledAttribute(mapFilterFields, false);
  setDisabledAttribute(mapFeaturesFilters, false);
};

export {
  deactivatePage,
  activatePage
};
