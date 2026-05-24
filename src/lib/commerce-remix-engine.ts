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

export interface CommerceRemixTemplate {
  id: string;
  name: string;
  bestFor: string;
  sceneOrder: string[];
  transitions: string[];
  captionSafeArea: string;
  qualityChecks: string[];
}

export interface CommerceRemixQualityGate {
  score: number;
  passed: boolean;
  checks: Array<{ id: string; passed: boolean; evidence: string; fix?: string }>;
  operatorSummary: string;
}

export interface CommerceCustomerServicePack {
  faq: Array<{ question: string; answer: string }>;
  objectionReplies: Array<{ objection: string; reply: string }>;
  afterSalesCards: Array<{ title: string; body: string }>;
  escalationRules: string[];
}

export interface CommerceModelImageTaskPack {
  productName: string;
  providerBoundary: string;
  tasks: Array<{
    id: string;
    imageType: 'model_handheld' | 'scene_lifestyle' | 'detail_proof' | 'comparison_card';
    title: string;
    prompt: string;
    negativePrompt: string;
    requiredInputs: string[];
    qualityChecks: string[];
    fallbackWithoutKey: string;
  }>;
  reviewChecklist: string[];
}

export interface CommerceCustomerSupportWorkflow {
  preSaleReplies: Array<{ scenario: string; reply: string; assetToSend: string }>;
  afterSaleReplies: Array<{ scenario: string; reply: string; escalation: string }>;
  negativeReviewRecovery: Array<{ issue: string; response: string; nextAction: string }>;
  humanHandoffRules: string[];
}

export interface CommerceOpenSourceAdapter {
  id: string;
  name: string;
  repositoryUrl: string;
  useFor: string;
  integrationMode: 'task_manifest' | 'local_worker' | 'optional_provider';
  customerValue: string;
  readiness: 'ready_now' | 'key_optional' | 'later';
  guardrail: string;
}

export interface CommerceRemixExecutionRecipe {
  id: string;
  adapterId: string;
  title: string;
  inputFiles: string[];
  operatorSteps: string[];
  outputFiles: string[];
  passCriteria: string[];
  fallbackWhenUnavailable: string;
}

export interface CommerceRemixWorkflowPlaybook {
  stages: Array<{
    id: string;
    title: string;
    customerAction: string;
    systemAction: string;
    output: string;
    qualityGate: string;
  }>;
  stableDefaults: string[];
  noProviderFallbacks: string[];
}

export interface CommercePublishingMatrixPlan {
  platform: RemixPlatform;
  accountAngles: Array<{
    accountType: string;
    title: string;
    firstLine: string;
    assetHint: string;
    publishNote: string;
  }>;
}

export interface CommerceCreatorPersonaMatrix {
  platform: RemixPlatform;
  platformLabel: string;
  personas: Array<{
    personaId: string;
    accountType: string;
    voiceStyle: string;
    titleFormulas: string[];
    openingLines: string[];
    contentPillars: string[];
    filmingPrompts: string[];
    proofAssets: string[];
    publishCadence: string;
    returnMetrics: string[];
    sourcePatterns: string[];
    doNotClaim: string[];
  }>;
}

export interface CommerceRenderCapacityPlan {
  laneCount: number;
  recommendedConcurrency: number;
  estimatedOutputsPerHour: number;
  queuePolicy: string[];
  failureIsolation: string[];
  monitoringSignals: string[];
  humanReviewGates: string[];
  storageHandoff: string[];
  scaleTriggers: string[];
  scalePath: string[];
}

export interface CommerceCloudDriveReturnPlan {
  intakeFields: Array<{ label: string; required: boolean; acceptedFormats: string[]; example: string }>;
  folderRules: string[];
  reviewSignals: string[];
  nextRoundOutputs: string[];
}

export interface CommerceCustomerDeliveryMap {
  headline: string;
  oneLinePromise: string;
  phases: Array<{
    id: string;
    label: string;
    customerInput: string[];
    wenaiOutput: string[];
    customerAction: string;
    acceptanceGate: string;
    nextHref: string;
  }>;
  handoffRules: string[];
}

export interface CommerceProviderActivationPlan {
  currentMode: string;
  lanes: Array<{
    id: string;
    name: string;
    currentPath: string;
    activateWhen: string;
    requiredFromCustomer: string[];
    acceptanceGate: string[];
    fallbackUntilActivated: string;
    customerFacingWording: string;
  }>;
  notNeededForFirstDelivery: string[];
  mustNotDo: string[];
}

export interface CommerceFirstDeliveryChecklist {
  promise: string;
  customerInputs: string[];
  wenaiOutputs: string[];
  noWaitItems: string[];
  acceptanceChecklist: string[];
  nextRoundTrigger: string[];
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
      id: 'commerce-template-bank',
      role: '电商混剪模板库',
      openSourceReference: 'OpenShot / Shotcut / timeline-based editor patterns',
      reason: '把开源剪辑器里的模板、转场、字幕安全区和镜头顺序收敛成少量稳定电商模板，避免功能很多但客户看不懂。',
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
    {
      id: 'quality-gate',
      role: '成片质量门禁',
      openSourceReference: 'Open-source media QA / render validation patterns',
      reason: '导出前检查字幕、素材授权、尺寸、音频、时长和发布包完整性，减少客户拿到不可用成片。',
    },
  ];
}

