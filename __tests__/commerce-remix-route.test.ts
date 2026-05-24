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
    expect(body.openSourceAdapters.map((adapter: { id: string }) => adapter.id)).toContain('ffmpeg');
    expect(body.workflowPlaybook.stages.map((stage: { id: string }) => stage.id)).toContain('publishing-pack');
    expect(body.executionRecipes.map((recipe: { id: string }) => recipe.id)).toContain('recipe-local-render');
    expect(body.publishingMatrix[0].accountAngles.length).toBeGreaterThanOrEqual(3);
    expect(body.creatorPersonaMatrix[0].personas[0].titleFormulas.length).toBeGreaterThanOrEqual(3);
    expect(body.renderCapacity.queuePolicy.join(' ')).toContain('不自动登录');
    expect(body.cloudReturnPlan.intakeFields.map((field: { label: string }) => field.label)).toContain('表现 CSV');
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
    expect(body.performanceReport.bestTitle).toBe('Hook A');
    expect(body.cloudDrive.folders.map((folder: { path: string }) => folder.path).join(' ')).toContain('04-customer-return');
    expect(body.servicePack.objectionReplies.map((item: { objection: string }) => item.objection)).toContain('担心不好用');
    expect(body.modelImageTaskPack.tasks.map((task: { id: string }) => task.id)).toContain('model-handheld-proof');
    expect(body.customerSupportWorkflow.preSaleReplies.map((item: { scenario: string }) => item.scenario)).toContain('客户觉得贵');
    expect(body.customerDeliveryMap.phases.map((phase: { id: string }) => phase.id)).toContain('publish');
    expect(body.providerActivationPlan.lanes.map((lane: { id: string }) => lane.id)).toContain('image-key');
    expect(body.providerActivationPlan.notNeededForFirstDelivery).toContain('平台自动登录');
    expect(body.openSourceAdapters.find((adapter: { id: string }) => adapter.id === 'queue-worker').readiness).toBe('ready_now');
    expect(body.executionRecipes.find((recipe: { adapterId: string }) => recipe.adapterId === 'ffmpeg').passCriteria.join(' ')).toContain('MP4 可播放');
    expect(body.workflowPlaybook.noProviderFallbacks.join(' ')).toContain('没有自动发布');
    expect(body.publishingMatrix[0].accountAngles[0].publishNote).toContain('客户自发');
    expect(body.creatorPersonaMatrix[0].personas[0].doNotClaim).toContain('不承诺平台自动登录或自动发布');
    expect(body.cloudReturnPlan.nextRoundOutputs).toContain('重剪任务清单');
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
