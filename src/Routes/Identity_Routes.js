'use-strict';

let express = require('express');
let signup_controller = require('../Controllers/Signup_Controller');
let login_controller = require('../Controllers/Login_Controller');

let router = express.Router();

router.post("/notify", signup_controller.notify);
router.get("/verify", signup_controller.verify);

router.post("/login", login_controller.login);
router.post("/recover", login_controller.recover);

module.exports = router;