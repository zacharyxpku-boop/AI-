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
    expect(html).toContain('搜索工具 Ctrl K');
    expect(html).toContain('从一个商品，生成一整套可发布内容');
    expect(html).toContain('模特生图');
    expect(html).toContain('开源混剪');
    expect(html).toContain('大规模渲染队列');
    expect(html).toContain('多账号矩阵先不做自动登录');
    expect(html).toContain('开源能力适配器');
    expect(html).toContain('客户看到的是一条商品增长流水线');
    expect(html).toContain('没有外部 provider 时的替代路径');
    expect(html).toContain('建议并发');
    expect(html).toContain('客服素材');
    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).not.toContain('provider 待配置');
    expect(html).not.toContain('小W 在线');
    expect(html).not.toContain('fixed bottom-5 right-5');
    expect(html).not.toContain('86%');
  });
});
