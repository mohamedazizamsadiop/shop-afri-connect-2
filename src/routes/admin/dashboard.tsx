import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Store, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const adminStats = {
    totalRevenue: "5 245 000 FCFA",
    platformCommission: "786 750 FCFA",
    totalSellers: 127,
    totalOrders: 342,
    pendingValidations: 8,
  };

  const platformRevenueData = [
    { month: "Jan", revenue: 420000, commission: 63000 },
    { month: "Fév", revenue: 580000, commission: 87000 },
    { month: "Mar", revenue: 520000, commission: 78000 },
    { month: "Avr", revenue: 750000, commission: 112500 },
    { month: "Mai", revenue: 920000, commission: 138000 },
    { month: "Jun", revenue: 1055000, commission: 158250 },
  ];

  const sellerMetrics = [
    { name: "Actifs", value: 98 },
    { name: "En attente", value: 12 },
    { name: "Suspendus", value: 17 },
  ];

  const recentSellers = [
    { id: "SELL001", name: "Tech Shop SN", status: "Actif", revenue: "320 000 FCFA", date: "2024-06-08" },
    { id: "SELL002", name: "Moto Pièces", status: "En attente", revenue: "0 FCFA", date: "2024-06-07" },
    { id: "SELL003", name: "Auto Parts", status: "Actif", revenue: "285 000 FCFA", date: "2024-06-06" },
  ];

  const pendingValidations = [
    { id: "VAL001", seller: "New Shop", reason: "Vérification identité", date: "2024-06-09" },
    { id: "VAL002", seller: "Électronique+", reason: "Vérification documents", date: "2024-06-08" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Tableau de Bord Admin</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <p className="text-xl font-bold text-foreground mt-1">{adminStats.totalRevenue}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-xl font-bold text-foreground mt-1">{adminStats.platformCommission}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-success opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendeurs</p>
                <p className="text-xl font-bold text-foreground mt-1">{adminStats.totalSellers}</p>
              </div>
              <Store className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-xl font-bold text-foreground mt-1">{adminStats.totalOrders}</p>
              </div>
              <Users className="w-10 h-10 text-accent opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-destructive shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive font-semibold">À valider</p>
                <p className="text-xl font-bold text-destructive mt-1">{adminStats.pendingValidations}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-destructive opacity-20" />
            </div>
          </div>
        </div>

        {/* Revenue & Commission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Chiffre d'affaires et Commission</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-primary)" />
                <Bar dataKey="commission" fill="var(--color-success)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Vendeurs par statut</h2>
            <div className="space-y-4">
              {sellerMetrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{metric.name}</p>
                    <p className="text-sm font-bold text-primary">{metric.value}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${(metric.value / 127) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sellers */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Vendeurs récents</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Nom</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Revenu</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSellers.map((seller) => (
                    <tr key={seller.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="py-3 px-3 font-medium text-foreground text-xs">{seller.id}</td>
                      <td className="py-3 px-3 text-muted-foreground">{seller.name}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{seller.revenue}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          seller.status === "Actif" 
                            ? "bg-success/20 text-success" 
                            : seller.status === "En attente"
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/20 text-destructive"
                        }`}>
                          {seller.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Validations */}
          <div className="bg-card rounded-lg p-6 border border-destructive shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              En attente de validation ({pendingValidations.length})
            </h2>
            <div className="space-y-3">
              {pendingValidations.map((validation) => (
                <div key={validation.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-foreground text-sm">{validation.seller}</p>
                    <span className="text-xs text-muted-foreground">{validation.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{validation.reason}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 py-1 text-xs bg-success/20 text-success rounded hover:bg-success/30 transition font-medium">
                      Valider
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition font-medium">
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
