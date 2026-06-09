import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, Wallet, DollarSign } from "lucide-react";

export const Route = createFileRoute("/seller/dashboard")({
  component: SellerDashboard,
});

function SellerDashboard() {
  const dashboardStats = {
    totalRevenue: "1 245 000 FCFA",
    totalOrders: 42,
    activeProducts: 28,
    pendingBalance: "325 000 FCFA",
  };

  const revenueData = [
    { month: "Jan", revenue: 120000, orders: 12 },
    { month: "Fév", revenue: 180000, orders: 18 },
    { month: "Mar", revenue: 150000, orders: 15 },
    { month: "Avr", revenue: 220000, orders: 22 },
    { month: "Mai", revenue: 280000, orders: 28 },
    { month: "Jun", revenue: 295000, orders: 29 },
  ];

  const categoryData = [
    { name: "Téléphones", value: 35 },
    { name: "Accessoires", value: 25 },
    { name: "Pièces auto", value: 20 },
    { name: "Pièces moto", value: 20 },
  ];

  const recentOrders = [
    { id: "ORD001", customer: "Ahmed Ndiaye", amount: "45 000 FCFA", date: "2024-06-09", status: "Livré" },
    { id: "ORD002", customer: "Fatou Sarr", amount: "32 000 FCFA", date: "2024-06-08", status: "En cours" },
    { id: "ORD003", customer: "Moussa Diallo", amount: "28 000 FCFA", date: "2024-06-07", status: "Livré" },
  ];

  const COLORS = ["#ff8c00", "#4a90e2", "#7ed321", "#f5a623"];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Tableau de Bord Vendeur</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold text-foreground mt-1">{dashboardStats.totalRevenue}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold text-foreground mt-1">{dashboardStats.totalOrders}</p>
              </div>
              <Package className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits actifs</p>
                <p className="text-2xl font-bold text-foreground mt-1">{dashboardStats.activeProducts}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-success opacity-20" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solde en attente</p>
                <p className="text-2xl font-bold text-foreground mt-1">{dashboardStats.pendingBalance}</p>
              </div>
              <Wallet className="w-10 h-10 text-accent opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Revenus par mois</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Produits par catégorie</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={{ fill: "var(--color-foreground)" }} outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-card mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Commandes par mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
              <Legend />
              <Bar dataKey="orders" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Commandes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Montant</th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="py-3 px-3 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-3 text-muted-foreground">{order.customer}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{order.amount}</td>
                    <td className="py-3 px-3 text-muted-foreground">{order.date}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Livré" ? "bg-success/20 text-success" : "bg-accent/20 text-accent"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
