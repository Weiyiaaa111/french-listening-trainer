import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./e2e',use:{launchOptions:{executablePath:process.env.CHROMIUM_PATH},baseURL:'http://127.0.0.1:5173'},webServer:{command:'npm run dev -- --port 5173',url:'http://127.0.0.1:5173',reuseExistingServer:true}});
