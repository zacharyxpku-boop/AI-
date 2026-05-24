import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CastFactoryPage from '@/app/factory/cast/page';
import CreateFactoryPage from '@/app/factory/create/page';
import CreativeFactoryPage from '@/app/factory/creative/page';
import ManageFactoryPage from '@/app/factory/manage/page';
import VideoFactoryPage from '@/app/factory/video/page';

const pages = [
  { name: 'creative', page: CreativeFactoryPage, expected: '先把商品卖点写成能审核的脚本', next: '/factory/create?variant=friend_trial' },
  { name: 'create', page: CreateFactoryPage, expected: '把商品资料变成可复用素材货架', next: '/factory/video?variant=friend_trial' },
  { name: 'video', page: VideoFactoryPage, expected: '一组卖点生成多条内容任务', next: '/factory/cast?variant=friend_trial' },
  { name: 'cast', page: CastFactoryPage, expected: '发到平台，并留下发布证明', next: '/factory/manage?variant=friend_trial' },
  { name: 'manage', page: ManageFactoryPage, expected: '把发布证明和客户反馈交给负责人', next: '/factory?variant=friend_trial' },
];

describe('factory friend trial workflow pages', () => {
  it.each(pages)('renders Kuaizi-style workflow shell for $name', async ({ page, expected, next }) => {
    const element = await page({
      searchParams: Promise.resolve({ projectId: 'friend-demo', variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).toContain(expected);
    expect(html).toContain('provider 未配置前');
    expect(html).toContain('下一步助手');
    expect(html).not.toContain('fixed bottom-5 right-5');
    expect(html).toContain(next.replaceAll('&', '&amp;'));
    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');
  });
});
