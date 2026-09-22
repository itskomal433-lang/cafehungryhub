# Hungry Hub Rajpura — Premium Restaurant Website

A polished, mobile-first restaurant site built around the real Hungry Hub menu, with an interactive menu, pizza builder, cart, and WhatsApp-based ordering.

## Decisions made (questions were skipped)

- **Ordering:** Orders are formatted into a WhatsApp message to 085569 99361 (with a call fallback). No backend, no fake payments. The destination number and message format live in one config file.
- **Images:** AI-generated appetizing food photography for the hero, category tiles, and gallery, matching the green/cream/red brand. Gallery is labelled as representative imagery rather than claiming to be actual restaurant photos.
- **Cart charges:** Delivery fee and tax live in a config file, default 0, and their lines only render when non-zero. No invented rates.
- **Reviews:** 4.6/5 and 41 reviews shown as a rating panel plus the five supplied themes. No fabricated quotes; a "Read reviews on Google" link points to Maps.

## Brand & design system

- Palette (oklch tokens in `src/styles.css`): deep forest green, rich pizza red, warm cream/ivory, soft beige, golden accent, charcoal text — light theme committed.
- Type: elegant serif display for headings, clean sans for body, a script accent used only on offer badges. Loaded via `<link>` in `__root.tsx`.
- Rounded cards, generous whitespace, soft premium shadows, subtle gradients, restrained scroll-reveal and hover-zoom animation.

## Pages & sections

Single primary route `/` with anchored sections, plus dedicated routes for the shareable pages so each gets its own SEO metadata:

- `/` — Hero (cinematic pizza, headline, ORDER NOW / VIEW MENU, OPEN 24 HOURS badge, Dine-in • Takeaway • Delivery), trust bar (4 cards), featured menu preview, new launches, offers, about, reviews, gallery preview, location, footer.
- `/menu` — full interactive menu.
- `/offers`, `/about`, `/gallery`, `/reviews`, `/contact`.

Header: sticky, transparent-over-hero → solid cream on scroll, pizza+heart logo mark, nav links, phone number, ORDER NOW. Mobile: hamburger drawer + prominent order button + sticky bottom nav (Home / Menu / Call / Order).

## Menu experience

- Category tabs: All, Pizza, Burgers, Momos, Chinese, Pasta, Wraps, Sides, Drinks, Desserts (plus Maggi, Soup, Sandwiches, Fries, Chaap, Paneer, Tacos, Ice Cream folded into the right groups).
- Search, veg filter, bestseller filter, price sort.
- Cards: image, name, description, price (from-price for multi-size), VEG badge, NEW/BESTSELLER badges, ADD or CHOOSE OPTIONS.
- Pizza builder modal: size → base (Pan/Thin Crust/Cheese Burst with their exact surcharges) → extra toppings (₹30/40/60 by size) → extra cheese (₹40/60/90) → quantity → add. Live price total.
- Non-pizza multi-price items (Dry/Gravy, M/L, Veg/Fried) use a simple variant selector.
- "Good to Know" notes block beside the menu, verbatim from the supplied notes.

## Cart & order flow

Slide-out cart: line items with chosen options, quantity steppers, unit price, subtotal, optional discount/delivery/tax lines, grand total. PROCEED TO ORDER opens a mobile-first form: order type (Dine-in / Takeaway / Delivery) with the fields listed per type, then submits via WhatsApp deep link.

## Data

All menu content in `src/data/menu.ts` as typed objects matching the requested shape (id, name, category, description, image, prices, sizes, variants, toppings, addOns, vegetarian, spicy, bestseller, available). Every item and price transcribed exactly from the supplied menu — nothing invented. Restaurant details (address, phones, hours, socials, delivery partners, fees) in `src/data/restaurant.ts`.

## SEO

Per-route `head()` with Rajpura-focused titles/descriptions, canonical links, og/twitter tags, and Restaurant + LocalBusiness JSON-LD (name, address, phone, 24-hour opening spec, cuisine, services, aggregateRating 4.6/41, menu link).

## Technical notes

- TanStack Start file routes; cart state in a React context with localStorage persistence.
- Google Maps embed for directions (static embed URL, no API key needed) plus CALL NOW / GET DIRECTIONS buttons.
- Lazy-loaded gallery images, responsive grids at mobile/tablet/desktop, thumb-friendly targets, keyboard-accessible modals and drawer.
