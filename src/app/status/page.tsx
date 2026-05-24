'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latencyMs?: number;
  note?: string;
}

interface HealthResponse {
  overall: 'operational' | 'degraded' | 'down';
  services: ServiceStatus[];
  timestamp: string;
  uptime: number | null;
}

interface ReadinessIssue {
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  evidence: string;
  fix: string;
}

interface ReadinessFeature {
  name: string;
  status: 'implemented' | 'partial' | 'missing' | 'pseudo';
  evidence: string;
  risk: 'high' | 'medium' | 'low';
  fix: string;
}

interface ReadinessWorkflow {
  name: string;
  ok: boolean;
  evidence: string;
  fix?: string;
}

interface ExternalIntegrationRequirement {
  id: string;
  category:
    | 'video_provider'
    | 'video_analysis'
    | 'platform_oauth'
    | 'ad_delivery'
    | 'auto_publish'
    | 'analytics_sync'
    | 'asset_cloud'
    | 'scale_claims';
  label: string;
  status: 'configured' | 'missing' | 'evidence_required';
  owner: 'user' | 'provider' | 'wenai';
  materialPriority?: 'P0' | 'P1';
  unlocks?: string;
  blockedGate?: string;
  missingImpact?: string;
  operatorAction?: string;
  evidence: string;
  requiredInputs: string[];
  acceptance: string;
  acceptanceEvidence?: string;
  securityBoundary?: string;
  releaseChecks?: string[];
}

interface ScaleClaimGuard {
  label: string;
  requestedBenchmark: string;
  canDisplay: boolean;
  evidence: string;
  requiredEvidence: string[];
}

interface ProductCapabilityLayer {
  id: 'Compose' | 'Create' | 'Cut' | 'Cast' | 'Manage';
  target: string;
  currentStatus: ReadinessFeature['status'];
  internalCapability: string;
  externalGate: string;
  stopLine: string;
  evidence: string;
}

interface AlternativeCompetitorReference {
  name: string;
  pattern: string;
  wenaiDecision: string;
  boundary: string;
}

interface ProductUiVariantGuide {
  id: 'partner' | 'operator' | 'friend_trial';
  label: string;
  audience: string;
  firstScreen: string;
  primaryAction: string;
  stopLine: string;
}

interface ReadinessResponse {
  projectId?: string;
  report: {
    verdict: 'pass' | 'conditional' | 'fail';
    label: string;
    score: number;
    productBlueprint?: ProductCapabilityLayer[];
    alternativeReferences?: AlternativeCompetitorReference[];
    uiVariants?: ProductUiVariantGuide[];
    features: ReadinessFeature[];
    workflows: ReadinessWorkflow[];
    issues: ReadinessIssue[];
    friendTrialRisks: ReadinessIssue[];
    externalRequirements: ExternalIntegrationRequirement[];
    materialGateSummary?: {
      total: number;
      configured: number;
      missingP0: number;
      missingP1: number;
      evidenceRequired: number;
      blocksCommercialLaunch: boolean;
      nextMaterialPacks: string[];
      evidence: string;
    };
    scaleClaimGuards: ScaleClaimGuard[];
    projectReadiness?: {
      verdict: 'pass' | 'conditional' | 'fail';
      score: number;
      evidence: string[];
      missingLinks: string[];
      nextActions: string[];
    };
  };
}

interface IndustrialActionItem {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  owner: string;
  title: string;
  evidence: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH';
  acceptance: string;
}

interface ActionQueueResponse {
  projectId: string;
  actionCount: number;
  actions: IndustrialActionItem[];
}

interface AssetPermissionAccessAudit {
  id: string;
  assetId: string;
  action: 'view' | 'download' | 'share' | 'approve' | 'publish';
  role?: string;
  actor: string;
  operation: string;
  allowed: boolean;
  reason: string;
  createdAt: string;
}

interface AssetPermissionResponse {
  projectId: string;
  accessAudits: AssetPermissionAccessAudit[];
}

