/**
 * Centralized Course Pricing & 10% Discount System for CodeLekho CRM
 * Strict rule: No course in CodeLekho exists at ₹99.
 * Real catalog prices are displayed with an active 10% student discount applied.
 */

const COURSE_CATALOG = {
  'python-programming': {
    title: 'Python Programming',
    basePrice: 149,
    duration: '10 Weeks (Interactive Live Cohort)',
    isFree: false
  },
  'web-development': {
    title: 'Web Development',
    basePrice: 149,
    duration: '12 Weeks (Full Stack Curriculum)',
    isFree: false
  },
  'sql-mastery': {
    title: 'SQL & Relational Databases',
    basePrice: 149,
    duration: '8 Weeks (Database Architecture)',
    isFree: false
  },
  'data-science-ai': {
    title: 'AI & Data Science',
    basePrice: 199,
    duration: '14 Weeks (AI, ML & Data Engineering)',
    isFree: false
  },
  'foundations': {
    title: 'Foundations Track',
    basePrice: 0,
    duration: '4 Weeks (Free Open Cohort)',
    isFree: true
  }
};

function normalizeCourseKey(courseName) {
  const norm = String(courseName || '').toLowerCase().trim();
  if (norm.includes('foundation') || norm.includes('free')) return 'foundations';
  if (norm.includes('ai') || norm.includes('data')) return 'data-science-ai';
  if (norm.includes('python')) return 'python-programming';
  if (norm.includes('web')) return 'web-development';
  if (norm.includes('sql') || norm.includes('database')) return 'sql-mastery';
  return 'python-programming';
}

function calculateCoursePricing(courseName, customAmount = null) {
  const key = normalizeCourseKey(courseName);
  const catalog = COURSE_CATALOG[key] || COURSE_CATALOG['python-programming'];

  if (catalog.isFree || key === 'foundations') {
    return {
      courseName: catalog.title,
      basePrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      finalPrice: 0,
      isFree: true,
      displayPrice: 'Free Track',
      formattedAmount: '₹0 (Free Track)',
      savingsText: 'Free Access',
      couponCode: 'FREECOHORT',
      breakdownHtml: '<span style="color:#7C3AED;font-weight:700;">Free Track</span>'
    };
  }

  let basePrice = catalog.basePrice;
  const numCustom = Number(customAmount);
  // If customAmount is a real price (and not the erroneous 99)
  if (numCustom && numCustom > 0 && numCustom !== 99) {
    basePrice = numCustom;
  }

  // Calculate 10% discount
  const discountPercent = 10;
  const discountAmount = Math.round(basePrice * 0.10);
  const finalPrice = Math.max(1, basePrice - discountAmount);

  return {
    courseName: catalog.title,
    basePrice,
    discountPercent,
    discountAmount,
    finalPrice,
    isFree: false,
    displayPrice: `₹${finalPrice}`,
    formattedAmount: `₹${finalPrice}`,
    savingsText: `Save ₹${discountAmount} (10% OFF applied)`,
    couponCode: 'CODEL452',
    breakdownHtml: `
      <span style="text-decoration:line-through;color:#94A3B8;margin-right:8px;font-size:13px;">₹${basePrice}</span>
      <strong style="color:#059669;font-size:16px;">₹${finalPrice}</strong>
      <span style="margin-left:6px;background:#DCFCE7;color:#15803D;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;border:1px solid #86EFAC;">10% OFF APPLIED</span>
    `
  };
}

module.exports = {
  COURSE_CATALOG,
  normalizeCourseKey,
  calculateCoursePricing
};

