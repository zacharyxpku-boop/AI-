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
    expect(html).not.toContain('KUAIZI_API_KEY');
    expect(html).not.toContain('绛');
    expect(html).not.toContain('杩');
    expect(html).not.toContain('API Key');
  });
});
