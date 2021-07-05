const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const adForm = document.querySelector('.ad-form');
const fileChooser = adForm.querySelector('#avatar');
const preview = adForm.querySelector('.ad-form-header__preview img');

fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      preview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});
