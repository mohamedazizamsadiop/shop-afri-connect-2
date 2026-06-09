# MarketHub — Plateforme E-Commerce Multi-Vendeurs

Plateforme e-commerce inspirée de Jumia avec support multi-vendeurs, paiements Stripe, système d'escrow et dashboards d'administration.

## 🎯 Fonctionnalités Principales

### Pour les Clients
- 🛍️ Parcourir et rechercher des produits
- 🛒 Panier et commandes
- 💳 Paiement sécurisé via Stripe
- 📦 Suivi des commandes
- 👤 Gestion du profil utilisateur

### Pour les Vendeurs
- 📊 Tableau de bord avec statistiques
- 📈 Charts revenus et commandes
- 🏪 Gestion des produits (CRUD)
- 💰 Gestion du portefeuille (wallet)
- 📋 Historique des commandes
- 💸 Demandes de retrait

### Pour les Administrateurs
- 📊 Tableau de bord global de la plateforme
- 👨‍💼 Gestion des vendeurs (validation, suspension)
- 💵 Suivi des revenus et commissions
- 📋 Gestion des demandes de retrait
- 📊 Ledger financier détaillé
- 🔍 Validation des comptes vendeurs

## 🏗️ Architecture

```
MarketHub/
├── Frontend (React 19 + Vite)
│   ├── routes/
│   │   ├── index.tsx (Accueil)
│   │   ├── account.tsx (Profil utilisateur)
│   │   ├── seller/dashboard.tsx (Tableau de bord vendeur)
│   │   ├── admin/dashboard.tsx (Tableau de bord admin)
│   │   ├── product.$id.tsx (Détail produit)
│   │   ├── cart.tsx (Panier)
│   │   └── ...
│   ├── components/ (Composants réutilisables)
│   ├── context/ (Auth, Cart context)
│   └── styles.css (Tailwind + oklch colors)
│
└── Backend (Node.js + Express)
    ├── src/
    │   ├── models/ (Mongoose schemas)
    │   │   ├── User.js
    │   │   ├── Seller.js
    │   │   ├── Product.js
    │   │   ├── Order.js
    │   │   ├── Wallet.js
    │   │   ├── Withdrawal.js
    │   │   ├── Ledger.js
    │   │   └── Notification.js
    │   ├── routes/ (API endpoints)
    │   ├── middleware/ (Auth, validation)
    │   ├── utils/ (JWT, notifications, Stripe)
    │   └── index.js (Server entry point)
    └── tests/ (Jest + supertest)
```

## 🚀 Démarrage Rapide

### Option 1 : Développement Local (recommandé pour débuter)

**Prérequis:**
- Node.js 18+
- MongoDB local (ou MongoDB Atlas)
- npm ou bun

**Frontend:**
```bash
npm install --legacy-peer-deps
npm start
# Ouvert sur http://localhost:8080/
```

**Backend (nouveau terminal):**
```bash
cd server
npm install --legacy-peer-deps
npm run dev
# Ouvert sur http://localhost:4000/
```

### Option 2 : Développement avec Docker (recommandé pour la cohérence)

```bash
docker-compose up

# Frontend: http://localhost:8080
# Backend: http://localhost:4000
# MongoDB: localhost:27017
```

### Option 3 : Production (voir DEPLOYMENT.md)

```bash
# Frontend → Vercel
# Backend → Render
# Database → MongoDB Atlas
# Storage → Cloudinary (images)
```

## 📋 Tests

**Backend tests (Jest + supertest):**
```bash
cd server
npm test

# Ou avec MongoDB externe
TEST_MONGODB_URI=mongodb://localhost:27017/test npm test
```

**Tests couverts:**
- ✅ Authentication (register/login/refresh)
- ✅ Products CRUD
- ✅ Orders & Payments
- ✅ Stripe webhooks
- ✅ Auto-release escrow
- ✅ Notifications
- ✅ Wallets & Withdrawals

## 📊 Accès aux Tableaux de Bord

### Tableau de Bord Vendeur
```
URL: http://localhost:8080/seller/dashboard

Affichage:
- Revenus mensuels (chart)
- Commandes (chart)
- Répartition par catégorie (pie chart)
- Commandes récentes (table)
- Statistiques clés (revenue, orders, products actifs)
```

### Tableau de Bord Admin
```
URL: http://localhost:8080/admin/dashboard

Affichage:
- Chiffre d'affaires global
- Commission plateforme
- Tendances revenus/commissions
- Statut des vendeurs
- Vendeurs récents
- Validations en attente
```

### Compte Utilisateur
```
URL: http://localhost:8080/account

Affichage:
- Informations de profil
- Historique des commandes
- Statistiques utilisateur
- Actions rapides
```

## 🔧 Configuration

### Fichier .env (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/markethub
PORT=4000
JWT_SECRET=votre-secret-jwt
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
DEFAULT_COMMISSION_PERCENT=15

# Stripe
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email notifications
MAIL_SERVICE=gmail
MAIL_USER=votre-email@gmail.com
MAIL_PASSWORD=app-password-gmail
MAIL_FROM=noreply@markethub.com

# Auto-release
AUTO_RELEASE_DAYS=7
AUTO_RELEASE_ENABLED=true

NODE_ENV=development
```

## 📧 Notifications

Le système envoie automatiquement des emails pour:
- ✉️ Confirmation de commande
- 📦 Commande expédiée
- ✓ Commande livrée
- 💸 Retrait approuvé
- ✔️ Compté vendeur vérifié
- 🆕 Nouvelle commande (vendeur)

**Emails envoyés en dev mode** (affichés dans les logs)

## 🔐 Sécurité

- ✅ Hachage des mots de passe (bcryptjs)
- ✅ JWT avec refresh tokens
- ✅ CORS configuré
- ✅ Validation des inputs
- ✅ Contrôle d'accès (Admin/Seller/Client)
- ✅ Webhooks Stripe vérifiés
- ✅ Ledger immuable pour l'audit

## 📚 Stack Technique

**Frontend:**
- React 19.2.0
- Vite 7.3.1
- Tailwind CSS 4.2.1
- TanStack Router 1.168.0
- lucide-react (icons)
- recharts (dashboards)

**Backend:**
- Node.js 18+
- Express.js 4.18.2
- MongoDB avec Mongoose 7.0.0
- Stripe 12.0.0
- JWT 9.0.0
- nodemailer 6.9.7
- Jest 29.0.0 (tests)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## 📝 Routes API

Voir [Backend API Documentation](./server/API_DOCS.md) pour la liste complète

**Principales endpoints:**

```
# Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

# Products
GET /api/products
GET /api/products/:id
POST /api/products (seller only)
PUT /api/products/:id (seller only)
DELETE /api/products/:id (seller only)

# Orders
POST /api/orders
GET /api/orders
PUT /api/orders/:id/status

# Payments
POST /api/stripe/create-subscription
POST /api/stripe/webhook

# Wallets
GET /api/wallets/me
POST /api/wallets/release
POST /api/wallets/auto-release (admin)

# Notifications
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
DELETE /api/notifications/:id

# Admin
GET /api/admin/ledger
POST /api/admin/validate-seller
```

## 🚀 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions complètes de déploiement sur:
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Créé avec ❤️ pour les entrepreneurs africains.
