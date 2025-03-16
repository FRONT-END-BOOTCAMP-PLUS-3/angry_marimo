# [Angry Marimo](https://angry-marimo.com): 디지털 외로움 해결 프로젝트

마리모 키우러 가기 👉([DEMO](https://angry-marimo.com))
프로젝트의 상세 내용과 저희의 고민들은 WIKI에 정리 하였습니다. 👉([WIKI 바로가기](https://github.com/FRONT-END-BOOTCAMP-PLUS-3/angry_marimo/wiki))

## 📌 프로젝트 개요
한국인의 72%가 외로움을 경험하고 있습니다. 특히 1인 가구, 저소득층, 사회적 지지망이 부족한 사람일수록 외로움을 더 자주 느낍니다. 우리는 이러한 현대인의 외로움을 조금이나마 해소할 방법을 고민했습니다.

과거 다마고치는 단순한 전자 애완동물이 아니라, 소중한 존재로 여겨졌습니다. 우리는 이 휴머니즘을 현대적으로 재해석하여 **'앵그리-마리모'** 를 만들었습니다.

## 🎮 앵그리-마리모란?
**앵그리-마리모**는 웹을 통해 언제 어디서나 키울 수 있는 디지털 반려 존재입니다. 유저는 마리모를 돌보면서 정서적 교감을 형성할 수 있습니다.

## 🎯 목표
- 단순한 게임이 아닌, 현대인의 외로움을 덜어줄 디지털 힐링 경험 제공
- 자극적인 콘텐츠 대신, 잔잔한 재미를 통해 마음의 여유를 찾을 수 있는 공간 제공
- 함께 앵그리-마리모를 행복하게 만들어주며, 소소한 행복을 느껴보세요! 🌿

## 🛠️ 기능
- **💖 관심과 애정을 주세요!**
  - 자주 방문할수록 마리모가 건강하게 자랍니다.
  - 드래그 앤 드롭을 활용한 인터랙션으로 마리모와 더욱 친밀해질 수 있습니다.
 
  ![marimo-dnd](https://github.com/user-attachments/assets/b75b8175-9f00-4fcf-8d09-581919a4366e)

- **🎨 마리모 커스터마이징**
  - 1원(혹은 자유 금액 후원) 결제 시스템을 통해 마리모의 형태, 집을 꾸미기 등 다양한 커스터마이징 기능 제공
 
![marimo-donation](https://github.com/user-attachments/assets/0a272312-0d38-4f12-b574-8cbd4011e40b)
![marimo-custom](https://github.com/user-attachments/assets/ba7e0406-40ce-47a2-8817-6e8213745ced)

  
- **📸 방명록을 통한 소통**
  - 다른 유저의 방명록에 방문하여 서로 글을 남길 수 있어요.
 
![marimo-guestbook](https://github.com/user-attachments/assets/b58c8674-2043-415b-bdea-9abc8ebea740)

---

## 🏗️ 프로젝트 기술 스택
- **프레임워크**: Next.js, React 19
- **상태 관리**: Zustand
- **데이터베이스**: Prisma ORM
- **결제 시스템**: Toss Payments
- **인증**: JWT (JSON Web Token)
- **테스트**: Vitest, Playwright, React Testing Library
- **코드 품질**: ESLint, Prettier, TSLint

## 🔨 빌드 및 환경 설정
- **TypeScript**: 타입 안정성 향상
- **Babel**: JS 트랜스파일링
- **환경 변수 관리**: dotenv

## 시작하기
### 필수 조건
다음 소프트웨어가 설치되어 있어야 합니다:
- Node.js (>=18)
- PostgreSQL 또는 기타 지원되는 데이터베이스
### 설치 방법
1. 저장소를 클론합니다:
```
git clone https://github.com/FRONT-END-BOOTCAMP-PLUS-3/angry_marimo.git
cd angry_marimo
```
2. 필요한 패키지를 설치합니다:
```
npm install
```
3. 환경 변수를 설정합니다:
아래 example을 .env 파일로 복사합니다.
데이터베이스 URL, API 키 등의 값을 입력합니다.
```
COOKIE_DOMAIN="localhost:3000"
COOKIE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzMsImVtYWlsIjoiMTNAaGkuY29tIiwiaWF0IjoxNzQxNDA4ODk4LCJleHAiOjQ4OTUwMDg4OTh9.aS4BXoastBuKi12QIPKqIgDQrkS-GYgtaMQP2ZkyMBQ"

DATABASE_URL="postgresql://${db-id}:${db-password}@${db-URL}/${db-name}?schema=public"

MARIMO_SECRET_KEY="example_marimo_secret_key"

NEXT_PUBLIC_TOSS_CLIENT_KEY="test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_TOSS_SECRET_KEY="test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"
NEXT_URL="http://localhost:3000"
NEXT_WWW_URL="http://www.localhost:3000"
NEXT_STORAGE_SRC=../storage

TEST_BASE_URL="http://localhost:3000"
```

4. 데이터베이스 설정
다음 명령어를 실행하여 데이터베이스를 설정합니다:
```
npm run db:migrate
```
5. 개발 서버 실행
개발 서버를 시작하려면 다음 명령어를 실행합니다:
```
npm run dev
```
5. 빌드 및 배포
프로덕션 빌드 및 실행을 위해 다음 명령어를 실행합니다:
```
npm run build
npm run start
```

