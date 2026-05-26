import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';

describe('KuaiziWorkflowConsole customer interaction', () => {
  it('renders an actionable customer input panel for each workflow step', () => {
    const steps = [
      ['creative', '生成卖点脚本'],
      ['create', '生成素材清单'],
      ['video', '生成内容版本'],
      ['cast', '生成发布包'],
      ['manage', '生成复盘建议'],
    ] as const;

    for (const [active, actionLabel] of steps) {
      const html = renderToStaticMarkup(<KuaiziWorkflowConsole active={active} />);

      expect(html).toContain('商品');
      expect(html).toContain('平台');
      expect(html).toContain('这轮目标');
      expect(html).toContain('当前任务：');
      expect(html).toContain('素材已齐');
      expect(html).toContain(actionLabel);
      expect(html).toContain('你先做');
      expect(html).toContain('Wenai 生成');
      expect(html).toContain('拿去用');
      expect(html).toContain('生成预览');
      expect(html).toContain('可交付结果');
      expect(html).toContain('整条任务进度');
      expect(html).toContain('本页怎么用');
      expect(html).toContain('等待点击生成');
      expect(html).toContain('先填写商品，再点击生成');
      expect(html).toContain('这一步会告诉用户当前页面到底产出什么。');
    }
  });

  it('keeps submitted task context visible after generation', () => {
    const html = renderToStaticMarkup(
      <KuaiziWorkflowConsole
        active="create"
        initialAssetReady
        initialAudienceGoal="测试新品首发"
        initialGenerated
        initialPlatform="TikTok"
        initialProductName="Demo Product"
      />,
    );

    expect(html).toContain('Demo Product');
    expect(html).toContain('TikTok');
    expect(html).toContain('测试新品首发');
    expect(html).toContain('已生成');
    expect(html).toContain('已按当前输入更新');
    expect(html).toContain('Demo Product 的素材任务');
    expect(html).toContain('围绕「测试新品首发」');
    expect(html).toContain('素材任务交付件');
  });
});
