/**
 * Real OCR Engine — Tesseract.js + Sharp
 * Extracts amount, date, merchant, category, currency from receipt images.
 */

const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');
const { getRates } = require('./currency');

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  'Meals': {
    weight: 1.0,
    keywords: [
      'restaurant', 'cafe', 'coffee', 'food', 'pizza', 'burger', 'starbucks',
      'mcdonald', 'mcdonalds', 'kfc', 'subway', 'dominos', 'domino', 'dining',
      'meal', 'lunch', 'dinner', 'breakfast', 'brunch', 'bistro', 'diner',
      'grill', 'kitchen', 'bakery', 'snack', 'taco', 'sushi', 'noodle',
      'curry', 'thai', 'chinese', 'indian', 'italian', 'mexican', 'buffet',
      'canteen', 'cafeteria', 'eatery', 'barbeque', 'bbq', 'pub', 'bar',
      'juice', 'smoothie', 'ice cream', 'dessert', 'pastry', 'donut',
      'dunkin', 'panera', 'chipotle', 'wendy', 'chick-fil-a', 'popeye',
      'panda express', 'five guys', 'shake shack', 'tim hortons',
      'zomato', 'swiggy', 'ubereats', 'doordash', 'grubhub',
      'biryani', 'dosa', 'idli', 'paratha', 'chaat', 'samosa',
      'tea', 'chai', 'beverage', 'drink', 'food court', 'mess',
      'chilly', 'pride', 'lollypop', 'chicken', 'schezwan', 'dine',
      'dhaba', 'thali', 'vada', 'pav', 'misal', 'poha', 'biryani',
      'kebab', 'tandoor', 'curry house', 'tiffin', 'mess',
    ],
  },
  'Transport': {
    weight: 1.0,
    keywords: [
      'uber', 'lyft', 'taxi', 'cab', 'ola', 'rapido', 'grab',
      'bus', 'metro', 'train', 'railway', 'transit', 'transport', 'irctc',
      'ride', 'fare', 'toll', 'parking', 'fuel', 'gas', 'petrol', 'diesel',
      'gas station', 'shell', 'bp', 'chevron', 'exxon', 'hpcl', 'bpcl', 'iocl',
      'auto', 'rickshaw', 'e-bike', 'scooter', 'rental car',
      'hertz', 'avis', 'enterprise', 'zipcar', 'namma yatri',
    ],
  },
  'Travel': {
    weight: 1.0,
    keywords: [
      'flight', 'airline', 'airways', 'delta', 'united', 'american airlines',
      'southwest', 'jetblue', 'indigo', 'spicejet', 'air india', 'vistara',
      'airport', 'boarding', 'baggage', 'luggage', 'booking', 'makemytrip',
      'cleartrip', 'goibibo', 'expedia', 'kayak', 'skyscanner', 'travel',
      'trip', 'voyage', 'itinerary', 'emirates', 'etihad', 'akasa air',
    ],
  },
  'Accommodation': {
    weight: 1.0,
    keywords: [
      'hotel', 'hilton', 'marriott', 'airbnb', 'lodge', 'inn', 'motel',
      'resort', 'stay', 'hostel', 'oyo', 'treebo', 'fab hotels',
      'room', 'suite', 'check-in', 'checkout', 'booking.com',
      'trivago', 'agoda', 'hotels.com', 'hyatt', 'radisson', 'sheraton',
      'westin', 'novotel', 'ibis', 'holiday inn', 'best western', 'wyndham',
      'homestay', 'guest house', 'taj hotels', 'oberoi', 'leela',
    ],
  },
  'Rent': {
    weight: 1.2,
    keywords: [
      'rent', 'lease', 'property', 'apartment', 'housing', 'mortgage',
      'landlord', 'tenant', 'rental', 'flat', 'house rent', 'pg',
      'paying guest', 'co-living', 'maintenance', 'society', 'emi',
      'installment', 'home loan', 'society charges',
    ],
  },
  'Office Supplies': {
    weight: 1.0,
    keywords: [
      'office', 'staples', 'paper', 'ink', 'stationery', 'depot',
      'pen', 'pencil', 'marker', 'notebook', 'folder', 'binder', 'printer',
      'toner', 'cartridge', 'envelope', 'stamp', 'label', 'tape', 'glue',
      'scissors', 'calculator', 'whiteboard', 'post-it', 'sticky note',
      'office depot', 'office max', 'classmate', 'camlin',
    ],
  },
  'Software': {
    weight: 1.0,
    keywords: [
      'adobe', 'microsoft', 'google', 'saas', 'license', 'subscription',
      'software', 'app', 'cloud', 'aws', 'azure', 'gcp', 'digital ocean',
      'github', 'gitlab', 'jira', 'confluence', 'slack', 'zoom', 'teams',
      'notion', 'figma', 'canva', 'photoshop', 'dropbox', 'office 365',
      'antivirus', 'domain', 'hosting', 'ssl', 'cdn', 'api', 'plugin',
      'jetbrains', 'intellij', 'chatgpt', 'openai', 'anthropic',
    ],
  },
  'Training': {
    weight: 1.0,
    keywords: [
      'course', 'training', 'udemy', 'coursera', 'linkedin learning',
      'skillshare', 'pluralsight', 'education', 'certification', 'workshop',
      'seminar', 'conference', 'webinar', 'tutorial', 'learning', 'class',
      'exam', 'assessment', 'unacademy', 'byju', 'upgrad', 'great learning',
    ],
  },
  'Equipment': {
    weight: 1.0,
    keywords: [
      'keyboard', 'mouse', 'monitor', 'laptop', 'hardware', 'electronics',
      'headphone', 'headset', 'webcam', 'camera', 'microphone', 'speaker',
      'charger', 'cable', 'adapter', 'dock', 'hub', 'ssd', 'hard drive',
      'tablet', 'phone', 'mobile', 'ipad', 'best buy', 'croma',
      'reliance digital', 'apple store', 'samsung', 'dell', 'hp', 'lenovo',
    ],
  },
  'Medical': {
    weight: 1.0,
    keywords: [
      'hospital', 'clinic', 'doctor', 'pharmacy', 'medicine', 'medical',
      'health', 'dental', 'eye', 'vision', 'prescription', 'lab',
      'diagnostic', 'pathology', 'x-ray', 'scan', 'mri', 'ct',
      'apollo', 'fortis', 'max hospital', 'medplus', 'netmeds', 'pharmeasy',
      'practo', 'insurance', 'health check', '1mg', 'dr lal', 'thyrocare',
    ],
  },
  'Utilities': {
    weight: 1.0,
    keywords: [
      'electricity', 'electric', 'power', 'water', 'gas bill', 'internet',
      'wifi', 'broadband', 'phone bill', 'mobile recharge', 'dth', 'cable tv',
      'utility', 'jio', 'airtel', 'vodafone', 'bsnl', 'act fibernet',
      'tata sky', 'dish tv', 'mahanagar gas', 'igl',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY DETECTION
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCY_SIGNALS = [
  { regex: /₹/, currency: 'INR', weight: 15 },
  { regex: /€/, currency: 'EUR', weight: 15 },
  { regex: /£/, currency: 'GBP', weight: 15 },
  { regex: /¥/, currency: 'JPY', weight: 12 },
  { regex: /₩/, currency: 'KRW', weight: 15 },
  { regex: /₺/, currency: 'TRY', weight: 15 },
  { regex: /₦/, currency: 'NGN', weight: 15 },

  { regex: /\bINR\b/, currency: 'INR', weight: 12 },
  { regex: /\bUSD\b/, currency: 'USD', weight: 12 },
  { regex: /\bEUR\b/, currency: 'EUR', weight: 12 },
  { regex: /\bGBP\b/, currency: 'GBP', weight: 12 },
  { regex: /\bJPY\b/, currency: 'JPY', weight: 12 },
  { regex: /\bAED\b/, currency: 'AED', weight: 12 },
  { regex: /\bSGD\b/, currency: 'SGD', weight: 12 },
  { regex: /\bAUD\b/, currency: 'AUD', weight: 12 },
  { regex: /\bCAD\b/, currency: 'CAD', weight: 12 },
  { regex: /\bCNY\b|\bRMB\b/, currency: 'CNY', weight: 12 },
  { regex: /\bMYR\b|\bRM\b/, currency: 'MYR', weight: 10 },
  { regex: /\bTHB\b/, currency: 'THB', weight: 12 },

  { regex: /\bRs\.?\s*\d/i, currency: 'INR', weight: 12 },
  { regex: /\bRupee/i, currency: 'INR', weight: 10 },
  { regex: /S\$\s*\d/, currency: 'SGD', weight: 12 },
  { regex: /A\$\s*\d/, currency: 'AUD', weight: 12 },
  { regex: /C\$\s*\d/, currency: 'CAD', weight: 12 },
  { regex: /HK\$\s*\d/, currency: 'HKD', weight: 12 },
  { regex: /\bAED\s*\d/, currency: 'AED', weight: 10 },
  { regex: /\bDhs\s*\d/i, currency: 'AED', weight: 10 },
  { regex: /\bRM\s*\d/, currency: 'MYR', weight: 10 },
  { regex: /\bRp\.?\s*\d/i, currency: 'IDR', weight: 10 },

  { regex: /(?:grand\s*total|total|sub\s*total)\s*=\s*[\d,]+/i, currency: 'INR', weight: 14 },
  { regex: /=\s*\d{3,}/, currency: 'INR', weight: 8 },
  { regex: /(?:total)\s+[zZ]\s*[\d,]+/i, currency: 'INR', weight: 10 },

  { regex: /\bGSTIN\b/i, currency: 'INR', weight: 10 },
  { regex: /\bCGST\b|\bSGST\b|\bIGST\b/i, currency: 'INR', weight: 10 },
  { regex: /\bGST\b/i, currency: 'INR', weight: 6 },
  { regex: /\bPAN\s*(?:No|:)/i, currency: 'INR', weight: 8 },
  { regex: /\bFSSAI\b/i, currency: 'INR', weight: 8 },
  { regex: /\bMRP\b/i, currency: 'INR', weight: 6 },
  { regex: /\d+\/-/, currency: 'INR', weight: 8 },
  { regex: /\.co\.in\b|\.in\b/i, currency: 'INR', weight: 7 },
  {
    regex: /\b(?:mumbai|delhi|bengaluru|bangalore|chennai|hyderabad|kolkata|pune|ahmedabad|jaipur|surat|lucknow|kanpur|nagpur|indore|thane|bhopal|visakhapatnam|pimpri|patna|vadodara|ghaziabad|ludhiana|agra|nashik|faridabad|meerut|rajkot|kalyan|vasai|varanasi|srinagar|aurangabad|dhanbad|amritsar|navi mumbai|dombivali|thane|borivali|andheri|dadar|kurla|bandra)\b/i,
    currency: 'INR', weight: 9
  },
  { regex: /\b[6-9]\d{9}\b/, currency: 'INR', weight: 6 },

  { regex: /\bVAT\s*(?:5%|5\s*percent)/i, currency: 'AED', weight: 7 },
  { regex: /\bTRN\s*:/i, currency: 'AED', weight: 8 },
  { regex: /\b(?:dubai|abu dhabi|sharjah|ajman)\b/i, currency: 'AED', weight: 9 },

  { regex: /\bVAT\s*(?:20%|20\s*percent)/i, currency: 'GBP', weight: 6 },

  { regex: /\$\s*\d/, currency: 'USD', weight: 3 },
];

function detectCurrency(text) {
  const normalized = normalizeOcrText(text);
  const votes = {};

  for (const signal of CURRENCY_SIGNALS) {
    const flags = signal.regex.flags.includes('g') ? signal.regex.flags : signal.regex.flags + 'g';
    const re = new RegExp(signal.regex.source, flags);
    const matches = normalized.match(re);
    if (matches) {
      if (!votes[signal.currency]) votes[signal.currency] = { weight: 0, hits: 0 };
      votes[signal.currency].weight += signal.weight * matches.length;
      votes[signal.currency].hits += matches.length;
    }
  }

  let bestCurrency = 'USD';
  let bestWeight = 0;
  let bestConfidence = 0.40;

  for (const [currency, data] of Object.entries(votes)) {
    if (data.weight > bestWeight) {
      bestWeight = data.weight;
      bestCurrency = currency;
      bestConfidence = Math.min(0.98, 0.50 + (data.weight / 60));
    }
  }

  console.log('💱 Winner: ', bestCurrency);
  return { currency: bestCurrency, confidence: bestConfidence };
}

// ─────────────────────────────────────────────────────────────────────────────
// OCR TEXT NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function normalizeOcrText(text) {
  return text
    .replace(/\b[Aa]rnount\b/gi, 'Amount')
    .replace(/\b[Aa]nount\b/gi, 'Amount')
    .replace(/\b[Tt]otai\b/gi, 'Total')
    .replace(/\b[Tt]ota1\b/gi, 'Total')
    .replace(/\b[Ss]ubtota[l1i]\b/gi, 'Subtotal')
    .replace(/\b[Gg]rand\s*[Tt]ota[l1i]\b/gi, 'Grand Total')
    .replace(/\b[Bb]a[l1i]ance\b/gi, 'Balance')
    .replace(/\b[Bb]i[l1i]{2}\b/gi, 'Bill')
    .replace(/\bLue\b/gi, 'Due')
    .replace(/\bBs\.?\s/gi, 'Rs. ') 
    .replace(/\bRBs\.?\s/gi, 'Rs. ')
    .replace(/0(\d)\//g, '$1/');
}

// ─────────────────────────────────────────────────────────────────────────────
// AMOUNT EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

const AMOUNT_PATTERNS = [
  /grand\s*total\s*[:=]?\s*[=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /grand\s*total\s*=\s*([\d,]+\.?\d{0,2})/i,
  /total\s*=\s*([\d,]+\.?\d{0,2})/i,
  /total\s*(?:paid|due|amount|payable)\s*[:=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /amount\s*(?:due|paid|payable|total)\s*[:=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /bill\s*(?:amount|total)\s*[:=]?\s*[\$₹€£¥]?\s*(?:rs\.?|inr)?\s*([\d,]+\.?\d{0,2})/i,
  /net\s*(?:amount|total|pay|payable)\s*[:=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /balance\s*(?:due|payable)?\s*[:=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /you\s*(?:pay|owe)\s*[:=]?\s*[\$₹€£¥]?\s*([\d,]+\.?\d{0,2})/i,
  /(?<!sub)total\s*[:=]?\s*[\$₹€£¥=]?\s*([\d,]+\.?\d{0,2})/i,
  /[\$₹€£¥]\s*([\d,]+\.\d{2})/,
  /(?:rs\.?|inr)\s*([\d,]+\.?\d{0,2})/i,
  /sub\s*total\s*[:=]?\s*[\$₹€£¥=]?\s*([\d,]+\.?\d{0,2})/i,
];

function extractAmount(text) {
  const normalized = normalizeOcrText(text);

  for (const pattern of AMOUNT_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      const raw = match[match.length - 1];
      if (!raw) continue;
      const amount = parseFloat(raw.replace(/,/g, ''));
      if (amount > 0 && amount < 10_000_000 && !(amount >= 2020 && amount <= 2030)) {
        return { value: amount, confidence: 0.95 };
      }
    }
  }

  const lines = normalized.split('\n');
  const totalRe = /(?:grand\s*total|total\s*paid|total\s*due|total|amount\s*due|bill\s*amount|net\s*pay|balance)/i;
  for (const line of lines) {
    if (totalRe.test(line)) {
      const num = line.match(/([\d,]+\.?\d{0,2})\s*$/);
      if (num) {
        const amount = parseFloat(num[1].replace(/,/g, ''));
        if (amount > 0 && amount < 10_000_000 && !(amount >= 2020 && amount <= 2030)) {
          return { value: amount, confidence: 0.88 };
        }
      }
    }
  }

  const allAmounts = [];
  const anyRe = /[\$₹€£¥=]\s*([\d,]+\.?\d{0,2})/g;
  let m;
  while ((m = anyRe.exec(text)) !== null) {
    const val = parseFloat(m[1].replace(/,/g, ''));
    if (val > 0 && val < 10_000_000 && !(val >= 2020 && val <= 2030)) allAmounts.push(val);
  }
  if (allAmounts.length > 0) {
    return { value: Math.max(...allAmounts), confidence: 0.65 };
  }

  return { value: 0, confidence: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function scoreMerchantLine(line, index) {
  const t = line.trim();
  if (!t || t.length < 2) return -999;

  let score = 0;
  score += Math.max(0, 12 - index * 1.5);
  if (t.length >= 4 && t.length <= 60) score += 4;
  if (t.length >= 8 && t.length <= 40) score += 4;
  if (t === t.toUpperCase() && /[A-Z]{3,}/.test(t)) score += 8;
  if (/^([A-Z][a-z]+\s*)+$/.test(t)) score += 4;
  if (/\b(pvt|ltd|inc|corp|llc|co\.|company|group|enterprises|solutions|services|international|technologies|pharma|pharmacy|hotel|restaurant|cafe|store|mart|express|foods|hospital|clinic|motors|pride|house|point|corner|centre|center|world|zone|hub|plaza)\b/i.test(t)) score += 9;
  if (/pvt\.?\s*ltd\.?/i.test(t)) score += 5;
  if (/&\s*(co|sons|bros|associates)/i.test(t)) score += 4;
  if (/\b(road|rd|street|st|avenue|ave|nagar|colony|sector|block|floor|building|near|opp|behind|lane|plot|flat|apt|suite|west|east|north|south)\b/i.test(t)) score -= 6;
  if (/\b(w)\b/i.test(t) && /\(/.test(t)) score -= 3;
  if (/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(t)) score -= 12;
  if (/\b\d{10}\b/.test(t) || /\b\d{3}[\s\-]\d{4}[\s\-]\d{4}\b/.test(t)) score -= 12;
  if (/^(date|time|tel|phone|fax|email|www|http|gstin|gst|tin|pan|invoice|receipt|bill\s*no|tax|order|ref|no\.|mob|contact|address|branch|name|cashier|biller|support|dine|table)/i.test(t)) score -= 15;
  if (/^[\$₹€£¥Rs\s\d,.\-=]+$/.test(t)) score -= 20;
  if (/^[-=─*~_\s]+$/.test(t)) score -= 20;
  if (/\b(thank you|welcome|have a|visit again|please|call us|follow us|customer copy|free home delivery|order above)\b/i.test(t)) score -= 15;
  return score;
}

function extractMerchant(lines) {
  const candidates = lines.slice(0, 12).map((line, i) => ({
    line: line.trim(),
    score: scoreMerchantLine(line, i),
    index: i,
  }));

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (best && best.score > 0 && best.line.length >= 2) {
    const cleaned = best.line
      .replace(/[|\\]{2,}/g, '')
      .replace(/^\W+|\W+$/g, '')
      .trim();
    if (cleaned.length >= 2) {
      return { value: cleaned, confidence: Math.min(0.95, 0.55 + best.score / 35) };
    }
  }
  return { value: 'Unknown Merchant', confidence: 0.20 };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_MAP = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10,
  nov: 11, november: 11, dec: 12, december: 12,
};

const DATE_PATTERNS = [
  { re: /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/, order: 'YMD' },
  { re: /(?:date|dt|dated|invoice\s*date|bill\s*date)\s*[:=\s]\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/i, order: 'DMY' },
  { re: /(\d{1,2})\s+(jan\w*|feb\w*|mar\w*|apr\w*|may|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*),?\s+(\d{2,4})/i, order: 'DMontY' },
  { re: /(jan\w*|feb\w*|mar\w*|apr\w*|may|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\s+(\d{1,2}),?\s+(\d{2,4})/i, order: 'MontDY' },
  { re: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, order: 'DMY' },
  { re: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, order: 'DMY' },
];

function extractDate(text) {
  const normalized = normalizeOcrText(text);

  for (const { re, order } of DATE_PATTERNS) {
    const m = normalized.match(re);
    if (!m) continue;

    let day, month, year;
    if (order === 'YMD') { [, year, month, day] = m.map(Number); }
    else if (order === 'DMY') { [, day, month, year] = m.map(Number); }
    else if (order === 'DMontY') {
      day = parseInt(m[1]);
      month = MONTH_MAP[m[2].toLowerCase().replace(/\.$/, '').substring(0, 3)];
      year = parseInt(m[3]);
    } else if (order === 'MontDY') {
      month = MONTH_MAP[m[1].toLowerCase().replace(/\.$/, '').substring(0, 3)];
      day = parseInt(m[2]);
      year = parseInt(m[3]);
    }

    if (year < 100) year += 2000;

    if (year >= 2000 && year <= 2099 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return {
        value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        confidence: 0.92,
      };
    }
  }

  return { value: new Date().toISOString().split('T')[0], confidence: 0.30 };
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

function classifyCategory(text, merchant) {
  const combined = `${text} ${merchant}`.toLowerCase();
  let bestCategory = 'Other';
  let bestScore = 0;

  for (const [category, { keywords, weight }] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = combined.match(new RegExp(`\\b${escaped}\\b`, 'gi'));
      if (matches) score += matches.length * (keyword.length / 5) * weight;
    }
    if (score > bestScore) { bestScore = score; bestCategory = category; }
  }

  return {
    value: bestCategory,
    confidence: bestScore > 0 ? Math.min(0.98, 0.60 + (bestScore / 10) * 0.30) : 0.20,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE PREPROCESSING
// ─────────────────────────────────────────────────────────────────────────────

async function preprocessGentle(imagePath) {
  return sharp(imagePath)
    .grayscale()
    .normalize()
    .sharpen({ sigma: 1.2 })
    .resize({ width: 2000, withoutEnlargement: true })
    .png()
    .toBuffer();
}

async function preprocessAggressive(imagePath) {
  return sharp(imagePath)
    .grayscale()
    .normalize()
    .sharpen({ sigma: 2.0 })
    .linear(1.6, -(128 * 1.6) + 128)
    .threshold(130)
    .resize({ width: 2400, withoutEnlargement: true })
    .png()
    .toBuffer();
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

async function extractText(imagePath) {
  const t0 = Date.now();

  const buf1 = await preprocessGentle(imagePath);
  const pass1 = await Tesseract.recognize(buf1, 'eng', { logger: () => { } });

  if (pass1.data.confidence >= 70) {
    return {
      text: pass1.data.text,
      confidence: pass1.data.confidence / 100,
      lines: pass1.data.text.split('\n').filter(l => l.trim()),
      words: pass1.data.words || [],
      processingTime: Date.now() - t0,
    };
  }

  console.log('⚡ Low confidence — running aggressive preprocessing...');
  const buf2 = await preprocessAggressive(imagePath);
  const pass2 = await Tesseract.recognize(buf2, 'eng', { logger: () => { } });

  const best = pass2.data.confidence > pass1.data.confidence ? pass2 : pass1;
  return {
    text: best.data.text,
    confidence: best.data.confidence / 100,
    lines: best.data.text.split('\n').filter(l => l.trim()),
    words: best.data.words || [],
    processingTime: Date.now() - t0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

async function parseReceipt(filePath) {
  console.log(`\n🔍 OCR: Processing — ${path.basename(filePath)}`);

  const ocr = await extractText(filePath);
  
  const currencyResult = detectCurrency(ocr.text);
  const amountResult = extractAmount(ocr.text);
  const dateResult = extractDate(ocr.text);
  const merchantResult = extractMerchant(ocr.lines);
  const categoryResult = classifyCategory(ocr.text, merchantResult.value);

  const description = merchantResult.value !== 'Unknown Merchant'
    ? `${merchantResult.value} — ${categoryResult.value}`
    : `${categoryResult.value} expense on ${dateResult.value}`;

  const fieldConfidences = [amountResult.confidence, dateResult.confidence, merchantResult.confidence, categoryResult.confidence];
  const overallConfidence = fieldConfidences.reduce((a, b) => a + b, 0) / fieldConfidences.length;

  const result = {
    amount: amountResult.value,
    detectedCurrency: currencyResult.currency,
    merchant: merchantResult.value,
    date: dateResult.value,
    category: categoryResult.value,
    description,
    confidence: +overallConfidence.toFixed(2),
    rawText: ocr.text,
  };

  return result;
}

module.exports = { parseReceipt };
