"""Pack a local, self-contained review page without changing the production app."""
import base64
import json
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent
repo = root.parent.parent
data = json.loads((root / 'sources/manifest.json').read_text())
for group in data['groups']:
    png = root / group['image']
    group['data'] = 'data:image/png;base64,' + base64.b64encode(png.read_bytes()).decode()
source = 'const HEADER_SOURCE = ' + json.dumps(data, ensure_ascii=False).replace('<', '\\u003c') + ';'
mascot = 'data:image/png;base64,' + base64.b64encode((repo / 'assets/mascota-poses.png').read_bytes()).decode()
css = (root / 'preview.css').read_text().replace('__MASCOT__', mascot)
# Bundle only removes module export syntax. Domain function bodies remain unchanged.
domain = re.sub(r'^export ', '', (repo / 'domain.js').read_text(), flags=re.MULTILINE)
html = (root / 'template.html').read_text()
for key, content in [('CSS', css), ('SOURCE', source), ('DOMAIN', domain), ('RULES', (root / 'rules.js').read_text()), ('JS', (root / 'preview.js').read_text())]:
    html = html.replace('__' + key + '__', content)
output = root / 'Henris-mapeo-vista-previa.html'
output.write_text(html)
print(f'{output.name}: {output.stat().st_size:,} bytes; self-contained, no remote dependencies.')
