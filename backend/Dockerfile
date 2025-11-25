# --- 1단계: 빌드 단계 ---
FROM maven:3.9.0-eclipse-temurin-17 AS builder

# 프로젝트 소스 복사
WORKDIR /app
COPY . .

# Maven 패키징 (테스트 생략)
RUN mvn -DskipTests=true package

# --- 2단계: 실행 단계 ---
FROM eclipse-temurin:17-jdk

WORKDIR /app

# 빌드 결과물 JAR 복사
COPY --from=builder /app/target/*.jar app.jar

# 컨테이너 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
