# Backend - Payment Schedule Calculator API

API REST pour le calcul d'échéanciers de paiement de contrats de location-financement.

## 🚀 Technologies

- **Quarkus 3.x** - Framework supersonic subatomic
- **Kotlin 2.2** - Langage de programmation moderne
- **Gradle Kotlin DSL** - Build tool
- **BigDecimal** - Calculs financiers de haute précision
- **Jakarta REST** - API REST annotations
- **Jackson** - Sérialisation JSON

## 🎯 Quick Start

### Prérequis

- **Java** 21+
- **Gradle** 8+ (ou utiliser le wrapper `./gradlew`)

### Démarrage en mode dev

#### Avec Gradle

```bash
# Mode dev avec live reload
./gradlew quarkusDev
```

L'API sera disponible sur http://localhost:9090

#### Avec Docker

```bash
# Ou directement avec Docker
docker build -t payment-schedule-calculator-backend .

# Démarrer le conteneur
docker run -p 9090:9090 payment-schedule-calculator-backend
```

### Build de production

```bash
# Build du JAR
./gradlew build

# Le JAR sera dans build/quarkus-app/
```

## 🐳 Docker

### Build de l'image

```bash
# Image JVM
docker build -f src/main/docker/Dockerfile.jvm -t payment-schedule-calculator-backend:jvm .

# Ou avec NX
npx nx docker-build backend
```

### Variables d'environnement

```bash
# Port personnalisé
docker run -e QUARKUS_HTTP_PORT=8080 -p 8080:8080 payment-schedule-calculator-backend

# Profil de configuration
docker run -e QUARKUS_PROFILE=prod payment-schedule-calculator-backend
```
