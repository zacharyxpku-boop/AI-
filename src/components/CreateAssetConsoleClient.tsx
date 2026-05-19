'use client';

import { useState, type FormEvent } from 'react';

import { FactoryVariantConsole } from '@/components/FactoryVariantConsole';
import type { IndustrializationSnapshot } from '@/lib/industrial-chain-store';
import type { FactoryUiVariantId } from '@/lib/factory-readiness-view';

type CreatePlaybook = {
  title: string;
  primaryAction: string;
  proofToCheck: string;
  handoffBoundary: string;
  cards: string[];
};

const CREATE_VARIANTS: Record<FactoryUiVariantId, {
  label: string;
  audience: string;
  headline: string;
  body: string;
  firstAction: string;
  stopLine: string;
}> = {
  partner: {
    label: '合作者视角',
    audience: '看 Wenai 是否把 brief、脚本、素材、生产交接和客户验收串成 Create 层能力。',
    headline: 'Create 不是一键生成按钮，而是可追溯的资产生产账本。',
    body: '这一层把商品 brief、benchmark、脚本、图片/视频资产、production handoff、版权状态和客户交付状态放在同一条链路里，避免只有前端按钮没有真实生产记录。',
    firstAction: '先看资产账本是否覆盖 brief、benchmark、视觉资产和交付物，再判断是否可以接真实视频/图片 provider。',
    stopLine: '没有 provider token、素材授权、对象存储和客户验收前，不能宣称稳定一键生成或批量混剪。',
  },
  operator: {
    label: '运营视角',
    audience: '给内部运营补材料、补脚本、补版权、补生产交接和交付状态。',
    headline: 'Create 的运营任务是把“素材还差什么”变成可执行队列。',
    body: '运营每天只看缺口：有没有 brief、benchmark、图片/视频资产、是否可复用、版权是否清楚、客户交付是否已批准。',
    firstAction: '先补 next actions 里最前面的缺口；资产没审批或版权未清楚时，不要推进分发计划。',
    stopLine: '外部 provider 未接入时，只能创建生产交接包和结果回填入口，不能标记自动生成完成。',
  },
  friend_trial: {
    label: '朋友试用视角',
    audience: '给非技术朋友看能不能从一个商品需求得到可审核的生产包。',
    headline: '朋友只需要看到：输入商品、生成生产包、等待结果、进入审核。',
    body: '这一视角把 provider、对象存储、DLP、版权和 CRM 术语放到后台边界里，前台只展示清楚的下一步。',
    firstAction: '先创建一个商品 brief、一个参考 benchmark 和一个待生产脚本；没有真实成品 URL 时不展示“已生成”。',
    stopLine: '没有真实成品和审核入口时，只能试用 Create 流程，不能试用自动成片效果。',
  },
};

function createScore(snapshot: IndustrializationSnapshot | null) {
  if (!snapshot) return 0;
  return [
    snapshot.assetCount > 0,
    snapshot.approvedAssetCount > 0,
    snapshot.reusableAssetCount > 0,
    snapshot.rightsIssueAssetCount === 0,
    snapshot.deliverableAssetCount > 0,
    snapshot.clientReviewAssetCount > 0,
    snapshot.approvedDeliverableCount > 0,
  ].filter(Boolean).length;
}

