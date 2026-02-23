/**
 * Snapshot Viewer — lists and prints all Jest snapshot files in the project.
 *
 * Usage:
 *   node scripts/view-snapshots.cjs              # show all snapshots
 *   node scripts/view-snapshots.cjs --list       # list snapshot files only
 *   node scripts/view-snapshots.cjs --file <name> # show snapshots matching a file name
 */

const fs = require('fs');
const path = require('path');

// ─── Helpers ────────────────────────────────────────────────────────
function findSnapFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findSnapFiles(full, results);
    } else if (entry.name.endsWith('.snap')) {
      results.push(full);
    }
  }
  return results;
}

function separator(label) {
  const line = '═'.repeat(70);
  return `\n${line}\n  ${label}\n${line}\n`;
}

// ─── CLI args ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
const listOnly = args.includes('--list');
const fileIdx = args.indexOf('--file');
const fileFilter = fileIdx !== -1 ? args[fileIdx + 1] : null;

// ─── Scan both server and client ────────────────────────────────────
const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, 'server', '__tests__'),
  path.join(root, 'client', 'src', '__tests__'),
];

let snapFiles = [];
for (const d of dirs) {
  if (fs.existsSync(d)) {
    snapFiles = snapFiles.concat(findSnapFiles(d));
  }
}

if (snapFiles.length === 0) {
  console.log('\n  No snapshot files found. Run "npm test" first to generate them.\n');
  process.exit(0);
}

if (fileFilter) {
  snapFiles = snapFiles.filter((f) =>
    f.toLowerCase().includes(fileFilter.toLowerCase())
  );
}

console.log(`\n  Found ${snapFiles.length} snapshot file(s):\n`);
snapFiles.forEach((f, i) => {
  const rel = path.relative(root, f);
  console.log(`  ${i + 1}. ${rel}`);
});

if (listOnly) {
  console.log('');
  process.exit(0);
}

// ─── Print snapshot contents ────────────────────────────────────────
console.log('');
for (const file of snapFiles) {
  const rel = path.relative(root, file);
  console.log(separator(rel));
  console.log(fs.readFileSync(file, 'utf-8'));
}

console.log('\n  TIP: To update snapshots run  npm test -- -u  (in server/ or client/)\n');
