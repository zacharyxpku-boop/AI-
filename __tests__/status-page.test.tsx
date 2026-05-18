import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import StatusPage, {
  buildStatusAlternativeReferences,
  buildStatusProductBlueprint,
  buildStatusUiVariants,
  formatAssetPermissionAuditEvent,
  formatExternalRequirementCategory,
  formatExternalRequirementOwner,
  formatExternalRequirementStatus,
  formatProjectEvidenceMetric,
  formatReadinessFeatureName,
} from '@/app/status/page';

describe('status page', () => {
  it('renders a Chinese-first readiness surface without exposed internal labels', () => {
    const html = renderToStaticMarkup(<StatusPage />);

    expect(html).toContain('全链路验收台');
    expect(html).toContain('项目闭环证据');
    expect(html).toContain('筷子式五段能力');
    expect(html).toContain('Compose / Create / Cut / Cast / Manage');
    expect(html).toContain('UI Variant 工作流');
    expect(html).toContain('工业化对标版');
    expect(html).toContain('竞品参考雷达');
    expect(html).toContain('Hookshot / Hookly 类');
    expect(html).toContain('电商增长作战系统');
    expect(html).toContain('最终产品形态蓝图');
    expect(html).toContain('内部继续补厚；外部材料接齐后才开放平台级承诺');
    expect(html).toContain('Wenai 内部继续做');
    expect(html).toContain('需要你统一提供/授权');
    expect(html).toContain('当前停止线');
    expect(html).toContain('AI 视频分析、结构拆解、智能混剪、版本对比、批量成片和复盘回流');
    expect(html).toContain('多平台分发、PubPal/矩阵分发、广告投放、预算门禁、发布证据和 analytics sync');
    expect(html).toContain('没有平台授权和发布/投放回执前，不能展示已自动分发或已自动优化广告');
    expect(html).toContain('筷子之外参考');
    expect(html).toContain('Hooksy / Hooked');
    expect(html).toContain('Omneky');
    expect(html).toContain('AdHawk / AI Media Buyer');
    expect(html).toContain('受治理的 AI agents');
    expect(html).toContain('不展示伪规模');
    expect(html).toContain('Manage Acceptance Board');
    expect(html).toContain('交付前验收台');
    expect(html).toContain('Readiness 验收');
    expect(html).toContain('CRM / 生产交接');
    expect(html).toContain('客户审核闭环');
    expect(html).toContain('资产权限 / 审计');
    expect(html).toContain('表现回流 / 复盘');
    expect(html).toContain('谁负责、证据在哪里、客户是否能审核');
    expect(html).toContain('每个 P0/P1 修复项都有 owner、endpoint、method、acceptance');
    expect(html).toContain('接对象存储、签名 URL、团队空间和真实下载/share enforcement');
    expect(html).toContain('服务承诺边界');
    expect(html).toContain('正在加载状态');
    expect(html).not.toContain('Project readiness evidence');
    expect(html).not.toContain('Refresh');
    expect(html).not.toContain('provider-gated');
    expect(html).not.toContain('STATUS ·');
  });

  it('maps structured readiness product variants into the status UI model', () => {
    const report = {
      verdict: 'conditional' as const,
      label: '有条件通过',
      score: 88,
      productBlueprint: [{
        id: 'Cut' as const,
        target: 'AI 视频分析、智能混剪、一键视频。',
        currentStatus: 'partial' as const,
        internalCapability: '已有视频 workflow、任务队列、客户审核和表现回流字段。',
        externalGate: '需要真实视频生成/剪辑 provider、素材授权和回调签名。',
        stopLine: '没有 provider 完成记录前不能宣称一键视频真实可用。',
        evidence: 'videoConfigured=0; completedProviderExecutions=0; measuredVideos=0',
      }],
      alternativeReferences: [{
        name: 'Omneky',
        pattern: '把创意生成、广告投放和表现回流连成 campaign learning loop。',
        wenaiDecision: 'Cast/Manage 必须把 campaign ledger、预算、素材绑定、回流指标和下一轮规则放在同一条链路。',
        boundary: '广告账户和转化事件未授权前，只能做手动导入。',
      }],
      uiVariants: [{
        id: 'partner' as const,
        label: '合作者/投资人版',
        audience: '合作者、供应商、潜在客户和投资人。',
        firstScreen: '先看全链路工作台和外部门禁。',
        primaryAction: '进入 /status 查看 readiness。',
        stopLine: '不展示未审计规模数字。',
      }],
      features: [],
      workflows: [],
      issues: [],
      friendTrialRisks: [],
      externalRequirements: [],
      scaleClaimGuards: [],
    };

    expect(buildStatusUiVariants(report)).toEqual([expect.objectContaining({
      id: 'partner',
      label: '合作者/投资人版',
      intent: expect.stringContaining('先看全链路工作台'),
      proof: expect.stringContaining('不展示未审计规模数字'),
    })]);
    expect(buildStatusProductBlueprint(report)).toEqual([expect.objectContaining({
      layer: 'Cut',
      internalMove: expect.stringContaining('视频 workflow'),
      externalNeed: expect.stringContaining('provider'),
      status: 'partial',
      evidence: expect.stringContaining('videoConfigured=0'),
    })]);
    expect(buildStatusAlternativeReferences(report)).toEqual([expect.objectContaining({
      name: 'Omneky',
      reference: expect.stringContaining('边界'),
      wenaiDecision: expect.stringContaining('campaign ledger'),
    })]);
  });

  it('formats project evidence as Chinese operator metrics instead of raw ledger keys', () => {
    expect(formatProjectEvidenceMetric('creativeOpportunities=4')).toEqual({
      key: 'creativeOpportunities',
      label: '创意机会',
      value: '4',
    });
    expect(formatProjectEvidenceMetric('creativePatternClusters=2')).toEqual({
      key: 'creativePatternClusters',
      label: '创意打法簇',
      value: '2',
    });
  expect(formatProjectEvidenceMetric('creativeMoatScore=72')).toEqual({
    key: 'creativeMoatScore',
    label: '创意护城河分',
    value: '72',
  });
  expect(formatProjectEvidenceMetric('creativeSourceSyncCoverageScore=100')).toEqual({
    key: 'creativeSourceSyncCoverageScore',
    label: '采集覆盖分',
    value: '100',
  });
    expect(formatProjectEvidenceMetric('assetPermissionAccessAuditEvents=7')).toEqual({
      key: 'assetPermissionAccessAuditEvents',
      label: '访问审计',
      value: '7',
    });
    expect(formatProjectEvidenceMetric('videoResultAssets=1')).toEqual({
      key: 'videoResultAssets',
      label: '视频成片',
      value: '1',
    });
    expect(formatProjectEvidenceMetric('videoClientReviews=1')).toEqual({
      key: 'videoClientReviews',
      label: '视频审核',
      value: '1',
    });
    expect(formatProjectEvidenceMetric('videoApprovedDeliverables=1')).toEqual({
      key: 'videoApprovedDeliverables',
      label: '视频批准',
      value: '1',
    });
    expect(formatProjectEvidenceMetric('videoMeasured=1')).toEqual({
      key: 'videoMeasured',
      label: '视频回流',
      value: '1',
    });
    expect(formatProjectEvidenceMetric('videoAverageLoopScore=0.86')).toEqual({
      key: 'videoAverageLoopScore',
      label: '视频闭环分',
      value: '86%',
    });
  });

  it('formats readiness feature names as Chinese product capabilities', () => {
    expect(formatReadinessFeatureName('Creative intelligence ledger')).toBe('创意洞察台账');
    expect(formatReadinessFeatureName('Client review token portal')).toBe('客户免登录审核门户');
    expect(formatReadinessFeatureName('Platform connector automation ledger')).toBe('平台自动化连接台账');
  });

  it('formats external integration blockers as business-readable gates', () => {
    expect(formatExternalRequirementStatus('configured')).toBe('已接入');
    expect(formatExternalRequirementStatus('missing')).toBe('等待外部接入');
    expect(formatExternalRequirementStatus('evidence_required')).toBe('需要审计证据');
    expect(formatExternalRequirementOwner('user')).toBe('你统一提供');
    expect(formatExternalRequirementOwner('provider')).toBe('服务商提供');
    expect(formatExternalRequirementOwner('wenai')).toBe('Wenai 内部完成');
    expect(formatExternalRequirementCategory('video_provider')).toBe('视频生成/剪辑');
    expect(formatExternalRequirementCategory('platform_oauth')).toBe('多平台 OAuth');
    expect(formatExternalRequirementCategory('ad_delivery')).toBe('广告投放');
    expect(formatExternalRequirementCategory('auto_publish')).toBe('自动发布/矩阵分发');
    expect(formatExternalRequirementCategory('scale_claims')).toBe('规模化数字');
  });

  it('formats asset permission audit events for operator review', () => {
    expect(formatAssetPermissionAuditEvent({
      id: 'audit-1',
      assetId: 'asset-video-1',
      action: 'publish',
      role: 'distribution',
      actor: 'distribution',
      operation: 'distribution_dispatch_publish',
      allowed: false,
      reason: 'missing_permission_record',
      createdAt: new Date().toISOString(),
    })).toEqual({
      actionLabel: '发布',
      operationLabel: '分发发布',
      resultLabel: '拒绝',
      reasonLabel: '缺少权限策略',
      actorLabel: 'distribution',
    });
  });
});
