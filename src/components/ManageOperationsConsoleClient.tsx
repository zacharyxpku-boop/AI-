'use client';

import { useState, type FormEvent } from 'react';

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

const MANAGE_VARIANT_ORDER: FactoryUiVariantId[] = ['partner', 'operator', 'friend_trial'];

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
            <div className="flex flex-wrap gap-2">
              {MANAGE_VARIANT_ORDER.map(variant => (
                <a
                  key={variant}
                  href={`/factory/manage?projectId=${encodeURIComponent(projectId)}&variant=${variant}`}
                  className={`rounded-[6px] border px-3 py-2 text-sm transition ${variant === selectedVariantId
                    ? 'border-sky-300 bg-sky-300 text-[#0b0f14]'
                    : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-sky-200/50 hover:text-white'
                  }`}
                >
                  {MANAGE_VARIANTS[variant].label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Manage Action Playbook</p>
            <h2 className="mt-2 text-xl font-semibold">{playbook.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">{playbook.primaryAction}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {playbook.cards.map(card => (
                <div key={card} className="rounded-[6px] border border-white/10 bg-black/20 p-3 text-sm text-white/75">
                  {card}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[6px] border border-cyan-200/20 bg-cyan-200/[0.06] p-3">
                <div className="text-xs font-semibold text-cyan-100">Proof to check</div>
                <p className="mt-1 text-sm leading-6 text-cyan-50/75">{playbook.proofToCheck}</p>
              </div>
              <div className="rounded-[6px] border border-amber-200/25 bg-amber-200/[0.07] p-3">
                <div className="text-xs font-semibold text-amber-100">Boundary</div>
                <p className="mt-1 text-sm leading-6 text-amber-50/75">{playbook.handoffBoundary}</p>
              </div>
            </div>
          </div>

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
