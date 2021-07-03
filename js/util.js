import {priceCategories} from './constants.js';

const setDisabledAttribute = (fields, isDisabled) => {
  fields.forEach((field) => field.disabled = isDisabled);
};

const setBlockVisibility = (block, isNoData) => {
  if (isNoData) {
    block.classList.add('hidden');
  }
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const isFilterMatched = (filterValue, dataField) =>
  String(filterValue) === String(dataField)
    || filterValue === 'any';

const isPriceMatched = (filterValue, dataField) =>
  filterValue === 'any'
    || (filterValue === priceCategories.middle && dataField >= 10000 && dataField < 50000)
      || (filterValue === priceCategories.low && dataField < 10000)
        || (filterValue === priceCategories.high && dataField >= 50000);

export {
  setDisabledAttribute,
  setBlockVisibility,
  isEscEvent,
  isFilterMatched,
  isPriceMatched
};
