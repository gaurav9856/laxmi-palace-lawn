const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');

function rangeFromQuery(q) {
  const today = new Date();
  const start = q.from || `${today.getFullYear()}-01-01`;
  const end   = q.to   || `${today.getFullYear() + 1}-12-31`;
  return { start, end };
}

exports.bookedDates = async (req, res, next) => {
  try {
    const { start, end } = rangeFromQuery(req.query);
    const [booked, blocked] = await Promise.all([
      Booking.approvedDatesBetween(start, end),
      BlockedDate.list({ from: start, to: end })
    ]);
    res.json({
      success: true,
      data: {
        booked,
        blocked: blocked.map(b => b.blocked_date),
        range: { start, end }
      }
    });
  } catch (err) { next(err); }
};
