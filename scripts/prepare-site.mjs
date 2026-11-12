import { mkdir, cp, writeFile } from 'node:fs/promises';
await mkdir('dist/site', { recursive: true });
for (const item of ['index.html', 'css', 'js', 'assets']) await cp(item, `dist/site/${item}`, { recursive: true });
await writeFile('dist/site/.nojekyll', '');
console.log('Sitio estático preparado en dist/site');
