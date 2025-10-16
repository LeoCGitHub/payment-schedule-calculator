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

### Installation

```bash
# Installer les dépendances
npm install
```

### Mode Développement Local

Pour lancer le dev des deux projets :

```bash
npm run dev
```

Pour lancer le dev des projets indépendemment l'un de l'autre dans deux terminaux:

```bash
npm run dev:frontend
npm run dev:backend
```

##### 🌐 URLs par défaut

- **Frontend** : http://localhost:3100
- **Backend API** : http://localhost:9090
- **API Docs** : http://localhost:9090/swagger-ui/

#### Docker

```bash
npm run deploy:local
```

##### 🌐 URLs par défaut

- **Frontend** : http://localhost:3101
- **Backend API** : http://localhost:9091
- **API Docs** : http://localhost:9091/swagger-ui/

### NX

[Pour consulter les commandes NX du projet](./nx.json)
[Pour consulter les commandes NX du frontend](./frontend/project.json)
[Pour consulter les commandes NX du backend](./backend/project.json)

## 📚 Documentation

- [Backend README](./backend/README.md) - Documentation spécifique au backend
- [Frontend README](./frontend/README.md) - Documentation spécifique au frontend
