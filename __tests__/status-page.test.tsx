import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import StatusPage, {
  buildStatusAlternativeReferences,
  buildStatusExternalRequirements,
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
  it('renders a readable Kuaizi-style product status workbench', () => {
    const html = renderToStaticMarkup(<StatusPage />);

    expect(html).toContain('全链路状态与交付门禁');
    expect(html).toContain('筷子式工作台结构');
    expect(html).toContain('合作伙伴版');
    expect(html).toContain('运营工作台版');
    expect(html).toContain('朋友试用版');
    expect(html).toContain('Compose / Create / Cut / Cast / Manage');
    expect(html).toContain('外部接入清单');
    expect(html).toContain('交付队列与权限审计');
    expect(html).toContain('筷子之外参考');
    expect(html).toContain('/factory?variant=friend_trial');
    expect(html).toContain('/settings/kuaizi');
    expect(html).not.toMatch(/[�Ã]|鍏|绛|鏈|闂|骞|涓/);
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
        wenaiDecision: 'Cast/Manage 必须把 campaign ledger、预算和回流指标放在同一条链路。',
        boundary: '广告账号和转化事件未授权前，只能手动导入。',
      }],
      uiVariants: [{
        id: 'partner' as const,
        label: '合作伙伴版',
        audience: '合作伙伴、供应商、潜在客户和投资人。',
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
      label: '合作伙伴版',
      intent: expect.stringContaining('先看全链路工作台'),
      proof: expect.stringContaining('停止线'),
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

  it('preserves formatter contracts for readiness, external gates, and asset audits', () => {
    const report = {
      verdict: 'conditional' as const,
      label: 'conditional',
      score: 72,
      features: [],
      workflows: [],
      issues: [],
      friendTrialRisks: [],
      externalRequirements: [{
        id: 'video-provider-submit-callback',
        category: 'video_provider' as const,
        label: 'Real video generation/editing provider',
        status: 'missing' as const,
        owner: 'user' as const,
        materialPriority: 'P0' as const,
        evidence: 'videoConfigured=0; webhookSignature=0',
        requiredInputs: ['provider submit endpoint', 'server-side provider token'],
        acceptance: 'Submit one provider-ready workflow and receive a signed callback.',
      }],
      scaleClaimGuards: [],
    };

    expect(buildStatusExternalRequirements(report)).toHaveLength(1);
    expect(formatReadinessFeatureName('Kuaizi production connector')).toBe('筷子生产连接器');
    expect(formatExternalRequirementStatus('missing')).toBe('等待外部接入');
    expect(formatExternalRequirementOwner('user')).toBe('客户提供');
    expect(formatExternalRequirementCategory('video_provider')).toBe('视频生成/剪辑');
    expect(formatProjectEvidenceMetric('creativeAverageConfidence=0.87')).toEqual({
      key: 'creativeAverageConfidence',
      label: '补充证据',
      value: '87%',
    });
    expect(formatAssetPermissionAuditEvent({
      id: 'audit-1',
      assetId: 'asset-1',
      action: 'download',
      actor: 'client',
      operation: 'api_asset_access_check',
      allowed: false,
      reason: 'permission_expired',
      createdAt: '2026-05-23T00:00:00.000Z',
    })).toEqual({
      actionLabel: '下载',
      operationLabel: '权限校验接口',
      resultLabel: '拒绝',
      reasonLabel: '权限已过期',
      actorLabel: 'client',
    });
  });
});
