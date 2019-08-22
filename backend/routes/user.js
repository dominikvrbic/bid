const express = require('express');
const router = express.Router();

const userControlers = require('../Controllers/user');


router.post('/register', userControlers.register);

router.post('/login', userControlers.login);

router.post('/logout', userControlers.logout);

router.get('/authStatus', userControlers.authStatus);

module.exports = router;