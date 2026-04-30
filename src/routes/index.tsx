import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const flashDeals = products.filter((p) => p.oldPrice).slice(0, 6);
  const popular = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      {/* Hero */}
      <section className="relative rounded-xl overflow-hidden bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-6 md:p-12 space-y-4">
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
              MEGA PROMO
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Tout pour votre <br />téléphone, moto & voiture
            </h1>
            <p className="text-lg opacity-95">
              Jusqu'à <span className="font-bold">-40%</span> sur des milliers de produits.
              Livraison partout au Sénégal.
            </p>
            <Link
              to="/category/$slug"
              params={{ slug: "accessoires" }}
              className="inline-block bg-background text-foreground font-bold px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Découvrir les offres
            </Link>
          </div>
          <div className="relative h-56 md:h-80">
            <img
              src={heroBanner}
              alt="Produits Kasuwa en promotion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Truck, title: "Livraison rapide", sub: "Partout au Sénégal" },
          { icon: CreditCard, title: "Paiement mobile", sub: "Wave, Orange Money" },
          { icon: ShieldCheck, title: "Produits vérifiés", sub: "Qualité garantie" },
          { icon: Headphones, title: "Support 7j/7", sub: "Une équipe à l'écoute" },
        ].map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-md p-3 flex items-center gap-3">
            <f.icon className="w-7 h-7 text-primary shrink-0" />
            <div>
              <p className="text-sm font-bold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Nos catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group bg-card border border-border rounded-md overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-bold text-sm md:text-base group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash deals */}
      <section className="bg-card border border-border rounded-md overflow-hidden">
        <div className="bg-[var(--gradient-promo)] text-primary-foreground px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-black">⚡ Ventes Flash</h2>
          <span className="text-xs md:text-sm font-medium">Stocks limités</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3">
          {flashDeals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Popular */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Les plus populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {popular.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
