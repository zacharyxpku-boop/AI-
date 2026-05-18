'use client';

import { useState, type FormEvent } from 'react';

import type { OneClickVideoOperationResult, VideoProductionQueue } from '@/lib/industrial-video-workflow';

const DEFAULT_PLATFORMS = 'TikTok Shop,Instagram Reels';

function capabilityStatusLabel(status: string) {
  if (status === 'internal_ready') return '内部已就绪';
  if (status === 'provider_gated') return '等待外部接入';
  return '缺内部证据';
}

function capabilityStatusClass(status: string) {
  if (status === 'internal_ready') return 'border-emerald-300/35 text-emerald-100';
  if (status === 'provider_gated') return 'border-amber-300/35 text-amber-100';
  return 'border-red-300/35 text-red-100';
}

function modeLabel(mode: string) {
  if (mode === 'provider_ready') return '供应商就绪';
  if (mode === 'handoff_only') return '仅交接';
  return mode;
}

function stageLabel(stage: string) {
  const map: Record<string, string> = {
    intake: '待补齐',
    provider_gate: '供应商闸门',
    ready_for_execution: '可执行',
    result_ingestion: '待建审核',
    client_review: '客户审核',
    revision: '返修',
    approved: '已批准',
    performance_return: '表现回流',
  };
  return map[stage] || stage;
}

function priorityLabel(priority: string) {
  if (priority === 'high') return '高优先级';
  if (priority === 'medium') return '中优先级';
  return '低优先级';
}

function displayVideoTitle(title: string) {
  return title.replace(/^Video workflow:\s*/i, '视频任务：');
}

function readableHandoffSummary(summary: string) {
  const [stage, mode, ...counts] = summary.split('/').map(item => item.trim()).filter(Boolean);
  const countLabels: Record<string, string> = {
    plans: '计划',
    dispatches: '分发',
    results: '成片',
    reviews: '审核',
    approved: '批准',
  };
  const readableCounts = counts
    .map(item => {
      const [key, value] = item.split(':').map(part => part.trim());
      return `${countLabels[key] || key} ${value || '0'}`;
    })
    .join(' · ');
  return `阶段 ${stageLabel(stage || '')} · 模式 ${modeLabel(mode || '')}${readableCounts ? ` · ${readableCounts}` : ''}`;
}

function payloadLabel(key: string) {
  const map: Record<string, string> = {
    projectId: '项目',
    sourceHandoffAssetId: '来源交接资产',
    assetId: '资产',
    deliveryUrl: '交付链接',
    resultUrl: '成片链接',
    dispatchId: '执行记录',
    owner: '负责人',
    status: '状态',
  };
  return map[key] || key;
}

function readablePayload(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .map(([key, value]) => `${payloadLabel(key)}：${Array.isArray(value) ? value.join('、') : String(value)}`)
    .join('；');
}

function queueText(value: string) {
  const map: Record<string, string> = {
    'Provider generation remains handoff-only until config, consent, references, and product assets are ready.': '供应商生成仍处于仅交接状态，需要完成配置、授权、参考视频和产品素材后才能执行。',
    'Produced video assets are waiting for client review approval.': '已产出的视频资产正在等待客户审核批准。',
    'Client requested revisions on at least one produced video asset.': '客户已对至少一个视频资产提出返修。',
    'Create distribution plans for the video workflow asset.': '为视频工作流资产创建分发计划。',
    'Create dispatch records and assign an owner for every target platform.': '为每个目标平台创建分发记录并分配负责人。',
    'Attach provider credentials, legal consent, references, and product assets before provider execution.': '执行供应商生成前，需要补齐供应商凭据、授权、参考视频和产品素材。',
    'Ingest completed provider/editor result URLs through /api/industrial-chain/production-result.': '通过生产结果接口导入已完成的视频或剪辑结果链接。',
    'Create client review links for produced video assets.': '为已产出的视频资产创建客户审核链接。',
    'Send the review portal link to the client and capture approval or revision feedback.': '把审核链接发给客户，并收集批准或返修反馈。',
    'Publish or hand off the video, capture evidence URL, then import performance CSV.': '发布或交接视频，记录发布证据链接，然后导入表现 CSV。',
    'Missing platform distribution plans for this video workflow.': '缺少这条视频工作流的平台分发计划。',
    'Missing dispatch records for target platforms.': '缺少目标平台的执行记录。',
    'Provider automation gate is not fully satisfied; keep execution as manual handoff.': '供应商自动化门槛未全部满足，当前保持人工交接。',
    'Missing completed provider/editor result URL.': '缺少供应商或剪辑完成后的成片链接。',
    'Missing client review portal link for produced video.': '缺少成片对应的客户审核门户链接。',
    'Missing client approval or revision decision.': '缺少客户批准或返修结论。',
    'Missing post-publish performance return.': '缺少发布后的表现回流。',
  };
  return map[value] || value;
}

