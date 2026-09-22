import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { InteractiveFoodShowcase } from "@/components/home/InteractiveFoodShowcase";
import { NewLaunches } from "@/components/home/NewLaunches";
import { OffersSection } from "@/components/home/OffersSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { LocationSection } from "@/components/home/LocationSection";
import { MenuBrowser } from "@/components/site/MenuBrowser";
import { SectionHeading } from "@/components/site/SectionHeading";
import { goodToKnow, restaurant } from "@/data/restaurant";

const title = "Hungry Hub Rajpura — Botanical Café, Artisan Pizza & 24/7 Lounge";
const description =
  "Handcrafted artisan pizzas, specialty coffee brews, kurkure momos, Chinese & shakes in Rajpura's premier botanical cafe lounge. Open 24 hours on MLA Road, Neelpur.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "Hungry Hub Rajpura, cafe in Rajpura, aesthetic cafe Rajpura, best pizza Rajpura, botanical lounge, momos Rajpura, 24 hour restaurant Rajpura, coffee shop near Neelpur",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: restaurant.fullName,
          slogan: restaurant.tagline,
          servesCuisine: ["Artisan Pizza", "Specialty Coffee", "Momos", "Chinese", "Fast Food"],
          priceRange: "₹₹",
          telephone: "+91 85569 99361",
          address: {
            "@type": "PostalAddress",
            streetAddress: "MLA Road, Banwari Village, Neelpur",
            addressLocality: "Rajpura",
            addressRegion: "Punjab",
            postalCode: "140401",
            addressCountry: "IN",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: restaurant.rating,
            reviewCount: restaurant.reviewCount,
          },
          hasMenu: "/menu",
          acceptsReservations: "False",
          potentialAction: [
            { "@type": "OrderAction", name: "Delivery" },
            { "@type": "OrderAction", name: "Takeaway" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />

      <InteractiveFoodShowcase />

      <section id="menu" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured Menu"
            title="What are you craving?"
            subtitle="From cheesy pizzas to loaded momos and refreshing shakes, discover your next favorite."
          />
          <div className="mt-12">
            <MenuBrowser limit={9} />
          </div>
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-bold uppercase"
            >
              <Link to="/menu">See full menu</Link>
            </Button>
          </div>
        </div>
      </section>

      <NewLaunches />
      <OffersSection />

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/70 bg-card p-8 hh-shadow">
          <h2 className="font-display text-2xl font-bold">Good to know</h2>
          <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
            {goodToKnow.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden="true" className="text-accent">
                  •
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AboutSection />
      <ReviewsSection />
      <GallerySection />
      <LocationSection />
    </>
  );
}
