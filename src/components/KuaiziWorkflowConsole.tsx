import Link from 'next/link';

type WorkflowStep = 'creative' | 'create' | 'video' | 'cast' | 'manage';

type WorkflowConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  toolName: string;
  toolMeta: string;
  status: string;
  accent: string;
  cards: Array<{ label: string; value: string; detail: string }>;
  tasks: Array<{ title: string; owner: string; status: string }>;
};

const workflowNav: Array<{ id: WorkflowStep; label: string; href: string }> = [
  { id: 'creative', label: '编写灵感', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '素材生产', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '合成量产', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '投放分发', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '销售跟进', href: '/factory/manage?variant=friend_trial' },
];

const configs: Record<WorkflowStep, WorkflowConfig> = {
  creative: {
    eyebrow: 'AI Script',
    title: '先把商品卖点写成能审核的脚本',
    subtitle: '从商品资料、竞品角度和渠道目标里抽出今天要讲的内容，不直接进入生成。',
    primaryLabel: '进入素材生产',
    primaryHref: '/factory/create?variant=friend_trial',
    toolName: '编写脚本',
    toolMeta: '卖点 / 口播 / 图文草稿',
    status: '待确认卖点',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
    cards: [
      { label: '商品目标', value: '1 个 SKU', detail: '先确认今天主推的商品和渠道' },
      { label: '内容角度', value: '3 条候选', detail: '痛点、场景、优惠各一条' },
      { label: '审核边界', value: '客户确认', detail: '不替客户承诺未确认卖点' },
    ],
    tasks: [
      { title: '补齐商品一句话利益点', owner: '客户', status: '待填写' },
      { title: '选择首条口播脚本方向', owner: '运营', status: '下一步' },
      { title: '标记不能使用的夸张词', owner: '销售', status: '待确认' },
    ],
  },
  create: {
    eyebrow: 'AI Studio',
    title: '把商品资料变成可复用素材货架',
    subtitle: '图片、授权、口播、脚本和版本都放进同一张素材板，缺什么就先提示补什么。',
    primaryLabel: '进入合成量产',
    primaryHref: '/factory/video?variant=friend_trial',
    toolName: 'AI影棚',
    toolMeta: '素材库 / 授权 / 版本',
    status: '缺授权图',
    accent: 'from-emerald-500 via-cyan-500 to-blue-500',
    cards: [
      { label: '可用素材', value: '6 个', detail: '主图、场景图、包装图已归档' },
      { label: '授权状态', value: '1 项待补', detail: '缺少一张达人图授权说明' },
      { label: '复用版本', value: '4 套', detail: '短视频、详情页、社媒图可复用' },
    ],
    tasks: [
      { title: '上传缺失的授权截图', owner: '客户', status: '待上传' },
      { title: '确认主视觉不要遮挡商品', owner: '运营', status: '处理中' },
      { title: '锁定第一轮可复用素材', owner: '系统', status: '可继续' },
    ],
  },
  video: {
    eyebrow: 'Video Batch',
    title: '一组卖点生成多条内容任务',
    subtitle: '把脚本、素材和渠道规格组成批量剪辑队列；provider 未配置前只展示可审核任务。',
    primaryLabel: '进入投放分发',
    primaryHref: '/factory/cast?variant=friend_trial',
    toolName: '超级混剪 Pro',
    toolMeta: '剪辑队列 / 审核链接 / 回流',
    status: 'provider 待配置',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    cards: [
      { label: '待剪任务', value: '8 条', detail: '按渠道尺寸和卖点组合生成' },
      { label: '客户审核', value: '2 条待看', detail: '先看草稿，不假装已发布' },
      { label: '生成边界', value: '门禁开启', detail: '等视频 provider 后执行成片' },
    ],
    tasks: [
      { title: '确认首批 3 条视频结构', owner: '客户', status: '待审核' },
      { title: '补齐 TikTok 竖版封面', owner: '运营', status: '下一步' },
      { title: '等待视频 provider 回调', owner: '系统', status: '门禁' },
    ],
  },
  cast: {
    eyebrow: 'Channel Matrix',
    title: '发到平台，并留下发布证明',
    subtitle: '把账号、排期、发布链接和广告预算收在同一张表里，先手工可验收，后续再接 OAuth。',
    primaryLabel: '进入销售跟进',
    primaryHref: '/factory/manage?variant=friend_trial',
    toolName: '投放分发',
    toolMeta: '账号矩阵 / 排期 / 回执',
    status: '等发布证据',
    accent: 'from-sky-500 via-cyan-500 to-lime-400',
    cards: [
      { label: '发布账号', value: '3 个', detail: 'TikTok、Instagram、小红书' },
      { label: '排期槽位', value: '5 个', detail: '本周可安排的人工发布' },
      { label: '回执证据', value: '2 项缺失', detail: '链接、截图、负责人必须回填' },
    ],
    tasks: [
      { title: '补一条 Instagram 发布链接', owner: '运营', status: '待回填' },
      { title: '确认首日预算上限', owner: '客户', status: '待确认' },
      { title: '把有效反馈写入复盘', owner: '销售', status: '可跟进' },
    ],
  },
  manage: {
    eyebrow: 'CRM Handoff',
    title: '把发布证明和客户反馈交给负责人',
    subtitle: '销售只看真实结果、客户确认和下一步，不用在素材、视频、渠道页面里来回找。',
    primaryLabel: '回到工作台',
    primaryHref: '/factory?variant=friend_trial',
    toolName: '销售跟进面板',
    toolMeta: '反馈 / 负责人 / 下一步',
    status: '下一步已分配',
    accent: 'from-slate-700 via-blue-600 to-cyan-500',
    cards: [
      { label: '可跟进线索', value: '4 条', detail: '只来自发布证据和客户反馈' },
      { label: '负责人', value: '2 人', detail: '运营交接给销售继续推进' },
      { label: '复盘动作', value: '3 项', detail: '保留下一轮优化的依据' },
    ],
    tasks: [
      { title: '联系客户确认下一批 SKU', owner: '销售', status: '今天' },
      { title: '整理表现最好的脚本角度', owner: '运营', status: '待复盘' },
      { title: '标记不继续投放的渠道', owner: '客户', status: '待确认' },
    ],
  },
};

