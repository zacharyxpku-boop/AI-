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
  buildCommerceSalesConversationBoard,
  buildCommerceCustomerServicePack,
  buildCommerceCustomerSupportWorkflow,
  buildCommerceCreatorPersonaMatrix,
  buildCommerceFirstDeliveryChecklist,
  buildCommerceModelImageTaskPack,
  buildCommerceOpenSourceAdapters,
  buildCommerceOpenSourceCoverage,
  buildCommercePostPublishActionBoard,
  buildCommerceProviderActivationRunbook,
  buildCommerceProviderActivationPlan,
  buildCommerceProviderNeedAssessment,
  buildCommercePublishingMatrixPlan,
  buildCommerceRemixTemplateBank,
  buildCommerceRemixExecutionRecipes,
  buildCommerceRemixOrchestrationBoard,
  buildCommerceRemixWorkflowPlaybook,
  buildCommerceSelfPublishingCommandCenter,
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

    expect(readyBoard.status).toBe('ready_for_review');
    expect(readyBoard.evidenceCards.every(card => card.state === 'received')).toBe(true);
    expect(readyBoard.reviewQueue.join(' ')).toContain('Hook B');
    expect(readyBoard.nextOwnerActions.length).toBeGreaterThanOrEqual(4);
    expect(missingBoard.status).toBe('needs_evidence');
    expect(missingBoard.evidenceCards.filter(card => card.state === 'missing')).toHaveLength(3);
    expect(missingBoard.nextOwnerActions).toHaveLength(3);
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

  it('maps open-source remix capabilities into guarded ecommerce adapters', () => {
    const adapters = buildCommerceOpenSourceAdapters();

    expect(adapters.map(adapter => adapter.id)).toEqual([
      'ffmpeg',
      'remotion',
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
    expect(adapters.find(adapter => adapter.id === 'opentimelineio')?.repositoryUrl).toBe('https://github.com/AcademySoftwareFoundation/OpenTimelineIO');
    expect(adapters.find(adapter => adapter.id === 'editly')?.repositoryUrl).toBe('https://github.com/mifi/editly');
    expect(adapters.find(adapter => adapter.id === 'mcp-video')?.readiness).toBe('ready_now');
    expect(adapters.find(adapter => adapter.id === 'pyscenedetect')?.readiness).toBe('ready_now');
    expect(adapters.find(adapter => adapter.id === 'auto-editor')?.repositoryUrl).toBe('https://github.com/WyattBlue/auto-editor');
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
    expect(JSON.stringify(plan)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
    expect(JSON.stringify(assessment)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
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
    expect(board.notProviderBlockers).toContain('平台自动登录不是首版 blocker');
    expect(JSON.stringify(board)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds a customer-readable remix workflow with no-provider fallbacks', () => {
    const plan = buildCommerceRemixEnginePlan(baseInput);
    const playbook = buildCommerceRemixWorkflowPlaybook(baseInput, plan);
    const deliveryMap = buildCommerceCustomerDeliveryMap(baseInput);

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
    expect(deliveryMap.phases.map(phase => phase.id)).toEqual(['brief', 'image', 'remix', 'publish', 'support', 'return']);
    expect(deliveryMap.oneLinePromise).toContain('客户只按步骤补资料');
    expect(deliveryMap.handoffRules.join(' ')).toContain('客户自行完成');
  });

  it('plans platform title matrices for customer self-publishing', () => {
    const matrix = buildCommercePublishingMatrixPlan(baseInput);
    const personas = buildCommerceCreatorPersonaMatrix(baseInput, matrix);

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
  });
});
