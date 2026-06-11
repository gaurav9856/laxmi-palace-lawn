const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

const createValidators = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
  body('mobile').trim().matches(/^[0-9+\-\s]{7,20}$/).withMessage('Valid mobile is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email required'),
  body('eventDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('eventDate must be YYYY-MM-DD'),
  body('eventType').trim().isLength({ min: 2, max: 100 }).withMessage('eventType required'),
  body('guestCount').isInt({ min: 1, max: 10000 }).withMessage('guestCount must be a positive integer'),
  body('notes').optional({ checkFalsy: true }).isLength({ max: 2000 })
];

// Public
router.post('/', createValidators, ctrl.create);
router.get('/availability/:date', ctrl.availability);

// Admin
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.list);
router.get('/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.stats);
router.put('/:id/approve', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.approve);
router.put('/:id/reject',  authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.reject);
router.put('/:id/cancel',  authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.cancel);

module.exports = router;
