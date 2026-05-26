'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

type StepInteraction = {
  actionLabel: string;
  artifactTitle: string;
  artifactSections: Array<{ label: string; value: string }>;
  customerAction: string;
  evidencePrompt: string;
  helper: string;
  operatorAction: string;
  previewTitle: string;
  previewItems: string[];
  nextInstruction: string;
  stepChecklist: string[];
};

const workflowNav: Array<{ id: WorkflowStep; label: string; href: string }> = [
  { id: 'creative', label: '写卖点脚本', href: '/factory/creative?variant=friend_trial' },
  { id: 'create', label: '整理素材 / 图片', href: '/factory/create?variant=friend_trial' },
  { id: 'video', label: '视频 / 数字人', href: '/factory/video?variant=friend_trial' },
  { id: 'cast', label: '发布包 / 分发', href: '/factory/cast?variant=friend_trial' },
  { id: 'manage', label: '复盘跟进', href: '/factory/manage?variant=friend_trial' },
];

const workflowStepOrder: WorkflowStep[] = ['creative', 'create', 'video', 'cast', 'manage'];

const stepWorkbenchModules: Record<WorkflowStep, Array<{ label: string; body: string; href: string; state: string }>> = {
  creative: [
    { label: '开场引入', body: '3 秒钩子、痛点句、评论区话题', href: '/factory/creative?variant=friend_trial', state: '可生成' },
    { label: '产品卖点', body: '利益点、证据点、禁用词提醒', href: '/factory/creative?variant=friend_trial', state: '可编辑' },
    { label: '平台脚本', body: '小红书、TikTok、视频号、独立站', href: '/factory/cast?variant=friend_trial', state: '可分发' },
  ],
  create: [
    { label: '商品图库', body: '主图、白底图、细节图、规格图', href: '/factory/create?variant=friend_trial', state: '可归档' },
    { label: '模特生图', body: '人设、姿态、场景、构图任务', href: '/factory/create?variant=friend_trial', state: '可接 API' },
    { label: '客服素材', body: 'FAQ、售后卡、差评解释、物流话术', href: '/factory/manage?variant=friend_trial', state: '可生成' },
  ],
  video: [
    { label: '素材调试', body: '素材分组、音频分组、镜头组合', href: '/factory/video?variant=friend_trial', state: '可执行' },
    { label: '极速裂变', body: '同素材多标题、多字幕、多尺寸', href: '/factory/video?variant=friend_trial', state: '可排队' },
    { label: '组合优化', body: '脚本策略、预览视频、失败重试', href: '/factory/video?variant=friend_trial', state: '可合成' },
  ],
  cast: [
    { label: '发布渠道', body: '抖音、快手、视频号、小红书、Meta', href: '/factory/cast?variant=friend_trial', state: '可选择' },
    { label: 'AI 标题', body: '批量标题、标签、首评引导', href: '/factory/cast?variant=friend_trial', state: '可生成' },
    { label: '发布回填', body: '链接、截图、CSV、云盘目录', href: '/factory/manage?variant=friend_trial', state: '可复盘' },
  ],
  manage: [
    { label: '创意洞察', body: '账号榜单、热视频、点赞评论收藏', href: '/factory/manage?variant=friend_trial', state: '可解析' },
    { label: '客服承接', body: '咨询问题、FAQ、售后话术', href: '/factory/manage?variant=friend_trial', state: '可生成' },
    { label: '下一轮任务', body: '放大、重剪、补图、换标题', href: '/factory/creative?variant=friend_trial', state: '可启动' },
  ],
};

