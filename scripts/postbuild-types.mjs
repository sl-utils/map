import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';


const files = [
  // {
  //   path: resolve('types/index.d.ts'),
  //   content: "export * from './generated/src/index';\n",
  // },
  // {
  //   path: resolve('types/types/index.d.ts'),
  //   content: "export type * from '../../src/types/index';\n",
  // },
];

const entryPath = resolve('types/index.d.ts');
const entryImport = "export type * from '../src/types/index';\n";

const entryContent = await readFile(entryPath, 'utf8');

if (!entryContent.startsWith(entryImport)) {
  await writeFile(entryPath, `${entryImport}${entryContent}`, 'utf8');
}

// for (const file of files) {
//   await mkdir(dirname(file.path), { recursive: true });
//   await writeFile(file.path, file.content, 'utf8');
// }
