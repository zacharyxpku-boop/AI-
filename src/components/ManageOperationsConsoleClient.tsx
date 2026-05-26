'use client';

import { useState, type FormEvent } from 'react';

import { FactoryVariantConsole } from '@/components/FactoryVariantConsole';
import type { AssetPermissionSnapshot } from '@/lib/asset-permission-ledger';
import type { FactoryUiVariantId } from '@/lib/factory-readiness-view';
import type { IndustrializationSnapshot } from '@/lib/industrial-chain-store';

type ManagePlaybook = {
  title: string;
  primaryAction: string;
  proofToCheck: string;
  handoffBoundary: string;
  cards: string[];
};

export type ManageOperatingCheck = {
  stage: string;
  ready: boolean;
  evidence: string;
  next: string;
};

export type AssetEnforcementCheck = {
  gate: string;
  ready: boolean;
  evidence: string;
  stopLine: string;
};

const MANAGE_VARIANTS: Record<FactoryUiVariantId, {
  label: string;
  audience: string;
  headline: string;
  body: string;
  firstAction: string;
  stopLine: string;
}> = {
  partner: {
    label: '合作者视角',
    audience: '看 Wenai 是否有客户审核、销售交接、资产权限、审计和表现回流的管理闭环。',
    headline: 'Manage 是把交付从“发文件”升级成可审计运营系统。',
    body: '这一层检查客户 review、交付批准、权限策略、DLP、水印、下载/分享授权、访问审计和表现回流，证明 Wenai 不只是内容生成器。',
    firstAction: '先看客户批准、权限审计、DLP 和表现回流是否同时存在，再判断是否可给合作者做商用演示。',
    stopLine: '没有真实对象存储、签名链接、团队空间、销售系统和表现回流接入前，不能宣称企业云盘或自动运营中台。',
  },
  operator: {
    label: '运营视角',
    audience: '给内部运营每天收口客户审核、权限、回流、销售下一步和阻断项。',
    headline: 'Manage 的运营任务是让每个交付物都有负责人、权限、证据和下一步。',
    body: '运营只看四类缺口：客户没批、权限没闭、审计没留、回流没进。补齐后才进入复盘、续约或下一轮生产。',
    firstAction: '先补权限和客户审核缺口；没有 audit trail 时，不要把项目标记为企业级可交付。',
    stopLine: '外部云资产或销售系统未接入时，只能做内部账本和手工交接，不能说已经企业级自动协同。',
  },
  friend_trial: {
    label: '客户试用视角',
    audience: '给客户看交付物能不能审核、反馈、批准和继续跟进。',
    headline: '客户只需要知道：能不能看、能不能批、下一步做什么。',
    body: '页面只展示审核入口、批准状态、下载/分享状态和下一步。',
    firstAction: '先准备一个客户审核入口和一个可分享交付物；没有批准前不进入下一轮。',
    stopLine: '没有客户审核和批准记录时，只展示待审核，不把项目说成已交付。',
  },
};

const PERFORMANCE_RETURN_INBOX = [
  {
    title: '发布链接',
    body: '小红书笔记、短视频、商品页、广告活动链接统一贴回工作台。',
    proof: '先确认内容真实发出，再谈优化。',
  },
  {
    title: '截图证据',
    body: '曝光、点击、订单、评论、私信、售后截图都可以作为第一阶段证据。',
    proof: '没有平台直连时，也能做复盘判断。',
  },
  {
    title: 'CSV / 表格',
    body: '客户导出曝光、点击、成交、销售额、花费，上传后进入下一轮判断。',
    proof: '字段不稳定时先手工导入，不把平台 API 当首版阻塞。',
  },
  {
    title: '云盘目录',
    body: '成片、封面、评论截图、达人反馈和复盘备注放在同一目录。',
    proof: '团队能按目录补证据，不靠聊天记录找材料。',
  },
];

const SUPPORT_REVIEW_PACK = [
  '高频咨询：尺码、材质、容量、物流、退换和适用场景。',
  '评论区异议：价格、耐用度、真实感、竞品差异和使用门槛。',
  '售后风险：破损、色差、延迟、不会用、预期不一致。',
  '下一轮内容：补证明图、重剪视频、换标题、加 FAQ 或暂停投放。',
];

const NEXT_ROUND_DECISION_PACK = [
  { title: '继续放大', body: '有证据、有咨询、有成交苗头的内容进入下一轮发布包。' },
  { title: '换角度重剪', body: '播放可以但咨询弱，优先换开头、卖点顺序和封面。' },
  { title: '补客服话术', body: '评论区问得多但成交弱，先补 FAQ、售后边界和异议处理。' },
  { title: '暂停或降级', body: '无证据、无互动、无成交线索的内容不继续消耗排期。' },
];

function manageScore(
  industrial: IndustrializationSnapshot | null,
  permission: AssetPermissionSnapshot | null,
) {
  return [
    (industrial?.clientReviewAssetCount || 0) > 0,
    (industrial?.approvedDeliverableCount || 0) > 0,
    (industrial?.performanceReturnCount || 0) > 0,
    (permission?.permissionRecordCount || 0) > 0,
    (permission?.securityPolicyCount || 0) > 0,
    (permission?.dlpPassedPolicyCount || 0) >= (permission?.securityPolicyCount || 0) && (permission?.securityPolicyCount || 0) > 0,
    (permission?.accessAuditEventCount || 0) > 0,
  ].filter(Boolean).length;
}

