import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CastFactoryPage from '@/app/factory/cast/page';
import CreateFactoryPage from '@/app/factory/create/page';
import CreativeFactoryPage from '@/app/factory/creative/page';
import ManageFactoryPage from '@/app/factory/manage/page';
import VideoFactoryPage from '@/app/factory/video/page';

const pages = [
  { name: 'creative', page: CreativeFactoryPage, expected: '先把商品资料变成客户能直接选择的卖点脚本', next: '/factory/create?variant=friend_trial' },
  { name: 'create', page: CreateFactoryPage, expected: '把商品图、模特图、证明图和客服素材整理成货架', next: '/factory/video?variant=friend_trial' },
  { name: 'video', page: VideoFactoryPage, expected: '本地混剪先稳定出片，视频和数字人 Key 到位后增强', next: '/factory/cast?variant=friend_trial' },
  { name: 'cast', page: CastFactoryPage, expected: '把内容变成客户自己能发布的多平台发布包', next: '/factory/manage?variant=friend_trial' },
  { name: 'manage', page: ManageFactoryPage, expected: '把链接、截图、CSV、云盘和客服问题变成下一轮动作', next: '/factory?variant=friend_trial' },
];

describe('factory friend trial workflow pages', () => {
  it.each(pages)('renders Kuaizi-style workflow shell for $name', async ({ page, expected, next }) => {
    const element = await page({
      searchParams: Promise.resolve({ projectId: 'friend-demo', variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).toContain('客户下一步');
    expect(html).not.toContain('Customer Next Step');
    expect(html).toContain('每个子页面都按同一条电商交付链路推进');
    expect(html).toContain('Last Mile');
    expect(html).toContain('每个子页面都保留同一个最后一公里边界');
    expect(html).toContain('开源混剪做到可发布资产');
    expect(html).toContain('客户自己发布');
    expect(html).toContain('首版不碰：自动登录、代发、后台数据 API');
    expect(html).toContain(expected);
    expect(html).toContain('这一页最后交付什么');
    expect(html).toContain('不用外部登录也能推进');
    expect(html).not.toContain('provider 未配置前');
    expect(html).not.toContain('fixed bottom-5 right-5');
    expect(html).toContain(next.replaceAll('&', '&amp;'));
    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');
  });
});
