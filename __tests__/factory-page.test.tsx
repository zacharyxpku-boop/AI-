import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import FactoryPage from '@/app/factory/page';

describe('factory page', () => {
  it('gives friend trial users a clear ecommerce workbench with real module links and quick actions', async () => {
    const page = await FactoryPage({
      searchParams: Promise.resolve({ variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');
    expect(html).toContain('Hi, what will we create today?');
    expect(html).toContain('搜索工具 Ctrl K');
    expect(html).toContain('开始工作');
    expect(html).toContain('编写脚本');
    expect(html).toContain('AI影棚');
    expect(html).toContain('超级混剪 Pro');
    expect(html).toContain('进入卖点选择');
    expect(html).toContain('最近工程');
    expect(html).toContain('Current Task');
    expect(html).toContain('今天先确认哪一个商品？');
    expect(html).toContain('能力呈现');
    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).toContain('provider 待配置');
    expect(html).not.toContain('小W 在线');
    expect(html).not.toContain('fixed bottom-5 right-5');
    expect(html).not.toContain('86%');
  });
});
