'use client';

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';

import type {
  CreativeCollectionTask,
  CreativeCollectorRunPlan,
  CreativeCollectorTarget,
  CreativeHarvestRun,
  CreativeMonitorRecord,
  CreativeMonitorType,
  CreativeMonitoringSnapshot,
} from '@/lib/creative-monitoring';
import type { CreativeOpportunity } from '@/lib/creative-intelligence';

interface CreativeSnapshot {
  insightCount: number;
  competitorAccountCount: number;
  trendRankCount: number;
  teardownCount: number;
  opportunityCount: number;
  averageConfidenceScore: number;
  opportunityMap: CreativeOpportunity[];
  patternClusterCount: number;
  crossSourcePatternCount: number;
  creativeMoatScore: number;
  patternClusters: {
    id: string;
    platform: string;
    pacing: string;
    sourceMix: string[];
    insightIds: string[];
    totalViews: number;
    totalSales: number;
    totalRevenue: number;
    evidenceScore: number;
    dominantHooks: string[];
    reusableAngles: string[];
    synthesis: string;
    nextProductionMove: string;
    distributionTest: string;
    riskBoundary: string;
  }[];
  missingLinks: string[];
}

interface CreativeMonitoringResponse {
  projectId: string;
  monitors: CreativeMonitorRecord[];
  dueTasks: CreativeCollectionTask[];
  collectorManifest: CreativeCollectorTarget[];
  collectorRunPlan: CreativeCollectorRunPlan;
  harvestRuns: CreativeHarvestRun[];
  snapshot: CreativeMonitoringSnapshot;
  creativeSnapshot: CreativeSnapshot;
}

const TYPE_LABELS: Record<CreativeMonitorType, string> = {
  competitor_account: '竞品账号',
  trend_rank: '榜单趋势',
  video_keyword: '视频拆解',
};

const GAP_LABELS: Record<string, string> = {
  'Missing creative monitoring watchlist': '还没有创意监控清单',
  'No active creative monitors': '没有启用中的监控项',
  'Missing competitor account monitor': '缺少竞品账号监控',
  'Missing trend/rank monitor': '缺少榜单趋势监控',
  'Missing video keyword teardown monitor': '缺少视频关键词拆解监控',
  'Missing collector manifest for scheduled harvest': '缺少可交给采集器执行的周期采集清单',
  'Missing scheduled creative harvest run evidence': '缺少周期采集运行证据',
  'No due collection task or imported monitor signal': '没有到期采集任务或已导入信号',
};

const FUNNEL_STAGE_LABELS: Record<string, string> = {
  awareness: '认知',
  consideration: '种草',
  conversion: '转化',
  retention: '复购',
};

const EVIDENCE_SCHEMA_LABELS: Record<string, string> = {
  sourceUrl: '来源链接',
  title: '标题',
  hook: '开头钩子',
  hookType: '钩子类型',
  pacing: '节奏',
  proofPoint: '证据点',
  reusableAngle: '可复用角度',
  metrics: '互动指标',
  views: '播放',
  likes: '点赞',
  saves: '收藏',
  comments: '评论',
  account: '账号',
  rank: '榜单位置',
  category: '类目',
  publishedAt: '发布时间',
};

const HOOKSHOT_STYLE_PLAYBOOK = [
  {
    title: 'Hook Bank',
    signal: '前三秒钩子、反差句、痛点开场、价格锚点和结果承诺',
    output: '沉淀为可复用 hook 模板，进入下一轮脚本和 A/B 分发计划',
    guardrail: '只复用结构和验证逻辑，不复制竞品原句、画面或素材表达',
  },
  {
    title: 'UGC Script Spine',
    signal: '真人口播、使用前后、场景演示、证据点和行动号召',
    output: '生成 15s / 30s / 45s 三档脚本骨架，交给视频工厂继续成片',
    guardrail: '需要品牌授权素材、产品实拍或生成素材许可后才能进入真实成片',
  },
  {
    title: 'Offer Test Matrix',
    signal: '折扣、套装、赠品、信任背书、稀缺性和平台活动节点',
    output: '把创意机会转成投放假设：受众、平台、预算、指标和停止条件',
    guardrail: '没有广告账户和 analytics sync 前，只能生成投放方案，不能宣称自动优化',
  },
];

