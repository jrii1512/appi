import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();


//router.post('/add', collection.addTarget);
//router.get('/getTargets', collection.getTarget);
router.get('/', item.showMain);
router.get('/ideas', item.getIdeas);
router.post('/ideas', item.addIdea);

router.get("/ordered/:id", item.getOrders);

router.get('/delivered/:id', item.getDelivered);

router.post('/tuhoa', item.doDelete);

router.get('/logs', item.showLogFile);

router.get('/gps', item.showLocation);

export default router.routes();
