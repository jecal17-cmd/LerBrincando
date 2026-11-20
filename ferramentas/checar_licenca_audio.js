/* Confere a licença das vozes do Banco de Áudio antes de publicar.
   edge-tts (serviço "Ler em voz alta" do Edge) serve para uso pessoal, NÃO para app publicado ou vendido.
   Azure Speech (mesmas vozes, com licença), Kokoro (Apache-2.0), gravações Wikimedia (licença por arquivo)
   e recortes feitos a partir delas estão liberados.
   Uso: node ferramentas/checar_licenca_audio.js            → só informa
        node ferramentas/checar_licenca_audio.js --estrito  → falha (código 1) se houver som do edge-tts */
const fs = require('fs'); const path = require('path');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'audio', 'manifest.json'), 'utf8'));
const porOrigem = {}; const semLicenca = [];
for (const [k, it] of Object.entries(man.itens || {})) {
  const o = String(it.origem || 'desconhecida');
  porOrigem[o] = (porOrigem[o] || 0) + 1;
  if (/^edge/.test(o)) semLicenca.push(k);
}
const tipos = {}; semLicenca.forEach((k) => { const t = k.split('_')[0]; tipos[t] = (tipos[t] || 0) + 1; });
console.log('Sons por origem:', JSON.stringify(porOrigem));
if (!semLicenca.length) { console.log('✅ Nenhum som do edge-tts: o Banco de Áudio pode ser publicado.'); process.exit(0); }
const msg = `${semLicenca.length} sons ainda são do edge-tts (sem licença para app publicado): ${JSON.stringify(tipos)}. ` +
  'Regere com voz licenciada: aba Actions → "Banco de Áudio (voz licenciada)" → Run workflow (veja ANDROID.md, seção 7).';
if (process.argv.includes('--estrito')) {
  console.error((process.env.GITHUB_ACTIONS ? '::error::' : '❌ ') + msg);
  process.exit(1);
}
console.log((process.env.GITHUB_ACTIONS ? '::warning::' : '⚠️ ') + msg);
