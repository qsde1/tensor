import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{    
    // proxy: {
    //   '/api/register': {
    //     target: 'http://127.0.0.1:8000/register',        
    //     changeOrigin: true,
    //   }
    // }
    
  },
  plugins: [react()],
})
