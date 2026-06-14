import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` to your GitHub repo name when deploying to GitHub Pages:
// e.g. if your repo is github.com/yourname/roi-calculator ? base: '/roi-calculator/'
// For a user/org site (yourname.github.io) use base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/roi-calculator/',
})
