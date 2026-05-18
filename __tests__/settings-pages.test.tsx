import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SettingsPage from '@/app/settings/page';
import KuaiziSettingsPage from '@/app/settings/kuaizi/page';

describe('settings pages', () => {
  it('renders client configuration in clear Chinese', () => {
    const html = renderToStaticMarkup(<SettingsPage />);

    expect(html).toContain('客户配置');
    expect(html).toContain('基本信息');
    expect(html).toContain('AI 员工配置');
    expect(html).toContain('保存配置');
    expect(html).not.toContain('瀹');
    expect(html).not.toContain('淇');
    expect(html).not.toContain('ON');
    expect(html).not.toContain('OFF');
  });

  it('renders Kuaizi connection settings without browser-side credential promises', () => {
    const html = renderToStaticMarkup(<KuaiziSettingsPage />);

    expect(html).toContain('筷子科技连接配置');
    expect(html).toContain('生产工具连接');
    expect(html).toContain('服务端托管');
    expect(html).toContain('不在浏览器保存');
    expect(html).toContain('不能承诺一键外部生产');
    expect(html).toContain('外部环境接入作战台');
    expect(html).toContain('能配的我接，必须授权的你统一给');
    expect(html).toContain('视频生成 / 剪辑供应商');
    expect(html).toContain('多平台 OAuth / 账号池');
    expect(html).toContain('自动发布 / PubPal 矩阵分发');
    expect(html).toContain('广告投放');
    expect(html).toContain('Cast Operating Board');
    expect(html).toContain('账号矩阵、PubPal 分发、广告投放和数据回流的统一门禁');
    expect(html).toContain('账号矩阵池');
    expect(html).toContain('PubPal 矩阵分发');
    expect(html).toContain('表现自动同步');
    expect(html).toContain('没有 oauth_ready 或 manual_ready 的账号，不能把任何 dispatch 标记为已发布');
    expect(html).toContain('没有平台发布证据链接前，只能算 handoff');
    expect(html).toContain('没有广告账户授权、预算和平台 campaign 证据，不能宣称自动投放或自动优化');
    expect(html).toContain('没有真实同步任务和回流证据，只能展示导入结果');
    expect(html).toContain('自有规模审计');
    expect(html).toContain('91M+ / 42M+ 只能显示为竞品 benchmark');
    expect(html).toContain('外部材料包');
    expect(html).toContain('你给材料，我按验收口径接；没有材料就保持门禁');
    expect(html).toContain('P0 先打通真实生成、真实账号和真实广告');
    expect(html).toContain('视频生成 / 剪辑 provider 包');
    expect(html).toContain('平台 OAuth / 账号池授权包');
    expect(html).toContain('广告账户 / Campaign 包');
    expect(html).toContain('Analytics sync / 回流包');
    expect(html).toContain('企业云资产 / 权限包');
    expect(html).toContain('规模数字审计包');
    expect(html).toContain('server token');
    expect(html).toContain('webhook signing secret');
    expect(html).toContain('不要把 provider token、cookie、后台登录态贴到聊天或浏览器 localStorage');
    expect(html).toContain('同一资产对客户、运营、分发角色返回不同权限结果');
    expect(html).toContain('规模数字能追溯到 Wenai 自有账本、平台回执和日期范围');
    expect(html).not.toContain('KUAIZI_API_KEY');
    expect(html).not.toContain('绛');
    expect(html).not.toContain('杩');
    expect(html).not.toContain('API Key');
  });
});
