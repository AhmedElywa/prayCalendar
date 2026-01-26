const fs = require('node:fs');
const path = require('node:path');

const { VERCEL_DEPLOYMENT_ID, VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_REF } = process.env;

const cacheVersion = VERCEL_DEPLOYMENT_ID || VERCEL_GIT_COMMIT_SHA || VERCEL_GIT_COMMIT_REF || Date.now().toString();

const templatePath = path.join(__dirname, '../public/sw.template.js');
const outputPath = path.join(__dirname, '../public/sw.js');

let content = fs.readFileSync(templatePath, 'utf8');
content = content.replace('__CACHE_VERSION__', cacheVersion);

fs.writeFileSync(outputPath, content);
console.log(`Generated service worker with cache version: ${cacheVersion}`);