const customerNextActions = [
  {
    label: '补素材',
    title: '补齐商品和证明素材',
    body: '主图、场景图、授权、口播和售后边界先补齐。',
    href: '/factory/create?variant=friend_trial',
  },
  {
    label: '生成',
    title: '生成视频和发布素材',
    body: '视频合成、标题文案、客服话术和发布包先交付。',
    href: '/factory/video?variant=friend_trial',
  },
  {
    label: '自发',
    title: '客户自己发布',
    body: '客户自己登录平台发布，Wenai 只交付可复制发布包。',
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
    '现在能跑：视频、标题、客服、发布包',
  '图片、视频、数字人可后续增强',
  '首版边界：客户自发布，发布后回填',
] as const;

const lastMileCards = [
  {
    title: '先把内容包交付',
    body: '长素材切片、字幕口播、模板时间线、稳定渲染和发布包先跑起来。',
    proof: '客户看到成片、标题、封面、发布清单和回填字段。',
  },
  {
    title: '客户自己发布',
    body: 'Wenai 只交付发布包、素材清单和回填入口。',
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
    eyebrow: '步骤 01',
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
    eyebrow: '步骤 02',
    title: '把商品图、模特图、证明图和客服素材整理成货架',
    subtitle: '先把商品素材、参考图、卖点图要求和客服 FAQ 做成可执行生产包。',
    primaryLabel: '去生成视频',
    primaryHref: '/factory/video?variant=friend_trial',
    toolName: '素材与图片生成',
    toolMeta: '商品图 / 模特生图 / 场景图 / 卖点图',
    status: 'API Key 可接入',
    accent: 'from-emerald-500 via-cyan-500 to-blue-500',
    outcome: '电商人最关心的不是“生成图片”，而是主图、穿搭图、手持图、使用场景图能不能批量补齐。',
    cards: [
      { label: '可用素材', value: '6 个', detail: '主图、包装图、场景图、视频片段归档。' },
      { label: '模特生图', value: '可增强', detail: '先输出模特、姿态、场景和构图任务。' },
      { label: '客服素材', value: '可生成', detail: '尺码、材质、物流、售后和 FAQ 同步整理。' },
    ],
    systemPillars: [
      { title: '模特生图任务包', body: '先把模特风格、姿态、场景和构图整理成可执行任务；生成能力增强后直接进入图片生产。', proof: '每张图都有用途、输入、质量检查和回退路径。' },
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
      { title: '模特与人群', body: '用商品和人群定位生成模特风格、年龄、动作、场景和构图任务。', status: '可增强' },
      { title: '客服素材包', body: '把尺码、材质、物流、售后、常见异议整理成客服话术和售后卡片。', status: '可生成' },
    ],
  },
  video: {
    eyebrow: '步骤 03',
    title: '先稳定出片，后续增强视频和数字人能力',
    subtitle: '先把脚本、素材、字幕、封面、BGM 和尺寸整理成稳定生产任务，让客户先拿到可审核、可发布的内容包。',
    primaryLabel: '去生成发布包',
    primaryHref: '/factory/cast?variant=friend_trial',
    toolName: '视频与数字人生产',
    toolMeta: '短视频 / 数字人口播 / 多语配音',
    status: 'API / 本地混剪双路径',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    outcome: '目标不是炫酷剪辑台，而是让同一组素材稳定产出多平台短视频、数字人口播和多语版本。',
    cards: [
      { label: '视频任务', value: '8 条', detail: '按平台尺寸、脚本角度和素材组合生成。' },
      { label: '数字人口播', value: '可增强', detail: '先导出口播稿和字幕，增强后进入数字人生产。' },
      { label: '批量合成', value: '稳定优先', detail: '按脚本、素材、字幕、封面和尺寸生成可复核任务。' },
    ],
    systemPillars: [
      { title: '稳定视频生产线', body: '把素材、字幕、封面、尺寸和发布时间线整理成可审核的视频任务。', proof: '客户只看到时间线、字幕、成片、标题和发布包。' },
      { title: '稳定渲染队列', body: '每条视频有素材清单、尺寸、标题角度、输出路径、重试次数和 blocked reason。', proof: '单条失败只重跑单条，不拖垮整批。' },
      { title: '数字人口播增强', body: '先交付口播稿、字幕和素材包；增强能力接入后再自动生成数字人口播。', proof: '首版输出客户自发布包。' },
    ],
    tasks: [
      { title: '确认首批 3 条视频脚本', owner: '客户', status: '待确认' },
      { title: '选择竖版封面和字幕样式', owner: '运营', status: '下一步' },
      { title: '导出 API 任务或本地混剪包', owner: '系统', status: '可执行' },
    ],
    deliverables: [
      { title: '时间线任务', body: '脚本、镜头、素材、字幕、封面、音频和输出尺寸统一成可重跑任务。', status: '可封装' },
      { title: '稳定渲染队列', body: '待补素材、可渲染、渲染中、已导出四种状态；失败只重跑单条任务。', status: '工程化中' },
      { title: '数字人口播', body: '先交付口播稿、字幕和素材包；增强能力接入后再生成数字人口播。', status: '可增强' },
    ],
  },
  cast: {
    eyebrow: '步骤 04',
    title: '把内容变成客户自己能发布的多平台发布包',
    subtitle: '重点把每个平台的标题、正文、标签、封面、素材和回填表做准，客户拿到就能发。',
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
      { label: '回填证据', value: '下一轮入口', detail: '发布后回传链接、截图、CSV 或云盘目录。' },
    ],
    systemPillars: [
      { title: '平台发布文案', body: '按小红书、TikTok、视频号和独立站分别生成标题、首句和正文。', proof: '每个平台都有标题、首句、正文、标签和封面提示。' },
      { title: '客户自己发布', body: 'Wenai 交付发布包和复制清单，客户自己登录平台发布。', proof: '发布边界清楚，客户可直接执行。' },
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
    eyebrow: '步骤 05',
    title: '把链接、截图、CSV、云盘和客服问题变成下一轮动作',
    subtitle: '平台数据直连先不作为阻塞。客户上传发布链接、后台截图、CSV、云盘资料和客服反馈，系统判断哪条放大、哪条重剪、哪类 FAQ 要补。',
    primaryLabel: '回到工作台',
    primaryHref: '/factory?variant=friend_trial',
    toolName: '表现复盘与客户跟进',
    toolMeta: '链接 / 截图 / 数据 / 下一轮建议',
    status: '可手动或 CSV 导入',
    accent: 'from-slate-700 via-blue-600 to-cyan-500',
    outcome: '复盘页要回答电商人每天最实际的问题：哪条继续放大、哪条换角度、客服和售后该怎么说。',
    cards: [
      { label: '回填入口', value: '4 类', detail: '链接、截图、CSV、云盘目录。' },
      { label: '下一轮动作', value: '4 种', detail: '放大、重剪、补客服、暂停。' },
      { label: '客服素材', value: '可生成', detail: 'FAQ、差评解释、物流/尺码/材质话术和售后卡片。' },
    ],
    systemPillars: [
      { title: '回填收件箱', body: '客户把发布链接、后台截图、CSV、云盘目录或备注上传回来。', proof: '没有平台 API 也能判断下一轮方向。' },
      { title: '客服和售后承接', body: '把评论区问题、差评原因、物流/尺码/材质问题变成客服话术。', proof: '内容带来的咨询能被接住。' },
      { title: '下一轮增长动作', body: '按证据判断继续放大、换角度重剪、补 FAQ，还是暂停。', proof: '不先为外部数据接口付费或卡首版交付。' },
    ],
    tasks: [
      { title: '回填首批发布链接', owner: '客户', status: '待回填' },
      { title: '整理表现最好的脚本角度', owner: '系统', status: '可生成' },
      { title: '发送下一轮内容建议', owner: '销售', status: '今天' },
    ],
    deliverables: [
      { title: '表现回填', body: '链接、截图、CSV、云盘文件都能作为第一阶段数据入口。', status: '可用' },
      { title: '复盘建议', body: '从点击、收藏、评论、转化和客户反馈里生成下一轮内容角度。', status: '可生成' },
      { title: '客服与售后', body: '把常见问题、异议、差评原因整理成客服话术和售后卡片。', status: '可生成' },
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

function buildStepInteraction(active: WorkflowStep, productName: string, platform: string, assetReady: boolean, audienceGoal: string): StepInteraction {
  const product = productName.trim() || '当前商品';
  const goal = audienceGoal.trim() || '先完成一轮可发布内容';
  const assetLine = assetReady ? '素材已齐，可以直接进入生成。' : '素材未齐，系统会先列出缺口和补齐顺序。';

  if (active === 'creative') {
    return {
      actionLabel: '生成卖点脚本',
      artifactTitle: '卖点脚本交付件',
      artifactSections: [
        { label: '标题方向', value: `${platform}：${product}，围绕「${goal}」先出 3 个标题。` },
        { label: '口播脚本', value: '开头 3 秒痛点、商品证明、使用场景、行动引导各一段。' },
        { label: '素材缺口', value: assetLine },
      ],
      customerAction: '填写商品名、目标平台和这轮想解决的问题。',
      evidencePrompt: '确认一个脚本方向，或补充不能使用的夸张词、竞品词。',
      helper: '输入商品后，先拿到可以给客户确认的 3 个内容方向。',
      operatorAction: 'Wenai 会把商品信息拆成标题、口播、图文和禁用词提醒。',
      previewTitle: `${product} 的首批脚本`,
      previewItems: [
        `${platform} 标题：${product}，围绕「${goal}」先解决一个真实使用痛点`,
        '口播结构：痛点开场 / 商品证明 / 使用场景 / 行动引导',
        assetLine,
      ],
      nextInstruction: '确认一个脚本方向后，去素材页补齐图片和授权。',
      stepChecklist: ['填商品和平台', '选择卖点方向', '确认素材缺口'],
    };
  }

  if (active === 'create') {
    return {
      actionLabel: '生成素材清单',
      artifactTitle: '素材任务交付件',
      artifactSections: [
        { label: '图片任务', value: '白底图、细节图、场景图、卖点图按平台用途拆开。' },
        { label: '证明材料', value: `围绕「${goal}」检查授权、参数、FAQ 和售后承诺。` },
        { label: '下一步', value: assetReady ? '素材齐，直接进入视频和图文版本。' : '先补主图、参考图、授权或客服 FAQ。' },
      ],
      customerAction: '确认已有素材是否齐全，缺什么就按清单补什么。',
      evidencePrompt: '上传或记录商品图、场景图、授权说明、FAQ。',
      helper: '把商品图、场景图、证明图和客服 FAQ 变成可执行清单。',
      operatorAction: 'Wenai 会把素材变成图片任务、视频任务和客服素材任务。',
      previewTitle: `${product} 的素材任务`,
      previewItems: [
        `主图：白底图、细节图、使用场景图各 1 组`,
        `平台：${platform} 优先准备封面图和首屏卖点图`,
        assetLine,
      ],
      nextInstruction: '素材齐后，进入视频页生成短视频和图文版本。',
      stepChecklist: ['核对商品图', '补证明和授权', '进入视频生成'],
    };
  }

  if (active === 'video') {
    return {
      actionLabel: '生成内容版本',
      artifactTitle: '短视频与图文交付件',
      artifactSections: [
        { label: '短视频', value: `${platform}：15 秒口播、封面标题、字幕和镜头顺序。` },
        { label: '图文', value: `围绕「${goal}」输出封面图标题、正文和评论区引导。` },
        { label: '失败兜底', value: assetReady ? '可直接导出发布包。' : '素材不足时先导出口播稿和补素材清单。' },
      ],
      customerAction: '选择要先发布的视频角度和图文角度。',
      evidencePrompt: '确认封面、口播、字幕和尺寸是否能发布。',
      helper: '把一个卖点拆成短视频、图文和口播稿，先预览再交付。',
      operatorAction: 'Wenai 会生成多个平台版本，并把可发布版本送到发布包。',
      previewTitle: `${product} 的内容版本`,
      previewItems: [
        `${platform} 版本：15 秒口播 + 封面标题 + 正文草稿`,
        '生成 3 个角度：痛点、场景、优惠',
        assetReady ? '可进入发布包。' : '缺素材时先导出口播稿和补素材清单。',
      ],
      nextInstruction: '选择一个版本后，去发布页拿可复制发布包。',
      stepChecklist: ['选内容角度', '确认封面和字幕', '导出发布包'],
    };
  }

  if (active === 'cast') {
    return {
      actionLabel: '生成发布包',
      artifactTitle: '平台发布包',
      artifactSections: [
        { label: '复制内容', value: `${platform} 标题、正文、标签、封面提示和首评引导。` },
        { label: '客户动作', value: '客户自己登录平台发布，不需要把账号交给 Wenai。' },
        { label: '回填字段', value: '发布链接、截图、CSV 或云盘目录。' },
      ],
      customerAction: '复制发布包，登录自己的平台账号发布。',
      evidencePrompt: '发布后把链接、截图或数据表回填到复盘页。',
      helper: '客户不需要授权账号，直接拿标题、正文、标签和回填表。',
      operatorAction: 'Wenai 负责整理可复制内容和发布检查表。',
      previewTitle: `${product} 的发布包`,
      previewItems: [
        `${platform}：标题、正文、标签、封面提示已整理`,
        '发布后回填：链接、截图、CSV 或云盘备注',
        assetReady ? '发布包可复制。' : '缺封面或素材时先回到素材页补齐。',
      ],
      nextInstruction: '客户自己发布后，进入复盘页回填证据。',
      stepChecklist: ['复制发布包', '客户自行发布', '回填发布证据'],
    };
  }

  return {
    actionLabel: '生成复盘建议',
    artifactTitle: '下一轮复盘交付件',
    artifactSections: [
      { label: '表现判断', value: `${platform}：先看点击、收藏、评论、咨询和客户反馈。` },
      { label: '下一轮动作', value: `围绕「${goal}」判断放大、重剪、换角度或补 FAQ。` },
      { label: '销售跟进', value: '把复盘建议和客服问题同步给负责人。' },
    ],
    customerAction: '回填发布链接、截图、CSV 或客户备注。',
    evidencePrompt: '上传证据越完整，下一轮建议越具体。',
    helper: '把客户回填的链接、截图或 CSV 变成下一轮动作。',
    operatorAction: 'Wenai 会把表现证据转成下一轮脚本、素材和客服建议。',
    previewTitle: `${product} 的复盘动作`,
    previewItems: [
      `${platform} 数据：先看点击、收藏、评论和咨询问题`,
      '下一轮建议：放大胜出角度、重剪弱版本、补客服 FAQ',
      assetReady ? '可发送给销售跟进。' : '缺回填证据时先让客户补链接或截图。',
    ],
    nextInstruction: '确认建议后，回到工作台开启下一轮商品任务。',
    stepChecklist: ['回填证据', '生成复盘建议', '开启下一轮任务'],
  };
}

export function KuaiziWorkflowConsole({
  active,
  initialAssetReady,
  initialAudienceGoal = '先完成一轮可发布内容',
  initialGenerated = false,
  initialPlatform = '小红书',
  initialProductName = '便携宠物慢食碗',
}: {
  active: WorkflowStep;
  initialAssetReady?: boolean;
  initialAudienceGoal?: string;
  initialGenerated?: boolean;
  initialPlatform?: string;
  initialProductName?: string;
}) {
  const config = configs[active];
  const activeIndex = workflowStepOrder.indexOf(active);
  const nextHref = config.primaryHref;
  const nextLabel = active === 'manage' ? '回到工作台' : config.primaryLabel;
  const progressPercent = Math.round(((activeIndex + 1) / workflowStepOrder.length) * 100);
  const workbenchModules = stepWorkbenchModules[active];
  const [productName, setProductName] = useState(initialProductName);
  const [platform, setPlatform] = useState(initialPlatform);
  const [audienceGoal, setAudienceGoal] = useState(initialAudienceGoal);
  const [assetReady, setAssetReady] = useState(initialAssetReady ?? active !== 'create');
  const [generated, setGenerated] = useState(initialGenerated);
  const interaction = useMemo(
    () => buildStepInteraction(active, productName, platform, assetReady, audienceGoal),
    [active, productName, platform, assetReady, audienceGoal],
  );
  const taskQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set('variant', 'friend_trial');
    params.set('generated', generated ? '1' : '0');
    params.set('productName', productName);
    params.set('platform', platform);
    params.set('audienceGoal', audienceGoal);
    params.set('assetReady', assetReady ? '1' : '0');
    return params.toString();
  }, [assetReady, audienceGoal, generated, platform, productName]);
  const withTaskContext = (href: string) => `${href.split('?')[0]}?${taskQuery}`;

  useEffect(() => {
    setProductName(initialProductName);
    setPlatform(initialPlatform);
    setAudienceGoal(initialAudienceGoal);
    setAssetReady(initialAssetReady ?? active !== 'create');
    setGenerated(initialGenerated);
  }, [active, initialAssetReady, initialAudienceGoal, initialGenerated, initialPlatform, initialProductName]);

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#15213f]" style={{ backgroundColor: '#f4f6fb' }}>
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
                  href={withTaskContext(item.href)}
                  className={`flex min-h-10 items-center justify-between rounded-md px-3 text-sm font-bold transition ${isActive ? 'bg-[#14233f] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="shrink-0 text-xs opacity-70">›</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            当前策略：先交付图片、视频、文案、发布包和回填入口；后续生成能力增强时，不改变客户操作路径。
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-3 rounded-md border border-white bg-white/85 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-black tracking-tight md:text-xl">Wenai 商品增长工作台</h1>
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{config.status}</span>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">客户能看懂</span>
              </div>
              <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">选商品、点工具、拿发布包；当前页面是第 {config.eyebrow.replace('步骤 ', '')} 步。</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600" type="button">搜索工具 Ctrl K</button>
              <Link className="min-h-10 rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 py-2.5 text-sm font-black text-white shadow-sm" href={withTaskContext(config.primaryHref)}>
                下一步：{config.primaryLabel}
              </Link>
            </div>
          </header>

          <section className="mt-5 overflow-hidden rounded-lg border border-[#dbe6ff] bg-white shadow-sm">
            <div className="relative min-h-[520px] bg-[linear-gradient(135deg,#fbfdff_0%,#f1f6ff_52%,#ffffff_100%)] px-5 py-10">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,64,175,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(30,64,175,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="relative mx-auto max-w-5xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">{config.eyebrow}</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#15213f] md:text-5xl">{config.title}</h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">{config.subtitle}</p>
                <div className="mx-auto mt-6 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                  <span className="rounded-full bg-slate-950 px-6 py-2 text-sm font-black text-white">AI 工具</span>
                  <span className="rounded-full px-6 py-2 text-sm font-black text-slate-500">小 W</span>
                </div>
              </div>

              <div className="relative mx-auto mt-10 grid max-w-6xl gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center">
                <div className="space-y-4">
                  <form
                    className="rounded-lg border border-slate-200 bg-white/92 p-4 text-left shadow-sm"
                    id="task-form"
                    method="get"
                  >
                    <input name="variant" type="hidden" value="friend_trial" />
                    <input name="generated" type="hidden" value="1" />
                    <div className="mb-4 grid gap-3 lg:grid-cols-3">
                      {[
                        ['你先做', interaction.customerAction],
                        ['Wenai 生成', interaction.operatorAction],
                        ['拿去用', interaction.evidencePrompt],
                      ].map(([label, body]) => (
                        <div className="rounded-md bg-slate-50 px-3 py-2 ring-1 ring-slate-100" key={label}>
                          <p className="text-[11px] font-black text-indigo-600">{label}</p>
                          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{body}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(220px,1fr)_170px_minmax(220px,1fr)] lg:items-end">
                      <label className="min-w-0 flex-1 text-xs font-black text-slate-500">
                        商品
                        <input
                          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          name="productName"
                          onChange={(event) => {
                            setProductName(event.target.value);
                            setGenerated(false);
                          }}
                          placeholder="输入商品名"
                          value={productName}
                        />
                      </label>
                      <label className="min-w-0 flex-1 text-xs font-black text-slate-500">
                        平台
                        <select
                          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          name="platform"
                          onChange={(event) => {
                            setPlatform(event.target.value);
                            setGenerated(false);
                          }}
                          value={platform}
                        >
                          {['小红书', 'TikTok', '视频号', '独立站', 'Meta'].map(item => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label className="min-w-0 flex-1 text-xs font-black text-slate-500">
                        这轮目标
                        <input
                          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          name="audienceGoal"
                          onChange={(event) => {
                            setAudienceGoal(event.target.value);
                            setGenerated(false);
                          }}
                          placeholder="例如：拉新 / 测爆款 / 清库存"
                          value={audienceGoal}
                        />
                      </label>
                      <label className="flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-600">
                        <input
                          checked={assetReady}
                          className="size-4 accent-indigo-600"
                          name="assetReady"
                          onChange={(event) => {
                            setAssetReady(event.target.checked);
                            setGenerated(false);
                          }}
                          type="checkbox"
                          value="1"
                        />
                        素材已齐
                      </label>
                      <button
                        className="h-11 rounded-md bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
                        onClick={() => setGenerated(true)}
                        type="submit"
                      >
                        {interaction.actionLabel}
                      </button>
                    </div>
                    <p className="mt-3 text-xs font-bold leading-5 text-slate-500">{interaction.helper}</p>
                    <p className="mt-2 rounded-md bg-indigo-50 px-3 py-2 text-xs font-black leading-5 text-indigo-800 ring-1 ring-indigo-100">
                      当前任务：{productName || '未命名商品'} / {platform} / {audienceGoal || '先完成一轮可发布内容'}
                    </p>
                  </form>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {config.cards.map((card, index) => (
                      <article className="group min-h-[156px] rounded-lg border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={card.label}>
                        <div className={`h-20 rounded-lg bg-gradient-to-br ${config.accent} opacity-95`}>
                          <div className="flex h-full items-end justify-between p-3">
                            <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-black text-slate-700">{String(index + 1).padStart(2, '0')}</span>
                            <span className="grid size-8 place-items-center rounded-full bg-white/90 text-sm font-black text-slate-950">+</span>
                          </div>
                        </div>
                        <h3 className="mt-3 break-words text-base font-black leading-6 text-slate-950">{card.label}</h3>
                        <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">{card.detail}</p>
                      </article>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white/92 p-4 text-left shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">能力操作台</p>
                        <h3 className="mt-1 text-base font-black text-slate-950">保留筷子式工具密度，不把能力收缩成单个按钮</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['筛选', '批量', '预览', '生成', '导出'].map(item => (
                          <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200" key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {workbenchModules.map((module, index) => (
                        <Link className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50" href={withTaskContext(module.href)} key={module.label}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-black text-indigo-600">0{index + 1}</p>
                              <h4 className="mt-1 text-sm font-black text-slate-950">{module.label}</h4>
                            </div>
                            <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">{module.state}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-600">{module.body}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-lg border p-4 text-left shadow-sm transition ${generated ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white/82'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">生成预览</p>
                      <span className={`rounded-md px-2 py-1 text-xs font-black ${generated ? 'bg-white text-emerald-700 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                        {generated ? '已生成' : '等待点击生成'}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-black text-slate-950">{generated ? interaction.previewTitle : '先填写商品，再点击生成'}</h3>
                    <div className="mt-3 grid gap-2">
                      {(generated ? interaction.previewItems : ['输入商品名', '选择发布平台', '确认素材是否齐全']).map(item => (
                        <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-black text-indigo-700">{generated ? interaction.nextInstruction : '这一步会告诉用户当前页面到底产出什么。'}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white/92 p-4 text-left shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">可交付结果</p>
                        <h3 className="mt-1 text-base font-black text-slate-950">{interaction.artifactTitle}</h3>
                      </div>
                      <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">
                        {generated ? '已按当前输入更新' : '点击生成后出现'}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {interaction.artifactSections.map(section => (
                        <div className="grid gap-2 rounded-md bg-slate-50 p-3 ring-1 ring-slate-100 sm:grid-cols-[92px_minmax(0,1fr)]" key={section.label}>
                          <p className="text-xs font-black text-slate-500">{section.label}</p>
                          <p className="break-words text-xs font-bold leading-5 text-slate-800">{generated ? section.value : '先填写上面的任务信息，再生成这一项。'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link className="flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white" href={generated ? withTaskContext(nextHref) : '#task-form'}>
                        {generated ? nextLabel : '先生成本页产出'}
                      </Link>
                      <Link className="flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-slate-700" href="/factory?variant=friend_trial">
                        回到总工作台
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white/90 p-4 text-left shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">当前工具</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">{config.toolName}</h3>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">{config.status}</span>
                  </div>
                  <div className="mt-4">
                    <WorkflowIllustration config={config} />
                  </div>
                  <div className="mt-4 rounded-md bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black text-slate-500">整条任务进度</p>
                      <p className="text-xs font-black text-indigo-700">{progressPercent}%</p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                      <div className={`h-full rounded-full bg-gradient-to-r ${config.accent}`} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="mt-3 grid gap-2">
                      {workflowNav.map((item, index) => {
                        const state = index < activeIndex ? '已完成' : index === activeIndex ? '当前步骤' : '下一步';
                        return (
                          <Link
                            className={`grid min-h-9 grid-cols-[26px_minmax(0,1fr)_64px] items-center gap-2 rounded-md px-2 text-xs font-black ${
                              item.id === active
                                ? 'bg-slate-950 text-white'
                                : index < activeIndex
                                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                                  : 'bg-white text-slate-600 ring-1 ring-slate-100'
                            }`}
                            href={withTaskContext(item.href)}
                            key={item.id}
                          >
                            <span className="grid size-6 place-items-center rounded bg-white/80 text-[10px] text-slate-700">{index + 1}</span>
                            <span className="min-w-0 truncate">{item.label}</span>
                            <span className="text-right text-[10px] opacity-80">{state}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-indigo-100 bg-indigo-50 p-3">
                    <p className="text-xs font-black text-indigo-700">本页怎么用</p>
                    <div className="mt-2 grid gap-2">
                      {interaction.stepChecklist.map((item, index) => (
                        <div className="flex gap-2 rounded bg-white px-2 py-1.5 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100" key={item}>
                          <span className="grid size-5 shrink-0 place-items-center rounded bg-indigo-600 text-[10px] font-black text-white">{index + 1}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link className="flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-black text-white" href={withTaskContext(config.primaryHref)}>
                      {config.primaryLabel}
                    </Link>
                    <Link className="flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-700" href="/factory?variant=friend_trial">
                      回工作台
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="hidden">
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
                <Link className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50" href={withTaskContext(item.href)} key={item.label}>
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

          <section className="hidden">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">最后一公里</p>
                <h2 className="mt-1 text-lg font-black leading-6 text-slate-950">每个子页面都保留同一个最后一公里边界</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Wenai 先做到可发布资产；平台发布和真实表现证据由客户回到工作台。</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">客户自发布，不虚构</span>
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
                    <Link className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white" href={withTaskContext(config.primaryHref)}>
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
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">系统能力</p>
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
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">交付物</p>
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
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">任务板</p>
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">下一步</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">下一步怎么走</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">子界面和主界面使用同一套导航与视觉语言，点击进去不会像进入另一个产品。</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {workflowNav.map(item => (
                  <Link key={item.id} href={withTaskContext(item.href)} className={`flex min-h-10 items-center justify-between rounded-md px-3 font-bold ${item.id === active ? 'bg-slate-950 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
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
