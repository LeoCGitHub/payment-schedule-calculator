# payment-schedule-calculator

Calculateur d'échéancier de paiement avec interface React - Monorepo géré avec NX.

## 🚀 Technologies

- **NX** - Monorepo intelligent avec cache et exécution parallèle
- **React 19** + **Vite** - Frontend moderne
- **Quarkus 3.28** + **Kotlin 2.2** - Backend performant
- **PostgreSQL 16** - Base de données
- **Gradle Kotlin DSL** - Build backend
- **Docker** - Containerisation

## 📁 Structure du projet

```
.
├── backend/           # API Quarkus (Kotlin + Gradle)
│   ├── src/          # Code source Kotlin
│   ├── build.gradle.kts
│   └── project.json  # Configuration NX
├── frontend/          # Application React (Vite)
│   ├── src/          # Code source React
│   ├── package.json
│   └── project.json  # Configuration NX
├── nx.json            # Configuration NX workspace
├── package.json       # Scripts NX racine
└── docker-compose.yml # Stack complète

```

## 🎯 Commandes NX principales

### Développement

```bash
# Démarrer tout le workspace (frontend + backend en parallèle)
npm run dev

# Démarrer uniquement le frontend
npm run dev:frontend

# Démarrer uniquement le backend
npm run dev:backend
```

### Build

```bash
# Builder tous les projets en parallèle
npm run build

# Builder uniquement le frontend
npm run build:frontend

# Builder uniquement le backend
npm run build:backend

# Builder uniquement ce qui a changé (affected)
npm run affected:build
```

### Tests

```bash
# Lancer tous les tests
npm run test

# Tests frontend uniquement
npm run test:frontend

# Tests backend uniquement
npm run test:backend

# Tests uniquement ce qui a changé
npm run affected:test
```

### Autres commandes utiles

```bash
# Voir le graphe de dépendances
npm run graph

# Linter tous les projets
npm run lint

# Formater tous les projets
npm run format

# Voir tous les projets NX
npx nx show projects
```

## Frontend

Application React moderne construite avec :
- **React 19** - Dernière version
- **Vite** - Build tool rapide et moderne
- **ESLint** - Linting du code
- **Prettier** - Formatage automatique du code
- **Husky + lint-staged** - Pre-commit hooks pour maintenir la qualité du code

### Installation

```bash
cd frontend
npm install
```

### Développement

```bash
cd frontend
npm run dev
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173)

### Scripts disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build de production
npm run lint         # Linter le code avec ESLint
npm run format       # Formater le code avec Prettier
npm run format:check # Vérifier le formatage sans modifier
```

### Pre-commit hooks

Le projet utilise **Husky** et **lint-staged** pour garantir la qualité du code :
- Exécution automatique d'ESLint avec auto-fix
- Formatage automatique avec Prettier
- Blocage du commit si des erreurs ESLint persistent

Ces outils s'exécutent automatiquement à chaque commit sur les fichiers modifiés uniquement.

## Backend

API REST construite avec :
- **Quarkus 3.28** - Framework Java supersonic subatomic
- **Kotlin 2.2** - Langage moderne et expressif
- **Gradle Kotlin DSL** - Build moderne avec DSL Kotlin
- **PostgreSQL** - Base de données relationnelle
- **Hibernate ORM Panache** - Simplification de la persistance
- **RESTEasy Reactive** - API REST réactive
- **SmallRye OpenAPI** - Documentation API automatique (Swagger)

### Prérequis

- Java 17+
- Gradle 9.1+ (ou utiliser le wrapper `./gradlew` inclus)

### Installation

```bash
cd backend
./gradlew build -x test
```

### Développement

```bash
# Démarrer PostgreSQL avec Docker
docker run -d --name postgres \
  -e POSTGRES_DB=payment_schedule \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:16-alpine

# Démarrer Quarkus en mode dev (avec live reload)
cd backend
./gradlew quarkusDev
```

L'API sera disponible sur [http://localhost:8080](http://localhost:8080)

### Endpoints disponibles

- **API REST** : `http://localhost:8080/`
- **Swagger UI** : `http://localhost:8080/swagger-ui`
- **OpenAPI Spec** : `http://localhost:8080/q/openapi`
- **Health Check** : `http://localhost:8080/q/health`
- **Metrics** : `http://localhost:8080/q/metrics`

### Tests

```bash
cd backend
./gradlew test
```

### Build

```bash
cd backend
./gradlew build
```

Le JAR sera généré dans `build/quarkus-app/`

