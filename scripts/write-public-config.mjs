import { writeFileSync } from 'node:fs';

const apiBaseUrl = process.env['SPRING_API_URL']?.trim() || '/api/v1';

if (!apiBaseUrl.startsWith('/')) {
  const parsedUrl = new URL(apiBaseUrl);
  if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost') {
    throw new Error('SPRING_API_URL must use HTTPS outside localhost.');
  }
}

const config = JSON.stringify({ apiBaseUrl });
writeFileSync('public/runtime-config.js', `window.__APP_CONFIG__ = ${config};\n`);