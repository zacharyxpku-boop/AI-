import { describe, expect, it } from 'vitest';

import {
  buildCommerceRemixEnginePlan,
  buildCommerceRenderBatchPlan,
  buildCommerceRenderCapacityPlan,
  buildCommerceTimeline,
  buildCommerceCloudDriveManifest,
  buildCommerceCloudDriveReturnPlan,
  buildCommerceCustomerReturnIntakeBoard,
  buildCommerceCustomerDeliveryMap,
  buildCommerceCustomerEvidenceUploadGuide,
  buildCommerceCustomerLaunchReadinessBoard,
  buildCommerceCustomerNextStepCommandCenter,
  buildCommerceSalesConversationBoard,
  buildCommerceCustomerServicePack,
  buildCommerceCustomerSupportWorkflow,
  buildCommerceCreatorPersonaMatrix,
  buildCommerceDailyOperatorCockpit,
  buildCommerceEcommerceGrowthLoopConsole,
  buildCommerceEvidenceReadinessBoard,
  buildCommerceFirstDeliveryChecklist,
  buildCommerceChatCutRemixConsole,
  buildCommerceGitHubRemixRadar,
  buildCommerceConversationOpsConsole,
  buildCommerceModelImageTaskPack,
  buildCommerceOpenSourceAdapters,
  buildCommerceOpenSourceCoverage,
  buildCommerceOpenSourceInstallMatrix,
  buildCommerceOpenSourceLastMileBoard,
  buildCommerceOpenSourceQueueConsole,
  buildCommerceOpenSourceRemixBlueprint,
  buildCommerceOpenSourceStackSelector,
  buildCommercePostPublishActionBoard,
  buildCommerceProviderActivationRunbook,
  buildCommerceProviderActivationPlan,
  buildCommerceProviderEscalationBoard,
  buildCommerceProviderNeedAssessment,
  buildCommercePersonaPublishingConsole,
  buildCommercePublishingMatrixPlan,
  buildCommerceRemixTemplateBank,
  buildCommerceRemixExecutionRecipes,
  buildCommerceRemixOrchestrationBoard,
  buildCommerceRemixWorkflowPlaybook,
  buildCommerceRenderReliabilityBoard,
  buildCommerceRenderOperationsRunbook,
  buildCommerceSelfPublishingCommandCenter,
  buildCommerceSuperIpTitleBoard,
  buildCommerceTitleQualityGate,
  buildCommerceWorkbenchSystemMap,
  buildDemoCommerceRemixEnginePlan,
  buildFfmpegCommandManifest,
  buildCommerceRemixExportPackage,
  buildPlatformPublishingPacks,
  evaluateCommerceRemixQuality,
  buildRemixRenderQueue,
  evaluateCommercePerformanceUploads,
  executeCommerceRenderBatches,
  executeCommerceRemixDryRun,
  transitionRemixQueueItem,
  type CommerceRemixPlanInput,
} from '@/lib/commerce-remix-engine';

const baseInput: CommerceRemixPlanInput = {
  productName: 'Travel Pet Bowl',
  sellingPoints: ['stable feeding outside', 'folds into a small bag'],
  audience: 'traveling pet owners',
  platforms: ['tiktok', 'xiaohongshu', 'shopify'],
  assets: [
    { id: 'product-main', kind: 'product_image', label: 'main product image', uri: 'assets/product.png', rightsReady: true },
    { id: 'scene-park', kind: 'scene_image', label: 'park scene', uri: 'assets/park.png', rightsReady: true },
    { id: 'voiceover', kind: 'voiceover', label: 'voiceover', uri: 'assets/voiceover.wav', rightsReady: true },
  ],
  scenes: [
    {
      id: 'hook',
      hook: 'messy outdoor feeding',
      visual: 'Show the bowl opened on the grass.',
      subtitle: 'Outdoor feeding without the mess',
      voiceover: 'Feeding outside gets easier when the bowl stays stable.',
      durationSeconds: 4,
      requiredAssetIds: ['product-main', 'scene-park'],
    },
    {
      id: 'proof',
      hook: 'fold and pack',
      visual: 'Fold the bowl and put it in a travel bag.',
      subtitle: 'Fold it, pack it, go',
      voiceover: 'It folds into a small travel bag.',
      durationSeconds: 6,
      requiredAssetIds: ['product-main', 'missing-model'],
    },
  ],
};

