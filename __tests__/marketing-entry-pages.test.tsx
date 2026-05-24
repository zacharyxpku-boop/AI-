import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import HomePage, { metadata as homeMetadata } from '@/app/page';
import PocPage, { metadata as pocMetadata } from '@/app/poc/page';
import PricingPage, { metadata as pricingMetadata } from '@/app/pricing/page';
import { Hero } from '@/components/marketing/Hero';
import { PricingIntentCards } from '@/components/marketing/PricingIntentCards';
import TopNav from '@/components/marketing/TopNav';

describe('marketing entry pages', () => {
  it('points customer-facing navigation at the friend trial workbench', () => {
    const html = renderToStaticMarkup(<TopNav />);

    expect(html).toContain('商品增长工作台');
    expect(html).toContain('Provider 配置');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/settings/kuaizi');
    expect(html).not.toContain('/dashboard');
    expect(html).not.toContain('瀹');
  });

  it('renders the hero with readable copy and provider-gated trial CTAs', () => {
    const html = renderToStaticMarkup(<Hero />);

    expect(html).toContain('从一个商品开始，跑完整内容增长链路');
    expect(html).toContain('开始第一轮试用');
    expect(html).toContain('查看 Provider 材料');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/settings/kuaizi');
    expect(html).toContain('provider 未配置前');
    expect(html).not.toContain('/dashboard');
    expect(html).not.toContain('瀹');
  });

  it('renders pricing as a readable trial-to-provider upgrade path', () => {
    const html = renderToStaticMarkup(<PricingPage />);

    expect(pricingMetadata.title).toBe('定价 | Wenai 商品增长工作台');
    expect(html).toContain('先免费跑通第一轮，再为更多协作和 provider 接入付费');
    expect(html).toContain('三档权益对比');
    expect(html).toContain('开始第一轮试用');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('会不会泄露第三方密钥？');
    expect(html).not.toContain('/dashboard');
    expect(html).not.toContain('瀹');
  });

  it('keeps pricing cards focused on the workbench and provider gates', () => {
    const html = renderToStaticMarkup(<PricingIntentCards />);

    expect(html).toContain('商品增长工作台');
    expect(html).toContain('provider-gated 交付边界');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).not.toContain('/dashboard');
    expect(html).not.toContain('瀹');
  });

  it('keeps home metadata readable while redirecting to the trial workbench', () => {
    expect(homeMetadata.title).toBe('Wenai | 客户试用工作台');
    expect(homeMetadata.description).toContain('电商内容增长工作台');
    expect(() => HomePage()).toThrow();
  });

  it('renders the POC page as a readable product trial runbook', () => {
    const html = renderToStaticMarkup(<PocPage />);

    expect(pocMetadata.title).toBe('商品增长试用路径 | wenai');
    expect(html).toContain('从一个商品开始，验证整条内容增长交付链');
    expect(html).toContain('打开商品增长工作台');
    expect(html).toContain('提交试用申请');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/inquire?from=poc');
    expect(html).toContain('没有视频 provider callback，不宣称一键成片');
    expect(html).not.toContain('/dashboard');
    expect(html).not.toContain('瀹');
  });

  it('keeps the inquiry page source readable and provider-safe', () => {
    const source = readFileSync(join(process.cwd(), 'src/app/inquire/page.tsx'), 'utf8');

    expect(source).toContain('提交商品增长试用申请');
    expect(source).toContain('提交试用申请');
    expect(source).toContain('/api/sales/inquiry');
    expect(source).toContain('/factory?variant=friend_trial');
    expect(source).toContain('/settings/kuaizi');
    expect(source).toContain('不要在这里提交第三方密钥');
    expect(source).not.toContain('/dashboard');
    expect(source).not.toContain('瀹');
  });
});
