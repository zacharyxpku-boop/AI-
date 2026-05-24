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
    expect(html).toContain('交付导航');
    expect(html).toContain('个交付节点');
    expect(html).toContain('客户只按步骤补资料');
    expect(html).toContain('模特生图');
    expect(html).toContain('模特生图先做成任务包');
    expect(html).toContain('个图片任务');
    expect(html).toContain('开源混剪');
    expect(html).toContain('大规模渲染队列');
    expect(html).toContain('多账号矩阵先不做自动登录');
    expect(html).toContain('超级 IP 和口播标题矩阵');
    expect(html).toContain('个账号人设');
    expect(html).toContain('开源能力适配器');
    expect(html).toContain('执行配方');
    expect(html).toContain('每个开源能力都落到输入、步骤、输出和验收');
    expect(html).toContain('客户看到的是一条商品增长流水线');
    expect(html).toContain('没有外部 provider 时的替代路径');
    expect(html).toContain('客户回填字段');
    expect(html).toContain('回填后系统看什么');
    expect(html).toContain('建议并发');
    expect(html).toContain('客服素材');
    expect(html).toContain('售前承接');
    expect(html).toContain('差评挽回');
    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).not.toContain('provider 待配置');
    expect(html).not.toContain('小W 在线');
    expect(html).not.toContain('fixed bottom-5 right-5');
    expect(html).not.toContain('86%');
  });
});
