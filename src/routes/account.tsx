import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Edit2, Mail, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [userProducts, setUserProducts] = useState<any[]>([]);

  useEffect(() => {
    // Charger les produits de l'utilisateur depuis le backend
    const loadProducts = async () => {
      try {
        const response = await productsApi.getProducts();
        console.log('Products response:', response);
        
        // Vérifier si la réponse est un tableau ou un objet avec une propriété products
        const products = Array.isArray(response) ? response : (response?.products || []);
        
        // Filtrer les produits de l'utilisateur connecté
        const myProducts = products.filter((p: any) => p.sellerId === user?.id);
        setUserProducts(myProducts);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };
    
    if (user?.id) {
      loadProducts();
    }
  }, [user?.id]);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleEditProfile = () => {
    navigate({ to: "/account/edit" });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await productsApi.deleteProduct(productId);
        // Recharger les produits
        const response = await productsApi.getProducts();
        
        // Vérifier si la réponse est un tableau ou un objet avec une propriété products
        const products = Array.isArray(response) ? response : (response?.products || []);
        
        // Filtrer les produits de l'utilisateur connecté
        const myProducts = products.filter((p: any) => p.sellerId === user?.id);
        setUserProducts(myProducts);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate({ to: "/edit-product/$productId", params: { productId } });
  };

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'Date inconnue';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mon Compte</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et vos commandes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border shadow-card">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{user?.name || 'Utilisateur'}</h2>
                <p className="text-sm text-muted-foreground mt-1">Membre depuis {joinDate}</p>
              </div>

              <div className="space-y-2 mb-6">
                <button 
                  onClick={handleEditProfile}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-md border border-border text-foreground hover:bg-muted transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>

              {/* Add Product Button */}
              <div className="space-y-2">
                <Link
                  to="/add-product"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-success text-success-foreground hover:bg-success/90 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un produit
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-foreground font-medium mt-1">{user?.name || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-foreground font-medium mt-1">{user?.email || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

            {/* Mes produits */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Mes produits ({userProducts.length})</h3>
              {userProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Vous n'avez pas encore ajouté de produits.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProducts.map((product) => (
                    <div key={product._id} className="border border-border rounded-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground">
                          Pas d'image
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-foreground text-sm mb-1">{product.name}</h4>
                        <p className="text-primary font-bold text-sm mb-2">{product.finalPrice?.toLocaleString() || product.sellerPrice?.toLocaleString()} FCFA</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/search"
                className="px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-center font-medium text-sm"
              >
                Continuer shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