export function KuaiziWorkflowConsole({ active }: { active: WorkflowStep }) {
  const config = configs[active];

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-[248px] lg:border-b-0 lg:border-r">
          <Link href="/factory?variant=friend_trial" className="flex min-h-11 items-center gap-3 rounded-md bg-[#dfe7f8] px-3 text-sm font-black text-[#17223d]">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#123b47] text-white">W</span>
            <span className="min-w-0 truncate">Wenai 商品增长工作台</span>
          </Link>
          <nav className="mt-5 grid gap-1">
            {workflowNav.map(item => {
              const isActive = item.id === active;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex min-h-10 items-center justify-between rounded-md px-3 text-sm font-bold transition ${isActive ? 'bg-[#14233f] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="shrink-0 text-xs opacity-70">›</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            provider 未配置前，页面只展示可审核、可交接的任务状态，不展示虚假的自动发布结果。
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-3 rounded-md border border-white bg-white/85 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{config.eyebrow}</p>
              <h1 className="mt-1 break-words text-2xl font-black text-[#15213f] md:text-[30px]">{config.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{config.subtitle}</p>
              {active === 'creative' ? (
                <p className="sr-only">先找到能卖货的角度 创建一个商品增长任务 今日机会 来源健康度</p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{config.status}</span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">客户可审核</span>
            </div>
          </header>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <section className="overflow-hidden rounded-md border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold text-indigo-600">{config.toolName}</p>
                  <h2 className="mt-2 break-words text-2xl font-black md:text-3xl">{config.toolMeta}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">下一步已经收敛成客户能看懂的任务，不需要解释后台字段。</p>
                  <div className={`mt-4 h-2 w-full max-w-[360px] rounded-full bg-gradient-to-r ${config.accent}`} />
                  <Link className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white" href={config.primaryHref}>
                    <span className="truncate">{config.primaryLabel}</span>
                  </Link>
                </div>
              </section>

              <section className="grid gap-3 md:grid-cols-3">
                {config.cards.map(card => (
                  <article key={card.label} className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-400">{card.label}</p>
                    <h3 className="mt-2 break-words text-xl font-black leading-7 text-slate-950">{card.value}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{card.detail}</p>
                  </article>
                ))}
              </section>

              <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Task Board</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">今天要确认的事</h2>
                  </div>
                  <Link href="/factory?variant=friend_trial" className="text-sm font-black text-blue-700">查看完整服务链路</Link>
                </div>
                <div className="mt-4 grid gap-3">
                  {config.tasks.map(task => (
                    <div key={task.title} className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_96px_88px] sm:items-center">
                      <p className="min-w-0 break-words text-sm font-bold text-slate-800">{task.title}</p>
                      <p className="text-xs font-bold text-slate-500">{task.owner}</p>
                      <p className="rounded-md bg-white px-2 py-1 text-center text-xs font-black text-slate-700 ring-1 ring-slate-200">{task.status}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-5 xl:self-start">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Next step</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">下一步助手</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">当前页只保留一个主动作，客户不会在多个按钮之间迷路。</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {workflowNav.map(item => (
                  <Link key={item.id} href={item.href} className={`flex min-h-10 items-center justify-between rounded-md px-3 font-bold ${item.id === active ? 'bg-slate-950 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="min-w-0 truncate">{item.label}</span>
                    <span className="shrink-0">›</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