type StatusUiVariant = 'partner' | 'operator' | 'friend_trial';

const STATUS_META = {
  operational: { label: '服务正常', helper: '核心链路可继续试用', tone: 'success' },
  degraded: { label: '部分待接入', helper: '可演示，但需要补齐外部门禁', tone: 'accent' },
  down: { label: '需要处理', helper: '请先检查服务或配置', tone: 'error' },
} as const;

const FEATURE_STATUS_LABELS: Record<ReadinessFeature['status'], string> = {
  implemented: '已实现',
  partial: '部分实现',
  missing: '待接入',
  pseudo: '仅骨架',
};

const FEATURE_NAME_LABELS: Record<string, string> = {
  '10 SKU POC intake and standard-pack routing': '10 SKU POC 询盘与标准包',
  'CRM-lite commercial loop': 'CRM 商务闭环',
  'Enterprise asset permissions ledger': '企业资产权限台账',
  'Client review token portal': '客户免登录审核入口',
  'Brand learning profile': '品牌学习档案',
  'Creative monitoring watchlist': '创意监控清单',
  'Creative intelligence ledger': '创意洞察台账',
  'Channel account matrix ledger': '渠道账号矩阵',
  'Kuaizi production connector': '筷子生产连接器',
  'Image production': '图片生产',
  'AI video production': 'AI 视频生产',
  'Creative insight / video teardown': '创意洞察与视频拆解',
  'Industrial asset and distribution store': '资产库与分发计划',
  'Full-chain commerce orchestration': '全链路电商编排',
  'Performance feedback import': '表现回流导入',
  'Distribution and ad authorization': '分发与广告授权',
  'Platform connector automation ledger': '平台连接自动化台账',
  'Enterprise cloud asset management': '企业云资产管理',
  'Account and permission system': '账号与权限体系',
};

const EXTERNAL_REQUIREMENT_STATUS_LABELS: Record<ExternalIntegrationRequirement['status'], string> = {
  configured: '已接入',
  missing: '等待外部接入',
  evidence_required: '需要证据确认',
};

const EXTERNAL_REQUIREMENT_OWNER_LABELS: Record<ExternalIntegrationRequirement['owner'], string> = {
  user: '客户提供',
  provider: '服务商提供',
  wenai: 'Wenai 内部完成',
};

const EXTERNAL_REQUIREMENT_CATEGORY_LABELS: Record<ExternalIntegrationRequirement['category'], string> = {
  video_provider: '视频生成/剪辑',
  video_analysis: 'AI 视频分析',
  platform_oauth: '多平台 OAuth',
  ad_delivery: '广告投放',
  auto_publish: '自动发布/矩阵分发',
  analytics_sync: '平台数据同步',
  asset_cloud: '企业云资产',
  scale_claims: '规模数字审计',
};

const PROJECT_EVIDENCE_LABELS: Record<string, string> = {
  assets: '资产总数',
  reportAssets: '报告资产',
  approvedAssets: '已批准资产',
  reusableAssets: '可复用资产',
  deliverableAssets: '交付资产',
  clientReviewAssets: '客户审核中',
  approvedDeliverables: '已批准交付',
  plans: '分发计划',
  readyPlans: '就绪计划',
  dispatches: '执行记录',
  publishedDispatches: '发布记录',
  publishedWithEvidence: '发布证据',
  performanceReturns: '表现回流',
  scaleDecisions: '放量决策',
  creativeInsights: '创意洞察',
  creativeMonitors: '创意监控',
  creativePatternClusters: '创意打法簇',
  creativeReadySourceHealthCards: '健康源卡片',
  channelAccounts: '矩阵账号',
  channelAvailableSlots: '可排期档位',
  channelAdCampaigns: '广告活动',
  channelReadyAdCampaigns: '就绪广告',
  assetPermissionRecords: '权限策略',
  assetPermissionAccessAuditEvents: '访问审计',
  assetSecurityPolicies: '安全策略',
  videoQueueItems: '视频任务',
  videoCompletedProviderExecutions: 'Provider 完成',
  videoResultAssets: '视频成片',
  videoClientReviews: '视频审核',
  brandLearningRules: '品牌学习规则',
  auditedWenaiCreativeOutput: '审计创意产出',
  auditedWenaiVideoDistribution: '审计视频分发',
};

