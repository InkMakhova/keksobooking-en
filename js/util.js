import {
  DEFAULT_FILTER,
  ESC_KEY,
  PriceCategories,
  MaxArrangePrices
} from './constants.js';

const setDisabledAttribute = (fields, isDisabled) => {
  fields.forEach((field) => field.disabled = isDisabled);
};

const setBlockVisibility = (block, isNoData) => {
  if (isNoData) {
    block.classList.add('hidden');
  }
};

const isEscEvent = (evt) => evt.key === ESC_KEY.Escape || evt.key === ESC_KEY.Esc;

const isFilterMatched = (filterValue, dataField) =>
  String(filterValue) === String(dataField)
    || filterValue === DEFAULT_FILTER;

const isPriceMatched = (filterValue, dataField) =>
  filterValue === DEFAULT_FILTER
    || (filterValue === PriceCategories.middle
          && dataField >= MaxArrangePrices.maxLow
            && dataField < MaxArrangePrices.maxMiddle)
      || (filterValue === PriceCategories.low
            && dataField < MaxArrangePrices.maxLow)
        || (filterValue === PriceCategories.high
              && dataField >= MaxArrangePrices.maxMiddle);

const isChecked = (checkbox, dataField, fieldValue) =>
  checkbox.checked === false
    || (dataField && dataField.find((value) => value === fieldValue));

const debounce = (callback, timeoutDelay) => {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
};

export {
  setDisabledAttribute,
  setBlockVisibility,
  isEscEvent,
  isFilterMatched,
  isPriceMatched,
  isChecked,
  debounce
};