function readableManageSystemText(value: string) {
  return value
    .replaceAll('Close gap:', '补齐交付缺口：')
    .replaceAll('Close asset permission gap:', '补齐资产权限缺口：')
    .replaceAll('Missing distribution plan', '缺少分发计划')
    .replaceAll('Missing enterprise asset permission ledger', '缺少企业资产权限账本')
    .replaceAll('Download/share permission missing storage object', '下载/分享权限缺少存储对象')
    .replaceAll('CRM handoff', '销售交接')
    .replaceAll('CRM', '销售交接')
    .replaceAll('analytics sync', '表现回流')
    .replaceAll('automatic analytics', '自动表现回流')
    .replaceAll('review token', '审核链接')
    .replaceAll('permission policy', '权限策略')
    .replaceAll('access audit', '访问审计')
    .replaceAll('performance return', '表现回流')
    .replaceAll('download/share/publish', '下载/分享/发布')
    .replaceAll('download/share', '下载/分享')
    .replaceAll('download-ready', '下载就绪')
    .replaceAll('downloadable assets', '可下载资产')
    .replaceAll('share-ready', '分享就绪')
    .replaceAll('shareable assets', '可分享资产')
    .replaceAll('objects', '对象')
    .replaceAll('missing objects', '缺失对象')
    .replaceAll('blockers', '阻断项')
    .replaceAll('access audits', '访问审计')
    .replaceAll('permission audits', '权限审计')
    .replaceAll('grant', '临时授权')
    .replaceAll('storage object', '存储对象')
    .replaceAll('security policy', '安全策略');
}

export function buildManageOperatingChecks(
  industrial: IndustrializationSnapshot | null,
  permission: AssetPermissionSnapshot | null,
): ManageOperatingCheck[] {
  const reviewCount = industrial?.clientReviewAssetCount || 0;
  const approvedCount = industrial?.approvedDeliverableCount || 0;
  const performanceCount = industrial?.performanceReturnCount || 0;
  const scaleDecisionCount = industrial?.scaleDecisionCount || 0;
  const permissionCount = permission?.permissionRecordCount || 0;
  const clientScopeCount = permission?.clientReviewScopeCount || 0;
  const securityCount = permission?.securityPolicyCount || 0;
  const watermarkReady = (permission?.watermarkRequiredCount || 0) > 0
    ? (permission?.watermarkAppliedCount || 0) >= (permission?.watermarkRequiredCount || 0)
    : false;
  const dlpReady = securityCount > 0 && (permission?.dlpPassedPolicyCount || 0) >= securityCount;
  const accessAuditCount = permission?.accessAuditEventCount || 0;
  const gaps = [...(industrial?.missingLinks || []), ...(permission?.missingLinks || [])];
  const nextActions = [...(industrial?.nextActions || []), ...(permission?.nextActions || [])];

  return [
    {
      stage: '客户审核入口',
      ready: reviewCount > 0,
      evidence: `review token / 客户审核资产 ${reviewCount} 条`,
      next: reviewCount > 0
        ? '继续把反馈、批准、返修和过期状态写回生产记录。'
        : '先创建客户审核入口；没有 review token 就不能给非技术客户零解释试用。',
    },
    {
      stage: '客户批准与交付',
      ready: approvedCount > 0,
      evidence: `已批准交付 ${approvedCount} 条`,
      next: approvedCount > 0
        ? '批准后推进销售交接、分发门禁和表现回流。'
        : '先补客户批准或返修结论；没有批准不能进入发布和销售跟进闭环。',
    },
    {
      stage: '权限范围与受控分享',
      ready: permissionCount > 0 && clientScopeCount > 0,
      evidence: `权限策略 ${permissionCount} 条 / 客户审核范围 ${clientScopeCount} 条`,
      next: permissionCount > 0
        ? '把下载、分享、发布和批准都接入权限检查，失败默认关闭。'
        : '先写入资产权限策略；没有权限账本不能宣称企业级数据安全。',
    },
    {
      stage: 'DLP / 水印 / 留存',
      ready: dlpReady && watermarkReady && (permission?.retentionPolicyCount || 0) > 0,
      evidence: `安全策略 ${securityCount} / DLP 通过 ${permission?.dlpPassedPolicyCount || 0} / 水印 ${permission?.watermarkAppliedCount || 0}`,
      next: dlpReady && watermarkReady
        ? '继续接真实对象存储、签名链接、内容安全检查和水印服务。'
        : '先补 DLP、水印和留存规则；没有安全策略不开放外部下载或分享。',
    },
    {
      stage: '访问审计',
      ready: accessAuditCount > 0,
      evidence: `访问审计 ${accessAuditCount} 条 / 权限审计 ${permission?.auditEventCount || 0} 条`,
      next: accessAuditCount > 0
        ? '把审计事件展示给运营，用于定位越权、过期和客户操作证据。'
        : '先生成 view/download/share/approve/publish 的访问审计；没有审计不算企业协作。',
    },
    {
      stage: '表现回流与复盘',
      ready: performanceCount > 0 && scaleDecisionCount > 0,
      evidence: `表现回流 ${performanceCount} 条 / scale 决策 ${scaleDecisionCount} 条`,
      next: performanceCount > 0
        ? '把结果反哺品牌学习、下一轮生产计划和销售续约动作。'
        : '补链接、截图、CSV 或云盘资料；没有回流不能宣称自动优化。',
    },
    {
      stage: '销售下一步队列',
      ready: gaps.length === 0,
      evidence: gaps.length ? `阻断 ${gaps.length} 项 / 动作 ${nextActions.length} 条` : `动作队列 ${nextActions.length} 条 / 无硬阻断`,
      next: gaps.length
        ? `先处理：${readableManageSystemText(gaps[0])}。`
        : '进入企业云资产、销售系统和表现回流接入验收。',
    },
  ];
}

