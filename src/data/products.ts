import accessoiresImg from "@/assets/cat-accessoires.jpg";
import piecesTelImg from "@/assets/cat-pieces-tel.jpg";
import motoImg from "@/assets/cat-moto.jpg";
import voitureImg from "@/assets/cat-voiture.jpg";

export type CategorySlug = "accessoires" | "pieces-telephones" | "moto" | "voiture";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  category: CategorySlug;
  image: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "accessoires", name: "Accessoires Téléphones", tagline: "Coques, chargeurs, écouteurs", image: accessoiresImg },
  { slug: "pieces-telephones", name: "Pièces Téléphones", tagline: "Écrans, batteries, composants", image: piecesTelImg },
  { slug: "moto", name: "Pièces Moto", tagline: "Moteur, freins, accessoires", image: motoImg },
  { slug: "voiture", name: "Pièces Voiture", tagline: "Moteur, carrosserie, électronique", image: voitureImg },
];

export const formatXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

const make = (
  id: string,
  name: string,
  brand: string,
  price: number,
  oldPrice: number | undefined,
  category: CategorySlug,
  image: string,
  description: string,
  rating = 4.3,
  reviews = 42,
  stock = 25,
): Product => ({ id, name, brand, price, oldPrice, rating, reviews, stock, category, image, description });

export const products: Product[] = [
  // Accessoires
  make("a1", "Coque silicone iPhone 14 Pro", "TechPro", 4500, 7000, "accessoires", accessoiresImg, "Coque protectrice antichoc en silicone souple, finition mate, compatible recharge sans fil.", 4.6, 128),
  make("a2", "Écouteurs Bluetooth sans fil", "SoundMax", 12500, 18000, "accessoires", accessoiresImg, "Écouteurs TWS avec réduction de bruit, autonomie 24h avec boîtier de charge.", 4.4, 89),
  make("a3", "Chargeur rapide USB-C 25W", "PowerOne", 6500, 9000, "accessoires", accessoiresImg, "Chargeur rapide compatible Samsung, iPhone, Xiaomi. Câble USB-C inclus.", 4.5, 215),
  make("a4", "Câble Lightning 2m tressé", "TechPro", 3000, undefined, "accessoires", accessoiresImg, "Câble robuste tressé en nylon, charge rapide et synchro.", 4.2, 67),
  make("a5", "Support voiture magnétique", "AutoFix", 5500, 8000, "accessoires", accessoiresImg, "Support smartphone magnétique pour grille d'aération, rotation 360°.", 4.3, 54),
  make("a6", "Powerbank 20000 mAh", "PowerOne", 15000, 22000, "accessoires", accessoiresImg, "Batterie externe haute capacité, 2 ports USB + USB-C, charge rapide.", 4.7, 312),

  // Pièces téléphones
  make("p1", "Écran iPhone 12 OLED original", "Apple", 45000, 60000, "pieces-telephones", piecesTelImg, "Écran de remplacement OLED qualité originale avec outils d'installation.", 4.5, 76, 12),
  make("p2", "Batterie Samsung Galaxy S21", "Samsung", 18000, 25000, "pieces-telephones", piecesTelImg, "Batterie d'origine 4000 mAh, garantie 6 mois.", 4.6, 102),
  make("p3", "Écran Tecno Camon 19", "Tecno", 22000, 30000, "pieces-telephones", piecesTelImg, "Écran complet LCD avec vitre tactile pour Tecno Camon 19.", 4.2, 45),
  make("p4", "Connecteur de charge Type-C", "Generic", 3500, 5000, "pieces-telephones", piecesTelImg, "Module connecteur de charge USB-C universel, kit de réparation.", 4.0, 38),
  make("p5", "Vitre arrière iPhone 13", "Apple", 12000, 16000, "pieces-telephones", piecesTelImg, "Vitre arrière de remplacement avec adhésif pré-appliqué.", 4.4, 51),
  make("p6", "Carte mère Infinix Hot 12", "Infinix", 35000, 45000, "pieces-telephones", piecesTelImg, "Carte mère testée pour Infinix Hot 12, 128 Go.", 4.1, 22, 8),

  // Moto
  make("m1", "Plaquettes de frein avant", "Brembo", 8500, 12000, "moto", motoImg, "Plaquettes de frein haute performance, compatibles motos 125-250cc.", 4.7, 156),
  make("m2", "Casque intégral homologué", "MotoX", 35000, 50000, "moto", motoImg, "Casque intégral avec visière anti-rayures, certifié ECE 22.06.", 4.8, 234),
  make("m3", "Filtre à huile moto", "K&N", 4500, 6000, "moto", motoImg, "Filtre à huile haute filtration, longue durée.", 4.5, 88),
  make("m4", "Disque de frein 240mm", "Brembo", 18000, 25000, "moto", motoImg, "Disque de frein flottant en acier inoxydable.", 4.6, 67),
  make("m5", "Chaîne de transmission 428H", "DID", 12000, 16000, "moto", motoImg, "Chaîne renforcée 428H, 120 maillons, joints toriques.", 4.4, 92),
  make("m6", "Bougie d'allumage NGK", "NGK", 2500, 3500, "moto", motoImg, "Bougie iridium longue durée, performance optimale.", 4.7, 178),

  // Voiture
  make("v1", "Batterie 12V 70Ah", "Bosch", 65000, 85000, "voiture", voitureImg, "Batterie sans entretien, démarrage puissant, garantie 2 ans.", 4.6, 145, 18),
  make("v2", "Plaquettes de frein avant", "Bosch", 22000, 30000, "voiture", voitureImg, "Plaquettes de frein céramique, faible bruit, longue durée.", 4.7, 203),
  make("v3", "Phare avant LED", "Hella", 45000, 60000, "voiture", voitureImg, "Phare LED haute luminosité, compatible Toyota / Hyundai.", 4.5, 87),
  make("v4", "Filtre à huile premium", "Mann", 4500, 6500, "voiture", voitureImg, "Filtre à huile haute qualité, compatible la plupart des berlines.", 4.4, 112),
  make("v5", "Amortisseurs avant (paire)", "Monroe", 55000, 75000, "voiture", voitureImg, "Paire d'amortisseurs avant, montage facile, confort optimal.", 4.6, 64),
  make("v6", "Capteur ABS avant", "Bosch", 18000, 24000, "voiture", voitureImg, "Capteur ABS de remplacement, plug & play.", 4.3, 41),
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);
export const getCategory = (slug: CategorySlug) => categories.find((c) => c.slug === slug);
