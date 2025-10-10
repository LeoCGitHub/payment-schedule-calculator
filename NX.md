# NX Monorepo - Guide complet

Ce projet utilise **NX** pour gérer le monorepo frontend + backend.

## Qu'est-ce que NX ?

NX est un système de build intelligent qui apporte :

### Avantages ✅

1. **Cache distribué**
   - Les builds sont mis en cache
   - Ne rebuild que ce qui a changé
   - Gain de temps massif en CI/CD

2. **Exécution parallèle**
   - Build frontend + backend en même temps
   - Utilisation optimale des CPU cores
   - `--parallel=2` ou plus

3. **Affected commands**
   - Test uniquement ce qui a changé
   - Build uniquement ce qui est impacté
   - Parfait pour les mono repos

4. **Graphe de dépendances**
   - Visualisation des dépendances entre projets
   - Détection automatique des impacts
   - `npm run graph` pour voir

5. **Intégration CI/CD**
   - Détection automatique des projets affectés
   - Optimisation des pipelines
   - Support GitHub Actions, GitLab CI, etc.

## Structure du monorepo

```
payment-schedule-calculator/
├── backend/
│   ├── src/                    # Code Kotlin
│   ├── build.gradle.kts        # Config Gradle
│   └── project.json            # Config NX du backend ⭐
├── frontend/
│   ├── src/                    # Code React
│   ├── package.json            # Deps frontend
│   └── project.json            # Config NX du frontend ⭐
├── nx.json                     # Config globale NX ⭐
└── package.json                # Scripts racine ⭐
```

## Configuration NX

### nx.json (configuration globale)

```json
{
  "defaultBase": "main",
  "targetDefaults": {
    "build": {
      "cache": true,              // ✅ Cache activé
      "dependsOn": ["^build"]     // Build les dépendances d'abord
    },
    "dev": {
      "cache": false              // Pas de cache pour dev
    }
  }
}
```

### project.json (par projet)

Chaque projet (frontend, backend) a son `project.json` qui définit :
- Les **targets** (build, dev, test, etc.)
- Les **executors** (comment exécuter chaque target)
- Les **outputs** (fichiers générés à cacher)

**Exemple - frontend/project.json :**

```json
{
  "name": "frontend",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "command": "npm run build",
        "cwd": "frontend"
      }
    }
  }
}
```

## Commandes NX

### Commandes de base

```bash
# Exécuter une target pour un projet
npx nx [target] [project]
npx nx build frontend
npx nx dev backend

# Exécuter pour plusieurs projets
npx nx run-many --target=build --all
npx nx run-many --target=build --projects=frontend,backend

# En parallèle (plus rapide !)
npx nx run-many --target=build --all --parallel=2
```

### Affected commands (🔥 très puissant)

```bash
# Builder uniquement ce qui a changé depuis main
npx nx affected --target=build

# Tester uniquement ce qui a changé
npx nx affected --target=test

# Voir ce qui serait affecté
npx nx affected --target=build --dry-run

# Comparer avec une autre branche
npx nx affected --target=build --base=develop --head=feature-x
```

### Graphe et visualisation

```bash
# Voir le graphe de dépendances (ouvre un navigateur)
npx nx graph

# Graphe en JSON
npx nx graph --file=graph.json

# Voir les projets affectés visuellement
npx nx affected:graph
```

### Cache

```bash
# Réinitialiser le cache
npx nx reset

# Voir les stats du cache
npx nx daemon --stop && npx nx daemon --start

# Build sans cache (pour debug)
npx nx build frontend --skip-nx-cache
```

## Scripts NPM définis

Dans le [package.json](package.json) racine :

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance frontend + backend en parallèle |
| `npm run dev:frontend` | Lance uniquement le frontend |
| `npm run dev:backend` | Lance uniquement le backend |
| `npm run build` | Build tout en parallèle |
| `npm run build:frontend` | Build frontend uniquement |
| `npm run build:backend` | Build backend uniquement |
| `npm run test` | Tests de tout |
| `npm run affected:build` | Build ce qui a changé |
| `npm run graph` | Voir le graphe |

## Workflow recommandé

### Développement local

```bash
# 1. Installer les dépendances (première fois)
npm install
cd frontend && npm install && cd ..

# 2. Lancer tout en dev
npm run dev

# OU lancer séparément
npm run dev:frontend    # Terminal 1
npm run dev:backend     # Terminal 2
```

### Avant de commit

```bash
# Builder ce qui a changé
npm run affected:build

# Tester ce qui a changé
npm run affected:test

# Linter
npm run lint
```

### CI/CD

```yaml
# Exemple GitHub Actions
- name: Build affected
  run: npm run affected:build -- --base=origin/main

- name: Test affected
  run: npm run affected:test -- --base=origin/main
```

## Avantages pour ce projet

### 1. Builds parallèles 🚀

Avant :
```bash
cd frontend && npm run build  # 30s
cd backend && ./gradlew build # 60s
# Total: 90s
```

Avec NX :
```bash
npm run build  # 60s (parallèle !)
```

### 2. Cache intelligent 💾

```bash
# Premier build
npm run build  # 60s

# Deuxième build (rien n'a changé)
npm run build  # 2s (cache hit !)
```

### 3. Tests intelligents 🎯

```bash
# Vous modifiez uniquement le frontend
npm run affected:test
# ✅ Teste uniquement frontend
# ⏭️  Skip backend (pas changé)
```

### 4. Graphe de dépendances 📊

```bash
npm run graph
# Ouvre un navigateur avec une visualisation interactive
# Montre que frontend dépend peut-être du backend, etc.
```

## Configuration avancée

### Ajouter un nouveau projet

1. Créer le dossier du projet
2. Ajouter un `project.json`
3. Définir les targets (build, dev, test)
4. C'est tout ! NX le détecte automatiquement

### Ajouter une dépendance entre projets

Dans `project.json` :

```json
{
  "targets": {
    "build": {
      "dependsOn": ["shared:build"]  // Build shared d'abord
    }
  }
}
```

### Activer le cache distant (CI/CD)

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/nx-cloud",
      "options": {
        "accessToken": "YOUR_TOKEN"
      }
    }
  }
}
```

## Troubleshooting

### Le cache ne fonctionne pas

```bash
npx nx reset
```

### Les projets ne sont pas détectés

```bash
npx nx show projects
# Devrait lister : frontend, backend
```

### Build échoue avec NX mais pas directement

```bash
# Debug avec verbose
npx nx build frontend --verbose

# Comparer avec build direct
cd frontend && npm run build
```

## Ressources

- [Documentation NX](https://nx.dev)
- [NX Console VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [NX on GitHub](https://github.com/nrwl/nx)

## Prochaines étapes possibles

1. **Ajouter des libraries partagées**
   - `libs/shared` pour code commun
   - `libs/ui-components` pour composants réutilisables

2. **Activer Nx Cloud**
   - Cache distribué
   - CI/CD encore plus rapide

3. **Ajouter plus de projets**
   - `backend-admin` - API admin
   - `mobile` - App React Native
   - Tout dans le même monorepo !

