'use client';

import { useState, type FormEvent } from 'react';

import type { ChannelAccountSnapshot } from '@/lib/channel-account-ledger';
import type { FactoryUiVariantId } from '@/lib/factory-readiness-view';

type CastPlaybook = {
  title: string;
  primaryAction: string;
  proofToCheck: string;
  handoffBoundary: string;
  cards: string[];
};

const CAST_VARIANTS: Record<FactoryUiVariantId, {
  label: string;
  audience: string;
  headline: string;
  body: string;
  firstAction: string;
  stopLine: string;
}> = {
  partner: {
    label: '合作者视角',
    audience: '给合作者、客户负责人和投资评审看 Cast 是否真的接近筷子科技的矩阵分发能力。',
    headline: 'Cast 是账号矩阵、发布证据、广告账本和表现回流的统一调度层。',
    body: '这一层不把 PubPal、矩阵宝或自动投放当口号展示，而是把账号授权、健康度、发布槽位、广告预算、平台证据和回流指标放在同一条链路里验收。',
    firstAction: '先看账号矩阵和广告 campaign ledger 是否有证据，再判断能不能进入真实自动发布或广告账户接入。',
    stopLine: '没有 OAuth、广告账户授权、自动发布 API 和 analytics sync 前，不能宣称平台级自动分发或自动优化。',
  },
  operator: {
    label: '运营视角',
    audience: '给内部运营每天判断该补账号、补槽位、补广告证据还是补回流。',
    headline: 'Cast 的运营任务是把分发动作从聊天记录搬到账本里。',
    body: '运营不需要先写一堆报告，只要按页面暴露的 gap 补齐账号、健康度、发布槽位、预算、证据 URL 和转化回流。',
    firstAction: '先补 next actions 里最前面的缺口；没有健康账号和可用槽位时，不要推进发布状态。',
    stopLine: '外部平台未接入时，只能做手工发布交接和证据回填，不能标记自动发布完成。',
  },
  friend_trial: {
    label: '朋友试用视角',
    audience: '给非技术朋友只看一件事：内容是否能从可发布计划走到有证据的结果。',
    headline: '朋友不需要理解 OAuth，只要看到能发到哪里、谁负责、有没有结果。',
    body: '这一视角隐藏内部投放术语，把复杂的账号矩阵压缩成“可发布 / 待补材料 / 已有回流”三个判断。',
    firstAction: '先准备一个平台账号、一个可发布槽位和一条证据链接；没有真实结果时不要让朋友误以为已自动投放。',
    stopLine: '没有真实发布证据和表现回流时，只能试用流程，不能试用自动分发效果。',
  },
};

const CAST_VARIANT_ORDER: FactoryUiVariantId[] = ['partner', 'operator', 'friend_trial'];