export function buildCreateVariantPlaybook(
  snapshot: IndustrializationSnapshot | null,
  variant: FactoryUiVariantId,
): CreatePlaybook {
  const assetCount = snapshot?.assetCount || 0;
  const approvedCount = snapshot?.approvedAssetCount || 0;
  const reusableCount = snapshot?.reusableAssetCount || 0;
  const rightsIssues = snapshot?.rightsIssueAssetCount || 0;
  const deliverables = snapshot?.deliverableAssetCount || 0;
  const reviewCount = snapshot?.clientReviewAssetCount || 0;
  const approvedDeliverables = snapshot?.approvedDeliverableCount || 0;
  const deliveryIssues = snapshot?.deliveryIssueCount || 0;
  const gaps = snapshot?.missingLinks || [];
  const score = createScore(snapshot);

  if (variant === 'operator') {
    return {
      title: 'Create 运营动作剧本',
      primaryAction: gaps.length
        ? `先处理生产缺口：${gaps[0]}。`
        : '可以进入生产 handoff、成品回填、客户 review 和下一轮分发计划。',
      proofToCheck: '每个素材都要能追到 asset id、类型、证据、审批、版权、复用状态和客户交付状态。',
      handoffBoundary: 'provider、对象存储和客户验收未接入前，只能走生产交接和人工回填，不能标记自动生成完成。',
      cards: [
        `资产 ${assetCount} / 已审批 ${approvedCount} / 可复用 ${reusableCount}`,
        `版权问题 ${rightsIssues} / 交付物 ${deliverables} / 交付问题 ${deliveryIssues}`,
        `客户审核 ${reviewCount} / 客户批准 ${approvedDeliverables} / Create score ${score}/7`,
      ],
    };
  }

  if (variant === 'friend_trial') {
    const readyForTrial = assetCount > 0 && rightsIssues === 0;
    return {
      title: '朋友试用 Create 路径',
      primaryAction: readyForTrial
        ? '可以让朋友从商品 brief 看见脚本和素材包；没有成品时明确标注“待生产”。'
        : '先补商品 brief、参考 benchmark 和可授权素材，否则朋友会不知道系统到底产出了什么。',
      proofToCheck: '朋友只看三项：输入是否明确、生产包是否完整、有没有可打开的成品或审核入口。',
      handoffBoundary: '没有真实成品 URL、review token 和客户批准前，不要把 Create 包装成一键视频已完成。',
      cards: [
        `资产包 ${assetCount}`,
        `版权问题 ${rightsIssues}`,
        `审核入口 ${reviewCount} / 已批准 ${approvedDeliverables}`,
      ],
    };
  }

  return {
    title: 'Create 商业验收剧本',
    primaryAction: score >= 5
      ? '可以进入真实 provider 和企业云资产接入验收，重点检查回调、存储、权限和成本控制。'
      : '先补内部资产账本、生产交接、版权审批和客户交付闭环，再谈一键视频或智能混剪能力。',
    proofToCheck: '合作者要看到 brief、benchmark、script、visual asset、production handoff、delivery review 和权限审计在同一项目里闭环。',
    handoffBoundary: '一键视频、智能混剪和批量生成必须等待真实 provider、素材授权、对象存储、签名 URL、DLP 和客户验收接入。',
    cards: [
      `Create readiness ${score}/7`,
      `资产 ${assetCount} / 交付物 ${deliverables} / 客户批准 ${approvedDeliverables}`,
      `版权问题 ${rightsIssues} / 资产治理问题 ${snapshot?.assetGovernanceIssueCount || 0}`,
    ],
  };
}

