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
  { id: 'overview', label: '工作台', hint: '创建商品任务', href: '/factory?variant=friend_trial' },
  { id: 'creative', label: '卖点', hint: '选择可拍角度', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '素材', hint: '整理商品资料', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '内容', hint: '生成内容版本', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '发布', hint: '安排渠道计划', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '跟进', hint: '交给销售处理', href: '/factory/manage?variant=friend_trial' },
] as const;

const WORKFLOW = [
  { title: '录入商品', body: '先填商品名、类目、目标客户和主推卖点。' },
  { title: '确认卖点', body: '从评论、竞品和场景里选今天要讲的角度。' },
  { title: '生成内容', body: '把卖点变成短视频、图文、标题和口播草稿。' },
  { title: '安排发布', body: '选择渠道和排期，保留链接或截图证明。' },
  { title: '销售跟进', body: '把客户反馈、咨询和下一步动作交给负责人。' },
];

const PRODUCT_FIELDS = [
  { label: '商品', value: '伸缩抽屉收纳盒' },
  { label: '目标', value: '获取咨询线索' },
  { label: '渠道', value: '小红书 / 抖音 / 视频号' },
];

const DELIVERABLES = [
  { title: '商品卖点卡', body: '今天主推什么、为什么值得拍、哪些表达不能碰。' },
  { title: '内容草稿', body: '标题、口播、画面建议和平台版本，先给客户确认。' },
  { title: '发布与跟进表', body: '发布证明、客户反馈、销售负责人和下一步动作。' },
];

const activeStepLabel: Record<FactoryFriendTrialExperienceProps['active'], string> = {
  overview: '先创建一个商品任务',
  creative: '正在选择可拍卖点',
  create: '正在整理商品素材',
  video: '正在生成内容版本',
  cast: '正在安排渠道发布',
  manage: '正在回收客户反馈',
};

