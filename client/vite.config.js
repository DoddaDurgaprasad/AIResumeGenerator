import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Fixed the package name here!

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Silences those annoying Dart Sass color warnings
        silenceDeprecations: ['global-builtin', 'color-functions'],
      },
    },
  },
})