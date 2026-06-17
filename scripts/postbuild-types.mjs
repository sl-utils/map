import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const files = [
  {
    path: resolve('types/index.d.ts'),
    content: "export * from './generated/src/index';\n",
  },
  {
    path: resolve('types/generated/src/types/index.d.ts'),
    content: "export * from '../../../../src/types/index';\n",
  },
];

for (const file of files) {
  await mkdir(dirname(file.path), { recursive: true });
  await writeFile(file.path, file.content, 'utf8');
}