export function CreateAssetConsoleClient({
  initialProjectId = 'default-project',
  initialSnapshot = null,
  selectedVariantId = 'partner',
}: {
  initialProjectId?: string;
  initialSnapshot?: IndustrializationSnapshot | null;
  selectedVariantId?: FactoryUiVariantId;
}) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [snapshot, setSnapshot] = useState<IndustrializationSnapshot | null>(initialSnapshot);
  const [productName, setProductName] = useState('Launch SKU');
  const [benchmarkUrl, setBenchmarkUrl] = useState('https://example.test/benchmark-video');
  const [scriptTitle, setScriptTitle] = useState('15s launch script');
  const [visualTitle, setVisualTitle] = useState('Product visual asset');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedVariant = CREATE_VARIANTS[selectedVariantId];
  const playbook = buildCreateVariantPlaybook(snapshot, selectedVariantId);
  const nextActions = snapshot?.nextActions || [];
  const gaps = snapshot?.missingLinks || [];

  async function refresh(nextProjectId = projectId) {
    setLoading(true);
    const res = await fetch(`/api/industrial-chain?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.message || data.error || 'Create 数据刷新失败');
      return;
    }
    setError('');
    setSnapshot(data.snapshot);
  }

  async function addAsset(asset: Record<string, unknown>) {
    const res = await fetch('/api/industrial-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'asset', asset: { projectId: projectId || 'default-project', ...asset } }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || '资产写入失败');
    }
  }

  async function seedCreatePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice('');
    setError('');
    try {
      await addAsset({
        type: 'brief',
        title: `${productName} production brief`,
        evidence: '商品定位、目标平台、核心卖点、禁用表达和验收口径已进入 Create brief。',
        tags: ['create-brief', 'operator-ready'],
        approvalStatus: 'approved',
        rightsStatus: 'owned',
      });
      await addAsset({
        type: 'benchmark',
        title: `${productName} benchmark reference`,
        url: benchmarkUrl,
        evidence: '参考链接仅用于结构拆解；不复刻竞品素材和原文表达。',
        tags: ['benchmark', 'hook-reference'],
        approvalStatus: 'approved',
        rightsStatus: 'licensed',
      });
      await addAsset({
        type: 'script',
        title: scriptTitle,
        evidence: '脚本包含 hook、scene beats、proof point、CTA 和风险边界，可交给视频工厂继续生产。',
        tags: ['script', 'production-handoff'],
        approvalStatus: 'approved',
        rightsStatus: 'owned',
      });
      await addAsset({
        type: 'image',
        title: visualTitle,
        evidence: '视觉资产占位已授权进入生产包；真实成品仍需 provider 或人工设计回填。',
        tags: ['visual-asset', 'needs-provider-result'],
        approvalStatus: 'review',
        rightsStatus: 'needs_review',
      });
      await refresh(projectId);
      setNotice('已写入 Create 生产包：brief、benchmark、script、visual asset。视觉资产保持待审核，不伪装成成品。');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create 生产包写入失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0d09] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[8px] border border-amber-200/15 bg-[#1a150d] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Create Asset Variant</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">资产生产控制台</h1>
              <p className="mt-3 text-sm leading-6 text-amber-50/75">{selectedVariant.headline}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{selectedVariant.body}</p>
            </div>
          </div>
        </section>

        <FactoryVariantConsole
          accent="amber"
          basePath="/factory/create"
          evidenceCards={playbook.cards}
          eyebrow="Create Action Playbook"
          firstScreen={selectedVariant.body}
          nextAction={selectedVariant.firstAction}
          primaryAction={playbook.primaryAction}
          projectId={projectId}
          proofFocus={playbook.proofToCheck}
          selectedVariantId={selectedVariantId}
          stopLine={playbook.handoffBoundary}
          title={playbook.title}
          variants={CREATE_VARIANTS}
        />

        <section className="grid gap-4">
          <form onSubmit={seedCreatePackage} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Create Seed</p>
            <h2 className="mt-2 text-xl font-semibold">补一个可追溯生产包</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">一次写入 brief、benchmark、script 和 visual asset；视觉资产保持待审核，避免把 provider-gated 结果伪装成成品。</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm text-white/70">
                项目
                <input value={projectId} onChange={event => setProjectId(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-amber-300" />
              </label>
              <label className="text-sm text-white/70">
                商品
                <input value={productName} onChange={event => setProductName(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-amber-300" />
              </label>
              <label className="text-sm text-white/70">
                参考 benchmark URL
                <input value={benchmarkUrl} onChange={event => setBenchmarkUrl(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-amber-300" />
              </label>
              <label className="text-sm text-white/70">
                脚本标题
                <input value={scriptTitle} onChange={event => setScriptTitle(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-amber-300" />
              </label>
              <label className="text-sm text-white/70">
                视觉资产标题
                <input value={visualTitle} onChange={event => setVisualTitle(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-amber-300" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={loading} className="rounded-[6px] bg-amber-300 px-4 py-2 text-sm font-semibold text-[#0f0d09] disabled:opacity-50">
                写入 Create 生产包
              </button>
              <button type="button" onClick={() => refresh()} disabled={loading} className="rounded-[6px] border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-50">
                刷新 Create 状态
              </button>
            </div>
            {notice ? <p className="mt-3 text-sm text-amber-100">{notice}</p> : null}
            {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
          </form>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Assets</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.assetCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">已审批 {snapshot?.approvedAssetCount || 0} · 可复用 {snapshot?.reusableAssetCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Governance</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.rightsIssueAssetCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">版权问题 · 治理问题 {snapshot?.assetGovernanceIssueCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Delivery</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.deliverableAssetCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">客户审核 {snapshot?.clientReviewAssetCount || 0} · 已批准 {snapshot?.approvedDeliverableCount || 0}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Create 缺口</h2>
            <div className="mt-3 space-y-2">
              {(gaps.length ? gaps : ['内部 Create 账本当前没有阻断项，下一步是接真实 provider、对象存储和客户验收。']).map(item => (
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
