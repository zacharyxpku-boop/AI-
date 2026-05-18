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
    expect(html).toContain('自有规模审计');
    expect(html).toContain('91M+ / 42M+ 只能显示为竞品 benchmark');
    expect(html).not.toContain('KUAIZI_API_KEY');
    expect(html).not.toContain('绛');
    expect(html).not.toContain('杩');
    expect(html).not.toContain('API Key');
  });
});
