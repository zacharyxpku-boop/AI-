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

export interface CommerceCustomerReturnIntakeBoard {
  status: 'ready_for_review' | 'needs_evidence';
  evidenceCards: Array<{
    id: string;
    label: string;
    required: boolean;
    state: 'received' | 'missing';
    operatorAction: string;
  }>;
  reviewQueue: string[];
  nextOwnerActions: string[];
}

export interface CommerceEvidenceReadinessBoard {
  headline: string;
  status: 'ready_for_review' | 'needs_customer_upload';
  customerInstruction: string;
  requiredEvidenceChecks: Array<{
    label: string;
    state: 'ready' | 'missing';
    whyItMatters: string;
    nextAction: string;
  }>;
  uploadRoutes: string[];
  readyToReviewWhen: string[];
  blockedWhen: string[];
  nextRoundHandoff: string[];
}

export interface CommerceCustomerEvidenceUploadGuide {
  headline: string;
  promise: string;
  uploadSteps: Array<{
    step: string;
    title: string;
    customerAction: string;
    wenaiAction: string;
  }>;
  acceptedEvidence: Array<{
    label: string;
    formats: string[];
    destination: string;
    proves: string;
  }>;
  reviewReadinessRules: string[];
  nextRoundMapping: Array<{
    evidence: string;
    nextWenaiAction: string;
  }>;
  doNotAskCustomerFor: string[];
}

