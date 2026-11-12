"""Comprueba enlaces documentales; un bloqueo HTTP no se convierte en enlace correcto."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import re, json, datetime, sys

root=Path(__file__).resolve().parents[1]
files=[root/'README.md',root/'REFERENCIAS.md']+sorted((root/'docs').rglob('*.md'))
local=[];external=set();failures=[]
for file in files:
    content=re.sub(r'```.*?```','',file.read_text(),flags=re.S)
    urls=re.findall(r'\[[^\]]*\]\(([^\s)]+)\)',content)+re.findall(r'(?:src|href)="([^"]+)"',content)
    for raw in urls:
        parsed=urlsplit(raw)
        if parsed.scheme in ('https','http'):external.add(raw);continue
        if raw.startswith('#') or parsed.scheme:continue
        target=(file.parent/unquote(parsed.path)).resolve()
        ok=target.exists() and (target==root or root in target.parents)
        item={'source':str(file.relative_to(root)),'target':raw,'exists':ok};local.append(item)
        if not ok:failures.append(item)
def check(url):
    try:
        with urlopen(Request(url,headers={'User-Agent':'RenaissanceLexiconLinkCheck/1.0'}),timeout=25) as r:
            return {'url':url,'httpStatus':r.status,'status':'VERIFICADO' if r.status<400 else 'BLOQUEADO'}
    except Exception as e:
        code=getattr(e,'code',None)
        return {'url':url,'httpStatus':code,'status':'ROTO' if code in (404,410) else 'BLOQUEADO','error':str(e)}
with ThreadPoolExecutor(max_workers=6) as pool:remote=list(pool.map(check,sorted(external)))
report={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'documents':len(files),'local':local,'external':remote,'failures':failures+[r for r in remote if r['status']=='ROTO'],'blocked':[r for r in remote if r['status']=='BLOQUEADO']}
output=root/(sys.argv[1] if len(sys.argv)>1 else 'artifacts/links-report.json');output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'localLinks':len(local),'externalLinks':len(remote),'broken':len(report['failures']),'blocked':len(report['blocked']),'report':str(output)}))
if report['failures']:sys.exit(1)
