/**
 * Single source of truth for restaurant details, ordering config and charges.
 * Owner-editable: change values here and the whole site follows.
 */

export const restaurant = {
  name: "Hungry Hub",
  fullName: "Hungry Hub Rajpura",
  tagline: "Crave It. Love It. Hungry Hub.",
  footerTagline: "Your cravings. Our specialty.",
  cuisines: ["Pizza", "Fast Food", "Chinese", "Momos", "Beverages"],
  address: {
    line1: "Hungry Hub, MLA Road",
    line2: "Banwari Village, Neelpur",
    city: "Rajpura",
    state: "Punjab",
    postalCode: "140401",
    country: "IN",
  },
  addressLines: [
    "Hungry Hub",
    "MLA Road",
    "Banwari Village",
    "Neelpur",
    "Rajpura",
    "Punjab 140401",
  ],
  phone: "085569 99361",
  phoneHref: "tel:+918556999361",
  deliveryPhones: ["85569-99361", "85999-99362"],
  whatsappNumber: "918556999361", // used for order submission
  hours: "Open 24 Hours",
  services: ["Dine-in", "Takeaway", "Delivery"],
  rating: 4.6,
  reviewCount: 41,
  mapsQuery: "Hungry Hub, MLA Road, Banwari Village, Neelpur, Rajpura, Punjab 140401",
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
  deliveryPartners: [
    { name: "Zomato", url: "https://www.zomato.com/" },
    { name: "Swiggy", url: "https://www.swiggy.com/" },
  ],
} as const;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  restaurant.mapsQuery,
)}`;

export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  restaurant.mapsQuery,
)}`;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  restaurant.mapsQuery,
)}&output=embed`;

/**
 * Charges are configurable. Values are not published on the menu, so they
 * default to 0 and their lines stay hidden until the owner sets them.
 */
export const charges = {
  currency: "₹",
  taxPercent: 0,
  taxLabel: "Taxes",
  deliveryFee: 0,
  deliveryFeeLabel: "Delivery fee",
  freeDeliveryAbove: 0, // 0 = disabled
  minimumOrder: 0, // 0 = disabled
};

export const formatPrice = (value: number) =>
  `${charges.currency}${Number.isInteger(value) ? value : value.toFixed(2)}`;

export const offers = [
  {
    id: "offer-free-pasta",
    badge: "Special Offer",
    title: "Buy A Large Pizza With Medium Cold Drink & Get A Free Pasta",
    detail: "Available on large pizzas ordered with a medium cold drink.",
    note: "Please announce coupon at the time of placing order.",
  },
  {
    id: "offer-bogo",
    badge: "Limited",
    title: "Buy One Get One Free",
    detail: "Every Wednesday · Medium / Large Pizza",
    note: "Not valid on Simply Veg Pizza.",
  },
] as const;

export const goodToKnow = [
  "We make all pizza with fresh base.",
  "Prices subject to change without prior notice.",
  "Tomato blend used in our pizza contains garlic seasoning.",
  "Weight of pizzas vary with the toppings combination orders.",
  "Actual product may vary/differ from the images shown in the prints.",
  "Please announce coupon at the time of placing order.",
] as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/offers", label: "Offers" },
  { to: "/orders", label: "My Orders" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export const customerReviews = [
  {
    name: "Gurpreet Singh",
    rating: 5,
    date: "Recent Google Review",
    comment:
      "Best pizza place in Rajpura! The fresh base makes a huge difference. Garlic seasoning and cheese burst crust are unbelievable.",
    highlight: "Fresh Base Pizza",
  },
  {
    name: "Simran Kaur",
    rating: 5,
    date: "Recent Google Review",
    comment:
      "Their kurkure momos and cold coffee are my late-night favorites. Being open 24 hours is a blessing for students and travelers!",
    highlight: "Kurkure Momos & 24h",
  },
  {
    name: "Amit Sharma",
    rating: 5,
    date: "Recent Google Review",
    comment:
      "Superb ambiance, hygienic dining, and very courteous staff. The Wednesday BOGO pizza deal is great value for money.",
    highlight: "Great Value & Ambience",
  },
  {
    name: "Pooja Verma",
    rating: 5,
    date: "Recent Google Review",
    comment:
      "Crispy burgers and loaded fries. Delivery was prompt and food arrived steaming hot. Highly recommended in Neelpur / Rajpura area.",
    highlight: "Hot & Fast Delivery",
  },
  {
    name: "Manish Kumar",
    rating: 5,
    date: "Recent Google Review",
    comment:
      "Tasted authentic Chinese noodles and gravy momos. Everything was prepared fresh to order. Definitely visiting again.",
    highlight: "Authentic Chinese",
  },
] as const;

export const reviewThemes = [
  { title: "Fresh Food", detail: "Guests highlight how fresh the food tastes." },
  { title: "Tasty Pizzas", detail: "The pizzas are a repeat favourite." },
  { title: "Good Service", detail: "Quick, dependable service around the clock." },
  { title: "Polite Staff", detail: "Warm and courteous team." },
  { title: "Clean Premises", detail: "A tidy, comfortable place to eat." },
] as const;
