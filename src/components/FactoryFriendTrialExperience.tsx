import Link from 'next/link';
import type { ReactNode } from 'react';

type Tone = 'slate' | 'emerald' | 'amber' | 'sky';

export type FactoryFriendMetric = {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
};

export type FactoryFriendStage = {
  label: string;
  value: number;
};

export type FactoryFriendAction = {
  role: string;
  title: string;
  value: string;
  href: string;
};

export type FactoryFriendTrialExperienceProps = {
  active: 'overview' | 'creative' | 'create' | 'video' | 'cast' | 'manage';
  title: string;
  subtitle: string;
  eyebrow?: string;
  badge?: string;
  metrics: FactoryFriendMetric[];
  funnel: FactoryFriendStage[];
  actions: FactoryFriendAction[];
  nextHref?: string;
  nextLabel?: string;
  children?: ReactNode;
};

const NAV = [
  { id: 'overview', label: '开始工作', hint: '选择今天任务', href: '/factory?variant=friend_trial', icon: '⌂' },
  { id: 'creative', label: '编写灵感', hint: '卖点和脚本', href: '/factory/creative?variant=friend_trial', icon: '✎' },
  { id: 'create', label: '素材生产', hint: '商品图和授权', href: '/factory/create?variant=friend_trial', icon: '✦' },
  { id: 'video', label: '合成量产', hint: '短视频和图文', href: '/factory/video?variant=friend_trial', icon: '▶' },
  { id: 'cast', label: '投放分发', hint: '渠道和证据', href: '/factory/cast?variant=friend_trial', icon: '↗' },
  { id: 'manage', label: '客户移交', hint: '跟进和交付', href: '/factory/manage?variant=friend_trial', icon: '✓' },
] as const;

const STEP_COPY: Record<FactoryFriendTrialExperienceProps['active'], {
  customerQuestion: string;
  mainJob: string;
  output: string;
  proof: string;
  owner: string;
  next: string;
  progress: string;
}> = {
  overview: {
    customerQuestion: '今天先做哪一个商品?',
    mainJob: '把商品、目标人群、渠道和负责人先确定下来，再进入卖点、素材、内容、发布和客户跟进。',
    output: '商品任务卡、主推渠道、下一步操作入口。',
    proof: '演示空间只展示流程样例，不伪造真实店铺、广告账户或发布结果。',
    owner: '客户填写, 运营确认',
    next: '进入卖点选择',
    progress: '1/6',
  },
  creative: {
    customerQuestion: '这件商品凭什么被记住?',
    mainJob: '从场景、痛点、竞品和评论里收敛一个可拍、可讲、可审核的主卖点。',
    output: '主卖点、禁用表达、脚本方向、内容角度。',
    proof: '只沉淀内容假设, 不承诺爆款和真实转化。',
    owner: '运营处理, 客户确认',
    next: '补齐素材资料',
    progress: '2/6',
  },
  create: {
    customerQuestion: '素材够不够直接生产?',
    mainJob: '整理商品图、视频片段、授权、口播资料和品牌禁区, 避免生成内容时缺关键信息。',
    output: '素材云盘、授权边界、生产约束。',
    proof: '没有授权的素材不会标记为可发布。',
    owner: '客户补资料, 运营验收',
    next: '生成内容版本',
    progress: '3/6',
  },
  video: {
    customerQuestion: '同一套素材能产出哪些版本?',
    mainJob: '把卖点拆成标题、口播、图文脚本和短视频版本, 先给客户审核再进入分发。',
    output: '内容草稿、平台版本、审核待办。',
    proof: '当前展示内容生产流程, 不冒充真实发布或真实效果。',
    owner: '运营生成, 客户审核',
    next: '安排发布渠道',
    progress: '4/6',
  },
  cast: {
    customerQuestion: '发到哪里, 证据留在哪里?',
    mainJob: '安排小红书、抖音、视频号等渠道, 记录发布时间、发布链接、截图和负责人。',
    output: '发布计划、证据清单、风险门禁。',
    proof: '未接真实平台授权前, 只做计划和手动证据管理。',
    owner: '运营排期, 客户可看',
    next: '查看销售跟进',
    progress: '5/6',
  },
  manage: {
    customerQuestion: '销售下一步怎么跟?',
    mainJob: '把客户反馈、发布证明、表现表和负责人整理成可执行清单, 交给销售继续推进。',
    output: '线索回收表、跟进行动、客户确认记录。',
    proof: '不展示虚构增长数字, 只保留真实反馈和可分配任务。',
    owner: '销售接手, 运营留档',
    next: '回到开始工作',
    progress: '6/6',
  },
};

const PRODUCT_FIELDS = [
  { label: '商品', value: '伸缩抽屉收纳盒' },
  { label: '目标', value: '拿到客户咨询线索' },
  { label: '渠道', value: '小红书 / 抖音' },
];

