import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatXOF } from "@/data/products";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Mon panier — Kasuwa" },
      { name: "description", content: "Vérifiez vos articles et passez commande sur Kasuwa." },
    ],
  }),
});

function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clear } = useCart();
  const shipping = totalPrice > 25000 || totalPrice === 0 ? 0 : 2000;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez nos meilleures offres dès maintenant.</p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-6 py-3 rounded-md transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">Mon panier ({totalItems})</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-card border border-border rounded-md p-3 flex gap-3">
              <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                <img src={product.image} alt={product.name} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded bg-secondary" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link to="/product/$id" params={{ id: product.id }} className="font-medium hover:text-primary line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="text-lg font-bold text-primary mt-auto">{formatXOF(product.price * quantity)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-muted-foreground hover:text-destructive p-1"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-border rounded">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1.5 hover:bg-secondary" aria-label="Diminuer">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-sm font-bold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1.5 hover:bg-secondary" aria-label="Augmenter">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
            Vider le panier
          </button>
        </div>

        <aside className="bg-card border border-border rounded-md p-5 h-fit lg:sticky lg:top-32 space-y-3">
          <h2 className="text-lg font-bold">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{formatXOF(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium">{shipping === 0 ? "Gratuite" : formatXOF(shipping)}</span>
            </div>
            {shipping === 0 && totalPrice > 0 && (
              <p className="text-xs text-success font-medium">🎉 Vous bénéficiez de la livraison gratuite !</p>
            )}
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black text-primary">{formatXOF(grandTotal)}</span>
          </div>
          <button className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-md transition-colors">
            Passer la commande
          </button>
          <Link to="/" className="block text-center text-sm text-primary hover:underline">
            ← Continuer mes achats
          </Link>
          <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-1">
            <p>💳 Paiement : Wave, Orange Money, Carte, Espèces à la livraison</p>
            <p>🔒 Transaction 100% sécurisée</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
