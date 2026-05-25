import { rmSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const target = join(root, '.next');

try {
  rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  console.log('Removed .next cache');
} catch (err) {
  console.error('Could not remove .next — stop `npm run dev` and close other Node processes, then retry.');
  console.error(err);
  process.exit(1);
}
