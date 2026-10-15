"""Render one continuous, anonymized A1:AN3 range from the real workbook."""
import hashlib
import json
import pathlib
import subprocess
import sys
import tempfile
import fitz
import openpyxl
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.page import PageMargins

root = pathlib.Path(__file__).resolve().parent
source = pathlib.Path(sys.argv[1])
original_hash = hashlib.sha256(source.read_bytes()).hexdigest()
book = openpyxl.load_workbook(source, data_only=False)
sheet = book['Hoja1']
sample = [{'cell': f'{col}3', 'column': col, 'label': sheet[f'{col}1'].value, 'value': str(sheet[f'{col}3'].value)} for col in ['D', 'E', 'F']]
headers = [str(sheet.cell(1, c).value) for c in range(1, 41)]
# Redact identity, free-text notes and externally traceable order references.
# Only the image of rows 1–3 is published; the original workbook is never shipped.
for row in [2, 3]:
    replacements = {'A': f'REF-0{row-1}', 'J': '[Nota oculta]', 'R': '[Receptor oculto]', 'V': '[Receptor oculto]',
                    'AG': '[DNI oculto]', 'AH': f'Cliente {row-1}', 'AI': '[Tel. oculto]', 'AJ': '[Mail oculto]', 'AN': f'WEB-0{row-1}'}
    for col, value in replacements.items():
        if sheet[f'{col}{row}'].value is not None:
            sheet[f'{col}{row}'] = value
sheet.print_area = 'A1:AN3'
sheet.print_options.headings = True
sheet.print_options.gridLines = True
sheet.sheet_properties.pageSetUpPr.fitToPage = True
sheet.page_setup.paperSize = None
sheet.page_setup.paperWidth = '5000pt'
sheet.page_setup.paperHeight = '300pt'
sheet.page_setup.orientation = 'portrait'
sheet.page_setup.fitToWidth = 1
sheet.page_setup.fitToHeight = 1
sheet.page_margins = PageMargins(left=.15, right=.15, top=.12, bottom=.12, header=0, footer=0)
for hf in [sheet.oddHeader, sheet.oddFooter, sheet.evenHeader, sheet.evenFooter, sheet.firstHeader, sheet.firstFooter]:
    for side in ['left', 'center', 'right']:
        getattr(hf, side).text = ''
with tempfile.TemporaryDirectory(prefix='henris-continuous-') as tmp:
    tmp = pathlib.Path(tmp)
    path = tmp / 'anonimizado.xlsx'
    book.save(path)
    subprocess.run(['soffice', f'-env:UserInstallation={(tmp/"profile").as_uri()}', '--headless', '--convert-to', 'pdf', '--outdir', str(tmp), str(path)], check=True, capture_output=True)
    doc = fitz.open(tmp / 'anonimizado.pdf')
    assert len(doc) == 1
    page = doc[0]
    drawings = page.get_drawings()
    bounds = fitz.Rect()
    for d in drawings: bounds |= d['rect']
    bounds = fitz.Rect(bounds.x0-4, bounds.y0-4, bounds.x1+4, bounds.y1+4)
    columns = sorted([d['rect'] for d in drawings if d['fill'] is None and 11 < d['rect'].height < 15 and d['rect'].width > 20], key=lambda r: r.x0)
    assert len(columns) == 40, len(columns)
    row_boxes = sorted([d['rect'] for d in drawings if d['fill'] is None and 25 < d['rect'].width < 30 and d['rect'].height > 30], key=lambda r:r.y0)
    # Deduplicate identical border rectangles if a renderer emits them twice.
    unique = {}
    for r in row_boxes: unique[round(r.y0, 1)] = r
    row_boxes = list(unique.values())
    assert len(row_boxes) == 3, row_boxes
    data_row = row_boxes[2]
    for item in sample:
        r = columns[openpyxl.utils.column_index_from_string(item['column'])-1]
        item.update(x=(r.x0-bounds.x0)/bounds.width, y=(data_row.y0-bounds.y0)/bounds.height,
                    width=r.width/bounds.width, height=data_row.height/bounds.height)
    root.mkdir(exist_ok=True, parents=True)
    image = page.get_pixmap(matrix=fitz.Matrix(3,3), clip=bounds)
    image.save(root / 'excel-continuo.png')
    # Verify that selected source values are present in the actual PDF rendering.
    text = page.get_text()
    for item in sample: assert item['value'] in text
    # Check known identifiers from the original row before retaining any output.
    raw_sheet = openpyxl.load_workbook(source, data_only=True)['Hoja1']
    for col in ['AG','AH','AI','AJ','AN']:
        original = raw_sheet[f'{col}2'].value
        if original is not None: assert str(original) not in text, f'Unredacted {col}2'
    meta = dict(file='pedidos.xlsx', sheet='Hoja1', range='A1:AN3', source_sha256=original_hash,
                width=image.width, height=image.height, sample=sample, headers=headers,
                redacted_columns=['A','J','R','V','AG','AH','AI','AJ','AN'],
                note='Captura continua de filas auténticas; identidad, notas y referencias anonimizadas en copia temporal.')
    (root / 'source.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2)+'\n')
assert hashlib.sha256(source.read_bytes()).hexdigest() == original_hash
print('Captura continua generada; fuente intacta y datos personales de la muestra anonimizados.')
