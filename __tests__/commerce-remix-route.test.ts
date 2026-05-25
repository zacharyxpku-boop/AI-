import { describe, expect, it } from 'vitest';
import { GET, POST } from '@/app/api/commerce-remix/route';
import type { CommerceRemixPlanInput } from '@/lib/commerce-remix-engine';

const input: CommerceRemixPlanInput = {
  productName: 'Travel Pet Bowl',
  sellingPoints: ['stable feeding outside', 'folds into a small bag'],
  audience: 'traveling pet owners',
  platforms: ['tiktok', 'xiaohongshu'],
  assets: [
    { id: 'product-main', kind: 'product_image', label: 'main product image', uri: 'assets/product.png', rightsReady: true },
    { id: 'scene-park', kind: 'scene_image', label: 'park scene', uri: 'assets/park.png', rightsReady: true },
    { id: 'model-handheld', kind: 'model_image', label: 'model image', uri: 'assets/model.png', rightsReady: true },
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
      requiredAssetIds: ['product-main', 'model-handheld'],
    },
  ],
};

describe('/api/commerce-remix', () => {
  it('serves a local-first demo plan without requiring external providers', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe('demo');
    expect(body.providerBoundary).toContain('等待 API Key');
    expect(body.exportPackage.artifacts.map((artifact: { kind: string }) => artifact.kind)).toContain('publishing_packs');
    expect(body.templates.map((template: { id: string }) => template.id)).toContain('service-objection-loop');
    expect(body.servicePack.faq.length).toBeGreaterThan(0);
    expect(body.salesConversationBoard.lanes.map((lane: { id: string }) => lane.id)).toContain('repurchase');
    expect(body.salesConversationBoard.noAutomationBoundaries).toContain('不自动登录客户平台账号');
    expect(body.conversationOpsConsole.headline).toContain('chat Cut 式电商对话工单台');
    expect(body.conversationOpsConsole.replyPackets.map((packet: { laneId: string }) => packet.laneId)).toContain('after_sales');
    expect(body.workbenchSystemMap.lanes.map((lane: { id: string }) => lane.id)).toContain('model_image');
    expect(body.workbenchSystemMap.primaryRoute).toContain('客户自己发布');
    expect(body.dailyOperatorCockpit.headline).toContain('电商人每日运营驾驶舱');
    expect(body.dailyOperatorCockpit.todayFocus.map((item: { id: string }) => item.id)).toContain('support');
    expect(body.openSourceAdapters.map((adapter: { id: string }) => adapter.id)).toContain('ffmpeg');
    expect(body.openSourceAdapters.map((adapter: { id: string }) => adapter.id)).toContain('mcp-video');
    expect(body.openSourceAdapters.map((adapter: { id: string }) => adapter.id)).toContain('vanta-video-engine');
    expect(body.openSourceAdapters.map((adapter: { id: string }) => adapter.id)).toContain('moneyprinterturbo');
    expect(body.openSourceRemixBlueprint.headline).toContain('GitHub 开源混剪蓝图');
    expect(body.openSourceRemixBlueprint.githubPatternGroups.map((group: { id: string }) => group.id)).toContain('programmatic-render');
    expect(body.githubRemixRadar.headline).toContain('GitHub 开源混剪能力雷达');
    expect(body.githubRemixRadar.repoFamilies.map((family: { id: string }) => family.id)).toContain('pipeline-system');
    expect(body.openSourceQueueConsole.headline).toContain('开源混剪队列控制台');
    expect(body.openSourceQueueConsole.stages.map((stage: { id: string }) => stage.id)).toContain('stable-render');
    expect(body.openSourceQueueConsole.failurePolicy.join(' ')).toContain('单条失败只重跑单条');
    expect(body.openSourceLastMileBoard.headline).toContain('开源混剪最后一公里判断板');
    expect(body.openSourceLastMileBoard.customerFinalStep.join(' ')).toContain('客户自己登录');
    expect(body.chatCutRemixConsole.headline).toContain('chat Cut 式精简混剪控制台');
    expect(body.chatCutRemixConsole.cutFlow.map((step: { id: string }) => step.id)).toContain('queue');
    expect(body.workflowPlaybook.stages.map((stage: { id: string }) => stage.id)).toContain('publishing-pack');
    expect(body.executionRecipes.map((recipe: { id: string }) => recipe.id)).toContain('recipe-local-render');
    expect(body.orchestrationBoard.routes.map((route: { id: string }) => route.id)).toContain('render-export');
    expect(body.openSourceStackSelector.decisions.map((decision: { id: string }) => decision.id)).toContain('stable-render');
    expect(body.openSourceStackSelector.defaultStack).toContain('lossless-cut');
    expect(body.publishingMatrix[0].accountAngles.length).toBeGreaterThanOrEqual(3);
    expect(body.creatorPersonaMatrix[0].personas[0].titleFormulas.length).toBeGreaterThanOrEqual(3);
    expect(body.personaPublishingConsole.headline).toContain('多账号人设发布矩阵');
    expect(body.personaPublishingConsole.rows[0].customerCopyAction).toContain('客户自己登录');
    expect(body.personaPublishingConsole.evidenceFields).toContain('表现 CSV');
    expect(body.renderCapacity.queuePolicy.join(' ')).toContain('不自动登录');
    expect(body.renderCapacity.monitoringSignals.join(' ')).toContain('failed/blocked');
    expect(body.renderCapacity.storageHandoff.join(' ')).toContain('02-render-outputs');
    expect(body.renderOperationsRunbook.batchSteps.map((step: { id: string }) => step.id)).toContain('single-retry');
    expect(body.renderOperationsRunbook.customerHandoff.join(' ')).toContain('客户自己登录平台发布');
    expect(body.cloudReturnPlan.intakeFields.map((field: { label: string }) => field.label)).toContain('表现 CSV');
    expect(body.customerReturnIntakeBoard.status).toBe('ready_for_review');
    expect(body.customerReturnIntakeBoard.evidenceCards.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(body)).not.toMatch(/apiKey|accessToken|Bearer|sk-/i);
  });

  it('builds a customer-ready remix package, batch plan, performance report, and service pack from POST input', async () => {
    const response = await POST(new Request('http://localhost/api/commerce-remix', {
      method: 'POST',
      body: JSON.stringify({
        input,
        maxConcurrency: 1,
        retryBudget: 2,
        performanceUploads: [
          {
            platform: 'tiktok',
            publishedUrl: 'https://example.test/tiktok/video',
            screenshotPath: '04-customer-return/tiktok.png',
            csvRows: [
              { title: 'Hook A', impressions: 1200, clicks: 88, orders: 4, revenue: 280 },
            ],
          },
        ],
      }),
    }) as unknown as Parameters<typeof POST>[0]);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe('local_first');
    expect(body.providerBoundary).toContain('不自动登录客户账号');
    expect(body.qualityGate.passed).toBe(true);
    expect(body.batchPlan.batches).toHaveLength(2);
    expect(body.renderReliabilityBoard.customerPromise).toContain('失败只重跑单条');
    expect(body.renderReliabilityBoard.lanes.map((lane: { id: string }) => lane.id)).toContain('material-gate');
    expect(body.renderReliabilityBoard.operatorRules.join(' ')).toContain('不自动登录客户平台');
    expect(body.renderOperationsRunbook.preflightChecks.join(' ')).toContain('缺素材');
    expect(body.renderOperationsRunbook.escalationMatrix.map((item: { trigger: string }) => item.trigger).join(' ')).toContain('平台自动发布');
    expect(body.performanceReport.bestTitle).toBe('Hook A');
    expect(body.cloudDrive.folders.map((folder: { path: string }) => folder.path).join(' ')).toContain('04-customer-return');
    expect(body.servicePack.objectionReplies.map((item: { objection: string }) => item.objection)).toContain('担心不好用');
    expect(body.modelImageTaskPack.tasks.map((task: { id: string }) => task.id)).toContain('model-handheld-proof');
    expect(body.customerSupportWorkflow.preSaleReplies.map((item: { scenario: string }) => item.scenario)).toContain('客户觉得贵');
    expect(body.ecommerceGrowthLoopConsole.headline).toContain('电商增长闭环控制台');
    expect(body.ecommerceGrowthLoopConsole.lanes.map((lane: { id: string }) => lane.id)).toContain('support_reply');
    expect(body.ecommerceGrowthLoopConsole.keyWaitingPolicy.join(' ')).toContain('数字人 Key 未到位');
    expect(body.salesConversationBoard.lanes.find((lane: { id: string }) => lane.id === 'after_sales').proofToCollect).toContain('处理结果');
    expect(body.conversationOpsConsole.triageColumns.map((column: { id: string }) => column.id)).toContain('content_loop');
    expect(body.conversationOpsConsole.noAutomationRules).toContain('不自动群发私信、评论、短信或私域消息。');
    expect(body.workbenchSystemMap.lanes.find((lane: { id: string }) => lane.id === 'support').wenaiOutput).toContain('FAQ');
    expect(body.workbenchSystemMap.notInScope.join(' ')).toContain('cookie');
    expect(body.customerNextStepCommandCenter.headline).toContain('客户下一步指挥台');
    expect(body.customerNextStepCommandCenter.commandCards.map((card: { id: string }) => card.id)).toContain('publish');
    expect(body.customerNextStepCommandCenter.providerReadinessCards.map((card: { id: string }) => card.id)).toEqual(['run-now', 'wait-key', 'not-first']);
    expect(body.customerNextStepCommandCenter.visibleBoundaries.join(' ')).toContain('不托管账号密码');
    expect(body.customerDeliveryMap.phases.map((phase: { id: string }) => phase.id)).toContain('publish');
    expect(body.providerActivationPlan.lanes.map((lane: { id: string }) => lane.id)).toContain('image-key');
    expect(body.providerNeedAssessment.verdict).toBe('first_delivery_ready');
    expect(body.providerNeedAssessment.notRequiredNow).toContain('自动代客户操作电脑或浏览器');
    expect(body.providerActivationPlan.notNeededForFirstDelivery).toContain('平台自动登录');
    expect(body.providerActivationRunbook.headline).toContain('Key 到位后的接入运行手册');
    expect(body.providerActivationRunbook.steps.find((step: { laneId: string; writesBackTo: string[] }) => step.laneId === 'image-key').writesBackTo).toContain('素材货架');
    expect(body.providerActivationRunbook.keyHandlingRules.join(' ')).toContain('不在页面、日志或导出包展示 Key 值');
    expect(body.providerEscalationBoard.headline).toContain('外部平台服务升级判断板');
    expect(body.providerEscalationBoard.lanes.map((lane: { id: string }) => lane.id)).toContain('analytics-api');
    expect(body.providerEscalationBoard.buyOnlyAfter.join(' ')).toContain('至少一轮');
    expect(body.firstDeliveryChecklist.promise).toContain('不等图片/视频/数字人 Key');
    expect(body.firstDeliveryChecklist.noWaitItems).toContain('平台自动登录');
    expect(body.customerLaunchReadinessBoard.headline).toContain('客户上线前总验收板');
    expect(body.customerLaunchReadinessBoard.lanes.map((lane: { id: string }) => lane.id)).toContain('self-publish');
    expect(body.customerLaunchReadinessBoard.mustNotPromise.join(' ')).toContain('自动登录');
    expect(body.customerLaunchReadinessBoard.launchOnlyWhen.join(' ')).toContain('回填入口');
    expect(body.openSourceAdapters.find((adapter: { id: string }) => adapter.id === 'queue-worker').readiness).toBe('ready_now');
    expect(body.openSourceCoverage.layers.find((layer: { id: string }) => layer.id === 'clip-ready').primaryAdapterIds).toContain('auto-editor');
    expect(body.openSourceCoverage.customerPromise).toContain('自己发布');
    expect(body.openSourceStackSelector.decisions.find((decision: { id: string }) => decision.id === 'long-material-slicing').defaultAdapterIds).toContain('pyscenedetect');
    expect(body.openSourceStackSelector.doNotUseFor.join(' ')).toContain('cookie');
    expect(body.openSourceInstallMatrix.headline).toContain('开源混剪安装和冒烟验收矩阵');
    expect(body.openSourceInstallMatrix.lanes.find((lane: { id: string }) => lane.id === 'render-queue-smoke').smokeTest).toContain('故意失败一次');
    expect(body.openSourceInstallMatrix.providerBoundary).toContain('不把平台自动登录当作开源混剪能力。');
    expect(body.openSourceRemixBlueprint.githubPatternGroups.find((group: { id: string }) => group.id === 'self-publish-return').whatNotCopy).toContain('自动登录');
    expect(body.openSourceRemixBlueprint.deliveryRules.join(' ')).toContain('不保存账号、密码、cookie');
    expect(body.openSourceRemixBlueprint.scaleDecision.join(' ')).toContain('多 worker');
    expect(body.githubRemixRadar.adoptionQueue.find((queue: { stage: string }) => queue.stage === 'now').reason).toContain('不等图片/视频/数字人 Key');
    expect(body.githubRemixRadar.notProviderDependency.join(' ')).toContain('不纳入首版交付');
    expect(body.openSourceQueueConsole.customerVisibleProof).toContain('upload-ready-checklist.md');
    expect(body.openSourceQueueConsole.scaleUpgradePath.join(' ')).toContain('不接账号密码和 cookie');
    expect(body.openSourceLastMileBoard.lanes.find((lane: { id: string }) => lane.id === 'template-to-mp4').smokeProof).toContain('失败只重跑单条');
    expect(body.openSourceLastMileBoard.notSolvingWithOpenSource.join(' ')).toContain('不托管客户账号');
    expect(body.chatCutRemixConsole.defaultRecipes.map((recipe: { id: string }) => recipe.id)).toContain('support-objection');
    expect(body.chatCutRemixConsole.reliabilityRules.join(' ')).toContain('单条任务');
    expect(body.executionRecipes.find((recipe: { adapterId: string }) => recipe.adapterId === 'ffmpeg').passCriteria.join(' ')).toContain('MP4 可播放');
    expect(body.executionRecipes.find((recipe: { adapterId: string }) => recipe.adapterId === 'mediainfo').passCriteria.join(' ')).toContain('编码');
    expect(body.orchestrationBoard.routes.find((route: { id: string }) => route.id === 'template-compose').primaryAdapterIds).toContain('editly');
    expect(body.orchestrationBoard.notProviderBlockers).toContain('平台自动登录不是首版阻塞项');
    expect(body.workflowPlaybook.noProviderFallbacks.join(' ')).toContain('没有自动发布');
    expect(body.publishingMatrix[0].accountAngles[0].publishNote).toContain('客户自发');
    expect(body.creatorPersonaMatrix[0].personas[0].doNotClaim).toContain('不承诺平台自动登录或自动发布');
    expect(body.creatorPersonaMatrix[0].personas[0].contentPillars).toContain('痛点场景');
    expect(body.creatorPersonaMatrix[0].personas[0].returnMetrics.length).toBeGreaterThanOrEqual(4);
    expect(body.superIpTitleBoard.headline).toContain('超级 IP 标题和口播作战板');
    expect(body.superIpTitleBoard.titleFamilies.map((family: { id: string }) => family.id)).toContain('review-proof');
    expect(body.superIpTitleBoard.operatingRules.join(' ')).toContain('客户自己登录平台发布');
    expect(body.titleQualityGate.headline).toContain('标题和口播发布前验收门');
    expect(body.titleQualityGate.publishOnlyWhen.join(' ')).toContain('回填字段');
    expect(body.selfPublishingCommandCenter.slots[0].copyAction).toContain('客户自己登录');
    expect(body.selfPublishingCommandCenter.noLoginRules).toContain('不绕过平台发布流程。');
    expect(body.selfPublishingCommandCenter.evidenceInbox.map((item: { label: string }) => item.label)).toContain('表现 CSV');
    expect(body.personaPublishingConsole.rows).toHaveLength(6);
    expect(body.personaPublishingConsole.rows.map((row: { accountType: string }) => row.accountType)).toContain('真实买家号');
    expect(body.personaPublishingConsole.rows[0].firstThreeVoiceoverLines.length).toBeGreaterThanOrEqual(3);
    expect(body.personaPublishingConsole.boundaryRules.join(' ')).toContain('不索要客户账号');
    expect(body.cloudReturnPlan.nextRoundOutputs).toContain('重剪任务清单');
    expect(body.customerReturnIntakeBoard.status).toBe('ready_for_review');
    expect(body.customerReturnIntakeBoard.evidenceCards.every((card: { state: string }) => card.state === 'received')).toBe(true);
    expect(body.evidenceReadinessBoard.headline).toContain('客户表现证据验收板');
    expect(body.evidenceReadinessBoard.requiredEvidenceChecks.every((check: { state: string }) => check.state === 'ready')).toBe(true);
    expect(body.evidenceReadinessBoard.uploadRoutes).toContain('把文件放到 04-customer-return 云盘目录');
    expect(body.customerEvidenceUploadGuide.headline).toContain('客户证据上传指南');
    expect(body.customerEvidenceUploadGuide.uploadSteps.map((step: { title: string }) => step.title)).toContain('客户自己发布');
    expect(body.customerEvidenceUploadGuide.doNotAskCustomerFor).toContain('不托管客户账号。');
    expect(body.ecommerceGrowthLoopConsole.customerSeesOnly).toContain('下一轮应该改图、改视频、改标题还是改客服');
    expect(body.postPublishActionBoard.status).toBe('ready_for_next_round');
    expect(body.postPublishActionBoard.actionLanes.map((lane: { id: string }) => lane.id)).toContain('support');
    expect(body.postPublishActionBoard.doNotAutomate).toContain('不自动读取平台后台。');
  });

  it('rejects incomplete remix requests with stable Chinese guidance', async () => {
    const response = await POST(new Request('http://localhost/api/commerce-remix', {
      method: 'POST',
      body: JSON.stringify({ input: { productName: 'missing fields' } }),
    }) as unknown as Parameters<typeof POST>[0]);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('commerce_remix_input_required');
    expect(body.message).toContain('商品名称');
  });
});