### Commandes Gradle utiles

```bash
./gradlew tasks              # Liste toutes les tâches disponibles
./gradlew quarkusDev         # Mode développement avec live reload
./gradlew build              # Build complet avec tests
./gradlew build -x test      # Build sans tests (plus rapide)
./gradlew clean              # Nettoyer le projet
./gradlew dependencies       # Afficher l'arbre des dépendances
```

## 📝 Utilisation de l'application

### Interface utilisateur

1. Ouvrez le frontend dans votre navigateur (http://localhost:5173 en dev ou http://localhost:3000 en prod)
2. Remplissez le formulaire de calcul d'échéancier :
   - **Montant du prêt (€)** : Le montant total à emprunter (ex: 10000)
   - **Taux d'intérêt annuel (%)** : Le taux annuel en pourcentage (ex: 3.5)
   - **Nombre de mensualités** : Le nombre de paiements mensuels (ex: 24)
   - **Date de début** : La date du premier paiement (par défaut: aujourd'hui)
3. Cliquez sur **"Calculer l'échéancier"**
4. Visualisez les résultats :
   - **Résumé** : Montant total, principal et intérêts totaux
   - **Tableau détaillé** : Pour chaque mensualité
     - Numéro de paiement
     - Date
     - Montant de la mensualité
     - Part de principal
     - Part d'intérêts
     - Solde restant

### API REST

L'API backend expose un endpoint pour calculer l'échéancier.

#### Endpoint : POST `/api/payment-schedule/calculate`

**Request Body :**
```json
{
  "amount": 10000,
  "interestRate": 3.5,
  "numberOfPayments": 24,
  "startDate": "2025-10-10"
}
```

**Response :**
```json
{
  "payments": [
    {
      "paymentNumber": 1,
      "date": "2025-10-10",
      "paymentAmount": 432.10,
      "principal": 402.93,
      "interest": 29.17,
      "remainingBalance": 9597.07
    },
    {
      "paymentNumber": 2,
      "date": "2025-11-10",
      "paymentAmount": 432.10,
      "principal": 404.10,
      "interest": 28.00,
      "remainingBalance": 9192.97
    }
    // ... 22 autres mensualités
  ],
  "totalAmount": 10370.40,
  "totalInterest": 370.40,
  "totalPrincipal": 10000.00
}
```

**Exemple avec curl :**
```bash
curl -X POST http://localhost:8080/api/payment-schedule/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "interestRate": 3.5,
    "numberOfPayments": 24,
    "startDate": "2025-10-10"
  }'
```

## Déploiement Docker

L'application complète (Frontend + Backend + PostgreSQL) peut être déployée avec Docker.

### Avec Docker Compose (recommandé)

```bash
# Démarrer toute l'application (frontend + backend + postgres)
docker-compose up -d

# Arrêter l'application
docker-compose down

# Voir les logs
docker-compose logs -f          # Tous les services
docker-compose logs -f backend   # Backend uniquement
docker-compose logs -f frontend  # Frontend uniquement

# Rebuild après modifications
docker-compose up -d --build
```

**URLs disponibles :**
- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:8080](http://localhost:8080)
- **Swagger UI** : [http://localhost:8080/swagger-ui](http://localhost:8080/swagger-ui)
- **PostgreSQL** : `localhost:5432`

### Avec Docker directement

```bash
# Build de l'image
cd frontend
docker build -t payment-schedule-frontend .

# Lancer le conteneur
docker run -d -p 3000:80 --name payment-schedule payment-schedule-frontend

# Arrêter le conteneur
docker stop payment-schedule
docker rm payment-schedule
```

### Caractéristiques des images Docker

**Frontend :**
- **Multi-stage build** : Image finale légère (~25MB)
- **Nginx Alpine** : Serveur web performant et sécurisé
- **Configuration optimisée** :
  - Compression gzip activée
  - Cache des assets statiques (1 an)
  - Support des routes React Router (SPA)
  - Headers de sécurité configurés
  - Health check endpoint : `/health`

**Backend :**
- **Multi-stage build** : Build avec Maven, run avec OpenJDK
- **Image optimisée** : Red Hat UBI OpenJDK 21
- **Configuration production-ready** :
  - Connexion PostgreSQL configurée
  - CORS configuré pour le frontend
  - Swagger UI activé
  - Health checks et metrics inclus

**Base de données :**
- **PostgreSQL 16 Alpine** : Version légère et performante
- **Volume persistant** : Les données survivent aux redémarrages
- **Health check** : Vérification automatique de disponibilité