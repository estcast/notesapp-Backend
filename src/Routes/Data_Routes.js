'use-strict';

let express = require('express');
let articles_controller = require('../Controllers/Articles_Controller');
let router = express.Router();

router.get('/my_notes',articles_controller.getNotes);
router.delete('/delete/:title', articles_controller.deleteNote);
router.post('/new/:title', articles_controller.newNote);
router.put('/edit/:title', articles_controller.editNote);

module.exports = router;