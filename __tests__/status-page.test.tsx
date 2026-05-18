import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import StatusPage, {
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
    expect(html).toContain('不展示伪规模');
    expect(html).toContain('服务承诺边界');
    expect(html).toContain('正在加载状态');
    expect(html).not.toContain('Project readiness evidence');
    expect(html).not.toContain('Refresh');
    expect(html).not.toContain('provider-gated');
    expect(html).not.toContain('STATUS ·');
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
