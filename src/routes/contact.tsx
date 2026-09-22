import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageSquare, Phone, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { LocationSection } from "@/components/home/LocationSection";
import { restaurant } from "@/data/restaurant";
import { cn } from "@/lib/utils";

const title = "Contact & Table Inquiry — Hungry Hub Rajpura | Call & WhatsApp";
const description =
  "Contact Hungry Hub Rajpura on MLA Road, Neelpur. Call 085569 99361 for dine-in, party bookings, takeaway or home delivery. Open 24 hours, every day.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [inquiryType, setInquiryType] = useState("General Inquiry");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    const text = [
      `👋 *Hello Hungry Hub Rajpura!*`,
      `*Type:* ${inquiryType}`,
      `*From:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      "",
      `*Message:*`,
      form.message.trim(),
    ].join("\n");

    const waUrl = `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(text)}`;

    try {
      const w = window.open(waUrl, "_blank", "noopener,noreferrer");
      if (!w || w.closed || typeof w.closed === "undefined") {
        window.location.href = waUrl;
      }
    } catch {
      window.location.href = waUrl;
    }

    toast.success("Connecting you with Hungry Hub Rajpura on WhatsApp...");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="hh-cream-gradient pt-28">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title="We'd love to hear from you"
          subtitle="Have a question, planning a party celebration, or want to give feedback? Reach out directly via WhatsApp or call."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Quick Contact Info Cards */}
          <div className="space-y-4 lg:col-span-1">
            <Reveal>
              <div className="hh-shadow card-hover-lift rounded-3xl border border-border/70 bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 animate-bounce-subtle">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-lg">Call & Orders</h3>
                <p className="mt-1 text-xs text-muted-foreground">Available 24 hours every day</p>
                <a
                  href={restaurant.phoneHref}
                  className="mt-3 inline-block font-bold text-primary hover:underline text-base"
                >
                  {restaurant.phone}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  Delivery: {restaurant.deliveryPhones.join(" · ")}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="gold"
                    className="rounded-full text-xs font-bold btn-3d-gold"
                  >
                    <a href={restaurant.phoneHref}>
                      <Phone className="h-3.5 w-3.5 mr-1" /> Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="hh-shadow card-hover-lift rounded-3xl border border-border/70 bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-lg">Direct WhatsApp Chat</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Instant replies 24/7 for orders & queries
                </p>
                <div className="mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full text-xs font-bold btn-3d-primary bg-emerald-600 hover:bg-emerald-700"
                  >
                    <a
                      href={`https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(
                        "Hi Hungry Hub! I'd like to ask a question or place an inquiry.",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" /> WhatsApp Direct Chat
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="hh-shadow card-hover-lift rounded-3xl border border-border/70 bg-primary-deep text-primary-foreground p-6">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gold/20 text-gold mb-4 animate-pulse">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-gold">Party & Catering</h3>
                <p className="mt-1 text-xs text-primary-foreground/80 leading-relaxed">
                  Host your birthdays, get-togethers, and celebrations with our special bulk pizza &
                  momo combos.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-2">
            <Reveal delay={100}>
              <div className="hh-shadow rounded-3xl border border-border/70 bg-card p-8">
                <h3 className="font-display text-2xl font-bold">Send an Inquiry or Message</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill out the details below and we will connect with you right away on WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Inquiry Type
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "General Inquiry",
                        "Party / Table Booking",
                        "Bulk Order / Catering",
                        "Customer Feedback",
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryType(type)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer select-none",
                            inquiryType === type
                              ? "btn-3d-gold"
                              : "btn-3d-outline hover:border-amber-500/60",
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Your Name *</Label>
                      <Input
                        id="contact-name"
                        placeholder="e.g. Jaspreet Kaur"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="rounded-xl h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="e.g. 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-msg">Message / Requirements *</Label>
                    <Textarea
                      id="contact-msg"
                      rows={4}
                      placeholder="Tell us what you need (e.g. Number of guests, date & time, favorite pizzas, or any special requests)..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      variant="gold"
                      className="rounded-full px-8 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
                    >
                      <Send className="h-4 w-4 mr-2" /> Send Message via WhatsApp
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full px-6 py-6 text-sm font-bold btn-3d-outline cursor-pointer"
                    >
                      <a href={restaurant.phoneHref}>
                        <Phone className="h-4 w-4 mr-2 text-primary" /> Call {restaurant.phone}
                      </a>
                    </Button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <LocationSection />
    </div>
  );
}