const STATUS_UI_VARIANTS: Array<{
  id: StatusUiVariant;
  label: string;
  intent: string;
  proof: string;
}> = [
  {
    id: 'partner',
    label: '合作伙伴版',
    intent: '面向客户、供应商和投资人，先看产品边界、外部门禁和可交付证据。',
    proof: '只展示已经有证据的能力；未接入 provider、OAuth、广告账号或云资产前，不宣称平台级等价执行。',
  },
  {
    id: 'operator',
    label: '运营工作台版',
    intent: '面向内部交付团队，先看 P0/P1 队列、owner、接口、验收标准和下一步材料。',
    proof: '每个阻塞项必须能落到 endpoint、method、acceptance，而不是只停留在汇报。',
  },
  {
    id: 'friend_trial',
    label: '朋友试用版',
    intent: '面向非技术试用者，先看从询盘到交付审核是否能顺畅跑通。',
    proof: '把真实可用、待人工协助、待外部配置分开展示，避免客户误以为全部已经自动化。',
  },
];

const FINAL_PRODUCT_BLUEPRINT = [
  {
    layer: 'Compose',
    target: '全网灵感管理、竞品账号追踪、热门视频解析、Hook Bank 和品牌学习档案。',
    internalMove: '继续加厚 creative monitoring、source sync、hook 结构、action queue 和下一轮生产约束。',
    externalNeed: '榜单源、授权观察账号、可合法解析的视频来源，或可审计的人工导入源。',
    stopLine: '没有持续来源和解析证据前，只能说“洞察台账”，不能说“全网灵感平台”。',
  },
  {
    layer: 'Create',
    target: '从商品 Brief 到脚本、素材、生产 handoff、provider request 和客户验收交付物。',
    internalMove: '把资产库、脚本、生产结果、客户审核和 CRM handoff 串成同一条任务线。',
    externalNeed: '图像/视频生成 provider、对象存储、正式域名和客户可访问交付链接。',
    stopLine: '没有真实 provider 成功回调和可打开交付物前，不宣称自动生成已商用。',
  },
  {
    layer: 'Cut',
    target: 'AI 视频分析、结构拆解、智能混剪、版本对比、批量成片和复盘回流。',
    internalMove: '补视频任务队列、cut plan、素材切片字段、review token 和表现回流。',
    externalNeed: '多模态视频分析、剪辑/渲染 provider、转码存储和失败重试队列。',
    stopLine: '没有真实成片与多版本渲染证据前，只能说“工作流就绪”。',
  },
  {
    layer: 'Cast',
    target: '多平台分发、矩阵账号、广告投放、预算门禁、发布证据和 analytics sync。',
    internalMove: '强化账号矩阵、发布档位、dispatch handoff、campaign ledger、UTM 和表现导入。',
    externalNeed: 'TikTok/Meta/Google/小红书等 OAuth、广告账号授权、发布权限和转化事件。',
    stopLine: '没有平台授权和发布/投放回执前，不展示已自动分发或已自动优化广告。',
  },
  {
    layer: 'Manage',
    target: '企业数据安全、RBAC、审计、客户审核、CRM 交接、状态验收和规模数字保护。',
    internalMove: '把 review token、反馈写回、资产权限、DLP、水印、留存和 readiness 接到每条交付物。',
    externalNeed: '企业云资产、签名 URL、团队空间、正式 CRM/合同/付款系统和审计材料。',
    stopLine: '91M+ creative output、42M+ video distribution 只能作为竞品 benchmark，不能作为 Wenai 自有规模。',
  },
];

