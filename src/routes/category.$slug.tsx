import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { categories, getCategory, getProductsByCategory, type CategorySlug } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  loader: ({ params }) => {
    const cat = getCategory(params.slug as CategorySlug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Kasuwa` },
          { name: "description", content: `Achetez ${loaderData.category.name.toLowerCase()} : ${loaderData.category.tagline}. Livraison au Sénégal.` },
          { property: "og:title", content: `${loaderData.category.name} — Kasuwa` },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Catégorie introuvable</h1>
      <Link to="/" className="text-primary underline mt-4 inline-block">Retour à l'accueil</Link>
    </div>
  ),
});

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const all = getProductsByCategory(category.slug);
  const [sort, setSort] = useState<SortKey>("popular");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [brand, setBrand] = useState<string>("all");

  const brands = useMemo(() => Array.from(new Set(all.map((p) => p.brand))), [all]);
  const priceCeiling = useMemo(() => Math.max(...all.map((p) => p.price)), [all]);

  const filtered = useMemo(() => {
    let list = [...all];
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    if (maxPrice > 0) list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [all, sort, maxPrice, brand]);

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm text-muted-foreground mb-3">
        <Link to="/" className="hover:text-primary">Accueil</Link> / <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="bg-[var(--gradient-hero)] text-primary-foreground rounded-md p-5 mb-5">
        <h1 className="text-2xl md:text-3xl font-black">{category.name}</h1>
        <p className="opacity-90 mt-1">{category.tagline}</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        {/* Filters */}
        <aside className="bg-card border border-border rounded-md p-4 space-y-5 h-fit lg:sticky lg:top-32">
          <div>
            <h3 className="font-bold text-sm mb-2">Marque</h3>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-9 px-2 border border-border rounded bg-background text-sm"
            >
              <option value="all">Toutes les marques</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">
              Prix max : {maxPrice > 0 ? `${maxPrice.toLocaleString("fr-FR")} FCFA` : "Tous"}
            </h3>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <button
            onClick={() => { setBrand("all"); setMaxPrice(0); }}
            className="text-xs text-primary font-medium hover:underline"
          >
            Réinitialiser les filtres
          </button>
          <div className="border-t border-border pt-4">
            <h3 className="font-bold text-sm mb-2">Autres catégories</h3>
            <ul className="space-y-1 text-sm">
              {categories.filter((c) => c.slug !== category.slug).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-3 bg-card border border-border rounded-md px-3 py-2">
            <span className="text-sm text-muted-foreground">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 px-2 border border-border rounded bg-background text-sm"
            >
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Aucun produit ne correspond à vos filtres.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
