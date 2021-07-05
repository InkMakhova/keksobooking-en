import {FILE_TYPES} from './constants.js';
import {isRightFileType} from './util.js';

const adForm = document.querySelector('.ad-form');
const fileChooser = adForm.querySelector('#images');
const boxForUploud = adForm.querySelector('.ad-form__photo-container');
const previewBox = boxForUploud.querySelector('.ad-form__photo');

const previewTemplate = document.querySelector('#photo-preview')
  .content
  .querySelector('.photo-preview__photo');

fileChooser.addEventListener('change', () => {
  const files = fileChooser.files;
  const fileNames = [];

  Object.keys(files).forEach((key) => {
    files[key].name.toLowerCase();
    fileNames.push(files[key].name);
  });

  const isRightFiles = fileNames.every((fileName) => isRightFileType(fileName, FILE_TYPES));

  if (isRightFiles) {
    previewBox.hidden = true;

    Object.keys(files).forEach((key) => {
      const preview = previewTemplate.cloneNode(true);
      const img = preview.querySelector('img');

      boxForUploud.insertAdjacentElement('beforeend', preview);

      const reader = new FileReader();

      reader.addEventListener('load', () => {
        img.src = reader.result;
      });

      reader.readAsDataURL(files[key]);
    });
  }
});
