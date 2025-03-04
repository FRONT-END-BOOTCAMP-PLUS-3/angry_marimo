import path from "path"
import dotenv from "dotenv"
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, ".env") })

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // Jest 스타일의 글로벌 API 사용 가능
    coverage: {
      provider: "v8", // 코드 커버리지 제공자 ('c8' 도 가능)
      reporter: ["text", "json", "html"], // 커버리지 리포트 형식
      all: true,
      exclude: ["node_modules", "test/**", "dist/**"],
    },
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"], // 특정 폴더 내 테스트 파일만 실행
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.e2e-spec.?(c|m)[jt]s?(x)",
    ], // 테스트에서 제외할 폴더
  },
  resolve: {
    alias: {
      "@marimo/": path.resolve(__dirname, "./"),
    },
  },
})
