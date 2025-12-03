const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const reportPath = path.join(repoRoot, 'reports', 'eslint-after-batch1-pretty.json');
const outJson = path.join(repoRoot, 'reports', 'eslint-deltas.json');
const outTxt = path.join(repoRoot, 'reports', 'eslint-deltas.txt');

const targets = [
  'src/scorm/ingest/manifest-parser.ts',
  'src/utils/logger.ts',
  'src/hooks/useLearningAnalytics.ts'
];

if (!fs.existsSync(reportPath)) {
  console.error('Report not found:', reportPath);
  process.exit(1);
}

const raw = fs.readFileSync(reportPath, 'utf8');
let arr;
try {
  arr = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse JSON:', err.message);
  process.exit(1);
}

const rule = '@typescript-eslint/no-explicit-any';
let total = 0;
const perFile = {};
for (const t of targets) perFile[t] = 0;

for (const file of arr) {
  const filePath = file.filePath || file.filename || file.file || '';
  const relative = filePath.replace(repoRoot + path.sep, '').split(/[\\/]/).join('/');
  if (!file.messages || !Array.isArray(file.messages)) continue;
  for (const m of file.messages) {
    if (m.ruleId === rule) {
      total++;
      // check if it's one of our targets by suffix
      for (const t of targets) {
        if (relative.endsWith(t)) {
          perFile[t] = (perFile[t] || 0) + 1;
        }
      }
    }
  }
}

const out = { rule, total, perFile };
fs.writeFileSync(outJson, JSON.stringify(out, null, 2), 'utf8');
fs.writeFileSync(outTxt, `Rule: ${rule}\nTotal: ${total}\n\nPer-file:\n${Object.entries(perFile).map(([k,v])=>`${k}: ${v}`).join('\n')}`, 'utf8');
console.log('Wrote', outJson, outTxt);
