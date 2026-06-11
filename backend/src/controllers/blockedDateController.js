const BlockedDate = require('../models/BlockedDate');

exports.list = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const rows = await BlockedDate.list({ from, to });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { date, reason } = req.body;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date (YYYY-MM-DD required)' });
    }
    const id = await BlockedDate.create({ date, reason });
    res.status(201).json({ success: true, data: { id } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Date is already blocked' });
    }
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await BlockedDate.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Blocked date not found' });
    res.json({ success: true, message: 'Blocked date removed' });
  } catch (err) { next(err); }
};