function money(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`;
}

function castScore(snapshot: ChannelAccountSnapshot | null) {
  if (!snapshot) return 0;
  return [
    snapshot.accountCount > 0,
    snapshot.connectedAccountCount > 0,
    snapshot.healthyAccountCount > 0,
    snapshot.availableSlotCount > 0,
    snapshot.adCampaignCount > 0,
    snapshot.adEvidenceCount > 0,
    snapshot.measuredAdCampaignCount > 0,
  ].filter(Boolean).length;
}

export function buildCastVariantPlaybook(
  snapshot: ChannelAccountSnapshot | null,
  variant: FactoryUiVariantId,
): CastPlaybook {
  const accountCount = snapshot?.accountCount || 0;
  const connectedCount = snapshot?.connectedAccountCount || 0;
  const healthyCount = snapshot?.healthyAccountCount || 0;
  const slotCount = snapshot?.availableSlotCount || 0;
  const campaignCount = snapshot?.adCampaignCount || 0;
  const activeCampaignCount = snapshot?.activeAdCampaignCount || 0;
  const evidenceCount = snapshot?.adEvidenceCount || 0;
  const measuredCount = snapshot?.measuredAdCampaignCount || 0;
  const gaps = [...(snapshot?.missingLinks || []), ...(snapshot?.adMissingLinks || [])];
  const score = castScore(snapshot);

  if (variant === 'operator') {
    return {
      title: 'Cast 运营动作剧本',
      primaryAction: gaps.length
        ? `先处理分发缺口：${gaps[0]}。`
        : '可以把 ready distribution plan 推进到手工发布、证据回填和表现导入。',
      proofToCheck: '每个发布动作都要能追到 channel account、dispatch、evidence URL、campaign budget 和 performance return。',
      handoffBoundary: 'OAuth、自动发布、广告账户和 analytics sync 没接入前，运营只能标记 manual-ready 或 measured evidence，不能标记自动化完成。',
      cards: [
        `账号 ${accountCount} / 已连接 ${connectedCount} / 健康 ${healthyCount}`,
        `可发布槽位 ${slotCount} / 广告 ${campaignCount} / 活跃 ${activeCampaignCount}`,
        `平台证据 ${evidenceCount} / 已衡量广告 ${measuredCount} / Cast score ${score}/7`,
      ],
    };
  }

  if (variant === 'friend_trial') {
    const readyForTrial = accountCount > 0 && slotCount > 0 && (evidenceCount > 0 || campaignCount === 0);
    return {
      title: '朋友试用 Cast 路径',
      primaryAction: readyForTrial
        ? '把一个已准备好的平台账号、发布时间和证据入口展示给朋友；只验证流程，不宣称自动投放。'
        : '先补一个健康账号和可用发布槽位，否则朋友会卡在“到底能发到哪里”。',
      proofToCheck: '朋友只看三项：平台账号是否明确、下一次发布是否有槽位、发布后是否能看到证据或回流。',
      handoffBoundary: '没有真实 evidence URL 或表现 CSV 时，页面必须说清楚这是流程试用，不是自动分发效果试用。',
      cards: [
        `可用账号 ${healthyCount}/${accountCount}`,
        `可发布槽位 ${slotCount}`,
        `证据 ${evidenceCount} / 回流 ${measuredCount}`,
      ],
    };
  }

  return {
    title: 'Cast 商业验收剧本',
    primaryAction: score >= 5
      ? '可以进入外部平台接入验收：逐项配置 OAuth、广告账户、自动发布 API 和 analytics sync。'
      : '先补内部账号矩阵、广告账本、发布槽位和证据回流，再谈 PubPal/矩阵分发能力。',
    proofToCheck: '合作者要看到账号池、授权状态、健康度、发布频率、广告预算、平台证据和回流指标在同一项目账本里闭环。',
    handoffBoundary: '91M+ creative output、42M+ video distribution 只能作为竞品规模对标；Wenai 没有审计账本前不能当自有规模展示。',
    cards: [
      `Cast readiness ${score}/7`,
      `账号 ${accountCount} / 槽位 ${slotCount} / 广告 ${campaignCount}`,
      `预算 ${money(snapshot?.adBudgetCents || 0)} / 花费 ${money(snapshot?.adSpendCents || 0)} / 证据 ${evidenceCount}`,
    ],
  };
}

export function CastDistributionConsoleClient({
  initialProjectId = 'default-project',
  initialSnapshot = null,
  selectedVariantId = 'partner',
}: {
  initialProjectId?: string;
  initialSnapshot?: ChannelAccountSnapshot | null;
  selectedVariantId?: FactoryUiVariantId;
}) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [snapshot, setSnapshot] = useState<ChannelAccountSnapshot | null>(initialSnapshot);
  const [platform, setPlatform] = useState('TikTok Shop');
  const [handle, setHandle] = useState('@brand-main');
  const [dailyPublishLimit, setDailyPublishLimit] = useState('3');
  const [scheduledCount, setScheduledCount] = useState('0');
  const [campaignName, setCampaignName] = useState('Launch conversion boost');
  const [budgetCents, setBudgetCents] = useState('50000');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedVariant = CAST_VARIANTS[selectedVariantId];
  const playbook = buildCastVariantPlaybook(snapshot, selectedVariantId);
  const nextActions = snapshot?.nextActions || [];
  const gaps = [...(snapshot?.missingLinks || []), ...(snapshot?.adMissingLinks || [])];

  async function refresh(nextProjectId = projectId) {
    setLoading(true);
    const res = await fetch(`/api/channel-accounts?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.message || data.error || 'Cast 数据刷新失败');
      return;
    }
    setError('');
    setSnapshot(data.snapshot);
  }

  async function seedMatrix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const res = await fetch('/api/channel-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId || 'default-project',
        account: {
          platform,
          handle,
          authorizationStatus: 'manual_ready',
          healthStatus: 'healthy',
          dailyPublishLimit: Number(dailyPublishLimit),
          scheduledCount: Number(scheduledCount),
        },
        campaign: campaignName.trim()
          ? {
            platform,
            campaignName,
            objective: 'sales',
            status: evidenceUrl.trim() ? 'active' : 'ready',
            budgetCents: Number(budgetCents),
            spendCents: 0,
            evidenceUrl: evidenceUrl.trim() || undefined,
          }
          : undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.message || data.error || 'Cast 账号矩阵写入失败');
      return;
    }
    setError('');
    setNotice('已写入账号矩阵和广告 campaign ledger，Cast readiness 已刷新。');
    setSnapshot(data.snapshot);
  }

  return (
    <main className="min-h-screen bg-[#07110f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[8px] border border-emerald-200/15 bg-[#0d1a17] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Cast Distribution Variant</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">分发投放控制台</h1>
              <p className="mt-3 text-sm leading-6 text-emerald-50/70">{selectedVariant.headline}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{selectedVariant.body}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CAST_VARIANT_ORDER.map(variant => (
                <a
                  key={variant}
                  href={`/factory/cast?projectId=${encodeURIComponent(projectId)}&variant=${variant}`}
                  className={`rounded-[6px] border px-3 py-2 text-sm transition ${variant === selectedVariantId
                    ? 'border-emerald-300 bg-emerald-300 text-[#07110f]'
                    : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-emerald-200/50 hover:text-white'
                  }`}
                >
                  {CAST_VARIANTS[variant].label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Cast Action Playbook</p>
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

          <form onSubmit={seedMatrix} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Matrix Seed</p>
            <h2 className="mt-2 text-xl font-semibold">补一个可验证账号矩阵</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">一次写入账号矩阵和广告 campaign ledger；没有平台证据 URL 时保持 ready，不伪装自动投放。</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-white/70">
                项目
                <input value={projectId} onChange={event => setProjectId(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70">
                平台
                <input value={platform} onChange={event => setPlatform(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70">
                账号
                <input value={handle} onChange={event => setHandle(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70">
                日发布上限
                <input value={dailyPublishLimit} onChange={event => setDailyPublishLimit(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70">
                已排期数量
                <input value={scheduledCount} onChange={event => setScheduledCount(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70">
                广告预算（分）
                <input value={budgetCents} onChange={event => setBudgetCents(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70 sm:col-span-2">
                Campaign 名称
                <input value={campaignName} onChange={event => setCampaignName(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
              <label className="text-sm text-white/70 sm:col-span-2">
                平台证据 URL（没有则保持 ready，不伪装 active）
                <input value={evidenceUrl} onChange={event => setEvidenceUrl(event.target.value)} className="mt-1 w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-300" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={loading} className="rounded-[6px] bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#07110f] disabled:opacity-50">
                写入矩阵账本
              </button>
              <button type="button" onClick={() => refresh()} disabled={loading} className="rounded-[6px] border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-50">
                刷新 Cast 状态
              </button>
            </div>
            {notice ? <p className="mt-3 text-sm text-emerald-100">{notice}</p> : null}
            {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
          </form>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Matrix</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.accountCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">账号池 · 已连接 {snapshot?.connectedAccountCount || 0} · 健康 {snapshot?.healthyAccountCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Slots</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.availableSlotCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">总上限 {snapshot?.totalDailyPublishLimit || 0} · 已排期 {snapshot?.scheduledCount || 0}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Ads</p>
            <div className="mt-3 text-3xl font-semibold">{snapshot?.adCampaignCount || 0}</div>
            <p className="mt-2 text-sm text-white/60">活跃 {snapshot?.activeAdCampaignCount || 0} · 已衡量 {snapshot?.measuredAdCampaignCount || 0} · 证据 {snapshot?.adEvidenceCount || 0}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Cast 缺口</h2>
            <div className="mt-3 space-y-2">
              {(gaps.length ? gaps : ['内部 Cast 账本当前没有阻断项，下一步是接真实平台授权。']).map(item => (
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
