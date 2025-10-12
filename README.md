# Payment Schedule Calculator 💰

Calculateur d'échéancier de paiement pour contrats de location-financement. Application full-stack avec backend Kotlin/Quarkus et frontend React/TypeScript.

## 🚀 Technologies

### Backend
- **Kotlin** - Langage de programmation
- **Quarkus** - Framework Java/Kotlin léger et rapide
- **Gradle** (Kotlin DSL) - Build tool

### Frontend
- **React 19** - UI library
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **SCSS** - Styles avec variables et nesting

### DevOps
- **NX** - Monorepo tool pour gérer frontend + backend
- **Docker** - Conteneurisation
- **Husky** - Git hooks pour qualité du code

## 📦 Structure du Projet

```
payment-schedule-calculator/
├── backend/          # API Quarkus (Kotlin)
├── frontend/         # Application React (TypeScript)
├── docker-compose.yml
└── nx.json          # Configuration NX
```

## 🎯 Quick Start

### Prérequis

- **Node.js** 20+ et npm
- **Java** 21+ (pour le backend)
- **Docker** (optionnel, pour le déploiement)
- **Docker Cpmpose** (optionnel, pour le déploiement)

### QuickStart
#### Local
Pour lancer le dev des deux projets :
```bash
npm run dev
```
Pour lancer le dev des projets indépendemment l'un de l'autre:
```bash
npm run dev:frontend
npm run dev:backend
```

##### 🌐 URLs par défaut
- **Frontend** : 
    - DEV: http://localhost:3100
- **Backend API** : 
    - DEV: http://localhost:9090
- **API Docs** : http://localhost:9090/q/swagger-ui

#### Docker
```bash
npm run deploy:local
```

##### 🌐 URLs par défaut
- **Frontend** : 
    - DOCKER: http://localhost:3101
- **Backend API** : 
    - DOCKER: http://localhost:9091
- **API Docs** : http://localhost:9091/q/swagger-ui

### Installation

```bash
# Installer les dépendances
npm install
```

### Mode Développement

#### Option 1 : Démarrer les deux applications avec NX

```bash
# Démarrer backend + frontend simultanément
npx nx run-many -t serve

# Ou individuellement
npx nx serve backend    # Backend sur http://localhost:9090
npx nx serve frontend   # Frontend sur http://localhost:3100
```

#### Option 2 : Commandes directes

```bash
# Backend uniquement
cd backend && ./gradlew quarkusDev

# Frontend uniquement
cd frontend && npm run dev
```

### Mode Docker

#### Développement avec Docker

# Démarrer avec docker-compose
docker-compose up

# En arrière-plan
docker-compose up -d

# Arrêter
docker-compose down
```

#### Build des images Docker avec NX

```bash
# Builder le backend
npx nx docker-build backend

# Builder le frontend
npx nx docker-build frontend

# Builder les deux
npx nx run-many -t docker-build
```

## 🔧 Commandes NX Utiles

### Tests

```bash
# Lancer tous les tests
npx nx run-many -t test

# Tests backend uniquement
npx nx test backend

# Tests frontend uniquement (si configuré)
npx nx test frontend
```

### Build

```bash
# Builder les deux projets
npx nx run-many -t build

# Build backend (JAR)
npx nx build backend

# Build frontend (assets statiques)
npx nx build frontend
```

### Qualité du code

```bash
# Linter frontend
npx nx lint frontend

# Format (Prettier)
cd frontend && npm run format
```

### Visualiser le graphe de dépendances

```bash
npx nx graph
```

## 📚 Documentation

- [Backend README](./backend/README.md) - Documentation spécifique au backend
- [Frontend README](./frontend/README.md) - Documentation spécifique au frontend
