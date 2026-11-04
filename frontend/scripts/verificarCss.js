// Verificación de utilidades CSS compiladas (.flex{ y .grid{)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

execSync('vite build', { stdio: 'inherit' });
const dir = path.resolve('dist/assets');
const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.css'));
if (archivos.length === 0) {
  console.error('Error: no se generó ningún archivo CSS en dist/assets.');
  process.exit(1);
}
const css = archivos.map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const tieneFlex = css.includes('.flex{');
const tieneGrid = css.includes('.grid{');
if (!tieneFlex || !tieneGrid) {
  console.error('Error: el CSS generado no contiene utilidades requeridas (.flex{ o .grid{).');
  process.exit(1);
}
console.log('Verificación exitosa: dist/assets contiene .flex{ y .grid{');
