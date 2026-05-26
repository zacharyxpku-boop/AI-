import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import FactoryPage from '@/app/factory/page';

describe('factory page', () => {
  it('keeps the friend trial homepage focused on customer actions', async () => {
    const page = await FactoryPage({
      searchParams: Promise.resolve({ variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');

    expect(html).toContain('从一个商品，生成一整套可发布内容');
    expect(html).toContain('点一个入口，完成一件电商任务');
    expect(html).toContain('选商品');
    expect(html).toContain('先填一个商品');
    expect(html).toContain('这轮想达成什么');
    expect(html).toContain('用这个商品开始');
    expect(html).toContain('提交后直接进入对应子页面');
    expect(html).toContain('筷子式能力工作台');
    expect(html).toContain('不收缩功能');
    expect(html).toContain('云盘素材 / 工程 / 成片');
    expect(html).toContain('视频剪辑台');
    expect(html).toContain('矩阵发布');
    expect(html).toContain('生内容');
    expect(html).toContain('拿发布包');
    expect(html).toContain('看复盘');
    expect(html).toContain('客户自发布');
    expect(html).toContain('发布后回填');
    expect(html).toContain('最近商品项目');

    const customerHiddenTerms = [
      'GitHub',
      '开源学习',
      'Baoyu skills',
      'HyperFrames',
      'social-auto-upload',
      'cookie',
      'token',
      '多 worker',
      '对象存储',
      '平台数据接口',
      '展开交付边界',
      '展开高级开源',
    ];

    for (const term of customerHiddenTerms) {
      expect(html).not.toContain(term);
    }
  });
});