describe('commerce remix engine', () => {
  it('builds a multi-track timeline from ecommerce scenes', () => {
    const timeline = buildCommerceTimeline(baseInput);

    expect(timeline.durationSeconds).toBe(10);
    expect(timeline.clips.map(clip => clip.track)).toEqual([
      'visual',
      'subtitle',
      'voiceover',
      'visual',
      'subtitle',
      'voiceover',
    ]);
    expect(timeline.clips[0]).toMatchObject({
      startSecond: 0,
      endSecond: 4,
      template: 'hook-proof-visual',
    });
  });

  it('exports retryable FFmpeg command manifests without shell strings or secrets', () => {
    const commands = buildFfmpegCommandManifest({ ...baseInput, renderSizes: ['9:16', '1:1'] });
    const serialized = JSON.stringify(commands);

    expect(commands).toHaveLength(2);
    expect(commands[0].args).toEqual(expect.arrayContaining(['-filter_complex', '-movflags', '+faststart']));
    expect(commands[0].args.join(' ')).toContain('scale=1080:1920');
    expect(commands.every(command => command.retryable)).toBe(true);
    expect(serialized).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('keeps render queue material gaps explicit before rendering', () => {
    const queue = buildRemixRenderQueue(baseInput);

    expect(queue).toHaveLength(3);
    expect(queue.every(item => item.status === 'needs_material')).toBe(true);
    expect(queue[0].missingAssetIds).toContain('missing-model');
    expect(queue[0].nextAction).toContain('补齐');
  });

  it('retries only the failed render item and blocks after repeated failures', () => {
    const ready = transitionRemixQueueItem({ ...buildRemixRenderQueue(baseInput)[0], status: 'needs_material' }, 'material_ready');
    const rendering = transitionRemixQueueItem(ready, 'start');
    const firstFailure = transitionRemixQueueItem(rendering, 'fail');
    const secondFailure = transitionRemixQueueItem({ ...rendering, attempt: 1 }, 'fail');
    const thirdFailure = transitionRemixQueueItem({ ...rendering, attempt: 2 }, 'fail');

    expect(rendering.status).toBe('rendering');
    expect(firstFailure).toMatchObject({ status: 'failed_retryable', attempt: 1 });
    expect(secondFailure).toMatchObject({ status: 'failed_retryable', attempt: 2 });
    expect(thirdFailure).toMatchObject({ status: 'blocked', attempt: 3 });
    expect(thirdFailure.nextAction).toContain('连续失败');
  });

  it('generates platform-specific publishing packs for customer self-publishing', () => {
    const packs = buildPlatformPublishingPacks(baseInput);

    expect(packs.map(pack => pack.platform)).toEqual(['tiktok', 'xiaohongshu', 'shopify']);
    expect(packs[0].titles[0]).toContain('Stop scrolling');
    expect(packs[0].accountVariants.map(variant => variant.accountType)).toEqual(['真实买家号', '测评种草号', '店铺官方号']);
    expect(packs[1].publishChecklist).toContain('发布后回填链接、截图或 CSV');
    expect(packs[2].cta).toBe('View product details');
  });

  it('assembles the full local-first remix engine plan', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);

    expect(plan.engineStack.map(item => item.id)).toEqual([
      'timeline-json',
      'remotion-template',
      'commerce-template-bank',
      'ffmpeg-render',
      'queue-runner',
      'render-batch-planner',
      'handoff-package',
      'performance-return',
      'quality-gate',
    ]);
    expect(plan.missingAssets.map(asset => asset.id)).toContain('missing-model');
    expect(plan.handoffMarkdown).toContain('Wenai 本地混剪任务包');
    expect(plan.handoffMarkdown).toContain('FFmpeg');
    expect(plan.handoffMarkdown).toContain('Remotion');
  });

  it('keeps the demo plan aligned with Wenai ecommerce workflow copy', () => {
    const plan = buildDemoCommerceRemixEnginePlan();

    expect(plan.publishingPacks).toHaveLength(5);
    expect(plan.queue.map(item => item.platform)).toEqual(['xiaohongshu', 'tiktok', 'shopify', 'meta', 'wechat_video']);
    expect(plan.missingAssets[0].label).toBe('手持模特图');
  });

  it('exports a customer-ready remix package with timeline, subtitles, voiceover, publishing packs, and upload checklist', () => {
    const completeInput: CommerceRemixPlanInput = {
      ...baseInput,
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    };
    const pack = buildCommerceRemixExportPackage(completeInput);

    expect(pack.packageId).toBe('commerce-remix-travel-pet-bowl');
    expect(pack.noSecretScanPassed).toBe(true);
    expect(pack.customerPublishingBoundary).toContain('客户自己登录平台发布');
    expect(pack.cloudDriveHandoff).toContain('exports/commerce-remix-travel-pet-bowl/04-customer-return');
    expect(pack.artifacts.map(artifact => artifact.kind)).toEqual([
      'timeline',
      'ffmpeg_commands',
      'concat_manifest',
      'subtitles',
      'voiceover_script',
      'publishing_packs',
      'handoff',
      'customer_upload',
    ]);
    expect(pack.artifacts.find(artifact => artifact.kind === 'subtitles')?.content).toContain('00:00:00,000 --> 00:00:04,000');
    expect(pack.artifacts.find(artifact => artifact.kind === 'voiceover_script')?.content).toContain('Feeding outside gets easier');
    expect(JSON.stringify(pack)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds a cloud-drive handoff map for customer self-publishing evidence', () => {
    const manifest = buildCommerceCloudDriveManifest(baseInput, 'exports/demo');
    const returnPlan = buildCommerceCloudDriveReturnPlan(baseInput, manifest);

    expect(manifest.folders.map(folder => folder.path)).toEqual([
      'exports/demo/01-source-assets',
      'exports/demo/02-render-outputs',
      'exports/demo/03-publishing-packs',
      'exports/demo/04-customer-return',
      'exports/demo/05-next-round',
    ]);
    expect(manifest.customerChecklist).toContain('发布平台链接');
    expect(manifest.customerChecklist.join(' ')).toContain('表现 CSV');
    expect(manifest.nextConfigurableProviders).toContain('企业云盘同步');
    expect(returnPlan.intakeFields.map(field => field.label)).toEqual(['发布平台链接', '发布截图', '表现 CSV', '客户备注']);
    expect(returnPlan.folderRules.join(' ')).toContain('04-customer-return');
    expect(returnPlan.nextRoundOutputs).toContain('重剪任务清单');
  });

  it('turns customer-uploaded links, screenshots, and CSV rows into next-round advice', () => {
    const report = evaluateCommercePerformanceUploads([
      {
        platform: 'xiaohongshu',
        publishedUrl: 'https://example.test/post',
        screenshotPath: '04-customer-return/post.png',
        csvRows: [
          { title: 'Hook A', impressions: 1000, clicks: 50, orders: 1, revenue: 99 },
          { title: 'Hook B', impressions: 800, clicks: 90, orders: 4, revenue: 396 },
        ],
      },
    ]);
    const missing = evaluateCommercePerformanceUploads([{ platform: 'tiktok' }]);

    expect(report.rowCount).toBe(2);
    expect(report.totalOrders).toBe(5);
    expect(report.bestTitle).toBe('Hook B');
    expect(report.missingEvidence).toEqual([]);
    expect(report.nextRoundAdvice.join(' ')).toContain('Hook B');
    expect(missing.missingEvidence).toEqual(['缺发布链接', '缺发布截图', '缺表现 CSV']);
  });

  it('turns customer return evidence into an operator intake board', () => {
    const returnPlan = buildCommerceCloudDriveReturnPlan(baseInput, buildCommerceCloudDriveManifest(baseInput));
    const readyReport = evaluateCommercePerformanceUploads([
      {
        platform: 'xiaohongshu',
        publishedUrl: 'https://example.test/post',
        screenshotPath: '04-customer-return/post.png',
        csvRows: [{ title: 'Hook B', impressions: 800, clicks: 90, orders: 4, revenue: 396 }],
      },
    ]);
    const missingReport = evaluateCommercePerformanceUploads([{ platform: 'tiktok' }]);
    const readyBoard = buildCommerceCustomerReturnIntakeBoard(readyReport, returnPlan);
    const missingBoard = buildCommerceCustomerReturnIntakeBoard(missingReport, returnPlan);
    const readyEvidence = buildCommerceEvidenceReadinessBoard(readyReport, returnPlan, readyBoard);
    const missingEvidence = buildCommerceEvidenceReadinessBoard(missingReport, returnPlan, missingBoard);

    expect(readyBoard.status).toBe('ready_for_review');
    expect(readyBoard.evidenceCards.every(card => card.state === 'received')).toBe(true);
    expect(readyBoard.reviewQueue.join(' ')).toContain('Hook B');
    expect(readyBoard.nextOwnerActions.length).toBeGreaterThanOrEqual(4);
    expect(readyEvidence.status).toBe('ready_for_review');
    expect(readyEvidence.headline).toContain('客户表现证据验收板');
    expect(readyEvidence.requiredEvidenceChecks.every(check => check.state === 'ready')).toBe(true);
    expect(readyEvidence.uploadRoutes).toContain('把文件放到 04-customer-return 云盘目录');
    expect(missingBoard.status).toBe('needs_evidence');
    expect(missingBoard.evidenceCards.filter(card => card.state === 'missing')).toHaveLength(3);
    expect(missingBoard.nextOwnerActions).toHaveLength(3);
    expect(missingEvidence.status).toBe('needs_customer_upload');
    expect(missingEvidence.blockedWhen.join(' ')).toContain('只有口头反馈');
    expect(missingEvidence.nextRoundHandoff.join(' ')).toContain('发布链接');
  });

  it('turns customer self-publishing evidence into a clear upload guide', () => {
    const returnPlan = buildCommerceCloudDriveReturnPlan(baseInput, buildCommerceCloudDriveManifest(baseInput));
    const report = evaluateCommercePerformanceUploads([
      {
        platform: 'xiaohongshu',
        publishedUrl: 'https://example.test/post',
        screenshotPath: '04-customer-return/post.png',
        csvRows: [{ title: 'Hook B', impressions: 800, clicks: 90, orders: 4, revenue: 396 }],
      },
    ]);
    const intakeBoard = buildCommerceCustomerReturnIntakeBoard(report, returnPlan);
    const guide = buildCommerceCustomerEvidenceUploadGuide(report, returnPlan, intakeBoard);
    const missingGuide = buildCommerceCustomerEvidenceUploadGuide(
      evaluateCommercePerformanceUploads([{ platform: 'tiktok' }]),
      returnPlan,
    );

    expect(guide.headline).toContain('客户证据上传指南');
    expect(guide.uploadSteps.map(step => step.title)).toEqual(['客户自己发布', '回传四类证据', '先验收再复盘']);
    expect(guide.acceptedEvidence.map(item => item.label)).toEqual(['发布链接', '发布截图', '表现 CSV', '客户备注']);
    expect(guide.nextRoundMapping[0].nextWenaiAction).toContain('标题和口播矩阵');
    expect(guide.doNotAskCustomerFor).toContain('不索要 Cookie 或浏览器登录态。');
    expect(guide.reviewReadinessRules.join(' ')).toContain('不自动登录');
    expect(missingGuide.promise).toContain('不需要客户交账号');
    expect(JSON.stringify(guide)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('connects customer returns to remix support and evidence actions', () => {
    const returnPlan = buildCommerceCloudDriveReturnPlan(baseInput, buildCommerceCloudDriveManifest(baseInput));
    const report = evaluateCommercePerformanceUploads([
      {
        platform: 'xiaohongshu',
        publishedUrl: 'https://example.test/post',
        screenshotPath: '04-customer-return/post.png',
        csvRows: [{ title: 'Hook B', impressions: 800, clicks: 90, orders: 4, revenue: 396 }],
      },
    ]);
    const returnBoard = buildCommerceCustomerReturnIntakeBoard(report, returnPlan);
    const servicePack = buildCommerceCustomerServicePack(baseInput);
    const supportWorkflow = buildCommerceCustomerSupportWorkflow(baseInput, servicePack);
    const actionBoard = buildCommercePostPublishActionBoard(report, returnBoard, supportWorkflow, returnPlan);

    expect(actionBoard.status).toBe('ready_for_next_round');
    expect(actionBoard.evidenceSummary).toContain('Hook B');
    expect(actionBoard.actionLanes.map(lane => lane.id)).toEqual(['remix', 'support', 'asset', 'evidence']);
    expect(actionBoard.actionLanes.find(lane => lane.id === 'support')?.output).toContain('FAQ 更新');
    expect(actionBoard.actionLanes.find(lane => lane.id === 'evidence')?.actions.join(' ')).toContain('04-customer-return');
    expect(actionBoard.reviewScript.join(' ')).toContain('最佳标题');
    expect(actionBoard.doNotAutomate).toContain('不自动读取平台后台。');
    expect(JSON.stringify(actionBoard)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('dry-runs ready render jobs into exported outputs without external providers', () => {
    const completeInput: CommerceRemixPlanInput = {
      ...baseInput,
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    };
    const plan = buildCommerceRemixEnginePlan(completeInput);
    const result = executeCommerceRemixDryRun(plan);

    expect(result.exportedCount).toBe(3);
    expect(result.needsMaterialCount).toBe(0);
    expect(result.outputPaths).toEqual(expect.arrayContaining(['exports/travel-pet-bowl-9x16.mp4', 'exports/travel-pet-bowl-16x9.mp4']));
    expect(result.traces[0].trace).toEqual(expect.arrayContaining([
      expect.stringContaining('render:start'),
      expect.stringContaining('render:exported'),
    ]));
  });

  it('keeps dry-run material gaps and retryable failures isolated per queue item', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const gapResult = executeCommerceRemixDryRun(plan);
    const readyPlan = buildCommerceRemixEnginePlan({
      ...baseInput,
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    });
    const failedResult = executeCommerceRemixDryRun(readyPlan, { failQueueItemIds: [readyPlan.queue[1].id] });

    expect(gapResult.exportedCount).toBe(0);
    expect(gapResult.needsMaterialCount).toBe(3);
    expect(gapResult.traces[0].trace.join(' ')).toContain('material_gap:missing-model');
    expect(failedResult.exportedCount).toBe(2);
    expect(failedResult.blockedCount).toBe(1);
    expect(failedResult.queue.find(item => item.id === readyPlan.queue[1].id)?.status).toBe('failed_retryable');
  });

  it('plans large render queues as bounded batches and isolates failed items during execution', () => {
    const readyPlan = buildCommerceRemixEnginePlan({
      ...baseInput,
      platforms: ['tiktok', 'xiaohongshu', 'shopify', 'meta', 'wechat_video'],
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    });
    const batchPlan = buildCommerceRenderBatchPlan(readyPlan.queue, { maxConcurrency: 2, retryBudget: 2 });
    const execution = executeCommerceRenderBatches(readyPlan.queue, batchPlan, { failQueueItemIds: [readyPlan.queue[2].id] });

    expect(batchPlan.batches).toHaveLength(3);
    expect(batchPlan.batches[0]).toMatchObject({ concurrency: 2, retryBudget: 2 });
    expect(batchPlan.stabilityRules.join(' ')).toContain('缺素材的任务不进入渲染批次');
    expect(execution.exportedCount).toBe(4);
    expect(execution.retryableCount).toBe(1);
    expect(execution.traces.join(' ')).toContain(`${readyPlan.queue[2].id}:failed_retryable`);
  });

  it('summarizes render queue reliability as customer-visible lanes and scale decisions', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 2, retryBudget: 2 });
    const board = buildCommerceRenderReliabilityBoard(plan.queue, batchPlan);
    const runbook = buildCommerceRenderOperationsRunbook(plan.queue, batchPlan);

    expect(board.status).toBe('needs_material');
    expect(board.customerPromise).toContain('失败只重跑单条');
    expect(board.lanes.map(lane => lane.id)).toEqual(['material-gate', 'ready-queue', 'retry-lane', 'exported-pack']);
    expect(board.lanes.find(lane => lane.id === 'material-gate')?.count).toBe(3);
    expect(board.batchControls.join(' ')).toContain('缺素材、blocked 和人工复核任务不占用渲染并发');
    expect(board.customerVisibleStatuses.join(' ')).toContain('客户自己登录平台发布');
    expect(board.statusRecoveryGuide.map(item => item.status)).toEqual(['待补素材', '可渲染', '需复核', '可发布']);
    expect(board.statusRecoveryGuide.find(item => item.status === '需复核')?.wenaiAction).toContain('单条重试');
    expect(board.operatorRules.join(' ')).toContain('不自动登录客户平台');
    expect(board.scaleDecision.currentMode).toContain('本地批次');
    expect(board.scaleDecision.notNeededYet).toContain('首版不需要客户平台自动发布权限');
    expect(runbook.headline).toContain('稳定渲染运行手册');
    expect(runbook.preflightChecks.join(' ')).toContain('不拼接 shell 字符串');
    expect(runbook.batchSteps.map(step => step.id)).toEqual(['material-gate', 'batch-run', 'single-retry', 'quality-sampling', 'publish-pack']);
    expect(runbook.batchSteps.find(step => step.id === 'single-retry')?.failureFallback).toContain('人工复核');
    expect(runbook.escalationMatrix.map(item => item.trigger).join(' ')).toContain('平台自动发布');
    expect(runbook.customerHandoff.join(' ')).toContain('客户自己登录平台发布');
    expect(JSON.stringify(runbook)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds a compact ecommerce remix template bank with safe captions and quality checks', () => {
    const templates = buildCommerceRemixTemplateBank(baseInput);

    expect(templates.map(template => template.id)).toEqual(['hook-proof-cta', 'model-scene-proof', 'service-objection-loop']);
    expect(templates[0].sceneOrder.join(' ')).toContain('stable feeding outside');
    expect(templates[1].captionSafeArea).toContain('字幕最多两行');
    expect(templates[2].qualityChecks.join(' ')).toContain('售后承诺不过度');
  });

  it('scores remix quality before customer export and exposes concrete fixes', () => {
    const incomplete = evaluateCommerceRemixQuality(baseInput);
    const completeInput: CommerceRemixPlanInput = {
      ...baseInput,
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    };
    const complete = evaluateCommerceRemixQuality(completeInput);

    expect(incomplete.passed).toBe(false);
    expect(incomplete.checks.find(check => check.id === 'material-ready')).toMatchObject({ passed: false });
    expect(incomplete.operatorSummary).toContain('先补素材');
    expect(complete.passed).toBe(true);
    expect(complete.score).toBe(100);
  });

  it('builds customer service and after-sales material from ecommerce selling points', () => {
    const pack = buildCommerceCustomerServicePack(baseInput);
    const workflow = buildCommerceCustomerSupportWorkflow(baseInput, pack);
    const conversationBoard = buildCommerceSalesConversationBoard(baseInput, pack, workflow);

    expect(pack.faq[0].question).toContain('Travel Pet Bowl');
    expect(pack.faq[0].answer).toContain('traveling pet owners');
    expect(pack.objectionReplies.map(item => item.objection)).toEqual(['觉得价格高', '担心不好用', '物流或售后问题']);
    expect(pack.afterSalesCards).toHaveLength(3);
    expect(pack.escalationRules.join(' ')).toContain('退款');
    expect(workflow.preSaleReplies.map(item => item.scenario)).toContain('客户觉得贵');
    expect(workflow.negativeReviewRecovery.map(item => item.issue)).toContain('物流或售后不满');
    expect(workflow.humanHandoffRules.join(' ')).toContain('平台处罚风险');
    expect(conversationBoard.lanes.map(lane => lane.id)).toEqual(['inquiry', 'recommendation', 'publish_followup', 'after_sales', 'repurchase']);
    expect(conversationBoard.lanes.find(lane => lane.id === 'publish_followup')?.proofToCollect).toContain('发布链接');
    expect(conversationBoard.noAutomationBoundaries).toContain('不自动登录客户平台账号');
    expect(conversationBoard.inboxFields.map(field => field.label)).toContain('客户问题截图');

    const opsConsole = buildCommerceConversationOpsConsole(baseInput, conversationBoard, pack);
    expect(opsConsole.headline).toContain('chat Cut 式电商对话工单台');
    expect(opsConsole.triageColumns.map(column => column.id)).toEqual(['question', 'answer', 'asset', 'content_loop']);
    expect(opsConsole.replyPackets.map(packet => packet.laneId)).toEqual(['inquiry', 'recommendation', 'publish_followup', 'after_sales', 'repurchase']);
    expect(opsConsole.replyPackets.find(packet => packet.laneId === 'after_sales')?.whenToEscalate).toContain('退款');
    expect(opsConsole.inboxWorkflow.join(' ')).toContain('高频问题转成下一轮标题矩阵');
    expect(opsConsole.customerUploadFields.join(' ')).toContain('客户问题截图');
    expect(opsConsole.noAutomationRules).toContain('不自动登录客户客服后台或平台账号。');
    expect(JSON.stringify(opsConsole)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds model image tasks without requiring image provider keys', () => {
    const pack = buildCommerceModelImageTaskPack(baseInput);

    expect(pack.providerBoundary).toContain('未接 Key 时先导出 prompt');
    expect(pack.tasks.map(task => task.id)).toEqual([
      'model-handheld-proof',
      'scene-lifestyle-proof',
      'detail-proof-card',
      'comparison-card',
    ]);
    expect(pack.tasks[0].prompt).toContain('Travel Pet Bowl');
    expect(pack.tasks[0].fallbackWithoutKey).toContain('补素材任务');
    expect(pack.reviewChecklist.join(' ')).toContain('模特图必须有生成记录或客户授权');
  });

  it('connects model images, remix, publishing, support, and return evidence into one ecommerce loop', () => {
    const imagePack = buildCommerceModelImageTaskPack(baseInput);
    const servicePack = buildCommerceCustomerServicePack(baseInput);
    const supportWorkflow = buildCommerceCustomerSupportWorkflow(baseInput, servicePack);
    const returnPlan = buildCommerceCloudDriveReturnPlan(baseInput, buildCommerceCloudDriveManifest(baseInput));
    const console = buildCommerceEcommerceGrowthLoopConsole(baseInput, imagePack, servicePack, supportWorkflow, returnPlan);

    expect(console.headline).toContain('电商增长闭环控制台');
    expect(console.lanes.map(lane => lane.id)).toEqual(['proof_image', 'remix_video', 'publish_pack', 'support_reply', 'return_review']);
    expect(console.lanes.find(lane => lane.id === 'proof_image')?.outputPack).toContain('手持模特证明图');
    expect(console.lanes.find(lane => lane.id === 'remix_video')?.outputPack).toContain('upload-ready-checklist.md');
    expect(console.lanes.find(lane => lane.id === 'publish_pack')?.proofGate).toContain('不拿账号、密码、cookie');
    expect(console.lanes.find(lane => lane.id === 'support_reply')?.outputPack.join(' ')).toContain('FAQ');
    expect(console.lanes.find(lane => lane.id === 'return_review')?.customerProvides).toContain('表现 CSV');
    expect(console.dailyOperatorFlow.join(' ')).toContain('客户自己发布');
    expect(console.keyWaitingPolicy.join(' ')).toContain('数字人 Key 未到位');
    expect(console.notScatteredBecause.join(' ')).toContain('同一个商品项目');
    expect(console.customerSeesOnly).toContain('下一轮应该改图、改视频、改标题还是改客服');
    expect(JSON.stringify(console)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('maps open-source remix capabilities into guarded ecommerce adapters', () => {
    const adapters = buildCommerceOpenSourceAdapters();

    expect(adapters.map(adapter => adapter.id)).toEqual([
      'ffmpeg',
      'remotion',
      'vanta-video-engine',
      'openmontage-agent',
      'opencut-ai',
      'clippedai',
      'clipsai',
      'supoclip',
      'openshorts-platform',
      'moneyprinterturbo',
      'short-video-maker',
      'video-wizard',
      'ai-youtube-shorts-generator',
      'buttercut',
      'yumcut',
      'revideo',
      'twick-sdk',
      'vidosy',
      'whisper',
      'opencv-mediapipe',
      'mlt-shotcut',
      'queue-worker',
      'opentimelineio',
      'moviepy',
      'editly',
      'libopenshot',
      'mcp-video',
      'pyscenedetect',
      'auto-editor',
      'lossless-cut',
      'subtitle-edit',
      'auto-subtitles',
      'imagemagick-libheif',
      'mediainfo',
      'gpac-packager',
      'gstreamer',
    ]);
    expect(adapters.find(adapter => adapter.id === 'ffmpeg')).toMatchObject({
      integrationMode: 'local_worker',
      readiness: 'ready_now',
    });
    expect(adapters.find(adapter => adapter.id === 'remotion')?.repositoryUrl).toBe('https://github.com/remotion-dev/remotion');
    expect(adapters.find(adapter => adapter.id === 'vanta-video-engine')?.repositoryUrl).toBe('https://github.com/itsjwill/vanta');
    expect(adapters.find(adapter => adapter.id === 'openmontage-agent')?.repositoryUrl).toBe('https://github.com/calesthio/OpenMontage');
    expect(adapters.find(adapter => adapter.id === 'opencut-ai')?.repositoryUrl).toBe('https://github.com/Ekaanth/OpenCut-AI');
    expect(adapters.find(adapter => adapter.id === 'clippedai')?.repositoryUrl).toBe('https://github.com/Shaarav4795/ClippedAI');
    expect(adapters.find(adapter => adapter.id === 'clipsai')?.repositoryUrl).toBe('https://github.com/ClipsAI/clipsai');
    expect(adapters.find(adapter => adapter.id === 'supoclip')?.repositoryUrl).toBe('https://github.com/FujiwaraChoki/SupoClip');
    expect(adapters.find(adapter => adapter.id === 'openshorts-platform')?.repositoryUrl).toBe('https://github.com/mutonby/openshorts');
    expect(adapters.find(adapter => adapter.id === 'moneyprinterturbo')?.repositoryUrl).toBe('https://github.com/harry0703/MoneyPrinterTurbo');
    expect(adapters.find(adapter => adapter.id === 'short-video-maker')?.repositoryUrl).toBe('https://github.com/gyoridavid/short-video-maker');
    expect(adapters.find(adapter => adapter.id === 'video-wizard')?.repositoryUrl).toBe('https://github.com/yunlong10/VideoWizard');
    expect(adapters.find(adapter => adapter.id === 'ai-youtube-shorts-generator')?.repositoryUrl).toBe('https://github.com/samuraigpt/ai-youtube-shorts-generator');
    expect(adapters.find(adapter => adapter.id === 'buttercut')?.repositoryUrl).toBe('https://github.com/barefootford/buttercut');
    expect(adapters.find(adapter => adapter.id === 'yumcut')?.repositoryUrl).toBe('https://github.com/IgorShadurin/app.yumcut.com');
    expect(adapters.find(adapter => adapter.id === 'revideo')?.repositoryUrl).toBe('https://github.com/redotvideo/revideo');
    expect(adapters.find(adapter => adapter.id === 'twick-sdk')?.repositoryUrl).toBe('https://github.com/ncounterspecialist/twick');
    expect(adapters.find(adapter => adapter.id === 'vidosy')?.repositoryUrl).toBe('https://github.com/aaurelions/vidosy');
    expect(adapters.find(adapter => adapter.id === 'opentimelineio')?.repositoryUrl).toBe('https://github.com/AcademySoftwareFoundation/OpenTimelineIO');
    expect(adapters.find(adapter => adapter.id === 'editly')?.repositoryUrl).toBe('https://github.com/mifi/editly');
    expect(adapters.find(adapter => adapter.id === 'mcp-video')?.readiness).toBe('ready_now');
    expect(adapters.find(adapter => adapter.id === 'pyscenedetect')?.readiness).toBe('ready_now');
    expect(adapters.find(adapter => adapter.id === 'auto-editor')?.repositoryUrl).toBe('https://github.com/WyattBlue/auto-editor');
    expect(adapters.find(adapter => adapter.id === 'auto-subtitles')?.repositoryUrl).toBe('https://github.com/Eyevinn/auto-subtitles');
    expect(adapters.find(adapter => adapter.id === 'mediainfo')?.readiness).toBe('ready_now');
    expect(adapters.find(adapter => adapter.id === 'gstreamer')?.readiness).toBe('later');
    expect(adapters.find(adapter => adapter.id === 'gpac-packager')?.readiness).toBe('later');
    expect(adapters.map(adapter => adapter.guardrail).join(' ')).toContain('不接收客户账号凭据');
  });

  it('summarizes open-source remix coverage as customer-readable layers', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const adapters = buildCommerceOpenSourceAdapters();
    const coverage = buildCommerceOpenSourceCoverage(baseInput, plan, adapters);

    expect(coverage.totalAdapterCount).toBe(adapters.length);
    expect(coverage.readyNowCount).toBeGreaterThan(10);
    expect(coverage.layers.map(layer => layer.id)).toEqual([
      'source-ready',
      'clip-ready',
      'template-ready',
      'render-ready',
      'return-ready',
    ]);
    expect(coverage.layers.find(layer => layer.id === 'clip-ready')?.primaryAdapterIds).toEqual(expect.arrayContaining(['pyscenedetect', 'auto-editor', 'whisper']));
    expect(coverage.layers.find(layer => layer.id === 'render-ready')?.primaryAdapterIds).toEqual(expect.arrayContaining(['queue-worker', 'ffmpeg', 'mediainfo']));
    expect(coverage.customerPromise).toContain('自己发布');
    expect(coverage.limits).toContain('不自动登录平台账号，不保存客户 cookie。');
    expect(JSON.stringify(coverage)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('separates first-delivery work from optional provider activation', () => {
    const plan = buildCommerceProviderActivationPlan();
    const assessment = buildCommerceProviderNeedAssessment(baseInput, buildCommerceRemixEnginePlan(baseInput), plan);
    const escalationBoard = buildCommerceProviderEscalationBoard(baseInput, assessment);

    expect(plan.currentMode).toContain('本地优先');
    expect(plan.lanes.map(lane => lane.id)).toEqual([
      'image-key',
      'video-key',
      'avatar-tts-key',
      'cloud-drive',
      'analytics-api',
    ]);
    expect(plan.notNeededForFirstDelivery).toContain('平台自动登录');
    expect(plan.mustNotDo).toContain('不代管客户账号密码');
    expect(assessment.verdict).toBe('first_delivery_ready');
    expect(assessment.canRunNow.map(item => item.capability)).toContain('开源混剪和稳定渲染队列');
    expect(assessment.waitingForYourKeys.map(item => item.keyType).join(' ')).toContain('图片');
    expect(assessment.notRequiredNow).toContain('自动代客户操作电脑或浏览器');
    expect(assessment.finalRecommendation).toContain('客户自发布');
    expect(escalationBoard.headline).toContain('外部平台服务升级判断板');
    expect(escalationBoard.verdict).toBe('not_required_for_first_delivery');
    expect(escalationBoard.lanes.map(lane => lane.id)).toEqual(['generation-keys', 'cloud-render', 'platform-publish-api', 'analytics-api']);
    expect(escalationBoard.lanes.find(lane => lane.id === 'platform-publish-api')?.firstDeliveryPath).toContain('客户自己登录平台发布');
    expect(escalationBoard.doNotBuyYet.join(' ')).toContain('托管客户账号');
    expect(escalationBoard.buyOnlyAfter.join(' ')).toContain('至少一轮');
    expect(JSON.stringify(plan)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
    expect(JSON.stringify(assessment)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
    expect(JSON.stringify(escalationBoard)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('turns provider keys into an activation runbook without making them first-delivery blockers', () => {
    const plan = buildCommerceProviderActivationPlan();
    const runbook = buildCommerceProviderActivationRunbook(plan);

    expect(runbook.headline).toContain('Key 到位后的接入运行手册');
    expect(runbook.customerPromise).toContain('不等待这些 Key');
    expect(runbook.steps.map(step => step.laneId)).toEqual([
      'image-key',
      'video-key',
      'avatar-tts-key',
      'cloud-drive',
      'analytics-api',
    ]);
    expect(runbook.steps.find(step => step.laneId === 'video-key')?.writesBackTo).toContain('渲染队列');
    expect(runbook.steps.find(step => step.laneId === 'analytics-api')?.fallbackIfFailed).toContain('客户继续上传链接、截图、CSV');
    expect(runbook.keyHandlingRules.join(' ')).toContain('不在页面、日志或导出包展示 Key 值');
    expect(runbook.doneDefinition.join(' ')).toContain('没有授权的账号');
    expect(JSON.stringify(runbook)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('summarizes first delivery without waiting for image video or avatar keys', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const checklist = buildCommerceFirstDeliveryChecklist(baseInput, plan);

    expect(checklist.promise).toContain('不等图片/视频/数字人 Key');
    expect(checklist.customerInputs).toContain('商品链接或主图');
    expect(checklist.wenaiOutputs.join(' ')).toContain('平台标题矩阵');
    expect(checklist.noWaitItems).toContain('平台自动登录');
    expect(checklist.acceptanceChecklist.join(' ')).toContain('客户发布后只需回填链接、截图、CSV');
    expect(checklist.nextRoundTrigger.join(' ')).toContain('多 worker');
  });

  it('builds a customer launch readiness board from the full ecommerce delivery system', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const checklist = buildCommerceFirstDeliveryChecklist(baseInput, plan);
    const board = buildCommerceCustomerLaunchReadinessBoard(baseInput, checklist);

    expect(board.headline).toContain('客户上线前总验收板');
    expect(board.verdict).toBe('needs_customer_material');
    expect(board.score).toBeGreaterThanOrEqual(70);
    expect(board.lanes.map(lane => lane.id)).toEqual([
      'key-boundary',
      'open-remix',
      'title-matrix',
      'self-publish',
      'return-loop',
      'support-after-sales',
      'scale-provider',
    ]);
    expect(board.lanes.find(lane => lane.id === 'key-boundary')?.state).toBe('waiting_for_key');
    expect(board.lanes.find(lane => lane.id === 'open-remix')?.state).toBe('customer_action');
    expect(board.lanes.find(lane => lane.id === 'self-publish')?.customerSees).toContain('客户自己登录平台发布');
    expect(board.lanes.find(lane => lane.id === 'return-loop')?.customerSees).toContain('链接、截图、CSV');
    expect(board.mustNotPromise.join(' ')).toContain('自动登录');
    expect(board.mustNotPromise.join(' ')).toContain('API Key');
    expect(board.launchOnlyWhen.join(' ')).toContain('发布包');
    expect(JSON.stringify(board)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('turns adapters into executable remix recipes with clear pass criteria', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const recipes = buildCommerceRemixExecutionRecipes(baseInput, plan);

    expect(recipes.map(recipe => recipe.id)).toEqual([
      'recipe-template-manifest',
      'recipe-local-render',
      'recipe-speech-caption',
      'recipe-dead-air-cut',
      'recipe-safe-crop',
      'recipe-queue-runner',
      'recipe-media-probe',
    ]);
    expect(recipes.find(recipe => recipe.adapterId === 'ffmpeg')?.outputFiles).toContain('exports/travel-pet-bowl-9x16.mp4');
    expect(recipes.find(recipe => recipe.adapterId === 'auto-editor')?.passCriteria.join(' ')).toContain('原始时间戳');
    expect(recipes.find(recipe => recipe.adapterId === 'queue-worker')?.passCriteria.join(' ')).toContain('缺素材任务不进入渲染');
    expect(recipes.find(recipe => recipe.adapterId === 'mediainfo')?.outputFiles).toContain('exports/commerce-remix-travel-pet-bowl/upload-ready-checklist.md');
    expect(JSON.stringify(recipes)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('orchestrates open-source remix adapters into customer-readable capability routes', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const board = buildCommerceRemixOrchestrationBoard(baseInput, plan);

    expect(board.routes.map(route => route.id)).toEqual([
      'material-normalize',
      'clip-mining',
      'template-compose',
      'render-export',
      'qa-return-loop',
    ]);
    expect(board.routes.find(route => route.id === 'template-compose')?.primaryAdapterIds).toEqual(expect.arrayContaining(['remotion', 'opentimelineio', 'editly']));
    expect(board.routes.find(route => route.id === 'render-export')?.primaryAdapterIds).toEqual(expect.arrayContaining(['queue-worker', 'ffmpeg', 'mcp-video']));
    expect(board.routes.find(route => route.id === 'qa-return-loop')?.primaryAdapterIds).toContain('mediainfo');
    expect(board.customerVisibleOutputs).toContain('每个平台的标题/文案/标签/发布清单');
    expect(board.notProviderBlockers).toContain('平台自动登录不是首版阻塞项');
    expect(JSON.stringify(board)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('selects the open-source remix stack by customer material situation', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const selector = buildCommerceOpenSourceStackSelector(baseInput, plan);

    expect(selector.headline).toContain('开源混剪栈选择器');
    expect(selector.defaultStack).toEqual(expect.arrayContaining([
      'mediainfo',
      'lossless-cut',
      'pyscenedetect',
      'auto-editor',
      'subtitle-edit',
      'ffmpeg',
      'queue-worker',
    ]));
    expect(selector.decisions.map(decision => decision.id)).toEqual([
      'normalize-first',
      'long-material-slicing',
      'speech-subtitle',
      'template-composition',
      'stable-render',
      'return-loop',
    ]);
    expect(selector.decisions.find(decision => decision.id === 'long-material-slicing')?.defaultAdapterIds).toEqual(expect.arrayContaining(['lossless-cut', 'pyscenedetect', 'auto-editor']));
    expect(selector.decisions.find(decision => decision.id === 'speech-subtitle')?.defaultAdapterIds).toEqual(expect.arrayContaining(['whisper', 'subtitle-edit']));
    expect(selector.decisions.find(decision => decision.id === 'template-composition')?.defaultAdapterIds).toEqual(expect.arrayContaining(['remotion', 'opentimelineio', 'editly']));
    expect(selector.decisions.find(decision => decision.id === 'stable-render')?.stabilityCheck).toContain('blocked reason');
    expect(selector.scaleUpRules.join(' ')).toContain('GStreamer');
    expect(selector.doNotUseFor).toContain('不保存客户平台账号、密码、cookie 或后台 token。');
    expect(JSON.stringify(selector)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('defines install and smoke-test gates before open-source tools enter delivery', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const matrix = buildCommerceOpenSourceInstallMatrix(baseInput, plan);

    expect(matrix.headline).toContain('开源混剪安装和冒烟验收矩阵');
    expect(matrix.minimumLocalStack).toEqual(expect.arrayContaining([
      'mediainfo',
      'pyscenedetect',
      'auto-editor',
      'remotion',
      'ffmpeg',
      'queue-worker',
    ]));
    expect(matrix.lanes.map(lane => lane.id)).toEqual([
      'asset-normalize-smoke',
      'clip-mining-smoke',
      'caption-smoke',
      'template-compose-smoke',
      'render-queue-smoke',
      'qa-return-smoke',
    ]);
    expect(matrix.lanes.find(lane => lane.id === 'render-queue-smoke')?.smokeTest).toContain('故意失败一次');
    expect(matrix.lanes.find(lane => lane.id === 'clip-mining-smoke')?.adapterIds).toEqual(expect.arrayContaining(['lossless-cut', 'pyscenedetect', 'auto-editor']));
    expect(matrix.readyDefinition.join(' ')).toContain('客户看到的是发布包');
    expect(matrix.scaleLaterStack).toEqual(expect.arrayContaining(['gstreamer', 'gpac-packager']));
    expect(matrix.providerBoundary).toContain('不把未通过 smoke test 的工具展示为可交付能力。');
    expect(JSON.stringify(matrix)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('turns GitHub video project patterns into one guarded ecommerce remix blueprint', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const adapters = buildCommerceOpenSourceAdapters();
    const blueprint = buildCommerceOpenSourceRemixBlueprint(baseInput, plan, adapters);

    expect(blueprint.headline).toContain('GitHub 开源混剪蓝图');
    expect(blueprint.promise).toContain('可发布资产');
    expect(blueprint.githubPatternGroups.map(group => group.id)).toEqual([
      'one-pipeline-many-tools',
      'clip-first-remix',
      'caption-voiceover-loop',
      'programmatic-render',
      'self-publish-return',
    ]);
    expect(blueprint.githubPatternGroups.find(group => group.id === 'one-pipeline-many-tools')?.referenceAdapterIds).toEqual(expect.arrayContaining([
      'vanta-video-engine',
      'openmontage-agent',
      'remotion',
    ]));
    expect(blueprint.githubPatternGroups.find(group => group.id === 'programmatic-render')?.referenceAdapterIds).toEqual(expect.arrayContaining([
      'revideo',
      'twick-sdk',
      'vidosy',
      'queue-worker',
    ]));
    expect(blueprint.githubPatternGroups.find(group => group.id === 'caption-voiceover-loop')?.whatNotCopy).toContain('声音克隆');
    expect(blueprint.deliveryRules.join(' ')).toContain('不能把未验证仓库直接展示为客户可用功能');
    expect(blueprint.deliveryRules.join(' ')).toContain('不保存账号、密码、cookie');
    expect(blueprint.scaleDecision.join(' ')).toContain('超过 100 条');
    expect(JSON.stringify(blueprint)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('prioritizes GitHub remix repositories as customer-safe workflow layers', () => {
    const adapters = buildCommerceOpenSourceAdapters();
    const radar = buildCommerceGitHubRemixRadar(baseInput, adapters);

    expect(adapters.map(adapter => adapter.id)).toEqual(expect.arrayContaining([
      'moneyprinterturbo',
      'short-video-maker',
      'video-wizard',
      'opencut-ai',
      'clippedai',
      'clipsai',
      'supoclip',
      'buttercut',
    ]));
    expect(radar.headline).toContain('GitHub 开源混剪能力雷达');
    expect(radar.repoFamilies.map(family => family.id)).toEqual([
      'clip-mining',
      'script-caption-voice',
      'template-render',
      'light-editing',
      'pipeline-system',
      'qa-scale',
    ]);
    expect(radar.repoFamilies.find(family => family.id === 'clip-mining')?.repoIds).toEqual(expect.arrayContaining(['pyscenedetect', 'auto-editor', 'video-wizard', 'clippedai', 'clipsai', 'supoclip']));
    expect(radar.repoFamilies.find(family => family.id === 'light-editing')?.repoIds).toEqual(expect.arrayContaining(['opencut-ai', 'buttercut']));
    expect(radar.repoFamilies.find(family => family.id === 'pipeline-system')?.repoIds).toEqual(expect.arrayContaining(['moneyprinterturbo', 'short-video-maker', 'yumcut']));
    expect(radar.adoptionQueue.map(queue => queue.stage)).toEqual(['now', 'next', 'scale_later']);
    expect(radar.adoptionQueue.find(queue => queue.stage === 'now')?.reason).toContain('不等图片/视频/数字人 Key');
    expect(radar.customerReadyDefinition.join(' ')).toContain('客户自己发布');
    expect(radar.notProviderDependency.join(' ')).toContain('自动登录');
    expect(JSON.stringify(radar)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('turns open-source remix tools into a stable customer-visible queue console', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const adapters = buildCommerceOpenSourceAdapters();
    const recipes = buildCommerceRemixExecutionRecipes(baseInput, plan, adapters);
    const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 2, retryBudget: 2 });
    const renderBoard = buildCommerceRenderReliabilityBoard(plan.queue, batchPlan);
    const console = buildCommerceOpenSourceQueueConsole(baseInput, adapters, recipes, renderBoard);

    expect(console.headline).toContain('开源混剪队列控制台');
    expect(console.stages.map(stage => stage.id)).toEqual(['source-slicing', 'caption-script', 'template-compose', 'stable-render', 'qa-handoff']);
    expect(console.stages.find(stage => stage.id === 'source-slicing')?.adapterIds).toEqual(expect.arrayContaining(['lossless-cut', 'pyscenedetect', 'auto-editor']));
    expect(console.stages.find(stage => stage.id === 'caption-script')?.adapterIds).toContain('short-video-maker');
    expect(console.stages.find(stage => stage.id === 'template-compose')?.adapterIds).toEqual(expect.arrayContaining(['remotion', 'vanta-video-engine', 'opentimelineio']));
    expect(console.stages.find(stage => stage.id === 'stable-render')?.adapterIds).toEqual(expect.arrayContaining(['ffmpeg', 'queue-worker']));
    expect(console.batchControls.join(' ')).toContain('smoke test');
    expect(console.failurePolicy.join(' ')).toContain('单条失败只重跑单条');
    expect(console.failurePolicy.join(' ')).toContain('不因为没有平台自动登录');
    expect(console.customerVisibleProof).toContain('render-log.json');
    expect(console.scaleUpgradePath.join(' ')).toContain('不接账号密码和 cookie');
    expect(JSON.stringify(console)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('states the open-source remix last mile before buying external providers', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const adapters = buildCommerceOpenSourceAdapters();
    const recipes = buildCommerceRemixExecutionRecipes(baseInput, plan, adapters);
    const renderBoard = buildCommerceRenderReliabilityBoard(plan.queue, buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 2, retryBudget: 2 }));
    const queueConsole = buildCommerceOpenSourceQueueConsole(baseInput, adapters, recipes, renderBoard);
    const board = buildCommerceOpenSourceLastMileBoard(baseInput, adapters, queueConsole, buildCommerceProviderNeedAssessment(baseInput, plan), renderBoard);

    expect(board.headline).toContain('开源混剪最后一公里判断板');
    expect(board.lanes.map(lane => lane.id)).toEqual(['source-to-clips', 'captions-to-hooks', 'template-to-mp4', 'mp4-to-publish-pack', 'publish-to-next-round']);
    expect(board.lanes.find(lane => lane.id === 'template-to-mp4')?.adapters).toEqual(expect.arrayContaining(['remotion', 'opentimelineio', 'ffmpeg']));
    expect(board.lanes.find(lane => lane.id === 'publish-to-next-round')?.lastMileOwner).toBe('customer');
    expect(board.canShipWithoutKeys.join(' ')).toContain('多账号矩阵');
    expect(board.customerFinalStep.join(' ')).toContain('客户自己登录');
    expect(board.upgradeOnlyWhen.join(' ')).toContain('平台表现数据 API');
    expect(board.notSolvingWithOpenSource.join(' ')).toContain('账号、密码、cookie');
    expect(JSON.stringify(board)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds a customer-readable remix workflow with no-provider fallbacks', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const playbook = buildCommerceRemixWorkflowPlaybook(baseInput, plan);
    const chatCutConsole = buildCommerceChatCutRemixConsole(baseInput, plan);
    const deliveryMap = buildCommerceCustomerDeliveryMap(baseInput);
    const systemMap = buildCommerceWorkbenchSystemMap(baseInput, plan);

    expect(playbook.stages.map(stage => stage.id)).toEqual([
      'brief',
      'asset-shelf',
      'template-remix',
      'render-queue',
      'publishing-pack',
      'return-loop',
    ]);
    expect(playbook.stages.find(stage => stage.id === 'publishing-pack')?.qualityGate).toContain('不自动登录');
    expect(playbook.noProviderFallbacks.join(' ')).toContain('客户上传链接、截图、CSV');
    expect(chatCutConsole.headline).toContain('chat Cut 式精简混剪控制台');
    expect(chatCutConsole.quickActions.map(action => action.label)).toEqual(['改前三秒', '换证明素材', '批量换标题', '只重跑失败条']);
    expect(chatCutConsole.quickActions.find(action => action.label === '只重跑失败条')?.systemDoes).toContain('只重跑单条');
    expect(chatCutConsole.cutFlow.map(step => step.id)).toEqual(['source', 'cut', 'script', 'compose', 'qa', 'queue']);
    expect(chatCutConsole.defaultRecipes.map(recipe => recipe.id)).toEqual(['proof-first', 'model-scene', 'support-objection']);
    expect(chatCutConsole.defaultRecipes[0].openSourceStack).toContain('pyscenedetect');
    expect(chatCutConsole.reliabilityRules.join(' ')).toContain('失败只回到单条任务');
    expect(chatCutConsole.customerOnlySees).toContain('哪些片段会被用');
    expect(JSON.stringify(chatCutConsole)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
    expect(deliveryMap.phases.map(phase => phase.id)).toEqual(['brief', 'image', 'remix', 'publish', 'support', 'return']);
    expect(deliveryMap.oneLinePromise).toContain('客户只按步骤补资料');
    expect(deliveryMap.handoffRules.join(' ')).toContain('客户自行完成');
    expect(systemMap.headline).toContain('功能很多');
    expect(systemMap.primaryRoute).toEqual(['商品资料进来', '素材和模特图补齐', '混剪成批量短视频', '导出多平台发布包', '客户自己发布', '回填证据做下一轮']);
    expect(systemMap.lanes.map(lane => lane.id)).toEqual(['brief', 'model_image', 'remix', 'publish_pack', 'support', 'review']);
    expect(systemMap.lanes.find(lane => lane.id === 'model_image')?.status).toBe('key_enhanced');
    expect(systemMap.lanes.find(lane => lane.id === 'publish_pack')?.customerAction).toContain('不代登');
    expect(systemMap.lanes.find(lane => lane.id === 'review')?.proofToCollect).toContain('表现 CSV');
    expect(systemMap.notInScope.join(' ')).toContain('cookie');
    expect(JSON.stringify(systemMap)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);

    const cockpit = buildCommerceDailyOperatorCockpit(baseInput, plan, systemMap);
    expect(cockpit.headline).toContain('电商人每日运营驾驶舱');
    expect(cockpit.todayFocus.map(item => item.id)).toEqual(['brief', 'model_image', 'remix', 'publish_pack', 'support', 'review']);
    expect(cockpit.todayFocus.find(item => item.id === 'support')?.wenaiDoes).toContain('FAQ');
    expect(cockpit.commandStrip.join(' ')).toContain('今天能交付的图、视频、标题和客服素材');
    expect(cockpit.customerCanIgnore.join(' ')).toContain('不用理解 FFmpeg');
    expect(JSON.stringify(cockpit)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);

    const nextStepCenter = buildCommerceCustomerNextStepCommandCenter(baseInput, systemMap);
    expect(nextStepCenter.headline).toContain('客户下一步指挥台');
    expect(nextStepCenter.primaryAction.href).toBe('/factory/create?variant=friend_trial');
    expect(nextStepCenter.commandCards.map(card => card.id)).toEqual(['material', 'produce', 'publish', 'return']);
    expect(nextStepCenter.providerReadinessCards.map(card => card.id)).toEqual(['run-now', 'wait-key', 'not-first']);
    expect(nextStepCenter.providerReadinessCards.find(card => card.id === 'run-now')?.status).toContain('首版可交付');
    expect(nextStepCenter.providerReadinessCards.find(card => card.id === 'not-first')?.customerMessage).toContain('平台自动登录');
    expect(nextStepCenter.commandCards.find(card => card.id === 'publish')?.customerDoes).toContain('客户自己登录平台发布');
    expect(nextStepCenter.commandCards.find(card => card.id === 'return')?.proofToReturn).toContain('表现 CSV');
    expect(nextStepCenter.visibleBoundaries.join(' ')).toContain('不托管账号密码');
    expect(nextStepCenter.noNeedToUnderstand.join(' ')).toContain('FFmpeg');
    expect(JSON.stringify(nextStepCenter)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('plans platform title matrices for customer self-publishing', () => {
    const matrix = buildCommercePublishingMatrixPlan(baseInput);
    const personas = buildCommerceCreatorPersonaMatrix(baseInput, matrix);
    const titleBoard = buildCommerceSuperIpTitleBoard(baseInput, personas);
    const qualityGate = buildCommerceTitleQualityGate(baseInput, titleBoard, matrix);

    expect(matrix).toHaveLength(3);
    expect(matrix[0].accountAngles.map(angle => angle.accountType)).toEqual(['真实买家号', '测评种草号', '店铺官方号']);
    expect(matrix[0].accountAngles[0].publishNote).toContain('客户自发');
    expect(matrix[1].accountAngles[1].assetHint).toContain('对比图');
    expect(personas).toHaveLength(3);
    expect(personas[0].personas).toHaveLength(3);
    expect(personas[0].personas[0].openingLines.join(' ')).toContain('回填链接、截图或 CSV');
    expect(personas[0].personas[0].contentPillars).toContain('痛点场景');
    expect(personas[0].personas[1].filmingPrompts.join(' ')).toContain('桌面俯拍');
    expect(personas[0].personas[2].returnMetrics.length).toBeGreaterThanOrEqual(4);
    expect(personas[0].personas[0].sourcePatterns.join(' ')).toContain('开源提词器');
    expect(personas[0].personas[0].doNotClaim).toContain('不承诺平台自动登录或自动发布');
    expect(titleBoard.headline).toContain('超级 IP 标题和口播作战板');
    expect(titleBoard.titleFamilies.map(family => family.id)).toEqual(['buyer-pain-scene', 'review-proof', 'official-service']);
    expect(titleBoard.titleFamilies[0].voiceoverBeats.join(' ')).toContain('具体使用场景');
    expect(titleBoard.titleFamilies[1].evidenceRequired).toContain('对比图');
    expect(titleBoard.operatingRules.join(' ')).toContain('客户自己登录平台发布');
    expect(titleBoard.returnLoop.join(' ')).toContain('高频问题转成下一条口播开场');
    expect(qualityGate.headline).toContain('标题和口播发布前验收门');
    expect(qualityGate.gateStatus).toBe('needs_copy_review');
    expect(qualityGate.checks.map(check => check.label)).toContain('不越过发布边界');
    expect(qualityGate.platformGuides.map(guide => guide.platform)).toEqual(['tiktok', 'xiaohongshu', 'shopify']);
    expect(qualityGate.publishOnlyWhen.join(' ')).toContain('回填字段');
    expect(qualityGate.returnSignals.join(' ')).toContain('证据不足');
    expect(JSON.stringify(qualityGate)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('turns persona matrices into a customer self-publishing command center', () => {
    const matrix = buildCommercePublishingMatrixPlan(baseInput);
    const personas = buildCommerceCreatorPersonaMatrix(baseInput, matrix);
    const commandCenter = buildCommerceSelfPublishingCommandCenter(baseInput, matrix, personas);

    expect(commandCenter.headline).toContain('客户自发布操作台');
    expect(commandCenter.slots).toHaveLength(9);
    expect(commandCenter.slots.find(slot => slot.platform === 'xiaohongshu' && slot.accountType === '真实买家号')).toMatchObject({
      platform: 'xiaohongshu',
      accountType: '真实买家号',
      publishWindow: '第 1 天首发',
    });
    expect(commandCenter.slots[0].copyAction).toContain('客户自己登录');
    expect(commandCenter.slots[0].evidenceRequired).toContain('发布链接');
    expect(commandCenter.customerSteps.join(' ')).toContain('不保存账号、密码、cookie');
    expect(commandCenter.evidenceInbox.map(item => item.label)).toContain('表现 CSV');
    expect(commandCenter.noLoginRules).toContain('不绕过平台发布流程。');
    expect(commandCenter.nextRoundDecisions).toContain('哪个账号人设值得继续发布。');
    expect(JSON.stringify(commandCenter)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('creates a customer-readable persona publishing console with self-publish boundaries', () => {
    const matrix = buildCommercePublishingMatrixPlan(baseInput);
    const personas = buildCommerceCreatorPersonaMatrix(baseInput, matrix);
    const titleBoard = buildCommerceSuperIpTitleBoard(baseInput, personas);
    const commandCenter = buildCommerceSelfPublishingCommandCenter(baseInput, matrix, personas);
    const console = buildCommercePersonaPublishingConsole(baseInput, matrix, personas, titleBoard, commandCenter);

    expect(console.headline).toContain('多账号人设发布矩阵');
    expect(console.rows).toHaveLength(9);
    expect(console.rows.map(row => row.accountType)).toContain('真实买家号');
    expect(console.rows.map(row => row.accountType)).toContain('测评种草号');
    expect(console.rows.map(row => row.accountType)).toContain('店铺官方号');
    expect(console.rows[0].firstThreeVoiceoverLines.length).toBeGreaterThanOrEqual(3);
    expect(console.rows[0].customerCopyAction).toContain('客户自己登录');
    expect(console.rows[0].manualPublishDestination).toContain('客户自己登录');
    expect(console.evidenceFields).toContain('发布链接');
    expect(console.evidenceFields).toContain('表现 CSV');
    expect(console.evidenceFields).toContain('评论截图');
    expect(console.boundaryRules.join(' ')).toContain('不索要客户账号');
    expect(console.customerHandoffChecklist.join(' ')).toContain('换前三秒');
    expect(JSON.stringify(console)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('summarizes render capacity without pretending platform automation', () => {
    const completeInput: CommerceRemixPlanInput = {
      ...baseInput,
      assets: [
        ...baseInput.assets,
        { id: 'missing-model', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
      ],
    };
    const plan = buildCommerceRemixEnginePlan(completeInput);
    const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 2 });
    const capacity = buildCommerceRenderCapacityPlan(plan.queue, batchPlan);

    expect(capacity.recommendedConcurrency).toBe(2);
    expect(capacity.estimatedOutputsPerHour).toBe(24);
    expect(capacity.queuePolicy.join(' ')).toContain('不自动登录任何平台账号');
    expect(capacity.monitoringSignals.join(' ')).toContain('failed/blocked');
    expect(capacity.humanReviewGates.join(' ')).toContain('字幕、商品主体');
    expect(capacity.storageHandoff.join(' ')).toContain('04-customer-return');
    expect(capacity.scaleTriggers.join(' ')).toContain('多 worker');
    expect(capacity.scalePath.join(' ')).toContain('多 worker');
    expect(capacity.healthChecklist.map(item => item.label)).toEqual(['先跑样片', '小批次放量', '发布前抽检', '回填再扩容']);
    expect(capacity.healthChecklist.find(item => item.label === '回填再扩容')?.stopLine).toContain('没有真实发布证据');
    expect(capacity.customerScaleLadder.map(item => item.stage)).toEqual(['首批试跑', '小批量交付', '稳定放量', '规模化升级']);
    expect(capacity.customerScaleLadder.find(item => item.stage === '规模化升级')?.mode).toContain('多 worker');
  });
});
