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
  outcome: string;
  cards: Array<{ label: string; value: string; detail: string }>;
  systemPillars: Array<{ title: string; body: string; proof: string }>;
  tasks: Array<{ title: string; owner: string; status: string }>;
  deliverables: Array<{ title: string; body: string; status: string }>;
};

const workflowNav: Array<{ id: WorkflowStep; label: string; href: string }> = [
  { id: 'creative', label: '写卖点脚本', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '整理素材 / 图片', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '视频 / 数字人', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '发布包 / 分发', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '复盘跟进', href: '/factory/manage?variant=friend_trial' },
];

const customerNextActions = [
  {
    label: '补素材',
    title: '补齐商品和证明素材',
    body: '主图、场景图、授权、口播和售后边界先补齐。',
    href: '/factory/create?variant=friend_trial',
  },
  {
    label: '生成',
    title: '生成混剪和发布素材',
    body: '开源混剪、标题矩阵、客服话术和发布包先交付。',
    href: '/factory/video?variant=friend_trial',
  },
  {
    label: '自发',
    title: '客户自己发布',
    body: 'Wenai 不拿账号、密码、cookie 或后台 token。',
    href: '/factory/cast?variant=friend_trial',
  },
  {
    label: '回传',
    title: '回传证据做下一轮',
    body: '链接、截图、CSV 或云盘目录进入复盘和重剪。',
    href: '/factory/manage?variant=friend_trial',
  },
] as const;

const providerBoundaryChips = [
  '现在能跑：混剪、标题、客服、发布包',
  '等你的 Key：图片、视频、数字人、TTS',
  '首版不碰：自动登录、代发、后台数据 API',
] as const;

const lastMileCards = [
  {
    title: '开源/本地先交付',
    body: '长素材切片、字幕口播、模板时间线、稳定渲染和发布包先跑起来。',
    proof: '客户看到成片、标题、封面、发布清单和回填字段。',
  },
  {
    title: '客户自己发布',
    body: 'Wenai 不拿账号、密码、cookie、后台 token，也不绕过平台流程。',
    proof: '客户登录自己的平台账号，复制发布包即可执行。',
  },
  {
    title: '回填再复盘',
    body: '表现数据先靠链接、截图、CSV 或云盘目录，不把平台 API 当首版阻塞。',
    proof: '下一轮判断改图、重剪视频、换标题还是补客服话术。',
  },
] as const;

