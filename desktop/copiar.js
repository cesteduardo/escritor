/* Copia o aplicativo web (a pasta de cima) para desktop/app, que é o que
   vai dentro do instalador. Só entram os arquivos que o Escritor usa. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..'), destino = path.join(__dirname, 'app');
const fora = new Set(['desktop', '.git', '.github', '.gitignore', 'README.md', 'sw.js', 'manifest.webmanifest']);
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino);
for (const nome of fs.readdirSync(raiz)) {
  if (fora.has(nome)) continue;
  fs.cpSync(path.join(raiz, nome), path.join(destino, nome), { recursive: true });
}
console.log('app copiado para', destino);
