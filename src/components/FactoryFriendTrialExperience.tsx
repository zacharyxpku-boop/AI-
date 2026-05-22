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
  { id: 'overview', label: '总览', hint: '创建商品任务', href: '/factory?variant=friend_trial' },
  { id: 'creative', label: '卖点', hint: '选可拍角度', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '素材', hint: '补资料和授权', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '内容', hint: '生成可审稿', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '发布', hint: '排渠道和证据', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '跟进', hint: '交销售处理', href: '/factory/manage?variant=friend_trial' },
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
    customerQuestion: '先把一个商品讲清楚',
    mainJob: '确认商品、目标客户和主推渠道，让系统知道今天要服务哪一个增长任务。',
    output: '商品任务卡、目标渠道、下一步卖点选择入口。',
    proof: '这里是样例空间，未连接真实店铺、广告账户或发布 API。',
    owner: '客户填写，运营确认',
    next: '进入卖点选择',
    progress: '1/6',
  },
  creative: {
    customerQuestion: '这件商品今天凭什么值得拍',
    mainJob: '从评论、竞品和使用场景里挑出一个最容易被理解的卖点。',
    output: '主卖点、禁用表达、可拍角度和内容方向。',
    proof: '不承诺爆款，只沉淀可审核的内容假设。',
    owner: '运营处理，客户确认',
    next: '去补商品素材',
    progress: '2/6',
  },
  create: {
    customerQuestion: '素材够不够直接做内容',
    mainJob: '整理商品图、授权、口播信息和客户资料，避免生成内容时缺关键信息。',
    output: '素材货架、授权边界、生产约束。',
    proof: '没有授权的素材不会标记为可发布。',
    owner: '客户补资料，运营验收',
    next: '去生成内容版本',
    progress: '3/6',
  },
  video: {
    customerQuestion: '同一套素材能产出哪些版本',
    mainJob: '把卖点拆成标题、口播、图文脚本和短视频版本，先给客户审核。',
    output: '内容草稿、平台版本、审核待办。',
    proof: '当前只展示内容草稿，不冒充真实发布或真实效果。',
    owner: '运营生成，客户审核',
    next: '去安排发布渠道',
    progress: '4/6',
  },
  cast: {
    customerQuestion: '发到哪里，证据留在哪里',
    mainJob: '安排小红书、抖音、视频号等渠道，记录发布链接、截图和负责人。',
    output: '发布计划、证据清单、风险门禁。',
    proof: '未接真实平台授权前，只能做计划和手动证据管理。',
    owner: '运营排期，客户可看',
    next: '去看销售跟进',
    progress: '5/6',
  },
  manage: {
    customerQuestion: '销售下一步怎么跟',
    mainJob: '把客户反馈、发布证明、表现表和负责人整理成可执行清单。',
    output: '线索回收表、跟进动作、客户确认记录。',
    proof: '不展示虚构增长数字，只保留真实反馈和可分配任务。',
    owner: '销售接手，运营留档',
    next: '回到总览',
    progress: '6/6',
  },
};

