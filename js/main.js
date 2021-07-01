//import './data.js';
import './map.js';
import './form.js';
import './api.js';
import {deactivatePage} from './page.js';
import {setUserFormSubmit, reportDataSentSuccess} from './form.js';
import {getData} from './api.js';
import {addBaloonsOnMap, showDataErrorMessage} from './map.js';
import {ADVERTS_NUMBER} from './constants.js';

//деактивирует страницу при загрузке
deactivatePage();

getData((adverts) => addBaloonsOnMap(adverts.slice(0, ADVERTS_NUMBER)), showDataErrorMessage);
setUserFormSubmit(reportDataSentSuccess);
