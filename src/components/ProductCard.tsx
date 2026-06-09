import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { formatXOF, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group bg-card rounded-md overflow-hidden border border-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 flex flex-col"
    >
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-bold text-foreground">{formatXOF(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatXOF(product.oldPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}