export interface CommercePostPublishActionBoard {
  headline: string;
  status: 'ready_for_next_round' | 'waiting_for_evidence';
  evidenceSummary: string;
  actionLanes: Array<{
    id: 'remix' | 'support' | 'asset' | 'evidence';
    label: string;
    trigger: string;
    actions: string[];
    owner: string;
    output: string;
  }>;
  reviewScript: string[];
  doNotAutomate: string[];
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

export interface CommerceSalesConversationBoard {
  promise: string;
  lanes: Array<{
    id: 'inquiry' | 'recommendation' | 'publish_followup' | 'after_sales' | 'repurchase';
    label: string;
    customerTrigger: string;
    wenaiOutput: string[];
    operatorAction: string;
    proofToCollect: string[];
    nextSystemStep: string;
  }>;
  inboxFields: Array<{ label: string; example: string; required: boolean }>;
  noAutomationBoundaries: string[];
  handoffSummary: string[];
}

export interface CommerceWorkbenchSystemLane {
  id: 'brief' | 'model_image' | 'remix' | 'publish_pack' | 'support' | 'review';
  title: string;
  customerQuestion: string;
  wenaiOutput: string[];
  customerAction: string;
  proofToCollect: string[];
  routeHref: string;
  status: 'ready_now' | 'key_enhanced' | 'customer_upload';
}

export interface CommerceWorkbenchSystemMap {
  headline: string;
  promise: string;
  primaryRoute: string[];
  lanes: CommerceWorkbenchSystemLane[];
  dailyOperatingRules: string[];
  notInScope: string[];
}

export interface CommerceDailyOperatorCockpit {
  headline: string;
  promise: string;
  todayFocus: Array<{
    id: CommerceWorkbenchSystemLane['id'];
    label: string;
    customerNeed: string;
    wenaiDoes: string;
    customerDoes: string;
    visibleProof: string;
    nextHref: string;
  }>;
  commandStrip: string[];
  customerCanIgnore: string[];
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

export interface CommerceRemixCapabilityRoute {
  id: string;
  phase: '素材整理' | '片段挖掘' | '模板编排' | '稳定渲染' | '质检复盘';
  customerLabel: string;
  primaryAdapterIds: string[];
  backupAdapterIds: string[];
  input: string;
  decisionRule: string;
  outputs: string[];
  stabilityChecks: string[];
}

export interface CommerceRemixOrchestrationBoard {
  promise: string;
  routes: CommerceRemixCapabilityRoute[];
  fallbackOrder: string[];
  customerVisibleOutputs: string[];
  notProviderBlockers: string[];
}

export interface CommerceOpenSourceCoverageLayer {
  id: string;
  label: string;
  customerProblem: string;
  primaryAdapterIds: string[];
  backupAdapterIds: string[];
  runNow: string;
  outputProof: string;
  scaleRule: string;
}

export interface CommerceOpenSourceCoverage {
  headline: string;
  summary: string;
  readyNowCount: number;
  totalAdapterCount: number;
  layers: CommerceOpenSourceCoverageLayer[];
  installOrder: string[];
  customerPromise: string;
  limits: string[];
}

export interface CommerceOpenSourceStackDecision {
  id: string;
  customerSituation: string;
  useWhen: string;
  defaultAdapterIds: string[];
  backupAdapterIds: string[];
  operatorRule: string;
  customerOutput: string;
  stabilityCheck: string;
}

export interface CommerceOpenSourceStackSelector {
  headline: string;
  customerPromise: string;
  defaultStack: string[];
  decisions: CommerceOpenSourceStackDecision[];
  scaleUpRules: string[];
  doNotUseFor: string[];
}

export interface CommerceOpenSourceInstallMatrix {
  headline: string;
  promise: string;
  minimumLocalStack: string[];
  lanes: Array<{
    id: string;
    customerLabel: string;
    adapterIds: string[];
    installCheck: string;
    smokeTest: string;
    outputProof: string;
    fallback: string;
  }>;
  readyDefinition: string[];
  scaleLaterStack: string[];
  providerBoundary: string[];
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

export interface CommerceSuperIpTitleBoard {
  headline: string;
  promise: string;
  titleFamilies: Array<{
    id: string;
    label: string;
    bestFor: string;
    titleFormula: string;
    openingLine: string;
    voiceoverBeats: string[];
    evidenceRequired: string[];
    platformFit: string[];
    customerAction: string;
    remixCue: string;
  }>;
  operatingRules: string[];
  returnLoop: string[];
}

export interface CommerceTitleQualityGate {
  headline: string;
  promise: string;
  gateStatus: 'ready_to_publish_pack' | 'needs_copy_review';
  checks: Array<{
    label: string;
    passRule: string;
    failAction: string;
  }>;
  platformGuides: Array<{
    platform: RemixPlatform;
    platformLabel: string;
    firstLineRule: string;
    proofNeeded: string[];
    avoid: string[];
  }>;
  publishOnlyWhen: string[];
  returnSignals: string[];
}

export interface CommerceSelfPublishingSlot {
  id: string;
  platform: RemixPlatform;
  platformLabel: string;
  accountType: string;
  publishWindow: string;
  title: string;
  firstLine: string;
  assetToUpload: string;
  copyAction: string;
  evidenceRequired: string[];
  nextReviewMove: string;
}

export interface CommerceSelfPublishingCommandCenter {
  headline: string;
  promise: string;
  slots: CommerceSelfPublishingSlot[];
  customerSteps: string[];
  evidenceInbox: Array<{ label: string; accepted: string; why: string }>;
  noLoginRules: string[];
  nextRoundDecisions: string[];
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

export interface CommerceRenderReliabilityBoard {
  status: 'ready' | 'needs_material' | 'scale_review';
  customerPromise: string;
  lanes: Array<{
    id: string;
    label: string;
    count: number;
    customerMeaning: string;
    operatorAction: string;
  }>;
  batchControls: string[];
  customerVisibleStatuses: string[];
  operatorRules: string[];
  scaleDecision: {
    currentMode: string;
    whenToScale: string[];
    notNeededYet: string[];
  };
}

export interface CommerceRenderOperationsRunbook {
  headline: string;
  operatingMode: string;
  preflightChecks: string[];
  batchSteps: Array<{
    id: string;
    title: string;
    action: string;
    proof: string;
    failureFallback: string;
  }>;
  escalationMatrix: Array<{
    trigger: string;
    decision: string;
    ownerAction: string;
  }>;
  customerHandoff: string[];
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

export interface CommerceProviderNeedAssessment {
  verdict: 'first_delivery_ready' | 'key_waiting' | 'provider_required';
  customerSummary: string;
  canRunNow: Array<{ capability: string; evidence: string; customerAction: string }>;
  waitingForYourKeys: Array<{ keyType: string; unlocks: string; fallbackNow: string }>;
  notRequiredNow: string[];
  escalationTriggers: string[];
  finalRecommendation: string;
}

export interface CommerceProviderActivationRunbook {
  headline: string;
  customerPromise: string;
  keyHandlingRules: string[];
  steps: Array<{
    id: string;
    laneId: string;
    label: string;
    customerInput: string[];
    wenaiAction: string[];
    writesBackTo: string[];
    acceptanceEvidence: string[];
    fallbackIfFailed: string;
  }>;
  fallbackPolicy: string[];
  doneDefinition: string[];
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
      id: 'editly',
      name: 'Editly',
      repositoryUrl: 'https://github.com/mifi/editly',
      useFor: '配置式短视频拼接、图片动效、字幕层、转场和批量生成草稿',
      integrationMode: 'task_manifest',
      customerValue: '把“脚本到成片草稿”做成 JSON 配方，客户换商品后仍能复用同一套混剪结构。',
      readiness: 'ready_now',
      guardrail: '只生成客户授权素材的短视频草稿；最终导出仍进入 Wenai 质检、队列和人工抽检。',
    },
    {
      id: 'libopenshot',
      name: 'OpenShot / libopenshot',
      repositoryUrl: 'https://github.com/OpenShot/libopenshot',
      useFor: '成熟非编引擎的轨道、转场、关键帧、特效和导出范式参考',
      integrationMode: 'task_manifest',
      customerValue: '吸收传统剪辑软件的稳定时间线结构，但在 Wenai 里只暴露电商人能理解的任务流。',
      readiness: 'later',
      guardrail: '先作为时间线和转场能力参考，不把复杂剪辑器 UI 直接搬给客户。',
    },
    {
      id: 'mcp-video',
      name: 'MCP Video / AI video tool pattern',
      repositoryUrl: 'https://github.com/KyaniteLabs/mcp-video',
      useFor: '把裁切、拼接、字幕、转码、封面等视频操作包装成可编排工具调用',
      integrationMode: 'task_manifest',
      customerValue: '让混剪步骤更像稳定工单：每一步有输入、工具、输出和失败原因，而不是让客户猜 AI 在做什么。',
      readiness: 'ready_now',
      guardrail: '只调度本地或授权 worker，不请求客户平台账号、cookie 或自动登录权限。',
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
      id: 'auto-editor',
      name: 'Auto-Editor',
      repositoryUrl: 'https://github.com/WyattBlue/auto-editor',
      useFor: '自动去静音、删停顿、按音量和动静变化生成粗剪建议',
      integrationMode: 'local_worker',
      customerValue: '客户给口播、直播回放或测评长素材时，先剪掉无效停顿，再进入电商卖点模板。',
      readiness: 'ready_now',
      guardrail: '只输出粗剪建议和可复核片段，不直接发布，不剪掉商品承诺或售后限制。',
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
      id: 'mediainfo',
      name: 'MediaInfo',
      repositoryUrl: 'https://github.com/MediaArea/MediaInfo',
      useFor: '读取视频编码、分辨率、帧率、时长、音轨和码率，作为渲染前后的质量证据',
      integrationMode: 'local_worker',
      customerValue: '每条成片都有可检查的媒体参数，减少上传平台后才发现格式不对。',
      readiness: 'ready_now',
      guardrail: '只读取媒体技术信息，不读取客户账号、联系人或平台后台数据。',
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
    {
      id: 'gstreamer',
      name: 'GStreamer',
      repositoryUrl: 'https://github.com/GStreamer/gstreamer',
      useFor: '后续把转码、合成、预览和长任务拆成可监控的媒体管线',
      integrationMode: 'local_worker',
      customerValue: '当单机 FFmpeg 批处理不够稳时，把大规模任务升级成更细的媒体流水线。',
      readiness: 'later',
      guardrail: '只在大批量和工程化需求出现后接入；首版不增加客户操作复杂度。',
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
      id: 'recipe-dead-air-cut',
      adapterId: 'auto-editor',
      title: '长口播去停顿粗剪',
      inputFiles: ['客户授权口播视频', '直播回放切片', `${packageRoot}/clip-candidates.json`],
      operatorSteps: [
        '按静音、停顿和低运动片段生成粗剪候选',
        '保留被删除片段的时间戳，方便人工追回商品承诺',
        '把有效片段写回模板编排候选池',
      ],
      outputFiles: [`${packageRoot}/dead-air-cut.json`, `${packageRoot}/shortlisted-clips`],
      passCriteria: ['每个候选片段有原始时间戳', '商品承诺和价格信息不自动删除', '人工抽检后才进入最终成片'],
      fallbackWhenUnavailable: '没有自动粗剪 worker 时，按 15-30 秒人工片段清单进入模板编排。',
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
    {
      id: 'recipe-media-probe',
      adapterId: 'mediainfo',
      title: '成片参数和上传前验收',
      inputFiles: plan.ffmpegCommands.map(command => command.output),
      operatorSteps: [
        '读取每条成片的编码、分辨率、帧率、音轨和时长',
        '对照平台尺寸和文件要求生成上传前检查',
        '把不合格文件退回单条重渲染，不影响已合格成片',
      ],
      outputFiles: [`${packageRoot}/media-probe-report.json`, `${packageRoot}/upload-ready-checklist.md`],
      passCriteria: ['编码、尺寸、时长和音轨有记录', '不合格文件有单条返工原因', '客户拿到上传前检查表'],
      fallbackWhenUnavailable: '没有媒体探测 worker 时，人工抽检成片属性和平台上传结果。',
    },
  ];
}

export function buildCommerceOpenSourceCoverage(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  adapters = buildCommerceOpenSourceAdapters(),
): CommerceOpenSourceCoverage {
  const adapterIds = new Set(adapters.map(adapter => adapter.id));
  const availableIds = (ids: string[]) => ids.filter(id => adapterIds.has(id));
  const readyNowCount = adapters.filter(adapter => adapter.readiness === 'ready_now').length;
  const packageRoot = `exports/commerce-remix-${slugify(input.productName)}`;
  return {
    headline: '开源混剪能力地图：把 GitHub 能力收束成 5 层电商出片系统',
    summary: `当前纳入 ${adapters.length} 个开源适配器，其中 ${readyNowCount} 个可先按本地 worker 或任务清单交付；图片、视频、数字人 Key 只增强生成层，不阻塞混剪交付。`,
    readyNowCount,
    totalAdapterCount: adapters.length,
    layers: [
      {
        id: 'source-ready',
        label: '素材先变干净',
        customerProblem: '客户给的图片、长视频、口播和直播切片格式不统一，直接剪会失败。',
        primaryAdapterIds: availableIds(['imagemagick-libheif', 'mediainfo', 'lossless-cut', 'ffmpeg']),
        backupAdapterIds: availableIds(['moviepy', 'mcp-video']),
        runNow: '标准化格式、抽取片段、记录媒体参数，缺素材进入补拍或生图任务。',
        outputProof: `${packageRoot}/normalized-assets.json + media-probe-report.json`,
        scaleRule: '素材超过 50 个时先分批入库，每批只放可授权、可追溯素材进队列。',
      },
      {
        id: 'clip-ready',
        label: '长素材自动找片段',
        customerProblem: '客户不想手工翻长视频，也不知道哪几秒能证明卖点。',
        primaryAdapterIds: availableIds(['pyscenedetect', 'auto-editor', 'whisper', 'subtitle-edit']),
        backupAdapterIds: availableIds(['lossless-cut', 'mcp-video']),
        runNow: '按场景变化、停顿、口播字幕和时间戳生成候选片段，低置信度只进复核池。',
        outputProof: `${packageRoot}/clip-candidates.json + caption-review.md`,
        scaleRule: '每条候选片段保留原始时间戳，人工抽检通过后才进入模板编排。',
      },
      {
        id: 'template-ready',
        label: '脚本变成可复用模板',
        customerProblem: '同一个商品要发多个平台和多个人设，不能每条都重新剪。',
        primaryAdapterIds: availableIds(['remotion', 'opentimelineio', 'editly', 'mlt-shotcut']),
        backupAdapterIds: availableIds(['libopenshot', 'moviepy']),
        runNow: '把卖点、模特证明、客服异议和 CTA 固化成时间线模板与发布包。',
        outputProof: `${packageRoot}/timeline.json + template-composition.json`,
        scaleRule: `按 ${unique(input.platforms).length} 个平台和 ${plan.publishingPacks.length} 个发布包复制变体，不复制复杂剪辑器 UI。`,
      },
      {
        id: 'render-ready',
        label: '批量渲染不互相拖垮',
        customerProblem: '一批几十条视频里，只要一条失败就会拖慢交付。',
        primaryAdapterIds: availableIds(['queue-worker', 'ffmpeg', 'mediainfo']),
        backupAdapterIds: availableIds(['gpac-packager', 'gstreamer', 'moviepy']),
        runNow: '按平台和尺寸拆任务、限并发、单条失败重试、成功文件写回输出目录。',
        outputProof: `${packageRoot}/render-log.json + upload-ready-checklist.md`,
        scaleRule: '首版并发保守；单客户每批超过 100 条或多人审核时再接对象存储和分布式 worker。',
      },
      {
        id: 'return-ready',
        label: '发布后回填再重剪',
        customerProblem: '平台表现暂时难自动读取，但客户需要下一轮优化建议。',
        primaryAdapterIds: availableIds(['subtitle-edit', 'opencv-mediapipe', 'mediainfo']),
        backupAdapterIds: availableIds(['ffmpeg', 'imagemagick-libheif']),
        runNow: '客户上传链接、截图、CSV 或云盘目录后，生成下一轮标题、封面和重剪任务。',
        outputProof: `${packageRoot}/04-customer-return + 05-next-round`,
        scaleRule: '没有真实回填不展示虚构播放量、订单或转化；有 API 授权后再接自动 analytics。',
      },
    ],
    installOrder: [
      '第一优先：FFmpeg、MediaInfo、ImageMagick、LosslessCut 范式，先保证素材和成片可检查。',
      '第二优先：PySceneDetect、Auto-Editor、Whisper、Subtitle Edit，解决长素材切片和字幕复核。',
      '第三优先：Remotion、OpenTimelineIO、Editly、MLT 范式，沉淀电商模板和跨工具时间线。',
      '第四优先：队列 worker、GPAC、GStreamer，在大规模渲染和云端扩容时再加重工程化。',
    ],
    customerPromise: '客户看到的是“给素材 -> 出多平台成片包 -> 自己发布 -> 回填复盘”，不是一堆开源项目名。',
    limits: [
      '只处理客户上传或明确授权素材。',
      '不自动登录平台账号，不保存客户 cookie。',
      '不自动读取后台表现，先走链接、截图、CSV 或云盘回填。',
      'AI 生图、AI 视频和数字人口播等你提供 Key 后接入生成层。',
    ],
  };
}

export function buildCommerceOpenSourceStackSelector(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  adapters = buildCommerceOpenSourceAdapters(),
): CommerceOpenSourceStackSelector {
  const adapterIds = new Set(adapters.map(adapter => adapter.id));
  const availableIds = (ids: string[]) => ids.filter(id => adapterIds.has(id));
  const packageRoot = `exports/commerce-remix-${slugify(input.productName)}`;
  const platformCount = unique(input.platforms).length;
  const outputCount = plan.publishingPacks.reduce((sum, pack) => sum + pack.accountVariants.length, 0);

  return {
    headline: '开源混剪栈选择器：客户给什么素材，就走对应的稳定出片路线',
    customerPromise: `Wenai 先把 ${input.productName} 的素材拆成可检查、可复核、可批量渲染的任务包；${platformCount} 个平台和 ${outputCount} 个账号角度都不需要客户理解 GitHub 工具名。`,
    defaultStack: availableIds([
      'mediainfo',
      'imagemagick-libheif',
      'lossless-cut',
      'pyscenedetect',
      'auto-editor',
      'subtitle-edit',
      'remotion',
      'opentimelineio',
      'ffmpeg',
      'queue-worker',
    ]),
    decisions: [
      {
        id: 'normalize-first',
        customerSituation: '客户给的是主图、模特图、长视频、口播音频和直播切片混在一起',
        useWhen: '素材格式、尺寸、帧率、音轨或授权状态不统一时先走这一层',
        defaultAdapterIds: availableIds(['mediainfo', 'imagemagick-libheif', 'ffmpeg']),
        backupAdapterIds: availableIds(['moviepy', 'mcp-video']),
        operatorRule: '先读媒体参数和授权标记，再标准化图片与视频；缺素材只进补拍或生图任务，不进入渲染队列。',
        customerOutput: `${packageRoot}/normalized-assets.json + material-gaps.json`,
        stabilityCheck: '每个素材有来源、用途、尺寸、时长和授权状态，不能把来源不明素材带进成片。',
      },
      {
        id: 'long-material-slicing',
        customerSituation: '客户只给了长视频、测评、直播回放或工厂素材',
        useWhen: '需要从长素材里先找可证明卖点的短片段，而不是直接套模板',
        defaultAdapterIds: availableIds(['lossless-cut', 'pyscenedetect', 'auto-editor']),
        backupAdapterIds: availableIds(['ffmpeg', 'mcp-video']),
        operatorRule: '无损抽段优先；场景变化和停顿检测只生成候选片段，低置信度片段进入人工复核池。',
        customerOutput: `${packageRoot}/clip-candidates.json + shortlisted-clips`,
        stabilityCheck: '每段候选必须保留原始时间戳，商品承诺、价格和售后限制不能被自动剪掉。',
      },
      {
        id: 'speech-subtitle',
        customerSituation: '客户给了口播、达人讲解、直播语音或数字人口播脚本',
        useWhen: '要把声音变成标题、字幕、卖点切句和口播复用资产',
        defaultAdapterIds: availableIds(['whisper', 'subtitle-edit']),
        backupAdapterIds: availableIds(['auto-editor', 'ffmpeg']),
        operatorRule: '转写只做底稿；价格、功效、售后承诺和敏感词必须进入人工校对清单。',
        customerOutput: `${packageRoot}/subtitles.srt + caption-review.md`,
        stabilityCheck: '字幕可复核、可回退，不能因为识别错误直接生成最终发布稿。',
      },
      {
        id: 'template-composition',
        customerSituation: '同一个商品要做多平台、多账号、多标题和多口播角度',
        useWhen: '素材已经干净，需要把卖点、模特证明、客服异议和 CTA 编排成模板',
        defaultAdapterIds: availableIds(['remotion', 'opentimelineio', 'editly']),
        backupAdapterIds: availableIds(['mlt-shotcut', 'libopenshot', 'moviepy']),
        operatorRule: '把客户能理解的商品增长流程固化成时间线，不把复杂剪辑器 UI 暴露给客户。',
        customerOutput: `${packageRoot}/timeline.json + template-composition.json`,
        stabilityCheck: '每条成片都有平台尺寸、安全区、字幕轨、封面和发布标题，不允许模板缺字段进入渲染。',
      },
      {
        id: 'stable-render',
        customerSituation: '需要一次性导出几十条不同平台和账号人设的成片',
        useWhen: '输出规模超过人工逐条导出，或任何单条失败不能拖垮整批交付',
        defaultAdapterIds: availableIds(['queue-worker', 'ffmpeg', 'mediainfo']),
        backupAdapterIds: availableIds(['gpac-packager', 'gstreamer']),
        operatorRule: '按平台、尺寸和账号角度拆任务；单条失败只重跑单条，成功文件立即写入发布包。',
        customerOutput: `${packageRoot}/render-log.json + upload-ready-checklist.md`,
        stabilityCheck: '成片必须可播放、参数可读、日志可追溯；失败项必须有 blocked reason 和重试次数。',
      },
      {
        id: 'return-loop',
        customerSituation: '客户自己发布后，把链接、截图、CSV 或云盘目录回传',
        useWhen: '暂时没有平台后台 API 授权，但需要做下一轮标题、封面和混剪优化',
        defaultAdapterIds: availableIds(['mediainfo', 'subtitle-edit', 'opencv-mediapipe']),
        backupAdapterIds: availableIds(['ffmpeg', 'imagemagick-libheif']),
        operatorRule: '只分析客户回传的证据，不伪造播放量、订单和转化；有 API 授权后再升级自动读取。',
        customerOutput: `${packageRoot}/04-customer-return + 05-next-round`,
        stabilityCheck: '没有真实回填就不展示虚构表现；下一轮优化必须能追溯到客户证据。',
      },
    ],
    scaleUpRules: [
      '单客户单批低于 30 条，默认 FFmpeg + 本地队列，先追求可复核和交付稳定。',
      '单批 30-100 条，启用保守并发、单条重试、MediaInfo 参数验收和云盘发布包。',
      '单批超过 100 条或多人同时审核，再升级对象存储、分布式 worker、GPAC 封装检查和 GStreamer 管线。',
      '生成图片、生成视频、数字人和 TTS Key 到位后只进入素材生产层，不改变客户自发布和回填复盘边界。',
    ],
    doNotUseFor: [
      '不下载或处理客户未授权素材。',
      '不保存客户平台账号、密码、cookie 或后台 token。',
      '不代替客户自动登录、自动发布或绕过平台发布流程。',
      '不把开源项目名堆给客户，客户只看到素材、成片、发布包和复盘任务。',
    ],
  };
}

export function buildCommerceOpenSourceInstallMatrix(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  adapters = buildCommerceOpenSourceAdapters(),
): CommerceOpenSourceInstallMatrix {
  const adapterIds = new Set(adapters.map(adapter => adapter.id));
  const availableIds = (ids: string[]) => ids.filter(id => adapterIds.has(id));
  const packageRoot = `exports/commerce-remix-${slugify(input.productName)}`;
  const firstQueueId = plan.queue[0]?.id || `${slugify(input.productName)}-demo-render`;

  return {
    headline: '开源混剪安装和冒烟验收矩阵',
    promise: '每个开源工具只在通过本地检查、样例任务和输出证据后进入客户交付链路；没通过就走降级路径，不让客户看到半成品。',
    minimumLocalStack: availableIds([
      'mediainfo',
      'imagemagick-libheif',
      'lossless-cut',
      'pyscenedetect',
      'auto-editor',
      'remotion',
      'opentimelineio',
      'editly',
      'ffmpeg',
      'queue-worker',
    ]),
    lanes: [
      {
        id: 'asset-normalize-smoke',
        customerLabel: '素材先变成可剪格式',
        adapterIds: availableIds(['mediainfo', 'imagemagick-libheif', 'ffmpeg']),
        installCheck: '读取一张商品图和一段视频的格式、尺寸、时长、帧率和音轨。',
        smokeTest: '把 HEIF/WEBP/PNG 标准化成封面图，把一段视频转成平台可上传 MP4。',
        outputProof: `${packageRoot}/upload-ready-checklist.md`,
        fallback: '格式识别失败时，先生成客户补素材清单，不进入批量渲染。',
      },
      {
        id: 'clip-mining-smoke',
        customerLabel: '长素材自动切成可用片段',
        adapterIds: availableIds(['lossless-cut', 'pyscenedetect', 'auto-editor']),
        installCheck: '确认能读取长视频、识别场景切点、保留原始时间戳。',
        smokeTest: '从 60 秒测试素材导出 3 个候选片段，并标注静音、场景变化和人工复核点。',
        outputProof: `${packageRoot}/clip-candidates.json`,
        fallback: '自动切点不稳定时，退回人工标记片段，不影响模板和发布包生成。',
      },
      {
        id: 'caption-smoke',
        customerLabel: '口播和字幕可复核',
        adapterIds: availableIds(['whisper', 'subtitle-edit', 'auto-editor']),
        installCheck: '确认能生成 SRT/ASS 字幕底稿，并保留原音频引用。',
        smokeTest: '用 15 秒口播生成字幕，检查商品名、价格、售后承诺和敏感词。',
        outputProof: `${packageRoot}/subtitles.srt`,
        fallback: '语音识别不可用时，使用脚本文案生成字幕底稿并标记人工校对。',
      },
      {
        id: 'template-compose-smoke',
        customerLabel: '脚本变成电商视频结构',
        adapterIds: availableIds(['remotion', 'opentimelineio', 'editly', 'moviepy']),
        installCheck: '确认时间线 JSON、模板参数、素材引用和发布包标题能互相对应。',
        smokeTest: `用 ${plan.publishingPacks.length} 个平台发布包生成一条模板草稿任务。`,
        outputProof: `${packageRoot}/timeline.json`,
        fallback: '模板渲染不可用时，保留时间线、字幕、封面和 FFmpeg 命令清单。',
      },
      {
        id: 'render-queue-smoke',
        customerLabel: '批量渲染失败不拖垮整批',
        adapterIds: availableIds(['queue-worker', 'ffmpeg', 'mediainfo']),
        installCheck: '确认队列能限制并发、记录 attempt、区分缺素材和可重试失败。',
        smokeTest: `让 ${firstQueueId} 故意失败一次，确认只重试单条任务并保留失败原因。`,
        outputProof: `${packageRoot}/render-report.json`,
        fallback: '队列不可用时，导出单条渲染命令和人工执行顺序，不阻塞发布包。',
      },
      {
        id: 'qa-return-smoke',
        customerLabel: '成片和客户回传能进入下一轮',
        adapterIds: availableIds(['mediainfo', 'opencv-mediapipe', 'subtitle-edit']),
        installCheck: '检查 MP4 是否可播放、字幕不遮挡商品、客户回传 CSV 是否有标题列。',
        smokeTest: '抽检桌面和移动预览，确认无横向溢出、无空视频、无缺失标题。',
        outputProof: `${packageRoot}/05-next-round/review.md`,
        fallback: '质检不通过时，只交付问题清单和补素材任务，不标记为可发布。',
      },
    ],
    readyDefinition: [
      '最小本地栈能完成素材标准化、片段切分、模板编排、队列渲染和媒体质检。',
      '每条渲染任务都有输入、输出、attempt、失败原因和下一步动作。',
      '客户看到的是发布包、成片、标题矩阵、客服话术和回填清单，不需要理解 GitHub 工具名。',
      '没有图片/视频/数字人 Key 时，仍可导出 prompt、时间线、混剪任务和发布包。',
    ],
    scaleLaterStack: availableIds(['gstreamer', 'gpac-packager', 'libopenshot', 'mcp-video']),
    providerBoundary: [
      '不把平台自动登录当作开源混剪能力。',
      '不保存客户平台账号、密码、cookie 或后台 token。',
      '不自动下载来源不明素材。',
      '不把未通过 smoke test 的工具展示为可交付能力。',
    ],
  };
}

export function buildCommerceRemixOrchestrationBoard(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  adapters = buildCommerceOpenSourceAdapters(),
): CommerceRemixOrchestrationBoard {
  const adapterIds = new Set(adapters.map(adapter => adapter.id));
  const availableIds = (ids: string[]) => ids.filter(id => adapterIds.has(id));
  const packageRoot = `exports/commerce-remix-${slugify(input.productName)}`;
  const platformCount = unique(input.platforms).length;
  return {
    promise: '把开源混剪能力收束成一条电商内容流水线：客户给商品和授权素材，Wenai 生成可发布成片、标题矩阵、发布包和复盘入口。',
    routes: [
      {
        id: 'material-normalize',
        phase: '素材整理',
        customerLabel: '先把客户给的图、视频、口播整理成可混剪素材架',
        primaryAdapterIds: availableIds(['imagemagick-libheif', 'lossless-cut', 'ffmpeg']),
        backupAdapterIds: availableIds(['moviepy', 'mcp-video']),
        input: `${input.assets.length} 个商品/模特/场景/口播素材`,
        decisionRule: '格式不统一先标准化；长素材先无损抽段；缺素材则进入模特生图或客户补素材任务。',
        outputs: [`${packageRoot}/01-source-assets`, `${packageRoot}/normalized-assets.json`, `${packageRoot}/material-gaps.json`],
        stabilityChecks: ['素材必须有授权标记', '格式转换不改写商品事实', '缺素材任务不进入渲染队列'],
      },
      {
        id: 'clip-mining',
        phase: '片段挖掘',
        customerLabel: '从长素材里自动找能证明卖点的短片段',
        primaryAdapterIds: availableIds(['pyscenedetect', 'auto-editor', 'whisper', 'subtitle-edit']),
        backupAdapterIds: availableIds(['lossless-cut', 'mcp-video']),
        input: '客户上传的长视频、口播音频、直播切片或测评素材',
        decisionRule: '有口播先转写分句；有长视频先按场景切点；低置信度片段只进候选，不直接出片。',
        outputs: [`${packageRoot}/clip-candidates.json`, `${packageRoot}/subtitles.srt`, `${packageRoot}/caption-review.md`],
        stabilityChecks: ['口播错字需人工复核', '切点建议保留时间戳', '只处理客户授权视频'],
      },
      {
        id: 'template-compose',
        phase: '模板编排',
        customerLabel: '把卖点、模特图、片段和标题排成平台可发的视频结构',
        primaryAdapterIds: availableIds(['remotion', 'opentimelineio', 'editly']),
        backupAdapterIds: availableIds(['mlt-shotcut', 'libopenshot']),
        input: `${plan.timeline.clips.length} 个时间线片段和 ${platformCount} 个平台发布方向`,
        decisionRule: '平台决定尺寸和节奏；卖点决定镜头顺序；账号人设决定开头和标题，不让客户看到复杂剪辑器。',
        outputs: [`${packageRoot}/timeline.json`, `${packageRoot}/template-composition.json`, `${packageRoot}/publishing-packs.json`],
        stabilityChecks: ['每条视频有平台、尺寸、CTA', '字幕安全区明确', '标题矩阵和画面证明互相对应'],
      },
      {
        id: 'render-export',
        phase: '稳定渲染',
        customerLabel: '大批量渲染时，失败单条隔离，不拖垮整批交付',
        primaryAdapterIds: availableIds(['queue-worker', 'ffmpeg', 'mcp-video']),
        backupAdapterIds: availableIds(['moviepy', 'gpac-packager', 'gstreamer']),
        input: `${plan.queue.length} 个平台/尺寸渲染任务`,
        decisionRule: '按平台和尺寸拆任务；并发受控；失败最多重试后进入人工检查；成功文件写回云盘结构。',
        outputs: plan.ffmpegCommands.map(command => command.output),
        stabilityChecks: ['单条失败不回滚已导出文件', '每条输出有日志和重试次数', 'MP4 可播放且音量标准化'],
      },
      {
        id: 'qa-return-loop',
        phase: '质检复盘',
        customerLabel: '交付前做成片质检，发布后让客户回填数据进入下一轮优化',
        primaryAdapterIds: availableIds(['opencv-mediapipe', 'subtitle-edit', 'mediainfo', 'gpac-packager']),
        backupAdapterIds: availableIds(['ffmpeg', 'imagemagick-libheif']),
        input: '成片、封面、字幕、发布链接、截图和表现 CSV',
        decisionRule: '质检不过不交付；平台数据先不自动读取，客户上传证据后生成下一轮标题和重剪任务。',
        outputs: [`${packageRoot}/quality-report.json`, `${packageRoot}/04-customer-return`, `${packageRoot}/05-next-round`],
        stabilityChecks: ['字幕不压商品主体', '封面裁切不丢核心卖点', '回填缺证据时先补证据再复盘'],
      },
    ],
    fallbackOrder: [
      '优先走本地 FFmpeg / Remotion / 队列 worker，保证首版不用等外部 provider。',
      '遇到复杂转写、视觉检测或封装，再接 Whisper、OpenCV、GPAC 等局部 worker。',
      '图片、视频、数字人模型能力等你给 Key 后接入；没有 Key 时输出任务包和 prompt。',
      '平台发布和账号登录不接管，客户自发；只交付标题、脚本、成片、封面和回填入口。',
    ],
    customerVisibleOutputs: [
      '成片文件和封面',
      '每个平台的标题/文案/标签/发布清单',
      '账号人设和口播脚本矩阵',
      '云盘交付结构和客户回填表',
      '下一轮重剪任务和客服话术补充',
    ],
    notProviderBlockers: [
      '平台自动登录不是首版 blocker',
      '自动读取平台后台数据不是首版 blocker',
      '图片/视频/数字人 Key 未配置时仍可生成任务包',
      '大规模渲染先走本地批次和失败隔离，后续再扩 worker',
    ],
  };
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

export function buildCommerceSuperIpTitleBoard(
  input: CommerceRemixPlanInput,
  creatorPersonaMatrix = buildCommerceCreatorPersonaMatrix(input),
): CommerceSuperIpTitleBoard {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const secondaryPoint = safeText(input.sellingPoints[1] || input.sellingPoints[0] || '', '使用场景');
  const audience = safeText(input.audience, '目标用户');
  const allPersonas = creatorPersonaMatrix.flatMap(plan => plan.personas.map(persona => ({
    ...persona,
    platformLabel: PLATFORM_LABELS[plan.platform],
  })));
  const buyerPersona = allPersonas.find(persona => persona.accountType === '真实买家号') || allPersonas[0];
  const reviewPersona = allPersonas.find(persona => persona.accountType === '测评种草号') || allPersonas[1] || buyerPersona;
  const officialPersona = allPersonas.find(persona => persona.accountType === '店铺官方号') || allPersonas[2] || buyerPersona;

  return {
    headline: '超级 IP 标题和口播作战板',
    promise: '同一个商品不再重复发同一条内容，而是按真实买家、测评种草、店铺官方三种账号人格生成标题、开场、口播和证据素材。',
    titleFamilies: [
      {
        id: 'buyer-pain-scene',
        label: '真实买家：痛点场景',
        bestFor: `${audience}第一次看到${product}时的种草内容`,
        titleFormula: buyerPersona?.titleFormulas[0] || `${audience}先看这个${product}场景`,
        openingLine: buyerPersona?.openingLines[0] || `先说真实感受：${point}这个问题，我会先看这个场景。`,
        voiceoverBeats: ['先讲一个具体使用场景', `再展示${point}怎么被解决`, '最后提醒适合谁和不适合谁'],
        evidenceRequired: ['真实使用图', '手持或开箱图', '评论区追问截图'],
        platformFit: unique(allPersonas.filter(persona => persona.accountType === '真实买家号').map(persona => persona.platformLabel)),
        customerAction: '客户复制标题和前三句口播，上传真实使用素材后自行发布。',
        remixCue: '如果收藏高但点击低，下一轮保留口播结构，重剪封面和前三秒画面。',
      },
      {
        id: 'review-proof',
        label: '测评种草：证据对比',
        bestFor: `需要解释${point}是否真实有效的内容`,
        titleFormula: reviewPersona?.titleFormulas[1] || `${point}到底有没有用？`,
        openingLine: reviewPersona?.openingLines[1] || `别先看价格，先看它有没有把${point}讲清楚。`,
        voiceoverBeats: ['先提出一个判断问题', '展示细节、规格或前后对比', '说清楚限制和适合人群'],
        evidenceRequired: ['对比图', '细节图', '规格或材质证明'],
        platformFit: unique(allPersonas.filter(persona => persona.accountType === '测评种草号').map(persona => persona.platformLabel)),
        customerAction: '客户复制测评标题，上传对比图或细节证明，发布后回填互动截图。',
        remixCue: '如果评论追问规格，下一轮把规格解释变成单独的 FAQ 短视频。',
      },
      {
        id: 'official-service',
        label: '店铺官方：承接转化',
        bestFor: '客户已经有兴趣，需要商品页、客服和售后承接时',
        titleFormula: officialPersona?.titleFormulas[2] || `为什么客户选择${product}`,
        openingLine: officialPersona?.openingLines[2] || `如果你是${audience}，这条可以直接照着选。`,
        voiceoverBeats: ['先说明适用人群', `再讲${secondaryPoint}和售后边界`, '最后引导到商品页或客服咨询'],
        evidenceRequired: ['商品主图', 'FAQ 卡片', '售后承诺截图'],
        platformFit: unique(allPersonas.filter(persona => persona.accountType === '店铺官方号').map(persona => persona.platformLabel)),
        customerAction: '客户用店铺官方号发布，标题和 FAQ 同步到商品页或客服快捷回复。',
        remixCue: '如果咨询多但订单少，下一轮补价格、规格、售后承诺和客服异议处理素材。',
      },
    ],
    operatingRules: [
      '每个平台先发三种人格各一条，不重复发布同一个标题。',
      '口播、字幕和混剪时间线使用同一份脚本来源，方便后续接数字人 Key。',
      '客户自己登录平台发布；Wenai 只交付标题、口播、素材提示和回填字段。',
      '没有真实回填前，不判断某个 IP 人设已经跑赢。',
    ],
    returnLoop: [
      '回填标题截图后，判断哪个标题公式继续放大。',
      '回填评论截图后，把高频问题转成下一条口播开场。',
      '回填 CSV 后，用点击、收藏、咨询、订单判断下一轮重剪方向。',
      '表现弱的账号人设不删除，先换封面、前三秒和证据素材再测一次。',
    ],
  };
}

export function buildCommerceTitleQualityGate(
  input: CommerceRemixPlanInput,
  titleBoard = buildCommerceSuperIpTitleBoard(input),
  publishingMatrix = buildCommercePublishingMatrixPlan(input),
): CommerceTitleQualityGate {
  const platforms = unique(publishingMatrix.map(plan => plan.platform));
  const allTitles = publishingMatrix.flatMap(plan => plan.accountAngles.map(angle => angle.title));
  const repeatedTitleCount = allTitles.length - unique(allTitles).length;

  return {
    headline: '标题和口播发布前验收门',
    promise: '多账号矩阵不是把标题堆满，而是每个平台、每个人设都要有证据、边界和回填字段；不合格标题先改，不交给客户发布。',
    gateStatus: repeatedTitleCount === 0 ? 'ready_to_publish_pack' : 'needs_copy_review',
    checks: [
      {
        label: '同商品不重复标题',
        passRule: `首轮 ${allTitles.length} 个标题不能互相复制，要覆盖痛点、测评和官方承接。`,
        failAction: '重复标题进入改写池，先换开头、证据素材和账号人格。',
      },
      {
        label: '标题能对应画面证据',
        passRule: titleBoard.titleFamilies.map(family => `${family.label} 需要 ${family.evidenceRequired[0]}`).join('；'),
        failAction: '缺证据时不发布，转成模特图、细节图、对比图或 FAQ 卡片任务。',
      },
      {
        label: '口播前三句能照读',
        passRule: '每条口播先讲场景或判断问题，再讲商品证据，最后讲适合/不适合谁。',
        failAction: '如果前三句像内部术语或参数堆叠，改成客户场景语言。',
      },
      {
        label: '不越过发布边界',
        passRule: '发布包只给标题、正文、素材、发布时间和回填字段，不索要账号、密码、cookie。',
        failAction: '任何需要自动登录或后台 token 的标题动作都改成客户自发布步骤。',
      },
    ],
    platformGuides: platforms.map(platform => ({
      platform,
      platformLabel: PLATFORM_LABELS[platform],
      firstLineRule: platform === 'tiktok'
        ? '前三秒必须是痛点、反问或强画面，不用店铺自夸开头。'
        : platform === 'xiaohongshu'
          ? '标题先像买家笔记，正文再补参数、限制和适合人群。'
          : platform === 'shopify'
            ? '标题承接搜索和商品页，首屏说清卖点、规格和购买理由。'
            : platform === 'wechat_video'
              ? '口播第一句先讲人群和场景，再导向评论或私域咨询。'
              : '广告标题先讲结果和证据，正文再承接落地页或询盘。',
      proofNeeded: platform === 'shopify'
        ? ['商品页截图', '详情页模块', 'FAQ']
        : platform === 'meta'
          ? ['封面图', '落地页链接', '素材尺寸']
          : ['发布截图', '封面截图', '评论或互动截图'],
      avoid: [
        '绝对化功效',
        '虚构销量或订单',
        '未经授权账号身份',
      ],
    })),
    publishOnlyWhen: [
      '标题、首句、封面提示和证据素材能一一对应。',
      '客户知道自己在哪个平台、哪个账号人设、什么时间发布。',
      '回填字段已经准备好：发布链接、截图、标题截图、表现 CSV 或云盘目录。',
      '客服 FAQ 和售后边界已经同步到发布包。',
    ],
    returnSignals: [
      '标题点击强但订单弱：保留标题，补商品证明图和客服异议解释。',
      '收藏评论强但点击弱：保留口播结构，重做封面和前三秒。',
      '咨询多但转化弱：补价格、规格、售后和 FAQ 素材。',
      '证据不足：不判断胜负，先让客户补链接、截图或 CSV。',
    ],
  };
}

export function buildCommerceSelfPublishingCommandCenter(
  input: CommerceRemixPlanInput,
  publishingMatrix = buildCommercePublishingMatrixPlan(input),
  creatorPersonaMatrix = buildCommerceCreatorPersonaMatrix(input, publishingMatrix),
  cloudReturnPlan = buildCommerceCloudDriveReturnPlan(input),
): CommerceSelfPublishingCommandCenter {
  const personaByKey = new Map(
    creatorPersonaMatrix.flatMap(plan => plan.personas.map(persona => [`${plan.platform}:${persona.accountType}`, persona])),
  );
  const slots = publishingMatrix.flatMap((plan, platformIndex) => plan.accountAngles.slice(0, 3).map((angle, angleIndex) => {
    const persona = personaByKey.get(`${plan.platform}:${angle.accountType}`);
    const slotNumber = platformIndex * 3 + angleIndex + 1;
    return {
      id: `${plan.platform}-slot-${angleIndex + 1}`,
      platform: plan.platform,
      platformLabel: PLATFORM_LABELS[plan.platform],
      accountType: angle.accountType,
      publishWindow: angleIndex === 0 ? '第 1 天首发' : angleIndex === 1 ? '第 2-3 天复测' : '第 4-5 天 FAQ/承接',
      title: persona?.titleFormulas[0] || angle.title,
      firstLine: persona?.openingLines[0] || angle.firstLine,
      assetToUpload: angle.assetHint,
      copyAction: `复制标题、首句和标签，上传第 ${slotNumber} 条成片；客户自己登录 ${PLATFORM_LABELS[plan.platform]} 发布。`,
      evidenceRequired: ['发布链接', '发布截图', '标题截图', ...(plan.platform === 'shopify' ? ['商品页点击或加购 CSV'] : ['播放/阅读/互动截图'])],
      nextReviewMove: persona
        ? `回填 ${persona.returnMetrics.slice(0, 2).join('、')} 后，判断这个${angle.accountType}是否加码或重剪。`
        : '回填链接和截图后，判断标题、封面和账号角度是否继续放大。',
    };
  }));
  return {
    headline: '客户自发布操作台：多账号标题矩阵到回填复盘',
    promise: 'Wenai 不拿客户账号、不自动登录平台；系统交付可复制标题、首句、素材提示、发布时间和回填证据，客户自己发布后进入下一轮复盘。',
    slots,
    customerSteps: [
      '先选主平台和账号人设，复制对应标题、首句、正文和标签。',
      '上传 Wenai 导出的成片、封面或商品图，不改动素材授权边界。',
      '客户自己登录平台发布；Wenai 不保存账号、密码、cookie 或平台后台权限。',
      '发布后把链接、截图、CSV 或云盘目录回填，系统再生成下一轮标题、封面和重剪任务。',
    ],
    evidenceInbox: cloudReturnPlan.intakeFields.map(field => ({
      label: field.label,
      accepted: field.acceptedFormats.join(' / '),
      why: field.required ? '复盘必填证据' : '有则提升判断质量',
    })),
    noLoginRules: [
      '不代客户输入账号密码。',
      '不保存 cookie、验证码、私信或后台会话。',
      '不绕过平台发布流程。',
      '不把未回填的播放、订单或转化写成真实表现。',
    ],
    nextRoundDecisions: [
      '哪个账号人设值得继续发布。',
      '哪个标题公式要改成下一轮主标题。',
      '哪个封面或开头需要重剪。',
      '哪些评论和客服问题要变成下一条内容。',
    ],
  };
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

export function buildCommerceCustomerReturnIntakeBoard(
  report: CommercePerformanceUploadReport,
  returnPlan: CommerceCloudDriveReturnPlan,
): CommerceCustomerReturnIntakeBoard {
  const hasLink = !report.missingEvidence.includes('缺发布链接');
  const hasScreenshot = !report.missingEvidence.includes('缺发布截图');
  const hasCsv = !report.missingEvidence.includes('缺表现 CSV');
  const evidenceCards = returnPlan.intakeFields.map(field => {
    const state = field.label === '发布平台链接'
      ? hasLink
      : field.label === '发布截图'
        ? hasScreenshot
        : field.label === '表现 CSV'
          ? hasCsv
          : true;
    return {
      id: field.label,
      label: field.label,
      required: field.required,
      state: state ? 'received' as const : 'missing' as const,
      operatorAction: state
        ? `已收到，可用于${field.label === '表现 CSV' ? '计算标题表现' : '复核发布证据'}。`
        : `请客户补交${field.label}，格式：${field.acceptedFormats.join(' / ')}。`,
    };
  });
  const missingRequired = evidenceCards.filter(card => card.required && card.state === 'missing');
  return {
    status: missingRequired.length === 0 ? 'ready_for_review' : 'needs_evidence',
    evidenceCards,
    reviewQueue: [
      ...returnPlan.reviewSignals,
      ...report.nextRoundAdvice,
    ],
    nextOwnerActions: missingRequired.length > 0
      ? missingRequired.map(card => `运营提醒客户补交：${card.label}`)
      : [
          '运营确认最佳标题和封面是否可复制',
          '内容侧生成下一轮标题矩阵和重剪任务',
          '客服侧补充 FAQ、差评解释和售后话术',
          '交付侧把下一轮动作写回云盘或客户空间',
        ],
  };
}

export function buildCommerceEvidenceReadinessBoard(
  report: CommercePerformanceUploadReport,
  returnPlan: CommerceCloudDriveReturnPlan,
  intakeBoard = buildCommerceCustomerReturnIntakeBoard(report, returnPlan),
): CommerceEvidenceReadinessBoard {
  const checks = intakeBoard.evidenceCards
    .filter(card => card.required)
    .map(card => {
      const label = card.label;
      const state = card.state === 'received' ? 'ready' as const : 'missing' as const;
      return {
        label,
        state,
        whyItMatters: label === '发布平台链接'
          ? '确认作品真实发布，后续才能把表现归因到具体标题和账号人设。'
          : label === '发布截图'
            ? '确认发布时间、封面、标题和后台指标，不靠口头描述判断效果。'
            : '用曝光、点击、互动、订单或收入判断下一轮放大、换标题还是重剪。',
        nextAction: state === 'ready'
          ? `${label}已齐，可以进入复盘。`
          : `请客户补交${label}，再进入标题和素材表现判断。`,
      };
    });
  const ready = checks.every(check => check.state === 'ready');

  return {
    headline: '客户表现证据验收板',
    status: ready ? 'ready_for_review' : 'needs_customer_upload',
    customerInstruction: '客户不用给平台账号，也不用开后台权限；只要把发布链接、截图、表现 CSV 或云盘目录上传，Wenai 就能做下一轮复盘。',
    requiredEvidenceChecks: checks,
    uploadRoutes: [
      '直接粘贴发布链接 URL',
      '上传发布截图或后台表现截图',
      '上传表现 CSV：title, impressions, clicks, orders, revenue',
      '把文件放到 04-customer-return 云盘目录',
    ],
    readyToReviewWhen: [
      '能看到作品链接和发布时间',
      '截图能证明标题、封面或后台指标',
      'CSV 至少包含标题列和一个表现指标',
      '客户备注说明哪些内容想继续放大或停止',
    ],
    blockedWhen: [
      '只有口头反馈，没有链接、截图或 CSV',
      '截图看不到标题、发布时间或指标来源',
      'CSV 没有标题列，无法对应到账号人设和发布包',
      '客户要求系统自动登录平台读取后台，但未提供正式授权路径',
    ],
    nextRoundHandoff: ready
      ? returnPlan.nextRoundOutputs
      : report.missingEvidence.map(item => `先补齐${item.replace('缺', '')}`),
  };
}

export function buildCommerceCustomerEvidenceUploadGuide(
  report: CommercePerformanceUploadReport,
  returnPlan: CommerceCloudDriveReturnPlan,
  intakeBoard = buildCommerceCustomerReturnIntakeBoard(report, returnPlan),
): CommerceCustomerEvidenceUploadGuide {
  const returnFolder = returnPlan.intakeFields.find(field => field.label === '发布截图')?.example.split('/').slice(0, -1).join('/') || '04-customer-return';
  const ready = intakeBoard.status === 'ready_for_review';

  return {
    headline: '客户证据上传指南：客户自己发布，Wenai 用证据做下一轮增长',
    promise: ready
      ? `已收到 ${report.rowCount} 行表现数据，可以开始复盘标题、封面、重剪和客服承接。`
      : '不需要客户交账号、密码或 Cookie；只要补齐链接、截图、CSV 或云盘资料，就能进入复盘。',
    uploadSteps: [
      {
        step: '01',
        title: '客户自己发布',
        customerAction: '客户在小红书、抖音、TikTok、视频号、独立站等平台自己登录并发布。',
        wenaiAction: 'Wenai 只交付标题、封面、成片、口播和发布检查清单，不接管账号。',
      },
      {
        step: '02',
        title: '回传四类证据',
        customerAction: '把发布链接、发布截图、表现 CSV 和补充备注放进回填入口或云盘。',
        wenaiAction: '系统把证据映射到标题、账号人设、平台发布包和素材批次。',
      },
      {
        step: '03',
        title: '先验收再复盘',
        customerAction: '证据不齐时只补缺项，不需要重复上传整包素材。',
        wenaiAction: '证据齐后输出下一轮标题、混剪任务、补图任务和客服话术更新。',
      },
    ],
    acceptedEvidence: [
      {
        label: '发布链接',
        formats: ['URL'],
        destination: '回填表单或 04-customer-return/link.md',
        proves: '作品已经真实发布，可对应到平台和账号人设。',
      },
      {
        label: '发布截图',
        formats: ['PNG', 'JPG', 'WEBP'],
        destination: `${returnFolder}/screenshots`,
        proves: '标题、封面、发布时间或后台指标不是口头反馈。',
      },
      {
        label: '表现 CSV',
        formats: ['CSV'],
        destination: `${returnFolder}/metrics.csv`,
        proves: '曝光、点击、订单或收入能被归因到具体标题和素材。',
      },
      {
        label: '客户备注',
        formats: ['TXT', 'MD', '表单文本'],
        destination: `${returnFolder}/notes.md`,
        proves: '品牌偏好、客服问题和下一轮想放大的方向被记录下来。',
      },
    ],
    reviewReadinessRules: [
      '链接、截图、CSV 三项必填证据齐全时，进入正式复盘。',
      '只有截图但没有 CSV 时，只能做定性判断，不能承诺哪个标题胜出。',
      '只有 CSV 但没有链接或截图时，先要求客户补发布证明。',
      '没有正式平台授权前，不自动登录、不抓后台、不托管客户账号。',
    ],
    nextRoundMapping: [
      {
        evidence: report.bestTitle ? `最佳标题：${report.bestTitle}` : '标题表现未知',
        nextWenaiAction: report.bestTitle ? '复制胜出标题结构，生成下一轮标题和口播矩阵。' : '先补 CSV，再决定是否换标题或重做开场。',
      },
      {
        evidence: report.totalOrders > 0 ? '已有订单信号' : '订单信号不足',
        nextWenaiAction: report.totalOrders > 0 ? '放大同类封面、商品图和混剪节奏。' : '重做前三秒钩子、封面和商品利益点表达。',
      },
      {
        evidence: intakeBoard.reviewQueue.find(item => item.includes('客服')) || '评论、私信、售后问题',
        nextWenaiAction: '更新 FAQ、差评解释、售后转人工规则和客服短视频脚本。',
      },
      {
        evidence: returnPlan.reviewSignals.find(signal => signal.includes('模特图')) || '素材缺口',
        nextWenaiAction: '生成补模特图、细节图、对比图或数字人口播的任务清单。',
      },
    ],
    doNotAskCustomerFor: [
      '不索要平台密码。',
      '不索要 Cookie 或浏览器登录态。',
      '不托管客户账号。',
      '不伪造曝光、点击、订单或评价。',
      '不把平台 analytics API 当作首版交付前置条件。',
    ],
  };
}

export function buildCommercePostPublishActionBoard(
  report: CommercePerformanceUploadReport,
  returnBoard: CommerceCustomerReturnIntakeBoard,
  supportWorkflow: CommerceCustomerSupportWorkflow,
  returnPlan: CommerceCloudDriveReturnPlan,
): CommercePostPublishActionBoard {
  const ready = returnBoard.status === 'ready_for_review';
  const bestTitle = report.bestTitle || '待客户回填表现后再判断';
  const supportActions = [
    supportWorkflow.preSaleReplies[0]?.assetToSend ? `把「${supportWorkflow.preSaleReplies[0].assetToSend}」补进高频售前回复。` : '补一条适合人群 FAQ。',
    supportWorkflow.negativeReviewRecovery[0]?.nextAction || '补差评解释卡。',
    supportWorkflow.afterSaleReplies[0]?.escalation || '明确售后转人工规则。',
  ];
  return {
    headline: '发布后复盘行动板：表现、客服和下一轮重剪放在同一张板',
    status: ready ? 'ready_for_next_round' : 'waiting_for_evidence',
    evidenceSummary: ready
      ? `已收到 ${report.rowCount} 行表现数据，最佳标题是「${bestTitle}」，可以安排下一轮标题、封面和客服动作。`
      : `还缺 ${report.missingEvidence.join(' / ') || '客户回填证据'}，先补证据再做放大判断。`,
    actionLanes: [
      {
        id: 'remix',
        label: '内容重剪',
        trigger: report.totalOrders > 0 ? '已有订单或点击信号' : '订单信号不足或前三秒不够强',
        actions: [
          report.nextRoundAdvice[0],
          report.totalOrders > 0 ? '复制最佳标题的开场结构，换封面和商品细节做第二批。' : '重做前三秒钩子、封面和第一句字幕。',
          '把客户评论里的新问题改成一条客服异议短视频。',
        ],
        owner: '内容运营',
        output: '下一轮标题矩阵 + 重剪任务清单',
      },
      {
        id: 'support',
        label: '客服承接',
        trigger: '评论、私信、售后截图暴露新问题',
        actions: supportActions,
        owner: '客服/售后',
        output: 'FAQ 更新 + 差评解释 + 人工转接规则',
      },
      {
        id: 'asset',
        label: '补素材',
        trigger: returnPlan.reviewSignals.find(signal => signal.includes('补模特图')) || '封面、模特图、细节图或口播证据不足',
        actions: [
          '把表现较好的标题对应到需要补拍的模特图、细节图或对比卡。',
          '图片/视频/数字人 Key 未到位时，先导出 prompt、拍摄清单和人工补图任务。',
          '把补素材结果写回 01-source-assets 和下一轮时间线。',
        ],
        owner: '素材运营',
        output: '补素材任务 + 模特/细节/对比图清单',
      },
      {
        id: 'evidence',
        label: '证据补齐',
        trigger: ready ? '证据齐全，进入复盘归档' : report.missingEvidence.join(' / '),
        actions: ready
          ? ['把发布链接、截图、CSV 归档到 04-customer-return。', '把复盘建议写入 05-next-round。', '保留原始证据，不覆盖成片和素材。']
          : returnBoard.nextOwnerActions,
        owner: '交付运营',
        output: ready ? '复盘归档 + 下一轮动作包' : '客户补证据提醒',
      },
    ],
    reviewScript: [
      `先看最佳标题：${bestTitle}`,
      report.totalOrders > 0 ? '已有订单信号，优先复制结构再换素材。' : '订单不足，先重剪前三秒和封面。',
      '再看客服问题：高频追问进入 FAQ、差评解释和下一条内容。',
      '最后看证据是否完整：没有链接、截图、CSV 不做虚构表现判断。',
    ],
    doNotAutomate: [
      '不自动读取平台后台。',
      '不自动替客户回复评论、私信或售后工单。',
      '不把缺证据的播放、订单或转化写成真实表现。',
      '不跳过人工售后和争议处理。',
    ],
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

export function buildCommerceRenderReliabilityBoard(
  queue: CommerceRemixQueueItem[],
  batchPlan = buildCommerceRenderBatchPlan(queue),
  capacity = buildCommerceRenderCapacityPlan(queue, batchPlan),
): CommerceRenderReliabilityBoard {
  const countByStatus = (status: CommerceRemixQueueItem['status']) => queue.filter(item => item.status === status).length;
  const blockedCount = countByStatus('needs_material') + countByStatus('blocked');
  const shouldScale = queue.length >= 30 || batchPlan.batches.length >= 10;

  return {
    status: shouldScale ? 'scale_review' : blockedCount > 0 ? 'needs_material' : 'ready',
    customerPromise: '每条视频都先变成可追踪任务：素材齐了才渲染，失败只重跑单条，合格成片进入客户自发布包。',
    lanes: [
      {
        id: 'material-gate',
        label: '素材门禁',
        count: countByStatus('needs_material'),
        customerMeaning: '还缺商品图、模特图、授权或音频，先补齐再进渲染。',
        operatorAction: '把缺口写回素材清单和客户回填字段。',
      },
      {
        id: 'ready-queue',
        label: '可渲染队列',
        count: countByStatus('ready'),
        customerMeaning: '这些任务已有素材、模板、尺寸和输出路径，可以进入本地混剪。',
        operatorAction: `按每批 ${batchPlan.maxConcurrency} 条并发执行，保留 attempt 和输出日志。`,
      },
      {
        id: 'retry-lane',
        label: '单条重试',
        count: countByStatus('failed_retryable'),
        customerMeaning: '失败不会拖垮整批，只把该条退回重跑。',
        operatorAction: `每条最多 ${batchPlan.batches[0]?.retryBudget || 2} 次重试，超过后转人工复核。`,
      },
      {
        id: 'exported-pack',
        label: '可交付成片',
        count: countByStatus('exported'),
        customerMeaning: '成片、封面、字幕和发布文案进入客户自发布包。',
        operatorAction: '写入 02-render-outputs 和 03-publishing-packs，等待客户发布后回填表现。',
      },
    ],
    batchControls: [
      `当前 ${queue.length} 条任务拆成 ${batchPlan.batches.length} 个批次`,
      `建议并发 ${capacity.recommendedConcurrency}，预估每小时 ${capacity.estimatedOutputsPerHour} 条输出`,
      '缺素材、blocked 和人工复核任务不占用渲染并发',
      '所有命令以参数数组和 manifest 保存，不拼接 shell 字符串',
    ],
    customerVisibleStatuses: [
      '待补素材：客户只需要补图、补授权或补链接',
      '可渲染：Wenai 正在按任务包生成成片',
      '需复核：只说明要检查素材/字幕/音频，不把底层报错甩给客户',
      '可发布：客户自己登录平台发布并回填链接、截图或 CSV',
    ],
    operatorRules: [
      '首批每个平台至少抽检 1 条成片。',
      '连续失败先降并发，再检查素材编码、字幕长度、音频响度和封面安全区。',
      '已导出的 MP4 不因其他任务失败而回滚。',
      '不自动登录客户平台，不代发，不读取后台表现。',
    ],
    scaleDecision: {
      currentMode: shouldScale ? '建议进入多 worker 评估' : '当前用本地批次和失败隔离即可交付',
      whenToScale: capacity.scaleTriggers,
      notNeededYet: [
        '首版不需要客户平台自动发布权限',
        '首版不需要平台后台自动读数',
        '首版不需要把所有客户素材托管到企业云盘',
      ],
    },
  };
}

export function buildCommerceRenderOperationsRunbook(
  queue: CommerceRemixQueueItem[],
  batchPlan = buildCommerceRenderBatchPlan(queue),
  capacity = buildCommerceRenderCapacityPlan(queue, batchPlan),
  board = buildCommerceRenderReliabilityBoard(queue, batchPlan, capacity),
): CommerceRenderOperationsRunbook {
  const runnableCount = queue.filter(item => item.status === 'ready' || item.status === 'failed_retryable').length;
  const blockedCount = queue.filter(item => item.status === 'needs_material' || item.status === 'blocked').length;
  const exportedCount = queue.filter(item => item.status === 'exported').length;

  return {
    headline: '稳定渲染运行手册：先预检，再分批跑，失败只隔离单条',
    operatingMode: `当前 ${queue.length} 条任务中 ${runnableCount} 条可运行、${blockedCount} 条待补素材、${exportedCount} 条已导出；默认按 ${batchPlan.maxConcurrency} 并发分成 ${Math.max(1, batchPlan.batches.length)} 个批次。`,
    preflightChecks: [
      '素材必须有授权标记、文件路径、尺寸、时长和用途说明。',
      '每条任务必须有平台、尺寸、模板、字幕、安全区和输出路径。',
      'FFmpeg 参数必须保存为数组或 manifest，不拼接 shell 字符串。',
      '缺素材、blocked、待人工复核任务不进入本批渲染。',
      '发布动作只进入客户自发布包，不请求账号、密码、cookie 或平台后台权限。',
    ],
    batchSteps: [
      {
        id: 'material-gate',
        title: '素材门禁',
        action: '先扫描 needs_material 和 blocked 项，把缺图、缺授权、字幕过长、音频响度问题写回任务。',
        proof: 'material-gaps.json、blocked-items.json、客户补素材清单',
        failureFallback: '不渲染该条任务，只让客户补素材或让运营复核。',
      },
      {
        id: 'batch-run',
        title: '按批渲染',
        action: `按每批最多 ${batchPlan.maxConcurrency} 条执行，记录 batch id、queue item id、attempt、输出路径和开始/结束时间。`,
        proof: 'render-log.json、ffmpeg-commands.json、02-render-outputs',
        failureFallback: '单条失败只进入 retry-lane，已成功 MP4 不回滚。',
      },
      {
        id: 'single-retry',
        title: '单条重试',
        action: `同一条最多重试 ${batchPlan.batches[0]?.retryBudget || 2} 次；先降并发，再检查编码、字幕、音频和素材路径。`,
        proof: 'failed-items.json、attempt log、失败原因',
        failureFallback: '超过预算标记 blocked，进入人工复核，不继续占用渲染并发。',
      },
      {
        id: 'quality-sampling',
        title: '抽检验收',
        action: '每个平台至少抽检 1 条，检查可播放、字幕安全区、商品主体、封面和售后承诺。',
        proof: 'upload-ready-checklist.md、media-probe-report.json、人工抽检记录',
        failureFallback: '只返工不合格条目，并把问题写回模板或素材缺口。',
      },
      {
        id: 'publish-pack',
        title: '交付发布包',
        action: '把 MP4、封面、字幕、标题矩阵、发布清单和客户回填字段放进云盘目录。',
        proof: '03-publishing-packs、04-customer-return、客户自发布清单',
        failureFallback: '如果云盘或对象存储未接入，先导出本地 ZIP/目录结构。',
      },
    ],
    escalationMatrix: [
      {
        trigger: '单批超过 30 条或连续两批失败率超过 15%',
        decision: '降低并发，先查素材质量；仍不稳定再进入多 worker 评估。',
        ownerAction: '运营把失败原因归类，技术检查编码、字幕、音频和模板。',
      },
      {
        trigger: '单客户单批超过 100 条或需要多人审核',
        decision: '接对象存储、企业云盘、分布式 worker 和签名下载链接。',
        ownerAction: '先确认客户是否需要长期素材托管，再决定是否接云端队列。',
      },
      {
        trigger: '客户要求平台自动发布或后台表现自动读取',
        decision: '不放进渲染队列；另走授权/API 评估。',
        ownerAction: '继续交付自发布包和回填入口，避免账号托管风险。',
      },
      {
        trigger: board.status === 'needs_material' ? '当前存在待补素材任务' : '当前批次可运行',
        decision: board.scaleDecision.currentMode,
        ownerAction: board.status === 'needs_material' ? '先补素材，再开批次。' : '按运行手册执行并保留日志。',
      },
    ],
    customerHandoff: [
      '客户只看到：待补素材、渲染中、需复核、可发布四类状态。',
      '客户拿到：MP4、封面、字幕、标题/正文/标签、发布清单和回填表。',
      '客户自己登录平台发布，发布后上传链接、截图、CSV 或云盘目录。',
      '没有真实回填证据时，不生成虚构播放、订单或转化判断。',
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

export function buildCommerceSalesConversationBoard(
  input: CommerceRemixPlanInput,
  servicePack = buildCommerceCustomerServicePack(input),
  supportWorkflow = buildCommerceCustomerSupportWorkflow(input, servicePack),
): CommerceSalesConversationBoard {
  const product = safeText(input.productName, '商品');
  const point = safeText(input.sellingPoints[0] || '', '核心卖点');
  const platforms = unique(input.platforms).map(platform => PLATFORM_LABELS[platform]).join(' / ');
  return {
    promise: '把电商对话运营做成一张板：售前问答、商品推荐、发布后追问、售后处理和复购内容都能接住，但不接管客户账号和支付。',
    lanes: [
      {
        id: 'inquiry',
        label: '售前咨询',
        customerTrigger: `客户问 ${product} 是否适合自己，或追问 ${point} 是否真实。`,
        wenaiOutput: [
          servicePack.faq[0]?.answer || `${product} 适合关注 ${point} 的人群。`,
          supportWorkflow.preSaleReplies[0]?.assetToSend || '商品适用人群图 + FAQ',
          '一条可发给客户的短回复和一张证明卡',
        ],
        operatorAction: '客服先发克制版回答，再补商品证明图或详情页 FAQ，不做夸大承诺。',
        proofToCollect: ['客户问题截图', '已发送素材', '是否转人工'],
        nextSystemStep: '沉淀为 FAQ、详情页补充和下一条短视频脚本。',
      },
      {
        id: 'recommendation',
        label: '商品推荐',
        customerTrigger: '客户描述预算、场景、规格或使用对象，需要快速判断推荐话术。',
        wenaiOutput: [
          `围绕 ${point} 生成 3 条推荐理由`,
          '规格/场景/禁用边界说明',
          '可发送的商品卡、对比卡和短视频片段',
        ],
        operatorAction: '只基于客户已给的商品资料推荐，不编造库存、疗效、认证或绝对化表现。',
        proofToCollect: ['客户需求标签', '推荐商品', '客户是否继续询问'],
        nextSystemStep: '把高频推荐问题回填到标题矩阵和商品详情页。',
      },
      {
        id: 'publish_followup',
        label: '发布后追问',
        customerTrigger: `${platforms || '目标平台'} 发布后，客户或评论区追问价格、用法、物流、差异点。`,
        wenaiOutput: [
          '评论区首评和追评话术',
          '短视频/图文二次解释角度',
          '需要补拍或补图的素材清单',
        ],
        operatorAction: '运营把追问整理成下一轮内容选题，客户只需要继续上传链接、截图或 CSV。',
        proofToCollect: ['发布链接', '评论截图', '高频追问'],
        nextSystemStep: '进入客户回填收件箱，生成下一轮重剪任务。',
      },
      {
        id: 'after_sales',
        label: '售后处理',
        customerTrigger: '客户反馈不会用、规格不匹配、物流或售后问题。',
        wenaiOutput: [
          supportWorkflow.afterSaleReplies[0]?.reply || '先确认订单和具体问题，再给使用说明或人工处理路径。',
          '售后卡片和人工转接规则',
          '差评挽回回复草稿',
        ],
        operatorAction: '涉及退款、投诉、平台处罚或安全风险时立即转人工，不让 AI 单独承诺处理结果。',
        proofToCollect: ['订单号或平台工单', '客户截图', '处理结果'],
        nextSystemStep: '更新售后 FAQ、差评解释卡和详情页风险提示。',
      },
      {
        id: 'repurchase',
        label: '复购唤醒',
        customerTrigger: '客户已经购买或互动，需要做复购、搭配、会员或下一轮内容触达。',
        wenaiOutput: [
          '复购提醒文案',
          '搭配商品内容角度',
          '下一轮账号人设和口播标题',
        ],
        operatorAction: '先生成触达内容和素材包，由客户在自己的平台或私域里发布，不自动群发。',
        proofToCollect: ['客户分层标签', '触达渠道', '复购反馈'],
        nextSystemStep: '把复购反馈回流到账号矩阵和发布节奏建议。',
      },
    ],
    inboxFields: [
      { label: '客户问题截图', example: 'chat/inquiry-001.png', required: true },
      { label: '客户所在平台', example: platforms || '小红书 / TikTok / Shopify', required: true },
      { label: '推荐或处理结果', example: '已发 FAQ + 详情页链接，客户继续追问规格', required: true },
      { label: '是否转人工', example: '涉及退款/投诉/平台处罚则转人工', required: true },
      { label: '下一轮内容机会', example: '把规格问题做成 15 秒解释视频', required: false },
    ],
    noAutomationBoundaries: [
      '不自动登录客户平台账号',
      '不自动代客户付款、退款或改订单',
      '不自动群发私信或评论',
      '不承诺平台后台数据自动读取',
    ],
    handoffSummary: [
      '客服看到的是问题、推荐答案、可发送素材和转人工规则。',
      '运营看到的是高频问题、下一轮内容机会和发布后复盘证据。',
      '客户看到的是商品内容、客服话术、发布包和回填入口在同一条电商增长流水线里。',
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

export function buildCommerceWorkbenchSystemMap(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
): CommerceWorkbenchSystemMap {
  const product = safeText(input.productName, '商品');
  const platformLabels = unique(input.platforms).map(platform => PLATFORM_LABELS[platform]);
  const platformText = platformLabels.length > 0 ? platformLabels.join(' / ') : '目标平台';
  const outputCount = plan.publishingPacks.reduce((sum, pack) => sum + pack.accountVariants.length, 0);
  const readyRenderCount = plan.queue.filter(item => item.status === 'ready').length;

  return {
    headline: '功能很多，但客户只看到一条商品增长流水线',
    promise: `围绕 ${product}，Wenai 把商品资料、模特生图、开源混剪、发布包、客服承接和表现复盘排成同一张工作台；${platformText} 的 ${outputCount} 个发布角度可以先交付，图片/视频/数字人 Key 到位后只增强生产层。`,
    primaryRoute: [
      '商品资料进来',
      '素材和模特图补齐',
      '混剪成批量短视频',
      '导出多平台发布包',
      '客户自己发布',
      '回填证据做下一轮',
    ],
    lanes: [
      {
        id: 'brief',
        title: '商品资料和卖点脚本',
        customerQuestion: '客户先告诉我们卖什么、卖给谁、不能说什么。',
        wenaiOutput: ['商品 brief', '卖点脚本', '风险词提醒', '素材缺口清单'],
        customerAction: '补商品链接、主图、卖点、参考账号和禁用词。',
        proofToCollect: ['商品链接', '主图或详情页', '授权边界'],
        routeHref: '/factory/creative?variant=friend_trial',
        status: 'ready_now',
      },
      {
        id: 'model_image',
        title: '模特生图和商品证明图',
        customerQuestion: '电商人需要主图、手持图、场景图、细节图和对比解释卡。',
        wenaiOutput: ['图片 prompt 包', '补拍清单', '人工验收项', '生成记录占位'],
        customerAction: 'Key 到位后直接生成；没 Key 时先补参考图或确认拍摄清单。',
        proofToCollect: ['参考图', '模特风格', '使用场景', '生成记录'],
        routeHref: '/factory/create?variant=friend_trial',
        status: 'key_enhanced',
      },
      {
        id: 'remix',
        title: '开源混剪和稳定渲染',
        customerQuestion: '长素材、口播、直播切片要变成可发布短视频。',
        wenaiOutput: ['候选片段', '字幕底稿', '时间线模板', `${readyRenderCount} 条可渲染任务`],
        customerAction: '只确认素材授权和低置信片段，不需要理解开源工具。',
        proofToCollect: ['原始时间戳', '字幕复核', '成片抽检'],
        routeHref: '/factory/video?variant=friend_trial',
        status: 'ready_now',
      },
      {
        id: 'publish_pack',
        title: '多账号标题和发布包',
        customerQuestion: '每个平台、每个人设要不同标题、正文、封面和发布时间。',
        wenaiOutput: ['标题矩阵', '口播开头', '封面提示', '发布检查表'],
        customerAction: '客户自己登录平台发布，Wenai 不代登、不保管账号。',
        proofToCollect: ['发布链接', '封面截图', '发布时间'],
        routeHref: '/factory/cast?variant=friend_trial',
        status: 'ready_now',
      },
      {
        id: 'support',
        title: '客服素材和售后承接',
        customerQuestion: '内容发出去以后，咨询、异议、差评和售后要接得住。',
        wenaiOutput: ['FAQ', '异议回复', '售后卡片', '人工转接规则'],
        customerAction: '客服使用素材回复，退款、投诉、平台处罚转人工。',
        proofToCollect: ['客户问题截图', '已发素材', '处理结果'],
        routeHref: '/factory/manage?variant=friend_trial',
        status: 'ready_now',
      },
      {
        id: 'review',
        title: '表现回填和下一轮优化',
        customerQuestion: '平台数据先不强求自动读取，客户把证据交回来就能复盘。',
        wenaiOutput: ['下一轮标题', '封面改法', '重剪任务', '素材缺口'],
        customerAction: '上传链接、截图、CSV 或云盘目录。',
        proofToCollect: ['表现 CSV', '评论截图', '订单或转化截图'],
        routeHref: '/factory/manage?variant=friend_trial',
        status: 'customer_upload',
      },
    ],
    dailyOperatingRules: [
      '发布不代登，账号、密码、cookie 和后台 token 都不进入 Wenai。',
      '数据回下一轮，链接、截图、CSV 或云盘目录都能变成下一轮优化任务。',
      '先让客户看懂今天要补什么、能拿到什么，不把工具名放在第一层。',
      '图片、视频、数字人 Key 只增强生成效率，不阻塞首版发布包。',
      '混剪和渲染先走本地/开源队列，单条失败只回到单条任务。',
      '发布、账号登录、cookie 和后台数据读取先由客户自己完成。',
    ],
    notInScope: [
      '不自动登录客户平台账号。',
      '不保存客户密码、cookie 或后台 token。',
      '不伪造播放量、订单、转化或客户反馈。',
      '不把复杂剪辑器 UI 直接搬给客户。',
    ],
  };
}

export function buildCommerceDailyOperatorCockpit(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  systemMap = buildCommerceWorkbenchSystemMap(input, plan),
): CommerceDailyOperatorCockpit {
  const product = safeText(input.productName, '商品');
  const routeByLane = new Map(systemMap.lanes.map(lane => [lane.id, lane]));
  const focusIds: CommerceWorkbenchSystemLane['id'][] = ['brief', 'model_image', 'remix', 'publish_pack', 'support', 'review'];

  return {
    headline: '电商人每日运营驾驶舱',
    promise: `客户打开工作台时先看到 ${product} 今天要补什么、Wenai 正在产出什么、交付后怎么发布和复盘；复杂工具、Key 和开源栈都收在第二层。`,
    todayFocus: focusIds.map(id => {
      const lane = routeByLane.get(id);
      return {
        id,
        label: lane?.title || id,
        customerNeed: lane?.customerQuestion || '确认今天的商品增长任务。',
        wenaiDoes: lane?.wenaiOutput.slice(0, 3).join(' / ') || '生成可交付任务。',
        customerDoes: lane?.customerAction || '按提示补充资料。',
        visibleProof: lane?.proofToCollect.slice(0, 3).join(' / ') || '交付证据',
        nextHref: lane?.routeHref || '/factory?variant=friend_trial',
      };
    }),
    commandStrip: [
      '先看商品资料缺口，再看今天能交付的图、视频、标题和客服素材。',
      '生图/视频/数字人 Key 未配置时，仍然导出 prompt、时间线、发布包和补素材任务。',
      '混剪队列只展示客户能理解的状态：待补素材、可渲染、渲染中、已导出、需重试。',
      '发布由客户自己完成；Wenai 给复制包、检查表和回填入口。',
      '表现数据先靠链接、截图、CSV、云盘目录，后续再接正式授权 API。',
    ],
    customerCanIgnore: [
      '不用理解 FFmpeg、Remotion、OpenTimelineIO、PySceneDetect 这些工具名。',
      '不用把账号、密码、cookie 或后台 token 交给 Wenai。',
      '不用等所有 provider 接完才拿第一版发布包。',
      '不用在多个页面猜下一步，驾驶舱直接给今天的动作。',
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

export function buildCommerceProviderNeedAssessment(
  input: CommerceRemixPlanInput,
  plan = buildCommerceRemixEnginePlan(input),
  providerPlan = buildCommerceProviderActivationPlan(),
): CommerceProviderNeedAssessment {
  const platformLabels = unique(input.platforms).map(platform => PLATFORM_LABELS[platform]).join(' / ');
  return {
    verdict: 'first_delivery_ready',
    customerSummary: `首版不需要额外外部 provider：${platformLabels || '目标平台'} 可以先交付商品脚本、开源混剪任务、标题矩阵、发布包、客服话术和客户回填入口。`,
    canRunNow: [
      {
        capability: '开源混剪和稳定渲染队列',
        evidence: `${plan.timeline.clips.length} 个时间线片段、${plan.ffmpegCommands.length} 条 FFmpeg 参数、${plan.queue.length} 个平台/尺寸任务已经可以形成任务包。`,
        customerAction: '客户补齐授权素材或确认缺口，Wenai 输出本地渲染包和可发布成片结构。',
      },
      {
        capability: '多账号标题和发布包',
        evidence: `${plan.publishingPacks.length} 个平台发布包已经覆盖标题、正文、标签、CTA 和回填要求。`,
        customerAction: '客户自己登录平台发布，不把账号密码或 cookie 交给 Wenai。',
      },
      {
        capability: '客服/售后/复购对话运营',
        evidence: 'FAQ、异议处理、售后卡片、差评挽回和复购提醒可以从商品卖点直接生成。',
        customerAction: '客户上传问题截图或高频评论，运营把它们回填为下一轮内容机会。',
      },
      {
        capability: '表现回填和下一轮复盘',
        evidence: '发布链接、截图、CSV 或云盘目录足以进入下一轮标题、封面、素材和重剪建议。',
        customerAction: '客户发布后上传证据；没有真实回填时不展示虚构表现。',
      },
    ],
    waitingForYourKeys: providerPlan.lanes
      .filter(lane => ['image-key', 'video-key', 'avatar-tts-key'].includes(lane.id))
      .map(lane => ({
        keyType: lane.name,
        unlocks: lane.customerFacingWording,
        fallbackNow: lane.fallbackUntilActivated,
      })),
    notRequiredNow: [
      ...providerPlan.notNeededForFirstDelivery,
      '自动读取平台后台表现',
      '自动代客户操作电脑或浏览器',
      '自动代客户回复私信、评论或售后工单',
    ],
    escalationTriggers: [
      '单客户每批超过 100 条成片且需要多人同时审核时，再接对象存储和分布式 worker。',
      '客户要求系统直接发布到平台时，再评估平台 OAuth、开放接口或客户授权的辅助操作。',
      '客户要求每天自动读取后台表现时，再接平台 analytics API 或授权数据源。',
      '客户要求 AI 直接生成真人口播、视频镜头或模特图时，等待你提供对应 Key 后接入。',
    ],
    finalRecommendation: '现在先按“本地/开源混剪 + 客户自发布 + 云盘/CSV 回填”交付；图片、视频、数字人 Key 到位后增强生成层，平台账号和后台数据暂不作为首版 blocker。',
  };
}

export function buildCommerceProviderActivationRunbook(
  providerPlan = buildCommerceProviderActivationPlan(),
): CommerceProviderActivationRunbook {
  const runbookByLane: Record<string, Omit<CommerceProviderActivationRunbook['steps'][number], 'laneId' | 'label'>> = {
    'image-key': {
      id: 'activate-image-generation',
      customerInput: ['图片生成 Key 类型', '商用授权范围', '默认画幅', '失败回调或查询方式'],
      wenaiAction: ['把模特图、场景图、细节图 prompt 接入任务队列', '生成结果写回素材货架', '把可用图片挂到对应混剪任务'],
      writesBackTo: ['素材货架', '模特生图任务包', '发布包封面建议', '渲染队列 missing asset'],
      acceptanceEvidence: ['每张图有任务 ID 或生成记录', '商品主体不变形不串款', '失败任务能回到人工补图清单'],
      fallbackIfFailed: '保留 prompt、参考图要求和人工拍摄清单，继续使用客户原图交付。',
    },
    'video-key': {
      id: 'activate-video-generation',
      customerInput: ['视频生成 Key 类型', '任务提交接口', '结果查询或回调', '单条失败码和重试规则'],
      wenaiAction: ['把需要 AI 镜头的分镜转成 provider 任务', '结果写回 render queue', '失败时只重试单条镜头'],
      writesBackTo: ['时间线片段', '渲染队列', '成片验收清单', '失败重试记录'],
      acceptanceEvidence: ['每个 AI 镜头有 provider task id', '返回视频能被本地混剪读取', '单条失败不阻塞整批发布包'],
      fallbackIfFailed: '继续用本地素材、字幕、口播和 FFmpeg/Remotion 混剪出可发布版本。',
    },
    'avatar-tts-key': {
      id: 'activate-avatar-tts',
      customerInput: ['数字人或 TTS Key 类型', '可用人设或音色', '语言范围', '下载或回调方式'],
      wenaiAction: ['把口播稿转成音频或数字人任务', '校验字幕和口播一致', '把音频/视频挂回多账号人设'],
      writesBackTo: ['口播素材', '字幕轨', '多账号人设矩阵', '发布包说明'],
      acceptanceEvidence: ['口播内容和字幕一致', '音色或人设可复用', '失败时仍能导出人工录音脚本'],
      fallbackIfFailed: '导出口播稿、字幕和录音说明，让客户或运营人工录音。',
    },
    'cloud-drive': {
      id: 'activate-cloud-drive',
      customerInput: ['云盘或对象存储配置', '目录命名规则', '访问权限', '签名链接策略'],
      wenaiAction: ['把发布包和回填材料写入客户目录', '按批次生成交付目录', '读取客户上传的截图/CSV/链接'],
      writesBackTo: ['客户交付目录', '回填收件箱', '复盘数据源', '下一轮任务清单'],
      acceptanceEvidence: ['客户只能访问自己的目录', '回填文件可被复盘读取', '链接过期和权限可控'],
      fallbackIfFailed: '继续用本地导出包、客户上传链接和 CSV 回填，不影响首版发布包。',
    },
    'analytics-api': {
      id: 'activate-analytics-api',
      customerInput: ['平台授权方式', '指标口径', '时间窗口', '账号和作品映射'],
      wenaiAction: ['把平台数据转成统一表现证据', '与客户回填截图互相校验', '驱动下一轮标题/封面/重剪建议'],
      writesBackTo: ['表现回填板', '复盘行动板', '下一轮混剪任务', '客服素材机会'],
      acceptanceEvidence: ['指标和客户后台一致', '缺授权时不读取', '缺数据时不虚构表现'],
      fallbackIfFailed: '客户继续上传链接、截图、CSV 或云盘目录，系统先基于真实证据复盘。',
    },
  };

  const steps = providerPlan.lanes.map(lane => ({
    ...runbookByLane[lane.id],
    laneId: lane.id,
    label: lane.name,
  }));

  return {
    headline: 'Key 到位后的接入运行手册',
    customerPromise: '图片、视频、数字人和数据接口只增强自动化层；首版混剪、发布包、客服素材和复盘入口不等待这些 Key。',
    keyHandlingRules: [
      '只记录 Key 类型、用途、验收状态和失败原因，不在页面、日志或导出包展示 Key 值。',
      '每个 provider 先用一条小任务验收，通过后再进入批量队列。',
      'provider 失败只影响对应素材或镜头，不影响客户自发布包和本地混剪交付。',
    ],
    steps,
    fallbackPolicy: [
      '图片失败：回到 prompt 包、参考图和人工拍摄清单。',
      '视频失败：回到本地素材混剪、字幕和 FFmpeg/Remotion 渲染。',
      '数字人失败：回到口播稿、字幕和人工录音说明。',
      '云盘或数据失败：回到客户上传链接、截图、CSV 和本地导出目录。',
    ],
    doneDefinition: [
      '每个已接 provider 都有任务 ID、输入、输出、验收证据和失败回退记录。',
      '生成结果能写回素材货架、渲染队列、发布包或复盘行动板。',
      '没有授权的账号、后台数据和客户私信不被读取或自动操作。',
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

export function buildDemoCommerceCustomerReturnIntakeBoard() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceCustomerReturnIntakeBoard(
    buildDemoCommercePerformanceUploadReport(),
    buildCommerceCloudDriveReturnPlan(input, buildCommerceCloudDriveManifest(input)),
  );
}

export function buildDemoCommerceEvidenceReadinessBoard() {
  const input = buildDemoCommerceRemixInput();
  const report = buildDemoCommercePerformanceUploadReport();
  const returnPlan = buildCommerceCloudDriveReturnPlan(input, buildCommerceCloudDriveManifest(input));
  return buildCommerceEvidenceReadinessBoard(report, returnPlan, buildCommerceCustomerReturnIntakeBoard(report, returnPlan));
}

export function buildDemoCommerceCustomerEvidenceUploadGuide() {
  const input = buildDemoCommerceRemixInput();
  const report = buildDemoCommercePerformanceUploadReport();
  const returnPlan = buildCommerceCloudDriveReturnPlan(input, buildCommerceCloudDriveManifest(input));
  return buildCommerceCustomerEvidenceUploadGuide(report, returnPlan, buildCommerceCustomerReturnIntakeBoard(report, returnPlan));
}

export function buildDemoCommercePostPublishActionBoard() {
  const input = buildDemoCommerceRemixInput();
  const report = buildDemoCommercePerformanceUploadReport();
  const returnPlan = buildCommerceCloudDriveReturnPlan(input, buildCommerceCloudDriveManifest(input));
  const returnBoard = buildCommerceCustomerReturnIntakeBoard(report, returnPlan);
  const servicePack = buildCommerceCustomerServicePack(input);
  return buildCommercePostPublishActionBoard(report, returnBoard, buildCommerceCustomerSupportWorkflow(input, servicePack), returnPlan);
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

export function buildDemoCommerceRenderReliabilityBoard() {
  const demoInput = buildDemoCommerceRemixInput();
  const readyInput = {
    ...demoInput,
    assets: demoInput.assets.map(asset => asset.id === 'model-handheld'
      ? { ...asset, missing: false, uri: 'assets/model-handheld.png', rightsReady: true }
      : asset),
  };
  const plan = buildCommerceRemixEnginePlan(readyInput);
  const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 3, retryBudget: 2 });
  return buildCommerceRenderReliabilityBoard(plan.queue, batchPlan, buildCommerceRenderCapacityPlan(plan.queue, batchPlan));
}

export function buildDemoCommerceRenderOperationsRunbook() {
  const demoInput = buildDemoCommerceRemixInput();
  const readyInput = {
    ...demoInput,
    assets: demoInput.assets.map(asset => asset.id === 'model-handheld'
      ? { ...asset, missing: false, uri: 'assets/model-handheld.png', rightsReady: true }
      : asset),
  };
  const plan = buildCommerceRemixEnginePlan(readyInput);
  const batchPlan = buildCommerceRenderBatchPlan(plan.queue, { maxConcurrency: 3, retryBudget: 2 });
  const capacity = buildCommerceRenderCapacityPlan(plan.queue, batchPlan);
  return buildCommerceRenderOperationsRunbook(plan.queue, batchPlan, capacity, buildCommerceRenderReliabilityBoard(plan.queue, batchPlan, capacity));
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

export function buildDemoCommerceOpenSourceCoverage() {
  const input = buildDemoCommerceRemixInput();
  const plan = buildCommerceRemixEnginePlan(input);
  const adapters = buildCommerceOpenSourceAdapters();
  return buildCommerceOpenSourceCoverage(input, plan, adapters);
}

export function buildDemoCommerceOpenSourceStackSelector() {
  const input = buildDemoCommerceRemixInput();
  const plan = buildCommerceRemixEnginePlan(input);
  const adapters = buildCommerceOpenSourceAdapters();
  return buildCommerceOpenSourceStackSelector(input, plan, adapters);
}

export function buildDemoCommerceOpenSourceInstallMatrix() {
  const input = buildDemoCommerceRemixInput();
  const plan = buildCommerceRemixEnginePlan(input);
  const adapters = buildCommerceOpenSourceAdapters();
  return buildCommerceOpenSourceInstallMatrix(input, plan, adapters);
}

export function buildDemoCommerceRemixOrchestrationBoard() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceRemixOrchestrationBoard(input, buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommercePublishingMatrixPlan() {
  const input = buildDemoCommerceRemixInput();
  return buildCommercePublishingMatrixPlan(input);
}

export function buildDemoCommerceCreatorPersonaMatrix() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceCreatorPersonaMatrix(input);
}

export function buildDemoCommerceSuperIpTitleBoard() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceSuperIpTitleBoard(input, buildCommerceCreatorPersonaMatrix(input));
}

export function buildDemoCommerceTitleQualityGate() {
  const input = buildDemoCommerceRemixInput();
  const publishingMatrix = buildCommercePublishingMatrixPlan(input);
  return buildCommerceTitleQualityGate(input, buildCommerceSuperIpTitleBoard(input, buildCommerceCreatorPersonaMatrix(input, publishingMatrix)), publishingMatrix);
}

export function buildDemoCommerceSelfPublishingCommandCenter() {
  const input = buildDemoCommerceRemixInput();
  const publishingMatrix = buildCommercePublishingMatrixPlan(input);
  const personaMatrix = buildCommerceCreatorPersonaMatrix(input, publishingMatrix);
  return buildCommerceSelfPublishingCommandCenter(input, publishingMatrix, personaMatrix, buildCommerceCloudDriveReturnPlan(input));
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

export function buildDemoCommerceSalesConversationBoard() {
  const input = buildDemoCommerceRemixInput();
  const servicePack = buildCommerceCustomerServicePack(input);
  return buildCommerceSalesConversationBoard(input, servicePack, buildCommerceCustomerSupportWorkflow(input, servicePack));
}

export function buildDemoCommerceWorkbenchSystemMap() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceWorkbenchSystemMap(input, buildCommerceRemixEnginePlan(input));
}

export function buildDemoCommerceDailyOperatorCockpit() {
  const input = buildDemoCommerceRemixInput();
  const plan = buildCommerceRemixEnginePlan(input);
  return buildCommerceDailyOperatorCockpit(input, plan, buildCommerceWorkbenchSystemMap(input, plan));
}

export function buildDemoCommerceCustomerDeliveryMap() {
  return buildCommerceCustomerDeliveryMap(buildDemoCommerceRemixInput());
}

export function buildDemoCommerceProviderActivationPlan() {
  return buildCommerceProviderActivationPlan();
}

export function buildDemoCommerceProviderNeedAssessment() {
  const input = buildDemoCommerceRemixInput();
  return buildCommerceProviderNeedAssessment(input, buildCommerceRemixEnginePlan(input), buildCommerceProviderActivationPlan());
}

export function buildDemoCommerceProviderActivationRunbook() {
  return buildCommerceProviderActivationRunbook(buildCommerceProviderActivationPlan());
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