export function buildCommerceOpenSourceAdapters(): CommerceOpenSourceAdapter[] {
  return [
    {
      id: 'ffmpeg',
      name: 'FFmpeg / ffmpeg.wasm',
      repositoryUrl: 'https://github.com/FFmpeg/FFmpeg',
      useFor: '转码、裁切、拼接、字幕烧录、音频响度标准化、多尺寸导出',
      integrationMode: 'local_worker',
      customerValue: '把商品图、视频片段、字幕和配音稳定合成 MP4，不依赖外部视频 provider。',
      readiness: 'ready_now',
      guardrail: '只保存参数数组和输出路径，不拼接 shell 字符串，不接收客户账号凭据。',
    },
    {
      id: 'remotion',
      name: 'Remotion templates',
      repositoryUrl: 'https://github.com/remotion-dev/remotion',
      useFor: '商品卡、价格锚点、模特证明、字幕版式、结尾 CTA 模板',
      integrationMode: 'task_manifest',
      customerValue: '让短视频像电商模板一样可复用，换商品后仍能稳定出片。',
      readiness: 'ready_now',
      guardrail: '先导出模板任务包；真实渲染可走本地 worker 或后续队列。',
    },
    {
      id: 'whisper',
      name: 'Whisper.cpp / faster-whisper',
      repositoryUrl: 'https://github.com/ggerganov/whisper.cpp',
      useFor: '客户上传口播或直播切片的转写、字幕切句、多语字幕底稿',
      integrationMode: 'optional_provider',
      customerValue: '把已有口播素材变成字幕、标题和重剪素材，不等数字人 Key。',
      readiness: 'later',
      guardrail: '首版先交付字幕文件和口播稿，不承诺自动识别所有方言或噪声场景。',
    },
    {
      id: 'opencv-mediapipe',
      name: 'OpenCV / MediaPipe',
      repositoryUrl: 'https://github.com/opencv/opencv',
      useFor: '画面主体检测、商品/人脸安全区、字幕遮挡预检、封面裁切建议',
      integrationMode: 'optional_provider',
      customerValue: '减少字幕压住商品、模特脸部或平台按钮的问题。',
      readiness: 'later',
      guardrail: '仅做质量提示，不做人脸身份识别或用户画像。',
    },
    {
      id: 'mlt-shotcut',
      name: 'MLT / Shotcut / OpenShot patterns',
      repositoryUrl: 'https://github.com/mltframework/mlt',
      useFor: '时间线、转场、滤镜、轨道和导出配置的开源剪辑器范式',
      integrationMode: 'task_manifest',
      customerValue: '吸收成熟剪辑器的稳定结构，但不把客户带进复杂编辑器。',
      readiness: 'ready_now',
      guardrail: '只沉淀电商模板和任务清单，不复制大仓库 UI 或不明许可素材。',
    },
    {
      id: 'queue-worker',
      name: 'BullMQ-style worker queue',
      repositoryUrl: 'https://github.com/taskforcesh/bullmq',
      useFor: '大批量渲染排队、并发限制、单条失败重试、输出记录',
      integrationMode: 'local_worker',
      customerValue: '几十到几百条视频可以分批跑，失败不拖垮整批交付。',
      readiness: 'ready_now',
      guardrail: '首版只执行本地任务和导出包；云端 worker、对象存储和监控后续可接。',
    },
    {
      id: 'opentimelineio',
      name: 'OpenTimelineIO',
      repositoryUrl: 'https://github.com/AcademySoftwareFoundation/OpenTimelineIO',
      useFor: '跨工具时间线交换、片段顺序、时长、轨道和素材引用，作为混剪任务的中间格式',
      integrationMode: 'task_manifest',
      customerValue: '把脚本、素材和剪辑顺序固化成可复核的时间线，后续换 worker 或剪辑工具也不丢结构。',
      readiness: 'ready_now',
      guardrail: '只保存媒体引用和剪辑结构，不搬运未授权素材，不把客户账号或平台凭据写入时间线。',
    },
    {
      id: 'moviepy',
      name: 'MoviePy',
      repositoryUrl: 'https://github.com/Zulko/moviepy',
      useFor: 'Python 侧快速拼接、裁切、字幕叠加、封面预览和轻量自动化导出',
      integrationMode: 'local_worker',
      customerValue: '在 FFmpeg 参数较复杂时提供一个更容易编排的本地 worker，适合小批量快速预览。',
      readiness: 'ready_now',
      guardrail: '只处理客户上传或授权素材；大批量最终导出仍回到队列和 FFmpeg，避免内存不稳定。',
    },
    {
      id: 'pyscenedetect',
      name: 'PySceneDetect',
      repositoryUrl: 'https://github.com/Breakthrough/PySceneDetect',
      useFor: '自动识别长视频切点、场景变化和可复用片段，生成二次混剪候选素材',
      integrationMode: 'local_worker',
      customerValue: '客户给长素材时，先自动切出可用片段，再进入商品种草、模特证明和客服异议模板。',
      readiness: 'ready_now',
      guardrail: '只从客户授权视频中切片；切点建议必须进入人工抽检，不能直接发布。',
    },
    {
      id: 'lossless-cut',
      name: 'LosslessCut patterns',
      repositoryUrl: 'https://github.com/mifi/lossless-cut',
      useFor: '无损粗剪、片段抽取、顺序重排和素材瘦身，减少重复编码损耗',
      integrationMode: 'task_manifest',
      customerValue: '先把长素材无损拆成小片段，再做模板混剪，交付更快、画质损耗更少。',
      readiness: 'ready_now',
      guardrail: '只抽取客户授权素材片段；不用于下载、绕过平台限制或处理来源不明素材。',
    },
    {
      id: 'subtitle-edit',
      name: 'Subtitle Edit',
      repositoryUrl: 'https://github.com/SubtitleEdit/subtitleedit',
      useFor: 'SRT/ASS 字幕校对、时间轴修正、多语言字幕文件清洗和人工复核入口',
      integrationMode: 'task_manifest',
      customerValue: '把自动口播、人工录音和数字人脚本统一成可复核字幕，减少错字直接出片。',
      readiness: 'ready_now',
      guardrail: '自动字幕只作为底稿，商品承诺、价格、售后和敏感词必须人工复核。',
    },
    {
      id: 'imagemagick-libheif',
      name: 'ImageMagick / libheif',
      repositoryUrl: 'https://github.com/ImageMagick/ImageMagick',
      useFor: '商品图格式转换、AVIF/HEIF 兼容、封面尺寸批处理、缩略图和对比卡生成',
      integrationMode: 'local_worker',
      customerValue: '把客户上传的不同格式图片先标准化，避免后续生图、封面和混剪任务因为格式失败。',
      readiness: 'ready_now',
      guardrail: '只做格式和尺寸处理，不改写商品事实，不生成虚假效果对比。',
    },
    {
      id: 'gpac-packager',
      name: 'GPAC packaging',
      repositoryUrl: 'https://github.com/gpac/gpac',
      useFor: '成片封装、片段化 MP4、预览包和后续云端分发前的媒体封装验证',
      integrationMode: 'local_worker',
      customerValue: '在大规模队列后增加封装检查，减少客户下载后打不开或平台上传失败。',
      readiness: 'later',
      guardrail: '首版只做本地文件封装验证；平台上传和 CDN 分发后续再接客户授权配置。',
    },
  ];
}

