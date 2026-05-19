import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CastFactoryPage from '@/app/factory/cast/page';
import { CastDistributionConsoleClient, buildCastVariantPlaybook } from '@/components/CastDistributionConsoleClient';
import type { ChannelAccountSnapshot } from '@/lib/channel-account-ledger';

function snapshot(overrides: Partial<ChannelAccountSnapshot> = {}): ChannelAccountSnapshot {
  return {
    orgId: 'test-org',
    projectId: 'cast-project',
    accountCount: 0,
    connectedAccountCount: 0,
    healthyAccountCount: 0,
    blockedAccountCount: 0,
    rateLimitedAccountCount: 0,
    totalDailyPublishLimit: 0,
    scheduledCount: 0,
    availableSlotCount: 0,
    adCampaignCount: 0,
    readyAdCampaignCount: 0,
    activeAdCampaignCount: 0,
    measuredAdCampaignCount: 0,
    adBudgetCents: 0,
    adSpendCents: 0,
    adEvidenceCount: 0,
    adMissingLinks: ['Missing ad campaign ledger'],
    missingLinks: ['Missing channel account matrix'],
    nextActions: [
      'Close channel gap: Missing channel account matrix',
      'Close ad campaign gap: Missing ad campaign ledger',
    ],
    ...overrides,
  };
}

describe('cast distribution console page', () => {
  it('renders the Cast variant UI and links all role variants', async () => {
    const page = await CastFactoryPage({
      searchParams: Promise.resolve({ projectId: 'launch-cast', variant: 'operator' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('分发投放控制台');
    expect(html).toContain('Cast Distribution Variant');
    expect(html).toContain('Cast Action Playbook');
    expect(html).toContain('Cast 运营动作剧本');
    expect(html).toContain('Matrix Seed');
    expect(html).toContain('账号矩阵');
    expect(html).toContain('广告 campaign ledger');
    expect(html).toContain('/factory/cast?projectId=launch-cast&amp;variant=partner');
    expect(html).toContain('/factory/cast?projectId=launch-cast&amp;variant=friend_trial');
  });

  it('renders distinct partner and friend trial Cast variants', () => {
    const ready = snapshot({
      accountCount: 2,
      connectedAccountCount: 2,
      healthyAccountCount: 2,
      totalDailyPublishLimit: 6,
      scheduledCount: 2,
      availableSlotCount: 4,
      adCampaignCount: 1,
      activeAdCampaignCount: 1,
      adEvidenceCount: 1,
      missingLinks: [],
      adMissingLinks: [],
      nextActions: [],
    });

    const partnerHtml = renderToStaticMarkup(
      <CastDistributionConsoleClient initialProjectId="partner-cast" initialSnapshot={ready} selectedVariantId="partner" />,
    );
    const friendHtml = renderToStaticMarkup(
      <CastDistributionConsoleClient initialProjectId="friend-cast" initialSnapshot={ready} selectedVariantId="friend_trial" />,
    );

    expect(partnerHtml).toContain('合作者视角');
    expect(partnerHtml).toContain('Cast 商业验收剧本');
    expect(partnerHtml).toContain('91M+ creative output、42M+ video distribution');
    expect(partnerHtml).toContain('OAuth、广告账户授权、自动发布 API 和 analytics sync');

    expect(friendHtml).toContain('朋友试用视角');
    expect(friendHtml).toContain('朋友试用 Cast 路径');
    expect(friendHtml).toContain('朋友只看三项');
    expect(friendHtml).toContain('/factory/cast?projectId=friend-cast&amp;variant=operator');
  });

  it('builds role-specific Cast playbooks from account and ad evidence', () => {
    const blocked = snapshot();
    const ready = snapshot({
      accountCount: 2,
      connectedAccountCount: 2,
      healthyAccountCount: 1,
      totalDailyPublishLimit: 4,
      scheduledCount: 1,
      availableSlotCount: 3,
      adCampaignCount: 1,
      readyAdCampaignCount: 1,
      activeAdCampaignCount: 1,
      measuredAdCampaignCount: 1,
      adBudgetCents: 50000,
      adSpendCents: 12000,
      adEvidenceCount: 1,
      missingLinks: [],
      adMissingLinks: [],
      nextActions: [],
    });

    expect(buildCastVariantPlaybook(blocked, 'operator')).toEqual(expect.objectContaining({
      title: 'Cast 运营动作剧本',
      primaryAction: expect.stringContaining('Missing channel account matrix'),
      handoffBoundary: expect.stringContaining('manual-ready'),
    }));

    expect(buildCastVariantPlaybook(ready, 'partner')).toEqual(expect.objectContaining({
      title: 'Cast 商业验收剧本',
      primaryAction: expect.stringContaining('外部平台接入验收'),
      cards: expect.arrayContaining([
        expect.stringContaining('Cast readiness 7/7'),
      ]),
    }));

    expect(buildCastVariantPlaybook(ready, 'friend_trial')).toEqual(expect.objectContaining({
      title: '朋友试用 Cast 路径',
      proofToCheck: expect.stringContaining('朋友只看三项'),
    }));
  });
});
