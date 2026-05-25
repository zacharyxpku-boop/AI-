import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DocsPage from '@/app/docs/page';
import KuaiziSettingsPage from '@/app/settings/kuaizi/page';
import SettingsPage from '@/app/settings/page';

describe('settings pages', () => {
  it('renders client configuration as a clear Kuaizi-style workbench', () => {
    const html = renderToStaticMarkup(<SettingsPage />);

    expect(html).toContain('客户配置工作台');
    expect(html).toContain('AI 员工配置');
    expect(html).toContain('打开商品增长工作台');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/settings/kuaizi');
    expect(html).toContain('保存配置');
    expect(html).not.toContain('ON');
    expect(html).not.toContain('OFF');
    expect(html).not.toContain('瀹');
    expect(html).not.toContain('鍩');
  });

  it('renders provider settings without browser-side credential promises', () => {
    const html = renderToStaticMarkup(<KuaiziSettingsPage />);

    expect(html).toContain('外部生产连接工作台');
    expect(html).toContain('服务端连接状态');
    expect(html).toContain('服务端托管');
    expect(html).toContain('不在浏览器保存');
    expect(html).toContain('当前不阻断 POC 演示，但不能承诺一键外部生产');
    expect(html).toContain('视频生成 / 剪辑 provider');
    expect(html).toContain('平台 OAuth / 账号池');
    expect(html).toContain('广告账号 / Campaign');
    expect(html).toContain('Analytics sync / 表现回流');
    expect(html).toContain('企业云资产 / 权限');
    expect(html).toContain('规模数字审计');
    expect(html).toContain('没有 provider callback 前，不宣称自动成片');
    expect(html).toContain('没有 oauth_ready 或 manual_ready 的账号，不标记真实发布');
    expect(html).toContain('没有广告账号授权、预算和平台证据，不宣称自动投放或自动优化');
    expect(html).toContain('91M+ / 42M+ 只作为竞品 benchmark');
    expect(html).toContain('材料放行检查表');
    expect(html).toContain('使用 sandbox 或最小权限账号');
    expect(html).not.toContain('KUAIZI_API_KEY');
    expect(html).not.toContain('API Key');
    expect(html).not.toContain('localStorage');
    expect(html).not.toContain('瀹');
    expect(html).not.toContain('鍩');
  });

  it('renders a readable customer trial runbook from the docs hub', () => {
    const html = renderToStaticMarkup(<DocsPage />);

    expect(html).toContain('客户试用与交付说明');
    expect(html).toContain('打开商品增长工作台');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/factory/creative?variant=friend_trial');
    expect(html).toContain('/factory/create?variant=friend_trial');
    expect(html).toContain('/factory/video?variant=friend_trial');
    expect(html).toContain('/factory/cast?variant=friend_trial');
    expect(html).toContain('/factory/manage?variant=friend_trial');
    expect(html).toContain('/settings/kuaizi');
    expect(html).toContain('/status?variant=friend_trial');
    expect(html).toContain('没有 provider callback，不宣称一键自动成片');
    expect(html).toContain('没有平台 OAuth、发布回执和账号授权，不宣称自动发布');
    expect(html).toContain('没有广告账号授权、预算和 campaign 证据');
    expect(html).not.toContain('瀹');
    expect(html).not.toContain('鍩');
  });

  it('keeps the partner-facing external integration material handoff explicit', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/EXTERNAL_INTEGRATION_MATERIALS.md'), 'utf8');

    expect(doc).toContain('How To Obtain Materials');
    expect(doc).toContain('Customer Self-Publish Return Pack');
    expect(doc).toContain('Provider console or provider integration contact');
    expect(doc).toContain('Create developer app; add redirect URI; grant sandbox/test account');
    expect(doc).toContain('Ads Manager or business manager console');
    expect(doc).toContain('Object storage, CDN, enterprise drive, or cloud IAM console');
    expect(doc).toContain('Wenai production ledger, platform publish backend, analytics exports');
    expect(doc).toContain('Account reaches `oauth_ready`');
    expect(doc).toContain('Generation Provider Pack');
    expect(doc).toContain('Platform OAuth / Account Pool Pack');
    expect(doc).toContain('Ad Account / Campaign Pack');
    expect(doc).toContain('Analytics Sync / Performance Return Pack');
    expect(doc).toContain('Enterprise Asset Cloud / Permission Pack');
    expect(doc).toContain('Audited Scale Ledger Pack');
    expect(doc).toContain('91M+ creative output and 42M+ video distribution numbers are competitor benchmarks');
    expect(doc).toContain('No platform OAuth: keep distribution as customer self-publish with Wenai-generated packs and evidence return.');
    expect(doc).toContain('No ad account authorization: do not claim automatic ad delivery or optimization.');
    expect(doc).toContain('No generation key or callback: do not claim automated AI-generated shots');
    expect(doc).toContain('No audited scale ledger: do not display Wenai-owned 91M+ / 42M+ scale claims.');
    expect(doc).not.toContain('KUAIZI_API_KEY');
    expect(doc).not.toContain('API Key');
  });

  it('keeps the final product blueprint grounded in reference platforms and external stop lines', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/FINAL_PRODUCT_BLUEPRINT.md'), 'utf8');

    expect(doc).toContain('ecommerce AI content industrialization operating system');
    expect(doc).toContain('Compose');
    expect(doc).toContain('Create');
    expect(doc).toContain('Cut');
    expect(doc).toContain('Cast');
    expect(doc).toContain('Manage');
    expect(doc).toContain('Hookshot / Hookly');
    expect(doc).toContain('Omneky');
    expect(doc).toContain('VidMob');
    expect(doc).toContain('Creatify');
    expect(doc).toContain('Marpipe');
    expect(doc).toContain('Pencil');
    expect(doc).toContain('Smartly.io');
    expect(doc).toContain('Creatopy');
    expect(doc).toContain('Superads');
    expect(doc).toContain('Generation provider pack');
    expect(doc).toContain('Platform OAuth/account pool pack');
    expect(doc).toContain('Ad account/campaign pack');
    expect(doc).toContain('No generation key or callback');
    expect(doc).toContain('No platform OAuth');
    expect(doc).toContain('No ad account authorization');
    expect(doc).toContain('91M+ creative output');
    expect(doc).toContain('42M+ video distribution');
    expect(doc).toContain('competitor benchmarks only');
    expect(doc).not.toContain('API Key');
    expect(doc).not.toContain('KUAIZI_API_KEY');
  });
});