const configs: Record<WorkflowStep, WorkflowConfig> = {
  creative: {
    eyebrow: 'Step 01',
    title: '先把商品资料变成客户能直接选择的卖点脚本',
    subtitle: '客户输入商品、平台和人群，系统把卖点、场景、口播、图文和禁用词整理成一页可执行 brief，不再让客户面对抽象模块。',
    primaryLabel: '去整理素材',
    primaryHref: '/factory/create?variant=friend_trial',
    toolName: '卖点脚本生成',
    toolMeta: '商品利益点 / 平台话术 / 审核边界',
    status: '可直接使用',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
    outcome: '客户看到的是“今天这个商品先拍什么、先发什么、缺什么素材”，不是一堆工具名。',
    cards: [
      { label: '商品目标', value: '1 个主推商品', detail: '先确定今天要生成内容的商品和平台。' },
      { label: '内容角度', value: '3 条候选脚本', detail: '痛点、场景、优惠各一条，客户能直接选。' },
      { label: '下一步', value: '补素材', detail: '脚本会告诉客户还缺哪些图、视频或授权。' },
    ],
    systemPillars: [
      { title: '商品 brief', body: '把商品链接、卖点、人群、禁用词和参考账号收成一页。', proof: '客户不用理解模块，只看今天先拍什么。' },
      { title: '平台脚本', body: '小红书、TikTok、Shopify、Meta、视频号分开生成标题和口播。', proof: '每个平台都有首句、卖点、证据和 CTA。' },
      { title: '素材反推', body: '脚本会反推缺主图、模特图、场景图还是口播素材。', proof: '缺口直接进入素材页，不靠口头沟通。' },
    ],
    tasks: [
      { title: '填写商品一句话卖点', owner: '客户', status: '待填写' },
      { title: '选择首条口播脚本方向', owner: '运营', status: '下一步' },
      { title: '标记不能使用的夸张词', owner: '系统', status: '自动提示' },
    ],
    deliverables: [
      { title: '卖点角度', body: '痛点、场景、价格锚点、对比证明和评论区钩子分开呈现。', status: '已内置' },
      { title: '平台脚本', body: '小红书图文、TikTok 口播、Shopify 详情页和 Meta 广告各有一套表达。', status: '可生成' },
      { title: '素材缺口', body: '脚本生成后自动反推还缺商品图、场景图、授权图或短视频片段。', status: '下一步' },
    ],
  },
  create: {
    eyebrow: 'Step 02',
    title: '把商品图、模特图、证明图和客服素材整理成货架',
    subtitle: '图片生成等你的 Key；当前先把商品素材、模特生图 prompt、授权检查和客服 FAQ 做成可执行生产包。',
    primaryLabel: '去生成视频',
    primaryHref: '/factory/video?variant=friend_trial',
    toolName: '素材与图片生成',
    toolMeta: '商品图 / 模特生图 / 场景图 / 卖点图',
    status: 'API Key 可接入',
    accent: 'from-emerald-500 via-cyan-500 to-blue-500',
    outcome: '电商人最关心的不是“生成图片”，而是主图、穿搭图、手持图、使用场景图能不能批量补齐。',
    cards: [
      { label: '可用素材', value: '6 个', detail: '主图、包装图、场景图、视频片段归档。' },
      { label: '模特生图', value: '等 Key', detail: '先输出模特、姿态、场景和构图 prompt。' },
      { label: '客服素材', value: '可生成', detail: '尺码、材质、物流、售后和 FAQ 同步整理。' },
    ],
    systemPillars: [
      { title: '模特生图任务包', body: 'Key 到位后接图片生成；Key 未到位先导出 prompt、构图和补图清单。', proof: '每张图都有用途、输入、质量检查和回退路径。' },
      { title: '商品证明图', body: '主图、细节图、材质图、规格图、对比图和使用场景图按发布用途归档。', proof: '素材进入视频和发布包前先检查授权。' },
      { title: '客服与售后承接', body: '把材质、尺码、物流、售后承诺、评论区异议同步给客服和 FAQ。', proof: '内容带来的咨询能被接住。' },
    ],
    tasks: [
      { title: '上传缺失的商品高清图', owner: '客户', status: '待上传' },
      { title: '生成第一批场景图 prompt', owner: '系统', status: '可执行' },
      { title: '锁定首轮可复用素材', owner: '运营', status: '处理中' },
    ],
    deliverables: [
      { title: '商品影棚', body: '主图、白底图、场景图、卖点图、规格图和对比图按用途归档。', status: '可用' },
      { title: '模特与人群', body: '用商品和人群定位生成模特风格、年龄、动作、场景和构图任务。', status: '等 Key' },
      { title: '客服素材包', body: '把尺码、材质、物流、售后、常见异议整理成客服话术和售后卡片。', status: '可生成' },
    ],
  },
  video: {
    eyebrow: 'Step 03',
    title: '本地混剪先稳定出片，视频和数字人 Key 到位后增强',
    subtitle: '图片视频数字人等 Key 等你给；混剪先走开源/本地工作流，把脚本、素材、字幕、封面、BGM 和尺寸封成稳定渲染任务。',
    primaryLabel: '去生成发布包',
    primaryHref: '/factory/cast?variant=friend_trial',
    toolName: '视频与数字人生产',
    toolMeta: '短视频 / 数字人口播 / 多语配音',
    status: 'API / 本地混剪双路径',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    outcome: '目标不是炫酷剪辑台，而是让同一组素材稳定产出多平台短视频、数字人口播和多语版本。',
    cards: [
      { label: '视频任务', value: '8 条', detail: '按平台尺寸、脚本角度和素材组合生成。' },
      { label: '数字人口播', value: '可接入', detail: '有数字人 Key 时进入生成，没有时导出脚本。' },
      { label: '开源混剪', value: '本地优先', detail: 'Remotion 思路做模板，FFmpeg 做合成，时间线 JSON 做任务交接。' },
    ],
    systemPillars: [
      { title: 'GitHub 开源混剪蓝图', body: '吸收 Remotion、FFmpeg、OpenTimelineIO、PySceneDetect、Auto-Editor、Revideo、Twick 等开源范式。', proof: '客户只看到时间线、字幕、成片、标题和发布包。' },
      { title: '稳定渲染队列', body: '每条视频有素材清单、尺寸、标题角度、输出路径、重试次数和 blocked reason。', proof: '单条失败只重跑单条，不拖垮整批。' },
      { title: '数字人等 Key', body: '图片、视频、数字人 Key 到位后接入生成层；未到位时继续导出口播稿和本地混剪包。', proof: '首版输出客户自发布包。' },
    ],
    tasks: [
      { title: '确认首批 3 条视频脚本', owner: '客户', status: '待确认' },
      { title: '选择竖版封面和字幕样式', owner: '运营', status: '下一步' },
      { title: '导出 API 任务或本地混剪包', owner: '系统', status: '可执行' },
    ],
    deliverables: [
      { title: '时间线任务', body: '脚本、镜头、素材、字幕、封面、音频和输出尺寸统一成可重跑任务。', status: '可封装' },
      { title: '稳定渲染队列', body: '待补素材、可渲染、渲染中、已导出四种状态；失败只重跑单条任务。', status: '工程化中' },
      { title: '数字人口播', body: 'Key 到位后接数字人/TTS；未接前先交付口播稿、字幕和素材包。', status: '等 Key' },
    ],
  },
  cast: {
    eyebrow: 'Step 04',
    title: '把内容变成客户自己能发布的多平台发布包',
    subtitle: '多账号矩阵先不碰自动登录，重点把每个平台的标题、正文、标签、封面、素材和回填表做准，客户拿到就能发。',
    primaryLabel: '去复盘跟进',
    primaryHref: '/factory/manage?variant=friend_trial',
    toolName: '发布包与分发',
    toolMeta: '小红书 / TikTok / Shopify / Meta',
    status: '先交付发布包',
    accent: 'from-sky-500 via-cyan-500 to-lime-400',
    outcome: '先解决“发什么、复制什么、上传什么、发布后回填什么”，不把客户带进复杂账号授权。',
    cards: [
      { label: '发布包', value: '5 个渠道', detail: '每个平台有对应标题、文案、封面和素材。' },
      { label: '客户自发', value: '推荐路径', detail: '客户拿到内容包后直接复制发布。' },
      { label: '授权辅助', value: '后续增强', detail: '只有客户明确授权时才做辅助执行，不作为当前上线阻塞。' },
    ],
    systemPillars: [
      { title: '多账号标题矩阵', body: '参考超级 IP 和口播结构，为真实买家号、测评种草号、店铺官方号生成不同标题。', proof: '每个平台都有标题、首句、正文、标签和封面提示。' },
      { title: '客户自己发布', body: 'Wenai 交付发布包和复制清单，不保存客户账号、密码、cookie 或登录态。', proof: '发布边界清楚，客户可直接执行。' },
      { title: '回填收件箱', body: '发布后客户上传链接、截图、CSV 或云盘备注。', proof: '下一轮复盘不依赖平台自动读取。' },
    ],
    tasks: [
      { title: '导出小红书发布包', owner: '系统', status: '可执行' },
      { title: '确认 TikTok Shop 发布时间', owner: '客户', status: '待确认' },
      { title: '准备发布结果回填表', owner: '运营', status: '下一步' },
    ],
    deliverables: [
      { title: '平台标题包', body: '参考超级 IP/口播结构，为小红书、TikTok、Shopify、Meta、视频号分别生成标题。', status: '可生成' },
      { title: '发布素材包', body: '每个平台对应封面、正文、标签、素材清单、发布时间建议和注意事项。', status: '可导出' },
      { title: '客户自发路径', body: '客户发布后只需要回填链接、截图或 CSV，平台再做下一轮复盘。', status: '推荐' },
    ],
  },
  manage: {
    eyebrow: 'Step 05',
    title: '把表现数据、客服反馈和售后问题变成下一轮增长动作',
    subtitle: '平台数据直连先不作为阻塞。客户可上传链接、截图、CSV 或云盘资料，系统判断哪条内容有效、下一轮拍什么、客服话术怎么补。',
    primaryLabel: '回到工作台',
    primaryHref: '/factory?variant=friend_trial',
    toolName: '表现复盘与客户跟进',
    toolMeta: '链接 / 截图 / 数据 / 下一轮建议',
    status: '可手动或 CSV 导入',
    accent: 'from-slate-700 via-blue-600 to-cyan-500',
    outcome: '复盘页要回答电商人每天最实际的问题：哪条继续放大、哪条换角度、客服和售后该怎么说。',
    cards: [
      { label: '可复盘内容', value: '4 条', detail: '来自链接、截图、客户反馈或 CSV。' },
      { label: '下一轮建议', value: '3 项', detail: '继续放大、换角度、补素材。' },
      { label: '客服素材', value: '可生成', detail: 'FAQ、差评解释、物流/尺码/材质话术和售后卡片。' },
    ],
    systemPillars: [
      { title: '云盘回填复盘', body: '客户把发布链接、截图、CSV、云盘目录或备注上传回来。', proof: '没有平台 API 也能判断下一轮方向。' },
      { title: '客服和售后承接', body: '把评论区问题、差评原因、物流/尺码/材质问题变成客服话术。', proof: '内容带来的咨询能被接住。' },
      { title: '后续可接数据 API', body: '等客户授权、字段稳定、失败可回退 CSV 后，再接 analytics 或平台 API。', proof: '不先为 provider 付费或卡首版交付。' },
    ],
    tasks: [
      { title: '回填首批发布链接', owner: '客户', status: '待回填' },
      { title: '整理表现最好的脚本角度', owner: '系统', status: '可生成' },
      { title: '发送下一轮内容建议', owner: '销售', status: '今天' },
    ],
    deliverables: [
      { title: '表现上传', body: '链接、截图、CSV、云盘文件都能作为第一阶段数据入口。', status: '可用' },
      { title: '复盘建议', body: '从点击、收藏、评论、转化和客户反馈里生成下一轮内容角度。', status: '可生成' },
      { title: '客服与售后', body: '把常见问题、异议、差评原因整理成客服话术和售后卡片。', status: '新增' },
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
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{config.status}</span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">客户能看懂</span>
            </div>
          </header>

          <section className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">客户下一步</div>
                <h2 className="mt-1 text-lg font-black leading-6 text-slate-950">每个子页面都按同一条电商交付链路推进</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">客户不需要理解内部工具名，只要知道现在补什么、Wenai 交付什么、自己发布后回传什么。</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {providerBoundaryChips.map(chip => (
                  <span className="rounded-md bg-slate-50 px-3 py-2 text-xs font-black leading-4 text-slate-700 ring-1 ring-slate-200" key={chip}>{chip}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {customerNextActions.map((item, index) => (
                <Link className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50" href={item.href} key={item.label}>
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-slate-950 text-[11px] font-black text-white">{index + 1}</span>
                    <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">{item.label}</span>
                  </div>
                  <h3 className="mt-2 truncate text-sm font-black text-slate-950">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-600">{item.body}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Last Mile</p>
                <h2 className="mt-1 text-lg font-black leading-6 text-slate-950">每个子页面都保留同一个最后一公里边界</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">开源混剪做到可发布资产；平台发布和真实表现证据由客户回到工作台。</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">不代登，不虚构</span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {lastMileCards.map(card => (
                <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100" key={card.title}>
                  <h3 className="text-sm font-black leading-5 text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-xs font-bold leading-5 text-emerald-800">{card.body}</p>
                  <p className="mt-3 rounded bg-emerald-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-700">{card.proof}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <section className="overflow-hidden rounded-md border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.72fr)] lg:items-center">
                  <div className="max-w-2xl">
                    <p className="text-sm font-bold text-indigo-600">{config.toolName}</p>
                    <h2 className="mt-2 break-words text-2xl font-black md:text-3xl">{config.toolMeta}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{config.outcome}</p>
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

              <section className="rounded-md border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">System Capability</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">客户能看到的系统能力</h2>
                  </div>
                  <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">清楚，不杂</span>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {config.systemPillars.map(item => (
                    <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-indigo-100" key={item.title}>
                      <h3 className="break-words text-sm font-black leading-5 text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                      <p className="mt-3 rounded bg-slate-50 px-2 py-1.5 text-xs font-bold leading-5 text-indigo-700">{item.proof}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Deliverables</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">这一页最后交付什么</h2>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">不用外部登录也能推进</span>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {config.deliverables.map(item => (
                    <article key={item.title} className="min-w-0 rounded-md border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="break-words text-sm font-black text-slate-900">{item.title}</h3>
                        <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-indigo-700 ring-1 ring-slate-200">{item.status}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                    </article>
                  ))}
                </div>
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
