import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/account/edit")({
  component: EditAccount,
});

function EditAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "Jean Dupont",
    email: "jean@example.com",
    phone: "+221 78 123 45 67",
    address: "123 Rue de l'Indépendance, Dakar",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on enverrait les données au backend. Pour l'instant on simule.
    alert("Profil mis à jour");
    navigate({ to: "/account" });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" /> Modifier le profil
          </h1>
          <p className="text-sm text-muted-foreground">Mettez à jour vos informations personnelles.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 border border-border shadow-card">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Adresse</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/account" })}
                className="px-4 py-2 rounded-md border border-border text-foreground"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
