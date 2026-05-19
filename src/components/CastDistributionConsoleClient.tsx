'use client';

import { useState, type FormEvent } from 'react';

import { FactoryVariantConsole } from '@/components/FactoryVariantConsole';
import type { ChannelAccountSnapshot } from '@/lib/channel-account-ledger';
import type { FactoryUiVariantId } from '@/lib/factory-readiness-view';

type CastPlaybook = {
  title: string;
  primaryAction: string;
  proofToCheck: string;
  handoffBoundary: string;
  cards: string[];
};

export type CastManageOperatingCheck = {
  stage: string;
  ready: boolean;
  evidence: string;
  next: string;
};

export type AdDeliveryGuardrail = {
  rule: string;
  ready: boolean;
  evidence: string;
  operatorAction: string;
  stopLine: string;
};

export type ManualPublishReceiptCheck = {
  gate: string;
  ready: boolean;
  evidence: string;
  operatorAction: string;
  externalGate: string;
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

export function buildCastManageOperatingChecks(snapshot: ChannelAccountSnapshot | null): CastManageOperatingCheck[] {
  const campaignCount = snapshot?.adCampaignCount || 0;
  const accountCount = snapshot?.accountCount || 0;
  const healthyCount = snapshot?.healthyAccountCount || 0;
  const slotCount = snapshot?.availableSlotCount || 0;
  const budgetCents = snapshot?.adBudgetCents || 0;
  const evidenceCount = snapshot?.adEvidenceCount || 0;
  const measuredCount = snapshot?.measuredAdCampaignCount || 0;
  const gaps = [...(snapshot?.missingLinks || []), ...(snapshot?.adMissingLinks || [])];
  const nextActions = snapshot?.nextActions || [];

  return [
    {
      stage: '素材版本 / Campaign 绑定',
      ready: campaignCount > 0,
      evidence: `campaign ledger ${campaignCount} 条`,
      next: campaignCount > 0
        ? '把每个素材版本绑定到 campaign、SKU、tracking code 和实验单元。'
        : '先创建广告 campaign ledger；没有 campaign 就无法对齐 Smartly 式创意-媒体-情报闭环。',
    },
    {
      stage: '账号与发布槽位',
      ready: accountCount > 0 && healthyCount > 0 && slotCount > 0,
      evidence: `账号 ${accountCount} / 健康 ${healthyCount} / 槽位 ${slotCount}`,
      next: '补齐 OAuth 前先保持 manual-ready；有健康账号和发布槽位后才允许进入发布交接。',
    },
    {
      stage: '预算与投放门禁',
      ready: budgetCents > 0,
      evidence: `预算 ${money(budgetCents)} / 花费 ${money(snapshot?.adSpendCents || 0)}`,
      next: budgetCents > 0
        ? '继续补 spend cap、暂停/放量规则和广告账户授权证据。'
        : '先写入预算上限；没有预算门禁不能开放自动投放或优化。',
    },
    {
      stage: '平台回执',
      ready: evidenceCount > 0,
      evidence: `平台证据 URL ${evidenceCount} 条`,
      next: evidenceCount > 0
        ? '把回执继续绑定到 dispatch、campaign 和客户审核后的资产版本。'
        : '没有 evidence URL 时只能标记为待发布或手工交接，不能宣称已自动发布。',
    },
    {
      stage: '表现回流',
      ready: measuredCount > 0,
      evidence: `已衡量广告 ${measuredCount} 条`,
      next: measuredCount > 0
        ? '把 impressions、clicks、orders、revenue 反哺品牌学习和下一轮脚本。'
        : '补 analytics sync 或手工 CSV 回流；没有回流就不能宣称自动优化。',
    },
    {
      stage: '下一轮 Action Queue',
      ready: gaps.length === 0,
      evidence: gaps.length ? `阻断 ${gaps.length} 项 / 动作 ${nextActions.length} 条` : `动作队列 ${nextActions.length} 条 / 无硬阻断`,
      next: gaps.length
        ? `先处理：${gaps[0]}。`
        : '进入下一轮素材版本、预算策略和平台授权验收。',
    },
  ];
}

export function buildAdDeliveryGuardrails(snapshot: ChannelAccountSnapshot | null): AdDeliveryGuardrail[] {
  const campaignCount = snapshot?.adCampaignCount || 0;
  const activeCampaignCount = snapshot?.activeAdCampaignCount || 0;
  const measuredCount = snapshot?.measuredAdCampaignCount || 0;
  const budgetCents = snapshot?.adBudgetCents || 0;
  const spendCents = snapshot?.adSpendCents || 0;
  const evidenceCount = snapshot?.adEvidenceCount || 0;
  const missing = snapshot?.adMissingLinks || [];
  const overBudget = budgetCents > 0 && spendCents > budgetCents;
  const spendRatio = budgetCents > 0 ? spendCents / budgetCents : 0;

  return [
    {
      rule: '预算上限',
      ready: budgetCents > 0 && !overBudget,
      evidence: `budget ${money(budgetCents)} / spend ${money(spendCents)}`,
      operatorAction: budgetCents > 0
        ? '预算已进入内部门禁；继续等待真实广告账户授权后再执行自动预算同步。'
        : '先写入测试预算上限；没有预算 cap 时，任何广告投放都只能停在计划状态。',
      stopLine: overBudget
        ? '花费已经超过预算，必须暂停或回滚，不能继续放量。'
        : '没有广告账户和预算回执前，不把预算门禁包装成自动投放。',
    },
    {
      rule: '暂停规则',
      ready: campaignCount > 0 && (overBudget || missing.length > 0 || spendRatio >= 0.8),
      evidence: `campaigns ${campaignCount} / gaps ${missing.length} / spend ${(spendRatio * 100).toFixed(0)}%`,
      operatorAction: overBudget
        ? '立即标记暂停，补回滚原因和平台证据 URL。'
        : missing.length > 0
          ? `先处理广告阻断：${missing[0]}。`
          : spendRatio >= 0.8
            ? '预算消耗接近上限，先暂停等待表现回流，不做自动加预算。'
            : '保持监控；未触发预算或证据风险时不需要暂停。',
      stopLine: '没有暂停/回滚规则前，不允许自动优化或自动加预算。',
    },
    {
      rule: '平台证据',
      ready: evidenceCount > 0,
      evidence: `evidence URL ${evidenceCount} / active campaigns ${activeCampaignCount}`,
      operatorAction: evidenceCount > 0
        ? '把平台 campaign URL、广告账户截图或回执绑定到 campaign ledger。'
        : '补平台证据 URL；没有证据时只能说 campaign hypothesis，不能说真实投放。',
      stopLine: '没有平台回执或广告账户证据前，不宣称自动投放已执行。',
    },
    {
      rule: '放量规则',
      ready: measuredCount > 0 && !overBudget,
      evidence: `measured campaigns ${measuredCount} / spend ${money(spendCents)}`,
      operatorAction: measuredCount > 0
        ? '只有 measured campaign 才能进入下一轮预算建议、素材复用和品牌学习。'
        : '先导入 impressions、clicks、orders、revenue；没有表现回流时不做放量建议。',
      stopLine: '没有转化或收入回流前，不把方向性数据当作自动放量依据。',
    },
    {
      rule: '回滚原因',
      ready: missing.length === 0 && !overBudget && campaignCount > 0,
      evidence: missing.length ? missing.join(' / ') : campaignCount > 0 ? 'no hard ad blockers' : 'missing campaign ledger',
      operatorAction: missing.length
        ? '把阻断项写成回滚原因，进入下一轮 action queue。'
        : campaignCount > 0
          ? '当前广告账本没有硬阻断；下一步只允许进入真实广告账户授权验收。'
          : '先建立 campaign ledger；没有账本就没有可回滚对象。',
      stopLine: '任何自动投放失败都必须保留原因、证据、预算状态和下一步 owner。',
    },
  ];
}

export function buildManualPublishReceiptChecks(snapshot: ChannelAccountSnapshot | null): ManualPublishReceiptCheck[] {
  const accountCount = snapshot?.accountCount || 0;
  const healthyCount = snapshot?.healthyAccountCount || 0;
  const rateLimitedCount = snapshot?.rateLimitedAccountCount || 0;
  const totalLimit = snapshot?.totalDailyPublishLimit || 0;
  const scheduledCount = snapshot?.scheduledCount || 0;
  const availableSlotCount = snapshot?.availableSlotCount || 0;
  const evidenceCount = snapshot?.adEvidenceCount || 0;
  const measuredCount = snapshot?.measuredAdCampaignCount || 0;
  const campaignCount = snapshot?.adCampaignCount || 0;
  const gaps = [...(snapshot?.missingLinks || []), ...(snapshot?.adMissingLinks || [])];

  return [
    {
      gate: '账号健康门禁',
      ready: accountCount > 0 && healthyCount > 0 && rateLimitedCount === 0,
      evidence: `账号 ${accountCount} / 健康 ${healthyCount} / 限频 ${rateLimitedCount}`,
      operatorAction: healthyCount > 0
        ? '优先使用 healthy/warmup 账号；at-risk、blocked、rate-limited 账号不能进入发布排期。'
        : '先补一个 manual_ready 且健康的账号，否则矩阵分发只能停在计划。'
      ,
      externalGate: '真实自动发布仍需要平台 OAuth、账号授权和发布权限。',
    },
    {
      gate: '频控余量门禁',
      ready: totalLimit > 0 && scheduledCount <= totalLimit && availableSlotCount > 0,
      evidence: `日上限 ${totalLimit} / 已排 ${scheduledCount} / 余量 ${availableSlotCount}`,
      operatorAction: availableSlotCount > 0
        ? '把下一条内容排到有余量的账号槽位，避免同账号过密发布。'
        : '先减少排期或换账号，不能继续塞入同一个账号。'
      ,
      externalGate: '自动限频需要平台返回 rate limit、账号健康和发布失败码。',
    },
    {
      gate: '去重排期门禁',
      ready: campaignCount > 0 && scheduledCount <= Math.max(totalLimit, 1),
      evidence: `campaign ${campaignCount} / scheduled ${scheduledCount}`,
      operatorAction: campaignCount > 0
        ? '同一素材必须绑定 campaign/dispatch 后再排期，避免重复发同一版本。'
        : '先建立 campaign/dispatch 账本；没有版本归属就不进入矩阵排期。'
      ,
      externalGate: '跨平台自动去重仍需要发布回执、asset_ref 和平台内容 ID。',
    },
    {
      gate: '人工发布回执门禁',
      ready: evidenceCount > 0,
      evidence: `平台证据 ${evidenceCount}`,
      operatorAction: evidenceCount > 0
        ? '把平台 URL、后台截图或 campaign 回执绑定到 ledger，作为人工发布完成证据。'
        : '没有 evidence URL 时只能标记 manual-ready，不能标记已发布或已投放。'
      ,
      externalGate: '自动回执需要发布 API、平台 post/campaign id 和 webhook 或轮询同步。',
    },
    {
      gate: '表现回流门禁',
      ready: measuredCount > 0,
      evidence: `已回流 campaign ${measuredCount}`,
      operatorAction: measuredCount > 0
        ? '把转化、收入或有效互动写回品牌学习和下一轮 action queue。'
        : gaps.length
          ? `先处理阻断项：${gaps[0]}。`
          : '发布后导入 CSV 或等待 analytics sync，未回流前不宣称自动优化。'
      ,
      externalGate: '自动表现回流需要 analytics API、指标映射、归因窗口和同步频率。',
    },
  ];
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
  const operatingChecks = buildCastManageOperatingChecks(snapshot);
  const adGuardrails = buildAdDeliveryGuardrails(snapshot);
  const manualReceiptChecks = buildManualPublishReceiptChecks(snapshot);
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
          </div>
        </section>

        <FactoryVariantConsole
          accent="emerald"
          basePath="/factory/cast"
          evidenceCards={playbook.cards}
          eyebrow="Cast Action Playbook"
          firstScreen={selectedVariant.body}
          nextAction={selectedVariant.firstAction}
          primaryAction={playbook.primaryAction}
          projectId={projectId}
          proofFocus={playbook.proofToCheck}
          selectedVariantId={selectedVariantId}
          stopLine={playbook.handoffBoundary}
          title={playbook.title}
          variants={CAST_VARIANTS}
        />

        <section className="rounded-[8px] border border-emerald-200/15 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Smartly-style Operating Board</p>
              <h2 className="mt-2 text-xl font-semibold">Smartly式 Cast/Manage 一体化验收板</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这里把素材版本、账号、预算、campaign、平台回执、表现回流和下一轮 action queue 放到同一块板上；缺一项就保持手工门禁。
              </p>
            </div>
            <div className="text-sm font-semibold text-emerald-100">
              {operatingChecks.filter(item => item.ready).length}/{operatingChecks.length} 就绪
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {operatingChecks.map(item => (
              <div key={item.stage} className={`rounded-[8px] border p-4 ${
                item.ready ? 'border-emerald-200/25 bg-emerald-300/10' : 'border-amber-200/20 bg-amber-300/10'
              }`}>
                <div className={`text-xs font-semibold ${item.ready ? 'text-emerald-100' : 'text-amber-100'}`}>
                  {item.ready ? '已具备证据' : '继续补证据'}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{item.stage}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">{item.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.next}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-lime-200/15 bg-lime-950/15 p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-lime-200">Ad Delivery Guardrails</p>
              <h2 className="mt-2 text-xl font-semibold">广告投放止损与放量门禁</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                这层参考 Omneky、AdHawk、Smartly.io、Marpipe 的投放运营方式：预算 cap、暂停规则、平台证据、表现回流和回滚原因必须同屏可见；没有广告账户授权前只做人工门禁，不宣称自动优化。
              </p>
            </div>
            <div className="text-sm font-semibold text-lime-100">
              {adGuardrails.filter(item => item.ready).length}/{adGuardrails.length} ad gates ready
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {adGuardrails.map(item => (
              <div key={item.rule} className={`rounded-[8px] border p-4 ${
                item.ready ? 'border-lime-200/25 bg-lime-300/10' : 'border-amber-200/20 bg-amber-300/10'
              }`}>
                <div className={`text-xs font-semibold ${item.ready ? 'text-lime-100' : 'text-amber-100'}`}>
                  {item.ready ? '门禁有证据' : '继续补门禁'}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{item.rule}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">{item.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-lime-100/70">{item.operatorAction}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.stopLine}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-cyan-200/15 bg-cyan-950/15 p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Manual Publish Receipt Board</p>
              <h2 className="mt-2 text-xl font-semibold">人工发布回执与矩阵频控验收板</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                没接 OAuth 时，Cast 也不能停在计划。这里把账号健康、频控余量、去重排期、人工发布证据和表现回流拆成门禁；没有平台证据时只允许 manual-ready，不把人工流程包装成自动分发。
              </p>
            </div>
            <div className="text-sm font-semibold text-cyan-100">
              {manualReceiptChecks.filter(item => item.ready).length}/{manualReceiptChecks.length} receipt gates ready
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {manualReceiptChecks.map(item => (
              <div key={item.gate} className={`rounded-[8px] border p-4 ${
                item.ready ? 'border-cyan-200/25 bg-cyan-300/10' : 'border-amber-200/20 bg-amber-300/10'
              }`}>
                <div className={`text-xs font-semibold ${item.ready ? 'text-cyan-100' : 'text-amber-100'}`}>
                  {item.ready ? '已有证据' : '继续补证据'}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{item.gate}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">{item.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-cyan-100/70">{item.operatorAction}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.externalGate}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
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
