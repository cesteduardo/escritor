/* Escritor para Linux e Windows: uma janela do Electron em volta do mesmo
   aplicativo web. As notas ficam guardadas no próprio aplicativo, separadas
   das do navegador. */
const { app, BrowserWindow, shell, Menu, protocol, net } = require('electron');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

/* O aplicativo é servido por app://escritor/ e não por file://: com file:// o
   Chromium não deixa abrir o Web Worker do corretor ortográfico. */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);
const PASTA = path.join(__dirname, 'app');

let janela = null;
const arquivosPendentes = [];

function arquivosDosArgumentos(argv) {
  return argv.slice(1).filter((a) => /\.(md|markdown|txt)$/i.test(a) && fs.existsSync(a));
}

function entregar(caminhos) {
  if (!janela) { arquivosPendentes.push(...caminhos); return; }
  for (const c of caminhos) {
    const nome = path.basename(c);
    const texto = fs.readFileSync(c, 'utf8');
    janela.webContents.executeJavaScript(
      `abrirArquivo(new File([${JSON.stringify(texto)}], ${JSON.stringify(nome)}, { type: 'text/markdown' }))`
    ).catch(() => {});
  }
}

function criarJanela() {
  janela = new BrowserWindow({
    width: 1200, height: 860, minWidth: 360, minHeight: 480,
    title: 'Escritor',
    icon: path.join(__dirname, 'app', 'icons', process.platform === 'win32' ? 'icon.ico' : 'icon-512.png'),
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: false }
  });
  Menu.setApplicationMenu(null);
  janela.loadURL('app://escritor/index.html');
  /* links externos (grbrands.com.br, licenças) abrem no navegador */
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  janela.webContents.on('will-navigate', (e, url) => {
    if (/^https?:/.test(url)) { e.preventDefault(); shell.openExternal(url); }
  });
  janela.webContents.on('did-finish-load', () => entregar(arquivosPendentes.splice(0)));
  janela.on('closed', () => { janela = null; });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  arquivosPendentes.push(...arquivosDosArgumentos(process.argv));
  app.on('second-instance', (_e, argv) => {
    if (janela) { if (janela.isMinimized()) janela.restore(); janela.focus(); }
    entregar(arquivosDosArgumentos(argv));
  });
  app.whenReady().then(() => {
    protocol.handle('app', (req) => {
      const rel = decodeURIComponent(new URL(req.url).pathname).replace(/^\/+/, '') || 'index.html';
      const alvo = path.normalize(path.join(PASTA, rel));
      if (!alvo.startsWith(PASTA)) return new Response('', { status: 403 });
      return net.fetch(pathToFileURL(alvo).toString());
    });
    criarJanela();
  });
  app.on('window-all-closed', () => app.quit());
}
