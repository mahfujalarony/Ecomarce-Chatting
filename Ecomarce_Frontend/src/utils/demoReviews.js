const NAME_FIRST = [
  "Arif",
  "Nusrat",
  "Sadia",
  "Mithila",
  "Rafi",
  "Tanvir",
  "Sohan",
  "Ishrat",
  "Raihan",
  "Nabil",
  "Sabrina",
  "Nafis",
  "Mariam",
  "Rakib",
  "Shanta",
  "Arian",
  "Tasnim",
  "Jamil",
  "Farhan",
  "Priya",
  "Imran",
  "Asha",
  "Mehedi",
  "Rupa",
  "Sakib",
  "Runa",
];

const NAME_LAST = [
  "Ahmed",
  "Rahman",
  "Hossain",
  "Sultana",
  "Karim",
  "Islam",
  "Khan",
  "Akter",
  "Hasan",
  "Jahan",
  "Chowdhury",
  "Molla",
  "Kabir",
  "Nahar",
  "Binte",
  "Shikder",
  "Ferdous",
  "Uddin",
  "Mahmud",
  "Sarker",
];

const TITLE_POSITIVE = [
  "Great quality product",
  "Worth the money",
  "Very satisfied",
  "Exactly as described",
  "Fast and smooth delivery",
  "Highly recommended",
  "Good packaging and fresh",
  "Will order again",
  "Good value for price",
  "Trusted seller",
  "Better than expected",
  "Solid purchase",
  "Reliable quality",
  "Good finishing",
  "Happy with this order",
];

const TITLE_NEUTRAL = [
  "Good overall",
  "Decent quality",
  "Looks fine",
  "Delivery was okay",
  "Reasonable for the price",
  "Acceptable condition",
  "Usable for daily needs",
  "Not bad, can improve",
  "Average but fine",
  "Mixed experience",
];

const STYLE_POOL_POS = ["brief", "brief", "balanced", "balanced", "detailed", "chatty"];
const STYLE_POOL_NEU = ["brief", "balanced", "detailed", "critical", "critical"];

const OPEN_POS = [
  "Product quality was better than expected",
  "I received exactly what was shown in the pictures",
  "The item felt premium for this budget",
  "Everything arrived in good condition",
  "This was a smooth buying experience",
  "I am happy with the product finish",
  "The product looks authentic and fresh",
  "The first impression was really good",
  "Honestly this turned out better than I expected",
  "Pretty happy after using it for a few days",
];

const OPEN_NEU = [
  "Overall the product is okay",
  "The item is decent and usable",
  "Quality is average but acceptable",
  "It matches the basic expectation",
  "The product is fine for daily use",
  "I had a mixed experience with this order",
];

const DELIVERY_NOTES = [
  "delivery was on time",
  "packaging was clean and secure",
  "seller response was quick",
  "size and color were accurate",
  "no damage was found",
  "the order process was easy",
  "quality control seems good",
  "customer support replied politely",
  "product details matched the listing",
  "I did not face any issue so far",
  "tracking updates were clear",
  "the outer box was sealed properly",
];

const USE_CASES = [
  "daily use",
  "family needs",
  "office use",
  "regular home use",
  "short trips",
  "personal routine",
  "weekend use",
];

const GOOD_POINTS = [
  "quality feels consistent",
  "material feels decent",
  "value for price is good",
  "finishing looks clean",
  "performance is stable",
  "it is easy to use",
  "product condition was fresh",
];

const DRAWBACKS = [
  "delivery took a little longer than expected",
  "packaging could be improved",
  "I expected slightly better finishing",
  "the color tone is a bit different in person",
  "support response was a bit delayed",
  "price felt a little high",
];

const CLOSE_POS = [
  "Definitely recommended.",
  "I would buy this again.",
  "Very happy with this purchase.",
  "Good value and reliable service.",
  "Great experience overall.",
  "Satisfied from order to delivery.",
  "Happy to recommend this seller.",
];

const CLOSE_NEU = [
  "Overall a fair purchase.",
  "Not bad for this price range.",
  "Could be better but still okay.",
  "Works fine for now.",
  "Acceptable experience overall.",
  "I may try this again later.",
];

const RATING_POOL = [3, 4, 4, 4, 5, 5, 5];

