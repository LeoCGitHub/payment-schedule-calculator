# Backend - Payment Schedule Calculator API

API REST pour le calcul d'échéanciers de paiement de contrats de location-financement.

## 🚀 Technologies

- **Quarkus 3.x** - Framework supersonic subatomic
- **Kotlin 2.2** - Langage de programmation moderne
- **Gradle Kotlin DSL** - Build tool
- **BigDecimal** - Calculs financiers de haute précision
- **Jakarta REST** - API REST annotations
- **Jackson** - Sérialisation JSON

## 📦 Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/com/paymentschedule/
│   │   │   ├── model/           # Data classes (Request/Response)
│   │   │   ├── resource/         # REST endpoints
│   │   │   ├── service/          # Business logic
│   │   │   └── utils/            # Utilitaires (calculs financiers)
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── kotlin/               # Tests unitaires
├── build.gradle.kts
└── gradle/
```

## 🎯 Quick Start

### Prérequis

- **Java** 21+
- **Gradle** 8+ (ou utiliser le wrapper `./gradlew`)

### Démarrage en mode dev

#### Avec Gradle

```bash
# Mode dev avec live reload
./gradlew quarkusDev

# Ou depuis la racine avec NX
npx nx serve backend
```

L'API sera disponible sur http://localhost:9090

#### Avec Docker

```bash
# Builder l'image
npx nx docker-build backend

# Ou directement avec Docker
docker build -t payment-schedule-calculator-backend .

# Démarrer le conteneur
docker run -p 9090:9090 payment-schedule-calculator-backend
```

### Build de production

```bash
# Build du JAR
./gradlew build

# Ou avec NX
npx nx build backend

# Le JAR sera dans build/quarkus-app/
```

## 📝 API Endpoints

### POST `/api/payment-schedule/calculate`

Calcule un échéancier de paiement.

**Request Body:**

```json
{
  "periodicity": 3,
  "contractDuration": 48,
  "assetAmount": 150000,
  "purchaseOptionAmount": 1500,
  "firstPaymentDate": "17/09/2025",
  "rentAmount": 10000
}
```

**Response:**

```json
{
  "paymentScheduleLines": [
    {
      "period": 1,
      "dueDate": "2025-09-17",
      "repaymentAmount": 8523.45,
      "debtBeginningPeriodAmount": 150000,
      "debtEndPeriodAmount": 141476.55,
      "periodRate": 0.014765,
      "financialInterestAmount": 1476.55,
      "rentAmount": 10000,
      "annualReferenceRate": 0.060512,
      "actualizedCashFlowAmount": 9854.23
    }
    // ... autres périodes
  ],
  "paymentScheduleTotals": {
    "totalAmount": 160000,
    "totalInterestAmount": 11500,
    "totalRepaymentAmount": 148500,
    "totalActualizedCashFlowsAmount": 149852.34
  },
  "purchaseOptionTotals": {
    "purchaseOptionAmount": 1500,
    "actualizedPurchaseOptionAmount": 1147.66
  }
}
```

## 🔧 Configuration

Fichier `src/main/resources/application.properties` :

```properties
# HTTP
quarkus.http.port=9090
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3100

# Logging
quarkus.log.level=INFO
quarkus.log.category."com.paymentschedule".level=DEBUG

# Swagger UI
quarkus.swagger-ui.enable=true
quarkus.swagger-ui.path=/q/swagger-ui
```

## 🧪 Tests

```bash
# Lancer tous les tests
./gradlew test

# Ou avec NX
npx nx test backend

# Tests avec coverage
./gradlew test jacocoTestReport
```

## 📐 Algorithmes Financiers

### Calcul du Taux Implicite (TRI)

Le backend utilise une méthode de dichotomie (bisection) pour calculer le taux de rendement interne (TRI) :

```kotlin
fun calculateInternalRateOfReturn(
    rentAmount: BigDecimal,
    purchaseOptionAmount: BigDecimal,
    assetAmount: BigDecimal,
    contractDuration: Int
): BigDecimal
```

**Formule NPV** :

```
NPV = Σ(loyer_i / (1+r)^i) + (option_achat / (1+r)^n) - valeur_actif = 0
```

### Calculs de Précision

- Utilisation exclusive de `BigDecimal` avec `MathContext.DECIMAL128`
- Précision de 34 chiffres décimaux
- Arrondi: `RoundingMode.HALF_UP`

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

## 📚 Documentation API

Swagger UI disponible en mode dev :

- http://localhost:9090/q/swagger-ui

## 🔍 Debugging

### Mode dev avec debug

```bash
./gradlew quarkusDev -Ddebug=5005
```

Puis connecter votre IDE au port 5005.

### Logs

```bash
# Augmenter le niveau de log
./gradlew quarkusDev -Dquarkus.log.level=DEBUG
```

## 🚀 Performance

Quarkus offre :

- **Démarrage rapide** : < 1 seconde
- **Faible empreinte mémoire** : ~30MB
- **Hot reload** : modifications instantanées en mode dev

## 📖 Ressources

- [Quarkus Documentation](https://quarkus.io/)
- [Kotlin Documentation](https://kotlinlang.org/)
- [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
