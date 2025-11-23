const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

const buckets = new Map();

function freeRateLimit(req, res, next) {
  const key = `${req.ip}:free`;
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
  }
  if (now > b.resetAt) {
    b.count = 0;
    b.resetAt = now + WINDOW_MS;
  }
  b.count += 1;
  res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, MAX_REQUESTS - b.count)));
  res.setHeader('X-RateLimit-Reset', String(Math.floor(b.resetAt / 1000)));
  if (b.count > MAX_REQUESTS) {
    const retrySec = Math.max(0, Math.ceil((b.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retrySec));
    return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again later.' });
  }
  next();
}

module.exports = freeRateLimit;
