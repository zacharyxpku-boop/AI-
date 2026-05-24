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
  { id: 'creative', label: '写卖点脚本', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '整理素材 / 图片', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '视频 / 数字人', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '发布包 / 分发', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '复盘跟进', href: '/factory/manage?variant=friend_trial' },
];

const configs: Record<WorkflowStep, WorkflowConfig> = {
  creative: {
    eyebrow: 'Step 01',
    title: '先把商品卖点写成能拍、能发的内容脚本',
    subtitle: '客户输入商品资料和目标平台，系统输出标题、口播、图文脚本、禁用词提醒和下一步素材清单。',
    primaryLabel: '去整理素材',
    primaryHref: '/factory/create?variant=friend_trial',
    toolName: '卖点脚本生成',
    toolMeta: '商品利益点 / 平台话术 / 审核边界',
    status: '可直接使用',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
    cards: [
      { label: '商品目标', value: '1 个主推商品', detail: '先确定今天要生成内容的商品和平台。' },
      { label: '内容角度', value: '3 条候选脚本', detail: '痛点、场景、优惠各一条，客户能直接选。' },
      { label: '下一步', value: '补素材', detail: '脚本会告诉客户还缺哪些图、视频或授权。' },
    ],
    tasks: [
      { title: '填写商品一句话卖点', owner: '客户', status: '待填写' },
      { title: '选择首条口播脚本方向', owner: '运营', status: '下一步' },
      { title: '标记不能使用的夸张词', owner: '系统', status: '自动提示' },
    ],
  },
  create: {
    eyebrow: 'Step 02',
    title: '把商品图、视频片段和授权说明整理成素材货架',
    subtitle: '客户能看到哪些素材可用、哪些素材缺失、哪些图片可以生成，避免一上来就跳到复杂后台。',
    primaryLabel: '去生成视频',
    primaryHref: '/factory/video?variant=friend_trial',
    toolName: '素材与图片生成',
    toolMeta: '商品图 / 场景图 / 卖点图',
    status: 'API Key 可接入',
    accent: 'from-emerald-500 via-cyan-500 to-blue-500',
    cards: [
      { label: '可用素材', value: '6 个', detail: '主图、包装图、场景图、视频片段归档。' },
      { label: '图片生成', value: '可接 API', detail: '已有图片 Key 时直接生成；没有时导出 prompt。' },
      { label: '缺口', value: '1 项待补', detail: '缺授权图或高清商品图时直接提示客户。' },
    ],
    tasks: [
      { title: '上传缺失的商品高清图', owner: '客户', status: '待上传' },
      { title: '生成第一批场景图 prompt', owner: '系统', status: '可执行' },
      { title: '锁定首轮可复用素材', owner: '运营', status: '处理中' },
    ],
  },
  video: {
    eyebrow: 'Step 03',
    title: '用视频 API、数字人 API 或开源混剪组件生成内容版本',
    subtitle: '已有 Key 就接入生成；没有 Key 就导出分镜、字幕、素材包和本地混剪任务。',
    primaryLabel: '去生成发布包',
    primaryHref: '/factory/cast?variant=friend_trial',
    toolName: '视频与数字人生产',
    toolMeta: '短视频 / 数字人口播 / 多语配音',
    status: 'API / 本地混剪双路径',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    cards: [
      { label: '视频任务', value: '8 条', detail: '按平台尺寸、脚本角度和素材组合生成。' },
      { label: '数字人口播', value: '可接入', detail: '有数字人 Key 时进入生成，没有时导出脚本。' },
      { label: '开源混剪', value: '可封装', detail: '把素材、字幕、封面和 BGM 组成可执行任务。' },
    ],
    tasks: [
      { title: '确认首批 3 条视频脚本', owner: '客户', status: '待确认' },
      { title: '选择竖版封面和字幕样式', owner: '运营', status: '下一步' },
      { title: '导出 API 任务或本地混剪包', owner: '系统', status: '可执行' },
    ],
  },
  cast: {
    eyebrow: 'Step 04',
    title: '把内容变成客户能直接发布的多平台发布包',
    subtitle: '生成标题、正文、封面、素材、发布时间和回填表。客户可自己发布；若授权，也可以按流程辅助执行。',
    primaryLabel: '去复盘跟进',
    primaryHref: '/factory/manage?variant=friend_trial',
    toolName: '发布包与分发',
    toolMeta: '小红书 / TikTok / Shopify / Meta',
    status: '先交付发布包',
    accent: 'from-sky-500 via-cyan-500 to-lime-400',
    cards: [
      { label: '发布包', value: '5 个渠道', detail: '每个平台有对应标题、文案、封面和素材。' },
      { label: '客户自发', value: '推荐路径', detail: '客户拿到内容包后直接复制发布。' },
      { label: '授权辅助', value: '可选路径', detail: '只在客户授权范围内做浏览器执行，不保存敏感凭据。' },
    ],
    tasks: [
      { title: '导出小红书发布包', owner: '系统', status: '可执行' },
      { title: '确认 TikTok Shop 发布时间', owner: '客户', status: '待确认' },
      { title: '准备发布结果回填表', owner: '运营', status: '下一步' },
    ],
  },
  manage: {
    eyebrow: 'Step 05',
    title: '把发布结果和客户反馈变成下一轮增长动作',
    subtitle: '客户不用看后台术语，只看哪些内容有效、下一轮拍什么、哪些素材要补、是否继续放大。',
    primaryLabel: '回到工作台',
    primaryHref: '/factory?variant=friend_trial',
    toolName: '表现复盘与客户跟进',
    toolMeta: '链接 / 截图 / 数据 / 下一轮建议',
    status: '可手动或 CSV 导入',
    accent: 'from-slate-700 via-blue-600 to-cyan-500',
    cards: [
      { label: '可复盘内容', value: '4 条', detail: '来自链接、截图、客户反馈或 CSV。' },
      { label: '下一轮建议', value: '3 项', detail: '继续放大、换角度、补素材。' },
      { label: '客户交付', value: '一页报告', detail: '直接给客户看，不需要解释后台字段。' },
    ],
    tasks: [
      { title: '回填首批发布链接', owner: '客户', status: '待回填' },
      { title: '整理表现最好的脚本角度', owner: '系统', status: '可生成' },
      { title: '发送下一轮内容建议', owner: '销售', status: '今天' },
    ],
  },
};

