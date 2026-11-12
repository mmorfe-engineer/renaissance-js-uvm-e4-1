"""Entrega reproducible de fuentes; no incluye Git, secretos ni dependencias."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

root = Path(__file__).resolve().parents[1]
output = root / 'dist'
output.mkdir(exist_ok=True)
files = [root / name for name in ['index.html', 'README.md', 'REFERENCIAS.md', 'package.json', '.gitignore', '.nojekyll', 'EXECUTION_CONTEXT.md']]
for directory in ['css', 'js', 'assets', 'docs', 'tests', 'scripts', '.github']:
    files.extend(p for p in (root / directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
if (root / 'package-lock.json').exists():
    files.append(root / 'package-lock.json')
archive = output / 'renaissance-lexicon-e4-1.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as package:
    for file in sorted(files):
        package.write(file, str(Path('renaissance-lexicon') / file.relative_to(root)))
manifest = {str(file.relative_to(root)): hashlib.sha256(file.read_bytes()).hexdigest() for file in sorted(files)}
(output / 'SHA256SUMS.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'{archive}: {len(files)} archivos; SHA-256 {hashlib.sha256(archive.read_bytes()).hexdigest()}')
