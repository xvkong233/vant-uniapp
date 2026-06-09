import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'src/components/vant-uni');
const distDir = path.join(root, 'dist/vant-uniapp');
const esDir = path.join(distDir, 'es');

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

fs.rmSync(distDir, { recursive: true, force: true });
copyDir(sourceDir, esDir);

const sourceIndex = fs.readFileSync(path.join(sourceDir, 'index.ts'), 'utf8');
const jsIndex = sourceIndex.replace(/\.vue/g, '.vue');
fs.writeFileSync(path.join(esDir, 'index.js'), jsIndex);

for (const file of fs.readdirSync(esDir)) {
  if (file.endsWith('.vue')) {
    fs.writeFileSync(
      path.join(esDir, `${file}.d.ts`),
      "import type { DefineComponent } from 'vue';\ndeclare const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;\nexport default component;\n"
    );
  }
}

const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
writeJson(path.join(distDir, 'package.json'), {
  name: rootPackage.name,
  version: rootPackage.version,
  description: rootPackage.description,
  author: rootPackage.author,
  license: rootPackage.license,
  type: 'module',
  main: './es/index.js',
  module: './es/index.js',
  types: './es/index.d.ts',
  exports: {
    '.': {
      types: './es/index.d.ts',
      import: './es/index.js',
      default: './es/index.js',
    },
    './es/*': './es/*',
  },
  files: ['es'],
  publishConfig: rootPackage.publishConfig,
  repository: rootPackage.repository,
  homepage: rootPackage.homepage,
  keywords: rootPackage.keywords,
  peerDependencies: rootPackage.peerDependencies,
});

fs.copyFileSync(path.join(root, 'LICENSE'), path.join(distDir, 'LICENSE'));
fs.copyFileSync(path.join(root, 'README.md'), path.join(distDir, 'README.md'));
const declarationLines = [...sourceIndex.matchAll(/export \{ default as (\w+) \} from '\.\/([^']+)'/g)]
  .map((match) => `export { default as ${match[1]} } from './${match[2]}.vue';`)
  .join('\n');
fs.writeFileSync(path.join(esDir, 'index.d.ts'), `${declarationLines}\n`);

console.log(`Built package in ${path.relative(root, distDir)}`);
