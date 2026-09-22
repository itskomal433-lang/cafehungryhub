import { Link } from "@tanstack/react-router";
import { Check, Copy, Sparkles, Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { offers } from "@/data/restaurant";

export function OffersSection({ showCta = true }: { showCta?: boolean }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (offerTitle: string, id: string) => {
    navigator.clipboard?.writeText(offerTitle);
    setCopiedId(id);
    toast.success("Offer coupon details copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="offers" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Daily Offers & Deals"
          title="Good food. Great offers."
          subtitle="Announce your coupon while placing the order on WhatsApp or call to claim these."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {offers.map((offer, index) => {
            const isCopied = copiedId === offer.id;
            return (
              <Reveal key={offer.id} delay={index * 100}>
                <article className="hh-shadow relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-primary-deep via-primary-deep/95 to-black/95 p-8 text-primary-foreground shadow-2xl transition-all duration-300 hover:border-gold/60 hover:-translate-y-1">
                  <div
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/15 blur-2xl"
                  />
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1 text-[0.65rem] font-extrabold tracking-[0.18em] text-gold-foreground uppercase shadow-md border border-amber-300/40">
                      <Sparkles className="h-3 w-3" /> {offer.badge}
                    </span>
                    <h3 className="mt-5 font-display text-2xl leading-snug font-bold sm:text-3xl text-white">
                      {offer.title}
                    </h3>
                    <p className="font-script mt-4 text-2xl text-gold">{offer.detail}</p>
                    <p className="mt-4 text-sm text-primary-foreground/75 font-medium">
                      {offer.note}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-primary-foreground/15">
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={() => handleCopy(offer.title, offer.id)}
                      className="rounded-full text-xs font-bold btn-3d-glass cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-amber-300 animate-bounce-subtle" />{" "}
                          Coupon Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" /> Copy Coupon
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="gold"
                      className="rounded-full px-5 text-xs font-black uppercase btn-3d-gold cursor-pointer"
                    >
                      <Link to="/menu">
                        <Utensils className="h-3.5 w-3.5 mr-1" /> Claim Offer Now
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {showCta ? (
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="gold"
              className="rounded-full px-8 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
            >
              <Link to="/menu">
                <Sparkles className="h-4 w-4 mr-2 text-stone-950" />
                Explore Menu & Daily Deals
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