export function buildCommerceRemixExecutionRecipes(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  adapters = buildCommerceOpenSourceAdapters(),
): CommerceRemixExecutionRecipe[] {
  const packageRoot = `exports/commerce-remix-${slugify(input.productName)}`;
  const adapterById = new Map(adapters.map(adapter => [adapter.id, adapter]));
  return [
    {
      id: 'recipe-template-manifest',
      adapterId: 'remotion',
      title: '模板任务清单',
      inputFiles: [`${packageRoot}/timeline.json`, `${packageRoot}/publishing-packs.json`, `${packageRoot}/voiceover-script.txt`],
      operatorSteps: [
        '读取商品时间线和发布包',
        '套用商品卡、模特证明、字幕和结尾 CTA 模板',
        '导出可交给渲染 worker 的 composition manifest',
      ],
      outputFiles: [`${packageRoot}/template-composition.json`, `${packageRoot}/cover-briefs.json`],
      passCriteria: ['每条 composition 有平台、尺寸、字幕安全区和封面说明', '没有 API Key、账号 token 或客户登录信息'],
      fallbackWhenUnavailable: adapterById.get('remotion')?.readiness === 'ready_now'
        ? '如果模板 worker 暂时不可用，仍导出 timeline.json 给本地 FFmpeg 任务使用。'
        : '先导出脚本和分镜，等待模板 worker。',
    },
    {
      id: 'recipe-local-render',
      adapterId: 'ffmpeg',
      title: '本地稳定合成',
      inputFiles: [`${packageRoot}/concat-manifest.txt`, `${packageRoot}/subtitles.srt`, `${packageRoot}/voiceover-script.txt`],
      operatorSteps: [
        '校验素材文件存在、授权已确认、字幕行不过长',
        `按 ${plan.ffmpegCommands.length} 条 FFmpeg 参数数组逐条执行`,
        '写入 MP4、封面和渲染日志',
      ],
      outputFiles: plan.ffmpegCommands.map(command => command.output),
      passCriteria: ['MP4 可播放', '字幕没有压住底部按钮或商品主体', '音频响度已标准化', '输出路径写回队列'],
      fallbackWhenUnavailable: '如果本机没有 FFmpeg，先导出参数数组和素材包，交给安装了 FFmpeg 的 worker 或剪辑机执行。',
    },
    {
      id: 'recipe-speech-caption',
      adapterId: 'whisper',
      title: '口播转字幕和切句',
      inputFiles: ['客户上传口播音频', '直播切片音轨', `${packageRoot}/voiceover-script.txt`],
      operatorSteps: [
        '优先使用客户上传音频生成字幕底稿',
        '按 3-7 秒节奏切句，回填 timeline subtitle track',
        '保留人工复核入口，避免噪声或口音导致错字直接发布',
      ],
      outputFiles: [`${packageRoot}/subtitles.srt`, `${packageRoot}/caption-review.md`],
      passCriteria: ['字幕可人工复核', '敏感词和商品承诺进入审核', '未识别片段保留时间戳'],
      fallbackWhenUnavailable: '没有转写 worker 时，直接使用系统生成的口播稿和人工字幕。',
    },
    {
      id: 'recipe-safe-crop',
      adapterId: 'opencv-mediapipe',
      title: '封面裁切和字幕遮挡检查',
      inputFiles: plan.ffmpegCommands.map(command => command.output),
      operatorSteps: [
        '抽取首帧、商品细节帧和 CTA 帧',
        '检查商品主体、模特脸部、手部和字幕区域',
        '生成封面裁切建议和字幕位置修正',
      ],
      outputFiles: [`${packageRoot}/cover-crop-suggestions.json`, `${packageRoot}/caption-safe-area-report.json`],
      passCriteria: ['商品主体未被裁掉', '字幕不压平台按钮', '人物脸部和手部不被遮挡'],
      fallbackWhenUnavailable: '没有视觉检测 worker 时，使用固定安全区模板和人工抽检截图。',
    },
    {
      id: 'recipe-queue-runner',
      adapterId: 'queue-worker',
      title: '批量队列和失败隔离',
      inputFiles: [`${packageRoot}/ffmpeg-commands.json`, `${packageRoot}/timeline.json`],
      operatorSteps: [
        '按平台和尺寸创建独立任务',
        '限制并发，单条失败只重跑单条',
        '连续失败后写入 blocked 原因，进入人工检查',
      ],
      outputFiles: [`${packageRoot}/render-log.json`, `${packageRoot}/failed-items.json`, `${packageRoot}/02-render-outputs`],
      passCriteria: ['缺素材任务不进入渲染', '已导出任务不被失败任务回滚', '日志能追溯每条视频输出'],
      fallbackWhenUnavailable: '没有队列服务时，按批次清单手动执行，每批最多 3 条。',
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

export function buildCommercePublishingMatrixPlan(
  input: CommerceRemixPlanInput,
  packs = buildPlatformPublishingPacks(input),
): CommercePublishingMatrixPlan[] {
  return packs.map(pack => ({
    platform: pack.platform,
    accountAngles: pack.accountVariants.map((variant, index) => ({
      accountType: variant.accountType,
      title: variant.title,
      firstLine: variant.firstLine,
      assetHint: index === 0
        ? '用真实使用场景、开箱或手持图做封面'
        : index === 1
          ? '用对比图、细节图或规格图做证明'
          : '用商品主图、售后承诺和店铺承接页做闭环',
      publishNote: `${PLATFORM_LABELS[pack.platform]}客户自发：复制标题和正文，上传对应成片，发布后回填链接、截图或 CSV。`,
    })),
  }));
}

export function buildCommerceCreatorPersonaMatrix(
  input: CommerceRemixPlanInput,
  publishingMatrix = buildCommercePublishingMatrixPlan(input),
): CommerceCreatorPersonaMatrix[] {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const audience = safeText(input.audience, '目标用户');
  return publishingMatrix.map(plan => ({
    platform: plan.platform,
    platformLabel: PLATFORM_LABELS[plan.platform],
    personas: plan.accountAngles.map((angle, index) => {
      const isBuyer = index === 0;
      const isReviewer = index === 1;
      return {
        personaId: `${plan.platform}-${index + 1}`,
        accountType: angle.accountType,
        voiceStyle: isBuyer
          ? '像真实使用者，先讲痛点和场景，不像广告。'
          : isReviewer
            ? '像测评博主，按问题、证据、限制、适合人群说清楚。'
            : '像店铺负责人，讲规格、售后、购买路径和客服承接。',
        titleFormulas: plan.platform === 'tiktok'
          ? [
              `I tried ${product} for ${audience}`,
              `3 seconds to see ${point}`,
              `${product}: problem, proof, result`,
            ]
          : plan.platform === 'shopify'
            ? [
                `${product} for ${audience}`,
                `${point}: specs, use case, FAQ`,
                `Why customers choose ${product}`,
              ]
            : [
                `${audience}先看这个${product}场景`,
                `${point}到底有没有用？`,
                `${product}适合谁，不适合谁`,
              ],
        openingLines: [
          isBuyer ? `先说真实感受：${point}这个问题，我会先看这个场景。` : `这条只测一个问题：${product}能不能解决${point}。`,
          isReviewer ? `别先看价格，先看它有没有把${point}讲清楚。` : `如果你是${audience}，这条可以直接照着选。`,
          `发布后客户只需要回填链接、截图或 CSV，我们再判断下一轮怎么重剪。`,
        ],
        contentPillars: isBuyer
          ? ['痛点场景', '真实使用', '避坑提醒', '评论区答疑']
          : isReviewer
            ? ['问题定义', '细节证据', '适合/不适合', '同款复测']
            : ['规格解释', '售后承接', '购买路径', '客服 FAQ'],
        filmingPrompts: isBuyer
          ? [`用${audience}真实场景开场`, '先拍问题，再拍商品进入画面', '保留一条评论区追问作为下一条选题']
          : isReviewer
            ? ['桌面俯拍开箱和细节', '同一角度展示前后对比', '用字幕标出不能夸大的边界']
            : ['展示商品主图和规格', '用客服问题做开场', '结尾给自发布后的回填提醒'],
        proofAssets: isBuyer
          ? ['真实使用图', '手持或开箱图', '发布后评论截图']
          : isReviewer
            ? ['对比图', '细节图', '规格或材质证明']
            : ['商品主图', 'FAQ 卡片', '售后承诺截图'],
        publishCadence: plan.platform === 'tiktok'
          ? '同一商品首轮 3 条：痛点、证明、反问，各隔 12-24 小时。'
          : plan.platform === 'xiaohongshu'
            ? '首轮 3 篇：场景种草、测评对比、避坑 FAQ，避免同一天连续刷屏。'
            : '首轮 2-3 个版本：商品页承接、广告素材、客服 FAQ，同步记录表现。',
        returnMetrics: plan.platform === 'shopify'
          ? ['商品页点击', '加购', '结账', '客服咨询']
          : plan.platform === 'meta'
            ? ['点击率', '落地页浏览', '询盘', '素材疲劳']
            : ['播放/阅读', '完播或停留', '收藏评论', '私信或商品点击'],
        sourcePatterns: [
          '开源提词器思路：把口播拆成短句，方便客户照读或数字人后续接入',
          '开源内容日历思路：同一商品按账号人设拆成多条，而不是重复发同一条',
          '开源字幕/剪辑思路：口播、字幕和混剪时间线保持同一份脚本来源',
        ],
        doNotClaim: [
          '不承诺平台自动登录或自动发布',
          '不虚构播放量、订单和转化',
          '不使用未经授权的客户素材或账号身份',
        ],
      };
    }),
  }));
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

export function buildCommerceCloudDriveReturnPlan(
  input: CommerceRemixPlanInput,
  manifest = buildCommerceCloudDriveManifest(input),
): CommerceCloudDriveReturnPlan {
  return {
    intakeFields: [
      { label: '发布平台链接', required: true, acceptedFormats: ['URL'], example: 'https://平台/作品链接' },
      { label: '发布截图', required: true, acceptedFormats: ['PNG', 'JPG', 'WEBP'], example: `${manifest.rootDir}/04-customer-return/xhs-screenshot.png` },
      { label: '表现 CSV', required: true, acceptedFormats: ['CSV'], example: 'title,impressions,clicks,orders,revenue' },
      { label: '客户备注', required: false, acceptedFormats: ['TXT', 'MD', '表单文本'], example: '这条适合继续放大，封面还要更清楚' },
    ],
    folderRules: [
      '客户只把发布后证据放进 04-customer-return，不覆盖 01-source-assets 和 02-render-outputs',
      '每个平台一个子目录：平台名-日期-商品名，方便下次复盘追踪',
      '截图必须能看到发布时间或后台指标，CSV 必须包含标题列',
      '云盘同步只是交付通道；没有云盘 provider 时仍可上传链接、截图和 CSV',
    ],
    reviewSignals: [
      `${input.platforms.map(platform => PLATFORM_LABELS[platform]).join(' / ')} 哪个平台先出现点击或订单信号`,
      '哪条标题点击更高，哪条封面需要重做',
      '客户评论和客服问题是否暴露新 FAQ 或售后风险',
      '是否需要补模特图、细节图、对比图或数字人口播',
    ],
    nextRoundOutputs: [
      '下一轮标题矩阵',
      '重剪任务清单',
      '补素材任务',
      '客服 FAQ 和差评解释',
      '投放或自然发布节奏建议',
    ],
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

export function buildCommerceRenderCapacityPlan(
  queue: CommerceRemixQueueItem[],
  batchPlan = buildCommerceRenderBatchPlan(queue),
): CommerceRenderCapacityPlan {
  const runnableCount = queue.filter(item => item.status === 'ready' || item.status === 'failed_retryable').length;
  const blockedCount = queue.filter(item => item.status === 'blocked' || item.status === 'needs_material').length;
  const laneCount = Math.max(1, batchPlan.batches.length || Math.ceil(queue.length / Math.max(1, batchPlan.maxConcurrency)));
  const estimatedOutputsPerHour = Math.max(0, runnableCount * 8);
  return {
    laneCount,
    recommendedConcurrency: batchPlan.maxConcurrency,
    estimatedOutputsPerHour,
    queuePolicy: [
      `可跑任务 ${runnableCount} 条，缺素材或阻断 ${blockedCount} 条`,
      `每批最多 ${batchPlan.maxConcurrency} 条并发，避免单机或小云主机被渲染打满`,
      '每条视频保留 platform、尺寸、模板、字幕、输出路径和重试次数',
      '渲染完成后只进入客户自发布交付包，不自动登录任何平台账号',
    ],
    failureIsolation: [
      '缺素材任务不进入批次',
      '单条失败只重试该条，不回滚已导出的 MP4',
      '连续失败后标记 blocked，并把素材编码、字幕和音频检查项写回任务',
    ],
    monitoringSignals: [
      '每批记录 started/exported/failed/blocked 数量',
      '每条任务记录平台、尺寸、模板、输出路径、attempt 和失败原因',
      '连续失败超过重试预算时进入人工复核，不继续占用渲染并发',
      '导出完成后等待客户回填链接、截图或 CSV，不自动读取平台账号',
    ],
    humanReviewGates: [
      '首批每个平台至少抽检 1 条成片',
      '字幕、商品主体、模特脸和平台按钮安全区必须人工抽检',
      'blocked 任务先查素材编码、缺图、字幕过长、音频响度，再允许重跑',
      '涉及售后承诺、价格、功效或对比的成片进入发布前复核',
    ],
    storageHandoff: [
      '01-source-assets 存客户原始素材和授权说明',
      '02-render-outputs 存 MP4、封面、字幕和渲染日志',
      '03-publishing-packs 存各平台标题、口播、标签和自发布清单',
      '04-customer-return 等客户回填发布链接、截图、CSV 或云盘目录',
    ],
    scaleTriggers: [
      '单批超过 30 条成片时拆分商品/平台批次',
      '连续两批失败率超过 15% 时降低并发并先做素材复核',
      '单机渲染超过 2 小时仍未完成时转多 worker 队列',
      '客户要求长期留存或多人协作时接对象存储/企业云盘',
    ],
    scalePath: [
      '本地单机：FFmpeg 参数数组 + 导出目录 + dry-run 验证',
      '小团队：队列 worker + 对象存储/云盘交付 + 失败重跑面板',
      '更大规模：多 worker 分片、渲染日志、云存储签名链接和客户空间权限',
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

export function buildCommerceRemixTemplateBank(input: CommerceRemixPlanInput): CommerceRemixTemplate[] {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  return [
    {
      id: 'hook-proof-cta',
      name: '三段式种草短视频',
      bestFor: '小红书、TikTok、视频号首轮测试',
      sceneOrder: [`3 秒痛点：${point}`, `${product}使用证明`, '适合人群和轻 CTA'],
      transitions: ['hard-cut-on-beat', 'zoom-proof-in', 'caption-card-out'],
      captionSafeArea: '9:16 底部 22% 留给平台按钮，字幕放在中下安全区。',
      qualityChecks: ['首屏出现具体痛点', '每 4-7 秒有画面变化', '结尾 CTA 不夸大承诺'],
    },
    {
      id: 'model-scene-proof',
      name: '模特场景证明片',
      bestFor: '服饰、美妆、家居、宠物用品等需要使用感的商品',
      sceneOrder: ['模特或手持图开场', '商品细节和尺寸证明', '前后对比或使用场景', '购买前 FAQ'],
      transitions: ['match-cut', 'detail-push', 'split-screen-proof'],
      captionSafeArea: '人物脸部和商品主体不压字幕；字幕最多两行。',
      qualityChecks: ['模特图授权或生成记录存在', '商品主体无遮挡', '字幕不盖住手部/脸部/价格'],
    },
    {
      id: 'service-objection-loop',
      name: '客服异议转化片',
      bestFor: '差评解释、物流说明、尺寸材质、售后承诺和直播切片复用',
      sceneOrder: ['真实问题', '原因解释', '解决办法', '客服话术卡片'],
      transitions: ['question-card-in', 'proof-cut', 'support-card-out'],
      captionSafeArea: '问题卡片在上 35%，解决办法在中部，避免遮挡平台评论区。',
      qualityChecks: ['FAQ 与商品卖点一致', '售后承诺不过度', '敏感问题进入人工复核'],
    },
  ];
}

export function buildCommerceRemixWorkflowPlaybook(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
): CommerceRemixWorkflowPlaybook {
  const product = safeText(input.productName, '商品');
  const platformText = input.platforms.map(platform => PLATFORM_LABELS[platform]).join(' / ');
  return {
    stages: [
      {
        id: 'brief',
        title: '商品和卖点定稿',
        customerAction: `提供${product}的商品图、卖点、受众、禁用词和参考链接。`,
        systemAction: '整理标题、口播、图文脚本、素材缺口和风险提示。',
        output: '商品 brief、首轮脚本、素材清单',
        qualityGate: '卖点不能只写抽象词，必须能落到画面或客服回答。',
      },
      {
        id: 'asset-shelf',
        title: '素材货架',
        customerAction: '上传商品图、视频片段、授权说明；缺模特图时先记录为待生成。',
        systemAction: `检查 ${plan.missingAssets.length} 个素材/授权缺口，并生成可拍摄或可生成的补素材任务。`,
        output: '素材货架、授权状态、缺口清单',
        qualityGate: '未确认授权的素材不能进入客户交付包。',
      },
      {
        id: 'template-remix',
        title: '开源混剪任务',
        customerAction: '确认主平台和想要测试的内容角度。',
        systemAction: '用时间线、模板、字幕、封面、BGM 和 FFmpeg 参数数组生成稳定任务包。',
        output: `${plan.timeline.clips.length} 个 clip / ${plan.ffmpegCommands.length} 条渲染命令`,
        qualityGate: '每条视频都必须有字幕、安全区、输出尺寸和失败重试路径。',
      },
      {
        id: 'render-queue',
        title: '批量渲染队列',
        customerAction: '只确认是否补素材或先导出已有版本。',
        systemAction: '按平台和尺寸拆分任务；失败只重跑单条，成功视频进入交付目录。',
        output: `${plan.queue.length} 条队列任务`,
        qualityGate: '缺素材的任务不进入渲染，避免交付空视频。',
      },
      {
        id: 'publishing-pack',
        title: '多账号发布包',
        customerAction: `客户自己登录 ${platformText} 发布，并按清单回填结果。`,
        systemAction: '生成各平台标题、正文、标签、封面建议、账号角度和发布时间提醒。',
        output: `${plan.publishingPacks.length} 个平台发布包`,
        qualityGate: '不代管账号，不自动登录，不绕过平台发布流程。',
      },
      {
        id: 'return-loop',
        title: '表现回填和下一轮',
        customerAction: '上传发布链接、截图、CSV 或云盘目录。',
        systemAction: '判断哪条标题和素材有效，生成下一轮重剪、客服和售后动作。',
        output: '复盘建议、下一轮素材缺口、客服话术',
        qualityGate: '没有真实回填时不虚构播放量、订单和转化。',
      },
    ],
    stableDefaults: [
      '首轮只保留三类模板：种草证明、模特场景、客服异议',
      '所有渲染输出默认生成 9:16，按平台补 1:1 或 16:9',
      '字幕默认最多两行，避开底部平台按钮和商品主体',
      '标题矩阵默认按真实买家号、测评种草号、店铺官方号三种角度生成',
    ],
    noProviderFallbacks: [
      '没有图片 Key：先导出模特图和场景图 prompt，客户可上传已有图',
      '没有视频/数字人 Key：先导出口播稿、字幕、时间线和本地混剪任务',
      '没有平台数据 API：客户上传链接、截图、CSV 或云盘目录',
      '没有自动发布：客户自己登录平台发布，Wenai 只给发布包和回填表',
    ],
  };
}

export function evaluateCommerceRemixQuality(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  templates = buildCommerceRemixTemplateBank(input),
): CommerceRemixQualityGate {
  const checks = [
    {
      id: 'material-ready',
      passed: plan.missingAssets.length === 0,
      evidence: plan.missingAssets.length === 0 ? '素材和授权已齐' : `仍缺 ${plan.missingAssets.map(asset => asset.label).join(' / ')}`,
      fix: plan.missingAssets.length === 0 ? undefined : '补齐商品图、模特图、视频片段或授权说明',
    },
    {
      id: 'timeline-complete',
      passed: plan.timeline.durationSeconds >= 8 && plan.timeline.clips.some(clip => clip.track === 'subtitle'),
      evidence: `${plan.timeline.durationSeconds}s / ${plan.timeline.clips.length} clips`,
      fix: '至少保留 8 秒成片，并包含字幕轨道',
    },
    {
      id: 'template-covered',
      passed: templates.length >= 3,
      evidence: `${templates.length} 个电商混剪模板可用`,
      fix: '补充种草、模特证明、客服异议三类模板',
    },
    {
      id: 'publish-pack-ready',
      passed: plan.publishingPacks.length === input.platforms.length && plan.publishingPacks.every(pack => pack.accountVariants.length >= 3),
      evidence: `${plan.publishingPacks.length} 个平台发布包 / ${plan.publishingPacks.reduce((sum, pack) => sum + pack.accountVariants.length, 0)} 个账号角度`,
      fix: '为每个平台生成标题、正文、标签和账号矩阵角度',
    },
    {
      id: 'render-command-safe',
      passed: plan.ffmpegCommands.every(command => Array.isArray(command.args) && command.args.includes('-filter_complex')),
      evidence: `${plan.ffmpegCommands.length} 条 FFmpeg 参数数组`,
      fix: '使用参数数组，不拼接 shell 字符串',
    },
  ];
  const passedCount = checks.filter(check => check.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const hardGatesPassed = checks
    .filter(check => check.id === 'material-ready' || check.id === 'publish-pack-ready')
    .every(check => check.passed);
  return {
    score,
    passed: score >= 80 && hardGatesPassed,
    checks,
    operatorSummary: score >= 80 && hardGatesPassed
      ? '可以进入客户发布包导出和自发布回填。'
      : '先补素材、模板或发布包，再进入批量渲染。',
  };
}

export function buildCommerceCustomerServicePack(input: CommerceRemixPlanInput): CommerceCustomerServicePack {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const secondaryPoint = safeText(input.sellingPoints[1] || '', '使用体验');
  return {
    faq: [
      { question: `${product}适合什么人？`, answer: `适合${input.audience}，尤其是关注${point}的人群。` },
      { question: `和普通产品有什么区别？`, answer: `先看${point}，再看${secondaryPoint}，不要只按价格判断。` },
      { question: '购买前需要确认什么？', answer: '请先确认规格、使用场景、物流时效和售后边界。' },
    ],
    objectionReplies: [
      { objection: '觉得价格高', reply: `可以先解释${point}带来的具体场景价值，再给出规格和售后说明。` },
      { objection: '担心不好用', reply: '优先发送使用步骤、场景图和真实反馈截图，不做夸大承诺。' },
      { objection: '物流或售后问题', reply: '先确认订单状态，再给出可执行的补发、退换或人工处理路径。' },
    ],
    afterSalesCards: [
      { title: '使用提醒', body: `第一次使用${product}前，先按说明检查规格和场景是否匹配。` },
      { title: '问题反馈', body: '请提供订单号、问题截图和使用场景，客服会按售后规则处理。' },
      { title: '复购引导', body: `如果${point}的体验有效，可以收藏同类配件或下一轮组合包。` },
    ],
    escalationRules: ['涉及退款、医疗、安全、侵权或平台处罚的问题转人工', '客户提供差评截图后先记录原因，再生成解释话术', '任何承诺必须和商品详情页、物流与售后政策一致'],
  };
}

export function buildCommerceModelImageTaskPack(input: CommerceRemixPlanInput): CommerceModelImageTaskPack {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const secondaryPoint = safeText(input.sellingPoints[1] || '', '使用体验');
  const audience = safeText(input.audience, '目标用户');
  return {
    productName: product,
    providerBoundary: '图片 API Key 到位后可直接执行；未接 Key 时先导出 prompt、参考图要求和人工验收清单。',
    tasks: [
      {
        id: 'model-handheld-proof',
        imageType: 'model_handheld',
        title: '手持模特证明图',
        prompt: `${audience}在真实生活场景中手持${product}，画面突出${point}，自然光，电商主图级清晰度，商品主体无遮挡，人物表情自然。`,
        negativePrompt: '不要夸张表情、不要多余手指、不要遮挡商品、不要水印、不要平台 logo、不要虚假效果对比。',
        requiredInputs: ['商品主图', '目标人群', '使用场景', '授权边界'],
        qualityChecks: ['商品主体完整', '手部和脸部不畸形', '卖点能从画面看出来', '不出现未经授权品牌'],
        fallbackWithoutKey: '先让客户上传手持照片或开箱图；没有照片时把 prompt 放进补素材任务。',
      },
      {
        id: 'scene-lifestyle-proof',
        imageType: 'scene_lifestyle',
        title: '场景生活方式图',
        prompt: `${product}出现在${audience}的日常使用场景中，强调${point}和${secondaryPoint}，背景干净，有空间放标题和卖点卡片。`,
        negativePrompt: '不要杂乱背景、不要错误规格、不要和商品无关的人群、不要过度滤镜。',
        requiredInputs: ['商品主图', '场景关键词', '平台尺寸', '标题安全区'],
        qualityChecks: ['场景和受众一致', '标题区域留白', '商品比例合理', '适合 9:16 和 1:1 裁切'],
        fallbackWithoutKey: '用客户现有场景图或素材库图片做占位，进入本地混剪时保留缺口标记。',
      },
      {
        id: 'detail-proof-card',
        imageType: 'detail_proof',
        title: '细节证明图',
        prompt: `${product}的关键细节特写，突出${point}，使用清晰标注线和简短卖点，不夸大承诺，适合详情页和短视频中段证明。`,
        negativePrompt: '不要医疗或绝对化承诺、不要看不清的文字、不要错误材质、不要虚构认证。',
        requiredInputs: ['细节图', '规格参数', '禁用词', '售后边界'],
        qualityChecks: ['文字不超过两行', '规格与详情页一致', '无绝对化承诺', '细节清晰可辨'],
        fallbackWithoutKey: '先导出细节图拍摄清单，客户补图后再进入模板。',
      },
      {
        id: 'comparison-card',
        imageType: 'comparison_card',
        title: '对比解释卡',
        prompt: `${product}解决${point}的前后对比卡片，左侧展示常见问题，右侧展示使用后状态，文案克制，适合客服解释和发布封面。`,
        negativePrompt: '不要贬低竞品、不要虚构数据、不要夸张前后对比、不要制造恐惧。',
        requiredInputs: ['常见问题', '卖点解释', '客服 FAQ', '售后政策'],
        qualityChecks: ['对比不攻击竞品', '客服可直接发送', '和 FAQ 口径一致', '适合截图传播'],
        fallbackWithoutKey: '用文本卡片先交付，图片 Key 到位后再生成视觉版本。',
      },
    ],
    reviewChecklist: [
      '商品主体和规格不能画错',
      '模特图必须有生成记录或客户授权',
      '标题和字幕不能遮挡脸、手、商品主体和平台按钮',
      '客服、详情页、发布文案里的承诺必须一致',
    ],
  };
}

export function buildCommerceCustomerSupportWorkflow(
  input: CommerceRemixPlanInput,
  servicePack = buildCommerceCustomerServicePack(input),
): CommerceCustomerSupportWorkflow {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  return {
    preSaleReplies: [
      { scenario: '客户问适不适合自己', reply: servicePack.faq[0]?.answer || `${product}适合关注${point}的人群。`, assetToSend: '适合人群图 + 详情页 FAQ' },
      { scenario: '客户觉得贵', reply: servicePack.objectionReplies[0]?.reply || `先解释${point}的具体价值，再给规格和售后说明。`, assetToSend: '细节证明图 + 对比解释卡' },
      { scenario: '客户担心不好用', reply: servicePack.objectionReplies[1]?.reply || '先发送使用步骤和真实反馈截图，不夸大承诺。', assetToSend: '使用步骤图 + 模特/场景证明图' },
    ],
    afterSaleReplies: [
      { scenario: '收到后不会使用', reply: `先发送${product}使用提醒和步骤图，再确认客户的具体使用场景。`, escalation: '仍无法解决时转人工客服' },
      { scenario: '物流或破损问题', reply: servicePack.objectionReplies[2]?.reply || '先确认订单状态，再给出补发、退换或人工处理路径。', escalation: '涉及退款、补发、投诉立即转人工' },
      { scenario: '规格不匹配', reply: '请客户提供订单号、规格截图和实物照片，按售后政策判断退换路径。', escalation: '规格争议或平台处罚风险转人工' },
    ],
    negativeReviewRecovery: [
      { issue: '觉得效果不明显', response: `先承认体验差异，再解释${point}适用场景，避免反驳客户。`, nextAction: '补一张场景证明图和使用步骤卡' },
      { issue: '觉得价格高', response: '回复时只讲规格、材质、售后和适用人群，不攻击竞品。', nextAction: '生成价格异议解释卡' },
      { issue: '物流或售后不满', response: '先处理订单问题，再邀请客户补充截图，不在公开区争辩。', nextAction: '转人工并记录差评原因' },
    ],
    humanHandoffRules: [
      '涉及退款、投诉、侵权、安全、医疗或平台处罚风险必须转人工',
      '客户上传差评截图后先记录原因，再生成解释话术和补素材任务',
      '任何客服承诺必须和详情页、物流政策、售后政策一致',
    ],
  };
}

export function buildCommerceCustomerDeliveryMap(input: CommerceRemixPlanInput): CommerceCustomerDeliveryMap {
  const product = safeText(input.productName, '商品');
  const platforms = input.platforms.map(platform => PLATFORM_LABELS[platform]).join(' / ');
  return {
    headline: `${product}从资料到发布回填的交付导航`,
    oneLinePromise: '客户只按步骤补资料、拿发布包、自行发布并回填表现；Wenai 负责脚本、图片任务、混剪队列、标题矩阵、客服素材和复盘建议。',
    phases: [
      {
        id: 'brief',
        label: '商品资料',
        customerInput: ['商品链接或主图', '卖点和禁用词', '目标人群', '参考竞品或账号'],
        wenaiOutput: ['商品 brief', '首轮标题', '口播脚本', '素材缺口'],
        customerAction: '确认一个主推商品和一个优先平台。',
        acceptanceGate: '卖点能落到画面、客服回答或详情页，不只写抽象词。',
        nextHref: '/factory/creative?variant=friend_trial',
      },
      {
        id: 'image',
        label: '模特和素材',
        customerInput: ['商品原图', '授权说明', '场景偏好', '规格参数'],
        wenaiOutput: ['模特生图任务包', '场景图 prompt', '细节证明图任务', '图片验收清单'],
        customerAction: '有 Key 时直接生成；没有 Key 时先补参考图或确认 prompt。',
        acceptanceGate: '商品不画错、授权明确、画面不遮挡平台按钮和商品主体。',
        nextHref: '/factory/create?variant=friend_trial',
      },
      {
        id: 'remix',
        label: '混剪成片',
        customerInput: ['商品图', '视频片段', '口播或配音稿', '主平台尺寸'],
        wenaiOutput: ['时间线', '字幕', 'FFmpeg 命令', '渲染批次', '质量门禁'],
        customerAction: '确认是否补素材，或先导出已有版本。',
        acceptanceGate: '每条视频有字幕、安全区、输出路径和失败重试路径。',
        nextHref: '/factory/video?variant=friend_trial',
      },
      {
        id: 'publish',
        label: '发布包',
        customerInput: [`目标平台：${platforms}`, '账号类型', '发布时间偏好', '客服承接口径'],
        wenaiOutput: ['平台标题矩阵', '口播开场', '封面建议', '发布检查清单'],
        customerAction: '客户自己登录平台发布，发布后回填链接、截图或 CSV。',
        acceptanceGate: '不代管账号、不自动登录、不虚构表现数据。',
        nextHref: '/factory/cast?variant=friend_trial',
      },
      {
        id: 'support',
        label: '客服和售后',
        customerInput: ['常见问题', '售后政策', '差评截图', '物流或规格争议'],
        wenaiOutput: ['售前话术', '售后处理', '差评挽回', '人工升级规则'],
        customerAction: '客服按场景发送对应素材，争议问题转人工。',
        acceptanceGate: '所有承诺和详情页、物流政策、售后政策一致。',
        nextHref: '/factory/manage?variant=friend_trial',
      },
      {
        id: 'return',
        label: '表现复盘',
        customerInput: ['发布链接', '发布截图', '表现 CSV', '客户备注'],
        wenaiOutput: ['最佳标题判断', '下一轮重剪任务', '补素材建议', '客服 FAQ 更新'],
        customerAction: '把发布后的证据放进回填区，不覆盖原始素材和成片。',
        acceptanceGate: '没有真实回填时不展示虚构播放量、订单或转化。',
        nextHref: '/factory/manage?variant=friend_trial',
      },
    ],
    handoffRules: [
      '图片、视频、数字人 Key 到位后只替换执行层，不改变客户操作流程',
      '平台发布由客户自行完成；Wenai 交付可复制的标题、素材、脚本和检查表',
      '表现数据先走链接、截图、CSV 或云盘目录，后续再接 analytics provider',
      '每次交付都必须能回答：客户给什么、Wenai 出什么、客户下一步做什么',
    ],
  };
}

export function buildCommerceProviderActivationPlan(): CommerceProviderActivationPlan {
  return {
    currentMode: '本地优先：混剪、发布包、云盘回填、客服素材和复盘建议不依赖外部 provider。',
    lanes: [
      {
        id: 'image-key',
        name: '图片和模特生图 Key',
        currentPath: '先导出模特图、场景图、细节图和对比卡 prompt，客户可上传已有图。',
        activateWhen: '你提供图片生成 API Key，并确认可商用模型、图片尺寸和回调方式。',
        requiredFromCustomer: ['图片 API Key', '可商用范围', '默认尺寸', '失败回调或查询方式'],
        acceptanceGate: ['生成图不画错商品', '模特图有生成记录或授权说明', '输出能进入素材货架和混剪任务'],
        fallbackUntilActivated: '用客户原图、参考图、人工拍摄清单和 prompt 包先交付。',
        customerFacingWording: '图片任务已准备好，Key 到位后可直接批量生成。',
      },
      {
        id: 'video-key',
        name: '视频生成 Key',
        currentPath: '本地时间线、字幕、FFmpeg 命令和渲染批次已经可生成任务包。',
        activateWhen: '需要真实 AI 视频生成，而不是本地素材混剪时再接。',
        requiredFromCustomer: ['视频 API Key', '任务提交接口', '结果查询或回调', '失败码和重试规则'],
        acceptanceGate: ['每条视频有任务 ID', '结果能写回 render queue', '失败只影响单条任务', '不泄漏 Key'],
        fallbackUntilActivated: '继续走本地混剪、客户素材、字幕和发布包。',
        customerFacingWording: '短视频先走稳定混剪；需要 AI 生成镜头时再接视频 Key。',
      },
      {
        id: 'avatar-tts-key',
        name: '数字人 / TTS Key',
        currentPath: '先交付口播稿、字幕、开场话术和多账号人设。',
        activateWhen: '客户需要真人口播替代人工录音，且你提供数字人或 TTS Key。',
        requiredFromCustomer: ['数字人或 TTS Key', '可用人设/音色', '语言范围', '回调或下载方式'],
        acceptanceGate: ['口播和字幕一致', '音色/人设可复用', '失败不阻塞其他平台发布包'],
        fallbackUntilActivated: '导出口播稿、字幕和录音说明，客户可人工录音。',
        customerFacingWording: '数字人口播脚本已就绪，Key 到位后换成自动生成。',
      },
      {
        id: 'cloud-drive',
        name: '云盘 / 对象存储',
        currentPath: '当前先用导出目录、链接、截图和 CSV 回填。',
        activateWhen: '客户文件量变大、多人协作或需要长期留存时再接。',
        requiredFromCustomer: ['云盘或对象存储配置', '上传目录规则', '访问权限', '签名链接策略'],
        acceptanceGate: ['客户只能访问自己的目录', '回填文件能被复盘读取', '链接过期和权限可控'],
        fallbackUntilActivated: '用本地导出包或客户上传链接先跑。',
        customerFacingWording: '先用回填表和目录交付；规模变大后接企业云盘。',
      },
      {
        id: 'analytics-api',
        name: '平台表现数据 API',
        currentPath: '客户上传发布链接、截图、CSV，系统做下一轮复盘。',
        activateWhen: '平台账号、授权和归因口径稳定后再接。',
        requiredFromCustomer: ['平台授权', '指标口径', '时间窗口', '账号和作品映射'],
        acceptanceGate: ['指标和客户后台一致', '没有授权时不读取', '缺数据时不虚构表现'],
        fallbackUntilActivated: '客户手动上传链接、截图、CSV 或云盘目录。',
        customerFacingWording: '表现先上传，我们先复盘；后续可接自动数据回流。',
      },
    ],
    notNeededForFirstDelivery: [
      '平台自动登录',
      '平台自动发布 OAuth',
      '广告账户授权',
      '自动 analytics sync',
      '企业云盘同步',
    ],
    mustNotDo: [
      '不代管客户账号密码',
      '不绕过平台发布流程',
      '不把未接 Key 的能力写成已自动生成',
      '不虚构播放量、订单、收入或转化',
    ],
  };
}

export function buildCommerceFirstDeliveryChecklist(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  exportPackage = buildCommerceRemixExportPackage(input, plan),
  deliveryMap = buildCommerceCustomerDeliveryMap(input),
  providerPlan = buildCommerceProviderActivationPlan(),
): CommerceFirstDeliveryChecklist {
  const product = safeText(input.productName, '商品');
  const platforms = input.platforms.map(platform => PLATFORM_LABELS[platform]).join(' / ');
  return {
    promise: `${product} 首版不等图片/视频/数字人 Key，也能交付 ${platforms} 可自发布内容包和下一轮复盘入口。`,
    customerInputs: unique(deliveryMap.phases.flatMap(phase => phase.customerInput)).slice(0, 10),
    wenaiOutputs: unique([
      ...deliveryMap.phases.flatMap(phase => phase.wenaiOutput),
      ...exportPackage.artifacts.map(artifact => artifact.description),
    ]).slice(0, 14),
    noWaitItems: [
      ...providerPlan.notNeededForFirstDelivery,
      '图片/视频/数字人 Key 未到位时先交付 prompt、脚本、字幕和本地混剪任务',
    ],
    acceptanceChecklist: [
      '商品资料、卖点、禁用词和目标平台已确认',
      `至少生成 ${plan.publishingPacks.length} 个平台发布包，每个平台有标题、正文、标签、封面建议和回填要求`,
      `混剪任务有 ${plan.timeline.clips.length} 个时间线片段、${plan.ffmpegCommands.length} 条 FFmpeg 参数数组和失败重试路径`,
      '模特图、场景图、细节图和对比卡都有 prompt 或客户素材补充路径',
      '客服 FAQ、异议处理、售后卡片和差评挽回话术能承接发布后的咨询',
      '客户发布后只需回填链接、截图、CSV 或云盘目录；没有真实回填不展示虚构表现',
    ],
    nextRoundTrigger: [
      '客户回填发布链接或截图后，开始判断哪个标题和账号人设值得放大',
      '客户补齐缺失素材后，blocked 渲染任务可重新进入队列',
      'API Key 到位后，把已有 prompt、脚本和时间线切换为自动生图、视频或数字人口播',
      '单批超过 30 条成片或多人协作时，再接企业云盘、对象存储或多 worker',
    ],
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

export function buildDemoCommerceCloudDriveReturnPlan() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceCloudDriveReturnPlan(input, buildCommerceCloudDriveManifest(input));
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

export function buildDemoCommerceRenderCapacityPlan() {
  const demoInput = buildDemoCommerceRemixInput();
  const readyInput = {
    ...demoInput,
    assets: demoInput.assets.map(asset => asset.id === 'model-handheld'
      ? { ...asset, missing: false, uri: 'assets/model-handheld.png', rightsReady: true }
      : asset),
  };
  const plan = buildCommerceRemixEnginePlan(readyInput);
  const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 3, retryBudget: 2 });
  return buildCommerceRenderCapacityPlan(plan.queue, batchPlan);
}

export function buildDemoCommerceRemixTemplateBank() {
  return buildCommerceRemixTemplateBank(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceRemixWorkflowPlaybook() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceRemixWorkflowPlaybook(input, buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommerceRemixExecutionRecipes() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceRemixExecutionRecipes(input, buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommercePublishingMatrixPlan() {
  const input = buildDemoCommerceRemixInput();
  return buildCommercePublishingMatrixPlan(input);
}

export function buildDemoCommerceCreatorPersonaMatrix() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceCreatorPersonaMatrix(input);
}

export function buildDemoCommerceRemixQualityGate() {
  const demoInput = buildDemoCommerceRemixInput();
  return evaluateCommerceRemixQuality(demoInput, buildCommerceRemixEnginePlan(demoInput));
}

export function buildDemoCommerceCustomerServicePack() {
  return buildCommerceCustomerServicePack(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceModelImageTaskPack() {
  return buildCommerceModelImageTaskPack(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceCustomerSupportWorkflow() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceCustomerSupportWorkflow(input, buildCommerceCustomerServicePack(input));
}

export function buildDemoCommerceCustomerDeliveryMap() {
  return buildCommerceCustomerDeliveryMap(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceProviderActivationPlan() {
  return buildCommerceProviderActivationPlan();
}

export function buildDemoCommerceFirstDeliveryChecklist() {
  const input = buildDemoCommerceRemixInput();
  const plan = buildCommerceRemixEnginePlan(input);
  return buildCommerceFirstDeliveryChecklist(input, plan, buildCommerceRemixExportPackage(input, plan));
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
