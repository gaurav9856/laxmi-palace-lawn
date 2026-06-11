const router = require('express').Router();
const ctrl = require('../controllers/blockedDateController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', ctrl.list);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.create);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ctrl.remove);

module.exports = router;
