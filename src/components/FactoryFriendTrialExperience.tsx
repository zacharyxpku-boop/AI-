import Link from 'next/link';
import type { ReactNode } from 'react';

import { FactoryCommandCenter } from './FactoryCommandCenter';
import { FactoryCurrentTaskPanel } from './FactoryCurrentTaskPanel';
import { FactoryHeroCommandPanel } from './FactoryHeroCommandPanel';
import { FactoryRecentProjectsPanel } from './FactoryRecentProjectsPanel';
import { FactoryToolLauncherPanel } from './FactoryToolLauncherPanel';
import { FactoryWorkbenchAssistant } from './FactoryWorkbenchAssistant';
import { FactoryWorkbenchInteractionPanel } from './FactoryWorkbenchInteractionPanel';

type Tone = 'slate' | 'emerald' | 'amber' | 'sky';

export type FactoryFriendMetric = {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
};

export type FactoryFriendReadiness = {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
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
  readiness?: FactoryFriendReadiness[];
  funnel?: Array<{ label: string; value: number }>;
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

const SERVICE_NAV = [
  { label: '素材云盘', href: '/factory/create?variant=friend_trial', icon: '◫' },
  { label: '手机协同', href: '/factory/create?variant=friend_trial', icon: '▣' },
  { label: '直播切片', href: '/factory/video?variant=friend_trial', icon: '◉' },
  { label: '创意洞察', href: '/factory/manage?variant=friend_trial', icon: '◇' },
  { label: '视频翻译', href: '/factory/video?variant=friend_trial', icon: '◎' },
  { label: '评论管理', href: '/factory/manage?variant=friend_trial', icon: '◌' },
];

const STEP_COPY: Record<FactoryFriendTrialExperienceProps['active'], {
  question: string;
  job: string;
  output: string;
  proof: string;
  owner: string;
  next: string;
  progress: string;
}> = {
  overview: {
    question: '今天先做哪一个商品?',
    job: '把商品、目标人群、渠道和负责人先确定下来, 再进入卖点、素材、内容、发布和客户跟进。',
    output: '商品任务卡、主推渠道、下一步操作入口。',
    proof: '演示空间只展示流程样例, 不伪造真实店铺、广告账户或发布结果。',
    owner: '客户填写, 运营确认',
    next: '进入卖点选择',
    progress: '1/6',
  },
  creative: {
    question: '这件商品凭什么被记住?',
    job: '从场景、痛点、竞品和评论里收敛一个可拍、可讲、可审核的主卖点。',
    output: '主卖点、禁用表达、脚本方向、内容角度。',
    proof: '只沉淀内容假设, 不承诺爆款和真实转化。',
    owner: '运营处理, 客户确认',
    next: '补齐素材资料',
    progress: '2/6',
  },
  create: {
    question: '素材够不够直接生产?',
    job: '整理商品图、视频片段、授权、口播资料和品牌禁区, 避免生成内容时缺关键信息。',
    output: '素材云盘、授权边界、生产约束。',
    proof: '没有授权的素材不会标记为可发布。',
    owner: '客户补资料, 运营验收',
    next: '生成内容版本',
    progress: '3/6',
  },
  video: {
    question: '同一套素材能产出哪些版本?',
    job: '把卖点拆成标题、口播、图文脚本和短视频版本, 先给客户审核再进入分发。',
    output: '内容草稿、平台版本、审核待办。',
    proof: '当前展示内容生产流程, 不冒充真实发布或真实效果。',
    owner: '运营生成, 客户审核',
    next: '安排发布渠道',
    progress: '4/6',
  },
  cast: {
    question: '发到哪里, 证据留在哪里?',
    job: '安排小红书、抖音、视频号等渠道, 记录发布时间、发布链接、截图和负责人。',
    output: '发布计划、证据清单、风险门禁。',
    proof: '未接真实平台授权前, 只做计划和手动证据管理。',
    owner: '运营排期, 客户可看',
    next: '查看销售跟进',
    progress: '5/6',
  },
  manage: {
    question: '销售下一步怎么跟?',
    job: '把客户反馈、发布证明、表现表和负责人整理成可执行清单, 交给销售继续推进。',
    output: '线索回收表、跟进行动、客户确认记录。',
    proof: '不展示虚构增长数字, 只保留真实反馈和可分配任务。',
    owner: '销售接手, 运营留档',
    next: '回到开始工作',
    progress: '6/6',
  },
};

const WORKBENCH_TOOLS = [
  { title: '编写脚本', desc: '开场、卖点、口播、CTA', href: '/factory/creative?variant=friend_trial', badge: '01', accent: 'from-indigo-400 to-blue-500' },
  { title: 'AI 影棚', desc: '商品图、场景图、卖点图', href: '/factory/create?variant=friend_trial', badge: 'New', accent: 'from-cyan-400 to-sky-500' },
  { title: 'AI 复刻', desc: '参考结构, 生成自有版本', href: '/factory/video?variant=friend_trial', badge: '02', accent: 'from-fuchsia-400 to-purple-500' },
  { title: '批量合成', desc: '替换商品、画面和标题', href: '/factory/video?variant=friend_trial', badge: '03', accent: 'from-amber-400 to-orange-500' },
  { title: '多语言配音', desc: '面向跨境渠道的脚本', href: '/factory/video?variant=friend_trial', badge: '04', accent: 'from-teal-400 to-emerald-500' },
  { title: '投放分发', desc: '排期、证据、负责人', href: '/factory/cast?variant=friend_trial', badge: '05', accent: 'from-slate-700 to-slate-950' },
  { title: '创意洞察', desc: '只记录真实反馈', href: '/factory/manage?variant=friend_trial', badge: '06', accent: 'from-rose-400 to-pink-500' },
];

const RECENT_PROJECTS = [
  { title: '收纳盒春季种草', type: '混剪', status: '待客户确认', tone: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { title: '厨房小工具卖点包', type: '脚本', status: '可继续编辑', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { title: '宠物清洁用品素材', type: '素材', status: '缺授权', tone: 'bg-rose-50 text-rose-700 ring-rose-200' },
  { title: '便携风扇夏季上新', type: '图文', status: '待发布证据', tone: 'bg-sky-50 text-sky-700 ring-sky-200' },
  { title: '户外露营灯内容包', type: '视频', status: '客户审核中', tone: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  { title: '美容仪测评脚本', type: '口播', status: '待改稿', tone: 'bg-slate-100 text-slate-600 ring-slate-200' },
];

const RECENT_FILTERS = ['全部', '素材', '工程', '成片', '视频', '图片', '音频'];

const TASK_READINESS = [
  '锁定 1 个商品和 1 个主渠道, 客户能看懂今天到底推进什么。',
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
  readiness = [],
  funnel = [],
  actions,
  nextHref,
  nextLabel = '继续下一步',
  children,
}: FactoryFriendTrialExperienceProps) {
  const activeIndex = Math.max(0, NAV.findIndex(item => item.id === active));
  const activeStep = STEP_COPY[active];
  const primaryActionHref = nextHref ?? NAV[Math.min(activeIndex + 1, NAV.length - 1)].href;
  const proofCards = readiness.length
    ? readiness
    : funnel.map(item => ({
        label: item.label,
        value: `${item.value}%`,
        detail: '只展示当前准备度，不代表真实发布结果或转化率。',
        tone: 'slate' as const,
      }));

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f7f9ff] text-slate-950 antialiased">
      <div className="flex h-full min-h-0">
        <aside className="hidden h-full w-[236px] shrink-0 flex-col border-r border-slate-200 bg-[#edf3ff] xl:flex">
          <div className="px-5 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-pink-500 to-cyan-400 text-sm font-black text-white shadow-sm">W</div>
              <div className="min-w-0">
                <div className="truncate text-xl font-black tracking-tight">Wenai</div>
                <div className="truncate text-xs font-medium text-slate-500">AI 电商内容工作台</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            <Link href="/factory?variant=friend_trial" className={`mb-5 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-black shadow-sm ${active === 'overview' ? 'bg-white text-slate-950' : 'text-slate-700 hover:bg-white/70'}`}>
              <span className="flex size-8 items-center justify-center rounded-md bg-slate-950 text-white">⌂</span>
              开始工作
            </Link>

            <div className="mb-2 px-3 text-xs font-bold text-slate-400">工作流</div>
            <div className="space-y-1">
              {NAV.slice(1, 5).map(item => (
                <Link
                  aria-current={item.id === active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${item.id === active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'}`}
                  href={item.href}
                  key={item.id}
                >
                  <span className={`flex size-7 items-center justify-center rounded-md text-xs ${item.id === active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>{item.icon}</span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mb-2 mt-6 px-3 text-xs font-bold text-slate-400">服务</div>
            <div className="space-y-1">
              {SERVICE_NAV.map(item => (
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-950" href={item.href} key={item.label}>
                  <span className="flex size-7 items-center justify-center rounded-md bg-white text-xs text-slate-500">{item.icon}</span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3 p-4">
            <Link href="/settings/kuaizi" className="block rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
              生产 Agent
            </Link>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <div className="text-xs font-bold text-slate-400">消息通知</div>
              <div className="mt-1 text-sm font-black text-slate-800">0</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="flex size-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-700">WA</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black text-slate-950">Wenai Admin</div>
                <div className="truncate text-xs text-slate-500">试用工作区</div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
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
              <FactoryCommandCenter nextHref={primaryActionHref} nextLabel={nextLabel} />
            </div>
          </header>

          <nav className="shrink-0 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 xl:hidden" aria-label="商品增长步骤">
            <div className="flex min-w-max gap-2">
              {NAV.map((item, index) => (
                <Link
                  aria-current={item.id === active ? 'page' : undefined}
                  className={`flex min-w-[136px] items-center gap-2 rounded-lg border px-3 py-2 text-sm ${item.id === active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
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

          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
            <div className="mx-auto max-w-[1500px] space-y-5 pb-10">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative min-h-[470px] bg-[radial-gradient(circle_at_18%_0%,#ddf5ff_0,transparent_28%),radial-gradient(circle_at_68%_0%,#eee6ff_0,transparent_32%),linear-gradient(180deg,#fbfdff_0%,#fff_68%)] px-5 py-10 md:px-8">
                  <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-[34px]">Hi, what will we create today?</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">{subtitle || title}</p>
                    <FactoryHeroCommandPanel primaryActionHref={primaryActionHref} />
                  </div>

                  <FactoryToolLauncherPanel primaryActionHref={primaryActionHref} tools={WORKBENCH_TOOLS} />
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <FactoryRecentProjectsPanel
                  filters={RECENT_FILTERS}
                  nextLabel={activeStep.next}
                  primaryActionHref={primaryActionHref}
                  projects={RECENT_PROJECTS}
                />

                <FactoryCurrentTaskPanel
                  job={activeStep.job}
                  nextHref={primaryActionHref}
                  nextLabel={activeStep.next}
                  output={activeStep.output}
                  owner={activeStep.owner}
                  progress={activeStep.progress}
                  proof={activeStep.proof}
                  question={activeStep.question}
                />
              </section>

              <FactoryWorkbenchInteractionPanel />

              <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">商品任务</div>
                      <div className="mt-1 text-sm font-black text-indigo-600">创建一个商品增长任务</div>
                      <h3 className="mt-1 text-2xl font-black text-slate-950">{title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{activeStep.job}</p>
                    </div>
                    <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700" href={primaryActionHref}>
                      {nextLabel}
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[
                      ['商品', '伸缩抽屉收纳盒'],
                      ['目标', '拿到客户咨询线索'],
                      ['渠道', '小红书 / 抖音'],
                    ].map(([label, value]) => (
                      <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3" key={label}>
                        <span className="text-xs font-bold text-slate-400">{label}</span>
                        <input className="mt-1 w-full bg-transparent text-base font-black text-slate-950 outline-none" defaultValue={value} />
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
                    <div className="text-xs font-black text-amber-700">推进前先确认</div>
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

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">工作流状态</div>
                      <h3 className="mt-1 text-2xl font-black text-slate-950">点进去是真实下一站</h3>
                    </div>
                    <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50" href={primaryActionHref}>
                      {activeStep.next}
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-2">
                    {NAV.map((item, index) => {
                      const done = index < activeIndex;
                      const current = item.id === active;
                      return (
                        <Link className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-2.5 transition ${current ? 'border-indigo-200 bg-indigo-50' : done ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`} href={item.href} key={item.id}>
                          <span className={`flex size-8 items-center justify-center rounded-md text-xs font-black ${current ? 'bg-indigo-600 text-white' : done ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>{index + 1}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black text-slate-950">{item.label}</span>
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
                  <Link className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md" href={item.href} key={`${item.role}-${item.title}`}>
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

              {proofCards.length ? (
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">流程准备度</div>
                      <h3 className="mt-1 text-xl font-black text-slate-950">只展示准备度, 不伪造效果数字</h3>
                    </div>
                    <span className="text-sm text-slate-500">客户可用它判断下一步卡在哪里</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    {proofCards.map(item => (
                      <div className={`rounded-lg border p-4 ${metricTone[item.tone ?? 'slate']}`} key={item.label}>
                        <div className="text-xs font-bold opacity-70">{item.label}</div>
                        <div className="mt-1 text-lg font-black">{item.value}</div>
                        <p className="mt-2 text-xs leading-5 opacity-75">{item.detail}</p>
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
      <FactoryWorkbenchAssistant primaryActionHref={primaryActionHref} />
    </main>
  );
}
