/**
 * Currency Conversion Utility
 * Uses free ExchangeRate-API (v4) with 1-hour caching
 * API: https://api.exchangerate-api.com/v4/latest/{BASE}
 */

let rateCache = {};
let cacheTimestamp = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch exchange rates for a base currency
 * @param {string} base - Base currency code (e.g., 'USD')
 * @returns {object} { rates: { EUR: 0.85, ... }, base: 'USD' }
 */
async function getRates(base = 'USD') {
  const now = Date.now();

  // Return cached rates if still valid
  if (rateCache[base] && (now - (cacheTimestamp[base] || 0)) < CACHE_DURATION) {
    return rateCache[base];
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const data = await res.json();

    if (data.rates) {
      rateCache[base] = { base, rates: data.rates };
      cacheTimestamp[base] = now;
      return rateCache[base];
    }

    throw new Error('API returned no rates');
  } catch (err) {
    console.error('Currency API error:', err.message);
    // Return fallback with 1:1 rates
    return { base, rates: { [base]: 1 }, error: 'Failed to fetch rates' };
  }
}

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {Promise<{ converted: number, rate: number }>}
 */
async function convert(amount, from, to) {
  if (from === to) return { converted: +amount, rate: 1 };

  const { rates } = await getRates(from);
  const rate = rates[to] || 1;
  return { converted: +(amount * rate).toFixed(2), rate: +rate.toFixed(6) };
}

module.exports = { getRates, convert };
