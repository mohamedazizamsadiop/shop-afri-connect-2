# MarketHub API Documentation

## 🔐 Authentication

Tous les endpoints (sauf auth) requièrent un Bearer token JWT dans l'header:
```
Authorization: Bearer <access_token>
```

### POST /api/auth/register
Créer un nouveau compte utilisateur

**Request:**
```json
{
  "name": "Ahmed Ndiaye",
  "email": "ahmed@example.com",
  "password": "SecurePassword123",
  "role": "client" // ou "seller"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "Ahmed Ndiaye",
    "email": "ahmed@example.com",
    "role": "client"
  }
}
```

---

### POST /api/auth/login
Se connecter et obtenir les tokens

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Ahmed Ndiaye",
    "email": "ahmed@example.com",
    "role": "client"
  }
}
```

---

### POST /api/auth/refresh
Obtenir un nouveau access token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /api/auth/logout
Se déconnecter

**Request:** (Body vide)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📦 Produits

### GET /api/products
Lister tous les produits

**Query parameters:**
- `limit` (default: 100) - Nombre de produits par page
- `page` (default: 1) - Numéro de page
- `category` - Filtrer par catégorie
- `search` - Rechercher par nom

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Samsung Galaxy S24",
    "description": "Flagship smartphone",
    "sellerPrice": 150000,
    "finalPrice": 172500,
    "commission": 15,
    "stock": 10,
    "category": "phones",
    "images": [],
    "sellerId": "...",
    "createdAt": "2024-06-09T10:00:00Z"
  }
]
```

---

### GET /api/products/:id
Récupérer les détails d'un produit

**Response:**
```json
{
  "_id": "...",
  "name": "Samsung Galaxy S24",
  "description": "Flagship smartphone",
  "sellerPrice": 150000,
  "finalPrice": 172500,
  "commission": 15,
  "stock": 10,
  "category": "phones",
  "sellerId": "...",
  "seller": {
    "_id": "...",
    "shopName": "Tech Shop SN"
  }
}
```

---

### POST /api/products
Créer un nouveau produit **(Vendeur uniquement)**