function remixSourceLabel(value: string) {
  if (value === 'creative-opportunity') return '创意机会';
  if (value === 'pattern-cluster') return '打法簇';
  return '基础模板';
}

function operationClosureCards(operation: OneClickVideoOperationResult) {
  return [{
    title: '内部已完成',
    body: `已创建 ${operation.autoCreated.length} 个资产、计划或执行记录，Compose 到 Cast 的账本已经串起来。`,
  }, {
    title: '仍需外部接入',
    body: operation.externalRequirements.length
      ? `还有 ${operation.externalRequirements.length} 个外部 gate，未补齐前只能交接，不能自动出片或自动发布。`
      : '外部 gate 暂无阻塞，可以继续按供应商或平台自动化验收。',
  }, {
    title: '运营下一步',
    body: operation.commerciallyExecutable
      ? '进入供应商执行、成片回写、客户审核和表现回流。'
      : '先补视频 provider、授权素材、平台账号和发布/回流证据。',
  }, {
    title: '禁止伪规模',
    body: '91M+ / 42M+ 只作竞品对标，未有审计账本前不能作为 Wenai 自有指标展示。',
  }];
}

const MIXCUT_OPERATION_BOARD = [
  {
    title: 'Hook Bank 入场',
    input: '来自创意工厂的开头钩子、痛点句、证据点和可复用角度',
    action: '生成 3 秒开场、字幕节奏、首屏镜头和平台差异化钩子',
    gate: '没有授权参考视频时，只能复用结构，不能复制画面、原句或素材表达',
  },
  {
    title: 'UGC Script Spine 成片',
    input: '真人口播骨架、产品使用场景、前后对比和 CTA',
    action: '拆成 15s / 30s / 45s 三档剪辑包，进入供应商或剪辑师交接',
    gate: '需要视频 provider、产品素材 URL、生成授权和回调配置后，才能自动产出成片',
  },
  {
    title: 'Offer Test Matrix 分发',
    input: '折扣、套装、赠品、信任背书、平台活动和目标受众',
    action: '写入分发计划、dispatch、广告假设、停止条件和表现回流字段',
    gate: '没有平台 OAuth、广告账户和 analytics sync 前，只能做计划与手工回灌',
  },
];

