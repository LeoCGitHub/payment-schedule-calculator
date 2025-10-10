# Gradle Kotlin DSL

Ce projet utilise **Gradle avec Kotlin DSL** au lieu de Maven.

## Pourquoi Gradle Kotlin DSL ?

### Avantages ✅

1. **Cohérence avec Kotlin**
   - Le build script est en Kotlin, comme le code de l'application
   - Autocomplétion et vérification de types dans l'IDE
   - Refactoring sécurisé du build

2. **Performance**
   - Builds incrémentaux plus rapides
   - Cache de build Gradle très performant
   - Compilation parallèle des modules

3. **Modernité**
   - DSL concis et expressif
   - Configuration plus lisible que XML
   - Écosystème de plugins riche

4. **Flexibilité**
   - Scripts de build puissants
   - Personnalisation facile
   - Excellent pour les monorepos

## Fichiers importants

- **`build.gradle.kts`** - Configuration principale du projet (dépendances, plugins, etc.)
- **`settings.gradle.kts`** - Configuration du projet (nom, repositories, etc.)
- **`gradle.properties`** - Propriétés (versions, configuration Gradle)
- **`gradlew` / `gradlew.bat`** - Wrapper Gradle (pas besoin d'installer Gradle)

## Commandes principales

```bash
# Build
./gradlew build              # Build complet avec tests
./gradlew build -x test      # Build sans tests
./gradlew clean build        # Clean + build

# Développement
./gradlew quarkusDev         # Mode dev avec live reload
./gradlew test               # Exécuter les tests
./gradlew test --continuous  # Tests en mode watch

# Informations
./gradlew tasks              # Lister toutes les tâches
./gradlew dependencies       # Afficher les dépendances
./gradlew projects           # Lister les projets

# Performance
./gradlew build --build-cache       # Utiliser le cache
./gradlew build --parallel          # Build parallèle
./gradlew build --configuration-cache  # Cache de configuration
```

## Exemple de build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "2.2.20"
    id("io.quarkus")
}

dependencies {
    implementation("io.quarkus:quarkus-rest-jackson")
    implementation("io.quarkus:quarkus-kotlin")
    testImplementation("io.quarkus:quarkus-junit5")
}
```

Beaucoup plus lisible qu'un `pom.xml` ! 🎉

## Migration depuis Maven

Si vous avez l'habitude de Maven, voici les équivalences :

| Maven | Gradle |
|-------|--------|
| `mvn clean install` | `./gradlew clean build` |
| `mvn test` | `./gradlew test` |
| `mvn package` | `./gradlew build` |
| `mvn quarkus:dev` | `./gradlew quarkusDev` |
| `mvn dependency:tree` | `./gradlew dependencies` |

## Documentation

- [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)
- [Kotlin DSL Primer](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [Quarkus with Gradle](https://quarkus.io/guides/gradle-tooling)
