# **OPT - AI 기반 트레이닝 통합 플랫폼** 🏋️‍♂️

## 🚀 프로젝트 개요
OPT(Optimal Personal Training)는 **유저와 트레이너를 연결하는 AI 기반 피트니스 플랫폼**입니다.  
운동 기록, AI 자세 분석, 실시간 코칭, 트레이너 탐색 및 추천 기능을 제공하여  
**회원은 최적의 트레이너와 효과적인 운동을**, **트레이너는 신뢰받는 PT 환경을 구축**할 수 있도록 합니다.  

---

## 🏗 **기술 스택 (Tech Stack)**  

### **📌 개발 환경**
- **운영 체제**: Ubuntu 22.04 LTS (AWS EC2)
- **프레임워크**: Spring Boot 3.4.2
- **데이터베이스**: MySQL 8.0.41 (AWS RDS), MongoDB 2.3.9
- **메시지 브로커**: Apache Kafka 2.8.1
- **캐시**: Redis 7.4.2
- **파일 저장소**: AWS S3
- **CI/CD**: Jenkins, Docker
- **프로그래밍 언어**: Java 17, Python 3.10, JavaScript (React Native, Expo)
- **버전 관리**: Git (GitLab), Jira

### **📌 주요 라이브러리 버전**
#### **Backend (Spring Boot)**
- Spring Boot: 3.4.2
- Spring Security: 3.4.2
- JPA (Hibernate): 3.4.2
- Redis: 7.4.2
- Kafka Client: 3.8.1
- Lombok: 1.18.36
- JWT: 0.11.5
- WebSocket: 10.1.34

#### **Python 서버 (FastAPI)**
- FastAPI: 0.115.8
- Google Cloud Vision API

#### **모바일 클라이언트 (React Native & Expo)**
- React Native: 0.76.6
- Expo: 52.0.35
- Axios: 1.7.9

---

## 🎯 **핵심 기능 (Key Features)**  

### ✅ **유저 기능**  
- **트레이너 검색 및 추천** (거리순, 별점순 등으로 정렬)  
- **운동 기록 관리 및 트레이너 실시간 피드백**  
- **AI 운동 자세 분석 (ML Kit 활용)**  
- **AI 식단 분석 및 맞춤형 피드백 제공**  

### ✅ **트레이너 기능**  
- **사업자 등록증 및 자격증 AI 검증 (OCR 분석)**  
- **회원 운동 기록 모니터링 및 실시간 피드백 제공**  
- **챌린지 등록 및 보상 관리 기능**  

---

## 🛠 **프로젝트 실행 방법 (Setup & Run)**  

### 1️⃣ **Backend 실행 (Spring Boot)**
```bash
cd backend
./gradlew bootRun
```

### 2️⃣ **AI 서비스 실행 (FastAPI)**
```bash
cd ai-server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3️⃣ **Frontend 실행 (React Native)**
```bash
cd frontend
npm install
npm run start
```

