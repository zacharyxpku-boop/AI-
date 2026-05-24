export type RemixPlatform = 'xiaohongshu' | 'tiktok' | 'shopify' | 'meta' | 'wechat_video';
export type RemixAssetKind = 'product_image' | 'model_image' | 'scene_image' | 'video_clip' | 'voiceover' | 'bgm' | 'caption';
export type RemixQueueStatus = 'needs_material' | 'ready' | 'rendering' | 'exported' | 'failed_retryable' | 'blocked';

export interface CommerceRemixAsset {
  id: string;
  kind: RemixAssetKind;
  label: string;
  uri?: string;
  missing?: boolean;
  rightsReady?: boolean;
}

export interface CommerceRemixSceneInput {
  id: string;
  hook: string;
  visual: string;
  subtitle: string;
  voiceover: string;
  durationSeconds: number;
  requiredAssetIds: string[];
}

export interface CommerceRemixPlanInput {
  productName: string;
  sellingPoints: string[];
  audience: string;
  platforms: RemixPlatform[];
  assets: CommerceRemixAsset[];
  scenes: CommerceRemixSceneInput[];
  renderSizes?: Array<'9:16' | '1:1' | '16:9'>;
  language?: 'zh' | 'en' | 'mixed';
}

export interface CommerceTimelineClip {
  id: string;
  track: 'visual' | 'subtitle' | 'voiceover' | 'bgm' | 'overlay';
  startSecond: number;
  endSecond: number;
  assetIds: string[];
  text?: string;
  template: string;
}

export interface CommerceRemixTimeline {
  id: string;
  durationSeconds: number;
  clips: CommerceTimelineClip[];
}

export interface CommerceFfmpegCommand {
  id: string;
  purpose: string;
  args: string[];
  output: string;
  retryable: boolean;
}

export interface PlatformPublishingPack {
  platform: RemixPlatform;
  titles: string[];
  accountVariants: Array<{ accountType: string; title: string; angle: string; firstLine: string }>;
  caption: string;
  tags: string[];
  cta: string;
  publishChecklist: string[];
}

export interface CommerceRemixQueueItem {
  id: string;
  platform: RemixPlatform;
  renderSize: '9:16' | '1:1' | '16:9';
  status: RemixQueueStatus;
  attempt: number;
  missingAssetIds: string[];
  ffmpegCommandId: string;
  outputPath: string;
  nextAction: string;
}

export interface CommerceRemixEnginePlan {
  engineStack: Array<{ id: string; role: string; openSourceReference: string; reason: string }>;
  timeline: CommerceRemixTimeline;
  missingAssets: CommerceRemixAsset[];
  ffmpegCommands: CommerceFfmpegCommand[];
  queue: CommerceRemixQueueItem[];
  publishingPacks: PlatformPublishingPack[];
  handoffMarkdown: string;
}

export interface CommerceRemixPackageArtifact {
  path: string;
  kind: 'timeline' | 'ffmpeg_commands' | 'concat_manifest' | 'subtitles' | 'voiceover_script' | 'publishing_packs' | 'handoff' | 'customer_upload';
  description: string;
  content: string;
}

export interface CommerceRemixExportPackage {
  packageId: string;
  rootDir: string;
  artifacts: CommerceRemixPackageArtifact[];
  customerPublishingBoundary: string;
  cloudDriveHandoff: string[];
  noSecretScanPassed: boolean;
}

export interface CommerceRemixDryRunTrace {
  queueItemId: string;
  platform: RemixPlatform;
  trace: string[];
  finalStatus: RemixQueueStatus;
  outputPath?: string;
}

export interface CommerceRemixDryRunResult {
  exportedCount: number;
  blockedCount: number;
  needsMaterialCount: number;
  outputPaths: string[];
  traces: CommerceRemixDryRunTrace[];
  queue: CommerceRemixQueueItem[];
}

export interface CommercePerformanceUpload {
  platform: RemixPlatform;
  publishedUrl?: string;
  screenshotPath?: string;
  csvRows?: Array<{
    title: string;
    impressions: number;
    clicks: number;
    orders: number;
    revenue: number;
  }>;
}

export interface CommercePerformanceUploadReport {
  uploadChannels: string[];
  rowCount: number;
  totalImpressions: number;
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  bestTitle?: string;
  nextRoundAdvice: string[];
  missingEvidence: string[];
}

export interface CommerceCloudDriveManifest {
  rootDir: string;
  folders: Array<{ path: string; owner: string; requiredFiles: string[] }>;
  customerChecklist: string[];
  nextConfigurableProviders: string[];
}

