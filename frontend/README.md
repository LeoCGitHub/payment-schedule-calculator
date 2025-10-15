# Frontend - Payment Schedule Calculator

Interface utilisateur React/TypeScript pour le calculateur d'échéancier de paiement.

## 🚀 Technologies

- **React 19** - Library UI moderne
- **TypeScript** - Typage statique pour plus de sécurité
- **Vite** - Build tool ultra-rapide avec HMR
- **SCSS** - Styles avec variables, nesting et mixins
- **ESLint** + **Prettier** - Qualité de code
- **Husky** - Git hooks pour pre-commit

## 📦 Structure

```
frontend/
├── src/
│   ├── app/                      # Application principale
│   │   ├── App.tsx
│   │   └── App.scss
│   ├── components/               # Composants réutilisables
│   │   └── Toast/
│   ├── containers/               # Containers métier
│   │   └── PaymentSchedule/
│   │       ├── Form/            # Formulaire de saisie
│   │       └── Table/           # Tableau d'amortissement
│   ├── services/                 # Services API
│   │   └── api.ts
│   ├── types/                    # Types TypeScript
│   │   └── payment.types.ts
│   ├── utils/                    # Utilitaires
│   │   ├── converter.ts
│   │   └── formatter/
│   ├── main.tsx                 # Point d'entrée
│   └── index.scss               # Styles globaux
├── public/                      # Assets statiques
├── index.html
├── package.json
├── tsconfig.json               # Configuration TypeScript
└── vite.config.ts              # Configuration Vite
```

## 🎯 Quick Start

### Prérequis

- **Node.js** 18+
- **npm** ou **yarn**

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

#### Avec NX (depuis la racine)

```bash
# Démarrer le frontend seul
npx nx serve frontend

# Démarrer frontend + backend
npx nx run-many -t serve
```

### Build de production

```bash
# Build optimisé
npm run build

# Ou avec NX
npx nx build frontend

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

## 📝 Fonctionnalités

### Formulaire dynamique

- ✅ Validation en temps réel
- ✅ Liseré rouge sur champs invalides
- ✅ Bouton désactivé si formulaire incomplet
- ✅ Calendrier pour la date
- ✅ Layout responsive (desktop/tablet/mobile)

### Tableau d'amortissement

- ✅ Affichage détaillé période par période
- ✅ Totaux et récapitulatif financier
- ✅ Formatage des montants et pourcentages
- ✅ Header sticky au scroll
- ✅ Scroll horizontal sur petits écrans

### UX/UI

- ✅ Design moderne avec gradient
- ✅ Responsive (desktop, tablet, mobile)
- ✅ Toast notifications pour les erreurs
- ✅ Loading states
- ✅ Sidebar sticky (formulaire à gauche)

## 🎨 Architecture des styles

Le projet utilise **SCSS** avec une organisation par composant :

```scss
// Variables globales (index.scss)
$primary-color: #646cff;
$error-color: #e74c3c;

// Nesting
.form-group {
  input {
    &.input-error {
      border-color: $error-color;
    }
  }
}
```

### Media queries

```scss
// Desktop > 1024px : Sidebar layout
// Tablet ≤ 1024px : Column layout
// Mobile ≤ 768px : Simplified UI
```

## 🔌 API Integration

Le frontend communique avec le backend via `services/api.ts` :

```typescript
// Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

// Exemple d'appel
const result = await paymentScheduleApi.calculateSchedule(request);
```

### Variables d'environnement

Créer un fichier `.env` à la racine du frontend :

```env
VITE_API_URL=http://localhost:9090/api
```

## 📐 Types TypeScript

Tous les types sont définis dans `src/types/payment.types.ts` :

```typescript
export interface PaymentScheduleRequest {
  periodicity: number;
  contractDuration: number;
  assetAmount: number;
  purchaseOptionAmount: number;
  firstPaymentDate: string;
  rentAmount: number;
}

export interface PaymentScheduleResponse {
  paymentScheduleLines: PaymentScheduleLine[];
  paymentScheduleTotals: PaymentScheduleTotals;
  purchaseOptionTotals: PurchaseOptionTotals;
}
```

Les types sont **strictement alignés avec le backend Kotlin**.

## 🐳 Docker

### Build de l'image

```bash
# Avec NX
npx nx docker-build frontend

# Ou directement avec Docker
docker build -t payment-schedule-calculator-frontend .

# Démarrer le conteneur
docker run -p 3100:80 payment-schedule-calculator-frontend
```

### Variables d'environnement Docker

```bash
docker run -e VITE_API_URL=http://backend:9090/api payment-schedule-calculator-frontend
```

## 🧪 Tests (à configurer)

Pour ajouter des tests :

```bash
# Installer Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Créer vitest.config.ts
# Ajouter des tests dans src/**/*.test.tsx
```

## 🎯 Responsive Design

### Breakpoints

- **Desktop** (>1024px) : Layout sidebar (formulaire gauche, tableau droite)
- **Tablet** (≤1024px) : Layout colonne (formulaire puis tableau)
- **Mobile** (≤768px) : Simplified UI, champs de formulaire empilés

### Formulaire responsive

- Desktop : 1 colonne
- Tablet : Multi-colonnes (auto-fit grid)
- Mobile : 1 colonne

## 🔍 Debugging

### React DevTools

Installer l'extension React DevTools pour Chrome/Firefox.

### Vite HMR

Le Hot Module Replacement (HMR) est activé par défaut en mode dev :

- Modifications instantanées sans rechargement complet
- Préservation de l'état React

### TypeScript

```bash
# Vérifier les erreurs TypeScript
npm run type-check

# Mode watch
tsc --noEmit --watch
```

## 🚀 Performance

### Build optimizations

- **Code splitting** automatique
- **Tree shaking** pour réduire la taille
- **Minification** avec Terser
- **Compression gzip** des assets

### Taille du bundle

```bash
npm run build

# Vérifier la taille
ls -lh dist/assets/
```

## 📖 Ressources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [SCSS Guide](https://sass-lang.com/guide)
