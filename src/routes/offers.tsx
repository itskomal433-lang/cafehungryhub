import { createFileRoute } from "@tanstack/react-router";
import { OffersSection } from "@/components/home/OffersSection";
import { goodToKnow } from "@/data/restaurant";

const title = "Offers — Hungry Hub Rajpura | Pizza Deals & Wednesday BOGO";
const description =
  "Current Hungry Hub Rajpura offers: free pasta with a large pizza and medium cold drink, plus Buy One Get One Free on medium and large pizzas every Wednesday.";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  return (
    <div className="hh-cream-gradient pt-24">
      <OffersSection />
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="hh-shadow mx-auto max-w-4xl rounded-3xl border border-border/70 bg-card p-8">
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
    </div>
  );
}
