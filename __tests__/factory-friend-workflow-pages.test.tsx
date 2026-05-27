import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CastFactoryPage from '@/app/factory/cast/page';
import CreateFactoryPage from '@/app/factory/create/page';
import CreativeFactoryPage from '@/app/factory/creative/page';
import ManageFactoryPage from '@/app/factory/manage/page';
import VideoFactoryPage from '@/app/factory/video/page';

const pages = [
  {
    name: 'creative',
    page: CreativeFactoryPage,
    expected: '先把商品资料变成客户能直接选择的卖点脚本',
    markers: ['开始工作', '编导灵感', 'AI 影棚', '数字人口播'],
    next: '/factory/create?variant=friend_trial',
  },
  {
    name: 'create',
    page: CreateFactoryPage,
    expected: '把商品图、模特图、证明图和客服素材整理成货架',
    markers: ['筷子云盘', '全部文件', '团队存储空间', '进入合成量产'],
    next: '/factory/video?variant=friend_trial',
  },
  {
    name: 'video',
    page: VideoFactoryPage,
    expected: '先稳定出片，后续增强视频和数字人能力',
    markers: ['素材调试', '极速裂变', '组合优化', '时间线', '生成视频'],
    next: '/factory/cast?variant=friend_trial',
  },
  {
    name: 'cast',
    page: CastFactoryPage,
    expected: '把内容变成客户自己能发布的多平台发布包',
    markers: ['矩阵宝发布', 'AI智能分发', '发布渠道', 'AI生成标题'],
    next: '/factory/manage?variant=friend_trial',
  },
  {
    name: 'manage',
    page: ManageFactoryPage,
    expected: '把链接、截图、CSV、云盘和客服问题变成下一轮动作',
    markers: ['创意洞察', '视频表现', '解析', '收藏'],
    next: '/factory?variant=friend_trial',
  },
];

describe('factory friend trial workflow pages', () => {
  it.each(pages)('renders Kuaizi-style workflow shell for $name', async ({ page, expected, markers, next }) => {
    const element = await page({
      searchParams: Promise.resolve({ projectId: 'friend-demo', variant: 'friend_trial' }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).toContain('工作流');
    expect(html).toContain('服务');
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
    expect(html).toContain('客户下一步');
    expect(html).not.toContain('写卖点脚本');
    expect(html).not.toContain('整理素材 / 图片');
    expect(html).not.toContain('视频 / 数字人');
    expect(html).not.toContain('Customer Next Step');
    expect(html).toContain('每个子页面都按同一条电商交付链路推进');
    expect(html).toContain('最后一公里');
    expect(html).toContain('每个子页面都保留同一个最后一公里边界');
    expect(html).toContain('Wenai 先做到可发布资产');
    expect(html).toContain('客户自己发布');
    expect(html).toContain('首版边界：客户自发布，发布后回填');
    expect(html).toContain(expected);
    for (const marker of markers) {
      expect(html).toContain(marker);
    }
    expect(html).toContain('这一页最后交付什么');
    expect(html).toContain('不用外部登录也能推进');
    expect(html).toContain('系统能力');
    expect(html).toContain('交付物');
    expect(html).toContain('任务板');
    expect(html).not.toContain('授权辅助');
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
