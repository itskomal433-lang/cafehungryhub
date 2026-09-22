import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Clock,
  Coffee,
  Flame,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Truck,
  Users,
  Utensils,
} from "lucide-react";
import { AboutSection } from "@/components/home/AboutSection";
import { LocationSection } from "@/components/home/LocationSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import interiorLounge from "@/assets/hungryhub-lounge-cozy.jpg";
import cafeBakery from "@/assets/cafe-bakery-counter.jpg";
import cafeTable from "@/assets/cafe-table-setting.jpg";
import artisanPizza from "@/assets/artisan-pizza-motion.jpg";

const title = "About Hungry Hub Rajpura — Botanical Café, Lounge & 24/7 Kitchen";
const description =
  "Hungry Hub Rajpura is a premier botanical cafe and lounge on MLA Road, Neelpur featuring double-height mezzanine dining, fluted wood coffee bar, artisan pizzas, and 24-hour service.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const STATS = [
  {
    value: "24/7",
    label: "Open Day & Night",
    sub: "Round-the-clock cafe dining & express delivery",
    icon: Clock,
  },
  {
    value: "4.6★",
    label: "Google Rating",
    sub: "Loved by 500+ regular foodies, students & families",
    icon: Star,
  },
  {
    value: "100%",
    label: "Fresh Hand-Tossed",
    sub: "Artisan base made fresh daily, stone-baked",
    icon: Flame,
  },
  {
    value: "50+",
    label: "Cafe Specialties",
    sub: "Specialty coffees, pizzas, kurkure momos & shakes",
    icon: Coffee,
  },
];

const CAFE_ZONES = [
  {
    title: "The Botanical Mezzanine",
    subtitle: "Overlooking Sunlit Architecture",
    description:
      "An airy second-level loft surrounded by cascading green ivy, intimate lighting, and views over the bustling cafe below.",
    image: interiorLounge,
    icon: Trees,
    tag: "Mezzanine Loft",
  },
  {
    title: "Fluted Wood Espresso Bar",
    subtitle: "Artisan Brews & Fresh Pastries",
    description:
      "Crafted with ribbed natural oak and glowing warm LED under-counter strips, serving fresh roasted espresso and bakery treats.",
    image: cafeBakery,
    icon: Coffee,
    tag: "Live Barista Bar",
  },
  {
    title: "Marble Bistro Dining",
    subtitle: "Boucle & Velvet Seating",
    description:
      "Relax on custom emerald velvet booths and plush cream boucle armchairs around polished Italian Carrara marble tables.",
    image: cafeTable,
    icon: Sparkles,
    tag: "Lounge Seating",
  },
  {
    title: "The 24/7 Stone Oven Kitchen",
    subtitle: "Hand-Tossed Artisanal Dough",
    description:
      "Our kitchen never sleeps — stone-baking bubbly woodfired pizzas, crunchy kurkure momos, and sizzling pastas around the clock.",
    image: artisanPizza,
    icon: Flame,
    tag: "Live 24H Kitchen",
  },
];

const PILLARS = [
  {
    icon: Flame,
    title: "100% Fresh Hand-Tossed Dough",
    description: "Every single pizza starts with freshly made dough — never frozen or pre-baked.",
  },
  {
    icon: Coffee,
    title: "Specialty Roasted Brews",
    description: "Rich, aromatic espresso shots pulled fresh with velvety microfoam latte art.",
  },
  {
    icon: Clock,
    title: "24/7 Service Without Compromise",
    description:
      "Late night study sessions or early morning cravings, our ovens and cafe are always open.",
  },
  {
    icon: ShieldCheck,
    title: "Highest Hygiene Standards",
    description:
      "Spotless kitchen, sanitized food prep stations, and fresh quality ingredients daily.",
  },
  {
    icon: HeartHandshake,
    title: "Warm Rajpura Hospitality",
    description: "Courteous team dedicated to making every dine-in and takeaway meal memorable.",
  },
  {
    icon: Award,
    title: "4.6★ Google Customer Rating",
    description:
      "Loved by hundreds of regular foodies across Neelpur, Rajpura and surrounding areas.",
  },
];

function AboutPage() {
  return (
    <div className="hh-cream-gradient pt-24">
      <AboutSection />

      {/* Interactive Key Stats Highlights */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-border/60">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80}>
                <div className="hh-shadow card-hover-lift flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 text-center group hover:border-primary/50">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-display text-4xl font-extrabold text-primary group-hover:text-primary-deep transition-colors">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Architectural Cafe Experience Zones */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-border/60 bg-card/60">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Architectural Experience"
            title="Step Inside Our Botanical Sanctuary"
            subtitle="Explore the carefully curated corners designed for relaxation, conversations, study, and dining."
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CAFE_ZONES.map((zone, idx) => (
              <Reveal key={zone.title} delay={idx * 90}>
                <div className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                    <img
                      src={zone.image}
                      alt={zone.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[0.65rem] font-extrabold text-gold uppercase border border-gold/30">
                      {zone.tag}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <zone.icon className="h-3.5 w-3.5 text-gold" />
                        <span>{zone.subtitle}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                        {zone.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Promise"
            title="The Hungry Hub Standard"
            subtitle="What sets our pizzas, coffees, and culinary craft apart in every single visit."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 60}>
                <div className="hh-shadow card-hover-lift flex h-full flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 hover:border-primary/50">
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Fresh & Verified
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="gold"
              className="rounded-full px-8 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
            >
              <Link to="/menu">
                <Utensils className="h-4 w-4 mr-2 text-stone-950" />
                Taste The Hungry Hub Difference
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LocationSection />
    </div>
  );
}