export interface CommerceRenderBatchPlan {
  batches: Array<{
    id: string;
    queueItemIds: string[];
    concurrency: number;
    retryBudget: number;
    outputs: string[];
  }>;
  totalItems: number;
  maxConcurrency: number;
  retryPolicy: string;
  stabilityRules: string[];
}

export interface CommerceRenderBatchExecution {
  exportedCount: number;
  retryableCount: number;
  blockedCount: number;
  traces: string[];
  queue: CommerceRemixQueueItem[];
}

const PLATFORM_LABELS: Record<RemixPlatform, string> = {
  xiaohongshu: '小红书',
  tiktok: 'TikTok',
  shopify: 'Shopify',
  meta: 'Meta',
  wechat_video: '视频号',
};

const PLATFORM_DEFAULT_SIZE: Record<RemixPlatform, '9:16' | '1:1' | '16:9'> = {
  xiaohongshu: '9:16',
  tiktok: '9:16',
  shopify: '16:9',
  meta: '1:1',
  wechat_video: '9:16',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'remix';
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function seconds(value: number) {
  return Math.max(1, Math.round(value));
}

function safeText(value: string, fallback: string) {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
}

export function getCommerceRemixEngineStack(): CommerceRemixEnginePlan['engineStack'] {
  return [
    {
      id: 'timeline-json',
      role: '时间线与轨道模型',
      openSourceReference: 'Open-source timeline/video editor schemas',
      reason: '吸收多轨道、clip、字幕、转场和模板参数模型，输出稳定 timeline.json，不绑定单一 UI 大仓库。',
    },
    {
      id: 'remotion-template',
      role: '模板化渲染层',
      openSourceReference: 'Remotion',
      reason: '用 React 组件思路管理商品卡、价格锚点、字幕、模特展示和结尾 CTA 模板。',
    },
    {
      id: 'ffmpeg-render',
      role: '最终合成层',
      openSourceReference: 'FFmpeg / ffmpeg.wasm',
      reason: '负责转码、裁切、拼接、字幕烧录、音频混合、多尺寸输出和可重试命令清单。',
    },
    {
      id: 'queue-runner',
      role: '稳定队列层',
      openSourceReference: 'BullMQ-style job queue pattern',
      reason: '每个 renderSize/platform 是独立任务，失败只重跑单条，不阻塞整批交付。',
    },
    {
      id: 'render-batch-planner',
      role: '大规模批处理层',
      openSourceReference: 'Open-source render farm / worker queue patterns',
      reason: '把几十到几百条短视频拆成可控批次，限制并发、记录输出、隔离失败，避免一次渲染拖垮整批。',
    },
    {
      id: 'handoff-package',
      role: '客户自发布交付包',
      openSourceReference: 'Open-source static export / manifest packaging pattern',
      reason: '把时间线、命令、字幕、配音稿、平台标题和回填表拆成可审计文件，客户不用理解后端实现也能交付。',
    },
    {
      id: 'performance-return',
      role: '客户回填复盘层',
      openSourceReference: 'Open-source CSV import / cloud-drive handoff pattern',
      reason: '自动抓平台数据先不作为前置条件；客户上传链接、截图、CSV 或云盘目录后，也能形成下一轮标题和素材建议。',
    },
  ];
}

export function buildCommerceTimeline(input: CommerceRemixPlanInput): CommerceRemixTimeline {
  let cursor = 0;
  const clips: CommerceTimelineClip[] = [];
  input.scenes.forEach((scene, index) => {
    const duration = seconds(scene.durationSeconds);
    const startSecond = cursor;
    const endSecond = cursor + duration;
    cursor = endSecond;
    const sceneAssetIds = unique(scene.requiredAssetIds.filter(Boolean));

    clips.push({
      id: `${scene.id}-visual`,
      track: 'visual',
      startSecond,
      endSecond,
      assetIds: sceneAssetIds,
      text: scene.visual,
      template: index === 0 ? 'hook-proof-visual' : 'product-proof-cut',
    });
    clips.push({
      id: `${scene.id}-subtitle`,
      track: 'subtitle',
      startSecond,
      endSecond,
      assetIds: [],
      text: scene.subtitle,
      template: 'burned-caption-safe-area',
    });
    clips.push({
      id: `${scene.id}-voiceover`,
      track: 'voiceover',
      startSecond,
      endSecond,
      assetIds: input.assets.filter(asset => asset.kind === 'voiceover' && !asset.missing).map(asset => asset.id).slice(0, 1),
      text: scene.voiceover,
      template: 'voiceover-line',
    });
  });

  return {
    id: `timeline-${slugify(input.productName)}`,
    durationSeconds: cursor,
    clips,
  };
}

export function findMissingRemixAssets(input: CommerceRemixPlanInput) {
  const assetById = new Map(input.assets.map(asset => [asset.id, asset]));
  const required = unique(input.scenes.flatMap(scene => scene.requiredAssetIds));
  return required
    .map(assetId => assetById.get(assetId) || {
      id: assetId,
      kind: 'product_image' as const,
      label: assetId,
      missing: true,
      rightsReady: false,
    })
    .filter(asset => asset.missing || asset.rightsReady === false || !asset.uri);
}

export function buildFfmpegCommandManifest(input: CommerceRemixPlanInput, timeline = buildCommerceTimeline(input)): CommerceFfmpegCommand[] {
  const sizes = unique(input.renderSizes?.length ? input.renderSizes : input.platforms.map(platform => PLATFORM_DEFAULT_SIZE[platform]));
  return sizes.map(size => {
    const [width, height] = size === '9:16' ? [1080, 1920] : size === '1:1' ? [1080, 1080] : [1920, 1080];
    const output = `exports/${slugify(input.productName)}-${size.replace(':', 'x')}.mp4`;
    return {
      id: `ffmpeg-${timeline.id}-${size.replace(':', 'x')}`,
      purpose: `${size} MP4 render with burned subtitles and normalized audio`,
      args: [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', `manifests/${timeline.id}-concat.txt`,
        '-i', `manifests/${timeline.id}-voiceover.wav`,
        '-filter_complex',
        `[0:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1[v];[1:a]loudnorm=I=-16:TP=-1.5:LRA=11[a]`,
        '-map', '[v]',
        '-map', '[a]',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '20',
        '-c:a', 'aac',
        '-b:a', '160k',
        '-movflags', '+faststart',
        output,
      ],
      output,
      retryable: true,
    };
  });
}

export function buildPlatformPublishingPacks(input: CommerceRemixPlanInput): PlatformPublishingPack[] {
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const audience = safeText(input.audience, '目标用户');
  return input.platforms.map(platform => {
    const label = PLATFORM_LABELS[platform];
    const titles = platform === 'xiaohongshu'
      ? [`${audience}真实会用到的${input.productName}`, `${input.productName}解决${point}，我会这样拍`, `不是测评，是${audience}的使用场景`]
      : platform === 'tiktok'
        ? [`Stop scrolling: ${input.productName} fixes ${point}`, `I tested ${input.productName} for ${audience}`, `3 seconds to see why this product matters`]
        : platform === 'shopify'
          ? [`${input.productName} for ${audience}`, `${point} in one simple setup`, `See how ${input.productName} fits your routine`]
          : platform === 'meta'
            ? [`Make ${point} easier`, `${input.productName}: built for ${audience}`, `A clearer way to handle ${point}`]
            : [`${input.productName}怎么讲才清楚`, `${audience}先看这个场景`, `${point}，用一条视频说透`];
    return {
      platform,
      titles,
      accountVariants: buildAccountMatrixPublishingVariants(platform, input.productName, point, audience),
      caption: `${label}发布包：先讲${audience}的具体场景，再展示${point}，最后给出低承诺 CTA。`,
      tags: unique([input.productName, audience, point, label]).slice(0, 6),
      cta: platform === 'shopify' ? 'View product details' : platform === 'tiktok' ? 'Check the product page' : '保存这条，发布后回填链接',
      publishChecklist: [
        '复制对应平台标题和正文',
        '上传导出的 MP4 与封面',
        '发布后回填链接、截图或 CSV',
      ],
    };
  });
}

export function buildAccountMatrixPublishingVariants(platform: RemixPlatform, productName: string, point: string, audience: string): PlatformPublishingPack['accountVariants'] {
  const platformPrefix = PLATFORM_LABELS[platform];
  const matrix = [
    {
      accountType: '真实买家号',
      title: platform === 'tiktok' ? `I used ${productName} for one week` : `${productName}真实使用一周后的感受`,
      angle: `从${audience}的日常问题切入，不做硬广。`,
      firstLine: `先说结论：${point}这件事，确实更省心。`,
    },
    {
      accountType: '测评种草号',
      title: platform === 'shopify' ? `${productName}: use case, specs, FAQ` : `${platformPrefix}测评：${productName}值不值得试`,
      angle: '按问题、证据、限制、适合人群组织，降低夸张感。',
      firstLine: `这条只回答一个问题：它能不能解决${point}。`,
    },
    {
      accountType: '店铺官方号',
      title: platform === 'meta' ? `A clearer way to handle ${point}` : `${productName}适合哪些人？`,
      angle: '突出商品场景、售后承诺和购买路径，适合店铺主页承接。',
      firstLine: `如果你是${audience}，先看这个使用场景。`,
    },
  ];
  return matrix;
}

export function buildRemixRenderQueue(
  input: CommerceRemixPlanInput,
  commands = buildFfmpegCommandManifest(input),
  missingAssets = findMissingRemixAssets(input),
): CommerceRemixQueueItem[] {
  return input.platforms.map(platform => {
    const renderSize = PLATFORM_DEFAULT_SIZE[platform];
    const command = commands.find(item => item.id.endsWith(renderSize.replace(':', 'x'))) || commands[0];
    const missingAssetIds = missingAssets.map(asset => asset.id);
    return {
      id: `queue-${slugify(input.productName)}-${platform}`,
      platform,
      renderSize,
      status: missingAssetIds.length > 0 ? 'needs_material' : 'ready',
      attempt: 0,
      missingAssetIds,
      ffmpegCommandId: command?.id || 'missing-command',
      outputPath: command?.output || `exports/${slugify(input.productName)}-${platform}.mp4`,
      nextAction: missingAssetIds.length > 0
        ? `补齐 ${missingAssetIds.length} 个素材或授权后再渲染`
        : '进入本地 FFmpeg/模板渲染队列',
    };
  });
}

export function transitionRemixQueueItem(item: CommerceRemixQueueItem, event: 'start' | 'export' | 'fail' | 'block' | 'material_ready'): CommerceRemixQueueItem {
  if (event === 'material_ready' && item.status === 'needs_material') return { ...item, status: 'ready', missingAssetIds: [], nextAction: '进入本地 FFmpeg/模板渲染队列' };
  if (event === 'start' && item.status === 'ready') return { ...item, status: 'rendering', nextAction: '等待渲染结果' };
  if (event === 'export' && item.status === 'rendering') return { ...item, status: 'exported', nextAction: '交给客户发布并回填链接/截图/CSV' };
  if (event === 'fail' && item.status === 'rendering') {
    const attempt = item.attempt + 1;
    return {
      ...item,
      attempt,
      status: attempt >= 3 ? 'blocked' : 'failed_retryable',
      nextAction: attempt >= 3 ? '连续失败，检查素材编码、字幕或音频文件' : '只重跑这一条渲染任务',
    };
  }
  if (event === 'block') return { ...item, status: 'blocked', nextAction: '人工检查素材、授权或渲染参数' };
  return item;
}

function buildHandoffMarkdown(plan: Omit<CommerceRemixEnginePlan, 'handoffMarkdown'>) {
  return [
    '# Wenai 本地混剪任务包',
    '',
    `- 时间线：${plan.timeline.id}`,
    `- 时长：${plan.timeline.durationSeconds}s`,
    `- 缺口：${plan.missingAssets.length ? plan.missingAssets.map(asset => asset.label).join(' / ') : '无'}`,
    `- 渲染任务：${plan.queue.length}`,
    '',
    '## 开源能力组合',
    ...plan.engineStack.map(item => `- ${item.role}: ${item.openSourceReference}。${item.reason}`),
    '',
    '## 队列',
    ...plan.queue.map(item => `- ${PLATFORM_LABELS[item.platform]} / ${item.renderSize} / ${item.status} / ${item.nextAction}`),
    '',
    '## 发布包',
    ...plan.publishingPacks.map(pack => `- ${PLATFORM_LABELS[pack.platform]}: ${pack.titles[0]}`),
    '',
    '## 客户发布边界',
    '- Wenai 生成标题、正文、标签、素材清单、回填字段和渲染任务包。',
    '- 客户自己登录平台发布；发布后回填链接、截图、CSV 或云盘记录。',
    '- 未经客户授权，不代管账号、不自动登录、不绕过平台发布流程。',
  ].join('\n');
}

export function buildCommerceRemixEnginePlan(input: CommerceRemixPlanInput): CommerceRemixEnginePlan {
  const timeline = buildCommerceTimeline(input);
  const missingAssets = findMissingRemixAssets(input);
  const ffmpegCommands = buildFfmpegCommandManifest(input, timeline);
  const queue = buildRemixRenderQueue(input, ffmpegCommands, missingAssets);
  const publishingPacks = buildPlatformPublishingPacks(input);
  const base = {
    engineStack: getCommerceRemixEngineStack(),
    timeline,
    missingAssets,
    ffmpegCommands,
    queue,
    publishingPacks,
  };
  return {
    ...base,
    handoffMarkdown: buildHandoffMarkdown(base),
  };
}

function buildConcatManifest(input: CommerceRemixPlanInput, timeline: CommerceRemixTimeline) {
  const assetById = new Map(input.assets.map(asset => [asset.id, asset]));
  return timeline.clips
    .filter(clip => clip.track === 'visual')
    .map(clip => {
      const asset = clip.assetIds.map(assetId => assetById.get(assetId)).find(item => item?.uri);
      const file = asset?.uri || `missing/${clip.id}.mp4`;
      return [`file '${file}'`, `duration ${Math.max(1, clip.endSecond - clip.startSecond)}`].join('\n');
    })
    .join('\n');
}

function buildSubtitleSrt(timeline: CommerceRemixTimeline) {
  return timeline.clips
    .filter(clip => clip.track === 'subtitle' && clip.text)
    .map((clip, index) => [
      String(index + 1),
      `${formatSrtTime(clip.startSecond)} --> ${formatSrtTime(clip.endSecond)}`,
      clip.text,
    ].join('\n'))
    .join('\n\n');
}

function formatSrtTime(second: number) {
  const whole = Math.max(0, Math.floor(second));
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secondsPart = whole % 60;
  return [hours, minutes, secondsPart].map(item => String(item).padStart(2, '0')).join(':') + ',000';
}

function buildVoiceoverScript(timeline: CommerceRemixTimeline) {
  return timeline.clips
    .filter(clip => clip.track === 'voiceover' && clip.text)
    .map(clip => `[${clip.startSecond}s-${clip.endSecond}s] ${clip.text}`)
    .join('\n');
}

function stringifyArtifact(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function hasNoSecretLeak(content: string) {
  return !/(api[_-]?key|access[_-]?token|bearer\s+|sk-[a-z0-9]|secret)/i.test(content);
}

export function buildCommerceRemixExportPackage(input: CommerceRemixPlanInput, plan = buildCommerceRemixEnginePlan(input)): CommerceRemixExportPackage {
  const packageId = `commerce-remix-${slugify(input.productName)}`;
  const rootDir = `exports/${packageId}`;
  const cloudDriveManifest = buildCommerceCloudDriveManifest(input, rootDir);
  const artifacts: CommerceRemixPackageArtifact[] = [
    {
      path: `${rootDir}/timeline.json`,
      kind: 'timeline',
      description: '多轨道剪辑时间线，供 Remotion 模板或本地执行器读取。',
      content: stringifyArtifact(plan.timeline),
    },
    {
      path: `${rootDir}/ffmpeg-commands.json`,
      kind: 'ffmpeg_commands',
      description: 'FFmpeg 参数数组清单，不拼 shell 字符串，便于安全重试。',
      content: stringifyArtifact(plan.ffmpegCommands),
    },
    {
      path: `${rootDir}/concat-manifest.txt`,
      kind: 'concat_manifest',
      description: '本地视频片段拼接清单，缺素材时保留明确占位。',
      content: buildConcatManifest(input, plan.timeline),
    },
    {
      path: `${rootDir}/subtitles.srt`,
      kind: 'subtitles',
      description: '可烧录或上传平台的字幕文件。',
      content: buildSubtitleSrt(plan.timeline),
    },
    {
      path: `${rootDir}/voiceover-script.txt`,
      kind: 'voiceover_script',
      description: '配音、数字人口播或人工录音可直接读取的口播稿。',
      content: buildVoiceoverScript(plan.timeline),
    },
    {
      path: `${rootDir}/publishing-packs.json`,
      kind: 'publishing_packs',
      description: '各平台标题、正文、账号矩阵角度、标签和发布检查清单。',
      content: stringifyArtifact(plan.publishingPacks),
    },
    {
      path: `${rootDir}/handoff.md`,
      kind: 'handoff',
      description: '给客户和运营看的交付说明。',
      content: plan.handoffMarkdown,
    },
    {
      path: `${rootDir}/customer-upload-checklist.md`,
      kind: 'customer_upload',
      description: '客户发布后回填链接、截图、CSV 或云盘目录的说明。',
      content: cloudDriveManifest.customerChecklist.map(item => `- ${item}`).join('\n'),
    },
  ];
  const serialized = artifacts.map(artifact => artifact.content).join('\n');
  return {
    packageId,
    rootDir,
    artifacts,
    customerPublishingBoundary: '客户自己登录平台发布；Wenai 只交付发布包、素材包、回填清单和复盘建议。',
    cloudDriveHandoff: cloudDriveManifest.folders.map(folder => folder.path),
    noSecretScanPassed: hasNoSecretLeak(serialized),
  };
}

export function buildCommerceCloudDriveManifest(input: CommerceRemixPlanInput, rootDir = `exports/commerce-remix-${slugify(input.productName)}`): CommerceCloudDriveManifest {
  return {
    rootDir,
    folders: [
      { path: `${rootDir}/01-source-assets`, owner: '客户', requiredFiles: ['商品原图', '视频片段', '授权说明'] },
      { path: `${rootDir}/02-render-outputs`, owner: 'Wenai', requiredFiles: ['MP4 成片', '封面图', '字幕文件'] },
      { path: `${rootDir}/03-publishing-packs`, owner: 'Wenai', requiredFiles: ['平台标题正文', '账号矩阵角度', '发布检查清单'] },
      { path: `${rootDir}/04-customer-return`, owner: '客户', requiredFiles: ['发布链接', '发布截图', '表现 CSV'] },
      { path: `${rootDir}/05-next-round`, owner: 'Wenai', requiredFiles: ['复盘建议', '重剪任务', '下一轮素材缺口'] },
    ],
    customerChecklist: [
      '发布平台链接',
      '发布截图或后台表现截图',
      '表现 CSV：曝光、点击、互动、订单、收入',
      '云盘目录：原始素材、最终视频、封面、字幕、发布记录',
      '客户备注：哪些内容想继续放大，哪些内容不符合品牌',
    ],
    nextConfigurableProviders: ['企业云盘同步', '对象存储签名链接', '平台 analytics API', '客户协作空间权限'],
  };
}

export function evaluateCommercePerformanceUploads(uploads: CommercePerformanceUpload[]): CommercePerformanceUploadReport {
  const rows = uploads.flatMap(upload => upload.csvRows || []);
  const uploadChannels = unique(uploads.map(upload => PLATFORM_LABELS[upload.platform]));
  const totalImpressions = rows.reduce((sum, row) => sum + Math.max(0, row.impressions), 0);
  const totalClicks = rows.reduce((sum, row) => sum + Math.max(0, row.clicks), 0);
  const totalOrders = rows.reduce((sum, row) => sum + Math.max(0, row.orders), 0);
  const totalRevenue = rows.reduce((sum, row) => sum + Math.max(0, row.revenue), 0);
  const best = rows
    .map(row => ({ row, score: row.orders * 1000 + row.clicks * 3 + row.impressions / 100 }))
    .sort((a, b) => b.score - a.score)[0]?.row;
  const missingEvidence = [
    uploads.some(upload => upload.publishedUrl) ? '' : '缺发布链接',
    uploads.some(upload => upload.screenshotPath) ? '' : '缺发布截图',
    rows.length > 0 ? '' : '缺表现 CSV',
  ].filter(Boolean);
  const nextRoundAdvice = [
    best ? `优先保留「${best.title}」的开场结构，下一轮换商品图和封面继续测。` : '先让客户上传至少一份表现 CSV，再判断放大、重剪或暂停。',
    totalOrders > 0 ? '已有订单信号，可以生成第二轮相似标题和素材变体。' : '订单信号不足，下一轮先重做前三秒钩子和封面。',
    missingEvidence.length === 0 ? '链接、截图、CSV 已齐，可以进入复盘建议。' : `先补齐：${missingEvidence.join(' / ')}。`,
  ];
  return {
    uploadChannels,
    rowCount: rows.length,
    totalImpressions,
    totalClicks,
    totalOrders,
    totalRevenue,
    bestTitle: best?.title,
    nextRoundAdvice,
    missingEvidence,
  };
}

export function buildCommerceRenderBatchPlan(queue: CommerceRemixQueueItem[], options: { maxConcurrency?: number; retryBudget?: number } = {}): CommerceRenderBatchPlan {
  const maxConcurrency = Math.max(1, Math.min(options.maxConcurrency || 4, 8));
  const retryBudget = Math.max(1, Math.min(options.retryBudget || 2, 3));
  const runnable = queue.filter(item => item.status === 'ready' || item.status === 'failed_retryable');
  const batches: CommerceRenderBatchPlan['batches'] = [];
  for (let index = 0; index < runnable.length; index += maxConcurrency) {
    const items = runnable.slice(index, index + maxConcurrency);
    batches.push({
      id: `render-batch-${String(batches.length + 1).padStart(2, '0')}`,
      queueItemIds: items.map(item => item.id),
      concurrency: Math.min(maxConcurrency, items.length),
      retryBudget,
      outputs: items.map(item => item.outputPath),
    });
  }
  return {
    batches,
    totalItems: runnable.length,
    maxConcurrency,
    retryPolicy: `单任务最多重试 ${retryBudget} 次；超过后标记 blocked，不影响其他视频导出。`,
    stabilityRules: [
      '缺素材的任务不进入渲染批次',
      '每个平台和尺寸独立输出，失败只隔离单条',
      'FFmpeg 参数以数组保存，执行层不拼接 shell 字符串',
      '导出后由客户自行发布并上传链接、截图或 CSV',
    ],
  };
}

export function executeCommerceRenderBatches(queue: CommerceRemixQueueItem[], plan = buildCommerceRenderBatchPlan(queue), options: { failQueueItemIds?: string[] } = {}): CommerceRenderBatchExecution {
  const failIds = new Set(options.failQueueItemIds || []);
  const byId = new Map(queue.map(item => [item.id, item]));
  const traces: string[] = [];
  const nextQueue = queue.map(item => ({ ...item }));
  const nextById = new Map(nextQueue.map(item => [item.id, item]));

  plan.batches.forEach(batch => {
    traces.push(`${batch.id}:start:${batch.queueItemIds.length}`);
    batch.queueItemIds.forEach(id => {
      const original = byId.get(id);
      const current = nextById.get(id);
      if (!original || !current) return;
      if (original.missingAssetIds.length > 0) {
        traces.push(`${id}:skip_missing_material`);
        return;
      }
      const rendering = transitionRemixQueueItem({ ...current, status: 'ready' }, 'start');
      const finished = failIds.has(id)
        ? transitionRemixQueueItem(rendering, 'fail')
        : transitionRemixQueueItem(rendering, 'export');
      Object.assign(current, finished);
      traces.push(`${id}:${finished.status}:${finished.outputPath}`);
    });
    traces.push(`${batch.id}:done`);
  });

  return {
    exportedCount: nextQueue.filter(item => item.status === 'exported').length,
    retryableCount: nextQueue.filter(item => item.status === 'failed_retryable').length,
    blockedCount: nextQueue.filter(item => item.status === 'blocked').length,
    traces,
    queue: nextQueue,
  };
}

export function executeCommerceRemixDryRun(plan: CommerceRemixEnginePlan, options: { failQueueItemIds?: string[] } = {}): CommerceRemixDryRunResult {
  const failIds = new Set(options.failQueueItemIds || []);
  const queue: CommerceRemixQueueItem[] = [];
  const traces: CommerceRemixDryRunTrace[] = [];

  plan.queue.forEach(item => {
    const trace = [`queue:${item.id}:received`];
    let current = item;
    if (current.missingAssetIds.length > 0 || current.status === 'needs_material') {
      trace.push(`material_gap:${current.missingAssetIds.join(',') || 'unknown'}`);
      queue.push(current);
      traces.push({ queueItemId: current.id, platform: current.platform, trace, finalStatus: current.status });
      return;
    }

    current = transitionRemixQueueItem({ ...current, status: 'ready' }, 'start');
    trace.push(`render:start:${current.ffmpegCommandId}`);

    if (failIds.has(item.id)) {
      current = transitionRemixQueueItem(current, 'fail');
      trace.push(`render:retryable_failure:${current.attempt}`);
    } else {
      current = transitionRemixQueueItem(current, 'export');
      trace.push(`render:exported:${current.outputPath}`);
    }

    queue.push(current);
    traces.push({
      queueItemId: current.id,
      platform: current.platform,
      trace,
      finalStatus: current.status,
      outputPath: current.status === 'exported' ? current.outputPath : undefined,
    });
  });

  return {
    exportedCount: queue.filter(item => item.status === 'exported').length,
    blockedCount: queue.filter(item => item.status === 'blocked' || item.status === 'failed_retryable').length,
    needsMaterialCount: queue.filter(item => item.status === 'needs_material').length,
    outputPaths: queue.filter(item => item.status === 'exported').map(item => item.outputPath),
    traces,
    queue,
  };
}

export function buildDemoCommerceRemixEnginePlan() {
  return buildCommerceRemixEnginePlan(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceRemixExportPackage() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceRemixExportPackage(input, buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommerceRemixDryRun() {
  const demoInput = buildDemoCommerceRemixInput();
  const input = {
    ...demoInput,
    assets: demoInput.assets.map(asset => asset.id === 'model-handheld'
      ? { ...asset, missing: false, uri: 'assets/model-handheld.png', rightsReady: true }
      : asset),
  };
  return executeCommerceRemixDryRun(buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommerceCloudDriveManifest() {
  return buildCommerceCloudDriveManifest(buildDemoCommerceRemixInput());
}

export function buildDemoCommercePerformanceUploadReport() {
  return evaluateCommercePerformanceUploads([
    {
      platform: 'xiaohongshu',
      publishedUrl: 'https://example.test/xhs/post',
      screenshotPath: '04-customer-return/xhs-screenshot.png',
      csvRows: [
        { title: '外出喂食，先解决稳定和收纳', impressions: 18000, clicks: 920, orders: 28, revenue: 3360 },
        { title: '旅行养宠人群真实会用到的便携宠物慢食碗', impressions: 12200, clicks: 610, orders: 13, revenue: 1560 },
      ],
    },
    {
      platform: 'tiktok',
      publishedUrl: 'https://example.test/tiktok/video',
      screenshotPath: '04-customer-return/tiktok-screenshot.png',
      csvRows: [
        { title: 'Stop scrolling: Travel pet bowl fixes outdoor feeding', impressions: 26400, clicks: 1180, orders: 34, revenue: 4080 },
      ],
    },
  ]);
}

export function buildDemoCommerceRenderBatchPlan() {
  const demoInput = buildDemoCommerceRemixInput();
  const readyInput = {
    ...demoInput,
    assets: demoInput.assets.map(asset => asset.id === 'model-handheld'
      ? { ...asset, missing: false, uri: 'assets/model-handheld.png', rightsReady: true }
      : asset),
  };
  const plan = buildCommerceRemixEnginePlan(readyInput);
  return buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 3, retryBudget: 2 });
}

function buildDemoCommerceRemixInput(): CommerceRemixPlanInput {
  return {
    productName: '便携宠物慢食碗',
    sellingPoints: ['外出喂食更稳定', '可折叠收纳', '适合旅行养宠人群'],
    audience: '旅行养宠人群',
    platforms: ['xiaohongshu', 'tiktok', 'shopify', 'meta', 'wechat_video'],
    renderSizes: ['9:16', '1:1', '16:9'],
    assets: [
      { id: 'product-main', kind: 'product_image', label: '商品主图', uri: 'assets/product-main.png', rightsReady: true },
      { id: 'model-handheld', kind: 'model_image', label: '手持模特图', missing: true, rightsReady: false },
      { id: 'scene-travel', kind: 'scene_image', label: '旅行场景图', uri: 'assets/scene-travel.png', rightsReady: true },
      { id: 'voiceover-zh', kind: 'voiceover', label: '中文口播', uri: 'assets/voiceover.wav', rightsReady: true },
    ],
    scenes: [
      {
        id: 'hook',
        hook: '外出喂食容易洒？',
        visual: '旅行场景里宠物碗展开，先给出稳定使用画面。',
        subtitle: '外出喂食，先解决稳定和收纳',
        voiceover: '带宠物出门时，喂食最怕洒、占空间、清理麻烦。',
        durationSeconds: 4,
        requiredAssetIds: ['product-main', 'scene-travel'],
      },
      {
        id: 'proof',
        hook: '折叠和防滑证明',
        visual: '展示折叠、放包、放地面、宠物使用四个动作。',
        subtitle: '折叠收纳，落地不晃',
        voiceover: '这只慢食碗可以折叠放进包里，落地后保持稳定。',
        durationSeconds: 7,
        requiredAssetIds: ['product-main', 'model-handheld'],
      },
      {
        id: 'cta',
        hook: '发布 CTA',
        visual: '商品和收纳状态并排，给出平台 CTA。',
        subtitle: '适合旅行养宠人群的日常装备',
        voiceover: '如果你经常带宠物出门，可以把它放进你的旅行清单。',
        durationSeconds: 5,
        requiredAssetIds: ['product-main'],
      },
    ],
  };
}
