# Atelier Minuit

Boutique de montres et accessoires avec espace d’administration, construite avec Angular 21 standalone, TypeScript strict et SCSS.

## Prérequis et démarrage

- Node.js 24 LTS recommandé (Angular CLI 21).
- npm 11.

```bash
npm install
npm start
```

La boutique est disponible sur `http://localhost:4200/` et le tableau de bord sur `http://localhost:4200/admin`. Le mode démonstration est activé par défaut : il n’est pas nécessaire d’avoir un backend pour explorer l’interface.

```bash
npm run build
npm test -- --watch=false
```

## Connexion à Spring Boot

Le frontend utilise une base d’API versionnée et un proxy Angular pour éviter CORS en développement. Démarrez Spring Boot sur `http://localhost:8080`, puis passez `useMockApi` à `false` dans `src/environments/environment.ts`. Le proxy `proxy.conf.json` transmet `/api/**` vers Spring.

Le build de production utilise `src/environments/environment.prod.ts` (`useMockApi: false`, base `/api/v1`). Configurez votre reverse proxy de production pour router `/api/**` vers le serveur Spring Boot.

### Endpoints consommés

| Méthode | Endpoint | Usage |
| --- | --- | --- |
| `GET` | `/api/v1/products` | Catalogue et niveaux de stock |
| `GET` | `/api/v1/orders` | Commandes du tableau de bord |
| `POST` | `/api/v1/orders` | Création d’une commande à partir des identifiants produit et quantités |
| `PATCH` | `/api/v1/orders/{id}/status` | Mise à jour du statut d’une commande |

Les objets sont échangés en JSON. Les noms de propriétés suivent les interfaces TypeScript de `src/app/models/store.models.ts`.

Exemple produit :

```json
{
  "id": "am-01",
  "name": "La Minuit 38",
  "collection": "Série Héritage",
  "category": "WATCH",
  "price": 420,
  "imageUrl": "https://example.com/la-minuit-38.jpg",
  "badge": "NOUVEAUTÉ",
  "stock": 12
}
```

`category` accepte `WATCH`, `STRAP` ou `ACCESSORY`. Une commande comprend `id`, `customer`, `email`, `itemSummary`, `total`, `createdAt` (date ISO 8601) et `status` (`PROCESSING`, `SHIPPED` ou `DELIVERED`).

Exemple de mise à jour :

```http
POST /api/v1/orders
Content-Type: application/json
```

```json
{ "items": [{ "productId": "am-01", "quantity": 1 }] }
```

Le serveur doit recalculer les prix et les taxes côté backend et répondre avec l’identifiant créé.

### Devise et langues

Les montants des produits (`price`) et des commandes (`total`) sont interprétés et affichés en dirhams marocains (DH), sans conversion automatique. Le backend doit donc également fournir et enregistrer ces montants en DH. Le sélecteur de langue est disponible dans la boutique et l’espace de gestion ; les traductions françaises, arabes et anglaises se trouvent dans `src/app/i18n/locales/`.

Mise à jour de statut :

```http
PATCH /api/v1/orders/AM-2048/status
Content-Type: application/json
```

```json
{ "status": "SHIPPED" }
```

Le serveur peut répondre avec la commande mise à jour. Pour l’authentification, les paiements et la création effective des commandes, raccordez vos endpoints et votre stratégie de sécurité Spring dans `src/app/services/catalog.service.ts`.

## Déploiement sur Render

Le fichier `render.yaml` déclare un Static Site avec fallback Angular pour que `/admin` fonctionne aussi après actualisation. Connectez le dépôt dans Render avec **Blueprint** et validez la création du service `atelier-minuit-storefront`.

Dans les variables d’environnement du service, définissez `SPRING_API_URL` avec l’URL publique HTTPS de Spring Boot, suffixée par `/api/v1` (par exemple `https://atelier-api.onrender.com/api/v1`). Le script `scripts/write-public-config.mjs` injecte cette URL dans le fichier public au build ; aucune clé secrète ne doit y être placée.

Autorisez l’origine `https://<nom-du-site>.onrender.com` dans la configuration CORS Spring Boot. Si l’API n’est pas encore déployée, définissez `SPRING_API_URL` sur une URL temporaire accessible ; le frontend de production n’utilise pas les données simulées.

## Organisation

- `src/app/pages/storefront.page.*` : catalogue, recherche, favoris et panier de démonstration.
- `src/app/pages/admin-dashboard.page.*` : indicateurs, inventaire faible et gestion des statuts de commande.
- `src/app/services/catalog.service.ts` : frontière HTTP entre les données de démo et l’API.
- `src/app/models/store.models.ts` : contrats TypeScript partagés.
- `src/environments/` : configuration développement/production.