const ALTERNATIVE_PLATFORM_REFERENCES = [
  {
    name: 'Hooksy / Hooked',
    reference: '广告库、品牌追踪、脚本提取、hook patterns、商品图到短视频和 UGC 广告批量生成。',
    wenaiDecision: '把 Compose 和 Cut 连接成从胜出结构到可复用视频任务的闭环。',
  },
  {
    name: 'Omneky',
    reference: '跨平台 campaign launcher、creative testing、brand-safe generation、creative analytics 和优化建议。',
    wenaiDecision: 'Cast 必须带 campaign ledger、素材标签、预算证据和表现回流。',
  },
  {
    name: 'Creatify',
    reference: '商品链接、素材、avatar、voice、scene 和 UGC ad variants 连接到视频广告生产。',
    wenaiDecision: 'Create/Cut 要把商品素材、版本矩阵、成片 URL、客户审核和 CRM/分发交接放进同一条任务。',
  },
  {
    name: 'Smartly.io',
    reference: 'creative、media、intelligence 一体化：创意交付、媒体购买、实时优化、报告和平台协作。',
    wenaiDecision: 'Cast/Manage 要把素材版本、账号、预算、平台回执、表现回流和下一轮 action queue 放在同一块面板。',
  },
];

const NAV_ITEMS = [
  ['总览', '/status?variant=friend_trial'],
  ['生产台', '/factory?variant=friend_trial'],
  ['创意洞察', '/factory/creative?variant=friend_trial'],
  ['视频工坊', '/factory/video?variant=friend_trial'],
  ['外部配置', '/settings/kuaizi'],
  ['试用申请', '/inquire?from=status'],
];

export interface ProjectEvidenceMetric {
  key: string;
  label: string;
  value: string;
}

export function formatReadinessFeatureName(name: string) {
  return FEATURE_NAME_LABELS[name] || name;
}

export function formatExternalRequirementStatus(status: ExternalIntegrationRequirement['status']) {
  return EXTERNAL_REQUIREMENT_STATUS_LABELS[status];
}

export function formatExternalRequirementOwner(owner: ExternalIntegrationRequirement['owner']) {
  return EXTERNAL_REQUIREMENT_OWNER_LABELS[owner];
}

export function formatExternalRequirementCategory(category: ExternalIntegrationRequirement['category']) {
  return EXTERNAL_REQUIREMENT_CATEGORY_LABELS[category];
}

function formatEvidenceValue(key: string, rawValue: string) {
  const numericValue = Number(rawValue);
  if (Number.isFinite(numericValue) && (key.includes('Confidence') || key.includes('Score'))) {
    if (numericValue > 0 && numericValue <= 1) return `${Math.round(numericValue * 100)}%`;
    return Number.isInteger(numericValue) ? `${numericValue}` : numericValue.toFixed(1);
  }
  return rawValue || '0';
}

export function formatProjectEvidenceMetric(item: string): ProjectEvidenceMetric {
  const separatorIndex = item.indexOf('=');
  if (separatorIndex < 0) {
    return { key: 'unknown', label: '补充证据', value: item };
  }

  const key = item.slice(0, separatorIndex);
  const rawValue = item.slice(separatorIndex + 1);
  return {
    key,
    label: PROJECT_EVIDENCE_LABELS[key] || '补充证据',
    value: formatEvidenceValue(key, rawValue),
  };
}

const ASSET_ACTION_LABELS: Record<AssetPermissionAccessAudit['action'], string> = {
  view: '查看',
  download: '下载',
  share: '分享',
  approve: '批准',
  publish: '发布',
};

const ASSET_AUDIT_REASON_LABELS: Record<string, string> = {
  allowed: '已授权',
  missing_permission_record: '缺少权限策略',
  permission_expired: '权限已过期',
  action_not_allowed: '动作未授权',
  role_not_allowed: '角色未授权',
};

