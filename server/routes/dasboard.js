const express = require('express');
const router = express.Router();
const { isLoggedIn } =  require('../middleware/checkAuth');
const dashboardController = require('../controllers/dasboardController');

/** 
 * Dashboard Routes
*/

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.put('/dashboard/item-:id', isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete-:id', isLoggedIn, dashboardController.dashboardDeleteNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/notes-:id', dashboardController.NoteForAnotherUser);
router.get('/notes-for-all-users', dashboardController.notesForAllUsers);



module.exports = router;