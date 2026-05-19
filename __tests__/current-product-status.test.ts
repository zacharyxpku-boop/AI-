import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('current product status report', () => {
  it('keeps the repo-facing status report aligned with the current product boundary', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/CURRENT_PRODUCT_STATUS.md'), 'utf8');

    expect(doc).toContain('Compose / Create / Cut / Cast / Manage');
    expect(doc).toContain('Kuaizi-level live platform executor');
    expect(doc).toContain('docs/EXTERNAL_INTEGRATION_MATERIALS.md');
    expect(doc).toContain('91M+ creative output');
    expect(doc).toContain('42M+ video distribution');
    expect(doc).toContain('No provider callback');
    expect(doc).toContain('No platform OAuth');
    expect(doc).toContain('No ad account authorization');
  });
});
