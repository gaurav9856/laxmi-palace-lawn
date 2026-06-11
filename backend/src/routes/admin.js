const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password too short')
  ],
  ctrl.login
);

router.get('/me', authenticate, ctrl.me);

module.exports = router;