const ASSET_OPERATION_LABELS: Record<string, string> = {
  api_asset_access_check: '权限校验接口',
  industrial_asset_route: '资产读取',
  public_share_create: '公开分享',
  distribution_dispatch_publish: '分发发布',
};

export function formatAssetPermissionAuditEvent(event: AssetPermissionAccessAudit) {
  return {
    actionLabel: ASSET_ACTION_LABELS[event.action] || event.action,
    operationLabel: ASSET_OPERATION_LABELS[event.operation] || event.operation,
    resultLabel: event.allowed ? '允许' : '拒绝',
    reasonLabel: ASSET_AUDIT_REASON_LABELS[event.reason] || event.reason,
    actorLabel: event.actor || event.role || '系统',
  };
}

function normalizeStatusUiVariantId(value?: string): StatusUiVariant {
  if (value === 'operator' || value === 'friend_trial' || value === 'partner') return value;
  return 'partner';
}

export function buildStatusExternalRequirements(report?: ReadinessResponse['report']) {
  return report?.externalRequirements || [];
}

export function buildStatusUiVariants(report?: ReadinessResponse['report']) {
  if (!report?.uiVariants?.length) return STATUS_UI_VARIANTS;

  return report.uiVariants.map(variant => ({
    id: normalizeStatusUiVariantId(variant.id),
    label: variant.label,
    intent: `${variant.audience} ${variant.firstScreen}`,
    proof: `${variant.primaryAction} 停止线：${variant.stopLine}`,
  }));
}

type StatusProductBlueprintItem = {
  layer: string;
  target: string;
  internalMove: string;
  externalNeed: string;
  stopLine: string;
  evidence?: string;
  status?: ReadinessFeature['status'];
};

export function buildStatusProductBlueprint(report?: ReadinessResponse['report']): StatusProductBlueprintItem[] {
  if (!report?.productBlueprint?.length) return FINAL_PRODUCT_BLUEPRINT;

  return report.productBlueprint.map(item => ({
    layer: item.id,
    target: item.target,
    internalMove: item.internalCapability,
    externalNeed: item.externalGate,
    stopLine: item.stopLine,
    evidence: item.evidence,
    status: item.currentStatus,
  }));
}

export function buildStatusAlternativeReferences(report?: ReadinessResponse['report']) {
  if (!report?.alternativeReferences?.length) return ALTERNATIVE_PLATFORM_REFERENCES;

  return report.alternativeReferences.map(item => ({
    name: item.name,
    reference: `${item.pattern} 边界：${item.boundary}`,
    wenaiDecision: item.wenaiDecision,
  }));
}

