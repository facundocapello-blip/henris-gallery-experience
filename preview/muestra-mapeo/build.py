import base64
import json
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent
repo = root.parent.parent
data = json.loads((root / 'source.json').read_text())
rules = subprocess.check_output(['node','--input-type=module','-e', "import fs from 'node:fs';import vm from 'node:vm';const r=vm.runInNewContext(fs.readFileSync('preview/mapeo/rules.js','utf8')+';RULES;');console.log(JSON.stringify(Object.entries(r).filter(([k,v])=>v.status==='pending').map(([column,v])=>({column,rule:v.rule}))));"], cwd=repo, text=True)
pending = json.loads(rules)
columns = json.loads((repo / 'preview/mapeo/sources/manifest.json').read_text())['groups'][0]['cells']
labels = {c['column']:c['label'] for c in columns}
for f in pending: f['label'] = labels[f['column']]
mascot = 'data:image/png;base64,' + base64.b64encode((repo / 'assets/mascota-poses.png').read_bytes()).decode()
css = (repo / 'preview/mapeo/preview.css').read_text().replace('__MASCOT__', mascot) + '\n' + (root/'sample.css').read_text()
html = (root/'template.html').read_text()
for key, value in dict(CSS=css, EXCEL='excel-continuo.png', DATA=json.dumps(data,ensure_ascii=False).replace('<','\\u003c'), PENDING=json.dumps(pending,ensure_ascii=False).replace('<','\\u003c'), JS=(root/'sample.js').read_text()).items():
    html = html.replace('__'+key+'__', value)
(root/'index.html').write_text(html)
print('Muestra 02 compilada. Tres campos auténticos; 26 pendientes conservados.')
