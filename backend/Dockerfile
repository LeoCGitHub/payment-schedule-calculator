# --- Stage 1 : Create the final, minimal JVM image ---
# Utilisation de l'image UBI OpenJDK 21, optimisée pour les déploiements Quarkus.
# NOTE : Cette image NE CONTIENT PAS le code pour compiler Gradle, uniquement le runtime Java.
FROM registry.access.redhat.com/ubi8/openjdk-21:1.20

# Set a language environment variable (Bonne pratique)
ENV LANG='en_US.UTF-8'

# Définition du répertoire de déploiement standard
WORKDIR /deployments

# COPIE CRUCIALE : 
# Ces fichiers DOIVENT avoir été générés par une commande Gradle/Quarkus
# (par exemple : ./gradlew build) AVANT d'exécuter la commande 'docker build'.
# Nous copions le contenu du dossier de l'hôte (où build/quarkus-app se trouve)
# vers le dossier /deployments du conteneur.
# L'utilisateur 185 (jboss) a les permissions nécessaires.
COPY build/quarkus-app /deployments

# Set user and expose port (Standard pour UBI/Quarkus)
USER 185
EXPOSE 8080

# Définition de la commande pour lancer l'application (Standard Quarkus)
# Utilise les propriétés du fichier application.properties inclus dans le build.
CMD ["java", \
    "-Dquarkus.http.host=0.0.0.0", \
    "-Djava.util.logging.manager=org.jboss.logmanager.LogManager", \
    "-jar", "quarkus-run.jar"]
