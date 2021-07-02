const setDisabledAttribute = (fields, isDisabled) => {
  fields.forEach((field) => field.disabled = isDisabled);
};

const setBlockVisibility = (block, isNoData) => {
  if (isNoData) {
    block.classList.add('hidden');
  }
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {setDisabledAttribute, setBlockVisibility, isEscEvent};