export function FactoryFriendTrialExperience({
  active,
  title,
  subtitle,
  eyebrow = '客户可试用工作台',
  badge = '样例工作区',
  metrics,
  actions,
  nextHref,
  nextLabel = '继续下一步',
  children,
}: FactoryFriendTrialExperienceProps) {
  const activeIndex = Math.max(0, NAV.findIndex(item => item.id === active));
  const primaryActionHref = nextHref ?? NAV[Math.min(activeIndex + 1, NAV.length - 1)].href;

  return (
    <main className="h-screen w-full overflow-hidden bg-[#f5f6f3] text-stone-950 antialiased">
      <div className="flex h-full w-full">
        <aside className="hidden h-full w-[268px] shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-3 border-b border-stone-100 px-5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-stone-950 text-sm font-bold text-white">W</div>
            <div>
              <div className="text-[17px] font-semibold tracking-tight">Wenai</div>
              <div className="text-[11px] text-stone-500">电商内容增长工作台</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item, index) => (
              <Link
                aria-current={item.id === active ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  item.id === active ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
                }`}
                href={item.href}
                key={item.id}
              >
                <span className={`flex size-7 items-center justify-center rounded-lg text-[11px] font-semibold ${item.id === active ? 'bg-white text-stone-950' : 'bg-stone-100 text-stone-500'}`}>
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{item.label}</span>
                  <span className={`block text-[11px] ${item.id === active ? 'text-white/60' : 'text-stone-400'}`}>{item.hint}</span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-stone-100 p-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold text-stone-500">当前任务</div>
              <div className="mt-2 text-sm font-semibold text-stone-950">{activeStepLabel[active]}</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, 18 + activeIndex * 15)}%` }} />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex min-h-16 shrink-0 flex-col gap-3 border-b border-stone-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                Wenai 商品增长工作台
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 ring-1 ring-inset ring-stone-200">{badge}</span>
              </h1>
              <p className="mt-0.5 text-[13px] text-stone-500">给客户直接试用：先填商品，再生成可审核的内容和跟进任务。</p>
              <p className="sr-only">一眼看懂：这套内容怎么帮商品拿到线索。</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">样例数据，不代表真实效果</span>
              {nextHref ? (
                <Link className="rounded-full bg-stone-950 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800" href={nextHref}>
                  {nextLabel}
                </Link>
              ) : null}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1180px] space-y-5 pb-12">
              <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_60px_rgba(28,25,23,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_390px]">
                  <div className="p-5 sm:p-6 lg:p-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {eyebrow}
                    </div>

                    <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_360px]">
                      <div>
                        <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-stone-950 sm:text-5xl">{title}</h2>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">{subtitle}</p>

                        <div className="mt-6 rounded-2xl border border-stone-200 bg-[#fbfaf7] p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-base font-semibold text-stone-950">创建一个商品增长任务</h3>
                              <p className="mt-1 text-xs text-stone-500">客户第一步只需要确认商品、目标和渠道。</p>
                            </div>
                            <button className="w-fit rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700" type="button">
                              生成内容计划
                            </button>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {PRODUCT_FIELDS.map(item => (
                              <label className="block rounded-xl border border-stone-200 bg-white px-3 py-2.5" key={item.label}>
                                <span className="text-[11px] font-medium text-stone-500">{item.label}</span>
                                <input className="mt-1 w-full bg-transparent text-sm font-semibold text-stone-950 outline-none" defaultValue={item.value} />
                              </label>
                            ))}
                          </div>
                          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="grid gap-3 md:grid-cols-3">
                              {metrics.map(item => (
                                <div className="rounded-xl border border-stone-200 bg-white px-3 py-3" key={item.label}>
                                  <div className="text-[11px] font-medium text-stone-500">{item.label}</div>
                                  <div className="mt-1 text-sm font-semibold text-stone-950">{item.value}</div>
                                  {item.detail ? <p className="mt-2 text-xs leading-5 text-stone-500">{item.detail}</p> : null}
                                </div>
                              ))}
                            </div>
                            <Link className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-stone-950 transition hover:border-emerald-300 hover:bg-emerald-100/70" href={primaryActionHref}>
                              <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Next Step</div>
                                <div className="mt-2 text-base font-semibold">{nextLabel}</div>
                                <p className="mt-2 text-xs leading-5 text-stone-600">先确认当前商品任务状态，再进入下一步，不用靠口头解释继续试用。</p>
                              </div>
                              <span className="mt-3 text-sm font-semibold text-emerald-700">打开流程入口</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-stone-200 bg-stone-950 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">Today</p>
                            <h3 className="mt-1 text-lg font-bold">下一步很明确</h3>
                          </div>
                          <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-[11px] font-bold text-stone-950">可继续</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          {WORKFLOW.map((item, index) => (
                            <div className={`rounded-xl border p-3 ${index === activeIndex || (active === 'overview' && index === 0) ? 'border-emerald-300/35 bg-emerald-300/10' : 'border-white/10 bg-white/[0.05]'}`} key={item.title}>
                              <div className="flex items-center gap-2">
                                <span className="flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-stone-950">{index + 1}</span>
                                <h4 className="text-sm font-bold">{item.title}</h4>
                              </div>
                              <p className="mt-1 pl-8 text-[11px] leading-4 text-stone-400">{item.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 bg-[#f8f6f0] p-5 lg:border-l lg:border-t-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-stone-950">客户会拿到的东西</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-500 ring-1 ring-stone-200">不是效果承诺</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {DELIVERABLES.map(item => (
                        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm" key={item.title}>
                          <h4 className="text-sm font-bold text-stone-950">{item.title}</h4>
                          <p className="mt-2 text-xs leading-5 text-stone-500">{item.body}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-stone-200 bg-white lg:grid-cols-6">
                  {NAV.map((item, index) => (
                    <Link className="group border-r border-stone-200 p-3 last:border-r-0 hover:bg-stone-50 sm:p-4" href={item.href} key={item.id}>
                      <div className="flex items-center gap-2">
                        <span className={`flex size-7 items-center justify-center rounded-lg text-[11px] font-semibold ${item.id === active ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-500'}`}>{index + 1}</span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-stone-900">{item.label}</h3>
                          <div className="hidden truncate text-[11px] text-stone-400 sm:block">{item.hint}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {actions.map(item => (
                  <Link className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg" href={item.href} key={`${item.role}-${item.title}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-semibold text-stone-500">{item.role}</div>
                        <h3 className="mt-2 text-base font-semibold text-stone-950">{item.title}</h3>
                      </div>
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-500">打开</span>
                    </div>
                    <p className="mt-4 text-sm leading-5 text-stone-600">{item.value}</p>
                  </Link>
                ))}
              </section>

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
