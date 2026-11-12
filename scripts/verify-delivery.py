"""Relaciona Git, Pages, evidencia y ZIP sin insertar hashes circulares en Git."""
from pathlib import Path
from zipfile import ZipFile
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,subprocess,datetime

root=Path(__file__).resolve().parents[1]
def git(*args):return subprocess.check_output(['git',*args],cwd=root).decode().strip()
def api(endpoint):return json.loads(subprocess.check_output(['gh','api','repos/mmorfe-engineer/renaissance-js-uvm-e4-1/'+endpoint],cwd=root))
def digest(data):return hashlib.sha256(data).hexdigest()
def read(name):return json.loads((root/name).read_text())
head=git('rev-parse','HEAD');assert git('branch','--show-current')=='main'
origin='https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git'
assert git('remote','get-url','origin')==git('remote','get-url','--push','origin')==origin
assert not git('status','--porcelain'),'Worktree must be clean'
assert api('commits/main')['sha']==head,'Remote main mismatch'
tracked=set(filter(None,subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0')))
manifest=read('dist/SHA256SUMS.json');assert set(manifest)==tracked,{'missing':sorted(tracked-set(manifest)),'extra':sorted(set(manifest)-tracked)}
archive=root/'dist/renaissance-lexicon-e4-1.zip'
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(tracked)
    for name,value in manifest.items():
        data=z.read('renaissance-lexicon/'+name)
        assert digest(data)==value==digest((root/name).read_bytes()),name
        assert data==subprocess.check_output(['git','show',head+':'+name],cwd=root),name
unit=read('docs/evidencias/cierre/unit-report.json')
for name,value in unit['sourceSHA256'].items():assert digest((root/name).read_bytes())==value,name
browser=read('docs/evidencias/cierre/browser-report.json')
public=read('artifacts/public-report.json');assert public['sourceCommit']==head
assert not public['failures'] and public['httpStatus']==200
links=read('artifacts/links-report.json');assert not links['failures']
manual=read('docs/evidencias/cierre/manual-audio-report.json')
assert manual['status']=='EJECUTADA_SIN_REPRODUCCION_AUDIBLE'
assert {r['word'] for r in manual['results']}=={'cat','house','street','hello'}
assert all(r['audiblePlayback'] is False and r['httpStatusMeasuredInManualReview'] is None for r in manual['results'])
for word in ('cat','house','street'):assert manual['httpEvidence'][word] is None
for name in ('README.md','docs/CUMPLIMIENTO_PLIEGO.md','docs/VALIDACION.md','docs/ENTREGA.md'):
    text=(root/name).read_text();assert 'TR-22' in text and 'dependencia externa' in text,name
row=next(line for line in (root/'docs/CUMPLIMIENTO_PLIEGO.md').read_text().splitlines() if line.startswith('| TR-22 |'))
assert row.split('|')[-2].strip()=='BLOQUEADO'
assert public['manual']['humanListening']==manual['status']
site='https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/'
resources=sorted(n for n in tracked if n=='index.html' or n=='README.md' or n.startswith(('css/','js/','assets/','docs/assets/')))
def verify(name):
    with urlopen(site+name,timeout=45) as r:assert r.status==200;data=r.read()
    assert data==(root/name).read_bytes(),'Published mismatch: '+name
    return {'file':name,'httpStatus':200,'sha256':digest(data)}
with ThreadPoolExecutor(max_workers=8) as pool:remote=list(pool.map(verify,resources))
runs=api('actions/runs?per_page=20')['workflow_runs']
deployment=next(r for r in runs if r['head_sha']==head and r['name']=='pages build and deployment')
assert deployment['conclusion']=='success',(deployment['status'],deployment['conclusion'])
pr=api('pulls/1');assert pr['merged']
collaborator=[]
for sha in ['258af14457e74b76fd4145665550d890a2e8ab91','530ed50bcd11d3e79ebe8a045c3fe52705027351']:
    c=api('commits/'+sha);assert c['author']['login']==c['committer']['login']=='morfemartin'
    subprocess.run(['git','merge-base','--is-ancestor',sha,head],cwd=root,check=True)
    collaborator.append({'sha':sha,'author':c['author']['login'],'committer':c['committer']['login'],'authorMetadata':c['commit']['author'],'committerMetadata':c['commit']['committer'],'message':c['commit']['message']})
commits=api('commits?per_page=100')
report={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'Cierre tecnico de repositorio/Pages verificado; TR-22 bloqueado por dependencia externa','technicalScope':'Repositorio, documentacion, validacion automatizada, Pages e integridad; video excluido','repository':'https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1','url':site,'branch':'main','head':head,'remoteHeadVerified':True,'worktreeClean':True,'deployment':{'url':deployment['html_url'],'head_sha':deployment['head_sha'],'status':deployment['status'],'conclusion':deployment['conclusion']},'academic':{'university':'Universidad Valle del Momboy','course':'FrontEndIVIVFI2026C · Taller Front End','activity':'E-Actividad 4.1 — Aplicar conocimientos en ejercicio práctico de JS','option':'#2 · Diccionario Web con Dictionary API','weight':'15 %','deadline':'2026-11-14 23:59 America/Caracas','professor':'Anggelo Huz','students':[{'name':'Martin Morfe.°.','ci':'8.263.711','github':'mmorfe-engineer'},{'name':'Martin Alejandro Morfe Carballo','ci':'30.539.018','github':'morfemartin'}]},'pullRequest':{'number':1,'url':pr['html_url'],'merged':pr['merged'],'mergeCommit':pr['merge_commit_sha'],'method':'merge normal; ambos commits originales siguen siendo ancestros'},'collaboratorCommits':collaborator,'ownerCommits':[{'sha':c['sha'],'message':c['commit']['message'],'author':c['author']['login'] if c['author'] else None} for c in commits if c['author'] and c['author']['login']=='mmorfe-engineer'],'tests':{'unit':unit,'browser':browser,'sameApplicationSourceVerifiedBySHA256':True},'publicCheck':public,'liveCheck':read('artifacts/live-report.json'),'compliance':read('docs/evidencias/cierre/compliance-summary.json'),'links':links,'publicResources':remote,'zip':{'path':str(archive.relative_to(root)),'sha256':digest(archive.read_bytes()),'files':len(tracked),'matchesTrackedHead':True},'manualAudioEvidence':read('docs/evidencias/cierre/manual-audio-report.json'),'TR22':{'status':'BLOQUEADO','reason':'dependencia externa','ownFunctionalityImplementedAndValidated':True,'publicAudiblePlaybackVerified':False,'substituteAPI':False,'ownAudio':False,'speechSynthesis':False},'video':{'url':None,'duration':None,'status':'PENDIENTE','inTechnicalScope':False},'pending':['Disponibilidad y reproduccion satisfactoria de audio externo','Revision humana completa de teclado/foco, zoom 200 % y lector de pantalla'],'academicDeliverablesOutsideTechnicalScope':['Video real de ambos integrantes <=10 minutos y URL accesible','Entrega manual en plataforma UVM']}
(root/'dist/FINAL_DELIVERY.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(root/'dist/renaissance-lexicon-e4-1.zip.sha256').write_text(report['zip']['sha256']+'  renaissance-lexicon-e4-1.zip\n')
summary=f'''# UVM E-ACTIVIDAD 4.1 · FINAL DELIVERY REPORT

Estado: {report['status']}.

- Repositorio: {report['repository']}
- Pages: {site}
- Rama: main
- HEAD: {head}
- Deployment: {deployment['html_url']} — success, HEAD coincidente.
- Datos: Universidad Valle del Momboy; FrontEndIVIVFI2026C · Taller Front End; E-Actividad 4.1, opcion #2; 15 %; 14/11/2026 23:59 Venezuela; profesor Anggelo Huz.
- Integrantes: Martin Morfe.°., C.I. 8.263.711, mmorfe-engineer; Martin Alejandro Morfe Carballo, C.I. 30.539.018, morfemartin.
- Arquitectura: HTML5, CSS personalizado, cinco modulos ES; Dictionary API, debounce, validacion, AbortController, normalizacion y DOM; audio alternativo; localStorage y matchMedia.
- Pliego: docs/CUMPLIMIENTO_PLIEGO.md; IDs TR internos, no oficiales. Estados: {json.dumps(report['compliance']['counts'],ensure_ascii=False)}.
- Unitarias: {unit['passed']} aprobadas, {unit['failed']} fallidas; codigo final coincide por hashes.
- Browser: {len(browser['checks'])} aprobadas, {len(browser['failures'])} fallidas. Publicas: {len(public['checks'])} aprobadas, {len(public['failures'])} fallidas.
- Responsive: 320, 375, 768, 1024 y 1440 px; sin overflow y controles >=44 px.
- Accesibilidad: axe y teclado automatizado aprobados; no certificacion WCAG. Revisiones humanas pendientes.
- API/audio: ver capas separadas en FINAL_DELIVERY.json; estado publico {public['status']}, API {public.get('api')}, reproduccion {public.get('playback',{}).get('status')}.
- Capturas: docs/assets/screenshots; cinco vistas reales de Pages con leyendas en README. Son del codigo integrado, cuyos bytes coinciden con el HEAD final.
- Colaborador: 258af14457e74b76fd4145665550d890a2e8ab91 y 530ed50bcd11d3e79ebe8a045c3fe52705027351; author y committer morfemartin intactos. PR #1, merge normal {pr['merge_commit_sha']}.
- Reparto: propietario, nucleo/integracion/docs/Pages; colaborador, pronunciaciones/fallback/control accesible/CSS/tests y revision documentada. Todos los commits del propietario constan en FINAL_DELIVERY.json.
- Prueba manual del usuario en Pages: cat, house, street y hello sin reproduccion audible. HTTP de cat/house/street no medido; no se les atribuye 404.
- TR-22: BLOQUEADO — dependencia externa. Logica propia implementada y validada con recursos controlados; sin segunda API, audio propio ni SpeechSynthesis para fabricar PASS.
- Video: entregable academico separado, excluido de esta fase tecnica; pendiente.
- ZIP: dist/renaissance-lexicon-e4-1.zip; {len(tracked)} archivos, iguales a Git.
- SHA-256: {report['zip']['sha256']}
- Recursos publicos: {len(remote)} comparados byte por byte con HEAD; incluye runtime, README, graficos y capturas.
- Enlaces documentales: {len(links['local'])} locales y {len(links['external'])} externos; rotos {len(links['failures'])}, bloqueados {len(links['blocked'])}.

Pendientes tecnicos: reproduccion satisfactoria de audio externo; teclado/foco completo humano, zoom real 200 % y lector. El intento de escucha ya se ejecuto y no fue audible. Video y entrega UVM son entregables academicos fuera de esta fase tecnica. Ningun dato academico solicitado esta pendiente. La aplicacion publica corresponde al HEAD final indicado.
'''
(root/'dist/FINAL_DELIVERY_REPORT.md').write_text(summary)
print(json.dumps({'head':head,'deployment':report['deployment'],'zip':report['zip'],'resourcesVerified':len(remote),'collaboratorAuthorshipPreserved':True,'linksBroken':len(links['failures']),'linksBlocked':len(links['blocked'])},indent=2))
