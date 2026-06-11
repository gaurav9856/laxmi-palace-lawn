const router = require('express').Router();
const ctrl = require('../controllers/calendarController');

router.get('/booked-dates', ctrl.bookedDates);

module.exports = router;
