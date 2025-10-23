const express = require('express');
const router = express.Router();
const { isLoggedIn } =  require('../middleware/checkAuth');
const dashboardController = require('../controllers/dasboardController');

/** 
 * Dashboard Routes
*/

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item-:id', isLoggedIn, dashboardController.dashboardViewNote);
router.get('/dashboard/page-:id', isLoggedIn, dashboardController.dashboardViewPageNote);
router.put('/dashboard/item-:id', isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete-:id', isLoggedIn, dashboardController.dashboardDeleteNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);
router.get('/dashboard/NotesForAnotherUsers', dashboardController.NotesForAnotherUsers);


module.exports = router;