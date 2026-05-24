import { describe, expect, it } from 'vitest';

import {
  buildCommerceRemixEnginePlan,
  buildCommerceTimeline,
  buildDemoCommerceRemixEnginePlan,
  buildFfmpegCommandManifest,
  buildCommerceRemixExportPackage,
  buildPlatformPublishingPacks,
  buildRemixRenderQueue,
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

    expect(plan.engineStack.map(item => item.id)).toEqual(['timeline-json', 'remotion-template', 'ffmpeg-render', 'queue-runner', 'handoff-package']);
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
    expect(pack.cloudDriveHandoff).toContain('表现 CSV');
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
});
