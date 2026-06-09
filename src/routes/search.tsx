import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
  head: () => ({
    meta: [{ title: "Recherche — Kasuwa" }],
  }),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = useMemo(() => {
    const needle = q.toLowerCase().trim();
    if (!needle) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">
        {q ? <>Résultats pour « <span className="text-primary">{q}</span> »</> : "Recherche"}
      </h1>
      <p className="text-sm text-muted-foreground mb-5">
        {q ? `${results.length} produit${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}` : "Saisissez un terme dans la barre de recherche."}
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : q ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Aucun produit trouvé pour cette recherche.</p>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      ) : null}
    </div>
  );
}
