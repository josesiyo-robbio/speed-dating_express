

const express               =   require('express');
const router                =   express.Router();
const EventController   = require('../controller/eventController');

router.post('/create-event', EventController.createNew);
router.post('/vote', EventController.createNewVote);

module.exports = router;