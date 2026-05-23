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
    expect(html).toContain('Hi, what will we create today?');
    expect(html).toContain('搜索工具、工程、下一步...');
    expect(html).toContain('Ctrl K');
    expect(html).toContain('打开脚本');
    expect(html).toContain('把商品卖点拆成标题、口播、图文草稿和行动引导');
    expect(html).toContain('Tool Launcher');
    expect(html).toContain('Tool Preview');
    expect(html).toContain('打开这个工具');
    expect(html).toContain('Quick Start');
    expect(html).toContain('Action Preview');
    expect(html).toContain('Recent Workspace');
    expect(html).toContain('Workspace Detail');
    expect(html).toContain('打开这个工程');
    expect(html).toContain('任务摘要');
    expect(html).toContain('保存任务');
    expect(html).toContain('任务完成度');
    expect(html).toContain('商品和目标渠道已确认');
    expect(html).toContain('打开这个工作流');
    expect(html).toContain('小 W 在线 · 点我打开下一步助手');
    expect(html).not.toContain('86%');
  });
});
