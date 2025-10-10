# Quick Start Guide 🚀

Guide de démarrage rapide pour le projet payment-schedule-calculator.

## Prérequis

- **Node.js 20+** et npm
- **Java 17+**
- **Docker** et Docker Compose (pour déploiement)

## Installation (première fois)

```bash
# 1. Cloner le projet
git clone https://github.com/LeoCGitHub/payment-schedule-calculator.git
cd payment-schedule-calculator

# 2. Installer les dépendances NX (racine)
npm install

# 3. Installer les dépendances frontend
cd frontend && npm install && cd ..

# 4. (Optionnel) Build initial pour vérifier que tout fonctionne
npm run build
```

## Développement local

### Option 1 : Tout lancer avec NX (recommandé)

```bash
# Lance frontend ET backend en parallèle
npm run dev
```

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:8080
- **Swagger** : http://localhost:8080/swagger-ui

### Option 2 : Lancer séparément

**Terminal 1 - Backend :**
```bash
# Démarrer PostgreSQL d'abord
docker run -d --name postgres \
  -e POSTGRES_DB=payment_schedule \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:16-alpine

# Démarrer le backend
npm run dev:backend
# OU directement:
cd backend && ./gradlew quarkusDev
```

**Terminal 2 - Frontend :**
```bash
npm run dev:frontend
# OU directement:
cd frontend && npm run dev
```

## Build

```bash
# Builder tout (frontend + backend en parallèle)
npm run build

# Builder uniquement le frontend
npm run build:frontend

# Builder uniquement le backend
npm run build:backend

# Builder ce qui a changé (après modifications)
npm run affected:build
```

## Tests

```bash
# Tous les tests
npm run test

# Tests frontend
npm run test:frontend

# Tests backend
npm run test:backend
```

## Déploiement Docker

### Tout démarrer avec Docker Compose

```bash
# Démarrer la stack complète (postgres + backend + frontend)
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

**URLs après démarrage :**
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **Swagger UI** : http://localhost:8080/swagger-ui
- **PostgreSQL** : localhost:5432

## Commandes utiles

### NX

```bash
# Voir tous les projets
npx nx show projects

# Graphe de dépendances
npm run graph

# Réinitialiser le cache
npx nx reset
```

### Frontend

```bash
cd frontend

npm run dev          # Dev server (Vite)
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # Linter
npm run format       # Prettier
```

### Backend

```bash
cd backend

./gradlew quarkusDev        # Mode dev avec live reload
./gradlew build             # Build complet
./gradlew build -x test     # Build sans tests (plus rapide)
./gradlew test              # Tests
./gradlew clean             # Nettoyer
./gradlew dependencies      # Voir dépendances
```

### Git hooks

Le projet utilise **Husky + lint-staged** :
- Auto-format avec Prettier à chaque commit
- Auto-fix ESLint
- Bloque le commit si erreurs ESLint

```bash
# Formater manuellement
cd frontend && npm run format

# Vérifier le format
cd frontend && npm run format:check
```

## Structure du projet

```
payment-schedule-calculator/
├── backend/              # API Quarkus Kotlin
│   ├── src/
│   ├── build.gradle.kts
│   └── project.json      # Config NX
├── frontend/             # App React Vite
│   ├── src/
│   ├── package.json
│   └── project.json      # Config NX
├── nx.json               # Config NX
├── package.json          # Scripts racine
├── docker-compose.yml    # Stack Docker
├── README.md             # Documentation principale
├── NX.md                 # Guide NX détaillé
└── QUICKSTART.md         # Ce fichier
```

## Troubleshooting

### Frontend ne démarre pas

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend ne démarre pas

```bash
# Vérifier que PostgreSQL tourne
docker ps | grep postgres

# Vérifier les logs backend
cd backend
./gradlew quarkusDev --info
```

### NX ne détecte pas les projets

```bash
npx nx reset
npx nx show projects
```

### Cache NX problématique

```bash
npx nx reset
rm -rf .nx
npm run build
```

## Prochaines étapes

1. **Lire la doc complète** : [README.md](README.md)
2. **Comprendre NX** : [NX.md](NX.md)
3. **Voir Gradle** : [backend/GRADLE.md](backend/GRADLE.md)
4. **Développer votre feature** 🚀

## Liens utiles

- **Frontend** : React 19 + Vite + ESLint + Prettier
- **Backend** : Quarkus 3.28 + Kotlin 2.2 + Gradle
- **Monorepo** : NX
- **Database** : PostgreSQL 16
- **Documentation** :
  - [Quarkus](https://quarkus.io)
  - [React](https://react.dev)
  - [NX](https://nx.dev)
  - [Gradle](https://docs.gradle.org)

Bon développement ! 🎉
