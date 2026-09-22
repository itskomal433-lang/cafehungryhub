import { createFileRoute } from "@tanstack/react-router";
import { MenuBrowser } from "@/components/site/MenuBrowser";
import { SectionHeading } from "@/components/site/SectionHeading";
import { goodToKnow } from "@/data/restaurant";
import { extraCheesePrice, extraToppingPrice, extraToppings, pizzaBases } from "@/data/menu";
import { formatPrice } from "@/data/restaurant";

const title = "Menu — Hungry Hub Rajpura | Pizza, Momos, Chinese & Shakes";
const description =
  "Browse the full Hungry Hub Rajpura menu: pizzas from ₹150, burgers, momos, Chinese, pasta, wraps, fries, shakes and desserts. Order for delivery or takeaway.";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <div className="hh-cream-gradient px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Menu"
          title="What are you craving?"
          subtitle="From cheesy pizzas to loaded momos and refreshing shakes, discover your next favorite."
        />

        <div id="menu" className="mt-12">
          <MenuBrowser />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="hh-shadow rounded-3xl border border-border/70 bg-card p-8">
            <h2 className="font-display text-2xl font-bold">Pizza customisation</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-semibold">Choice of base (add-on)</dt>
                <dd className="mt-1 text-muted-foreground">
                  {pizzaBases
                    .filter((base) => base.prices.Regular > 0)
                    .map(
                      (base) =>
                        `${base.name} — R ${formatPrice(base.prices.Regular)} / M ${formatPrice(
                          base.prices.Medium,
                        )} / L ${formatPrice(base.prices.Large)}`,
                    )
                    .join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Extra toppings</dt>
                <dd className="mt-1 text-muted-foreground">
                  R {formatPrice(extraToppingPrice.Regular)} / M{" "}
                  {formatPrice(extraToppingPrice.Medium)} / L {formatPrice(extraToppingPrice.Large)}{" "}
                  each — {extraToppings.join(", ")}.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Extra cheese</dt>
                <dd className="mt-1 text-muted-foreground">
                  R {formatPrice(extraCheesePrice.Regular)} / M{" "}
                  {formatPrice(extraCheesePrice.Medium)} / L {formatPrice(extraCheesePrice.Large)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="hh-shadow rounded-3xl border border-border/70 bg-card p-8">
            <h2 className="font-display text-2xl font-bold">Good to know</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
}
