import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="bg-header text-header-foreground mt-16">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center font-black text-primary-foreground">
              K
            </div>
            <span className="font-black text-xl">KASUWA<span className="text-primary">.</span></span>
          </div>
          <p className="text-sm opacity-80">
            La marketplace n°1 pour vos accessoires, pièces téléphones, moto et voiture au Sénégal.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3 text-primary">Catégories</h3>
          <ul className="space-y-2 text-sm opacity-80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 text-primary">Aide</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Suivre ma commande</li>
            <li>Livraison & retours</li>
            <li>Modes de paiement</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 text-primary">Paiement</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-white/10">Wave</span>
            <span className="px-2 py-1 rounded bg-white/10">Orange Money</span>
            <span className="px-2 py-1 rounded bg-white/10">Carte</span>
            <span className="px-2 py-1 rounded bg-white/10">À la livraison</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Kasuwa — Tous droits réservés
      </div>
    </footer>
  );
}
