import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();


//router.post('/add', collection.addTarget);
//router.get('/getTargets', collection.getTarget);

console.log("router");
router.get('/', item.showMain);
router.post('/message', item.addMessage);


/*
router.post('/tuhoa', item.doDelete);
router.get('/logs', item.showLogFile);
router.get('/gps', item.showLocation);
*/

export default router.routes();