const COMPOSE_INTELLIGENCE_STACK = [
  {
    stage: '全网灵感管理',
    input: '竞品账号、公开榜单、授权视频链接、客户历史素材和运营手工观察',
    output: '统一沉淀到 insight ledger，保留来源、证据、风险边界和可复用角度',
    internal: '内部可做：手动导入、周期任务、证据字段、缺口记录、机会地图',
    external: '外部需要：平台授权、榜单/视频数据源、合法抓取或官方 API',
  },
  {
    stage: '热门视频解析',
    input: '视频 URL、转写摘要、画面节奏、字幕、物体、评论区需求和互动指标',
    output: '拆成 hook、scene beats、proof point、CTA、风险表达和可混剪素材需求',
    internal: '内部可做：解析结果回灌、结构化字段、脚本约束和视频队列交接',
    external: '外部需要：多模态视频解析 provider、素材授权、下载/存储权限',
  },
  {
    stage: 'Hook Bank',
    input: '前三秒钩子、反差句、痛点开场、结果承诺、价格锚点和信任背书',
    output: '生成可 A/B 测的中文脚本开头，并写入品牌学习档案',
    internal: '内部可做：结构复用、禁用表达、胜出模式沉淀、下一轮 Brief 约束',
    external: '外部需要：投放回流和真实转化数据，验证哪个 hook 真正胜出',
  },
  {
    stage: 'Offer Test Matrix',
    input: '折扣、套装、赠品、稀缺性、达人背书、节日节点和平台活动',
    output: '变成分发计划、广告假设、预算门槛、停止条件和复盘口径',
    internal: '内部可做：广告 campaign ledger、dispatch gate、表现 CSV 回流',
    external: '外部需要：广告账户授权、自动建计划、平台 analytics sync',
  },
];

function typeLabel(type: CreativeMonitorType) {
  return TYPE_LABELS[type] || type;
}

function gapLabel(value: string) {
  return GAP_LABELS[value] || value;
}

function funnelStageLabel(value: string) {
  return FUNNEL_STAGE_LABELS[value] || value;
}

function evidenceSchemaLabel(value: string) {
  return EVIDENCE_SCHEMA_LABELS[value] || value;
}

function sourceMixLabel(values: string[]) {
  const labels: Record<string, string> = {
    manual: '手工导入',
    'competitor-account': '竞品账号',
    'trend-rank': '榜单趋势',
    'video-teardown': '视频拆解',
  };
  return values.map(value => labels[value] || value).join(' / ');
}

function collectorStatusLabel(value?: string) {
  if (value === 'provider_ready') return '真实采集器已接入';
  if (value === 'not_configured') return '采集器待配置';
  if (value === 'degraded') return '采集器异常';
  return '人工采集模式';
}

function formatTime(value?: string) {
  if (!value) return '尚未运行';
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toLocaleString('zh-CN') : value;
}

export function buildCreativeComposeActionPlaybook(
  snapshot?: CreativeMonitoringSnapshot,
  creative?: CreativeSnapshot,
  collectorPlan?: CreativeCollectorRunPlan,
) {
  const monitorCount = snapshot?.monitorCount || 0;
  const dueTaskCount = snapshot?.dueTaskCount || 0;
  const coverageScore = snapshot?.sourceSyncCoverageScore || 0;
  const sourceScaleScore = snapshot?.creativeSourceScaleScore || 0;
  const insightCount = creative?.insightCount || 0;
  const opportunityCount = creative?.opportunityCount || 0;
  const patternClusterCount = creative?.patternClusterCount || 0;
  const moatScore = creative?.creativeMoatScore || 0;
  const providerReady = Boolean(collectorPlan?.providerReady);

  if (opportunityCount > 0 && patternClusterCount > 0) {
    return {
      title: 'Compose 到生产的下一步',
      primaryAction: '把机会地图写入脚本资产、分发计划和视频工厂输入，不再停留在灵感收藏。',
      proofToCheck: '必须能追踪 creative_opportunity_id、insight_id、来源组合、合规边界和回流指标。',
      handoffBoundary: providerReady
        ? 'provider 可执行采集，但仍只能复用结构和验证逻辑，不能复制竞品表达。'
        : '未接授权采集 provider 前，保持人工/授权来源回灌，不宣称全网自动监控。',
      cards: [
        `洞察 ${insightCount} / 机会 ${opportunityCount} / 模式簇 ${patternClusterCount}`,
        `采集覆盖 ${coverageScore} / 源规模 ${sourceScaleScore} / 护城河分 ${moatScore}`,
        '下一步应进入脚本、视频任务、分发计划和品牌学习档案。',
      ],
    };
  }

  if (insightCount > 0) {
    return {
      title: '洞察沉淀下一步',
      primaryAction: '继续补竞品账号、榜单趋势和视频拆解三类来源，直到能形成跨来源模式簇。',
      proofToCheck: '单条洞察不能直接当爆款打法；至少需要跨来源证据和风险边界。',
      handoffBoundary: '没有模式簇和表现回流前，只能生成生产假设，不能宣称已找到稳定爆款结构。',
      cards: [
        `洞察 ${insightCount} / 机会 ${opportunityCount} / 模式簇 ${patternClusterCount}`,
        `监控项 ${monitorCount} / 到期任务 ${dueTaskCount}`,
        '优先补齐 account、rank、video teardown 三类信号。',
      ],
    };
  }

  return {
    title: 'Compose 启动下一步',
    primaryAction: monitorCount > 0
      ? '先结算到期采集或导入真实观察，形成第一批可复用洞察。'
      : '先补齐竞品账号、榜单趋势和视频关键词三类监控，建立 Hook Bank 输入源。',
    proofToCheck: '每条输入都要有来源、证据点、可复用角度和不可复制边界。',
    handoffBoundary: '没有授权来源、公开证据或手工观察前，不生成伪洞察，也不自动抓取平台内容。',
    cards: [
      `监控项 ${monitorCount} / 到期任务 ${dueTaskCount}`,
      `洞察 ${insightCount} / 机会 ${opportunityCount}`,
      providerReady ? '采集 provider 已接入，可执行授权来源任务。' : '当前仍是人工/授权来源回灌模式。',
    ],
  };
}

