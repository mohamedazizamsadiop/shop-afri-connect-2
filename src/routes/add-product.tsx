import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { productsApi } from "@/lib/api";

export const Route = createFileRoute("/add-product")({
  component: AddProductPage,
});

function AddProductPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      // Vérifier la taille
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      setImageFile(file);
      setError(""); // Réinitialiser les erreurs précédentes
      
      // Créer un aperçu de l'image avec URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
    const input = document.getElementById('image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !description || !price || !category) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Le prix doit être un nombre positif");
      return;
    }

    setLoading(true);

    try {
      // Créer un FormData pour l'upload de fichiers
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('sellerPrice', priceNum.toString());
      formData.append('category', category);
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formData.append('images', imageFile);
      }

      // Envoyer à l'API backend
      const response = await productsApi.createProduct(formData);
      
      alert("Produit ajouté avec succès !");
      navigate({ to: "/account" });
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Accessoires téléphone",
    "Pièces téléphone",
    "Moto",
    "Voiture",
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter un produit</h1>
          <p className="text-muted-foreground">Vendez vos propres produits sur la marketplace</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du produit</CardTitle>
            <CardDescription>
              Remplissez les détails de votre produit pour le mettre en vente
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Coque iPhone 15 Pro Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre produit en détail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Ex: 25000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image du produit (optionnel)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  Sélectionnez une image depuis votre appareil (max 5 Mo). Tous les formats d'images sont acceptés
                </p>
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-md border border-border"/>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                      title="Supprimer l'image">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter le produit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/account" })}
              >
                Annuler
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