export function VideoProductionQueueClient({
  initialProjectId = 'default-project',
  initialQueue = null,
  initialOperation = null,
}: {
  initialProjectId?: string;
  initialQueue?: VideoProductionQueue | null;
  initialOperation?: OneClickVideoOperationResult | null;
}) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [reference, setReference] = useState('');
  const [productAsset, setProductAsset] = useState('');
  const [legalConsent, setLegalConsent] = useState(false);
  const [providerConfigured, setProviderConfigured] = useState(false);
  const [resultAssetId, setResultAssetId] = useState('');
  const [resultTaskId, setResultTaskId] = useState('');
  const [resultUrls, setResultUrls] = useState('');
  const [resultChannel, setResultChannel] = useState('');
  const [queue, setQueue] = useState<VideoProductionQueue | null>(initialQueue);
  const [operation, setOperation] = useState<OneClickVideoOperationResult | null>(initialOperation);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  async function refreshQueue(nextProjectId = projectId, clearNotice = true) {
    setLoading(true);
    const res = await fetch(`/api/industrial-chain/video-workflow?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || '视频队列刷新失败');
      return;
    }
    setError('');
    if (clearNotice) setNotice('');
    setOperation(null);
    setQueue(data.queue);
  }

  async function createWorkflow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const res = await fetch('/api/industrial-chain/video-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create-one-click-operation',
        projectId: projectId || 'default-project',
        productName,
        category,
        platforms: platforms.split(',').map(item => item.trim()).filter(Boolean),
        references: reference ? [reference] : undefined,
        productAssets: productAsset ? [productAsset] : undefined,
        providerConfigured,
        legalConsent,
        createDistributionPlans: true,
        createDispatches: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || '视频工作流创建失败');
      return;
    }
    setError('');
    setNotice('视频工作流已创建，并写入生产交接、分发计划和执行队列。');
    setOperation(data.operation || null);
    setQueue(data.operation?.queue || data.queue);
    setProductName('');
    setCategory('');
    setReference('');
    setProductAsset('');
  }

  const items = queue?.items || [];
  const resultTarget = items.find(item => item.assetId === resultAssetId) || items[0];
  const resultAction = resultTarget?.runbookActions.find(action => action.id === 'ingest-production-result');
  const providerReadyRatio = queue && queue.itemCount > 0
    ? `${queue.providerReadyCount}/${queue.itemCount}`
    : '0/0';

  async function ingestProductionResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = resultTarget;
    if (!target) {
      setError('请先创建一个视频生产任务，再回灌成片。');
      return;
    }
    const urls = resultUrls.split(/[\n,]/).map(item => item.trim()).filter(Boolean);
    if (!resultTaskId.trim() || urls.length === 0) {
      setError('请填写生产任务编号和至少一个成片 URL。');
      return;
    }
    const payload = resultAction?.payload || {};
    setLoading(true);
    const res = await fetch('/api/industrial-chain/production-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId || queue?.projectId || 'default-project',
        sourceHandoffAssetId: target.assetId,
        dispatchId: typeof payload.dispatchId === 'string' ? payload.dispatchId : undefined,
        channel: resultChannel || target.channels[0],
        createReviewLinks: true,
        reviewTtlDays: 14,
        task: {
          taskId: resultTaskId.trim(),
          status: 'completed',
          assetUrls: urls,
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.message || data.error || '成片回灌失败');
      return;
    }
    setError('');
    setNotice(`成片已写回生产链路，生成 ${data.reviewLinks?.length || 0} 个客户审核链接。`);
    setResultTaskId('');
    setResultUrls('');
    await refreshQueue(projectId || queue?.projectId || 'default-project', false);
  }

  return (
    <main className="min-h-screen bg-[#0d1014] text-[#f4efe7]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Wenai 视频工厂</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">视频生产队列</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65">
            把商品 brief、参考视频、产品素材、AI 视频分析、智能混剪、供应商门禁、分发计划和执行记录统一到一条队列里。没有真实供应商授权时，任务保持仅交接，不伪装自动生成。
          </p>
        </header>

        {error ? <div className="border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">{error}</div> : null}
        {notice ? <div className="border border-emerald-400/40 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100">{notice}</div> : null}
        {operation ? (
          <section className="border border-amber-300/25 bg-amber-950/15 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-amber-200">One-click operation</p>
                <h2 className="mt-2 text-xl font-semibold">一键视频运营编排</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{operation.operatorSummary}</p>
              </div>
              <span className={`w-fit border px-3 py-1 text-xs ${operation.commerciallyExecutable ? 'border-emerald-300/35 text-emerald-100' : 'border-amber-300/35 text-amber-100'}`}>
                {operation.commerciallyExecutable ? '可商用自动化' : '外部能力未接入'}
              </span>
            </div>
            <div className="mt-4 border border-white/10 bg-black/20 p-3">
              <div className="text-xs font-semibold text-white/75">一键视频闭环判定</div>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                {operationClosureCards(operation).map(card => (
                  <div className="border border-white/10 bg-white/[0.03] px-3 py-2" key={card.title}>
                    <div className="text-xs font-semibold text-white/85">{card.title}</div>
                    <div className="mt-1 text-xs leading-5 text-white/55">{card.body}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="border border-white/10 bg-black/20 p-3">
                <div className="text-xs font-semibold text-white/75">自动创建物</div>
                <div className="mt-2 space-y-1">
                  {operation.autoCreated.slice(0, 6).map(item => (
                    <div className="truncate text-xs text-white/55" key={item}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="border border-white/10 bg-black/20 p-3">
                <div className="text-xs font-semibold text-white/75">外部阻塞清单</div>
                <div className="mt-2 space-y-1">
                  {operation.externalRequirements.length ? operation.externalRequirements.slice(0, 6).map(item => (
                    <div className="text-xs text-amber-100" key={item}>{item}</div>
                  )) : <div className="text-xs text-emerald-100">暂无外部阻塞。</div>}
                </div>
              </div>
              <div className="border border-white/10 bg-black/20 p-3">
                <div className="text-xs font-semibold text-white/75">规模化数字展示保护</div>
                <div className="mt-2 space-y-1">
                  {operation.scaleClaimGuards.map(claim => (
                    <div className="text-xs text-white/55" key={claim.requestedBenchmark}>
                      <span className="text-amber-100">{claim.requestedBenchmark}</span>：{claim.canDisplay ? '可展示' : '禁止作为 Wenai 指标展示'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-white/75">能力矩阵</div>
            <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {operation.capabilityStates.map(state => (
                <div className="border border-white/10 bg-black/20 p-3" key={state.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-white/85">{state.label}</div>
                    <span className={`shrink-0 border px-2 py-1 text-[11px] ${capabilityStatusClass(state.status)}`}>{capabilityStatusLabel(state.status)}</span>
                  </div>
                  <div className="mt-2 text-xs leading-5 text-white/50">{state.evidence}</div>
                  <div className="mt-2 text-xs leading-5 text-white/60">下一步：{state.nextStep}</div>
                  {state.externalRequirement ? <div className="mt-2 text-xs leading-5 text-amber-100">外部要求：{state.externalRequirement}</div> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border border-emerald-300/20 bg-emerald-300/[0.055] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Cut / One-click Video Board</p>
              <h2 className="mt-2 text-xl font-semibold">从 Hook 结构库到智能混剪包</h2>
            </div>
            <div className="max-w-sm text-xs leading-5 text-emerald-100/80">
              这层承接创意工厂，不把“创建任务”说成“自动成片”。只有 provider、素材授权、平台账号和回流都接上，才进入真实规模化视频工厂。
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {MIXCUT_OPERATION_BOARD.map(item => (
              <article className="border border-white/10 bg-black/20 p-4" key={item.title}>
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="mt-2 text-xs leading-5 text-white/65">输入：{item.input}</div>
                <div className="mt-2 text-xs leading-5 text-emerald-200">动作：{item.action}</div>
                <div className="mt-2 text-xs leading-5 text-amber-100">门禁：{item.gate}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-5">
            <form className="border border-white/10 bg-white/[0.03] p-5" onSubmit={createWorkflow}>
              <h2 className="text-base font-semibold">创建视频工作流</h2>
              <div className="mt-4 grid gap-3">
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={projectId} onChange={event => setProjectId(event.target.value)} placeholder="项目 ID" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={productName} onChange={event => setProductName(event.target.value)} placeholder="产品名" required />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={category} onChange={event => setCategory(event.target.value)} placeholder="类目" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={platforms} onChange={event => setPlatforms(event.target.value)} placeholder="平台，用逗号分隔" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={reference} onChange={event => setReference(event.target.value)} placeholder="参考视频 URL" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={productAsset} onChange={event => setProductAsset(event.target.value)} placeholder="产品素材 URL" />
                <label className="flex items-center gap-2 text-sm text-white/65">
                  <input type="checkbox" checked={providerConfigured} onChange={event => setProviderConfigured(event.target.checked)} />
                  供应商已配置
                </label>
                <label className="flex items-center gap-2 text-sm text-white/65">
                  <input type="checkbox" checked={legalConsent} onChange={event => setLegalConsent(event.target.checked)} />
                  已获得素材与生成授权
                </label>
                <button disabled={loading} className="bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:bg-white/20 disabled:text-white/40" type="submit">
                  创建任务并写入分发队列
                </button>
                <button disabled={loading} className="border border-white/15 px-4 py-2 text-sm text-white/75 disabled:text-white/30" type="button" onClick={() => void refreshQueue()}>
                  刷新队列
                </button>
              </div>
            </form>

            <form className="border border-white/10 bg-white/[0.03] p-5" onSubmit={ingestProductionResult}>
              <h2 className="text-base font-semibold">回灌成片并生成审核链接</h2>
              <p className="mt-2 text-xs leading-5 text-white/50">
                供应商或剪辑师完成后，把真实成片 URL 写回生产链路，系统会自动创建客户审核门户链接。
              </p>
              <div className="mt-4 grid gap-3">
                <select className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={resultTarget?.assetId || ''} onChange={event => setResultAssetId(event.target.value)}>
                  {items.length ? items.map(item => (
                    <option value={item.assetId} key={item.assetId}>{displayVideoTitle(item.title)}</option>
                  )) : <option value="">请先创建视频任务</option>}
                </select>
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={resultTaskId} onChange={event => setResultTaskId(event.target.value)} placeholder="生产任务编号或剪辑批次号" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={resultChannel} onChange={event => setResultChannel(event.target.value)} placeholder="渠道，默认使用任务首个渠道" />
                <textarea className="min-h-24 border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={resultUrls} onChange={event => setResultUrls(event.target.value)} placeholder="成片 URL，可一行一个或用逗号分隔" />
                <button disabled={loading || !items.length} className="bg-emerald-300 px-4 py-2 text-sm font-semibold text-black disabled:bg-white/20 disabled:text-white/40" type="submit">
                  写入成片并创建客户审核
                </button>
              </div>
            </form>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold">队列状态</h2>
              <div className="text-xs text-white/50">
                {queue ? `${queue.itemCount} 个任务 · 供应商就绪 ${providerReadyRatio} · 结果 ${queue.resultAssetCount} · 审核 ${queue.clientReviewCount} · 已批准 ${queue.approvedDeliverableCount}` : '正在加载 · 供应商就绪 0/0'}
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/45">
              运营动作包会把每个视频任务的阶段、优先级、服务时限、下一步接口路径、请求方式和请求内容汇总出来，方便手工执行或后续接自动化队列。
            </p>
            <div className="mt-4 grid gap-2 text-xs text-white/60 sm:grid-cols-4">
              <div className="border border-white/10 px-3 py-2">仅交接：{queue?.handoffOnlyCount || 0}</div>
              <div className="border border-white/10 px-3 py-2">阻塞：{queue?.blockedCount || 0}</div>
              <div className="border border-white/10 px-3 py-2">已回流：{queue?.measuredCount || 0}</div>
              <div className="border border-white/10 px-3 py-2">闭环：{queue?.averageLoopCompletionScore || 0}/100</div>
            </div>
            <div className="mt-5 space-y-4">
              {items.length ? items.map(item => (
                <article className="border border-white/10 bg-black/20 p-4" key={item.assetId}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold">{displayVideoTitle(item.title)}</div>
                      <div className="mt-1 text-xs text-white/45">{item.assetId}</div>
                    </div>
                    <span className={`w-fit border px-2 py-1 text-xs ${item.mode === 'provider_ready' ? 'border-emerald-300/40 text-emerald-200' : 'border-amber-300/40 text-amber-200'}`}>
                      {modeLabel(item.mode)}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-2 text-xs text-white/65 sm:grid-cols-4">
                    <div><dt className="text-white/35">阶段</dt><dd>{stageLabel(item.stage)}</dd></div>
                    <div><dt className="text-white/35">优先级</dt><dd>{priorityLabel(item.priority)}</dd></div>
                    <div><dt className="text-white/35">SLA</dt><dd>{item.slaHoursRemaining} 小时</dd></div>
                    <div><dt className="text-white/35">计划</dt><dd>{item.planCount}</dd></div>
                    <div><dt className="text-white/35">分发</dt><dd>{item.dispatchCount}</dd></div>
                    <div><dt className="text-white/35">待手工交接</dt><dd>{item.manualReadyDispatchCount}</dd></div>
                    <div><dt className="text-white/35">已回流</dt><dd>{item.measuredDispatchCount}</dd></div>
                    <div><dt className="text-white/35">结果</dt><dd>{item.resultAssetCount}</dd></div>
                    <div><dt className="text-white/35">审核</dt><dd>{item.clientReviewAssetCount}</dd></div>
                    <div><dt className="text-white/35">已批准</dt><dd>{item.approvedDeliverableCount}</dd></div>
                    <div><dt className="text-white/35">返修</dt><dd>{item.revisionRequestedCount}</dd></div>
                    <div><dt className="text-white/35">闭环分</dt><dd>{item.loopCompletionScore}/100</dd></div>
                  </dl>
                  <div className="mt-3 border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-xs font-semibold text-white/75">生产交接包</div>
                    <div className="mt-1 text-xs text-white/50">{readableHandoffSummary(item.handoffPacket.summary)}</div>
                    {item.handoffPacket.reviewPortalUrls.length ? (
                      <div className="mt-2 space-y-1">
                        {item.handoffPacket.reviewPortalUrls.map(url => (
                          <a className="block truncate text-xs text-emerald-200 underline-offset-4 hover:underline" href={url} key={url}>客户审核门户：{url}</a>
                        ))}
                      </div>
                    ) : null}
                    {item.handoffPacket.missingEvidence.length ? (
                      <div className="mt-2 space-y-1">
                        {item.handoffPacket.missingEvidence.slice(0, 4).map(item => <div className="text-xs text-amber-100" key={item}>缺证据：{queueText(item)}</div>)}
                      </div>
                    ) : <div className="mt-2 text-xs text-emerald-200">交接证据已覆盖计划、执行、成片、审核、批准和表现回流。</div>}
                  </div>
                  <div className="mt-3 text-xs text-white/55">渠道：{item.channels.join(', ') || '-'}</div>
                  {item.remixPlan.length ? (
                    <div className="mt-3 border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-xs font-semibold text-white/75">智能混剪计划</div>
                      <div className="mt-2 space-y-3">
                        {item.remixPlan.slice(0, 3).map(variant => (
                          <div className="border-b border-white/10 pb-2 text-xs text-white/60 last:border-b-0 last:pb-0" key={variant.id}>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                              <div className="font-semibold text-white/85">{variant.label}</div>
                              <span className="w-fit border border-emerald-300/30 px-2 py-1 text-emerald-100">{remixSourceLabel(variant.source)}</span>
                            </div>
                            <div className="mt-1 text-white/55">钩子：{variant.hook}</div>
                            <div className="mt-1 text-white/45">剪辑：{variant.cutPlan.slice(0, 3).join(' / ')}</div>
                            <div className="mt-1 text-amber-100">边界：{variant.riskBoundary}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {item.resultUrls.length ? (
                    <div className="mt-3 space-y-1">
                      {item.resultUrls.map(url => <div className="truncate text-xs text-white/60" key={url}>结果：{url}</div>)}
                    </div>
                  ) : null}
                  {item.reviewLinks.length ? (
                    <div className="mt-3 space-y-1">
                      {item.reviewLinks.map(link => (
                        <a className="block truncate text-xs text-emerald-200 underline-offset-4 hover:underline" href={`/review/${link.token}`} key={link.token}>
                          审核：{link.assetTitle} / {link.status}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {item.blockers.length ? (
                    <div className="mt-3 space-y-1">
                      {item.blockers.map(blocker => <div className="text-xs text-amber-200" key={blocker}>阻塞：{queueText(blocker)}</div>)}
                    </div>
                  ) : null}
                  {item.nextActions.length ? (
                    <div className="mt-3 space-y-1">
                      {item.nextActions.map(action => <div className="text-xs text-white/70" key={action}>下一步：{queueText(action)}</div>)}
                    </div>
                  ) : <div className="mt-3 text-xs text-emerald-200">已进入可回流复盘状态。</div>}
                  {item.runbookActions.length ? (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="text-xs font-semibold text-white/70">运营动作包</div>
                      <div className="mt-2 space-y-1">
                        {item.runbookActions.map(action => (
                          <div className="text-xs text-white/55" key={action.id}>
                            {action.label} · 请求方式 {action.method} · 接口路径 {action.endpoint}
                            <div className="mt-1 truncate text-white/35">请求内容：{readablePayload(action.payload)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              )) : (
                <div className="border border-white/10 px-4 py-8 text-sm text-white/55">
                  当前项目还没有视频生产任务。创建任务后，系统会自动生成生产交接资产、分发计划和执行记录。
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
