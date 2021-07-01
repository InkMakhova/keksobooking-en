import {setDisabledAttribute} from './util.js';
import {
  adForm,
  formFields,
  mapFilters,
  mapFilterFields,
  mapFeaturesFilters
} from './form.js';

function deactivatePage() {
  //добавляет стили неактивного состояния
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  //делает поля формы и фильтры карты неактивными
  setDisabledAttribute(formFields, true);
  setDisabledAttribute(mapFilterFields, true);
  setDisabledAttribute(mapFeaturesFilters, true);
}

function activatePage() {
  //удаляет стили неактивного состояния
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  //делает поля формы и фильтры карты активными
  setDisabledAttribute(formFields, false);
  setDisabledAttribute(mapFilterFields, false);
  setDisabledAttribute(mapFeaturesFilters, false);
}

export {
  deactivatePage,
  activatePage
};
