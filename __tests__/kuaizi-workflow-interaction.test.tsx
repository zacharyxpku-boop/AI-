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
      expect(html).toContain('素材已齐');
      expect(html).toContain(actionLabel);
      expect(html).toContain('生成预览');
      expect(html).toContain('等待点击生成');
      expect(html).toContain('先填写商品，再点击生成');
      expect(html).toContain('这一步会告诉用户当前页面到底产出什么。');
    }
  });
});