const hashString = (input = "") => {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = (arr, rand) => arr[Math.floor(rand() * arr.length)];

const sentenceCase = (txt = "") => txt.charAt(0).toUpperCase() + txt.slice(1);
const maybe = (rand, p) => rand() < p;

const makeName = (rand) => {
  const first = pick(NAME_FIRST, rand);
  const last = pick(NAME_LAST, rand);
  const style = Math.floor(rand() * 4);
  if (style === 0) return `${first} ${last}`;
  if (style === 1) return `${first} ${last.charAt(0)}.`;
  if (style === 2) return `${first.charAt(0)}. ${last}`;
  return `${first} ${last} Jr.`;
};

const pickStyle = (rating, rand) => pick(rating >= 4 ? STYLE_POOL_POS : STYLE_POOL_NEU, rand);

const makeTitle = (rating, rand, style) => {
  if (style === "critical") return "Good but has a few issues";
  if (rating >= 4) return pick(TITLE_POSITIVE, rand);
  return pick(TITLE_NEUTRAL, rand);
};

const makeComment = ({ rating, rand, productName, style }) => {
  const withProduct = productName && maybe(rand, 0.35) ? `${productName} - ` : "";
  const opener = rating >= 4 ? pick(OPEN_POS, rand) : pick(OPEN_NEU, rand);
  const noteA = pick(DELIVERY_NOTES, rand);
  const noteB = pick(DELIVERY_NOTES, rand);
  const goodPoint = pick(GOOD_POINTS, rand);
  const useCase = pick(USE_CASES, rand);
  const drawback = pick(DRAWBACKS, rand);
  const closer = rating >= 4 ? pick(CLOSE_POS, rand) : pick(CLOSE_NEU, rand);

  if (style === "brief") {
    return `${withProduct}${opener}. ${sentenceCase(noteA)}. ${closer}`;
  }

  if (style === "chatty") {
    return `${withProduct}Honestly, ${opener.toLowerCase()}. ${sentenceCase(noteA)}, and ${noteB}. I used it for ${useCase}, and ${goodPoint}. ${closer}`;
  }

  if (style === "detailed") {
    const extra = maybe(rand, 0.55)
      ? `After a few days of use, ${goodPoint}.`
      : `From order to delivery, the process felt smooth.`;
    return `${withProduct}${opener}. ${sentenceCase(noteA)}, and ${noteB}. I bought this for ${useCase}. ${extra} ${closer}`;
  }

  if (style === "critical") {
    return `${withProduct}${opener}. ${sentenceCase(noteA)}, but ${drawback}. Still, ${goodPoint}. ${closer}`;
  }

  return `${withProduct}${opener}. ${sentenceCase(noteA)}, and ${noteB}. ${sentenceCase(goodPoint)}. ${closer}`;
};

export const buildDeterministicDemoReviews = ({ merchantId, productId, productName }) => {
  const mid = String(merchantId || "").trim();
  const pid = String(productId || "").trim();
  if (!mid || !pid) return [];

  const seed = hashString(`${mid}-${pid}`) || 1;
  const rand = mulberry32(seed);
  const now = Date.now();
  const count = 500 + Math.floor(rand() * 501);

  return Array.from({ length: count }).map((_, idx) => {
    const hourOffset = 3 + Math.floor(rand() * (24 * 365 - 2));
    const rating = pick(RATING_POOL, rand);
    const style = pickStyle(rating, rand);
    return {
      id: `${mid}-${pid}-demo-${idx + 1}`,
      rating,
      title: makeTitle(rating, rand, style),
      comment: makeComment({ rating, rand, productName, style }),
      createdAt: new Date(now - 1000 * 60 * 60 * hourOffset).toISOString(),
      user: { name: makeName(rand), imageUrl: "" },
      images: [],
    };
  });
};

export const getDemoReviewStats = (reviews = []) => {
  const safe = Array.isArray(reviews) ? reviews : [];
  const totalReviews = safe.length;
  if (!totalReviews) {
    return { averageRating: 0, totalReviews: 0 };
  }
  const sum = safe.reduce((acc, r) => acc + Number(r?.rating || 0), 0);
  return {
    averageRating: Number((sum / totalReviews).toFixed(1)),
    totalReviews,
  };
};

export const getDemoReviewScenario = ({ merchantId, productId, productName }) => {
  const reviews = buildDeterministicDemoReviews({ merchantId, productId, productName });
  const stats = getDemoReviewStats(reviews);
  return { reviews, ...stats };
};
