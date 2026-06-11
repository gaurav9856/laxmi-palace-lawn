const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { sign } = require('../config/jwt');

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = sign({ id: admin.id, email: admin.email, role: admin.role });
    res.json({
      success: true,
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