export function CreativeMonitoringConsoleClient({ initialProjectId = 'default-project' }: { initialProjectId?: string }) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [platform, setPlatform] = useState('TikTok Shop');
  const [type, setType] = useState<CreativeMonitorType>('competitor_account');
  const [target, setTarget] = useState('@competitor_account');
  const [category, setCategory] = useState('家居收纳');
  const [cadenceHours, setCadenceHours] = useState(24);
  const [selectedMonitorId, setSelectedMonitorId] = useState('');
  const [signalTitle, setSignalTitle] = useState('');
  const [signalAngle, setSignalAngle] = useState('');
  const [signalProof, setSignalProof] = useState('');
  const [signalUrl, setSignalUrl] = useState('');
  const [collectorJson, setCollectorJson] = useState('');
  const [data, setData] = useState<CreativeMonitoringResponse | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const monitors = useMemo(() => data?.monitors || [], [data?.monitors]);
  const selectedMonitor = useMemo(
    () => monitors.find(monitor => monitor.id === selectedMonitorId) || monitors[0],
    [monitors, selectedMonitorId],
  );

  async function refresh(nextProjectId = projectId) {
    setLoading(true);
    const res = await fetch(`/api/creative-monitoring?projectId=${encodeURIComponent(nextProjectId || 'default-project')}`, { cache: 'no-store' });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error || '创意监控刷新失败');
      return;
    }
    setMessage('');
    setData(body);
    if (!selectedMonitorId && body.monitors?.[0]?.id) setSelectedMonitorId(body.monitors[0].id);
  }

  useEffect(() => {
    void refresh(initialProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProjectId]);

  async function createMonitor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const res = await fetch('/api/creative-monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId || 'default-project',
        monitor: {
          type,
          platform,
          target,
          category,
          cadenceHours,
          nextCheckAt: new Date(Date.now() - 1000).toISOString(),
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error || '监控项创建失败');
      return;
    }
    setSelectedMonitorId(body.monitor?.id || '');
    setMessage('监控项已创建，并进入待采集队列。');
    await refresh(projectId);
  }

  async function bootstrapWatchlist() {
    setLoading(true);
    const res = await fetch('/api/creative-monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'bootstrap-watchlist',
        projectId: projectId || 'default-project',
        category,
        platform,
        competitorAccounts: [target],
        cadenceHours,
      }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error || '三类监控清单补齐失败');
      return;
    }
    setSelectedMonitorId(body.monitors?.[0]?.id || '');
    setMessage(`已补齐账号、榜单、视频拆解三类监控，生成 ${body.dueTasks?.length || 0} 个到期采集任务。`);
    await refresh(projectId);
  }

  async function importSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const monitor = selectedMonitor;
    if (!monitor) {
      setMessage('请先创建一个监控项，再导入创意观察。');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/creative-monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'import-signal',
        signal: {
          monitorId: monitor.id,
          title: signalTitle || `${monitor.target} 创意观察`,
          url: signalUrl || undefined,
          hookType: monitor.type === 'trend_rank' ? 'comparison' : 'proof',
          pacing: 'fast',
          reusableAngle: signalAngle || '只提取结构顺序，不复制原素材表达，重写为 Wenai 当前项目可测试脚本。',
          proofPoint: signalProof || '前三秒出现可验证结果、强对比或真实使用证据。',
          metrics: { views: 12000, saves: 300 },
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error || '创意观察导入失败');
      return;
    }
    setMessage('创意观察已写入洞察账本，可用于脚本、分发计划和下一轮测试。');
    setSignalTitle('');
    setSignalAngle('');
    setSignalProof('');
    setSignalUrl('');
    await refresh(projectId);
  }

  async function runHarvest() {
    setLoading(true);
    const res = await fetch('/api/creative-monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'run-harvest', projectId, observations: [] }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.error || '周期采集结算失败');
      return;
    }
    const missing = body.run?.missingObservationMonitorIds?.length || 0;
    const imported = body.run?.importedInsightIds?.length || 0;
    setMessage(missing > 0
      ? `采集结算完成：写入 ${imported} 条洞察，${missing} 个到期监控缺少真实观察，已记录为运营缺口。`
      : `采集结算完成：写入 ${imported} 条创意洞察。`);
    await refresh(projectId);
  }

  function fillCollectorExample() {
    const task = data?.collectorManifest?.[0];
    const fallbackMonitor = selectedMonitor;
    const monitorId = task?.monitorId || fallbackMonitor?.id;
    const monitorType = task?.type || fallbackMonitor?.type || 'video_keyword';
    const monitorPlatform = task?.platform || fallbackMonitor?.platform || platform;
    const monitorTarget = task?.target || fallbackMonitor?.target || target;
    setCollectorJson(JSON.stringify([{
      monitorId,
      type: monitorType,
      platform: monitorPlatform,
      target: monitorTarget,
      title: `${monitorTarget} 爆款结构拆解`,
      url: 'https://example.com/public-video-or-rank',
      hookType: 'proof',
      pacing: 'fast',
      reusableAngle: '前三秒先给结果对比，再展示使用场景，最后落到可购买理由。',
      proofPoint: '公开视频中评论区集中追问材质、尺寸和购买入口，说明需求已被验证。',
      cta: '引导用户查看同类 SKU 的组合方案。',
      visualPattern: '近景痛点画面 + 手部演示 + 结果前后对比',
      sceneBeats: ['痛点开场', '产品进入', '前后对比', '购买理由'],
      transcriptSummary: '用真实使用前后差异证明收纳效率提升。',
      detectedObjects: ['收纳盒', '衣柜', '标签贴'],
      textOverlays: ['3 秒看懂', '前后对比', '适合小户型'],
      metrics: { views: 86000, likes: 4200, saves: 980, comments: 212 },
      riskNotes: ['只复用结构和观察，不复制原视频表达。'],
    }], null, 2));
  }

  async function ingestCollectorRun(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let observations: unknown;
    try {
      observations = JSON.parse(collectorJson);
    } catch {
      setMessage('采集结果不是有效 JSON。请粘贴数组格式的观察结果，或先使用示例模板。');
      return;
    }
    if (!Array.isArray(observations) || observations.length === 0) {
      setMessage('采集结果必须是非空数组。空结果只能结算为缺口，不能生成伪洞察。');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/creative-monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ingest-collector-run', projectId, observations }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.message || body.error || '采集结果回灌失败');
      return;
    }
    const imported = body.run?.importedInsightIds?.length || 0;
    const assets = body.run?.brandLearningAssetIds?.length || 0;
    setMessage(`采集结果已回灌：写入 ${imported} 条洞察，沉淀 ${assets} 个品牌学习资产，并刷新脚本/分发计划证据。`);
    setCollectorJson('');
    await refresh(projectId);
  }

  async function applyOpportunityMap() {
    setLoading(true);
    const res = await fetch('/api/creative-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'apply-to-industrial-chain', projectId }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(body.message || body.error || '创意机会地图还不能转成生产资产，请先导入真实洞察。');
      return;
    }
    setMessage(`已把机会地图写入生产链：对标资产 ${body.application?.benchmarkAsset?.id || '-'}，脚本 ${body.application?.scriptAsset?.id || '-'}，分发计划 ${body.application?.distributionPlan?.id || '-'}。`);
    await refresh(projectId);
  }

  const snapshot = data?.snapshot;
  const creative = data?.creativeSnapshot;
  const collectorPlan = data?.collectorRunPlan;
  const composePlaybook = buildCreativeComposeActionPlaybook(snapshot, creative, collectorPlan);

  return (
    <main className="min-h-screen bg-[#101315] text-[#f8f2e8]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-5 py-10 sm:px-8">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Wenai 创意情报台</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">竞品账号、榜单和视频拆解监控</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65">
            把筷子科技式的爆款拆解、账号追踪、榜单监控先做成可运行的内部账本。当前不伪装未授权自动抓取：运营人员只导入公开可用或已授权观察，系统负责沉淀开头钩子、节奏、证据点、可复用角度和周期采集缺口。
          </p>
        </header>

        <section className="border border-amber-300/20 bg-amber-300/[0.06] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Hookshot / Hookly 参考层</p>
              <h2 className="mt-2 text-xl font-semibold">从单条灵感升级为可复用广告结构库</h2>
            </div>
            <div className="max-w-sm text-xs leading-5 text-amber-100/80">
              终局不是“看见一个爆款就仿一个”，而是把 hook、UGC 脚本骨架和 offer 测试矩阵持续沉淀，反哺视频生产和投放回流。
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {HOOKSHOT_STYLE_PLAYBOOK.map(item => (
              <article className="border border-white/10 bg-black/20 p-4" key={item.title}>
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="mt-2 text-xs leading-5 text-white/65">输入信号：{item.signal}</div>
                <div className="mt-2 text-xs leading-5 text-emerald-200">Wenai 输出：{item.output}</div>
                <div className="mt-2 text-xs leading-5 text-amber-100">边界：{item.guardrail}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.035] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Compose Intelligence Stack</p>
              <h2 className="mt-2 text-xl font-semibold">把灵感、视频、Hook 和投放假设串成一条生产约束链</h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-white/55">
              这层是 Wenai 的护城河入口：不是只保存素材，而是把每个外部信号转成可复用结构、品牌记忆和下一轮视频/分发动作。没有真实 provider 的部分继续标成外部门禁。
            </p>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {COMPOSE_INTELLIGENCE_STACK.map(item => (
              <article className="border border-white/10 bg-black/20 p-4" key={item.stage}>
                <div className="text-sm font-semibold text-white">{item.stage}</div>
                <div className="mt-3 space-y-2 text-xs leading-5">
                  <p className="text-white/60"><span className="text-white/90">输入：</span>{item.input}</p>
                  <p className="text-emerald-200"><span className="text-white/90">输出：</span>{item.output}</p>
                  <p className="text-white/55"><span className="text-white/90">内部：</span>{item.internal}</p>
                  <p className="text-amber-100"><span className="text-white/90">外部：</span>{item.external}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-sky-300/20 bg-sky-950/20 p-5">
          <div className="flex flex-col gap-3 border-b border-sky-300/15 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Compose Action Playbook</p>
              <h2 className="mt-2 text-xl font-semibold">{composePlaybook.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{composePlaybook.primaryAction}</p>
            </div>
            <div className="w-full border border-sky-300/20 bg-black/20 p-3 text-xs leading-5 text-sky-100 sm:max-w-sm">
              {composePlaybook.proofToCheck}
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {composePlaybook.cards.map(card => (
              <div className="border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/60" key={card}>{card}</div>
            ))}
            <div className="border border-rose-300/20 bg-rose-950/20 p-3 text-xs leading-5 text-rose-100">
              停止线：{composePlaybook.handoffBoundary}
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-6">
          <Metric label="监控项" value={snapshot?.monitorCount ?? '-'} />
          <Metric label="到期任务" value={snapshot?.dueTaskCount ?? '-'} />
          <Metric label="采集清单" value={snapshot?.collectorTargetCount ?? '-'} />
          <Metric label="采集覆盖" value={snapshot ? `${snapshot.sourceSyncCoverageScore}` : '-'} />
          <Metric label="源规模" value={snapshot ? `${snapshot.creativeSourceScaleScore}` : '-'} />
          <Metric label="模式簇" value={creative?.patternClusterCount ?? '-'} />
        </div>

        <section className="border border-white/10 bg-white/[0.035] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">采集器接入状态</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {collectorStatusLabel(collectorPlan?.adapterStatus.status)}：
                {collectorPlan?.providerReady
                  ? '已具备把到期账号、榜单和视频拆解任务交给授权采集器执行的条件。'
                  : '当前继续走人工运营回灌，不假装已完成未授权自动抓取。'}
              </p>
            </div>
            <div className="grid gap-2 text-xs text-white/60 sm:min-w-72">
              <div>服务：{collectorPlan?.adapterStatus.providerName || 'manual-creative-ops'}</div>
              <div>模式：{collectorPlan?.dispatchMode === 'provider' ? '真实 provider' : '人工运营'}</div>
              <div>支持：{collectorPlan?.adapterStatus.supportedMonitorTypes?.map(typeLabel).join(' / ') || '竞品账号 / 榜单趋势 / 视频拆解'}</div>
              <div className={collectorPlan?.providerReady ? 'text-emerald-200' : 'text-amber-100'}>
                缺口：{collectorPlan?.adapterStatus.missingLinks?.length ? collectorPlan.adapterStatus.missingLinks.join(' / ') : '无'}
              </div>
            </div>
          </div>
        </section>

        {message ? <div className="border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{message}</div> : null}

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <form className="border border-white/10 bg-white/[0.035] p-5" onSubmit={createMonitor}>
              <h2 className="text-base font-semibold">创建监控项</h2>
              <div className="mt-4 grid gap-3">
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={projectId} onChange={event => setProjectId(event.target.value)} placeholder="项目 ID" />
                <select className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={type} onChange={event => setType(event.target.value as CreativeMonitorType)}>
                  <option value="competitor_account">竞品账号</option>
                  <option value="trend_rank">榜单趋势</option>
                  <option value="video_keyword">视频关键词</option>
                </select>
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={platform} onChange={event => setPlatform(event.target.value)} placeholder="平台" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={target} onChange={event => setTarget(event.target.value)} placeholder="账号、榜单或关键词" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={category} onChange={event => setCategory(event.target.value)} placeholder="类目" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" type="number" min={1} max={720} value={cadenceHours} onChange={event => setCadenceHours(Number(event.target.value) || 24)} placeholder="采集间隔小时" />
                <button disabled={loading} className="bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:bg-white/20 disabled:text-white/40" type="submit">
                  写入监控清单
                </button>
                <button disabled={loading} className="border border-amber-300/40 px-4 py-2 text-sm font-semibold text-amber-100 disabled:text-white/30" type="button" onClick={() => void bootstrapWatchlist()}>
                  补齐三类监控
                </button>
                <button disabled={loading} className="border border-white/15 px-4 py-2 text-sm text-white/75 disabled:text-white/30" type="button" onClick={() => void refresh()}>
                  刷新监控状态
                </button>
              </div>
            </form>

            <form className="border border-white/10 bg-white/[0.035] p-5" onSubmit={importSignal}>
              <h2 className="text-base font-semibold">导入一次真实创意观察</h2>
              <div className="mt-4 grid gap-3">
                <select className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={selectedMonitor?.id || ''} onChange={event => setSelectedMonitorId(event.target.value)}>
                  {monitors.length ? monitors.map(monitor => (
                    <option value={monitor.id} key={monitor.id}>{typeLabel(monitor.type)} / {monitor.target}</option>
                  )) : <option value="">请先创建监控项</option>}
                </select>
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={signalTitle} onChange={event => setSignalTitle(event.target.value)} placeholder="观察标题" />
                <input className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={signalUrl} onChange={event => setSignalUrl(event.target.value)} placeholder="公开视频、榜单或账号链接" />
                <textarea className="min-h-24 border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={signalAngle} onChange={event => setSignalAngle(event.target.value)} placeholder="可复用角度：只提取结构，不复制表达" />
                <textarea className="min-h-20 border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300" value={signalProof} onChange={event => setSignalProof(event.target.value)} placeholder="证据点或视频拆解摘要" />
                <button disabled={loading} className="bg-white px-4 py-2 text-sm font-semibold text-black disabled:bg-white/20 disabled:text-white/40" type="submit">
                  写入创意洞察
                </button>
              </div>
            </form>

            <form className="border border-white/10 bg-white/[0.035] p-5" onSubmit={ingestCollectorRun}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold">回灌采集器结果</h2>
                <button disabled={loading} className="border border-white/15 px-3 py-2 text-xs text-white/75 disabled:text-white/30" type="button" onClick={fillCollectorExample}>
                  填入示例模板
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/50">
                用于承接榜单监控、账号追踪和视频多模态拆解结果。必须是非空 JSON 数组；空结果只记录缺口，不生成洞察。
              </p>
              <textarea
                className="mt-4 min-h-56 w-full border border-white/15 bg-black/30 px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-amber-300"
                value={collectorJson}
                onChange={event => setCollectorJson(event.target.value)}
                placeholder='[{"monitorId":"...","title":"爆款视频拆解","reusableAngle":"只复用结构","proofPoint":"公开指标或画面证据"}]'
              />
              <button disabled={loading} className="mt-3 bg-emerald-300 px-4 py-2 text-sm font-semibold text-black disabled:bg-white/20 disabled:text-white/40" type="submit">
                写入采集运行
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="border border-white/10 bg-white/[0.035] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold">监控运营面板</h2>
                <button disabled={loading} className="border border-amber-300/40 px-4 py-2 text-xs font-semibold text-amber-100 disabled:text-white/30" type="button" onClick={() => void runHarvest()}>
                  结算到期采集
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="竞品账号" value={snapshot?.competitorAccountMonitorCount ?? '-'} compact />
                <Metric label="榜单趋势" value={snapshot?.trendRankMonitorCount ?? '-'} compact />
                <Metric label="视频拆解" value={snapshot?.videoKeywordMonitorCount ?? '-'} compact />
              </div>

              <div className="mt-5 space-y-3">
                {monitors.length ? monitors.map(monitor => (
                  <article className="border border-white/10 bg-black/20 p-4" key={monitor.id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold">{monitor.target}</div>
                        <div className="mt-1 text-xs text-white/45">{monitor.platform} / {typeLabel(monitor.type)} / 每 {monitor.cadenceHours} 小时</div>
                      </div>
                      <span className="w-fit border border-emerald-300/30 px-2 py-1 text-xs text-emerald-200">{monitor.status === 'active' ? '监控中' : '已暂停'}</span>
                    </div>
                    <div className="mt-3 text-xs text-white/55">下次检查：{formatTime(monitor.nextCheckAt)}</div>
                    {monitor.lastImportedInsightId ? <div className="mt-1 text-xs text-emerald-200">已沉淀洞察：{monitor.lastImportedInsightId}</div> : null}
                  </article>
                )) : (
                  <div className="border border-white/10 px-4 py-8 text-sm text-white/55">
                    当前项目还没有创意监控项。先添加一个竞品账号、类目榜单或视频关键词。
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="到期采集任务">
                {(data?.dueTasks || []).length ? data!.dueTasks.slice(0, 5).map(task => (
                  <div className="border-b border-white/10 py-2 text-xs text-white/65 last:border-b-0" key={task.id}>
                    <div className="font-semibold text-white/85">{typeLabel(task.type)} / {task.target}</div>
                    <div className="mt-1">{task.instruction}</div>
                    <div className="mt-1 text-white/40">验收：{task.acceptance}</div>
                    <div className="mt-1 text-white/40">负责人：{task.ownerRole} / 结果回流：品牌学习档案</div>
                  </div>
                )) : <div className="text-sm text-white/50">暂无到期任务。创建监控项或等待下一个采集窗口。</div>}
              </Panel>
              <Panel title="采集器执行清单">
                {(data?.collectorManifest || []).length ? data!.collectorManifest.slice(0, 5).map(target => (
                  <div className="border-b border-white/10 py-2 text-xs text-white/65 last:border-b-0" key={target.id}>
                    <div className="font-semibold text-white/85">{typeLabel(target.type)} / {target.target}</div>
                    <div className="mt-1 text-white/55">查询：{target.collectorQuery}</div>
                    <div className="mt-1 text-white/40">来源：{target.sourceHint}</div>
                    <div className="mt-1 text-emerald-200">字段：{target.evidenceSchema.slice(0, 7).map(evidenceSchemaLabel).join(' / ')}</div>
                  </div>
                )) : <div className="text-sm text-white/50">暂无可交给采集器执行的到期清单。</div>}
              </Panel>
            </div>

            <Panel title="创意机会地图">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/55">
                  洞察 {creative?.insightCount ?? 0} 条 / 机会 {creative?.opportunityCount ?? 0} 个 / 跨来源模式 {creative?.crossSourcePatternCount ?? 0} 个 / 护城河分 {creative?.creativeMoatScore ?? 0}
                </div>
                <button
                  disabled={loading || !creative?.opportunityCount}
                  className="border border-emerald-300/40 px-3 py-2 text-xs font-semibold text-emerald-100 disabled:border-white/10 disabled:text-white/30"
                  type="button"
                  onClick={() => void applyOpportunityMap()}
                >
                  生成脚本与分发计划
                </button>
              </div>
              {(creative?.opportunityMap || []).length ? creative!.opportunityMap.slice(0, 5).map(opportunity => (
                <article className="border-b border-white/10 py-3 text-xs text-white/65 last:border-b-0" key={opportunity.insightId}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-semibold text-white/90">{opportunity.platform} / {funnelStageLabel(opportunity.funnelStage)}</div>
                      <div className="mt-1 text-white/70">{opportunity.angle}</div>
                    </div>
                    <span className="w-fit border border-amber-300/30 px-2 py-1 text-amber-100">置信度 {opportunity.confidenceScore}</span>
                  </div>
                  <div className="mt-2 text-white/50">生产：{opportunity.productionInstruction}</div>
                  <div className="mt-1 text-white/50">分发：{opportunity.distributionInstruction}</div>
                  <div className="mt-1 text-amber-100">边界：{opportunity.complianceBoundary}</div>
                </article>
              )) : <div className="text-sm text-white/50">暂无机会地图。先导入竞品账号、榜单或视频拆解信号，再生成可执行脚本与分发计划。</div>}
            </Panel>

            <Panel title="可复用打法簇">
              {(creative?.patternClusters || []).length ? creative!.patternClusters.slice(0, 4).map(cluster => (
                <article className="border-b border-white/10 py-3 text-xs text-white/65 last:border-b-0" key={cluster.id}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-semibold text-white/90">{cluster.platform} / {cluster.pacing}</div>
                      <div className="mt-1 text-emerald-200">{sourceMixLabel(cluster.sourceMix)}</div>
                    </div>
                    <span className="w-fit border border-emerald-300/30 px-2 py-1 text-emerald-100">证据分 {cluster.evidenceScore}</span>
                  </div>
                  <div className="mt-2 text-white/70">{cluster.synthesis}</div>
                  <div className="mt-2 text-white/50">生产动作：{cluster.nextProductionMove}</div>
                  <div className="mt-1 text-white/50">分发实验：{cluster.distributionTest}</div>
                  <div className="mt-1 text-amber-100">边界：{cluster.riskBoundary}</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <Metric label="播放" value={cluster.totalViews} compact />
                    <Metric label="订单" value={cluster.totalSales} compact />
                    <Metric label="收入" value={cluster.totalRevenue} compact />
                  </div>
                </article>
              )) : (
                <div className="text-sm leading-6 text-white/50">
                  暂无可复用打法簇。至少需要竞品账号、榜单趋势、视频拆解中两类以上信号落在同一平台和节奏上，系统才会把它升级成可复用打法，而不是单条灵感。
                </div>
              )}
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="闭环差距">
                {(snapshot?.missingLinks || []).length ? snapshot!.missingLinks.map(item => (
                  <div className="border-b border-white/10 py-2 text-xs text-amber-100 last:border-b-0" key={item}>差距：{gapLabel(item)}</div>
                )) : <div className="text-sm text-emerald-200">创意监控闭环已具备账号、榜单、视频拆解和采集证据。</div>}
              </Panel>
            </div>

            <Panel title="最近采集运行">
              {(data?.harvestRuns || []).length ? data!.harvestRuns.slice(0, 4).map(run => (
                <div className="border-b border-white/10 py-2 text-xs text-white/65 last:border-b-0" key={run.id}>
                  <div className="font-semibold text-white/85">{formatTime(run.ranAt)}</div>
                  <div className="mt-1">到期 {run.dueTaskCount} 项 / 写入 {run.importedInsightIds.length} 条 / 缺观察 {run.missingObservationMonitorIds.length} 项</div>
                  <div className="mt-1 text-emerald-200">品牌学习资产 {run.brandLearningAssetIds.length} 个 / 分发计划 {run.brandLearningDistributionPlanId || '未生成'}</div>
                </div>
              )) : <div className="text-sm text-white/50">尚无采集运行记录。</div>}
            </Panel>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={`border border-white/10 bg-white/[0.035] ${compact ? 'p-3' : 'p-4'}`}>
      <div className="text-xs text-white/45">{label}</div>
      <div className={`${compact ? 'mt-1 text-xl' : 'mt-2 text-3xl'} font-semibold text-white`}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
