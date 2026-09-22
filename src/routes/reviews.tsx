import { createFileRoute } from "@tanstack/react-router";
import { ReviewsSection } from "@/components/home/ReviewsSection";

const title = "Reviews — Hungry Hub Rajpura | Rated 4.6/5 on Google";
const description =
  "Hungry Hub Rajpura is rated 4.6 out of 5 across 41 Google reviews, with guests highlighting taste, value, quick service and a comfortable space.";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="pt-24">
      <ReviewsSection />
    </div>
  );
}
