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

const isEscEvent = (evt) => ESC_KEY.includes(evt.key);

const isFilterMatched = (filterValue, dataField) =>
  String(filterValue) === String(dataField)
    || filterValue === DEFAULT_FILTER;

const isPriceMatched = (filterValue, dataField) => {
  switch (filterValue) {
    case PriceCategories.low:
      return dataField < MaxArrangePrices.maxLow;
    case PriceCategories.middle:
      return dataField >= MaxArrangePrices.maxLow && dataField < MaxArrangePrices.maxMiddle;
    case PriceCategories.high:
      return dataField >= MaxArrangePrices.maxMiddle;
    default:
      return true;
  }
};

const isArrayFeaturesMatched = (arrayFilteredFeatures, arrayDataFeatures) => {
  if (arrayFilteredFeatures.length === 0) {
    return true;
  } else if (arrayDataFeatures) {
    return arrayFilteredFeatures.every((feature) => arrayDataFeatures.includes(feature));
  }
  return false;
};

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

const isRightFileType = (fileName, rightTypes) =>
  rightTypes.some((typeFile) => fileName.endsWith(typeFile));

const addClass = (element, className) => {
  element.parentNode.classList.add(className);
};

const removeClass = (element, className) => {
  element.parentNode.classList.remove(className);
};

export {
  setDisabledAttribute,
  setBlockVisibility,
  isEscEvent,
  isFilterMatched,
  isPriceMatched,
  isArrayFeaturesMatched,
  debounce,
  isRightFileType,
  addClass,
  removeClass
};
