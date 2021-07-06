import './map.js';
import './form.js';
import './api.js';
import './avatar.js';
import './photos.js';
import {deactivatePage} from './page.js';
import {
  setUserFormSubmit,
  reportDataSentSuccess
} from './form.js';
import {loadData} from './api.js';
import {
  saveData,
  initMap,
  addBaloonsOnMap,
  setDataErrorStatus
} from './map.js';
import {ADVERTS_NUMBER} from './constants.js';

deactivatePage();
initMap();

loadData((adverts) => {
  saveData(adverts);
  addBaloonsOnMap(adverts.slice(0, ADVERTS_NUMBER));
}, setDataErrorStatus);

setUserFormSubmit(reportDataSentSuccess);

