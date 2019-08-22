const express = require('express');
const router = express.Router();

const imgcontroller = require('../Controllers/img')


router.get('/bidup/:id/:korisnikid', imgcontroller.bid);

router.post('/addimg', imgcontroller.addImg);

router.get('/sveslike', imgcontroller.allImages);

router.get('/slika/:id', imgcontroller.specImgage);

module.exports = router;