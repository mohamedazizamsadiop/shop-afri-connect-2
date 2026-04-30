import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";

export function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/search", search: { q: query.trim() } });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-header text-header-foreground shadow-md">
      {/* Top promo bar */}
      <div className="bg-accent text-accent-foreground text-xs py-1.5 text-center font-medium">
        🚚 Livraison gratuite à Dakar dès 25 000 FCFA — Payez à la livraison disponible
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center font-black text-primary-foreground text-lg">
              K
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">
              KASUWA<span className="text-primary">.</span>
            </span>
          </Link>

          <form onSubmit={onSearch} className="flex-1 max-w-2xl mx-2">
            <div className="relative flex">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher produits, marques..."
                className="flex-1 h-10 px-4 rounded-l-md text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="h-10 px-4 sm:px-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-r-md font-semibold transition-colors flex items-center gap-2"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </form>

          <button className="hidden md:flex items-center gap-1.5 hover:text-primary transition-colors text-sm font-medium">
            <User className="w-5 h-5" />
            <span>Compte</span>
          </button>

          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 hover:text-primary transition-colors text-sm font-medium"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Panier</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 md:static md:ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Categories nav */}
        <nav
          className={`${mobileOpen ? "block" : "hidden"} lg:block border-t border-white/10 py-2`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-1 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-white/10 hover:text-primary transition-colors font-medium"
                  activeProps={{ className: "text-primary" }}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
