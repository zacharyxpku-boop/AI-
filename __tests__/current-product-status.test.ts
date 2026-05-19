import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('current product status report', () => {
  it('keeps the repo-facing status report aligned with the current product boundary', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/CURRENT_PRODUCT_STATUS.md'), 'utf8');

    expect(doc).toContain('Compose / Create / Cut / Cast / Manage');
    expect(doc).toContain('筷子科技级 live platform executor');
    expect(doc).toContain('docs/EXTERNAL_INTEGRATION_MATERIALS.md');
    expect(doc).toContain('91M+ creative output');
    expect(doc).toContain('42M+ video distribution');
    expect(doc).toContain('No provider callback');
    expect(doc).toContain('No platform OAuth');
    expect(doc).toContain('No ad account authorization');
    expect(doc).toContain('最终产品形态');
    expect(doc).toContain('Hookshot / Hookly');
    expect(doc).toContain('Creatify');
    expect(doc).toContain('Marpipe');
    expect(doc).toContain('Smartly.io');
    expect(doc).toContain('VidMob');
    expect(doc).toContain('Creatopy');
    expect(doc).toContain('Superads');
    expect(doc).toContain('Creative Harvest Acceptance Board');
    expect(doc).toContain('来源广度、重复采集、多模态解析、生产交接和复利学习');
    expect(doc).toContain('Cut Operating Checks');
    expect(doc).toContain('Cut 商用品质验收板');
    expect(doc).toContain('download/share/publish/approve fail-closed enforcement');
    expect(doc).toContain('资产访问门禁矩阵');
    expect(doc).toContain('广告投放止损与放量门禁');
    expect(doc).toContain('Ad Delivery Guardrails');
    expect(doc).toContain('品牌学习不能只是报告');
    expect(doc).toContain('内部还能继续解决');
    expect(doc).toContain('必须外部提供');
    expect(doc).toContain('不建议公开售卖为筷子科技等价平台');
  });
});
