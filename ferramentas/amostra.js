const fs=require('fs');require('../nucleo.js');const src=fs.readFileSync(__dirname+'/../data.js','utf8');
const D=JSON.parse(src.slice(src.indexOf('{'),src.lastIndexOf('}')+1));const M=require('../motor.js')(D);
const N=require('../nucleo.js');M.usarRng(N.rngSemente(5));
const p=M.novoPerfil('x');
for(const id of process.argv.slice(2)){const i=D.fases.findIndex(f=>f.id===id);const its=M.gerarItens(i,p);
console.log('=== '+id+' '+D.fases[i].nome+' ('+its.length+' itens)');
its.forEach(it=>{const ped=(it.pedido||[]).map(s=>s.k[0]+':'+(s.t||s.ms)).join(' ');
console.log((it.revisao?'R ':'  ')+(it.guiado?'G ':'  ')+it.ui+'/'+it.tipo+' | '+ped+' | vis:'+JSON.stringify(it.visor||{}).slice(0,70)+' | ops:'+(it.opcoes||[]).map(o=>o.id+(o.id===it.certo?'*':'')).join(',')+(it.palavra?' pal:'+it.palavra:'')+(it.exemplos?' ex:'+it.exemplos:''))})}
