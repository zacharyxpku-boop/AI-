import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import FactoryPage from '@/app/factory/page';

describe('factory page', () => {
  it('gives friend trial users a clear ecommerce workbench with real module links', async () => {
    const page = await FactoryPage({
      searchParams: Promise.resolve({ variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('AI 电商内容工作台');
    expect(html).toContain('Hi, what will we create today?');
    expect(html).toContain('AI工具');
    expect(html).toContain('素材云盘');
    expect(html).toContain('批量合成');
    expect(html).toContain('客户看得懂的生产记录');
    expect(html).toContain('推进前先确认');
  });
});
