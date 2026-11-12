import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const dir='docs/assets'; mkdirSync(dir,{recursive:true});
const read = name => JSON.parse(readFileSync(`docs/evidencias/cierre/${name}.json`,'utf8'));
const unit=read('unit-report'), browser=read('browser-report'), live=read('public-report');
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function chart(file,title,subtitle,rows,footer) {
  const max=Math.max(1,...rows.map(r=>r.value));
  const bars=rows.map((r,i)=>`<text x="32" y="${123+i*51}" class="label">${escape(r.label)}</text><rect x="240" y="${106+i*51}" width="${600*r.value/max}" height="25" rx="4" fill="${r.color}"/><text x="${255+600*r.value/max}" y="${124+i*51}" class="value">${r.value}</text>`).join('');
  const height=155+rows.length*51;
  writeFileSync(`${dir}/${file}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(rows.map(r=>`${r.label}: ${r.value}`).join('; '))}. ${escape(footer)}</desc><style>text{font-family:Arial,sans-serif;fill:#24333d}.label{font-size:15px}.value{font-size:16px;font-weight:bold}.note{font-size:12px;fill:#596a76}</style><rect width="1000" height="${height}" rx="14" fill="#faf9f6"/><rect x="1" y="1" width="998" height="${height-2}" rx="14" fill="none" stroke="#d9dedf"/><text x="32" y="42" font-size="25" font-family="Georgia,serif">${escape(title)}</text><text x="32" y="69" class="note">${escape(subtitle)}</text>${bars}<text x="32" y="${height-28}" class="note">${escape(footer)}</text></svg>`);
}
chart('verification-summary','Verification Summary',`Ejecución ${unit.date} · código ${unit.sourceCommit.slice(0,7)}`, [
  {label:'Unitarias aprobadas',value:unit.passed,color:'#244e70'},
  {label:'Navegador aprobadas',value:browser.checks.length,color:'#244e70'},
  {label:'Sitio público aprobadas',value:live.checks.length,color:'#244e70'},
  {label:'Fallos automáticos de UI',value:unit.failed+browser.failures.length+live.failures.length,color:'#9b302b'},
  {label:'Audios HTTP no disponibles',value:live.audioResources.filter(r=>!(r.httpStatus>=200&&r.httpStatus<300)).length,color:'#a16b23'}
], 'Fuente: docs/evidencias/cierre/*.json · Azul: aprobado; rojo: fallo UI; ámbar: dependencia externa.');
const table=readFileSync('docs/CUMPLIMIENTO_PLIEGO.md','utf8');
const states=['VERIFICADO','PENDIENTE','BLOQUEADO','NO APLICA'];
const counts=Object.fromEntries(states.map(s=>[s,0]));
for(const line of table.split('\n').filter(l=>/^\| TR-\d+ \|/.test(l))) { const state=line.split('|').at(-2).trim(); if(!(state in counts)) throw new Error(`Invalid state ${state}`); counts[state]++; }
chart('academic-compliance','Academic Compliance Status','Requisitos fieles al enunciado · IDs TR internos, sin numeración oficial', states.map((label,i)=>({label,value:counts[label],color:['#244e70','#a16b23','#9b302b','#75828b'][i]})),`Fuente: docs/CUMPLIMIENTO_PLIEGO.md · ejecución ${unit.date.slice(0,10)} · conteos de la matriz, no puntaje académico.`);
writeFileSync('docs/evidencias/cierre/compliance-summary.json',JSON.stringify({date:unit.date,source:'docs/CUMPLIMIENTO_PLIEGO.md',counts,total:Object.values(counts).reduce((a,b)=>a+b,0)},null,2)+'\n');
writeFileSync(`${dir}/hero.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" role="img" aria-labelledby="title desc"><title id="title">Renaissance Lexicon</title><desc id="desc">JavaScript Edition · UVM E-Actividad 4.1. Diccionario de inglés: significado, fonética y nuevas formas de aprender.</desc><rect width="1200" height="360" rx="16" fill="#faf9f6"/><path d="M42 42H1158V318H42Z" fill="none" stroke="#d9dedf"/><path d="M72 91H155" stroke="#244e70" stroke-width="3"/><text x="72" y="124" font-family="Arial,sans-serif" font-size="14" letter-spacing="2.2" fill="#244e70">JAVASCRIPT EDITION · UVM E-ACTIVIDAD 4.1</text><text x="68" y="197" font-family="Georgia,serif" font-size="66" fill="#24333d">Renaissance <tspan fill="#244e70" font-style="italic">Lexicon</tspan></text><text x="72" y="242" font-family="Arial,sans-serif" font-size="20" fill="#606970">Un diccionario de inglés. Una palabra, un nuevo significado.</text><text x="72" y="279" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="#244e70">HTML5 / CSS3 / JAVASCRIPT VANILLA / DICTIONARY API</text><g transform="translate(930 80)"><rect width="180" height="200" rx="8" fill="#edf2f5" stroke="#d9dedf"/><text x="28" y="91" font-family="Georgia,serif" font-size="75" fill="#244e70">R<tspan font-style="italic" font-size="54">l</tspan></text><path d="M28 125H152M28 142H131M28 159H142" stroke="#a8b9c5" stroke-width="2"/><text x="28" y="185" font-family="Arial,sans-serif" font-size="10" letter-spacing="2" fill="#244e70">READ · LISTEN · LEARN</text></g></svg>`);
console.log(JSON.stringify({unit:unit.passed,browser:browser.checks.length,public:live.checks.length,compliance:counts}));
