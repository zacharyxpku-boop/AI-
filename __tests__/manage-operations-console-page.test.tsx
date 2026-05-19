import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ManageFactoryPage from '@/app/factory/manage/page';
import { ManageOperationsConsoleClient, buildManageOperatingChecks, buildManageVariantPlaybook } from '@/components/ManageOperationsConsoleClient';
import type { AssetPermissionSnapshot } from '@/lib/asset-permission-ledger';
import type { IndustrializationSnapshot } from '@/lib/industrial-chain-store';

function industrial(overrides: Partial<IndustrializationSnapshot> = {}): IndustrializationSnapshot {
  return {
    orgId: 'test-org',
    projectId: 'manage-project',
    assetCount: 0,
    reportAssetCount: 0,
    approvedAssetCount: 0,
    reusableAssetCount: 0,
    blockedAssetCount: 0,
    rightsIssueAssetCount: 0,
    assetGovernanceIssueCount: 0,
    deliverableAssetCount: 0,
    clientReviewAssetCount: 0,
    approvedDeliverableCount: 0,
    revisionRequestedCount: 0,
    deliveryIssueCount: 0,
    planCount: 0,
    draftPlanCount: 0,
    nextRoundAssetPlanCount: 0,
    readyPlanCount: 0,
    dispatchCount: 0,
    executableDispatchCount: 0,
    publishedDispatchCount: 0,
    publishedWithEvidenceCount: 0,
    missingPublishEvidenceCount: 0,
    overdueReviewDispatchCount: 0,
    measuredDispatchCount: 0,
    performanceReturnCount: 0,
    scaleDecisionCount: 0,
    assetMatchAmbiguousCount: 0,
    assetMatchUnmatchedCount: 0,
    assetMatchIssueCount: 0,
    missingLinks: ['Missing distribution plan'],
    nextActions: ['Close gap: Missing distribution plan'],
    ...overrides,
  };
}

function permission(overrides: Partial<AssetPermissionSnapshot> = {}): AssetPermissionSnapshot {
  return {
    orgId: 'test-org',
    projectId: 'manage-project',
    permissionRecordCount: 0,
    governedAssetCount: 0,
    shareableAssetCount: 0,
    downloadableAssetCount: 0,
    storageObjectCount: 0,
    downloadableObjectCount: 0,
    shareableObjectCount: 0,
    missingStorageObjectCount: 0,
    activeAccessGrantCount: 0,
    expiredAccessGrantCount: 0,
    revokedAccessGrantCount: 0,
    expiredPermissionCount: 0,
    clientReviewScopeCount: 0,
    securityPolicyCount: 0,
    watermarkRequiredCount: 0,
    watermarkAppliedCount: 0,
    dlpPassedPolicyCount: 0,
    dlpFailedPolicyCount: 0,
    publicShareBlockedCount: 0,
    retentionPolicyCount: 0,
    auditEventCount: 0,
    accessAuditEventCount: 0,
    downloadableAccessReadyCount: 0,
    shareableAccessReadyCount: 0,
    assetAccessStates: [],
    missingLinks: ['Missing enterprise asset permission ledger'],
    nextActions: ['Close asset permission gap: Missing enterprise asset permission ledger'],
    ...overrides,
  };
}

