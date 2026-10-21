import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], worker:{format:'es'}, optimizeDeps:{include:['onnxruntime-web/wasm','espeak-ng']}, base: './' });
