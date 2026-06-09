import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');
const uniDir = path.join(root, 'src/components/vant-uni');
const excluded = new Set(['common', 'definitions', 'mixins', 'wxs']);

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function findObjectBody(source, key) {
  const keyIndex = source.indexOf(key);
  if (keyIndex === -1) return '';
  const start = source.indexOf('{', keyIndex);
  if (start === -1) return '';

  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) {
      return source.slice(start + 1, index);
    }
  }

  return '';
}

function objectBodyFromStart(source, start) {
  if (start === -1) return '';

  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) {
      return source.slice(start + 1, index);
    }
  }

  return '';
}

function normalizeKey(key) {
  return key
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\?$/, '');
}

function topLevelKeys(body) {
  const keys = [];
  let depth = 0;
  let quote = '';
  let escaped = false;
  let token = '';
  let atKeyStart = true;

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];

    if (quote) {
      token += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      token += char;
      continue;
    }

    if (char === '{' || char === '[' || char === '(') depth += 1;
    if (char === '}' || char === ']' || char === ')') depth -= 1;

    if (depth === 0 && char === ':') {
      const key = normalizeKey(token);
      if (/^[A-Za-z_$][\w$-]*$/.test(key)) {
        keys.push(key);
      }
      token = '';
      atKeyStart = false;
      continue;
    }

    if (depth === 0 && (char === ',' || char === ';')) {
      token = '';
      atKeyStart = true;
      continue;
    }

    if (depth === 0 && atKeyStart) {
      token += char;
    }
  }

  return [...new Set(keys)];
}

function extractPackageProps(source) {
  return topLevelKeys(findObjectBody(source, 'props:'));
}

function extractUniProps(source) {
  const propsIndex = source.indexOf('defineProps<');
  if (propsIndex === -1) return [];
  const start = source.indexOf('{', propsIndex);
  if (start === -1) return [];
  return topLevelKeys(objectBodyFromStart(source, start));
}

function extractPackageEmits(source) {
  return [...source.matchAll(/\$emit\(\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function extractUniEmits(source) {
  const body = source.slice(source.indexOf('defineEmits'));
  if (!body) return [];
  return [...body.matchAll(/event:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

const dirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !excluded.has(name))
  .filter((name) => fs.existsSync(path.join(packagesDir, name, 'index.ts')))
  .sort();

const rows = dirs.map((name) => {
  const packageSource = read(path.join(packagesDir, name, 'index.ts'));
  const uniSource = read(path.join(uniDir, `uni-${name}.vue`));
  const sourceProps = extractPackageProps(packageSource);
  const uniProps = extractUniProps(uniSource);
  const sourceEmits = [...new Set(extractPackageEmits(packageSource))];
  const uniEmits = [...new Set(extractUniEmits(uniSource))];
  const missingProps = sourceProps.filter((prop) => !uniProps.includes(prop));
  const missingEmits = sourceEmits.filter((event) => !uniEmits.includes(event));
  return {
    component: name,
    sourceProps: sourceProps.length,
    uniProps: uniProps.length,
    sourceEmits: sourceEmits.length,
    uniEmits: uniEmits.length,
    missingProps,
    missingEmits,
  };
});

const incomplete = rows.filter((row) => row.missingProps.length || row.missingEmits.length);
console.log(JSON.stringify({ components: rows.length, incomplete }, null, 2));
