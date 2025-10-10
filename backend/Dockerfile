## Stage 1 : build with gradle builder image
FROM gradle:8.12-jdk21-alpine AS build

WORKDIR /app

# Copy gradle configuration files
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

# Download dependencies
RUN gradle dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build the application
RUN gradle build -x test --no-daemon

## Stage 2 : create the docker final image
FROM registry.access.redhat.com/ubi8/openjdk-21:1.20

ENV LANGUAGE='en_US:en'

# Copy the application jar and dependencies
COPY --from=build --chown=185 /app/build/quarkus-app/lib/ /deployments/lib/
COPY --from=build --chown=185 /app/build/quarkus-app/*.jar /deployments/
COPY --from=build --chown=185 /app/build/quarkus-app/app/ /deployments/app/
COPY --from=build --chown=185 /app/build/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185

ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]