const PRODUCT_FIELDS = [
  { label: '商品', value: '伸缩抽屉收纳盒' },
  { label: '目标', value: '获取咨询线索' },
  { label: '渠道', value: '小红书' },
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
  badge = '样例工作区',
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
    <main className="h-dvh w-full overflow-hidden bg-stone-50 text-stone-950 antialiased">
      <div className="flex h-full min-h-0">
        <aside className="hidden h-full w-[232px] shrink-0 flex-col border-r border-stone-200 bg-white xl:flex">
          <div className="border-b border-stone-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-stone-950 text-sm font-bold text-white">W</div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold">Wenai</div>
                <div className="truncate text-xs text-stone-500">商品增长工作台</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item, index) => (
              <Link
                aria-current={item.id === active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  item.id === active ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
                href={item.href}
                key={item.id}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${item.id === active ? 'bg-white text-stone-950' : 'bg-stone-100 text-stone-500'}`}>
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{item.label}</span>
                  <span className={`block truncate text-xs ${item.id === active ? 'text-white/65' : 'text-stone-400'}`}>{item.hint}</span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-stone-200 p-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-medium text-stone-500">当前步骤</div>
              <div className="mt-2 text-sm font-semibold text-stone-950">{activeStep.customerQuestion}</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: progressWidth }} />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-stone-200 bg-white px-4 py-4 md:px-6 xl:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-balance md:text-2xl">Wenai 商品增长工作台</h1>
                  <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 ring-1 ring-inset ring-stone-200">{badge}</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">{activeStep.progress}</span>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-pretty text-stone-500">客户打开后只做一件事：按步骤把商品、卖点、素材、内容、发布证据和销售跟进串起来。</p>
                <p className="sr-only">一眼看懂：这套内容怎么帮商品拿到线索</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 overflow-x-auto">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">样例数据，不代表真实效果</span>
                <Link className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-800" href={primaryActionHref}>
                  {nextLabel}
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 xl:px-8">
            <div className="mx-auto max-w-[1440px] space-y-5 pb-10">
              <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        {eyebrow}
                      </div>
                      <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-balance text-stone-950 lg:text-4xl">{title}</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-pretty text-stone-600">{subtitle}</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-medium text-stone-500">当前要完成</div>
                          <div className="mt-1 text-lg font-semibold text-stone-950">{activeStep.customerQuestion}</div>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">{activeStep.progress}</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: progressWidth }} />
                      </div>
                      <Link className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-800" href={primaryActionHref}>
                        进入下一步
                      </Link>
                    </div>
                  </div>
                </div>

                <aside className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-stone-500">交付结果</div>
                      <h3 className="mt-1 text-xl font-semibold text-stone-950">客户能拿到什么</h3>
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">可审核</span>
                  </div>
                  <div className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200">
                    <div className="p-3">
                      <div className="text-xs font-medium text-stone-500">本步输出</div>
                      <p className="mt-1 text-sm font-semibold leading-5 text-pretty text-stone-950">{activeStep.output}</p>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-medium text-stone-500">负责人</div>
                      <p className="mt-1 text-sm font-semibold leading-5 text-stone-950">{activeStep.owner}</p>
                    </div>
                    <div className="bg-amber-50 p-3">
                      <div className="text-xs font-medium text-amber-700">边界</div>
                      <p className="mt-1 text-sm leading-5 text-pretty text-amber-900">{activeStep.proof}</p>
                    </div>
                  </div>
                </aside>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-medium text-stone-500">商品任务</div>
                      <h3 className="mt-1 text-2xl font-semibold text-stone-950">创建一个商品增长任务</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-pretty text-stone-500">{activeStep.mainJob}</p>
                    </div>
                    <button className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700" type="button">
                      生成内容计划
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {PRODUCT_FIELDS.map(item => (
                      <label className="block rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" key={item.label}>
                        <span className="text-xs font-medium text-stone-500">{item.label}</span>
                        <input className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" defaultValue={item.value} />
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {metrics.map(item => (
                      <div className={`rounded-2xl border p-4 ${metricTone[item.tone ?? 'slate']}`} key={item.label}>
                        <div className="text-xs font-medium opacity-70">{item.label}</div>
                        <div className="mt-1 text-lg font-semibold">{item.value}</div>
                        {item.detail ? <p className="mt-2 text-xs leading-5 opacity-75">{item.detail}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-medium text-stone-500">流程路径</div>
                      <h3 className="mt-1 text-2xl font-semibold text-stone-950">点击后是真的进入下一站</h3>
                    </div>
                    <Link className="min-h-11 rounded-xl border border-stone-200 px-5 py-2.5 text-center text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50" href={primaryActionHref}>
                      {activeStep.next}
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-2">
                    {NAV.map((item, index) => {
                      const done = index < activeIndex;
                      const current = item.id === active;
                      return (
                        <Link className={`grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                          current ? 'border-emerald-300 bg-emerald-50' : done ? 'border-stone-200 bg-stone-50' : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`} href={item.href} key={item.id}>
                          <span className={`flex size-9 items-center justify-center rounded-xl text-sm font-semibold ${current ? 'bg-emerald-600 text-white' : done ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-500'}`}>
                            {index + 1}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-stone-950">{item.label}</span>
                            <span className="block truncate text-xs text-stone-500">{item.hint}</span>
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${current ? 'bg-white text-emerald-700' : done ? 'bg-white text-stone-600' : 'bg-stone-100 text-stone-500'}`}>
                            {current ? '当前' : done ? '已过' : '打开'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                {actions.map(item => (
                  <Link className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50" href={item.href} key={`${item.role}-${item.title}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium text-stone-500">{item.role}</div>
                        <h3 className="mt-2 text-lg font-semibold text-stone-950">{item.title}</h3>
                      </div>
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">打开</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-pretty text-stone-600">{item.value}</p>
                  </Link>
                ))}
              </section>

              {funnel.length ? (
                <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-xs font-medium text-stone-500">内部准备度</div>
                      <h3 className="mt-1 text-xl font-semibold text-stone-950">只显示流程准备，不伪造效果数字</h3>
                    </div>
                    <span className="text-sm text-stone-500">客户可用来判断下一步卡在哪里</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    {funnel.map(item => (
                      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4" key={item.label}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-semibold text-stone-950">{item.label}</span>
                          <span className="text-sm font-semibold tabular-nums text-stone-500">{item.value}%</span>
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
