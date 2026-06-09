import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Edit2, Mail, MapPin, Phone, Package, Wallet } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  const [user] = useState({
    id: "user_123",
    name: "Jean Dupont",
    email: "jean@example.com",
    phone: "+221 78 123 45 67",
    address: "123 Rue de l'Indépendance, Dakar",
    joinDate: "Janvier 2024",
    totalOrders: 5,
    totalSpent: "145 000 FCFA",
  });

  const orders = [
    { id: "ORD001", date: "2024-01-15", total: "45 000 FCFA", status: "Livré" },
    { id: "ORD002", date: "2024-01-10", total: "32 000 FCFA", status: "En cours" },
    { id: "ORD003", date: "2024-01-05", total: "28 000 FCFA", status: "Livré" },
  ];

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
                  <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">Membre depuis {user.joinDate}</p>
              </div>

              <div className="space-y-2 mb-6">
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md border border-border text-foreground hover:bg-muted transition-colors font-medium">
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                    <p className="font-bold text-foreground">{user.totalOrders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Wallet className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total dépensé</p>
                    <p className="font-bold text-foreground">{user.totalSpent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-foreground font-medium mt-1">{user.name}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-foreground font-medium mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </label>
                    <p className="text-foreground font-medium mt-1">{user.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </label>
                  <p className="text-foreground font-medium mt-1">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Commandes récentes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">#</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Montant</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Statut</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-3 font-medium text-foreground">{order.id}</td>
                        <td className="py-3 px-3 text-muted-foreground">{order.date}</td>
                        <td className="py-3 px-3 font-medium text-foreground">{order.total}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Livré" 
                              ? "bg-success/20 text-success" 
                              : "bg-accent/20 text-accent"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button className="text-primary hover:underline font-medium text-xs">
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/search"
                className="px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-center font-medium text-sm"
              >
                Continuer shopping
              </Link>
              <button className="px-4 py-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm">
                Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
