import {
  GET_DATA_URL,
  SEND_DATA_URL
} from './constants.js';

const loadData = (onSuccess, onFail) => {
  fetch(GET_DATA_URL)
    .then((response) => response.json())
    .then(onSuccess)
    .catch(onFail);
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    SEND_DATA_URL,
    {
      method: 'POST',
      body,
    },
  ).then((response) => {
    if (response.ok) {
      onSuccess();
      return;
    }
    onFail();
  })
    .catch(onFail);
};

export {loadData, sendData};
