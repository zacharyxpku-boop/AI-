import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';

describe('kuaizi workflow console', () => {
  it.each([
    {
      active: 'creative' as const,
      title: '先把商品资料变成客户能直接选择的卖点脚本',
      pillar: '商品 brief',
      proof: '客户不用理解模块，只看今天先拍什么。',
      next: '/factory/create?variant=friend_trial',
    },
    {
      active: 'create' as const,
      title: '把商品图、模特图、证明图和客服素材整理成货架',
      pillar: '模特生图任务包',
      proof: '每张图都有用途、输入、质量检查和回退路径。',
      next: '/factory/video?variant=friend_trial',
    },
    {
      active: 'video' as const,
      title: '先稳定出片，后续增强视频和数字人能力',
      pillar: '稳定视频生产线',
      proof: '客户只看到时间线、字幕、成片、标题和发布包。',
      next: '/factory/cast?variant=friend_trial',
    },
    {
      active: 'cast' as const,
      title: '把内容变成客户自己能发布的多平台发布包',
      pillar: '平台发布文案',
      proof: '每个平台都有标题、首句、正文、标签和封面提示。',
      next: '/factory/manage?variant=friend_trial',
    },
    {
      active: 'manage' as const,
      title: '把链接、截图、CSV、云盘和客服问题变成下一轮动作',
      pillar: '回填收件箱',
      proof: '没有平台 API 也能判断下一轮方向。',
      next: '/factory?variant=friend_trial',
    },
  ])('keeps $active friend-trial workflow customer-readable and consistent', ({ active, title, pillar, proof, next }) => {
    const html = renderToStaticMarkup(<KuaiziWorkflowConsole active={active} />);

    expect(html).toContain('Wenai 商品增长工作台');
    expect(html).toContain(title);
    expect(html).toContain('客户能看到的系统能力');
    expect(html).toContain('清楚，不杂');
    expect(html).toContain(pillar);
    expect(html).toContain(proof);
    expect(html).toContain(next.replaceAll('&', '&amp;'));
    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');
    expect(html).toContain('不用外部登录也能推进');
    expect(html).not.toContain('provider-gated');
    expect(html).not.toContain('handoff_only');
  });
});
