# Guide de Déploiement Railway - MarketHub

## 🚀 Pourquoi Railway?

Railway est idéal pour les mono-repos car:
- **Un seul projet** pour frontend + backend + base de données
- **Déploiement automatique** depuis GitHub
- **MongoDB inclus** (pas besoin d'Atlas)
- **Variables d'environnement partagées** entre services
- **Plan gratuit** ($5/mois de crédit)

---

## 📋 Prérequis

1. Compte Railway: https://railway.app
2. Compte GitHub avec votre projet
3. CLI Railway (optionnel): `npm install -g @railway/cli`

---

## 🎯 Étape 1: Initialiser le projet Railway

### Option A: Via l'interface web

1. Connectez-vous sur https://railway.app
2. Cliquez sur **"New Project"**
3. Cliquez sur **"Deploy from GitHub repo"**
4. Sélectionnez votre repo `shop-afri-connect 2`
5. Railway détectera automatiquement les services

### Option B: Via CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Ajouter les services
railway add --service backend
railway add --service frontend
railway add --service mongodb
```

---

## 🎯 Étape 2: Configurer les services

### Service Backend

**Configuration:**
- **Root directory**: `server`
- **Build command**: `npm install --legacy-peer-deps`
- **Start command**: `npm start`
- **Port**: 4000

**Variables d'environnement:**
```
MONGODB_URI=${{MONGODB_CONNECTION_URI}}
PORT=4000
JWT_SECRET=votre-clé-secrète-forte
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
DEFAULT_COMMISSION_PERCENT=15
STRIPE_SECRET=votre-clé-stripe
STRIPE_WEBHOOK_SECRET=votre-webhook-secret
NODE_ENV=production
AUTO_RELEASE_DAYS=7
CLOUDINARY_CLOUD_NAME=rhgdubzg
CLOUDINARY_API_KEY=632123942936974
CLOUDINARY_API_SECRET=B1P7b9TH5-GUHHT3cMu88BYdaOY
```

### Service Frontend

**Configuration:**
- **Root directory**: `.` (racine du projet)
- **Build command**: `npm install --legacy-peer-deps && npm run build`
- **Start command**: `npm run preview` ou utiliser `serve -s dist -l 8080`
- **Port**: 8080

**Variables d'environnement:**
```
VITE_API_URL=${{BACKEND_URL}}
NODE_ENV=production
```

### Service MongoDB

**Configuration:**
- **Type**: MongoDB
- **Version**: 7
- **Database name**: markethub

---

## 🎯 Étape 3: Connecter les services

### Via l'interface web

1. Allez dans votre projet Railway
2. Cliquez sur le service **Backend**
3. Onglet **Variables**
4. Ajoutez la variable:
   - Nom: `MONGODB_URI`
   - Valeur: `${{MONGODB_CONNECTION_URI}}` (référence au service MongoDB)

5. Cliquez sur le service **Frontend**
6. Onglet **Variables**
7. Ajoutez la variable:
   - Nom: `VITE_API_URL`
   - Valeur: `${{BACKEND_URL}}` (référence au service Backend)

### Via CLI

```bash
# Connecter MongoDB au backend
railway variables set MONGODB_URI=${{MONGODB_CONNECTION_URI}} --service backend

# Connecter Backend au frontend
railway variables set VITE_API_URL=${{BACKEND_URL}} --service frontend
```

---

## 🎯 Étape 4: Déployer

### Déploiement automatique

Une fois connecté à GitHub, chaque push sur la branche principale déclenche automatiquement un déploiement.

### Déploiement manuel

```bash
# Via CLI
railway up

# Via l'interface web
# Cliquez sur "Deploy" dans votre projet
```

---

## 🔐 Sécurité: Générer les secrets

### JWT Secret

```bash
# Générer un secret fort
openssl rand -base64 32
```

### Stripe Keys

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez `STRIPE_SECRET` (commence par `sk_live_`)
3. Configurez le webhook pour obtenir `STRIPE_WEBHOOK_SECRET`

### Cloudinary (déjà configuré)

Les clés Cloudinary sont déjà dans le `.env`:
- `CLOUDINARY_CLOUD_NAME`: rhgdubzg
- `CLOUDINARY_API_KEY`: 632123942936974
- `CLOUDINARY_API_SECRET`: B1P7b9TH5-GUHHT3cMu88BYdaOY

---

## 🌐 Obtenir les URLs de production

Une fois déployé:

1. **Backend URL**: Cliquez sur le service Backend → "Generate Domain"
2. **Frontend URL**: Cliquez sur le service Frontend → "Generate Domain"
3. **MongoDB URL**: Automatiquement généré par Railway

Exemple de URLs:
- Backend: `https://markethub-backend.up.railway.app`
- Frontend: `https://markethub-frontend.up.railway.app`

---

## 📊 Monitoring

### Logs

```bash
# Voir les logs en temps réel
railway logs

# Logs d'un service spécifique
railway logs --service backend
```

### Métriques

- Allez sur votre projet Railway
- Cliquez sur "Metrics"
- Consultez CPU, Mémoire, Réseau

---

## 🔄 Mise à jour de l'auth (JSON file → MongoDB)

**Important:** J'ai temporairement modifié l'auth pour utiliser des fichiers JSON au lieu de MongoDB. Pour la production sur Railway avec MongoDB, vous devez restaurer l'utilisation de MongoDB.

### Restaurer MongoDB dans auth.js

Dans `server/src/routes/auth.js`, remplacez les fonctions JSON par les fonctions MongoDB originales:

```javascript
// Au lieu de:
const users = readUsers();
const user = users.find(u => u.email === email);

// Utilisez:
const user = await User.findOne({ email });
```

**Fichier à restaurer:** J'ai sauvegardé les modifications dans `server/src/routes/auth.js`. Vous pouvez:
1. Revenir à la version originale via Git
2. Ou je peux vous aider à restaurer le code MongoDB

---

## 🚨 Troubleshooting

### Build échoue

```bash
# Vérifier les logs
railway logs

# Redéployer
railway up
```

### MongoDB connection error

- Vérifiez que la variable `MONGODB_URI` est correctement configurée
- Assurez-vous que le service MongoDB est démarré

### Frontend ne peut pas contacter le backend

- Vérifiez que `VITE_API_URL` pointe vers l'URL du backend Railway
- Vérifiez les CORS dans le backend

---

## 💰 Coûts

- **Plan gratuit**: $5/mois de crédit
- **Backend**: ~$5/mois (si usage modéré)
- **Frontend**: ~$5/mois (si usage modéré)
- **MongoDB**: Inclus dans le plan gratuit

**Total estimé**: $0-10/mois pour un usage de test

---

## ✅ Checklist avant déploiement

- [ ] Compte Railway créé
- [ ] Repo GitHub connecté
- [ ] Services configurés (Backend, Frontend, MongoDB)
- [ ] Variables d'environnement définies
- [ ] JWT Secret généré
- [ ] Stripe keys configurées (si nécessaire)
- [ ] Auth restaurée pour MongoDB
- [ ] Premier déploiement réussi
- [ ] Frontend accessible via URL Railway
- [ ] Backend accessible via URL Railway
- [ ] Test inscription/connexion en production

---

## 📚 Ressources utiles

- Railway Docs: https://docs.railway.app
- Railway CLI: https://github.com/railwayapp/cli
- MongoDB sur Railway: https://docs.railway.app/reference/databases/mongodb

---

## 🎉 Déploiement terminé!

Votre MarketHub est maintenant en production sur Railway. Vous pouvez:
- Accéder au frontend via l'URL Railway
- Gérer les services via le dashboard Railway
- Monitorer les logs et métriques
- Mettre à jour automatiquement via GitHub
