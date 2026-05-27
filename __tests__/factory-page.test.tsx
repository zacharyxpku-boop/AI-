import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));

import FactoryPage from '@/app/factory/page';
import { redirect } from 'next/navigation';

describe('factory page', () => {
  it('defaults the customer entry to the friend trial workbench', async () => {
    const page = await FactoryPage({
      searchParams: Promise.resolve({}),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).not.toContain('bg-slate-950 px-6 py-8 text-white');
    expect(html).not.toContain('UI Variant Workflow');
  });

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
    expect(html).toContain('开始工作');
    expect(html).toContain('编导灵感');
    expect(html).toContain('素材生产');
    expect(html).toContain('合成量产');
    expect(html).toContain('投放分发');
    expect(html).toContain('筷子云盘');
    expect(html).toContain('手机协同');
    expect(html).toContain('直播切片');
    expect(html).toContain('创意洞察');
    expect(html).toContain('视频翻译');
    expect(html).toContain('矩阵宝');
    expect(html).toContain('KOC流量包');
    expect(html).toContain('评论管理');
    expect(html).toContain('生机 Agent');
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

  it('redirects non-customer variants away from the old dark factory shell', async () => {
    await expect(
      FactoryPage({
        searchParams: Promise.resolve({ variant: 'operator' }),
      }),
    ).rejects.toThrow('redirect:/factory?variant=friend_trial');

    expect(redirect).toHaveBeenCalledWith('/factory?variant=friend_trial');
  });
});