describe('manage operations console page', () => {
  it('renders the Manage variant UI and links all role variants', async () => {
    const page = await ManageFactoryPage({
      searchParams: Promise.resolve({ projectId: 'launch-manage', variant: 'operator' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('交付管理控制台');
    expect(html).toContain('Manage Operations Variant');
    expect(html).toContain('Manage Action Playbook');
    expect(html).toContain('Manage 运营动作剧本');
    expect(html).toContain('Clico式客户交付与企业安全验收板');
    expect(html).toContain('Manage Seed');
    expect(html).toContain('客户审核权限、受控分享对象、安全策略、DLP、水印和留存规则');
    expect(html).toContain('/factory/manage?projectId=launch-manage&amp;variant=partner');
    expect(html).toContain('/factory/manage?projectId=launch-manage&amp;variant=friend_trial');
  });

  it('renders distinct partner and friend trial Manage variants', () => {
    const industrialReady = industrial({
      clientReviewAssetCount: 1,
      approvedDeliverableCount: 1,
      performanceReturnCount: 1,
      scaleDecisionCount: 1,
      missingLinks: [],
      nextActions: [],
    });
    const permissionReady = permission({
      permissionRecordCount: 2,
      securityPolicyCount: 2,
      dlpPassedPolicyCount: 2,
      auditEventCount: 2,
      accessAuditEventCount: 1,
      clientReviewScopeCount: 1,
      missingLinks: [],
      nextActions: [],
    });

    const partnerHtml = renderToStaticMarkup(
      <ManageOperationsConsoleClient initialProjectId="partner-manage" initialIndustrialSnapshot={industrialReady} initialPermissionSnapshot={permissionReady} selectedVariantId="partner" />,
    );
    const friendHtml = renderToStaticMarkup(
      <ManageOperationsConsoleClient initialProjectId="friend-manage" initialIndustrialSnapshot={industrialReady} initialPermissionSnapshot={permissionReady} selectedVariantId="friend_trial" />,
    );

    expect(partnerHtml).toContain('合作者视角');
    expect(partnerHtml).toContain('Manage 商业验收剧本');
    expect(partnerHtml).toContain('企业云资产、CRM 同步和 analytics sync');
    expect(partnerHtml).toContain('企业云盘、团队空间、自动 CRM');

    expect(friendHtml).toContain('朋友试用视角');
    expect(friendHtml).toContain('朋友试用 Manage 路径');
    expect(friendHtml).toContain('朋友只看三项');
    expect(friendHtml).toContain('/factory/manage?projectId=friend-manage&amp;variant=operator');
  });

  it('builds role-specific Manage playbooks from review, permission, and audit evidence', () => {
    const blockedIndustrial = industrial();
    const blockedPermission = permission();
    const readyIndustrial = industrial({
      clientReviewAssetCount: 1,
      approvedDeliverableCount: 1,
      performanceReturnCount: 1,
      missingLinks: [],
      nextActions: [],
    });
    const readyPermission = permission({
      permissionRecordCount: 1,
      securityPolicyCount: 1,
      dlpPassedPolicyCount: 1,
      auditEventCount: 1,
      accessAuditEventCount: 1,
      missingLinks: [],
      nextActions: [],
    });

    expect(buildManageVariantPlaybook(blockedIndustrial, blockedPermission, 'operator')).toEqual(expect.objectContaining({
      title: 'Manage 运营动作剧本',
      primaryAction: expect.stringContaining('Missing distribution plan'),
      handoffBoundary: expect.stringContaining('手工交接'),
    }));

    expect(buildManageVariantPlaybook(readyIndustrial, readyPermission, 'partner')).toEqual(expect.objectContaining({
      title: 'Manage 商业验收剧本',
      primaryAction: expect.stringContaining('企业云资产'),
      cards: expect.arrayContaining([
        expect.stringContaining('Manage readiness 7/7'),
      ]),
    }));

    expect(buildManageVariantPlaybook(readyIndustrial, readyPermission, 'friend_trial')).toEqual(expect.objectContaining({
      title: '朋友试用 Manage 路径',
      proofToCheck: expect.stringContaining('朋友只看三项'),
    }));
  });

  it('builds Clico-style Manage operating checks from review, security, audit, and return evidence', () => {
    const readyIndustrial = industrial({
      clientReviewAssetCount: 1,
      approvedDeliverableCount: 1,
      performanceReturnCount: 1,
      scaleDecisionCount: 1,
      missingLinks: [],
      nextActions: [],
    });
    const readyPermission = permission({
      permissionRecordCount: 1,
      clientReviewScopeCount: 1,
      securityPolicyCount: 1,
      watermarkRequiredCount: 1,
      watermarkAppliedCount: 1,
      dlpPassedPolicyCount: 1,
      retentionPolicyCount: 1,
      auditEventCount: 1,
      accessAuditEventCount: 1,
      missingLinks: [],
      nextActions: [],
    });

    expect(buildManageOperatingChecks(readyIndustrial, readyPermission)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        stage: '客户审核入口',
        ready: true,
      }),
      expect.objectContaining({
        stage: '客户批准与交付',
        ready: true,
      }),
      expect.objectContaining({
        stage: '权限范围与受控分享',
        ready: true,
      }),
      expect.objectContaining({
        stage: 'DLP / 水印 / 留存',
        ready: true,
      }),
      expect.objectContaining({
        stage: '访问审计',
        ready: true,
      }),
      expect.objectContaining({
        stage: '表现回流与复盘',
        ready: true,
      }),
      expect.objectContaining({
        stage: 'CRM / 下一步队列',
        ready: true,
      }),
    ]));
  });
});
