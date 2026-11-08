import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 개발 서버(npm run dev) 설정
  server: {
    // 프록시 = 프론트(5173)로 들어온 /api 요청을 Vite가 대신 백엔드(3000)로 전달해 줌
    // 브라우저 입장에선 같은 주소(5173)로만 요청하니까 CORS 에러가 생기지 않아요
    proxy: {
      '/api': 'http://localhost:3000', // /api/posts → http://localhost:3000/api/posts
    },
  },
})
