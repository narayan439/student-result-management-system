# Backend Dockerfile for Student Result Management System
FROM maven:3.8.6-openjdk-11-slim AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY backend/srms/pom.xml ./pom.xml

# Build project
COPY backend/srms/src ./src

RUN mvn clean package -DskipTests

# Production stage with Java 11 JRE
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Railway assigns this dynamically)
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV PORT=8080

# Verify Java is available
RUN java -version

# Run application with dynamic port
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -Dserver.port=${PORT:-8080} -jar app.jar"]
