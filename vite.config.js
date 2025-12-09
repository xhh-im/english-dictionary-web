import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 如果使用自定义域名，直接设置为 '/'
  base: '/',
  // base: process.env.NODE_ENV === 'production' ? '/english-dictionary-web/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'supabase': ['@supabase/supabase-js'],
          'chart': ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})

