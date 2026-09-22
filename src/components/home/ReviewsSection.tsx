import { useState } from "react";
import { ExternalLink, MessageSquarePlus, MessageSquareQuote, Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { customerReviews, mapsSearchUrl, restaurant, reviewThemes } from "@/data/restaurant";
import { useAdminStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export function ReviewsSection() {
  const store = useAdminStore();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHighlight, setReviewHighlight] = useState("Fresh Base Pizza");
  const [reviewComment, setReviewComment] = useState("");

  // Use dynamic reviews from store if loaded, otherwise default
  const reviewsList = store.reviews.length > 0 ? store.reviews : customerReviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast.error("Please enter your name and review message.");
      return;
    }

    store.addReview({
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      rating: reviewRating,
      date: "Just now",
      comment: reviewComment.trim(),
      highlight: reviewHighlight.trim() || "Delicious Food",
      featured: true,
    });

    toast.success("Thank you for your review! It has been shared with the team.");
    setReviewModalOpen(false);
    setReviewerName("");
    setReviewComment("");
  };

  return (
    <section className="bg-secondary/70 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Google Reviews & Guest Love"
          title="Loved by Rajpura"
          subtitle="Real reviews and high ratings from food lovers across Rajpura & Neelpur."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <Reveal>
            <div className="hh-shadow flex h-full flex-col items-center justify-center rounded-3xl border border-gold/35 bg-gradient-to-br from-primary-deep via-primary-deep/95 to-black/95 p-8 text-center text-primary-foreground shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/15 blur-3xl pointer-events-none" />
              <span className="rounded-full bg-gold/20 px-3.5 py-1 text-xs font-extrabold tracking-wider text-gold uppercase border border-gold/40">
                Google Verified Rating
              </span>
              <p className="mt-4 font-display text-6xl font-extrabold text-gold drop-shadow-md">
                {restaurant.rating}
              </p>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < Math.round(restaurant.rating)
                        ? "h-5 w-5 fill-gold text-gold animate-sparkle"
                        : "h-5 w-5 text-primary-foreground/30"
                    }
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-primary-foreground/80 font-medium">
                {restaurant.rating} out of 5 · {restaurant.reviewCount}+ Google reviews
              </p>
              <div className="mt-6 flex flex-col gap-2.5 w-full">
                <Button
                  onClick={() => setReviewModalOpen(true)}
                  variant="gold"
                  className="w-full rounded-full font-black uppercase text-xs btn-3d-gold btn-shimmer-sweep cursor-pointer"
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" /> Write a Review
                </Button>
                <Button
                  asChild
                  variant="glass"
                  className="w-full rounded-full font-bold text-xs btn-3d-glass cursor-pointer"
                >
                  <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2 text-amber-300" /> View on Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Customer Testimonials Carousel/Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {reviewsList.map((review, index) => (
              <Reveal key={review.name + index} delay={index * 60}>
                <div className="hh-shadow relative flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1 hover:shadow-xl">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="h-4 w-4 fill-amber-400 text-amber-500"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[0.68rem] font-bold text-primary">
                        {review.highlight}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/90 font-medium italic">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{review.name}</span>
                    <span className="text-[11px]">{review.date}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Review Highlights */}
        <div className="mt-12">
          <p className="text-center text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6">
            Key Highlights Mentioned by Guests
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {reviewThemes.map((theme, index) => (
              <Reveal key={theme.title} delay={index * 40}>
                <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
                  <p className="font-display font-bold text-sm text-foreground">{theme.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Review Dialog */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Share Your Experience</DialogTitle>
            <DialogDescription className="text-xs">
              Tell other foodies in Rajpura how much you loved your meal at Hungry Hub!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase">Your Name</Label>
              <Input
                placeholder="e.g. Jaspreet Singh"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs uppercase">Your Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        star <= reviewRating ? "fill-gold text-gold" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase">Highlight / Favorite Dish</Label>
              <Input
                placeholder="e.g. Kurkure Momos, Cheese Burst Pizza, Cold Coffee"
                value={reviewHighlight}
                onChange={(e) => setReviewHighlight(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs uppercase">Your Review</Label>
              <Textarea
                placeholder="Write your review here..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-1 h-24 text-xs"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
