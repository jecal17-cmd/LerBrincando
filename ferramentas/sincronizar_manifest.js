/* Sincroniza audio/manifest.json e audio/manifest.js.
   O jogo lê manifest.js (funciona até por duplo clique); o Service Worker (modo offline) e os testes leem
   manifest.json. Se uma geração for interrompida, os dois podem ficar diferentes. Este script junta os dois:
   - itens do manifest.json têm prioridade (são os mais novos);
   - itens que só existem no manifest.js entram marcados como "legado" (o gerar_audios.py os refaz na próxima rodada);
   - itens cujo arquivo .mp3 não existe são removidos;
   - com ffprobe instalado, a duração (ms) dos itens legados é medida no próprio arquivo.
   Uso: node ferramentas/sincronizar_manifest.js [pasta]   (padrão: audio/) */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const pasta = path.resolve(process.argv[2] || path.join(__dirname, '..', 'audio'));
const pJson = path.join(pasta, 'manifest.json');
const pJs = path.join(pasta, 'manifest.js');

function lerJs(p) {
  if (!fs.existsSync(p)) return null;
  const s = fs.readFileSync(p, 'utf8');
  return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
}
const doJson = fs.existsSync(pJson) ? JSON.parse(fs.readFileSync(pJson, 'utf8')) : null;
const doJs = lerJs(pJs);
if (!doJson && !doJs) { console.log('Nenhum manifest encontrado em', pasta); process.exit(0); }

let temFfprobe = true;
const medirMs = (arq) => {
  if (!temFfprobe) return null;
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq], { encoding: 'utf8' });
    const v = parseFloat(out); return Number.isFinite(v) ? Math.round(v * 1000) : null;
  } catch (e) { temFfprobe = false; return null; }
};

const base = Object.assign({}, doJs || {}, doJson || {});
const itens = {};
let novos = 0; let removidos = 0; let medidos = 0;
const existe = (v) => v && v.arquivo && fs.existsSync(path.join(pasta, v.arquivo));
Object.entries((doJson && doJson.itens) || {}).forEach(([k, v]) => { if (existe(v)) itens[k] = v; else removidos++; });
Object.entries((doJs && doJs.itens) || {}).forEach(([k, v]) => {
  if (itens[k]) return;
  if (!existe(v)) { removidos++; return; }
  const item = Object.assign({}, v, { legado: true });
  // os tempos do karaokê (palavras/silabas) já vêm do próprio arquivo; só a duração total é conferida
  const ms = medirMs(path.join(pasta, v.arquivo));
  if (ms && Math.abs(ms - v.ms) > 150) { item.ms = ms; medidos++; }
  itens[k] = item; novos++;
});
base.itens = itens;
base.atribuicoes = (doJson && doJson.atribuicoes && doJson.atribuicoes.length ? doJson.atribuicoes : (doJs && doJs.atribuicoes)) || [];
if (!base.gerado && doJs && doJs.gerado) base.gerado = doJs.gerado;
base.sincronizado = new Date().toISOString().slice(0, 16).replace('T', ' ');

fs.writeFileSync(pJson, JSON.stringify(base));
fs.writeFileSync(pJs, 'window.AUDIO_MANIFEST = ' + JSON.stringify(base) + ';\n');

const semManifest = fs.readdirSync(pasta).filter((f) => f.endsWith('.mp3') && !Object.values(itens).some((v) => v.arquivo === f));
console.log(`Manifest sincronizado: ${Object.keys(itens).length} itens (${novos} recuperados do manifest.js como "legado", ${removidos} sem arquivo removidos, ${medidos} durações medidas).`);
if (semManifest.length) console.log(`Aviso: ${semManifest.length} arquivos .mp3 não aparecem no manifest (ex.: ${semManifest.slice(0, 5).join(', ')}).`);
