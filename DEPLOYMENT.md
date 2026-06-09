# Guide de Déploiement - MarketHub

## 🚀 Déploiement Frontend (Vercel)

### Prérequis
- Compte Vercel (vercel.com)
- Projet GitHub

### Étapes

1. **Connecter GitHub à Vercel**
   ```bash
   # Aller sur vercel.com
   # Cliquer sur "New Project" et importer le repo GitHub
   ```

2. **Configurer les variables d'environnement**
   - Settings → Environment Variables
   ```
   VITE_API_URL=https://api.markethub.com
   ```

3. **Configuration du build**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Déploiement automatique**
   - Chaque push sur `main` déclenche un déploiement
   - Prévisualisations automatiques pour les PRs

---

## 🚀 Déploiement Backend (Render)

### Prérequis
- Compte Render (render.com)
- Projet GitHub
- Compte MongoDB Atlas

### Étapes

1. **Créer une base de données MongoDB Atlas**
   ```bash
   # Aller sur mongodb.com/cloud
   # Créer un cluster gratuit (M0)
   # Créer un utilisateur DB
   # Récupérer la connection string
   ```

2. **Créer un Web Service sur Render**
   ```
   - Cliquer sur "New +"
   - Sélectionner "Web Service"
   - Connecter le repo GitHub
   - Sélectionner la branche `main`
   ```

3. **Configurer le Web Service**
   ```
   Name: markethub-api
   Environment: Node
   Build command: npm install --legacy-peer-deps
   Start command: npm start
   Plan: Free (ou Starter)
   ```

4. **Ajouter les variables d'environnement**
   ```
   Settings → Environment
   
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/markethub
   PORT=4000
   JWT_SECRET=<strong-secret-key>
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   DEFAULT_COMMISSION_PERCENT=15
   STRIPE_SECRET=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   MAIL_SERVICE=gmail
   MAIL_USER=your-email@gmail.com
   MAIL_PASSWORD=app-specific-password
   NODE_ENV=production
   AUTO_RELEASE_DAYS=7
   ```

5. **Déploiement automatique**
   - Chaque push sur `main` déclenche un déploiement
   - Webhooks Git configurés automatiquement

---

## 🐳 Déploiement avec Docker

### Option 1 : Développement local

```bash
# Copier les variables d'environnement
cp server/.env.example server/.env

# Lancer l'application
docker-compose up

# L'app sera disponible à:
# Frontend: http://localhost:8080
# Backend: http://localhost:4000
# MongoDB: localhost:27017
```

### Option 2 : Production

```bash
# Build les images
docker-compose -f docker-compose.yml build

# Lancer en production
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

---

## 🔐 Configuration Stripe

### Webhooks
```
Endpoint URL: https://api.markethub.com/api/stripe/webhook

Événements à écouter:
- checkout.session.completed
- payment_intent.succeeded
- invoice.payment_succeeded
```

### Clés API
```
Obtenir depuis: https://dashboard.stripe.com/apikeys

STRIPE_SECRET: sk_live_...
STRIPE_WEBHOOK_SECRET: whsec_...
```

---

## 📧 Configuration Email (Gmail)

### Créer un App Password
1. Google Account → Security
2. 2-Step Verification → Activer
3. App passwords → Générer un password pour "Mail"
4. Utiliser ce password dans `MAIL_PASSWORD`

```
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=app-password-here
MAIL_FROM=noreply@markethub.com
```

---

## 🧪 Tests CI/CD

### Tests locaux avant push
```bash
cd server
npm test

cd ..
npm run build
```

### Monitoring CI/CD
- Aller sur GitHub → Actions
- Voir le statut des pipelines
- Consulter les logs en cas d'erreur

---

## 📊 Monitoring

### Render Logs
```bash
# Voir les logs en direct
- Dashboard Render → Logs
- Filtrer par date/niveau
```

### MongoDB Logs
```bash
# Voir les stats MongoDB Atlas
- MongoDB Atlas → Monitoring
- Consulter les metrics de performance
```

### Vercel Analytics
```bash
# Voir les métriques frontend
- Dashboard Vercel → Analytics
- Core Web Vitals
- Deployments
```

---

## 🚨 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier MongoDB
docker-compose logs mongodb

# Reconstruire
docker-compose up --build
```

### Frontend build error
```bash
# Nettoyer le cache
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

### Stripe webhook error
```bash
# Vérifier l'endpoint URL
# Vérifier le secret dans .env
# Consulter les logs Stripe webhook
```

---

## 📝 Secrets à générer

Avant le premier déploiement, générer:

```bash
# JWT Secret (openssl sur macOS/Linux)
openssl rand -base64 32

# Ou générer manuellement dans le .env
JWT_SECRET=votre-clé-secrète-forte

# Stripe keys
# https://dashboard.stripe.com/apikeys

# Gmail app password
# https://myaccount.google.com/apppasswords
```

---

## 🔄 Auto-release Configuration

L'auto-release des paiements est configuré pour:
- Attendre 7 jours après la livraison
- Passer automatiquement du solde "en attente" à "disponible"
- Créer les entrées Ledger automatiquement
- Cron: Endpoint `/api/wallets/auto-release` (à appeler via scheduler externe)

```bash
# Test local
curl -X POST http://localhost:4000/api/wallets/auto-release
```

---

✅ Déploiement complet! Votre MarketHub est maintenant en production.