function WorkflowIllustration({ config }: { config: WorkflowConfig }) {
  return (
    <div className={`relative min-h-[300px] overflow-hidden rounded-xl bg-gradient-to-br ${config.accent} p-5 shadow-sm ring-1 ring-white/70`}>
      <div className="absolute right-0 top-0 size-36 -translate-y-1/4 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -bottom-12 left-10 size-44 rounded-full bg-slate-950/20 blur-3xl" />
      <div className="relative grid h-full gap-4 md:grid-cols-[1fr_0.82fr]">
        <div className="flex min-w-0 flex-col justify-between rounded-xl bg-white/88 p-4 shadow-sm ring-1 ring-white/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-rose-400" />
              <span className="size-3 rounded-full bg-amber-300" />
              <span className="size-3 rounded-full bg-emerald-300" />
            </div>
            <span className="h-7 w-20 rounded-full bg-slate-100" />
          </div>
          <div className="space-y-3">
            <span className="block h-3 w-4/5 rounded-full bg-slate-900/85" />
            <span className="block h-2.5 w-3/5 rounded-full bg-slate-400/70" />
            <span className="block h-2.5 w-2/5 rounded-full bg-slate-300/80" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="h-12 rounded-lg bg-indigo-500/14" />
            <span className="h-12 rounded-lg bg-cyan-500/16" />
            <span className="h-12 rounded-lg bg-pink-500/14" />
          </div>
        </div>
        <div className="relative min-h-[210px] rounded-xl bg-white/55 p-4 ring-1 ring-white/80">
          <div className="absolute left-6 top-6 size-24 rounded-2xl bg-white/55" />
          <div className="absolute bottom-8 left-8 size-28 rounded-full bg-slate-950/72" />
          <div className="absolute bottom-8 right-8 h-36 w-16 rounded-2xl bg-white/75" />
          <div className="absolute right-9 top-10 grid gap-2">
            <span className="h-3 w-20 rounded-full bg-white/80" />
            <span className="h-3 w-14 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function KuaiziWorkflowConsole({ active }: { active: WorkflowStep }) {
  const config = configs[active];

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-[248px] lg:border-b-0 lg:border-r">
          <Link href="/factory?variant=friend_trial" className="flex min-h-11 items-center gap-3 rounded-md bg-[#dfe7f8] px-3 text-sm font-black text-[#17223d]">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#5a55ff] via-[#d92dfb] to-[#23d7ff] text-white">W</span>
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
            当前策略：能用已有 API Key 的直接接入；能用开源组件完成的封成本地任务；最后发布给“客户自发”和“授权辅助”两条路径。
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
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">客户能看懂</span>
            </div>
          </header>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <section className="overflow-hidden rounded-md border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.72fr)] lg:items-center">
                  <div className="max-w-2xl">
                    <p className="text-sm font-bold text-indigo-600">{config.toolName}</p>
                    <h2 className="mt-2 break-words text-2xl font-black md:text-3xl">{config.toolMeta}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500">这一页只保留一个主动作，客户知道自己现在该做什么、会得到什么结果。</p>
                    <div className={`mt-4 h-2 w-full max-w-[360px] rounded-full bg-gradient-to-r ${config.accent}`} />
                    <Link className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white" href={config.primaryHref}>
                      <span className="truncate">{config.primaryLabel}</span>
                    </Link>
                  </div>
                  <WorkflowIllustration config={config} />
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
                    <h2 className="mt-1 text-lg font-black text-slate-950">这一步要完成的事</h2>
                  </div>
                  <Link href="/factory?variant=friend_trial" className="text-sm font-black text-blue-700">查看完整流程</Link>
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
              <h2 className="mt-2 text-xl font-black text-slate-950">下一步怎么走</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">子界面和主界面使用同一套导航与视觉语言，点击进去不会像进入另一个产品。</p>
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
