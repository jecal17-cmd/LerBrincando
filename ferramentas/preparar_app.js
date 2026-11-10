/* Monta a pasta www/ com só o que o app Android precisa (o Capacitor copia www/ para dentro do app).
   Uso: node ferramentas/preparar_app.js   (ou: npm run app:sync) */
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const WWW = path.join(RAIZ, 'www');

const ARQUIVOS = ['index.html', 'styles.css', 'nucleo.js', 'data.js', 'motor.js', 'validadores.js', 'visual.js', 'game.js', 'minijogos.js', 'cenas.js', 'manifest.webmanifest'];
const PASTAS = ['icones', 'imagens', 'fontes'];

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });
for (const f of ARQUIVOS) fs.copyFileSync(path.join(RAIZ, f), path.join(WWW, f));
for (const p of PASTAS) fs.cpSync(path.join(RAIZ, p), path.join(WWW, p), { recursive: true });

// Banco de Áudio: só os .mp3 que estão no manifest + o manifest.js (o jogo lê o .js)
const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'audio', 'manifest.json'), 'utf8'));
fs.mkdirSync(path.join(WWW, 'audio'));
let n = 0; let bytes = 0;
for (const it of Object.values(man.itens)) {
  const src = path.join(RAIZ, 'audio', it.arquivo);
  if (!fs.existsSync(src)) continue;
  fs.copyFileSync(src, path.join(WWW, 'audio', it.arquivo)); n++; bytes += fs.statSync(src).size;
}
fs.copyFileSync(path.join(RAIZ, 'audio', 'manifest.js'), path.join(WWW, 'audio', 'manifest.js'));
fs.copyFileSync(path.join(RAIZ, 'audio', 'manifest.json'), path.join(WWW, 'audio', 'manifest.json'));

// Conferência: o app não pode depender de nada da internet para abrir
const html = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8');
const externos = (html.match(/(?:src|href)="https?:\/\/[^"]+"/g) || []);
if (externos.length) { console.error('ERRO: index.html ainda carrega recursos da internet:', externos); process.exit(1); }
console.log(`www/ pronto: ${ARQUIVOS.length} arquivos, ${PASTAS.join(', ')}, ${n} sons (${(bytes / 1048576).toFixed(1)} MB).`);
