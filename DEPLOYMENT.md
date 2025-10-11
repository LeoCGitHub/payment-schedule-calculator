# Guide de Déploiement Docker

Ce guide explique comment déployer l'application Payment Schedule Calculator avec Docker.

## 📋 Prérequis

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Node.js 20+ (pour le build local)

## 🚀 Déploiement Rapide

### Option 1 : Déploiement complet avec un seul script

```bash
npm run deploy:local
```

Cette commande va :
1. Builder le frontend et le backend
2. Créer les images Docker
3. Démarrer tous les services avec Docker Compose

### Option 2 : Déploiement par étapes

#### 1. Builder les projets

```bash
# Builder tous les projets
npm run build

# Ou builder individuellement
npm run build:frontend
npm run build:backend
```

#### 2. Créer les images Docker

```bash
# Créer toutes les images
npm run docker:build

# Ou créer individuellement
npm run docker:build:frontend
npm run docker:build:backend
```

#### 3. Démarrer les services

```bash
# Démarrer tous les services en arrière-plan
npm run docker:up

# Ou utiliser docker-compose directement
docker-compose up -d
```

## 📦 Services Déployés

Après le déploiement, les services suivants seront disponibles :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface React |
| **Backend** | http://localhost:9090 | API Quarkus |
| **Swagger UI** | http://localhost:9090/swagger-ui | Documentation API |
| **PostgreSQL** | localhost:5432 | Base de données |

### Informations de connexion PostgreSQL

- **Database:** payment_schedule
- **User:** admin
- **Password:** admin123
- **Port:** 5432

## 🔧 Commandes Utiles

### Voir les logs

```bash
# Tous les services
npm run docker:logs

# Ou avec docker-compose
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Arrêter les services

```bash
# Arrêter et supprimer les conteneurs
npm run docker:down

# Ou avec docker-compose
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Redémarrer un service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruire une image

```bash
# Reconstruire et redémarrer
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## 🔍 Vérification du Déploiement

### 1. Vérifier que tous les conteneurs sont en cours d'exécution

```bash
docker-compose ps
```

Tous les services doivent avoir le statut "Up" ou "healthy".

### 2. Vérifier la santé du backend

```bash
curl http://localhost:9090/q/health/ready
```

### 3. Vérifier la santé du frontend

```bash
curl http://localhost:3000/health
```

### 4. Tester l'API

```bash
# Utiliser le script de test si disponible
./test-api.sh

# Ou manuellement
curl -X POST http://localhost:9090/api/payment-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "loanAmount": 10000,
    "annualInterestRate": 5.0,
    "loanTermMonths": 12
  }'
```

## 🛠️ Configuration Avancée

### Variables d'environnement

Pour modifier les variables d'environnement, éditez le fichier `docker-compose.yml` :

```yaml
services:
  backend:
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:postgresql://postgres:5432/payment_schedule
      QUARKUS_DATASOURCE_USERNAME: admin
      QUARKUS_DATASOURCE_PASSWORD: admin123
      QUARKUS_HTTP_PORT: 8080
```

### Ports personnalisés

Pour changer les ports exposés, modifiez la section `ports` dans `docker-compose.yml` :

```yaml
services:
  backend:
    ports:
      - "9090:8080"  # host:container
  frontend:
    ports:
      - "3000:80"
```

### Build pour production

Pour un build optimisé pour la production :

```bash
# Backend : utiliser le profil production
cd backend
./gradlew build
cd ..

# Frontend : les variables d'environnement sont déjà configurées
npm run build:frontend

# Créer les images
npm run docker:build
```

## 🐛 Dépannage

### Le backend ne démarre pas

1. Vérifier que PostgreSQL est bien démarré :
   ```bash
   docker-compose logs postgres
   ```

2. Vérifier la connexion à la base de données :
   ```bash
   docker-compose exec postgres psql -U admin -d payment_schedule
   ```

### Le frontend ne peut pas contacter le backend

1. Vérifier que le backend est accessible :
   ```bash
   curl http://localhost:9090/q/health
   ```

2. Vérifier les logs CORS dans le backend :
   ```bash
   docker-compose logs backend | grep CORS
   ```

### Problèmes de build

1. Nettoyer les images existantes :
   ```bash
   docker-compose down
   docker system prune -a
   ```

2. Reconstruire sans cache :
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Erreurs de permissions

```bash
# Donner les permissions d'exécution aux scripts
chmod +x check-backend.sh start-backend.sh test-api.sh
```

## 🔒 Sécurité

### Pour la production

⚠️ **Important** : Avant de déployer en production, modifiez :

1. **Mots de passe PostgreSQL** dans `docker-compose.yml`
2. **Variables d'environnement** sensibles
3. **CORS origins** pour n'autoriser que votre domaine
4. **URL de l'API** dans le frontend

Exemple pour la production :

```yaml
services:
  backend:
    environment:
      QUARKUS_DATASOURCE_PASSWORD: ${DB_PASSWORD}  # Utiliser des variables d'environnement
      QUARKUS_HTTP_CORS_ORIGINS: https://votre-domaine.com

  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

## 📊 Monitoring

### Voir l'utilisation des ressources

```bash
docker stats
```

### Voir les volumes

```bash
docker volume ls
docker volume inspect payment-schedule-calculator_postgres_data
```

## 🔄 Mise à jour

Pour mettre à jour l'application après des modifications :

```bash
# 1. Arrêter les services
npm run docker:down

# 2. Récupérer les dernières modifications
git pull

# 3. Redéployer
npm run deploy:local
```

## 📝 Architecture Docker

```
┌─────────────────────────────────────────────────┐
│                Docker Compose                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐│
│  │  Frontend    │  │   Backend    │  │Postgres││
│  │  (Nginx)     │─▶│  (Quarkus)   │─▶│  DB    ││
│  │  Port: 3000  │  │  Port: 9090  │  │  5432  ││
│  └──────────────┘  └──────────────┘  └────────┘│
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🆘 Support

Pour plus d'informations :
- Consultez les logs : `npm run docker:logs`
- Vérifiez la documentation NX : `npm run graph`
- Issues GitHub : [Lien vers votre repo]
