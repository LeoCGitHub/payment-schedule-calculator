# Frontend - Payment Schedule Calculator

Interface utilisateur React/TypeScript pour le calculateur d'échéancier de paiement.

## 🚀 Technologies

- **React 19** - Library UI moderne
- **TypeScript** - Typage statique pour plus de sécurité
- **Vite** - Build tool ultra-rapide avec HMR
- **SCSS** - Styles avec variables, nesting et mixins
- **ESLint** + **Prettier** - Qualité de code
- **Husky** - Git hooks pour pre-commit

## 🎯 Quick Start

### Prérequis

- **Node.js** 20+
- **npm**

### Installation

```bash
# Installer les dépendances
npm install
```

### Démarrage en mode dev

#### Avec npm

```bash
# Démarrer le serveur de dev
npm run dev

# Avec HMR sur http://localhost:3100
```

### Build de production

```bash
# Build optimisé
npm run build

# Les fichiers seront dans dist/
```

### Preview du build

```bash
# Prévisualiser le build de production
npm run preview
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev                    # Démarrer en mode dev

# Build & Preview
npm run build                  # Build de production
npm run preview                # Preview du build

# Qualité du code
npm run lint                   # Linter ESLint
npm run format                 # Formatter avec Prettier
npm run format:check           # Vérifier le formatage
npm run type-check             # Vérifier les types TypeScript

# Tests (à configurer)
npm run test                   # Lancer les tests
```

## 🐳 Docker

### Build de l'image

```bash
# Ou directement avec Docker
docker build -t payment-schedule-calculator-frontend .

# Démarrer le conteneur
docker run -p 3101:80 payment-schedule-calculator-frontend
```

### Variables d'environnement Docker

```bash
docker run -e VITE_API_URL=http://backend:9091/api payment-schedule-calculator-frontend
```
