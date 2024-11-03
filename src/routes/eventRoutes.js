

const express               =   require('express');
const router                =   express.Router();
const EventController   = require('../controller/eventController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create-event', EventController.createNew);
router.post('/vote', authenticateToken, EventController.createNewVote);
router.post('/matches', EventController.getMatchesForEvent);

module.exports = router;