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
    expect(html).toContain('/factory/manage?variant=friend_trial');
    expect(html).toContain('AI 电商内容工作台');
    expect(html).toContain('Hi, what will we create today?');
    expect(html).toContain('内容审核');
    expect(html).toContain('发布证明');
    expect(html).toContain('销售跟进');
    expect(html).toContain('只把真实反馈、客户确认和负责人交给销售继续谈。');
    expect(html).not.toContain('86%');
  });
});