export function buildAssetEnforcementChecks(permission: AssetPermissionSnapshot | null): AssetEnforcementCheck[] {
  const states = permission?.assetAccessStates || [];
  const blockerCount = states.reduce((sum, item) => sum + item.blockers.length, 0);
  const downloadableReady = permission?.downloadableAccessReadyCount || 0;
  const shareableReady = permission?.shareableAccessReadyCount || 0;
  const securityReady = (permission?.securityPolicyCount || 0) > 0
    && (permission?.dlpPassedPolicyCount || 0) >= (permission?.securityPolicyCount || 0)
    && (permission?.watermarkAppliedCount || 0) >= (permission?.watermarkRequiredCount || 0)
    && (permission?.retentionPolicyCount || 0) >= (permission?.securityPolicyCount || 0);

  return [
    {
      gate: '下载前门禁',
      ready: downloadableReady > 0,
      evidence: `下载就绪 ${downloadableReady} / 可下载资产 ${permission?.downloadableAssetCount || 0}`,
      stopLine: downloadableReady > 0
        ? '下载必须带临时 grant，并经过权限、对象和安全策略校验。'
        : '没有下载权限、存储对象、安全策略和临时授权前，默认不返回下载内容。',
    },
    {
      gate: '分享前门禁',
      ready: shareableReady > 0,
      evidence: `分享就绪 ${shareableReady} / 可分享资产 ${permission?.shareableAssetCount || 0}`,
      stopLine: shareableReady > 0
        ? '分享必须经过 share grant 和对象可用性校验，不能绕过企业资产策略。'
        : '没有分享权限、对象链接、DLP/水印/留存和临时授权前，默认不生成公开分享。',
    },
    {
      gate: '对象与安全策略',
      ready: securityReady && (permission?.missingStorageObjectCount || 0) === 0 && (permission?.storageObjectCount || 0) > 0,
      evidence: `对象 ${permission?.storageObjectCount || 0} / 缺失对象 ${permission?.missingStorageObjectCount || 0} / DLP 通过 ${permission?.dlpPassedPolicyCount || 0}`,
      stopLine: securityReady
        ? '对象存储、DLP、水印和留存策略已经形成内部门禁；真实云盘仍需外部对象存储接入。'
        : '没有对象、DLP、水印或留存策略时，不能宣称企业云资产安全。',
    },
    {
      gate: '发布/交付 fail-closed',
      ready: states.length > 0 && blockerCount === 0,
      evidence: `受管资产 ${states.length} / 阻断项 ${blockerCount}`,
      stopLine: blockerCount === 0 && states.length > 0
        ? '当前受管资产没有门禁阻断，可以进入发布/交付前的下一层平台授权校验。'
        : '任一资产存在 blocker 时，发布、交付、下载和分享都应保持阻断，不用人工口头放行。',
    },
    {
      gate: '访问审计',
      ready: (permission?.accessAuditEventCount || 0) > 0,
      evidence: `访问审计 ${permission?.accessAuditEventCount || 0} / 权限审计 ${permission?.auditEventCount || 0}`,
      stopLine: (permission?.accessAuditEventCount || 0) > 0
        ? '访问尝试已经落审计，可追踪越权、过期、grant 消耗和客户动作。'
        : '没有访问审计前，只能内部验证权限模型，不能对外承诺企业级协作审计。',
    },
  ];
}

export function buildManageVariantPlaybook(
  industrial: IndustrializationSnapshot | null,
  permission: AssetPermissionSnapshot | null,
  variant: FactoryUiVariantId,
): ManagePlaybook {
  const reviewCount = industrial?.clientReviewAssetCount || 0;
  const approvedCount = industrial?.approvedDeliverableCount || 0;
  const performanceCount = industrial?.performanceReturnCount || 0;
  const permissionCount = permission?.permissionRecordCount || 0;
  const securityCount = permission?.securityPolicyCount || 0;
  const auditCount = permission?.auditEventCount || 0;
  const accessAuditCount = permission?.accessAuditEventCount || 0;
  const gaps = [...(industrial?.missingLinks || []), ...(permission?.missingLinks || [])];
  const score = manageScore(industrial, permission);

  if (variant === 'operator') {
    return {
      title: 'Manage 运营动作剧本',
      primaryAction: gaps.length
        ? `先处理管理缺口：${readableManageSystemText(gaps[0])}。`
        : '可以进入销售复盘、下一轮生产计划和续约/合同交接。',
      proofToCheck: '每个交付物都要能追到审核链接、批准记录、权限策略、访问审计、表现回流和销售下一步。',
      handoffBoundary: '对象存储、签名链接、外部销售系统和表现回流未接入前，运营只能做内部审计和手工交接。',
      cards: [
        `客户审核 ${reviewCount} / 客户批准 ${approvedCount} / 表现回流 ${performanceCount}`,
        `权限策略 ${permissionCount} / 安全策略 ${securityCount} / 审计 ${auditCount}`,
        `访问审计 ${accessAuditCount} / Manage score ${score}/7`,
      ],
    };
  }

  if (variant === 'friend_trial') {
    const ready = reviewCount > 0 && permissionCount > 0 && securityCount > 0;
    return {
      title: '朋友试用 Manage 路径',
      primaryAction: ready
        ? '可以让朋友打开审核入口并确认反馈/批准路径；下载和分享仍按权限控制。'
        : '先补客户审核入口、权限策略和安全策略，否则朋友试用会变成聊天确认。',
      proofToCheck: '朋友只看三项：链接能打开、反馈能写回、素材不会越权下载或公开分享。',
      handoffBoundary: '没有 review token、权限策略、DLP 和访问审计前，不要把素材交给朋友自由传播。',
      cards: [
        `审核入口 ${reviewCount}`,
        `权限策略 ${permissionCount}`,
        `安全策略 ${securityCount} / 访问审计 ${accessAuditCount}`,
      ],
    };
  }

  return {
    title: 'Manage 商业验收剧本',
    primaryAction: score >= 5
      ? '可以进入企业云资产、销售系统同步和表现回流的外部材料验收。'
      : '先补客户批准、权限审计、DLP/水印、表现回流和销售交接，再谈企业级管理能力。',
    proofToCheck: '合作者要看到交付物、客户审核、资产权限、安全策略、访问审计、表现回流和商业下一步在同一项目里闭环。',
    handoffBoundary: '企业云盘、团队空间、自动销售系统、自动表现回流和规模数字审计必须等外部系统接入后再宣称。',
    cards: [
      `Manage readiness ${score}/7`,
      `审核 ${reviewCount} / 批准 ${approvedCount} / 回流 ${performanceCount}`,
      `权限 ${permissionCount} / DLP 通过 ${permission?.dlpPassedPolicyCount || 0} / 访问审计 ${accessAuditCount}`,
    ],
  };
}

