📦 angry-marimo
 ┣ 📂.github
 ┃ ┗ 📂workflows
 ┃ ┃ ┗ 📜playwright.yml  <!-- 깃허브 액션 파이프라인 -->
 ┣ 📂.vscode
 ┃ ┣ 📜extensions.json <!-- 프로젝트 권장 익스텐션 -->
 ┃ ┗ 📜settings.json <!-- 프로젝트에서 사용되는 네이밍 등록 -->
 ┣ 📂__tests__ <!-- 테스트 코드 작성 -->
 ┃ ┣ 📂api  <!-- 프로젝트 폴더 구조와 동일하게 작성 -->
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜route.spec.ts
 ┃ ┣ 📂application
 ┃ ┃ ┗ 📂usecases
 ┃ ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┃ ┗ 📜user-usecase.spec.ts
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂feedback-btn
 ┃ ┃ ┃ ┗ 📜feedback-btn.e2e-spec.ts
 ┃ ┣ 📂hooks
 ┃ ┃ ┗ 📜use-debounce.spec.tsx
 ┃ ┣ 📂infrastructure
 ┃ ┃ ┗ 📂repositories
 ┃ ┃ ┃ ┗ 📜pg-user-repository.spec.ts
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📂actions
 ┃ ┃ ┃ ┃ ┗ 📜user-login.spec.ts
 ┃ ┣ 📂public
 ┃ ┃ ┗ 📜worker.spec.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┗ 📜vaildate-email.spec.ts
 ┣ 📂app
 ┃ ┣ 📂api <!-- API -->
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂(main) <!-- 로그인 한 유저와 레이아웃 분리 -->
 ┃ ┃ ┣ 📂pay <!-- 페이지 라우팅 -->
 ┃ ┃ ┃ ┣ 📂_components <!-- 각 페이지에서만 사용하는 컴포넌트 -->
 ┃ ┃ ┃ ┃ ┣ 📜pay-form.module.css
 ┃ ┃ ┃ ┃ ┗ 📜pay-form.tsx <!-- 컴포넌트를 세분화 -->
 ┃ ┣ 📂login
 ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┣ 📜login-form.module.css
 ┃ ┃ ┃ ┗ 📜login-form.tsx
 ┃ ┃ ┣ 📂actions <!-- next.action -->
 ┃ ┃ ┃ ┗ 📜user-login.ts
 ┃ ┃ ┣ 📜page.module.css
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜reset.css
 ┣ 📂application
 ┃ ┗ 📂usecases
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂dto <!-- 데이터 정의 -->
 ┃ ┃ ┃ ┃ ┣ 📜index.ts <!-- 통합 export -->
 ┃ ┃ ┃ ┃ ┗ 📜user-login-dto.ts 
 ┃ ┃ ┃ ┗ 📜user-usecase.ts <!-- 비즈니스 로직 작성 -->
 ┃ ┃ ┗ 📜index.ts
 ┣ 📂components <!-- 공용 컴포넌트 -->
 ┃ ┣ 📂header
 ┃ ┃ ┣ 📜dropdown.module.css
 ┃ ┃ ┣ 📜dropdown.tsx
 ┃ ┃ ┣ 📜horizontal-logo.module.css
 ┃ ┃ ┣ 📜horizontal-logo.tsx
 ┃ ┃ ┣ 📜index.module.css
 ┃ ┃ ┗ 📜index.tsx
 ┣ 📂constants <!-- 상수 관리 -->
 ┃ ┣ 📜feedback.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜login.ts
 ┣ 📂docs <!-- 문서 -->
 ┃ ┗ 📜file_tree.md
 ┣ 📂domain
 ┃ ┗ 📂repositories <!-- 레포지토리 타입 정의 -->
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜user-repository.ts
 ┣ 📂hooks <!-- 커스텀 훅 -->
 ┃ ┣ 📜use-debounce.ts
 ┃ ┗ 📜useInterval.ts
 ┣ 📂infrastructure
 ┃ ┗ 📂repositories <!-- 데이터베이스와 통신 -->
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜pg-user-repository.ts
 ┣ 📂prisma
 ┃ ┗ 📜schema.prisma
 ┣ 📂public
 ┃ ┣ 📂images
 ┃ ┣ 📂marimo
 ┃ ┣ 📂pay-img
 ┃ ┣ 📂utils <!-- 워커에서 사용되는 유틸 -->
 ┃ ┃ ┣ 📜level-image.ts
 ┃ ┃ ┗ 📜random-location.ts
 ┃ ┣ 📂workers <!-- web-worker -->
 ┃ ┃ ┗ 📜trash-worker.ts
 ┃ ┗ 📜window.svg
 ┣ 📂stores <!-- 전역 상태 관리 -->
 ┃ ┣ 📜use-store.ts <!-- 상태 통합 -->
 ┃ ┗ 📜user-store.ts <!-- 각각의 상태 slice -->
 ┣ 📂types <!-- 타입 정의 -->
 ┃ ┗ 📜index.ts
 ┣ 📂utils <!-- 공용 유틸 -->
 ┃ ┗ 📜validate-email.ts
 ┣ 📜.env
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.json
 ┣ 📜.gitignore
 ┣ 📜.prettierrc.json
 ┣ 📜README.md
 ┣ 📜middleware.ts
 ┣ 📜next-env.d.ts
 ┣ 📜next.config.ts
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜playwright.config.ts
 ┣ 📜tsconfig.json
 ┗ 📜vitest.config.ts