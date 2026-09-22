import { createFileRoute } from "@tanstack/react-router";
import { GallerySection } from "@/components/home/GallerySection";

const title = "Gallery — Hungry Hub Rajpura | Pizzas, Momos & More";
const description =
  "See what comes out of the Hungry Hub Rajpura kitchen: pizzas, momos, burgers, Chinese, fries, shakes, desserts and our dining space.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="hh-cream-gradient pt-24">
      <GallerySection full />
    </div>
  );
}