const WORKBENCH_TOOLS = [
  { title: 'AI 脚本', desc: '按商品卖点生成标题、口播和图文脚本。', href: '/factory/creative?variant=friend_trial', accent: 'bg-indigo-500' },
  { title: '素材云盘', desc: '整理商品图、视频片段、授权和品牌禁区。', href: '/factory/create?variant=friend_trial', accent: 'bg-sky-500' },
  { title: 'AI 影棚', desc: '把素材转成多平台内容草稿, 先审再发。', href: '/factory/video?variant=friend_trial', accent: 'bg-fuchsia-500' },
  { title: '批量合成', desc: '同一个卖点生成多版本, 适合小批量测试。', href: '/factory/video?variant=friend_trial', accent: 'bg-orange-500' },
  { title: '投放分发', desc: '安排渠道排期, 留下发布证据和负责人。', href: '/factory/cast?variant=friend_trial', accent: 'bg-emerald-500' },
  { title: '创意洞察', desc: '只看真实反馈, 不用虚构 ROI 数字包装。', href: '/factory/manage?variant=friend_trial', accent: 'bg-slate-800' },
];

const RECENT_PROJECTS = [
  { title: '收纳盒春季种草', type: '图文 + 短视频', status: '待客户确认', tone: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { title: '厨房小工具卖点包', type: '脚本草稿', status: '可继续编辑', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { title: '宠物清洁用品素材', type: '素材盘', status: '缺授权', tone: 'bg-rose-50 text-rose-700 ring-rose-200' },
];

const TASK_READINESS = [
  '先锁定 1 个商品和 1 个主渠道, 客户能看懂今天到底在推进什么。',
  '素材、授权或口播资料缺失时, 先补资料再生成内容。',
  '销售只接真实确认、发布证明和客户反馈, 不接虚构效果数字。',
];

const metricTone: Record<Tone, string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
};

export function FactoryFriendTrialExperience({
  active,
  title,
  subtitle,
  eyebrow = '客户可试用工作台',
  badge = '演示空间',
  metrics,
  funnel,
  actions,
  nextHref,
  nextLabel = '继续下一步',
  children,
}: FactoryFriendTrialExperienceProps) {
  const activeIndex = Math.max(0, NAV.findIndex(item => item.id === active));
  const activeStep = STEP_COPY[active];
  const primaryActionHref = nextHref ?? NAV[Math.min(activeIndex + 1, NAV.length - 1)].href;
  const progressWidth = `${Math.min(100, Math.max(12, ((activeIndex + 1) / NAV.length) * 100))}%`;

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f6f8ff] text-slate-950 antialiased">
      <div className="flex h-full min-h-0">
        <aside className="hidden h-full w-[252px] shrink-0 flex-col border-r border-slate-200 bg-[#eef3ff] xl:flex">
          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">W</div>
              <div className="min-w-0">
                <div className="truncate text-lg font-black tracking-tight">Wenai</div>
                <div className="truncate text-xs font-medium text-slate-500">AI 电商内容工作台</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {NAV.map((item, index) => (
              <Link
                aria-current={item.id === active ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  item.id === active ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                }`}
                href={item.href}
                key={item.id}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-black ${item.id === active ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 group-hover:text-slate-950'}`}>
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{item.label}</span>
                  <span className="block truncate text-xs text-slate-400">{item.hint}</span>
                </span>
                <span className="ml-auto text-[10px] font-semibold text-slate-300">{String(index + 1).padStart(2, '0')}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 pb-4">
            <Link href="/settings/kuaizi" className="block rounded-lg bg-slate-950 p-3 text-white shadow-sm">
              <div className="text-xs font-semibold text-white/60">生产连接</div>
              <div className="mt-1 text-sm font-bold">配置外部工具</div>
            </Link>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur md:px-6 xl:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight md:text-2xl">Wenai 商品增长工作台</h1>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200">{badge}</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">{activeStep.progress}</span>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">从商品任务开始, 串起脚本、素材、合成、分发和客户移交。客户打开后按卡片推进, 不需要理解后台术语。</p>
                <p className="sr-only">一眼看懂：这套内容怎么帮商品拿到线索</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 overflow-x-auto">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">样例空间 · 不展示虚假效果</span>
                <Link className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800" href={primaryActionHref}>
                  {nextLabel}
                </Link>
              </div>
            </div>
          </header>

          <nav className="shrink-0 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 xl:hidden" aria-label="商品增长步骤">
            <div className="flex min-w-max gap-2">
              {NAV.map((item, index) => (
                <Link
                  aria-current={item.id === active ? 'page' : undefined}
                  className={`flex min-w-[136px] items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    item.id === active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                  href={item.href}
                  key={item.id}
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-black ${item.id === active ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{item.label}</span>
                    <span className={`block truncate text-xs ${item.id === active ? 'text-white/65' : 'text-slate-400'}`}>{item.hint}</span>
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 xl:px-8">
            <div className="mx-auto max-w-[1480px] space-y-5 pb-10">
              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_356px]">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="relative min-h-[348px] bg-[radial-gradient(circle_at_18%_0%,#dff6ff_0,transparent_30%),radial-gradient(circle_at_72%_0%,#efe6ff_0,transparent_34%),linear-gradient(180deg,#f9fbff_0%,#fff_62%)] px-5 py-8 md:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        {eyebrow}
                      </div>
                      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl">今天要为哪个商品生产增长内容?</h2>
                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{subtitle || title}</p>
                    </div>

                    <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {WORKBENCH_TOOLS.map(tool => (
                        <Link className="group rounded-lg border border-slate-200 bg-white/88 p-4 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md" href={tool.href} key={tool.title}>
                          <div className={`flex size-10 items-center justify-center rounded-lg ${tool.accent} text-lg font-black text-white shadow-sm`}>+</div>
                          <h3 className="mt-4 text-base font-black text-slate-950">{tool.title}</h3>
                          <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{tool.desc}</p>
                          <div className="mt-4 text-xs font-bold text-indigo-600 group-hover:text-indigo-800">打开模块 →</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Current task</div>
                      <h3 className="mt-1 text-xl font-black text-slate-950">{activeStep.customerQuestion}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{activeStep.progress}</span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: progressWidth }} />
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-600">{activeStep.mainJob}</p>

                  <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
                    <div className="p-3">
                      <div className="text-xs font-bold text-slate-400">本步输出</div>
                      <p className="mt-1 text-sm font-bold leading-5 text-slate-900">{activeStep.output}</p>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-slate-400">负责人</div>
                      <p className="mt-1 text-sm font-bold text-slate-900">{activeStep.owner}</p>
                    </div>
                    <div className="bg-amber-50 p-3">
                      <div className="text-xs font-bold text-amber-700">边界说明</div>
                      <p className="mt-1 text-sm leading-5 text-amber-900">{activeStep.proof}</p>
                    </div>
                  </div>

                  <Link className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800" href={primaryActionHref}>
                    {activeStep.next}
                  </Link>
                </aside>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">商品任务</div>
                      <div className="mt-1 text-sm font-bold text-indigo-600">创建一个商品增长任务</div>
                      <h3 className="mt-1 text-2xl font-black text-slate-950">{title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{activeStep.mainJob}</p>
                    </div>
                    <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700" href={primaryActionHref}>
                      {nextLabel}
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {PRODUCT_FIELDS.map(item => (
                      <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3" key={item.label}>
                        <span className="text-xs font-bold text-slate-400">{item.label}</span>
                        <input className="mt-1 w-full bg-transparent text-base font-black text-slate-950 outline-none" defaultValue={item.value} />
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {metrics.map(item => (
                      <div className={`rounded-lg border p-4 ${metricTone[item.tone ?? 'slate']}`} key={item.label}>
                        <div className="text-xs font-bold opacity-70">{item.label}</div>
                        <div className="mt-1 text-lg font-black">{item.value}</div>
                        {item.detail ? <p className="mt-2 text-xs leading-5 opacity-75">{item.detail}</p> : null}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs font-bold text-amber-700">推进前先确认</div>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
                      {TASK_READINESS.map(item => (
                        <li className="flex gap-2" key={item}>
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">最近工程</div>
                      <h3 className="mt-1 text-2xl font-black text-slate-950">客户看得懂的生产记录</h3>
                    </div>
                    <Link className="min-h-11 rounded-lg border border-slate-200 px-5 py-2.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50" href={primaryActionHref}>
                      {activeStep.next}
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {RECENT_PROJECTS.map((project, index) => (
                      <div className="grid grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3" key={project.title}>
                        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-slate-200 via-white to-indigo-100 text-xs font-black text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-slate-950">{project.title}</div>
                          <div className="mt-1 truncate text-xs font-medium text-slate-500">{project.type}</div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${project.tone}`}>{project.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-2">
                    {NAV.map((item, index) => {
                      const done = index < activeIndex;
                      const current = item.id === active;
                      return (
                        <Link className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                          current ? 'border-indigo-200 bg-indigo-50' : done ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`} href={item.href} key={item.id}>
                          <span className={`flex size-8 items-center justify-center rounded-md text-xs font-black ${current ? 'bg-indigo-600 text-white' : done ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {index + 1}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-slate-950">{item.label}</span>
                            <span className="block truncate text-xs text-slate-500">{item.hint}</span>
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${current ? 'bg-white text-indigo-700' : done ? 'bg-white text-slate-600' : 'bg-slate-100 text-slate-500'}`}>
                            {current ? '当前' : done ? '已完成' : '打开'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                {actions.map(item => (
                  <Link className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md" href={item.href} key={`${item.role}-${item.title}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.role}</div>
                        <h3 className="mt-2 text-lg font-black text-slate-950">{item.title}</h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">打开</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.value}</p>
                  </Link>
                ))}
              </section>

              {funnel.length ? (
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">流程准备度</div>
                      <h3 className="mt-1 text-xl font-black text-slate-950">只展示准备度, 不伪造效果数字</h3>
                    </div>
                    <span className="text-sm text-slate-500">客户可用它判断下一步卡在哪里</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    {funnel.map(item => (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={item.label}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-bold text-slate-950">{item.label}</span>
                          <span className="text-sm font-black tabular-nums text-slate-500">{item.value}%</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
