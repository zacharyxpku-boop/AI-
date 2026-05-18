import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoFactoryPage from '@/app/factory/video/page';
import { VideoProductionQueueClient } from '@/components/VideoProductionQueueClient';
import type { OneClickVideoOperationResult, VideoProductionQueue } from '@/lib/industrial-video-workflow';

describe('video production queue page', () => {
  it('renders the video factory page as a Chinese operator queue surface', async () => {
    const page = await VideoFactoryPage({
      searchParams: Promise.resolve({ projectId: 'launch-video' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('视频生产队列');
    expect(html).toContain('智能混剪');
    expect(html).toContain('从 Hook 结构库到智能混剪包');
    expect(html).toContain('Hook Bank 入场');
    expect(html).toContain('UGC Script Spine 成片');
    expect(html).toContain('Offer Test Matrix 分发');
    expect(html).toContain('Cut Production Line');
    expect(html).toContain('AI 视频分析');
    expect(html).toContain('一键视频');
    expect(html).toContain('客户审核');
    expect(html).toContain('分发回流');
    expect(html).toContain('从视频解析到分发回流的一条成片生产线');
    expect(html).toContain('创建视频工作流');
    expect(html).toContain('创建任务并写入分发队列');
    expect(html).toContain('回灌成片并生成审核链接');
    expect(html).toContain('写入成片并创建客户审核');
    expect(html).toContain('运营动作包');
    expect(html).toContain('launch-video');
  });

  it('shows provider gating in Chinese instead of pretending automatic video generation', () => {
    const html = renderToStaticMarkup(<VideoProductionQueueClient initialProjectId="video-project" />);

    expect(html).toContain('仅交接');
    expect(html).toContain('供应商就绪');
    expect(html).toContain('服务时限');
    expect(html).toContain('正在加载');
    expect(html).toContain('不伪装自动生成');
    expect(html).toContain('只有 provider、素材授权、平台账号和回流都接上');
    expect(html).toContain('没有平台 OAuth、广告账户和 analytics sync 前，只能做计划与手工回灌');
    expect(html).toContain('多模态视频解析 provider、合法视频源、下载/存储权限');
    expect(html).toContain('真实剪辑引擎、素材授权、音频/字体授权和成片回调');
    expect(html).toContain('视频生成 provider token、任务回调、失败重试和成本额度');
    expect(html).toContain('正式域名、客户权限策略、素材下载/水印策略');
    expect(html).toContain('平台 OAuth、广告账户授权、自动发布和 analytics sync');
    expect(html).toContain('成片 URL');
    expect(html).not.toContain('一键生成成片');
    expect(html).not.toContain('handoff_only');
    expect(html).not.toContain('provider_ready');
  });

  it('renders one-click video operation capabilities, blockers, and scale-claim guards', () => {
    const queue: VideoProductionQueue = {
      orgId: 'test-org',
      projectId: 'one-click-project',
      itemCount: 0,
      providerReadyCount: 0,
      handoffOnlyCount: 0,
      blockedCount: 0,
      measuredCount: 0,
      providerExecutionCount: 0,
      submittedProviderExecutionCount: 0,
      completedProviderExecutionCount: 0,
      failedProviderExecutionCount: 0,
      retryableProviderExecutionCount: 0,
      resultAssetCount: 0,
      clientReviewCount: 0,
      approvedDeliverableCount: 0,
      revisionRequestedCount: 0,
      averageLoopCompletionScore: 0,
      items: [],
    };
    const operation = {
      queue,
      autoCreated: ['workflow_asset:asset-1', 'distribution_plan:plan-1:TikTok Shop', 'dispatch:dispatch-1:manual_ready'],
      externalRequirements: ['A real video generation/editing provider is required before automatic finished-video output.'],
      scaleClaimGuards: [
        { requestedBenchmark: '91M+ creative output', canDisplay: false },
        { requestedBenchmark: '42M+ video distribution', canDisplay: false },
      ],
      capabilityStates: [
        { id: 'compose', label: 'Compose / creative intelligence', status: 'internal_ready', evidence: 'insights=3', nextStep: 'Continue source harvest.' },
        { id: 'one_click_video', label: 'One-click video operation', status: 'provider_gated', evidence: 'asset=1; plans=1; dispatches=1', nextStep: 'Connect provider.', externalRequirement: 'Real video provider token.' },
      ],
      commerciallyExecutable: false,
      operatorSummary: 'Internal workflow created; external provider/platform gates remain.',
    } as unknown as OneClickVideoOperationResult;

    const html = renderToStaticMarkup(
      <VideoProductionQueueClient initialProjectId="one-click-project" initialQueue={queue} initialOperation={operation} />,
    );

    expect(html).toContain('一键视频运营编排');
    expect(html).toContain('一键视频闭环判定');
    expect(html).toContain('内部已完成');
    expect(html).toContain('仍需外部接入');
    expect(html).toContain('运营下一步');
    expect(html).toContain('禁止伪规模');
    expect(html).toContain('不能自动出片或自动发布');
    expect(html).toContain('能力');
    expect(html).toContain('外部阻塞清单');
    expect(html).toContain('规模化数字展示保护');
    expect(html).toContain('内部已就绪');
    expect(html).toContain('等待外部接入');
    expect(html).toContain('91M+ creative output');
    expect(html).toContain('42M+ video distribution');
    expect(html).toContain('禁止作为 Wenai 指标展示');
    expect(html).toContain('Real video provider token.');
    expect(html).not.toContain('可商用自动化');
  });

  it('renders the production handoff packet and operator action evidence without raw internal labels', () => {
    const queue: VideoProductionQueue = {
      orgId: 'test-org',
      projectId: 'video-project',
      itemCount: 1,
      providerReadyCount: 0,
      handoffOnlyCount: 1,
      blockedCount: 1,
      measuredCount: 0,
      providerExecutionCount: 0,
      submittedProviderExecutionCount: 0,
      completedProviderExecutionCount: 0,
      failedProviderExecutionCount: 0,
      retryableProviderExecutionCount: 0,
      resultAssetCount: 0,
      clientReviewCount: 0,
      approvedDeliverableCount: 0,
      revisionRequestedCount: 0,
      averageLoopCompletionScore: 30,
      items: [{
        assetId: 'asset-video-1',
        title: 'Video workflow: Travel Bag',
        mode: 'handoff_only',
        stage: 'provider_gate',
        priority: 'medium',
        slaHoursRemaining: 42,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        planCount: 1,
        dispatchCount: 1,
        providerReadyDispatchCount: 0,
        manualReadyDispatchCount: 1,
        blockedDispatchCount: 0,
        measuredDispatchCount: 0,
        providerExecutionCount: 0,
        submittedProviderExecutionCount: 0,
        completedProviderExecutionCount: 0,
        failedProviderExecutionCount: 0,
        resultAssetCount: 0,
        clientReviewAssetCount: 0,
        approvedDeliverableCount: 0,
        revisionRequestedCount: 0,
        reviewLinks: [],
        resultUrls: [],
        channels: ['TikTok Shop'],
        remixPlan: [{
          id: 'remix-1',
          label: 'TikTok Shop proof_test 变体',
          source: 'creative-opportunity',
          hook: 'Open with the result before product detail.',
          cutPlan: ['0-2s proof frame', '2-6s product role', '6-11s usage scene'],
          assetInstructions: ['Use approved product footage.'],
          platformAdaptation: 'Attach creative_insight_id before dispatch.',
          acceptance: ['First 3 seconds are legible.'],
          riskBoundary: 'Do not copy reference footage.',
        }],
        providerRecovery: {
          retryableExecutionCount: 0,
          blockedExecutionCount: 0,
          failedReasons: [],
        },
        loopCompletionScore: 30,
        handoffPacket: {
          summary: 'provider_gate / handoff_only / plans:1 / dispatches:1 / results:0 / reviews:0 / approved:0',
          missingEvidence: ['Missing completed provider/editor result URL.'],
          reviewPortalUrls: [],
          executionTrace: ['handoff_asset:asset-video-1'],
        },
        blockers: ['Provider generation remains handoff-only until config, consent, references, and product assets are ready.'],
        nextActions: ['Ingest completed provider/editor result URLs through /api/industrial-chain/production-result.'],
        runbookActions: [{
          id: 'ingest-production-result',
          label: '导入供应商或剪辑结果',
          endpoint: '/api/industrial-chain/production-result',
          method: 'POST',
          payload: { projectId: 'video-project', sourceHandoffAssetId: 'asset-video-1' },
        }],
      }],
    };
    const html = renderToStaticMarkup(<VideoProductionQueueClient initialProjectId="video-project" initialQueue={queue} />);

    expect(html).toContain('生产交接包');
    expect(html).toContain('智能混剪计划');
    expect(html).toContain('人工成片试跑 Runbook');
    expect(html).toContain('不等 provider，也能把 Clico 式交付链路跑完');
    expect(html).toContain('导出剪辑交接包');
    expect(html).toContain('人工/供应商执行');
    expect(html).toContain('成片回灌');
    expect(html).toContain('客户审核');
    expect(html).toContain('分发与回流');
    expect(html).toContain('已有 Hook、镜头顺序、素材说明、平台适配和风险边界');
    expect(html).toContain('外部 token 未接齐时，按交接包人工剪辑；不要宣称自动成片');
    expect(html).toContain('剪辑完成后在本页写入成片 URL，系统会生成客户审核链接');
    expect(html).toContain('成片回灌后必须创建 review 链接，不能只在聊天里确认');
    expect(html).toContain('没有 OAuth 前保持手工回流');
    expect(html).toContain('TikTok Shop proof_test 变体');
    expect(html).toContain('创意机会');
    expect(html).toContain('Do not copy reference footage.');
    expect(html).toContain('闭环分');
    expect(html).toContain('缺证据');
    expect(html).toContain('成片链接');
    expect(html).toContain('生产任务编号或剪辑批次号');
    expect(html).toContain('运营动作包');
    expect(html).toContain('请求内容：');
    expect(html).toContain('来源交接资产：asset-video-1');
    expect(html).toContain('阶段 供应商闸门 · 模式 仅交接');
    expect(html).toContain('/api/industrial-chain/production-result');
    expect(html).not.toContain('Video workflow:');
    expect(html).not.toContain('provider_gate / handoff_only');
    expect(html).not.toContain('payload:');
  });
});