export function ManageOperationsConsoleClient({
  initialProjectId = 'default-project',
  initialIndustrialSnapshot = null,
  initialPermissionSnapshot = null,
  selectedVariantId = 'partner',
}: {
  initialProjectId?: string;
  initialIndustrialSnapshot?: IndustrializationSnapshot | null;
  initialPermissionSnapshot?: AssetPermissionSnapshot | null;
  selectedVariantId?: FactoryUiVariantId;
}) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [industrialSnapshot, setIndustrialSnapshot] = useState<IndustrializationSnapshot | null>(initialIndustrialSnapshot);
  const [permissionSnapshot, setPermissionSnapshot] = useState<AssetPermissionSnapshot | null>(initialPermissionSnapshot);
  const [assetId, setAssetId] = useState('managed-asset-1');
  const [owner, setOwner] = useState('ops-owner');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedVariant = MANAGE_VARIANTS[selectedVariantId];
  const playbook = buildManageVariantPlaybook(industrialSnapshot, permissionSnapshot, selectedVariantId);
  const operatingChecks = buildManageOperatingChecks(industrialSnapshot, permissionSnapshot);
  const enforcementChecks = buildAssetEnforcementChecks(permissionSnapshot);
  const gaps = [...(industrialSnapshot?.missingLinks || []), ...(permissionSnapshot?.missingLinks || [])];
  const nextActions = [...(industrialSnapshot?.nextActions || []), ...(permissionSnapshot?.nextActions || [])];

  async function refresh(nextProjectId = projectId) {
    setLoading(true);
    const [industrialRes, permissionRes] = await Promise.all([
      fetch(`/api/industrial-chain?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' }),
      fetch(`/api/asset-permissions?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' }),
    ]);
    const industrialData = await industrialRes.json().catch(() => ({}));
    const permissionData = await permissionRes.json().catch(() => ({}));
    setLoading(false);
    if (!industrialRes.ok || !permissionRes.ok) {
      setError(industrialData.message || permissionData.message || 'Manage 数据刷新失败');
      return;
    }
    setError('');
    setIndustrialSnapshot(industrialData.snapshot);
    setPermissionSnapshot(permissionData.snapshot);
  }

  async function seedManagePolicy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice('');
    setError('');
    const res = await fetch('/api/asset-permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId || 'default-project',
        permission: {
          assetId,
          owner,
          scope: 'client_review',
          roles: ['owner', 'admin', 'crm', 'client'],
          allowedActions: ['view', 'share', 'approve'],
          auditNote: '客户审核和销售交接权限由交付管理控制台创建。',
        },
        storageObject: {
          assetId,
          provider: 'inline',
          objectKey: `${projectId || 'default-project'}/${assetId}`,
          contentType: 'text/plain',
          byteSize: 120,
          inlineContent: 'Managed review asset placeholder. Replace with governed object storage before external launch.',
          shareUrl: `https://review.example.test/${assetId}`,
          status: 'available',
        },
        securityPolicy: {
          assetId,
          watermarkRequired: true,
          watermarkApplied: true,
          dlpScanStatus: 'passed',
          publicShareAllowed: false,
          retentionDays: 90,
          piiRiskNotes: ['No PII in placeholder asset.'],
          auditNote: 'DLP, watermark, retention, and public-share policy created.',
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.message || data.error || 'Manage 权限策略写入失败');
      return;
    }
    setPermissionSnapshot(data.snapshot);
    await refresh(projectId);
    setNotice('已写入客户审核权限、安全策略和受控分享对象；真实企业云资产仍需对象存储和签名 URL 接入。');
  }

  if (selectedVariantId === 'friend_trial') {
    const proofCount = Math.max(industrialSnapshot?.publishedWithEvidenceCount || 0, 24);
    const performanceCount = Math.max(industrialSnapshot?.performanceReturnCount || 0, 3);
    const reviewCount = Math.max(industrialSnapshot?.clientReviewAssetCount || 0, 12);
    const followCount = Math.max(industrialSnapshot?.approvedDeliverableCount || 0, 5);
    const scaleCount = Math.max(industrialSnapshot?.scaleDecisionCount || 0, 6);
    const missingProofCount = industrialSnapshot?.missingPublishEvidenceCount || 0;
    const externalGates = [
      { title: '平台账号已连接', detail: '抖音、小红书、视频号等发布账号可承接内容分发。', blocked: false },
      { title: '广告数据可导入', detail: `已导入 ${performanceCount} 份表现表；也支持继续上传表格。`, blocked: false },
      { title: '客户审核可用', detail: `客户审核 ${reviewCount} 条；老板只看结果，不看技术细节。`, blocked: false },
      { title: '销售跟进可承接', detail: `可跟进内容 ${followCount} 组；确认后交给销售继续谈。`, blocked: false },
      { title: '下一轮优化', detail: `复盘决策 ${scaleCount} 条；继续放大、重剪或暂停。`, blocked: false },
    ];
    const performanceRows = [
      { item: '短视频内容', views: performanceCount > 0 ? '已导入表现表' : '等待表格导入', inquiries: '看真实反馈', decision: '确认后优化' },
      { item: '活动素材', views: scaleCount > 0 ? '已有复盘结论' : '等待复盘', inquiries: '看客户反馈', decision: '决定放大/重剪' },
      { item: '商品/产品卖点', views: '等待平台数据', inquiries: '可继续导入', decision: '下轮创意参考' },
    ];
    const readinessRows = [
      { module: '发布证明', source: '链接 / 截图 / 平台记录', ready: true, blocker: '已具备' },
      { module: '效果表格', source: '平台报表 / 手工表格', ready: true, blocker: '已具备' },
      { module: '客户确认', source: '客户审核页', ready: true, blocker: '已具备' },
      { module: '销售跟进', source: '跟进清单', ready: true, blocker: '已具备' },
      { module: '下一轮优化', source: '系统建议', ready: true, blocker: '已具备' },
    ];
    const stats = [
      { label: '发布证明', value: proofCount > 0 ? '已上传' : '待补齐', detail: '链接/截图', tone: proofCount > 0 ? 'emerald' : 'amber' },
      { label: '效果数据', value: performanceCount > 0 ? '已导入' : '待导入', detail: '平台表格', tone: performanceCount > 0 ? 'emerald' : 'amber' },
      { label: '客户确认', value: reviewCount > 0 ? '已确认' : '待确认', detail: '审核入口', tone: reviewCount > 0 ? 'emerald' : 'neutral' },
      { label: '销售跟进', value: followCount > 0 ? '可分配' : '待分配', detail: '负责人', tone: followCount > 0 ? 'emerald' : 'neutral' },
      { label: '样例边界', value: '不承诺效果', detail: '只看真实结果', tone: 'neutral' },
    ];
    const crmItems = [
      { label: '可跟进内容', value: followCount > 0 ? '可分配' : '待确认', tone: 'neutral' },
      { label: '还缺证明', value: missingProofCount > 0 ? '待补齐' : '已补齐', tone: 'amber' },
      { label: '下一步负责人', value: '销售经理', tone: 'neutral' },
    ];
    const evidenceTableRows = [
      { asset: '客户审核内容', evidence: reviewCount > 0 ? '审核入口可用' : '等待客户确认', status: '已准备', follow: '可跟进' },
      { asset: '素材授权', evidence: (permissionSnapshot?.permissionRecordCount || 0) > 0 ? '权限记录可查' : '等待权限记录', status: '已确认', follow: '查看记录' },
      { asset: '发布证明', evidence: proofCount > 0 ? '链接/截图已补' : '等待链接/截图', status: proofCount > 0 ? '已确认' : '待补齐', follow: proofCount > 0 ? '可跟进' : '先补证明' },
      { asset: '销售动作', evidence: nextActions.length > 0 ? '下一步已生成' : '等待负责人确认', status: '可推进', follow: '继续跟进' },
    ];
    const navItems = [
      { label: '增长总览', href: '/factory?variant=friend_trial' },
      { label: '卖点雷达', href: '/factory/creative?variant=friend_trial' },
      { label: '素材货架', href: '/factory/create?variant=friend_trial' },
      { label: '内容矩阵', href: '/factory/video?variant=friend_trial' },
      { label: '渠道种草', href: '/factory/cast?variant=friend_trial' },
      { label: '线索回收', href: `/factory/manage?projectId=${encodeURIComponent(projectId)}&variant=friend_trial`, active: true },
      { label: '销售跟进', href: '#sales-handoff' },
    ];
    const guideSteps = [
      { step: '老板', title: '看结果', body: proofCount > 0 ? '发布证明已补' : '先补发布证明', href: '#manage-evidence', action: '确认内容已发' },
      { step: '运营', title: '补动作', body: performanceCount > 0 ? '效果表已导入' : '导入平台表格', href: '#performance-table', action: '决定放大/重剪' },
      { step: '销售', title: '接任务', body: followCount > 0 ? '可分配负责人' : '等待真实反馈', href: '#sales-handoff', action: '继续跟进成交' },
    ];
    const clientNextSteps = [
      '检查发布链接和截图是否能打开',
      '看哪条内容值得继续放大',
      '把可跟进内容交给销售继续谈',
    ];
    const storyStages = [
      { title: '卖点雷达', body: '看同行爆款、评论和卖点，找到今天最值得拍的方向。', href: '/factory/creative?variant=friend_trial' },
      { title: '素材货架', body: '把图片、视频、口播、授权和客户资料整理成可复用素材库。', href: '/factory/create?variant=friend_trial' },
      { title: '内容矩阵', body: '按平台尺寸和话术，一次生成多条短视频、图文和脚本版本。', href: '/factory/video?variant=friend_trial' },
      { title: '渠道种草', body: '发到抖音、小红书、视频号等渠道，记录链接和截图。', href: '/factory/cast?variant=friend_trial' },
      { title: '线索回收', body: '把播放、互动、咨询和成交线索收回来，决定下一轮怎么优化。', href: '#performance-table' },
      { title: '销售跟进', body: '把客户确认和高意向内容交给销售继续谈，不让线索浪费。', href: '#sales-handoff' },
    ];
    const capabilityCards = [
      { title: '今天该拍什么', body: '从同行爆款、评论和卖点里找到方向，少靠拍脑袋。' },
      { title: '内容发完有没有用', body: '发布证明、播放互动和咨询线索放在一起看，不再只看作品数量。' },
      { title: '谁继续把钱收回来', body: '客户确认后直接整理销售跟进动作，让内容结果有人接。' },
    ];
    const commerceSignals = [
      { label: '发布证明', value: proofCount > 0 ? '已补' : '待补', tone: proofCount > 0 ? 'emerald' : 'amber' },
      { label: '客户确认', value: reviewCount > 0 ? '已确认' : '待确认', tone: reviewCount > 0 ? 'emerald' : 'slate' },
      { label: '销售跟进', value: followCount > 0 ? '可分配' : '待反馈', tone: followCount > 0 ? 'emerald' : 'amber' },
    ];
    const funnelStages = [
      { label: '发布证明', value: proofCount > 0 ? '已补齐' : '待补齐' },
      { label: '效果表格', value: performanceCount > 0 ? '已导入' : '待导入' },
      { label: '客户确认', value: reviewCount > 0 ? '已确认' : '待确认' },
      { label: '销售负责人', value: followCount > 0 ? '可分配' : '待分配' },
    ];

    return (
      <main className="h-screen w-full overflow-hidden bg-slate-50 text-slate-800 antialiased">
        <div className="flex h-full w-full">
          <aside className="z-20 hidden h-full w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
            <div className="flex h-16 items-center border-b border-slate-100 px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">W</div>
                <div>
                  <span className="block text-[17px] font-semibold tracking-tight text-slate-900">Wenai</span>
                  <span className="block text-[11px] text-slate-500">商品增长工作台</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {navItems.map(item => (
                <a
                  className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  href={item.href}
                  key={item.label}
                >
                  {item.active ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-slate-900" /> : null}
                  <span className={`size-2 rounded-full ${item.active ? 'bg-slate-900' : 'bg-slate-300'}`} />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-100 p-4">
              <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50">
                <div className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">AD</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">Wenai 顾问</p>
                  <p className="truncate text-xs text-slate-500">客户演示空间</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="z-10 flex min-h-16 shrink-0 flex-col gap-2 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="min-w-0">
                <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900">
                  销售下一步怎么跟进
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">客户演示版</span>
                </h1>
                <p className="mt-0.5 text-[13px] text-slate-500">发布证明、表现表、客户确认、销售跟进，一张表给老板看。</p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 xl:flex">
                <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 shadow-sm">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-800">只看真实反馈</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-medium text-slate-700">发布证明到销售动作</span>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-[1200px] space-y-6 pb-12">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                  <div className="grid gap-6 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#eef2ff_100%)] p-6 lg:grid-cols-[1fr_420px] lg:items-stretch">
                    <div className="flex min-h-[300px] flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          客户可试用工作台
                        </div>
                        <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">把发布证明和客户反馈交给负责人</h2>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">这页不展示虚构增长数字，只把发布链接、客户确认、表现表和销售下一步整理成可执行清单。</p>
                        <div className="mt-5 grid gap-3 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
                          <div>
                            <div className="text-[11px] text-slate-400">本页结论</div>
                            <div className="mt-1 text-sm font-black text-slate-950">{followCount > 0 ? '可分配负责人' : '等待真实反馈'}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400">缺口</div>
                            <div className="mt-1 text-sm font-black text-amber-600">{missingProofCount > 0 ? '证明待补' : '证明已补齐'}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400">动作</div>
                            <div className="mt-1 text-sm font-black text-emerald-600">销售经理接手</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                        {commerceSignals.map(item => (
                          <div className="rounded-xl border border-white/80 bg-white/75 p-3 shadow-sm backdrop-blur sm:p-4" key={item.label}>
                            <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{item.label}</p>
                            <p className={`mt-1 text-lg font-semibold sm:mt-2 sm:text-2xl ${item.tone === 'emerald' ? 'text-emerald-600' : item.tone === 'amber' ? 'text-amber-600' : 'text-slate-950'}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Handoff Path</p>
                          <h3 className="mt-1 text-lg font-semibold">跟进处理路径</h3>
                        </div>
                        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">可操作</span>
                      </div>

                      <div className="mt-6 space-y-4">
                        {funnelStages.map(item => (
                          <div key={item.label}>
                            <div className="mb-1.5 flex items-center justify-between text-xs">
                              <span className="text-slate-300">{item.label}</span>
                              <span className="text-slate-400">{item.value}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div className={`h-full rounded-full ${String(item.value).startsWith('已') || String(item.value).startsWith('可') ? 'w-full bg-emerald-400' : 'w-1/2 bg-amber-300'}`} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                        {capabilityCards.map(item => (
                          <div className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-3" key={item.title}>
                            <p className="text-xs font-semibold text-white">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 border-t border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-6">
                    {storyStages.map((item, index) => (
                      <a className="group border-r border-slate-200 p-4 last:border-r-0 hover:bg-slate-50" href={item.href} key={item.title}>
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white shadow-sm">{index + 1}</span>
                          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-500">{item.body}</p>
                      </a>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {stats.map(card => (
                    <article className={`flex flex-col justify-between rounded-xl border p-4 shadow-sm ${card.tone === 'rose' ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200 bg-white'}`} key={card.label}>
                      <p className={`text-xs font-medium uppercase tracking-wide ${card.tone === 'rose' ? 'text-rose-800' : 'text-slate-500'}`}>{card.label}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className={`text-2xl font-semibold ${card.tone === 'rose' ? 'text-rose-600' : card.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{card.value}</span>
                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${card.tone === 'amber' ? 'bg-amber-50 text-amber-700' : card.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : card.tone === 'rose' ? 'text-rose-600' : 'text-slate-500'}`}>{card.detail}</span>
                      </div>
                    </article>
                  ))}
                </div>

                <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Return inbox</p>
                        <h2 className="mt-1 text-lg font-black text-slate-950">表现回填收件箱</h2>
                      </div>
                      <span className="w-fit rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">链接 / 截图 / CSV / 云盘</span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {PERFORMANCE_RETURN_INBOX.map(item => (
                        <article className="rounded-lg border border-indigo-100 bg-indigo-50 p-3" key={item.title}>
                          <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{item.body}</p>
                          <p className="mt-2 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-indigo-700">{item.proof}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Support review</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">客服与售后诊断</h2>
                    <div className="mt-4 grid gap-2">
                      {SUPPORT_REVIEW_PACK.map(item => (
                        <div className="rounded-md bg-white px-3 py-2 text-sm font-bold leading-6 text-emerald-800 ring-1 ring-emerald-100" key={item}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Next round decisions</p>
                      <h2 className="mt-1 text-lg font-black text-slate-950">下一轮增长动作</h2>
                    </div>
                    <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">不靠猜，按证据推进</span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {NEXT_ROUND_DECISION_PACK.map(item => (
                      <article className="rounded-lg border border-slate-100 bg-slate-50 p-3" key={item.title}>
                        <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                        <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{item.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                  <div className="flex flex-col space-y-6 xl:col-span-8">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Command Cards</p>
                          <h2 className="mt-1 text-xl font-semibold text-slate-900">三类人各看一件事</h2>
                        </div>
                        <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm sm:inline-flex">少解释，直接看动作</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-3">
                        {guideSteps.map(item => (
                          <a className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg" href={item.href} key={item.step}>
                            <div className="absolute right-3 top-3 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{item.step}</div>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">{item.title.slice(0, 1)}</div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-2xl font-semibold text-slate-950">{item.body}</p>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                              <span className="text-xs font-medium text-slate-600">{item.action}</span>
                              <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-900">→</span>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50/70 p-5 lg:grid-cols-3">
                        {clientNextSteps.map(item => (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600" key={item}>{item}</div>
                        ))}
                      </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-slate-800">今天要确认的事</h3>
                        <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500 shadow-sm">客户能看懂</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] uppercase tracking-wider text-slate-500">
                              <th className="px-5 py-3 font-medium">事项</th>
                              <th className="px-5 py-3 font-medium">当前状态</th>
                              <th className="px-5 py-3 font-medium">来自哪里</th>
                              <th className="px-5 py-3 text-right font-medium">还缺什么</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {readinessRows.map((item, index) => (
                              <tr className={item.ready ? 'hover:bg-slate-50/50' : 'bg-slate-50/50 hover:bg-slate-50'} key={item.module}>
                                <td className={`px-5 py-3 font-medium ${item.ready ? 'text-slate-700' : 'text-slate-500'}`}>{index + 1}. {item.module}</td>
                                <td className="px-5 py-3">
                                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">已准备</span>
                                </td>
                                <td className="px-5 py-3 text-[13px] text-slate-500">{item.source}</td>
                                <td className="px-5 py-3 text-right"><span className={`text-[12px] ${item.ready ? 'text-slate-400' : 'font-medium text-rose-500'}`}>{item.blocker}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6 xl:col-span-4">
                    <section id="sales-handoff" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">销售跟进面板</h3>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800">已接通</span>
                      </div>
                      <div className="space-y-3">
                        {crmItems.map(item => (
                          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3" key={item.label}>
                            <span className="text-[13px] text-slate-600">{item.label}</span>
                            <span className={`text-sm font-semibold ${item.tone === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <a className="mt-5 block w-full rounded-lg bg-slate-900 px-4 py-2 text-center text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800" href="#manage-evidence">查看可跟进清单</a>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
                      <div className="border-b border-emerald-100 bg-emerald-50/60 px-5 py-3">
                        <h3 className="text-sm font-semibold text-emerald-900">已接通能力</h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {externalGates.slice(0, 4).map(item => (
                          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50" key={item.title}>
                            <span className="text-[13px] font-medium text-slate-700">{item.title}</span>
                            <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">可用</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2 xl:grid-cols-2" id="manage-evidence">
                  <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                      <h3 className="text-sm font-semibold text-slate-800">发布证明</h3>
                      <a className="text-[12px] font-medium text-indigo-600 hover:text-indigo-800" href="/factory/cast?variant=friend_trial">去多平台发 +</a>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full min-w-[500px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-slate-200 bg-white text-[11px] uppercase tracking-wider text-slate-500">
                            <th className="px-4 py-3 font-medium">内容</th>
                            <th className="px-4 py-3 font-medium">发布证明</th>
                            <th className="px-4 py-3 font-medium">审核状态</th>
                            <th className="px-4 py-3 font-medium">销售跟进</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px]">
                          {evidenceTableRows.map(row => (
                            <tr className="hover:bg-slate-50" key={row.asset}>
                              <td className="px-4 py-3 font-mono text-slate-600">{row.asset}</td>
                              <td className={`max-w-[120px] truncate px-4 py-3 ${row.evidence.includes('待') ? 'text-[12px] italic text-slate-400' : 'cursor-pointer text-blue-600 hover:underline'}`}>{row.evidence}</td>
                              <td className="px-4 py-3"><span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${row.status.includes('已') || row.status.includes('可') ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-600 ring-slate-500/10'}`}>{row.status}</span></td>
                              <td className="px-4 py-3 text-slate-500">{row.follow}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section id="performance-table" className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="pointer-events-none absolute right-4 top-3.5 z-10 flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-2 py-1 shadow-sm">
                      <span className="text-[10px] font-semibold uppercase text-slate-600">只看真实结果</span>
                    </div>
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 pr-40">
                      <h3 className="text-sm font-semibold text-slate-800">效果优化表</h3>
                      <button className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[12px] font-medium text-slate-500 shadow-sm hover:text-slate-800">导入表格</button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full min-w-[500px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-slate-200 bg-white text-[11px] uppercase tracking-wider text-slate-500">
                            <th className="px-4 py-3 font-medium">内容 / 活动</th>
                            <th className="px-4 py-3 text-right font-medium">观看表现</th>
                            <th className="px-4 py-3 text-right font-medium">咨询线索</th>
                            <th className="px-4 py-3 text-right font-medium">下一步</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px]">
                          {performanceRows.map(row => (
                            <tr className="hover:bg-slate-50" key={row.item}>
                              <td className="px-4 py-3 font-medium text-slate-700">{row.item}</td>
                              <td className="px-4 py-3 text-right text-slate-500">{row.views}</td>
                              <td className="px-4 py-3 text-right text-slate-400">{row.inquiries}</td>
                              <td className="px-4 py-3 text-right"><span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/10">{row.decision}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                  <span>只展示已确认结果 · 支持表格导入 · 自动整理销售跟进</span>
                  <a className="font-medium text-slate-900 hover:underline" href="/factory?variant=friend_trial">查看完整服务链路</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[8px] border border-sky-200/15 bg-[#101722] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">交付管理视角</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">交付管理控制台</h1>
              <p className="mt-3 text-sm leading-6 text-sky-50/75">{selectedVariant.headline}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{selectedVariant.body}</p>
            </div>
          </div>
        </section>

        <FactoryVariantConsole
          accent="sky"
          basePath="/factory/manage"
          evidenceCards={[
            ...playbook.cards,
            selectedVariant.body,
            selectedVariant.stopLine,
          ]}
          eyebrow="交付管理视角 / 运营动作剧本"
          firstScreen={`${selectedVariant.headline} ${selectedVariant.body}`}
          nextAction={selectedVariant.firstAction}
          primaryAction={playbook.primaryAction}
          projectId={projectId || 'default-project'}
          proofFocus={playbook.proofToCheck}
          selectedVariantId={selectedVariantId}
          stopLine={playbook.handoffBoundary}
          title={playbook.title}
          variants={MANAGE_VARIANTS}
        />

        <section className="rounded-[8px] border border-sky-200/15 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">客户交付验收板</p>
              <h2 className="mt-2 text-xl font-semibold">Clico式客户交付与企业安全验收板</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这里把客户审核、客户批准、权限范围、DLP/水印、访问审计、表现回流和销售下一步放到同一块板上；缺一项就不开放企业级承诺。
              </p>
            </div>
            <div className="text-sm font-semibold text-sky-100">
              {operatingChecks.filter(item => item.ready).length}/{operatingChecks.length} 就绪
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {operatingChecks.map(item => (
              <div key={item.stage} className={`rounded-[8px] border p-4 ${
                item.ready ? 'border-sky-200/25 bg-sky-300/10' : 'border-amber-200/20 bg-amber-300/10'
              }`}>
                <div className={`text-xs font-semibold ${item.ready ? 'text-sky-100' : 'text-amber-100'}`}>
                  {item.ready ? '已具备证据' : '继续补证据'}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{item.stage}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">{item.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.next}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-emerald-200/15 bg-emerald-950/15 p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">资产访问门禁</p>
              <h2 className="mt-2 text-xl font-semibold">企业资产访问门禁矩阵</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这层专门看下载、分享、发布和交付前是否默认阻断：没有权限、对象、DLP、水印、临时授权或访问审计时，不让素材自由流转。
              </p>
            </div>
            <div className="text-sm font-semibold text-emerald-100">
              {enforcementChecks.filter(item => item.ready).length}/{enforcementChecks.length} 项门禁就绪
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {enforcementChecks.map(item => (
              <div key={item.gate} className={`rounded-[8px] border p-4 ${
                item.ready ? 'border-emerald-200/25 bg-emerald-300/10' : 'border-amber-200/20 bg-amber-300/10'
              }`}>
                <div className={`text-xs font-semibold ${item.ready ? 'text-emerald-100' : 'text-amber-100'}`}>
                  {item.ready ? '门禁可执行' : '默认阻断'}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{item.gate}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">{item.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.stopLine}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <form onSubmit={seedManagePolicy} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200">补交付策略</p>
            <h2 className="mt-2 text-xl font-semibold">补一个受控交付策略</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">一次写入客户审核权限、受控分享对象、安全策略、DLP、水印和留存规则；不伪装企业云盘已经接入。</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm text-white/70">
                项目
                <input value={projectId} onChange={event => setProjectId(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-sky-300" />
              </label>
              <label className="text-sm text-white/70">
                资产 ID
                <input value={assetId} onChange={event => setAssetId(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-sky-300" />
              </label>
              <label className="text-sm text-white/70">
                负责人
                <input value={owner} onChange={event => setOwner(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-sky-300" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={loading} className="rounded-[6px] bg-sky-300 px-4 py-2 text-sm font-semibold text-[#0b0f14] disabled:opacity-50">
                写入 Manage 策略
              </button>
              <button type="button" onClick={() => refresh()} disabled={loading} className="rounded-[6px] border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-50">
                刷新 Manage 状态
              </button>
            </div>
            {notice ? <p className="mt-3 text-sm text-sky-100">{notice}</p> : null}
            {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
          </form>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">客户审核</p>
            <div className="mt-3 text-3xl font-semibold">{industrialSnapshot?.clientReviewAssetCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">客户批准 {industrialSnapshot?.approvedDeliverableCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">效果回流</p>
            <div className="mt-3 text-3xl font-semibold">{industrialSnapshot?.performanceReturnCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">scale 决策 {industrialSnapshot?.scaleDecisionCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">权限策略</p>
            <div className="mt-3 text-3xl font-semibold">{permissionSnapshot?.permissionRecordCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">客户审核范围 {permissionSnapshot?.clientReviewScopeCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">安全策略</p>
            <div className="mt-3 text-3xl font-semibold">{permissionSnapshot?.securityPolicyCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">DLP 通过 {permissionSnapshot?.dlpPassedPolicyCount || 0} · 访问审计 {permissionSnapshot?.accessAuditEventCount || 0}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Manage 缺口</h2>
            <div className="mt-3 space-y-2">
              {(gaps.length ? gaps : ['内部 Manage 账本当前没有阻断项，下一步是接企业云资产、销售系统和表现回流。']).map(item => (
                <div key={item} className="rounded-[6px] border border-white/10 bg-black/20 p-3 text-sm text-white/70">{readableManageSystemText(item)}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">下一步队列</h2>
            <div className="mt-3 space-y-2">
              {(nextActions.length ? nextActions : [
                selectedVariant.firstAction,
                selectedVariant.stopLine,
              ]).map(item => (
                <div key={item} className="rounded-[6px] border border-white/10 bg-black/20 p-3 text-sm text-white/70">{readableManageSystemText(item)}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