function toneClass(tone: 'success' | 'accent' | 'error') {
  if (tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (tone === 'error') return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function statusTone(status: ExternalIntegrationRequirement['status']) {
  if (status === 'configured') return 'success';
  if (status === 'missing') return 'error';
  return 'accent';
}

function StatusPill({ children, tone }: { children: string; tone: 'success' | 'accent' | 'error' }) {
  return (
    <span className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClass(tone)}`}>
      <span className="truncate">{children}</span>
    </span>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-500">{helper}</div>
    </div>
  );
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [actionQueue, setActionQueue] = useState<ActionQueueResponse | null>(null);
  const [assetPermissions, setAssetPermissions] = useState<AssetPermissionResponse | null>(null);
  const [projectId, setProjectId] = useState('default-project');
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [uiVariant, setUiVariant] = useState<StatusUiVariant>('partner');

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const id = projectId.trim() || 'default-project';
      const [healthRes, readinessRes, actionQueueRes, assetPermissionRes] = await Promise.all([
        fetch('/api/health', { cache: 'no-store' }),
        fetch(`/api/readiness?projectId=${encodeURIComponent(id)}`, { cache: 'no-store' }),
        fetch(`/api/industrial-chain/action-queue?projectId=${encodeURIComponent(id)}`, { cache: 'no-store' }),
        fetch(`/api/asset-permissions?projectId=${encodeURIComponent(id)}`, { cache: 'no-store' }),
      ]);

      setHealth(await healthRes.json());
      setReadiness(await readinessRes.json());
      setActionQueue(await actionQueueRes.json());
      setAssetPermissions(await assetPermissionRes.json());
      setLastFetch(new Date());
    } catch {
      setHealth({ overall: 'down', services: [], timestamp: new Date().toISOString(), uptime: null });
      setReadiness(null);
      setActionQueue(null);
      setAssetPermissions(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('variant');
    setUiVariant(normalizeStatusUiVariantId(selected || undefined));
  }, []);

  const report = readiness?.report;
  const overall = health?.overall || 'degraded';
  const meta = STATUS_META[overall];
  const variants = buildStatusUiVariants(report);
  const activeVariant = variants.find(variant => variant.id === uiVariant) || variants[0];
  const requirements = buildStatusExternalRequirements(report);
  const blueprint = buildStatusProductBlueprint(report);
  const references = buildStatusAlternativeReferences(report);
  const topActions = actionQueue?.actions.slice(0, 4) || [];
  const auditEvents = assetPermissions?.accessAudits.slice(0, 4) || [];
  const materialGate = report?.materialGateSummary;
  const projectReadiness = report?.projectReadiness;

  const evidenceMetrics = useMemo(() => {
    return (projectReadiness?.evidence || []).slice(0, 8).map(formatProjectEvidenceMetric);
  }, [projectReadiness]);

  const selectVariant = (variant: StatusUiVariant) => {
    setUiVariant(variant);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:min-h-screen lg:flex-row">
        <aside className="border-b border-slate-200 bg-white px-4 py-4 lg:w-[232px] lg:border-b-0 lg:border-r lg:px-5">
          <Link href="/factory?variant=friend_trial" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">W</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Wenai 工厂</span>
              <span className="block truncate text-[11px] text-slate-500">客户试用状态</span>
            </span>
          </Link>
          <nav className="mt-5 grid gap-1">
            {NAV_ITEMS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Product readiness</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                全链路状态与交付门禁
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                这里用筷子式工作台结构展示 Wenai 当前能交付什么、还差哪些外部 provider / OAuth / 广告账号 / 云资产材料，以及哪些能力只允许作为试用流程展示。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={meta.tone}>{loading ? '正在检查' : meta.label}</StatusPill>
              <Link href="/settings/kuaizi" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                补外部配置
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="产品可用性" value={report ? `${report.score}/100` : '--'} helper={report?.label || meta.helper} />
            <MetricCard label="P0 外部门禁" value={`${materialGate?.missingP0 ?? requirements.filter(item => item.materialPriority === 'P0' && item.status !== 'configured').length}`} helper="未清零前不承诺商业自动化" />
            <MetricCard label="待执行动作" value={`${actionQueue?.actionCount ?? topActions.length}`} helper="运营/工程下一步队列" />
            <MetricCard label="权限审计" value={`${assetPermissions?.accessAudits.length ?? 0}`} helper="客户资产访问留痕" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-base font-semibold">试用视角</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{activeVariant.proof}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map(variant => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => selectVariant(variant.id)}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                        variant.id === uiVariant
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {variants.map(variant => (
                  <div key={variant.id} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="truncate text-sm font-semibold">{variant.label}</div>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{variant.intent}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">项目证据</h2>
                {lastFetch ? <span className="text-xs text-slate-400" suppressHydrationWarning>{lastFetch.toLocaleTimeString('zh-CN')}</span> : null}
              </div>
              <label className="mt-3 block">
                <span className="text-xs text-slate-500">Project ID</span>
                <div className="mt-1 flex gap-2">
                  <input
                    value={projectId}
                    onChange={event => setProjectId(event.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950"
                    placeholder="default-project"
                  />
                  <button type="button" onClick={fetchStatus} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-950">
                    刷新
                  </button>
                </div>
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {evidenceMetrics.length ? evidenceMetrics.map(metric => (
                  <div key={`${metric.key}-${metric.value}`} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-2">
                    <div className="truncate text-[11px] text-slate-500">{metric.label}</div>
                    <div className="mt-1 truncate text-sm font-semibold">{metric.value}</div>
                  </div>
                )) : (
                  <div className="col-span-2 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                    暂无项目证据，接入 provider 后这里会显示真实回流。
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-base font-semibold">筷子式五段能力</h2>
                <p className="mt-1 text-sm text-slate-500">Compose / Create / Cut / Cast / Manage，区分内部已成型能力和外部配置门禁。</p>
              </div>
              <Link href="/factory?variant=friend_trial" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
                进入生产台
              </Link>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              {blueprint.map(item => (
                <article key={item.layer} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold">{item.layer}</h3>
                    {item.status ? <span className="shrink-0 text-[11px] text-slate-500">{FEATURE_STATUS_LABELS[item.status]}</span> : null}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.target}</p>
                  <div className="mt-3 rounded border border-emerald-100 bg-white p-2">
                    <div className="text-[11px] font-semibold text-emerald-700">Wenai 继续做</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.internalMove}</p>
                  </div>
                  <div className="mt-2 rounded border border-amber-100 bg-white p-2">
                    <div className="text-[11px] font-semibold text-amber-700">需要外部材料</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.externalNeed}</p>
                  </div>
                  <div className="mt-2 rounded border border-rose-100 bg-white p-2">
                    <div className="text-[11px] font-semibold text-rose-700">停止线</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.stopLine}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">外部接入清单</h2>
                <Link href="/settings/kuaizi" className="text-sm font-semibold text-slate-700 hover:text-slate-950">配置页</Link>
              </div>
              <div className="mt-3 grid gap-2">
                {requirements.length ? requirements.slice(0, 6).map(requirement => (
                  <div key={requirement.id} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="break-words text-sm font-semibold">{requirement.label}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {formatExternalRequirementCategory(requirement.category)} · {formatExternalRequirementOwner(requirement.owner)}
                        </div>
                      </div>
                      <StatusPill tone={statusTone(requirement.status)}>{formatExternalRequirementStatus(requirement.status)}</StatusPill>
                    </div>
                    <p className="mt-2 break-words text-xs leading-5 text-slate-600">{requirement.evidence}</p>
                    <p className="mt-2 break-words text-xs leading-5 text-slate-500">验收：{requirement.acceptance}</p>
                  </div>
                )) : (
                  <div className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                    暂无外部接入项。配置 provider 后这里会显示验收状态。
                  </div>
                )}
              </div>
            </section>

            <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">交付队列与权限审计</h2>
              <div className="mt-3 grid gap-2">
                {topActions.length ? topActions.map(action => (
                  <div key={action.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone={action.priority === 'P0' ? 'error' : action.priority === 'P1' ? 'accent' : 'success'}>{action.priority}</StatusPill>
                      <span className="min-w-0 break-words text-sm font-semibold">{action.title}</span>
                    </div>
                    <p className="mt-2 break-words text-xs leading-5 text-slate-600">{action.acceptance}</p>
                  </div>
                )) : (
                  <div className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">暂无待执行动作。</div>
                )}
                {auditEvents.length ? auditEvents.map(event => {
                  const audit = formatAssetPermissionAuditEvent(event);
                  return (
                    <div key={event.id} className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="break-words text-sm font-semibold">{audit.operationLabel} · {audit.actionLabel}</div>
                        <StatusPill tone={event.allowed ? 'success' : 'accent'}>{audit.resultLabel}</StatusPill>
                      </div>
                      <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                        {event.assetId} · {audit.actorLabel} · {audit.reasonLabel}
                      </p>
                    </div>
                  );
                }) : null}
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold">筷子之外参考</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {references.map(item => (
                <article key={item.name} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <h3 className="break-words text-sm font-semibold">{item.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.reference}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Wenai 决策：{item.wenaiDecision}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
