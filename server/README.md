# MarketHub — Backend (Express + MongoDB)

Démarrage rapide du backend local

Prérequis
- Node.js 18+
- MongoDB en local ou URI Atlas

Installation

```bash
cd server
npm install
cp .env.example .env
# modifier .env si besoin
npm run dev
```

L'API écoute par défaut sur le port défini dans `.env` (4000).

Envoi d'emails
--------------

Un nouvel endpoint permet d'envoyer un code par email : `POST /api/emails/send-code`.

Variables d'environnement (optionnelles) :
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` : configuration SMTP pour un vrai compte.
- `FROM_EMAIL` : adresse `From` par défaut.
- `DEFAULT_RECIPIENT` : destinataire par défaut si `to` non fourni.
- `DEFAULT_CODE` : code par défaut si `code` non fourni.

Comportement : si aucune configuration SMTP n'est fournie, le serveur utilise un compte Ethereal (test) et renvoie une `previewUrl` dans la réponse pour visualiser l'email.

Exemple curl :

```bash
curl -X POST http://localhost:4000/api/emails/send-code \
	-H 'Content-Type: application/json' \
	-d '{"to":"mohamedazizamsadiopdiop@gmail.com","code":"cuhi uynr wncg qzwb"}'
```

