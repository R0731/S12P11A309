#backend
FROM openjdk:21-jdk-slim

WORKDIR /app

# Gradle Wrapper 복사
COPY gradlew .
COPY gradle gradle
COPY . .

# Gradle Wrapper 실행 권한 부여
RUN chmod +x gradlew && \
    ./gradlew bootJar

# 빌드된 JAR 파일 실행
ENTRYPOINT ["java", "-jar", "build/libs/opt-back-0.0.1-SNAPSHOT.jar"]