**Request:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone model",
  "sellerPrice": 200000,
  "commission": 15,
  "stock": 20,
  "category": "phones",
  "images": ["url1", "url2"]
}
```

**Response:** (201 Created)
```json
{
  "_id": "...",
  "name": "iPhone 15 Pro",
  "sellerPrice": 200000,
  "finalPrice": 230000,
  "commission": 15,
  "sellerId": "..."
}
```

---

### PUT /api/products/:id
Modifier un produit **(Vendeur, propriétaire uniquement)**

**Request:**
```json
{
  "name": "iPhone 15 Pro Max",
  "stock": 15,
  "sellerPrice": 220000
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "iPhone 15 Pro Max",
  "finalPrice": 253000,
  "stock": 15,
  "updatedAt": "2024-06-09T11:00:00Z"
}
```

---

### DELETE /api/products/:id
Supprimer un produit **(Vendeur, propriétaire uniquement)**

**Response:** (200 OK)
```json
{
  "message": "Product deleted"
}
```

---

## 🛒 Commandes

### POST /api/orders
Créer une nouvelle commande

**Request:**
```json
{
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "price": 172500
    }
  ]
}
```

**Response:** (201 Created)
```json
{
  "_id": "...",
  "customerId": "...",
  "products": [...],
  "totalAmount": 345000,
  "status": "created",
  "paymentIntentId": "pi_1JX2Q3...",
  "createdAt": "2024-06-09T10:00:00Z"
}
```

---

### GET /api/orders
Récupérer les commandes de l'utilisateur

**Response:**
```json
[
  {
    "_id": "...",
    "totalAmount": 345000,
    "status": "paid",
    "products": [...],
    "createdAt": "2024-06-09T10:00:00Z",
    "deliveredAt": null
  }
]
```

---

### PUT /api/orders/:id/status
Mettre à jour le statut d'une commande **(Vendeur)**

**Request:**
```json
{
  "status": "shipped" // ou "delivered", "completed"
}
```

**Response:**
```json
{
  "_id": "...",
  "status": "shipped",
  "deliveredAt": null,
  "updatedAt": "2024-06-09T11:00:00Z"
}
```

---

## 💳 Paiements Stripe

### POST /api/stripe/create-subscription
Créer une session de subscription vendeur **(Vendeur)**

**Request:**
```json
{
  "plan": "pro", // "basic", "pro", "enterprise"
  "successUrl": "https://markethub.com/seller/onboarding/success",
  "cancelUrl": "https://markethub.com/seller/onboarding/cancel"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

### POST /api/stripe/webhook
Webhook Stripe (à configurer dans Stripe Dashboard)

**Événements gérés:**
- `checkout.session.completed` - Sauvegarde subscription vendeur
- `payment_intent.succeeded` - Marque commande payée, crée ledger entries

---

## 💰 Portefeuille (Wallet)

### GET /api/wallets/me
Récupérer le portefeuille du vendeur **(Vendeur)**

**Response:**
```json
{
  "_id": "...",
  "sellerId": "...",
  "availableBalance": 500000,
  "pendingBalance": 125000,
  "total": 625000,
  "createdAt": "2024-06-01T10:00:00Z"
}
```

---

### POST /api/wallets/release
Transférer manuellement les fonds en attente **(Admin)**

**Request:**
```json
{
  "sellerId": "...",
  "amount": 50000
}
```

**Response:**
```json
{
  "message": "Funds released",
  "wallet": {...}
}
```

---

### POST /api/wallets/auto-release
Auto-relâche les fonds après 7 jours de livraison **(Admin/Cron)**

**Response:**
```json
{
  "message": "Auto-release completed",
  "releasedCount": 5,
  "totalAmount": 250000
}
```

---

## 📤 Retraits (Withdrawals)

### POST /api/withdrawals/request
Demander un retrait **(Vendeur)**

**Request:**
```json
{
  "amount": 100000,
  "method": "bank_transfer" // ou "mobile_money"
}
```

**Response:** (201 Created)
```json
{
  "_id": "...",
  "sellerId": "...",
  "amount": 100000,
  "status": "pending",
  "method": "bank_transfer",
  "createdAt": "2024-06-09T10:00:00Z"
}
```

---

### GET /api/withdrawals
Lister les demandes de retrait **(Admin)**

**Response:**
```json
[
  {
    "_id": "...",
    "sellerId": "...",
    "seller": {
      "name": "Ahmed",
      "shopName": "Tech Shop"
    },
    "amount": 100000,
    "status": "pending",
    "createdAt": "2024-06-09T10:00:00Z"
  }
]
```

---

### POST /api/withdrawals/:id/approve
Approuver une demande de retrait **(Admin)**

**Request:** (Body vide)

**Response:**
```json
{
  "_id": "...",
  "status": "approved",
  "approvedAt": "2024-06-09T11:00:00Z"
}
```

---

### POST /api/withdrawals/:id/reject
Rejeter une demande de retrait **(Admin)**

**Request:** (Body vide)

**Response:**
```json
{
  "_id": "...",
  "status": "rejected",
  "rejectedAt": "2024-06-09T11:00:00Z"
}
```

---

## 📧 Notifications

### GET /api/notifications
Récupérer les notifications de l'utilisateur

**Query parameters:**
- `limit` (default: 50) - Nombre de notifications

**Response:**
```json
{
  "count": 5,
  "unread": 2,
  "notifications": [
    {
      "_id": "...",
      "type": "order_confirmed",
      "title": "Commande confirmée",
      "message": "Votre commande a été confirmée",
      "read": false,
      "createdAt": "2024-06-09T10:00:00Z"
    }
  ]
}
```

---

### PUT /api/notifications/:id/read
Marquer une notification comme lue

**Response:**
```json
{
  "_id": "...",
  "read": true,
  "readAt": "2024-06-09T11:00:00Z"
}
```

---

### PUT /api/notifications/read-all
Marquer toutes les notifications comme lues

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

---

### DELETE /api/notifications/:id
Supprimer une notification

**Response:**
```json
{
  "message": "Notification deleted"
}
```

---

## 👨‍💼 Admin

### POST /api/admin/validate-seller
Valider ou suspendre un vendeur **(Admin uniquement)**

**Request:**
```json
{
  "sellerId": "...",
  "verified": true // ou false pour suspendre
}
```

**Response:**
```json
{
  "_id": "...",
  "verified": true,
  "updatedAt": "2024-06-09T11:00:00Z"
}
```

---

### GET /api/admin/ledger
Récupérer les entrées ledger financières **(Admin)**

**Query parameters:**
- `startDate` - Format: YYYY-MM-DD
- `endDate` - Format: YYYY-MM-DD
- `type` - "split", "commission", "release", "payout"
- `sellerId` - Filtrer par vendeur
- `page` (default: 1)
- `limit` (default: 50)

**Response:**
```json
{
  "total": 152,
  "page": 1,
  "limit": 50,
  "ledger": [
    {
      "_id": "...",
      "type": "split",
      "orderId": "...",
      "sellerId": "...",
      "amount": 172500,
      "commission": 25875,
      "platformFee": 258,
      "description": "Commande ORD001 - Split",
      "createdAt": "2024-06-09T10:00:00Z"
    }
  ]
}
```

---

## 🔄 Flux de Paiement Complet

1. **Client crée une commande**
   - POST /api/orders → `status: created`, `paymentIntentId`

2. **Frontend effectue le paiement Stripe**
   - (Intégration Stripe Elements)

3. **Webhook Stripe déclenche**
   - `payment_intent.succeeded` → Ordre marqué `paid`, Ledger créé

4. **Fonds en attente**
   - Wallet.pendingBalance augmente

5. **Auto-release après 7 jours**
   - POST /api/wallets/auto-release → pendingBalance → availableBalance

6. **Vendeur demande retrait**
   - POST /api/withdrawals/request → `status: pending`

7. **Admin approuve**
   - POST /api/withdrawals/:id/approve → availableBalance réduit

8. **Paiement effectué**
   - Status: "paid", Ledger "payout" créé

---

## ❌ Codes d'Erreur

| Code | Signification |
|------|---------------|
| 400 | Requête invalide |
| 401 | Non authentifié (token manquant/invalide) |
| 403 | Non autorisé (rôle insuffisant) |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: email déjà utilisé) |
| 500 | Erreur serveur |

**Exemple d'erreur:**
```json
{
  "error": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE"
}
```

---

## 🧪 Tester l'API

### Avec cURL
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get products
curl http://localhost:4000/api/products

# Get user orders (avec token)
curl -H "Authorization: Bearer <token>" \
  http://localhost:4000/api/orders
```

### Avec Postman
1. Importer les collections depuis le repo
2. Configurer les variables: `BASE_URL`, `TOKEN`
3. Exécuter les requests

---

✅ Documentation complète de l'API MarketHub
