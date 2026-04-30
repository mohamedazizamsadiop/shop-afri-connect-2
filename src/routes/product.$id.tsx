import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, Check } from "lucide-react";
import { formatXOF, getProduct, getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Kasuwa` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Produit introuvable</h1>
      <Link to="/" className="text-primary underline mt-4 inline-block">Retour à l'accueil</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 6);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm text-muted-foreground mb-3">
        <Link to="/" className="hover:text-primary">Accueil</Link> /{" "}
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-primary">
          {product.category}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6 bg-card border border-border rounded-md p-4 md:p-6">
        <div className="relative bg-secondary rounded-md overflow-hidden aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} avis)</span>
          </div>

          <div className="bg-secondary rounded-md p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">{formatXOF(product.price)}</span>
              {product.oldPrice && (
                <span className="text-base text-muted-foreground line-through">{formatXOF(product.oldPrice)}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">TVA incluse</p>
          </div>

          <p className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <Check className="w-4 h-4 text-success" />
                <span className="font-semibold text-success">En stock</span>
                <span className="text-muted-foreground">— {product.stock} disponibles</span>
              </>
            ) : (
              <span className="text-destructive font-semibold">Rupture de stock</span>
            )}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-secondary" aria-label="Diminuer">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2 hover:bg-secondary" aria-label="Augmenter">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex-1 h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-xs">Garantie qualité</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-xs">Retour 7 jours</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
