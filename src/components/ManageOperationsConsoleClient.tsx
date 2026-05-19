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
    audience: '看 Wenai 是否有客户审核、CRM 交接、资产权限、审计和表现回流的管理闭环。',
    headline: 'Manage 是把交付从“发文件”升级成可审计运营系统。',
    body: '这一层检查客户 review、交付批准、权限策略、DLP、水印、下载/分享授权、访问审计和表现回流，证明 Wenai 不只是内容生成器。',
    firstAction: '先看客户批准、权限审计、DLP 和表现回流是否同时存在，再判断是否可给合作者做商用演示。',
    stopLine: '没有真实对象存储、签名 URL、团队空间和外部 CRM/analytics sync 前，不能宣称企业云盘或自动运营中台。',
  },
  operator: {
    label: '运营视角',
    audience: '给内部运营每天收口客户审核、权限、回流、CRM 下一步和阻断项。',
    headline: 'Manage 的运营任务是让每个交付物都有负责人、权限、证据和下一步。',
    body: '运营只看四类缺口：客户没批、权限没闭、审计没留、回流没进。补齐后才进入复盘、续约或下一轮生产。',
    firstAction: '先补权限和客户审核缺口；没有 audit trail 时，不要把项目标记为企业级可交付。',
    stopLine: '外部云资产或 CRM 未接入时，只能做内部账本和手工交接，不能说已经企业级自动协同。',
  },
  friend_trial: {
    label: '朋友试用视角',
    audience: '给非技术朋友看能不能打开审核链接、反馈、批准，并确认不会乱泄露素材。',
    headline: '朋友只需要知道：能不能看、能不能批、会不会丢。',
    body: '这一视角隐藏 RBAC、DLP 和审计术语，只展示审核入口、批准状态、下载/分享是否受控和下一步是否明确。',
    firstAction: '先准备一个客户审核入口和一个受控分享资产；没有权限记录时不要让朋友下载或转发。',
    stopLine: '没有客户 review token、受控分享和访问审计时，只能内部试用，不能给非技术朋友自由流转。',
  },
};

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
        ? '批准后推进 CRM 交接、分发门禁和表现回流。'
        : '先补客户批准或返修结论；没有批准不能进入发布/CRM 闭环。',
    },
    {
      stage: '权限范围与受控分享',
      ready: permissionCount > 0 && clientScopeCount > 0,
      evidence: `权限策略 ${permissionCount} 条 / 客户审核范围 ${clientScopeCount} 条`,
      next: permissionCount > 0
        ? '把 download/share/publish/approve 都接入权限检查，失败默认关闭。'
        : '先写入资产权限策略；没有权限账本不能宣称企业级数据安全。',
    },
    {
      stage: 'DLP / 水印 / 留存',
      ready: dlpReady && watermarkReady && (permission?.retentionPolicyCount || 0) > 0,
      evidence: `安全策略 ${securityCount} / DLP 通过 ${permission?.dlpPassedPolicyCount || 0} / 水印 ${permission?.watermarkAppliedCount || 0}`,
      next: dlpReady && watermarkReady
        ? '继续接真实对象存储、签名 URL、DLP provider 和水印服务。'
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
        ? '把结果反哺品牌学习、下一轮生产计划和 CRM 续约动作。'
        : '补 analytics sync 或手工表现导入；没有回流不能宣称自动优化。',
    },
    {
      stage: 'CRM / 下一步队列',
      ready: gaps.length === 0,
      evidence: gaps.length ? `阻断 ${gaps.length} 项 / 动作 ${nextActions.length} 条` : `动作队列 ${nextActions.length} 条 / 无硬阻断`,
      next: gaps.length
        ? `先处理：${gaps[0]}。`
        : '进入企业云资产、外部 CRM 和 analytics sync 接入验收。',
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
      evidence: `download-ready ${downloadableReady} / downloadable assets ${permission?.downloadableAssetCount || 0}`,
      stopLine: downloadableReady > 0
        ? '下载必须带临时 grant，并经过权限、对象和安全策略校验。'
        : '没有 download permission、storage object、security policy 和临时 grant 前，默认不返回下载内容。',
    },
    {
      gate: '分享前门禁',
      ready: shareableReady > 0,
      evidence: `share-ready ${shareableReady} / shareable assets ${permission?.shareableAssetCount || 0}`,
      stopLine: shareableReady > 0
        ? '分享必须经过 share grant 和对象可用性校验，不能绕过企业资产策略。'
        : '没有 share permission、对象 URL、DLP/水印/留存和 grant 前，默认不生成公开分享。',
    },
    {
      gate: '对象与安全策略',
      ready: securityReady && (permission?.missingStorageObjectCount || 0) === 0 && (permission?.storageObjectCount || 0) > 0,
      evidence: `objects ${permission?.storageObjectCount || 0} / missing objects ${permission?.missingStorageObjectCount || 0} / DLP passed ${permission?.dlpPassedPolicyCount || 0}`,
      stopLine: securityReady
        ? '对象存储、DLP、水印和留存策略已经形成内部门禁；真实云盘仍需外部对象存储接入。'
        : '没有对象、DLP、水印或留存策略时，不能宣称企业云资产安全。',
    },
    {
      gate: '发布/交付 fail-closed',
      ready: states.length > 0 && blockerCount === 0,
      evidence: `governed assets ${states.length} / blockers ${blockerCount}`,
      stopLine: blockerCount === 0 && states.length > 0
        ? '当前受管资产没有门禁阻断，可以进入发布/交付前的下一层平台授权校验。'
        : '任一资产存在 blocker 时，发布、交付、下载和分享都应保持阻断，不用人工口头放行。',
    },
    {
      gate: '访问审计',
      ready: (permission?.accessAuditEventCount || 0) > 0,
      evidence: `access audits ${permission?.accessAuditEventCount || 0} / permission audits ${permission?.auditEventCount || 0}`,
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
        ? `先处理管理缺口：${gaps[0]}。`
        : '可以进入 CRM 复盘、下一轮生产计划和续约/合同交接。',
      proofToCheck: '每个交付物都要能追到 review link、approval、permission policy、access audit、performance return 和 CRM next step。',
      handoffBoundary: '对象存储、签名 URL、外部 CRM 和 analytics sync 未接入前，运营只能做内部审计和手工交接。',
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
      ? '可以进入企业云资产、CRM 同步和 analytics sync 的外部材料验收。'
      : '先补客户批准、权限审计、DLP/水印、表现回流和 CRM handoff，再谈企业级管理能力。',
    proofToCheck: '合作者要看到交付物、客户审核、资产权限、安全策略、访问审计、表现回流和商业下一步在同一项目里闭环。',
    handoffBoundary: '企业云盘、团队空间、自动 CRM、自动 analytics 和规模数字审计必须等外部系统接入后再宣称。',
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
          auditNote: 'Client review and CRM handoff permission created from Manage console.',
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

  return (
    <main className="min-h-screen bg-[#0b0f14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[8px] border border-sky-200/15 bg-[#101722] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Manage Operations Variant</p>
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
          eyebrow="Manage Operations Variant / Manage Action Playbook"
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
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Clico-style Manage Board</p>
              <h2 className="mt-2 text-xl font-semibold">Clico式客户交付与企业安全验收板</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这里把客户审核、客户批准、权限范围、DLP/水印、访问审计、表现回流和 CRM 下一步放到同一块板上；缺一项就不开放企业级承诺。
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
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Asset Enforcement Matrix</p>
              <h2 className="mt-2 text-xl font-semibold">企业资产访问门禁矩阵</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这层专门看 download/share/publish/交付前是否 fail-closed：没有权限、对象、DLP、水印、临时 grant 或访问审计时，不让素材自由流转。
              </p>
            </div>
            <div className="text-sm font-semibold text-emerald-100">
              {enforcementChecks.filter(item => item.ready).length}/{enforcementChecks.length} enforcement ready
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
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Manage Seed</p>
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
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Review</p>
            <div className="mt-3 text-3xl font-semibold">{industrialSnapshot?.clientReviewAssetCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">客户批准 {industrialSnapshot?.approvedDeliverableCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Returns</p>
            <div className="mt-3 text-3xl font-semibold">{industrialSnapshot?.performanceReturnCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">scale 决策 {industrialSnapshot?.scaleDecisionCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Permissions</p>
            <div className="mt-3 text-3xl font-semibold">{permissionSnapshot?.permissionRecordCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">客户审核范围 {permissionSnapshot?.clientReviewScopeCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Security</p>
            <div className="mt-3 text-3xl font-semibold">{permissionSnapshot?.securityPolicyCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">DLP 通过 {permissionSnapshot?.dlpPassedPolicyCount || 0} · 访问审计 {permissionSnapshot?.accessAuditEventCount || 0}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Manage 缺口</h2>
            <div className="mt-3 space-y-2">
              {(gaps.length ? gaps : ['内部 Manage 账本当前没有阻断项，下一步是接企业云资产、CRM 和 analytics sync。']).map(item => (
                <div key={item} className="rounded-[6px] border border-white/10 bg-black/20 p-3 text-sm text-white/70">{item}</div>
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
                <div key={item} className="rounded-[6px] border border-white/10 bg-black/20 p-3 text-sm text-white/70">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
