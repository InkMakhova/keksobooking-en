import './map.js';
import './form.js';
import './api.js';
import {deactivatePage} from './page.js';
import {setUserFormSubmit, reportDataSentSuccess} from './form.js';
import {getData} from './api.js';
import {initMap, addBaloonsOnMap, setDataErrorStatus} from './map.js';
import {ADVERTS_NUMBER} from './constants.js';

deactivatePage();
initMap();

getData((adverts) => {
  addBaloonsOnMap(adverts.slice(0, ADVERTS_NUMBER));
}, setDataErrorStatus);
setUserFormSubmit(reportDataSentSuccess);
