import {setDisabledAttribute} from './util.js';

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const formFields = adForm.querySelectorAll('fieldset');
const mapFilterFields = mapFilters.querySelectorAll('select');

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

export {deactivatePage, activatePage};
