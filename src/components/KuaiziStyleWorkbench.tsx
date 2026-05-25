'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  buildDemoCommerceCloudDriveManifest,
  buildDemoCommerceCloudDriveReturnPlan,
  buildDemoCommerceChatCutRemixConsole,
  buildDemoCommerceCustomerReturnIntakeBoard,
  buildDemoCommerceCustomerDeliveryMap,
  buildDemoCommerceCustomerEvidenceUploadGuide,
  buildDemoCommerceCustomerLaunchReadinessBoard,
  buildDemoCommerceCustomerNextStepCommandCenter,
  buildDemoCommerceDailyOperatorCockpit,
  buildDemoCommerceEcommerceGrowthLoopConsole,
  buildDemoCommerceEvidenceReadinessBoard,
  buildDemoCommerceConversationOpsConsole,
  buildDemoCommerceSalesConversationBoard,
  buildDemoCommerceCustomerServicePack,
  buildDemoCommerceCustomerSupportWorkflow,
  buildDemoCommerceCreatorPersonaMatrix,
  buildDemoCommerceFirstDeliveryChecklist,
  buildDemoCommerceGitHubRemixRadar,
  buildDemoCommerceModelImageTaskPack,
  buildCommerceOpenSourceAdapters,
  buildDemoCommerceOpenSourceCoverage,
  buildDemoCommerceOpenSourceInstallMatrix,
  buildDemoCommerceOpenSourceLastMileBoard,
  buildDemoCommerceOpenSourceQueueConsole,
  buildDemoCommerceOpenSourceRemixBlueprint,
  buildDemoCommerceOpenSourceStackSelector,
  buildDemoCommercePersonaPublishingConsole,
  buildDemoCommerceProviderActivationRunbook,
  buildDemoCommerceProviderActivationPlan,
  buildDemoCommerceProviderEscalationBoard,
  buildDemoCommerceProviderNeedAssessment,
  buildDemoCommercePublishingMatrixPlan,
  buildDemoCommercePerformanceUploadReport,
  buildDemoCommercePostPublishActionBoard,
  buildDemoCommerceRemixDryRun,
  buildDemoCommerceRemixEnginePlan,
  buildDemoCommerceRemixExportPackage,
  buildDemoCommerceRemixExecutionRecipes,
  buildDemoCommerceRemixOrchestrationBoard,
  buildDemoCommerceRemixWorkflowPlaybook,
  buildDemoCommerceRemixQualityGate,
  buildDemoCommerceRemixTemplateBank,
  buildDemoCommerceRenderCapacityPlan,
  buildDemoCommerceRenderBatchPlan,
  buildDemoCommerceRenderOperationsRunbook,
  buildDemoCommerceRenderReliabilityBoard,
  buildDemoCommerceSelfPublishingCommandCenter,
  buildDemoCommerceSuperIpTitleBoard,
  buildDemoCommerceTitleQualityGate,
  buildDemoCommerceWorkbenchSystemMap,
} from '@/lib/commerce-remix-engine';

type FlowId = 'brief' | 'asset' | 'image' | 'video' | 'publish' | 'review';

type FlowStep = {
  id: FlowId;
  label: string;
  short: string;
  href: string;
  title: string;
  body: string;
  output: string;
  accent: string;
};

type Project = {
  title: string;
  category: string;
  status: string;
  next: string;
  href: string;
  accent: string;
};

const flowSteps: FlowStep[] = [
  {
    id: 'brief',
    label: '写卖点脚本',
    short: '卖点',
    href: '/factory/creative?variant=friend_trial',
    title: '把商品资料变成能拍、能发、能复用的脚本',
    body: '输入商品卖点、目标平台和受众，生成标题、口播、图文草稿和审核提醒。',
    output: '输出：标题 + 口播 + 图文脚本',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
  },
  {
    id: 'asset',
    label: '整理素材库',
    short: '素材',
    href: '/factory/create?variant=friend_trial',
    title: '把商品图、视频片段、授权说明整理成素材货架',
    body: '客户知道缺哪张图、哪个授权、哪个规格，运营知道下一步该补什么。',
    output: '输出：素材清单 + 缺口提示',
    accent: 'from-emerald-500 via-cyan-500 to-sky-500',
  },
  {
    id: 'image',
    label: '生成商品图',
    short: '图片',
    href: '/factory/create?variant=friend_trial',
    title: '用已有图片 API Key 生成主图、场景图、卖点图',
    body: '已有图片 Key 就直接接入生成；暂时没有 Key 时，先导出 prompt 和素材包。',
    output: '输出：商品图任务 + prompt 包',
    accent: 'from-amber-400 via-orange-400 to-pink-500',
  },
  {
    id: 'video',
    label: '合成短视频',
    short: '视频',
    href: '/factory/video?variant=friend_trial',
    title: '用视频 API / 开源混剪组件生成多版本短视频',
    body: '按脚本、商品图、片段、尺寸和平台节奏组装任务，可接 API，也可导出给本地混剪执行。',
    output: '输出：视频队列 + 分镜说明',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    id: 'publish',
    label: '发布与分发',
    short: '分发',
    href: '/factory/cast?variant=friend_trial',
    title: '生成平台发布包，让客户直接发或授权执行',
    body: '先把标题、正文、封面、素材、发布时间和回填字段准备好；需要代操作时只走客户授权范围内的辅助流程。',
    output: '输出：发布包 + 回填表',
    accent: 'from-sky-500 via-cyan-500 to-lime-400',
  },
  {
    id: 'review',
    label: '复盘下一轮',
    short: '复盘',
    href: '/factory/manage?variant=friend_trial',
    title: '把发布结果和客户反馈变成下一轮动作',
    body: '记录链接、截图、表现数据和客户反馈，判断继续放大、换角度，还是补素材。',
    output: '输出：复盘建议 + 下一步',
    accent: 'from-slate-700 via-blue-600 to-cyan-500',
  },
];

const serviceNav = [
  { label: '商品资料', href: '/factory/creative?variant=friend_trial' },
  { label: '图片生成', href: '/factory/create?variant=friend_trial' },
  { label: '模特生图', href: '/factory/create?variant=friend_trial' },
  { label: '视频混剪', href: '/factory/video?variant=friend_trial' },
  { label: '数字人口播', href: '/factory/video?variant=friend_trial' },
  { label: '发布包', href: '/factory/cast?variant=friend_trial' },
  { label: '客服素材', href: '/factory/manage?variant=friend_trial' },
  { label: '复盘跟进', href: '/factory/manage?variant=friend_trial' },
];

const projects: Project[] = [
  { title: '宠物口腔护理新品上新', category: '短视频', status: '脚本已生成', next: '补 3 张商品图', href: '/factory/video?variant=friend_trial', accent: 'from-rose-200 to-pink-100' },
  { title: '厨房收纳套装小红书种草', category: '图文', status: '素材已齐', next: '生成卖点图', href: '/factory/create?variant=friend_trial', accent: 'from-lime-200 to-emerald-100' },
  { title: '香薰礼盒 TikTok Shop 首发', category: '视频', status: '待合成', next: '确认封面', href: '/factory/video?variant=friend_trial', accent: 'from-orange-200 to-yellow-100' },
  { title: '美妆口播多语版本', category: '数字人', status: '可进入生成', next: '选择音色', href: '/factory/video?variant=friend_trial', accent: 'from-indigo-200 to-sky-100' },
  { title: '家居清洁产品 Meta 素材包', category: '广告', status: '待发布', next: '导出发布包', href: '/factory/cast?variant=friend_trial', accent: 'from-violet-200 to-fuchsia-100' },
  { title: '首轮内容表现复盘', category: '复盘', status: '待客户确认', next: '发下一轮建议', href: '/factory/manage?variant=friend_trial', accent: 'from-slate-200 to-blue-100' },
];

const capabilityRows = [
  ['图片生成', '接入已有图片 API Key，生成主图、场景图、卖点图', '可接入', '上传商品图'],
  ['模特生图', '用商品图和人群定位生成模特图、穿搭图、手持图', '等图片 Key', '确认模特风格'],
  ['视频生成', '接入已有视频 API Key，批量生成不同平台尺寸', '可接入', '确认分镜'],
  ['数字人/配音', '接入数字人或 TTS API，生成口播素材', '可接入', '选择人设和音色'],
  ['开源混剪', '用 Remotion + FFmpeg + 时间线组件把素材、字幕、封面拼成稳定任务', '可本地执行', '进入渲染队列'],
  ['账号分发', '先生成各平台标题、正文、标签、封面和发布清单；客户自行发布', '发布包优先', '导出平台包'],
  ['表现回流', '导入链接、截图、CSV 或手动数据，形成下一轮建议', '可用', '上传表现数据'],
  ['客服素材', '把商品卖点、常见问题、差评原因整理成客服话术和售后卡片', '可生成', '补充 FAQ'],
] as const;

const commerceAssistantRows = [
  ['商品上新', '标题、卖点、详情页结构、首批图文和短视频脚本。'],
  ['模特与场景', '模特生图、手持图、穿搭图、场景图、规格图、对比图。'],
  ['内容混剪', '短视频、数字人口播、多语配音、字幕、封面、BGM、批量尺寸。'],
  ['平台发布包', '小红书、TikTok、Shopify、Meta、视频号的标题、正文、标签和素材清单。'],
  ['客服与售后', 'FAQ、异议处理、差评解释、物流/尺码/材质话术、售后卡片。'],
  ['表现复盘', '客户上传链接、截图、CSV 后，生成下一轮角度、素材缺口和放大建议。'],
] as const;

const operatingSystemRows = [
  ['资料进来', '商品链接、主图、卖点、禁用词、参考账号', '形成 brief、素材缺口和风险提醒'],
  ['素材变资产', '商品图、模特图、场景图、细节图、口播稿', '进入图片任务、混剪时间线和客服素材'],
  ['内容成批量', '开源混剪、字幕、封面、BGM、尺寸适配', '输出可复核的渲染队列和 MP4 交付包'],
  ['发布不代登', '标题、正文、标签、账号人设、发布时间', '客户自己发布，Wenai 只交付发布包'],
  ['客服接住单', 'FAQ、异议、售后、差评挽回、人工转接', '让内容流量能被客服和售后承接'],
  ['数据回下一轮', '链接、截图、CSV、云盘目录、客户备注', '生成下一轮标题、素材缺口和重剪建议'],
] as const;

const publishingRows = [
  ['小红书', '标题 3 版、正文 2 版、标签、封面、首评引导。'],
  ['TikTok', '3 秒钩子、口播脚本、字幕、封面、Shop CTA。'],
  ['Shopify', '商品标题、五点卖点、详情页模块、FAQ。'],
  ['Meta', '广告主文案、标题、描述、素材尺寸清单。'],
  ['视频号', '口播标题、短正文、评论区引导、私域承接话术。'],
] as const;

function MiniIllustration({ step, large = false }: { step: FlowStep; large?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${step.accent} ${large ? 'min-h-[260px] p-6' : 'h-24 p-3'}`}>
      <div className="absolute -right-8 -top-8 size-36 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute -bottom-10 left-8 size-32 rounded-full bg-slate-950/18 blur-2xl" />
      <div className="relative grid h-full grid-cols-[1fr_0.7fr] gap-3">
        <div className="flex min-w-0 flex-col justify-between rounded-lg bg-white/86 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2">
            <span className="block h-2 w-4/5 rounded-full bg-slate-900/80" />
            <span className="block h-2 w-3/5 rounded-full bg-slate-400/70" />
            {large ? <span className="block h-2 w-2/5 rounded-full bg-slate-300/80" /> : null}
          </div>
          {large ? (
            <div className="grid grid-cols-3 gap-2">
              <span className="h-7 rounded-md bg-indigo-500/15" />
              <span className="h-7 rounded-md bg-pink-500/15" />
              <span className="h-7 rounded-md bg-cyan-500/15" />
            </div>
          ) : null}
        </div>
        <div className="relative min-w-0 rounded-lg bg-white/60 p-2">
          <div className={`absolute bottom-3 left-3 rounded-full bg-white/80 ${large ? 'size-20' : 'size-12'}`} />
          <div className={`absolute bottom-7 right-5 rounded-md bg-slate-950/70 ${large ? 'h-24 w-10' : 'h-12 w-6'}`} />
          <div className={`absolute right-3 top-3 rounded-lg bg-white/55 ${large ? 'size-16' : 'size-10'}`} />
        </div>
      </div>
    </div>
  );
}

function IconMark({ children }: { children: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-black text-slate-500 shadow-sm ring-1 ring-slate-200">
      {children}
    </span>
  );
}

export function KuaiziStyleWorkbench() {
  const [selectedId, setSelectedId] = useState<FlowId>('brief');
  const [query, setQuery] = useState('');
  const selectedStep = flowSteps.find(step => step.id === selectedId) ?? flowSteps[0];
  const filteredProjects = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter(project => `${project.title} ${project.category} ${project.status} ${project.next}`.toLowerCase().includes(value));
  }, [query]);
  const remixPlan = useMemo(() => buildDemoCommerceRemixEnginePlan(), []);
  const remixPackage = useMemo(() => buildDemoCommerceRemixExportPackage(), []);
  const dryRun = useMemo(() => buildDemoCommerceRemixDryRun(), []);
  const batchPlan = useMemo(() => buildDemoCommerceRenderBatchPlan(), []);
  const cloudDrive = useMemo(() => buildDemoCommerceCloudDriveManifest(), []);
  const performanceReport = useMemo(() => buildDemoCommercePerformanceUploadReport(), []);
  const templateBank = useMemo(() => buildDemoCommerceRemixTemplateBank(), []);
  const qualityGate = useMemo(() => buildDemoCommerceRemixQualityGate(), []);
  const customerDeliveryMap = useMemo(() => buildDemoCommerceCustomerDeliveryMap(), []);
  const servicePack = useMemo(() => buildDemoCommerceCustomerServicePack(), []);
  const modelImageTaskPack = useMemo(() => buildDemoCommerceModelImageTaskPack(), []);
  const customerSupportWorkflow = useMemo(() => buildDemoCommerceCustomerSupportWorkflow(), []);
  const ecommerceGrowthLoopConsole = useMemo(() => buildDemoCommerceEcommerceGrowthLoopConsole(), []);
  const salesConversationBoard = useMemo(() => buildDemoCommerceSalesConversationBoard(), []);
  const conversationOpsConsole = useMemo(() => buildDemoCommerceConversationOpsConsole(), []);
  const workbenchSystemMap = useMemo(() => buildDemoCommerceWorkbenchSystemMap(), []);
  const dailyOperatorCockpit = useMemo(() => buildDemoCommerceDailyOperatorCockpit(), []);
  const customerNextStepCommandCenter = useMemo(() => buildDemoCommerceCustomerNextStepCommandCenter(), []);
  const providerActivationPlan = useMemo(() => buildDemoCommerceProviderActivationPlan(), []);
  const providerActivationRunbook = useMemo(() => buildDemoCommerceProviderActivationRunbook(), []);
  const providerNeedAssessment = useMemo(() => buildDemoCommerceProviderNeedAssessment(), []);
  const providerEscalationBoard = useMemo(() => buildDemoCommerceProviderEscalationBoard(), []);
  const firstDeliveryChecklist = useMemo(() => buildDemoCommerceFirstDeliveryChecklist(), []);
  const customerLaunchReadinessBoard = useMemo(() => buildDemoCommerceCustomerLaunchReadinessBoard(), []);
  const openSourceAdapters = useMemo(() => buildCommerceOpenSourceAdapters(), []);
  const openSourceCoverage = useMemo(() => buildDemoCommerceOpenSourceCoverage(), []);
  const openSourceStackSelector = useMemo(() => buildDemoCommerceOpenSourceStackSelector(), []);
  const openSourceInstallMatrix = useMemo(() => buildDemoCommerceOpenSourceInstallMatrix(), []);
  const openSourceRemixBlueprint = useMemo(() => buildDemoCommerceOpenSourceRemixBlueprint(), []);
  const githubRemixRadar = useMemo(() => buildDemoCommerceGitHubRemixRadar(), []);
  const openSourceQueueConsole = useMemo(() => buildDemoCommerceOpenSourceQueueConsole(), []);
  const openSourceLastMileBoard = useMemo(() => buildDemoCommerceOpenSourceLastMileBoard(), []);
  const chatCutRemixConsole = useMemo(() => buildDemoCommerceChatCutRemixConsole(), []);
  const executionRecipes = useMemo(() => buildDemoCommerceRemixExecutionRecipes(), []);
  const orchestrationBoard = useMemo(() => buildDemoCommerceRemixOrchestrationBoard(), []);
  const workflowPlaybook = useMemo(() => buildDemoCommerceRemixWorkflowPlaybook(), []);
  const publishingMatrix = useMemo(() => buildDemoCommercePublishingMatrixPlan(), []);
  const creatorPersonaMatrix = useMemo(() => buildDemoCommerceCreatorPersonaMatrix(), []);
  const superIpTitleBoard = useMemo(() => buildDemoCommerceSuperIpTitleBoard(), []);
  const titleQualityGate = useMemo(() => buildDemoCommerceTitleQualityGate(), []);
  const selfPublishingCommandCenter = useMemo(() => buildDemoCommerceSelfPublishingCommandCenter(), []);
  const personaPublishingConsole = useMemo(() => buildDemoCommercePersonaPublishingConsole(), []);
  const renderCapacity = useMemo(() => buildDemoCommerceRenderCapacityPlan(), []);
  const renderReliabilityBoard = useMemo(() => buildDemoCommerceRenderReliabilityBoard(), []);
  const renderOperationsRunbook = useMemo(() => buildDemoCommerceRenderOperationsRunbook(), []);
  const cloudReturnPlan = useMemo(() => buildDemoCommerceCloudDriveReturnPlan(), []);
  const customerReturnIntakeBoard = useMemo(() => buildDemoCommerceCustomerReturnIntakeBoard(), []);
  const evidenceReadinessBoard = useMemo(() => buildDemoCommerceEvidenceReadinessBoard(), []);
  const customerEvidenceUploadGuide = useMemo(() => buildDemoCommerceCustomerEvidenceUploadGuide(), []);
  const postPublishActionBoard = useMemo(() => buildDemoCommercePostPublishActionBoard(), []);
  const queueSummary = useMemo(() => {
    const statuses = ['needs_material', 'ready', 'rendering', 'exported'] as const;
    return statuses.map(status => ({
      status,
      count: remixPlan.queue.filter(item => item.status === status).length,
      label: status === 'needs_material' ? '待补素材' : status === 'ready' ? '可渲染' : status === 'rendering' ? '渲染中' : '已导出',
    }));
  }, [remixPlan]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f9ff] text-slate-950">
      <div className="flex min-h-screen min-w-0 overflow-x-hidden">
        <aside className="hidden w-[224px] shrink-0 flex-col border-r border-[#dbe4f3] bg-[#eef4ff] xl:flex">
          <div className="px-5 pb-5 pt-7">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-[#5a55ff] via-[#d92dfb] to-[#23d7ff] text-sm font-black text-white">W</div>
              <div className="min-w-0">
                <div className="truncate text-[22px] font-black tracking-tight">wenai</div>
                <div className="inline-flex rounded bg-[#6758ff] px-1.5 py-0.5 text-[10px] font-black text-white">电商增长工作台</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 pb-4">
            <Link href="/factory?variant=friend_trial" className="mb-5 flex items-center gap-3 rounded-md bg-[#dfe7f8] px-3 py-2.5 text-sm font-black text-[#17223d]">
              <IconMark>01</IconMark>
              <span className="truncate">工作台总览</span>
            </Link>

            <div className="px-3 pb-2 text-xs font-bold text-slate-400">商品内容流程</div>
            <div className="space-y-1">
              {flowSteps.slice(0, 5).map((item, index) => (
                <Link className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-white/75 hover:text-slate-950" href={item.href} key={item.id}>
                  <IconMark>{String(index + 2).padStart(2, '0')}</IconMark>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="px-3 pb-2 pt-5 text-xs font-bold text-slate-400">可交付能力</div>
            <div className="space-y-1">
              {serviceNav.map((item, index) => (
                <Link className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-white/75 hover:text-slate-950" href={item.href} key={`${item.label}-${item.href}`}>
                  <IconMark>{String(index + 1)}</IconMark>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="shrink-0 border-b border-[#dbe4f3] bg-white/95 px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight md:text-xl">Wenai 商品增长工作台</h1>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">API Key 可接入</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">可先交付发布包</span>
                </div>
                <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                  客户按“商品资料 - 卖点脚本 - 图片/视频/数字人 - 发布包 - 表现复盘”的顺序操作；能自动生成的直接接 API，最后发布可由客户自己完成，也可在授权后辅助执行。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600" type="button">搜索工具 Ctrl K</button>
                <Link className="min-h-10 rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 py-2.5 text-sm font-black text-white shadow-sm" href={selectedStep.href}>
                  开始：{selectedStep.label}
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 md:px-6">
            <div className="mx-auto max-w-[1560px] space-y-5 pb-16">
              <section className="overflow-hidden rounded-lg border border-[#dbe6ff] bg-white shadow-sm">
                <div className="relative bg-[radial-gradient(circle_at_18%_0%,#ddf7ff_0,transparent_24%),radial-gradient(circle_at_70%_0%,#ffe3f3_0,transparent_30%),linear-gradient(135deg,#fbfdff_0%,#f5f8ff_48%,#ffffff_100%)] px-5 py-9">
                  <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
                    <div className="min-w-0 text-center lg:text-left">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Product Content Factory</p>
                      <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#15213f] md:text-5xl">从一个商品，生成一整套可发布内容</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 lg:text-base">
                        不让客户看一堆抽象模块。客户只要按步骤填商品资料、选卖点、生成图片和视频、导出发布包，再把发布结果回填，平台就能给出下一轮建议。
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                        {['商品图', '模特生图', '短视频', '数字人口播', '客服话术', '发布包', '复盘建议'].map(item => (
                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-200" key={item}>{item}</span>
                        ))}
                      </div>
                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {customerNextStepCommandCenter.commandCards.map(card => (
                          <Link className="min-w-0 rounded-md border border-white/80 bg-white/88 p-3 text-left shadow-sm transition hover:bg-white" href={card.href} key={card.id}>
                            <div className="flex items-center gap-2">
                              <span className="grid size-6 shrink-0 place-items-center rounded bg-[#14213d] text-[11px] font-black text-white">
                                {card.label.slice(0, 1)}
                              </span>
                              <h3 className="min-w-0 truncate text-xs font-black text-slate-950">{card.label.replace(/^\d+\.\s*/, '')}</h3>
                            </div>
                            <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-600">{card.customerDoes}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mx-auto w-full max-w-[520px]">
                      <MiniIllustration step={selectedStep} large />
                    </div>
                  </div>

                  <div className="mx-auto mt-6 grid max-w-6xl grid-cols-3 gap-2 sm:grid-cols-3 lg:gap-3 2xl:grid-cols-6">
                    {flowSteps.map(step => (
                      <button
                        className={`group relative min-h-[96px] rounded-lg border bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[128px] sm:p-3 lg:min-h-[184px] ${selectedStep.id === step.id ? 'border-[#6b5cff] ring-2 ring-[#6b5cff]/15' : 'border-slate-200'}`}
                        key={step.id}
                        onClick={() => setSelectedId(step.id)}
                        type="button"
                      >
                        <div className="hidden lg:block">
                          <MiniIllustration step={step} />
                        </div>
                        <div className="break-words text-xs font-black leading-4 text-slate-900 sm:text-sm sm:leading-5 lg:mt-3">{step.label}</div>
                        <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:line-clamp-2 sm:block lg:line-clamp-3">{step.body}</p>
                        <p className="mt-2 hidden text-xs font-black text-indigo-600 sm:line-clamp-1 sm:block lg:line-clamp-2">{step.output}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#cfe8ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Remix To Publish Control</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">开源混剪、口播标题、客户自发布，先合成一条稳定流水线</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                      图片、视频、数字人和 TTS 等 Key 到位后增强生成层；首版先把 GitHub 开源混剪范式、账号人设标题、发布包和云盘回传证据接成可交付闭环，客户不用理解仓库名，也不用交出账号密码。
                    </p>
                  </div>
                  <Link className="inline-flex min-h-11 w-fit shrink-0 items-center rounded-md bg-cyan-700 px-4 py-2 text-sm font-black text-white shadow-sm" href="/factory/video?variant=friend_trial">
                    进入混剪队列
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 xl:grid-cols-3">
                  <article className="min-w-0 rounded-md border border-cyan-100 bg-cyan-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-black leading-5 text-slate-950">今天就能稳定混剪</h4>
                      <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-cyan-700 ring-1 ring-cyan-100">{chatCutRemixConsole.cutFlow.length} 步</span>
                    </div>
                    <p className="mt-2 text-xs font-bold leading-5 text-cyan-800">{chatCutRemixConsole.promise}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {chatCutRemixConsole.cutFlow.slice(0, 4).map(step => (
                        <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-cyan-100" key={step.id}>
                          <div className="font-black leading-5 text-slate-950">{step.label}</div>
                          <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-600">{step.output}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="min-w-0 rounded-md border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-black leading-5 text-slate-950">多账号标题和口播不做代登</h4>
                      <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-indigo-700 ring-1 ring-indigo-100">{personaPublishingConsole.rows.length} 槽</span>
                    </div>
                    <p className="mt-2 text-xs font-bold leading-5 text-indigo-800">{personaPublishingConsole.promise}</p>
                    <div className="mt-3 grid gap-2">
                      {personaPublishingConsole.rows.slice(0, 3).map(row => (
                        <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-indigo-100" key={row.id}>
                          <div className="font-black leading-5 text-slate-950">{row.platformLabel} · {row.accountType}</div>
                          <p className="mt-1 line-clamp-1 font-bold leading-5 text-indigo-700">{row.title}</p>
                          <p className="mt-1 line-clamp-1 text-slate-500">客户动作：{row.customerCopyAction}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="min-w-0 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-black leading-5 text-slate-950">发布后用证据驱动下一轮</h4>
                      <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">云盘回传</span>
                    </div>
                    <p className="mt-2 text-xs font-bold leading-5 text-emerald-800">{selfPublishingCommandCenter.promise}</p>
                    <div className="mt-3 grid gap-2">
                      {selfPublishingCommandCenter.evidenceInbox.slice(0, 3).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-emerald-100" key={item.label}>
                          <div className="font-black leading-5 text-slate-950">{item.label}</div>
                          <p className="mt-1 line-clamp-1 font-bold leading-5 text-emerald-700">{item.accepted}</p>
                          <p className="mt-1 line-clamp-2 text-slate-500">{item.why}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </section>

              <section className="rounded-lg border border-[#d8dcff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Platform Title Matrix</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">每个平台都有账号人设、标题、前三句口播和证明素材</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                      多账号矩阵不是代登代发；Wenai 先把小红书、TikTok、视频号等发布槽拆成真实买家号、测评种草号、店铺官方号，客户复制标题和口播，自行发布后回填链接、截图或 CSV。
                    </p>
                  </div>
                  <span className="w-fit rounded bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700 ring-1 ring-indigo-100">
                    {personaPublishingConsole.rows.length} 个发布槽
                  </span>
                </div>
                <div className="mt-4 grid gap-3 xl:grid-cols-4">
                  {personaPublishingConsole.rows.slice(0, 4).map(row => (
                    <article className="min-w-0 rounded-md border border-indigo-100 bg-indigo-50 p-4" key={row.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">{row.platformLabel}</p>
                          <h4 className="mt-1 text-sm font-black leading-5 text-slate-950">{row.accountType}</h4>
                        </div>
                        <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-indigo-700 ring-1 ring-indigo-100">{row.titleFamily}</span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm font-black leading-5 text-indigo-900">{row.title}</p>
                      <div className="mt-3 grid gap-2">
                        {row.firstThreeVoiceoverLines.slice(0, 3).map((line, index) => (
                          <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100" key={`${row.id}-${line}`}>
                            {index + 1}. {line}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 line-clamp-2 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-600 ring-1 ring-indigo-100">证明素材：{row.requiredProofAsset}</p>
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-indigo-700">客户动作：{row.customerCopyAction}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[#dbe6ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Customer Next Step</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">{customerNextStepCommandCenter.headline}</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">{customerNextStepCommandCenter.promise}</p>
                  </div>
                  <Link className="inline-flex min-h-11 w-fit shrink-0 items-center rounded-md bg-[#14213d] px-4 py-2 text-sm font-black text-white shadow-sm" href={customerNextStepCommandCenter.primaryAction.href}>
                    {customerNextStepCommandCenter.primaryAction.label}
                  </Link>
                </div>
                <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-blue-800">
                  {customerNextStepCommandCenter.primaryAction.reason}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {customerNextStepCommandCenter.providerReadinessCards.map(card => (
                    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={card.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">Provider Readiness</p>
                        <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-slate-800 ring-1 ring-slate-200">{card.status}</span>
                      </div>
                      <h4 className="mt-2 text-sm font-black leading-5 text-slate-950">{card.label}</h4>
                      <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{card.customerMessage}</p>
                      <p className="mt-3 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-500 ring-1 ring-slate-100">{card.operatorRule}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 xl:grid-cols-4">
                  {customerNextStepCommandCenter.commandCards.map(card => (
                    <Link className="min-w-0 rounded-md border border-blue-100 bg-blue-50 p-4 transition hover:bg-white" href={card.href} key={card.id}>
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">{card.id}</div>
                      <h4 className="mt-1 text-sm font-black leading-5 text-slate-950">{card.label}</h4>
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-blue-700">{card.customerSees}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">Wenai：{card.wenaiDelivers}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">客户：{card.customerDoes}</p>
                      <p className="mt-3 line-clamp-2 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-emerald-700 ring-1 ring-blue-100">回传：{card.proofToReturn}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">客户能看到的边界</h4>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {customerNextStepCommandCenter.visibleBoundaries.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">客户不用理解</h4>
                    <div className="mt-3 grid gap-2">
                      {customerNextStepCommandCenter.noNeedToUnderstand.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#d9e8ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Today Render Queue</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">今天队列能不能稳定出片，客户一眼看懂</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                      混剪不只是一键生成视频；Wenai 把每条成片拆成素材预检、模板时间线、批量渲染、单条重试和发布包回填，失败不会拖垮整批。
                    </p>
                  </div>
                  <Link className="inline-flex min-h-11 w-fit shrink-0 items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-black text-white shadow-sm" href="/factory/video?variant=friend_trial">
                    查看视频队列
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {queueSummary.map(item => (
                    <article className="min-w-0 rounded-md border border-sky-100 bg-sky-50 p-4" key={item.status}>
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-sky-700">{item.status}</div>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <h4 className="text-sm font-black leading-5 text-slate-950">{item.label}</h4>
                        <span className="text-2xl font-black leading-none text-sky-700">{item.count}</span>
                      </div>
                      <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                        {item.status === 'needs_material' ? '先补素材或授权，不进入渲染并发。' : item.status === 'ready' ? '可进入本地/开源渲染批次。' : item.status === 'rendering' ? '正在执行，记录 batch、attempt 和输出路径。' : '已进入发布包，等待客户自发布回填。'}
                      </p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">失败隔离</h4>
                    <div className="mt-3 grid gap-2">
                      {renderCapacity.failureIsolation.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-emerald-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">批次容量</h4>
                    <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-indigo-800 ring-1 ring-indigo-100">
                      当前拆成 {batchPlan.batches.length} 个批次，建议并发 {renderCapacity.recommendedConcurrency}，预估每小时 {renderCapacity.estimatedOutputsPerHour} 条输出。
                    </p>
                    <div className="mt-3 grid gap-2">
                      {renderReliabilityBoard.batchControls.slice(0, 2).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">什么时候再升级</h4>
                    <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-amber-800 ring-1 ring-amber-100">{renderReliabilityBoard.scaleDecision.currentMode}</p>
                    <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100">{renderReliabilityBoard.scaleDecision.whenToScale[0]}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-sky-100 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Scale Runbook</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">大规模渲染不靠一把梭，按三层队列逐步升级</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{renderOperationsRunbook.operatingMode}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                      {renderOperationsRunbook.batchSteps.length} 个运行步骤
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(260px,0.7fr)]">
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">客户只看四种状态</h5>
                      <div className="mt-3 grid gap-2">
                        {renderReliabilityBoard.customerVisibleStatuses.map(item => (
                          <div className="rounded bg-sky-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">运营按步骤跑批次</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {renderOperationsRunbook.batchSteps.slice(0, 4).map(step => (
                          <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-slate-200" key={step.id}>
                            <div className="font-black leading-5 text-slate-950">{step.title}</div>
                            <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-600">{step.proof}</p>
                            <p className="mt-1 line-clamp-2 text-slate-500">{step.failureFallback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">扩容路径</h5>
                      <div className="mt-3 grid gap-2">
                        {renderCapacity.scalePath.map(item => (
                          <div className="rounded bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#fde68a] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Self Publish Evidence Inbox</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">客户自己发布，我们用证据把下一轮做准</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                      首版不接管账号、不自动登录、不读后台。客户只要把发布链接、截图、CSV 或云盘目录交回来，Wenai 就能判断下一轮该改标题、改封面、重剪视频还是补客服话术。
                    </p>
                  </div>
                  <Link className="inline-flex min-h-11 w-fit shrink-0 items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-black text-white shadow-sm" href="/factory/manage?variant=friend_trial">
                    查看回填复盘
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {customerEvidenceUploadGuide.acceptedEvidence.map(item => (
                    <article className="min-w-0 rounded-md border border-amber-100 bg-amber-50 p-4" key={item.label}>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-black leading-5 text-slate-950">{item.label}</h4>
                        <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-amber-700 ring-1 ring-amber-100">{item.formats[0]}</span>
                      </div>
                      <p className="mt-2 text-xs font-bold leading-5 text-amber-800">{item.proves}</p>
                      <p className="mt-3 line-clamp-2 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600 ring-1 ring-amber-100">{item.destination}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 rounded-md border border-amber-100 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Return Upload Path</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">客户回传只走一个云盘目录，缺 API 也能复盘</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                        默认把发布证据放进 {cloudDrive.rootDir}/04-customer-return；后续有企业云盘、对象存储或 analytics API 时，只替换同步层，不改变客户回传习惯。
                      </p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">
                      {cloudReturnPlan.intakeFields.length} 类证据
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(260px,0.75fr)]">
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">客户上传步骤</h5>
                      <div className="mt-3 grid gap-2">
                        {customerEvidenceUploadGuide.uploadSteps.map((step, index) => (
                          <div className="rounded bg-amber-50 px-3 py-2 text-xs ring-1 ring-amber-100" key={step.title}>
                            <div className="font-black leading-5 text-amber-900">{index + 1}. {step.title}</div>
                            <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-600">{step.customerAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">云盘目录规则</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {cloudReturnPlan.folderRules.map(item => (
                          <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-200" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">上传后产出</h5>
                      <div className="mt-3 grid gap-2">
                        {cloudReturnPlan.nextRoundOutputs.slice(0, 5).map(item => (
                          <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-900" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.54fr)]">
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">回填后系统立刻判断</h4>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {customerEvidenceUploadGuide.nextRoundMapping.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-emerald-100" key={item.evidence}>
                          <div className="line-clamp-1 font-black text-slate-900">{item.evidence}</div>
                          <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-600">{item.nextWenaiAction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">不向客户索要</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customerEvidenceUploadGuide.doNotAskCustomerFor.map(item => (
                        <span className="rounded bg-white px-2.5 py-1 text-xs font-black leading-5 text-rose-700 ring-1 ring-rose-100" key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#f9d3c7] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600">Proof Assets & Support</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">模特图、证明图和客服话术要接在一起</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                      图片 Key 没到位时先交付模特图 prompt、参考图要求和验收清单；客户咨询、评论和售后问题同步变成 FAQ、异议处理和下一轮短视频脚本。
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link className="inline-flex min-h-10 items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-black text-white shadow-sm" href="/factory/create?variant=friend_trial">
                      看图片任务
                    </Link>
                    <Link className="inline-flex min-h-10 items-center rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700" href="/factory/manage?variant=friend_trial">
                      看客服承接
                    </Link>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.52fr)]">
                  <div className="rounded-md border border-orange-100 bg-orange-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">先把证明素材排成任务包</h4>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {modelImageTaskPack.tasks.slice(0, 3).map(task => (
                        <article className="min-w-0 rounded bg-white p-3 ring-1 ring-orange-100" key={task.title}>
                          <h5 className="text-sm font-black leading-5 text-slate-950">{task.title}</h5>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-orange-700">{task.fallbackWithoutKey}</p>
                          <p className="mt-2 line-clamp-2 rounded bg-orange-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{task.requiredInputs.slice(0, 2).join(' / ')}</p>
                        </article>
                      ))}
                    </div>
                    <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-orange-800 ring-1 ring-orange-100">{modelImageTaskPack.providerBoundary}</p>
                  </div>
                  <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">客服把内容流量接住</h4>
                    <div className="mt-3 grid gap-2">
                      {customerSupportWorkflow.preSaleReplies.slice(0, 3).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs ring-1 ring-rose-100" key={item.scenario}>
                          <div className="font-black text-slate-900">{item.scenario}</div>
                          <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-600">{item.assetToSend}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100">{customerSupportWorkflow.humanHandoffRules[0]}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#dbe6ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black tracking-[0.18em] text-emerald-600">首版交付清单</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">不等 Key，也能先给客户一套可发布资产</h3>
                    <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">{firstDeliveryChecklist.promise}</p>
                  </div>
                  <span className="w-fit rounded-md bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">{firstDeliveryChecklist.acceptanceChecklist.length} 条验收项</span>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-4">
                  <article className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">客户先给</h4>
                    <div className="mt-3 space-y-2">
                      {firstDeliveryChecklist.customerInputs.slice(0, 5).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-emerald-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-blue-100 bg-blue-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">Wenai 交付</h4>
                    <div className="mt-3 space-y-2">
                      {firstDeliveryChecklist.wenaiOutputs.slice(0, 5).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-blue-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-violet-100 bg-violet-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">首版不用等</h4>
                    <div className="mt-3 space-y-2">
                      {firstDeliveryChecklist.noWaitItems.slice(0, 5).map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-violet-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-amber-100 bg-amber-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">验收和下一轮</h4>
                    <div className="mt-3 space-y-2">
                      {firstDeliveryChecklist.nextRoundTrigger.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </article>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  {firstDeliveryChecklist.acceptanceChecklist.slice(0, 6).map(item => (
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                  ))}
                </div>
                <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Customer Launch Readiness</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{customerLaunchReadinessBoard.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{customerLaunchReadinessBoard.customerPromise}</p>
                    </div>
                    <span className={`w-fit rounded bg-white px-2.5 py-1 text-xs font-black ring-1 ${customerLaunchReadinessBoard.verdict === 'ready_for_customer_trial' ? 'text-emerald-700 ring-emerald-100' : 'text-amber-700 ring-amber-100'}`}>
                      验收分 {customerLaunchReadinessBoard.score}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-4">
                    {customerLaunchReadinessBoard.lanes.map(lane => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100" key={lane.id}>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-black leading-5 text-slate-950">{lane.label}</h5>
                          <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-black ${lane.state === 'ready' ? 'bg-emerald-50 text-emerald-700' : lane.state === 'waiting_for_key' ? 'bg-blue-50 text-blue-700' : lane.state === 'scale_later' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                            {lane.state === 'ready' ? '已就绪' : lane.state === 'waiting_for_key' ? '等 Key' : lane.state === 'scale_later' ? '后续扩容' : '客户动作'}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold leading-5 text-emerald-700">{lane.customerSees}</p>
                        <p className="mt-2 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{lane.proof}</p>
                        <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-500">下一步：{lane.doNext}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">满足这些才给客户上线</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {customerLaunchReadinessBoard.launchOnlyWhen.map(item => (
                          <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">不能对客户承诺</h5>
                      <div className="mt-3 grid gap-2">
                        {customerLaunchReadinessBoard.mustNotPromise.map(item => (
                          <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#dbe6ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black tracking-[0.18em] text-indigo-600">电商增长闭环</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">功能很多，但客户只看到一条商品增长流水线</h3>
                    <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
                      Wenai 把商品资料、图片任务、开源混剪、发布包、客服话术和表现回填串成同一套交付链路；图片、视频、数字人 Key 到位后增强，不影响首版先交付。
                    </p>
                  </div>
                  <span className="w-fit rounded-md bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700">{workbenchSystemMap.lanes.length} 条工作流 / {operatingSystemRows.length} 个旧版节点已收拢</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {workbenchSystemMap.primaryRoute.map((item, index) => (
                    <div className="flex items-center gap-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800" key={item}>
                      <span className="grid size-5 place-items-center rounded bg-white text-[10px] ring-1 ring-indigo-100">{index + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  {workbenchSystemMap.lanes.map((lane, index) => (
                    <Link className="min-w-0 rounded-md border border-indigo-100 bg-indigo-50 p-4 transition hover:bg-white" href={lane.routeHref} key={lane.id}>
                      <div className="flex items-start gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-xs font-black text-indigo-700 ring-1 ring-indigo-100">{index + 1}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black leading-5 text-slate-950">{lane.title}</h4>
                          <p className="mt-1 text-xs font-bold leading-5 text-indigo-700">{lane.customerQuestion}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <p className="rounded bg-white p-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100">输出：{lane.wenaiOutput.slice(0, 3).join(' / ')}</p>
                        <p className="rounded bg-white p-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100">客户：{lane.customerAction}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {lane.proofToCollect.slice(0, 3).map(item => (
                          <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-indigo-700 ring-1 ring-indigo-100" key={item}>{item}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {workbenchSystemMap.dailyOperatingRules.map(rule => (
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600" key={rule}>{rule}</div>
                  ))}
                </div>
                <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Daily Operator Cockpit</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{dailyOperatorCockpit.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{dailyOperatorCockpit.promise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">{dailyOperatorCockpit.todayFocus.length} 个今日动作</span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-3">
                    {dailyOperatorCockpit.todayFocus.map(item => (
                      <Link className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100 transition hover:bg-emerald-50" href={item.nextHref} key={item.id}>
                        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-emerald-700">{item.id}</div>
                        <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{item.label}</h5>
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-emerald-700">{item.customerNeed}</p>
                        <div className="mt-3 grid gap-2">
                          <p className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700">Wenai：{item.wenaiDoes}</p>
                          <p className="rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700">客户：{item.customerDoes}</p>
                          <p className="truncate rounded bg-white px-3 py-2 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">证据：{item.visibleProof}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">客户今天只看这些命令</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {dailyOperatorCockpit.commandStrip.map(item => (
                          <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">客户不用管</h5>
                      <div className="mt-3 grid gap-2">
                        {dailyOperatorCockpit.customerCanIgnore.map(item => (
                          <div className="rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#dbe6ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">交付导航</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">{customerDeliveryMap.headline}</h3>
                    <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">{customerDeliveryMap.oneLinePromise}</p>
                  </div>
                  <span className="rounded-md bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">{customerDeliveryMap.phases.length} 个交付节点</span>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
                  {customerDeliveryMap.phases.map((phase, index) => (
                    <Link className="min-w-0 rounded-md border border-blue-100 bg-blue-50 p-3 transition hover:bg-white" href={phase.nextHref} key={phase.id}>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-black leading-5 text-slate-950">{phase.label}</h4>
                        <span className="grid size-6 shrink-0 place-items-center rounded bg-white text-[11px] font-black text-blue-700 ring-1 ring-blue-100">{index + 1}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-blue-700">客户：{phase.customerAction}</p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">交付：{phase.wenaiOutput.join(' / ')}</p>
                      <p className="mt-3 rounded bg-white p-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-blue-100">{phase.acceptanceGate}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {customerDeliveryMap.handoffRules.map(rule => (
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600" key={rule}>{rule}</div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[#d8e4ff] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">接入计划</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">现在能交付，Key 到位后增强</h3>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{providerActivationPlan.currentMode}</p>
                  </div>
                  <span className="w-fit rounded-md bg-violet-50 px-3 py-2 text-sm font-black text-violet-700">{providerActivationPlan.lanes.length} 条增强通道</span>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-5">
                  {providerActivationPlan.lanes.map(lane => (
                    <article className="min-w-0 rounded-md border border-violet-100 bg-violet-50 p-3" key={lane.id}>
                      <h4 className="text-sm font-black leading-5 text-slate-950">{lane.name}</h4>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{lane.customerFacingWording}</p>
                      <p className="mt-3 rounded bg-white p-2 text-xs font-bold leading-5 text-violet-700 ring-1 ring-violet-100">{lane.fallbackUntilActivated}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-5 rounded-md border border-indigo-100 bg-indigo-50 p-4">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Activation Runbook</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{providerActivationRunbook.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{providerActivationRunbook.customerPromise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">
                      {providerActivationRunbook.steps.length} 个接入步骤
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {providerActivationRunbook.steps.slice(0, 3).map(step => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-indigo-100" key={step.id}>
                        <h5 className="text-sm font-black leading-5 text-slate-950">{step.label}</h5>
                        <p className="mt-2 text-xs font-bold leading-5 text-indigo-700">客户给：{step.customerInput.slice(0, 3).join(' / ')}</p>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">Wenai 做：{step.wenaiAction.join('；')}</p>
                        <p className="mt-3 rounded bg-indigo-50 p-2 text-xs font-bold leading-5 text-slate-700">{step.fallbackIfFailed}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md bg-white p-3 ring-1 ring-indigo-100">
                      <h5 className="text-sm font-black text-slate-950">验收证据</h5>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {providerActivationRunbook.doneDefinition.map(item => (
                          <div className="rounded bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-indigo-100">
                      <h5 className="text-sm font-black text-slate-950">Key 处理规则</h5>
                      <div className="mt-2 grid gap-2">
                        {providerActivationRunbook.keyHandlingRules.map(rule => (
                          <div className="rounded bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={rule}>{rule}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">首版不需要</h4>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {providerActivationPlan.notNeededForFirstDelivery.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-emerald-800 ring-1 ring-emerald-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">交付红线</h4>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {providerActivationPlan.mustNotDo.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-md border border-violet-100 bg-violet-50 p-4">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Provider Need Assessment</p>
                      <h4 className="mt-1 text-base font-black text-slate-950">外部 provider 需求评估：首版可交付，Key 到位后增强</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{providerNeedAssessment.customerSummary}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                      {providerNeedAssessment.verdict === 'first_delivery_ready' ? '首版可交付' : '需要补配置'}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-4">
                    {providerNeedAssessment.canRunNow.map(item => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-violet-100" key={item.capability}>
                        <h5 className="text-sm font-black leading-5 text-slate-950">{item.capability}</h5>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{item.evidence}</p>
                        <p className="mt-3 line-clamp-2 text-[11px] font-bold leading-4 text-violet-700">{item.customerAction}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    {providerNeedAssessment.waitingForYourKeys.map(item => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs leading-5 ring-1 ring-violet-100" key={item.keyType}>
                        <div className="font-black text-violet-700">{item.keyType}</div>
                        <div className="mt-1 font-bold text-slate-600">{item.fallbackNow}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-md bg-white p-3 text-xs font-bold leading-5 text-slate-700 ring-1 ring-violet-100">
                    {providerNeedAssessment.finalRecommendation}
                  </div>
                </div>
                <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Provider Escalation Board</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{providerEscalationBoard.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{providerEscalationBoard.plainAnswer}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                      首版不强制
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-4">
                    {providerEscalationBoard.lanes.map(lane => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-slate-200" key={lane.id}>
                        <h5 className="text-sm font-black leading-5 text-slate-950">{lane.label}</h5>
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-emerald-700">{lane.firstDeliveryPath}</p>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{lane.becomesRequiredWhen}</p>
                        <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{lane.customerFallback}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">现在先别买</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {providerEscalationBoard.doNotBuyYet.map(item => (
                          <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                      <h5 className="text-sm font-black text-slate-950">满足这些再配</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {providerEscalationBoard.buyOnlyAfter.map(item => (
                          <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-800 ring-1 ring-emerald-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Model Image Tasks</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">模特生图先做成任务包，Key 到位后直接执行</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{modelImageTaskPack.providerBoundary}</p>
                  </div>
                  <span className="rounded-md bg-orange-50 px-3 py-2 text-sm font-black text-orange-700">{modelImageTaskPack.tasks.length} 个图片任务</span>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-4">
                  {modelImageTaskPack.tasks.map(task => (
                    <article className="min-w-0 rounded-md border border-orange-100 bg-orange-50 p-4" key={task.id}>
                      <h4 className="text-sm font-black text-slate-950">{task.title}</h4>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{task.prompt}</p>
                      <div className="mt-3 rounded bg-white p-2 text-xs font-bold leading-5 text-orange-700 ring-1 ring-orange-100">{task.fallbackWithoutKey}</div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {task.qualityChecks.slice(0, 3).map(check => (
                          <span className="rounded bg-white px-2 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-orange-100" key={check}>{check}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Ecommerce Growth Loop</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">{ecommerceGrowthLoopConsole.headline}</h3>
                    <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">{ecommerceGrowthLoopConsole.promise}</p>
                  </div>
                  <span className="w-fit rounded-md bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700">
                    {ecommerceGrowthLoopConsole.lanes.length} 个闭环节点
                  </span>
                </div>
                <div className="mt-5 grid gap-3 xl:grid-cols-5">
                  {ecommerceGrowthLoopConsole.lanes.map(lane => (
                    <article className="min-w-0 rounded-md border border-indigo-100 bg-indigo-50 p-4" key={lane.id}>
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">{lane.id}</div>
                      <h4 className="mt-1 text-sm font-black leading-5 text-slate-950">{lane.label}</h4>
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-indigo-700">{lane.customerQuestion}</p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{lane.wenaiDoes}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {lane.outputPack.slice(0, 4).map(item => (
                          <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-slate-700 ring-1 ring-indigo-100" key={item}>{item}</span>
                        ))}
                      </div>
                      <p className="mt-3 line-clamp-2 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-emerald-700 ring-1 ring-indigo-100">{lane.nextLoop}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-4">
                  <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">每日运营顺序</h4>
                    <div className="mt-3 grid gap-2">
                      {ecommerceGrowthLoopConsole.dailyOperatorFlow.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-indigo-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">等 Key 时怎么交付</h4>
                    <div className="mt-3 grid gap-2">
                      {ecommerceGrowthLoopConsole.keyWaitingPolicy.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">为什么功能多但不散</h4>
                    <div className="mt-3 grid gap-2">
                      {ecommerceGrowthLoopConsole.notScatteredBecause.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-emerald-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">客户只看这些</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ecommerceGrowthLoopConsole.customerSeesOnly.map(item => (
                        <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200" key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">Customer Workflow</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">客户看到的是一条商品增长流水线，不是零散 AI 工具</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">从商品资料到发布回填，每一步都写清客户要做什么、系统产出什么、什么时候不能继续。</p>
                  </div>
                  <div className="rounded-md bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700">{workflowPlaybook.stages.length} 步闭环</div>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  {workflowPlaybook.stages.map((stage, index) => (
                    <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={stage.id}>
                      <div className="flex items-start gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-cyan-600 text-xs font-black text-white">{index + 1}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black leading-5 text-slate-950">{stage.title}</h4>
                          <p className="mt-1 text-xs font-black leading-5 text-cyan-700">{stage.output}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-600">客户：{stage.customerAction}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">系统：{stage.systemAction}</p>
                      <p className="mt-3 rounded bg-white p-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100">{stage.qualityGate}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-cyan-100 bg-cyan-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">稳定默认项</h4>
                    <div className="mt-3 grid gap-2">
                      {workflowPlaybook.stableDefaults.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-cyan-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">没有外部 provider 时的替代路径</h4>
                    <div className="mt-3 grid gap-2">
                      {workflowPlaybook.noProviderFallbacks.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-md border border-cyan-100 bg-cyan-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">chat Cut Remix Console</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{chatCutRemixConsole.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{chatCutRemixConsole.promise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-cyan-700 ring-1 ring-cyan-100">{chatCutRemixConsole.cutFlow.length} 步混剪流</span>
                  </div>
                  <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800 ring-1 ring-cyan-100">{chatCutRemixConsole.operatingMode}</p>
                  <div className="mt-4 grid gap-3 xl:grid-cols-6">
                    {chatCutRemixConsole.cutFlow.map((step, index) => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-cyan-100" key={step.id}>
                        <div className="flex items-start gap-2">
                          <span className="grid size-6 shrink-0 place-items-center rounded bg-cyan-600 text-[11px] font-black text-white">{index + 1}</span>
                          <div className="min-w-0">
                            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-cyan-700">{step.id}</div>
                            <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{step.label}</h5>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-cyan-700">客户：{step.customerInput}</p>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">系统：{step.systemAction}</p>
                        <p className="mt-3 rounded bg-cyan-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-cyan-800">{step.output}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {chatCutRemixConsole.defaultRecipes.map(recipe => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-cyan-100" key={recipe.id}>
                        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-cyan-700">{recipe.id}</div>
                        <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{recipe.label}</h5>
                        <p className="mt-2 text-xs font-bold leading-5 text-cyan-700">{recipe.bestFor}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {recipe.structure.map(item => (
                            <span className="rounded bg-cyan-50 px-2 py-1 text-[11px] font-black text-cyan-700" key={item}>{item}</span>
                          ))}
                        </div>
                        <p className="mt-3 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{recipe.customerOutput}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                    <div className="rounded-md bg-white p-3 ring-1 ring-cyan-100">
                      <h5 className="text-sm font-black text-slate-950">稳定规则</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {chatCutRemixConsole.reliabilityRules.map(item => (
                          <div className="rounded bg-cyan-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-cyan-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-cyan-100">
                      <h5 className="text-sm font-black text-slate-950">客户只看这些</h5>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {chatCutRemixConsole.customerOnlySees.map(item => (
                          <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-cyan-700 ring-1 ring-cyan-100" key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">最近商品项目</h3>
                      <p className="mt-1 text-sm text-slate-500">每个项目都显示“现在处于哪一步、下一步做什么”，客户不用理解后台术语。</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input className="h-9 min-w-[220px] rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400" onChange={event => setQuery(event.target.value)} placeholder="搜索商品 / 平台 / 状态" value={query} />
                      <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700" href="/factory/create?variant=friend_trial">上传商品素材</Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project, index) => (
                      <Link className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md" href={project.href} key={project.title}>
                        <div className={`relative aspect-video bg-gradient-to-br ${project.accent} p-3`}>
                          <MiniIllustration step={flowSteps[index % flowSteps.length]} />
                          <span className="absolute left-3 top-3 rounded bg-slate-700/80 px-2 py-1 text-xs font-black text-white">{project.category}</span>
                          <span className="absolute bottom-3 right-3 rounded bg-white/85 px-2 py-1 text-[11px] font-bold text-slate-600">{project.status}</span>
                        </div>
                        <div className="p-3">
                          <div className="line-clamp-2 min-h-10 break-words text-sm font-black leading-5 text-slate-950">{project.title}</div>
                          <div className="mt-2 rounded-md bg-indigo-50 px-2 py-1 text-xs font-black text-indigo-700">下一步：{project.next}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <aside className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Today</div>
                      <h3 className="mt-1 text-xl font-black leading-snug text-slate-950">今天先完成一个商品的首轮内容包</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">1/6</span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    先选一个商品和一个主要平台，生成首轮标题、图片任务、视频任务和发布文案。最后一步可以导出给客户自己发，也可以在客户授权后辅助执行。
                  </p>
                  <div className="mt-5 grid gap-2">
                    {['商品和主平台已确认', '素材和授权边界已确认', '发布方式已选择：客户自发 / 授权辅助'].map((item, index) => (
                      <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-black text-emerald-900" key={item}>
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs text-white">{index + 1}</span>
                        <span className="min-w-0 flex-1">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link className="mt-5 flex min-h-11 items-center justify-center rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-4 text-sm font-black text-white shadow-sm" href="/factory/creative?variant=friend_trial">
                    开始生成卖点脚本
                  </Link>
                </aside>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-500">Open Remix Engine</p>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">混剪底盘覆盖时间线交换、无损切片、场景检测、字幕校对、图片格式标准化、FFmpeg 合成和批量队列；客户看到的是稳定交付包，不需要理解这些开源项目。</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">混剪不等外部平台，先做成稳定的本地渲染系统</h3>
                    </div>
                    <Link className="text-sm font-black text-indigo-600" href="/factory/video?variant=friend_trial">查看视频 / 数字人流程</Link>
                  </div>
                  <div className="mt-5 rounded-md border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Customer Remix Path</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">客户只看 5 步：素材、片段、模板、渲染、回填</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceCoverage.customerPromise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">
                        {openSourceCoverage.readyNowCount}/{openSourceCoverage.totalAdapterCount} 可先用
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {openSourceCoverage.layers.map((layer, index) => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-indigo-100" key={layer.id}>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-sm font-black leading-5 text-slate-950">{layer.label}</h5>
                            <span className="shrink-0 rounded bg-indigo-50 px-2 py-1 text-[11px] font-black text-indigo-700">{index + 1}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-indigo-700">{layer.customerProblem}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{layer.runNow}</p>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{layer.outputProof}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {remixPlan.engineStack.map(row => (
                      <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={row.id}>
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="min-w-0 text-sm font-black text-slate-950">{row.role}</h4>
                          <span className="max-w-[54%] shrink rounded bg-indigo-50 px-2 py-1 text-right text-[11px] font-black leading-4 text-indigo-700 [overflow-wrap:anywhere]">{row.openSourceReference}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{row.reason}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Open Source Last Mile</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceLastMileBoard.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceLastMileBoard.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                        {openSourceLastMileBoard.lanes.length} 段可交付
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {openSourceLastMileBoard.lanes.map(lane => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100" key={lane.id}>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-sm font-black leading-5 text-slate-950">{lane.label}</h5>
                            <span className="shrink-0 rounded bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">
                              {lane.lastMileOwner === 'wenai' ? 'Wenai' : lane.lastMileOwner === 'customer' ? '客户' : '共同'}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-emerald-800">{lane.nowDoable}</p>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{lane.customerGets}</p>
                          <p className="mt-3 line-clamp-2 rounded bg-emerald-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-700">{lane.smokeProof}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                        <h5 className="text-sm font-black text-slate-950">不等 Key 也能交付</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceLastMileBoard.canShipWithoutKeys.map(item => (
                            <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                        <h5 className="text-sm font-black text-slate-950">客户最后一步</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceLastMileBoard.customerFinalStep.map(item => (
                            <div className="rounded bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-blue-800" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                        <h5 className="text-sm font-black text-slate-950">开源不解决</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceLastMileBoard.notSolvingWithOpenSource.map(item => (
                            <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 rounded-md border border-violet-100 bg-violet-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">GitHub Adoption Queue</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">GitHub 开源能力接入队列</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                          不把一堆仓库名丢给客户；Wenai 先把可本地跑的混剪、字幕、时间线和队列能力接成发布包，再把大规模渲染和云端 worker 放到规模化阶段。
                        </p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                        {githubRemixRadar.repoFamilies.length} 类开源范式
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {githubRemixRadar.adoptionQueue.map(item => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-violet-100" key={item.stage}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-violet-50 px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-violet-700">{item.stage.replace('_', ' ')}</span>
                            <h5 className="min-w-0 text-sm font-black leading-5 text-slate-950">{item.label}</h5>
                          </div>
                          <p className="mt-2 text-xs font-bold leading-5 text-violet-800">{item.reason}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.repoIds.slice(0, 5).map(id => (
                              <span className="rounded bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{item.evidenceRequired}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <details className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <summary className="cursor-pointer list-none rounded-md bg-white px-3 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200">
                      展开高级开源混剪验收：GitHub 蓝图、安装矩阵、适配器和冒烟测试
                    </summary>
                    <div className="mt-4 space-y-5">
                  <div className="rounded-md border border-sky-100 bg-sky-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Open Source Coverage</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceCoverage.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceCoverage.summary}</p>
                      </div>
                      <div className="grid shrink-0 grid-cols-2 gap-2">
                        <div className="rounded bg-white px-3 py-2 text-center ring-1 ring-sky-100">
                          <div className="text-lg font-black text-slate-950">{openSourceCoverage.readyNowCount}</div>
                          <div className="text-[11px] font-black text-sky-700">可先用</div>
                        </div>
                        <div className="rounded bg-white px-3 py-2 text-center ring-1 ring-sky-100">
                          <div className="text-lg font-black text-slate-950">{openSourceCoverage.totalAdapterCount}</div>
                          <div className="text-[11px] font-black text-sky-700">适配器</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {openSourceCoverage.layers.map(layer => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-sky-100" key={layer.id}>
                          <h5 className="text-sm font-black leading-5 text-slate-950">{layer.label}</h5>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-sky-700">{layer.customerProblem}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{layer.runNow}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {layer.primaryAdapterIds.slice(0, 3).map(id => (
                              <span className="rounded bg-sky-50 px-2 py-1 text-[11px] font-black text-sky-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{layer.outputProof}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 lg:grid-cols-4">
                      {openSourceCoverage.installOrder.map(item => (
                        <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-sky-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-violet-100 bg-violet-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">GitHub Remix Blueprint</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceRemixBlueprint.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceRemixBlueprint.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">{openSourceRemixBlueprint.githubPatternGroups.length} 组开源范式</span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {openSourceRemixBlueprint.githubPatternGroups.map(group => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-violet-100" key={group.id}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-violet-700">{group.id}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{group.label}</h5>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-violet-700">{group.whatBorrow}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{group.wenaiImplementation}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {group.referenceAdapterIds.slice(0, 4).map(id => (
                              <span className="rounded bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{group.customerOutput}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                      <div className="rounded-md bg-white p-3 ring-1 ring-violet-100">
                        <h5 className="text-sm font-black text-slate-950">进入交付的规则</h5>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {openSourceRemixBlueprint.deliveryRules.map(rule => (
                            <div className="rounded bg-violet-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-violet-100" key={rule}>{rule}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-violet-100">
                        <h5 className="text-sm font-black text-slate-950">什么时候再升级</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceRemixBlueprint.scaleDecision.map(rule => (
                            <div className="rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={rule}>{rule}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-fuchsia-100 bg-fuchsia-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-700">GitHub Remix Radar</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{githubRemixRadar.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{githubRemixRadar.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-fuchsia-700 ring-1 ring-fuchsia-100">{githubRemixRadar.repoFamilies.length} 层能力</span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {githubRemixRadar.repoFamilies.map(family => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-fuchsia-100" key={family.id}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-fuchsia-700">{family.id}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{family.label}</h5>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-fuchsia-700">{family.customerJob}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{family.adoptNow}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {family.repoIds.slice(0, 4).map(id => (
                              <span className="rounded bg-fuchsia-50 px-2 py-1 text-[11px] font-black text-fuchsia-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{family.customerOutput}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {githubRemixRadar.adoptionQueue.map(queue => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-fuchsia-100" key={queue.stage}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-fuchsia-700">{queue.stage}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{queue.label}</h5>
                          <p className="mt-2 text-xs leading-5 text-slate-600">{queue.reason}</p>
                          <p className="mt-3 rounded bg-fuchsia-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-fuchsia-800">{queue.evidenceRequired}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                      <div className="rounded-md bg-white p-3 ring-1 ring-fuchsia-100">
                        <h5 className="text-sm font-black text-slate-950">客户可见的上线标准</h5>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {githubRemixRadar.customerReadyDefinition.map(item => (
                            <div className="rounded bg-fuchsia-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-fuchsia-100" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-fuchsia-100">
                        <h5 className="text-sm font-black text-slate-950">仍然不等外部 provider</h5>
                        <div className="mt-3 grid gap-2">
                          {githubRemixRadar.notProviderDependency.map(item => (
                            <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-fuchsia-800 ring-1 ring-fuchsia-100" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-teal-100 bg-teal-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Open Source Queue Console</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceQueueConsole.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceQueueConsole.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-teal-700 ring-1 ring-teal-100">
                        {openSourceQueueConsole.stages.length} 段混剪队列
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {openSourceQueueConsole.stages.map(stage => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-teal-100" key={stage.id}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-teal-700">{stage.id}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{stage.label}</h5>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{stage.customerJob}</p>
                          <p className="mt-3 rounded bg-teal-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-teal-800">{stage.queueLane}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {stage.adapterIds.slice(0, 5).map(id => (
                              <span className="rounded bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-700 ring-1 ring-slate-100" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 text-[11px] font-bold leading-4 text-emerald-700">{stage.passGate}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <div className="rounded-md bg-white p-3 ring-1 ring-teal-100">
                        <h5 className="text-sm font-black text-slate-950">批量控制</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceQueueConsole.batchControls.map(item => (
                            <div className="rounded bg-teal-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-teal-100">
                        <h5 className="text-sm font-black text-slate-950">失败策略</h5>
                        <div className="mt-3 grid gap-2">
                          {openSourceQueueConsole.failurePolicy.map(item => (
                            <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-teal-100">
                        <h5 className="text-sm font-black text-slate-950">客户可见证据</h5>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {openSourceQueueConsole.customerVisibleProof.map(item => (
                            <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-100" key={item}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      {openSourceQueueConsole.scaleUpgradePath.map(item => (
                        <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-teal-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Open Source Stack Selector</p>
                        <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceStackSelector.headline}</h4>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceStackSelector.customerPromise}</p>
                      </div>
                      <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">{openSourceStackSelector.defaultStack.length} 个默认工具</span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {openSourceStackSelector.decisions.map(decision => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100" key={decision.id}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-emerald-700">{decision.id}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{decision.customerSituation}</h5>
                          <p className="mt-2 text-xs font-bold leading-5 text-emerald-700">{decision.useWhen}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{decision.operatorRule}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {decision.defaultAdapterIds.slice(0, 4).map(id => (
                              <span className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{decision.customerOutput}</p>
                        </article>
                      ))}
                    </div>
                  <div className="mt-4 grid gap-2 lg:grid-cols-2">
                    {openSourceStackSelector.scaleUpRules.map(rule => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-emerald-100" key={rule}>{rule}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-lime-100 bg-lime-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">Install & Smoke Test Matrix</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{openSourceInstallMatrix.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{openSourceInstallMatrix.promise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-lime-700 ring-1 ring-lime-100">{openSourceInstallMatrix.minimumLocalStack.length} 个最小本地栈</span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-3">
                    {openSourceInstallMatrix.lanes.map(lane => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-lime-100" key={lane.id}>
                        <div className="flex items-start justify-between gap-3">
                          <h5 className="min-w-0 text-sm font-black leading-5 text-slate-950">{lane.customerLabel}</h5>
                          <span className="shrink-0 rounded bg-lime-50 px-2 py-1 text-[11px] font-black text-lime-700">{lane.adapterIds.length} tools</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-lime-700">{lane.installCheck}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{lane.smokeTest}</p>
                        <p className="mt-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600 [overflow-wrap:anywhere]">{lane.outputProof}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {lane.adapterIds.slice(0, 4).map(id => (
                            <span className="rounded bg-lime-50 px-2 py-1 text-[11px] font-black text-lime-700" key={id}>{id}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                    <div className="rounded-md bg-white p-3 ring-1 ring-lime-100">
                      <h5 className="text-sm font-black text-slate-950">进入客户交付前必须满足</h5>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {openSourceInstallMatrix.readyDefinition.map(item => (
                          <div className="rounded bg-lime-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-lime-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-lime-100">
                      <h5 className="text-sm font-black text-slate-950">仍然不是 provider 依赖</h5>
                      <div className="mt-3 grid gap-2">
                        {openSourceInstallMatrix.providerBoundary.map(item => (
                          <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">开源能力适配器</p>
                        <h4 className="mt-1 text-base font-black text-slate-950">不是堆开源项目，而是把成熟能力封成电商任务</h4>
                      </div>
                      <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">{openSourceAdapters.length} 个适配器</span>
                    </div>
                    <div className="mt-4 grid gap-2 lg:grid-cols-3">
                      {openSourceAdapters.map(adapter => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-indigo-100" key={adapter.id}>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-sm font-black leading-5 text-slate-950">{adapter.name}</h5>
                            <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">{adapter.readiness === 'ready_now' ? '可先用' : adapter.readiness === 'key_optional' ? '等 Key' : '后续'}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-indigo-700">{adapter.useFor}</p>
                          <p className="mt-2 text-xs leading-5 text-slate-600">{adapter.customerValue}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">执行配方</p>
                        <h4 className="mt-1 text-base font-black text-slate-950">每个开源能力都落到输入、步骤、输出和验收</h4>
                      </div>
                      <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">{executionRecipes.length} 条可执行配方</span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {executionRecipes.map(recipe => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-slate-200" key={recipe.id}>
                          <h5 className="text-sm font-black leading-5 text-slate-950">{recipe.title}</h5>
                          <p className="mt-2 text-[11px] font-black text-indigo-600">{recipe.adapterId}</p>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{recipe.operatorSteps[0]}</p>
                          <p className="mt-2 rounded bg-emerald-50 px-2 py-1 text-xs font-bold leading-5 text-emerald-700">{recipe.passCriteria[0]}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-100 bg-cyan-50 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">开源混剪编排板</p>
                        <h4 className="mt-1 text-base font-black text-slate-950">客户看到的是 5 步稳定流水线，不是 GitHub 工具堆叠</h4>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{orchestrationBoard.promise}</p>
                      </div>
                      <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-cyan-700 ring-1 ring-cyan-100">{orchestrationBoard.routes.length} 个能力路由</span>
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {orchestrationBoard.routes.map(route => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-cyan-100" key={route.id}>
                          <div className="text-[11px] font-black text-cyan-700">{route.phase}</div>
                          <h5 className="mt-1 text-sm font-black leading-5 text-slate-950">{route.customerLabel}</h5>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{route.decisionRule}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {route.primaryAdapterIds.slice(0, 3).map(id => (
                              <span className="rounded bg-cyan-50 px-2 py-1 text-[11px] font-black text-cyan-700" key={id}>{id}</span>
                            ))}
                          </div>
                          <p className="mt-3 line-clamp-2 text-[11px] font-bold leading-4 text-emerald-700">{route.stabilityChecks[0]}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      {orchestrationBoard.notProviderBlockers.map(item => (
                        <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-cyan-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                    </div>
                  </details>
                </div>

                <aside className="rounded-lg border border-[#d8e4ff] bg-[#f4f8ff] p-5 text-slate-950 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Render Queue</p>
                  <h3 className="mt-2 text-xl font-black leading-snug">大规模渲染队列先按“任务包”解决</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    每条视频都有素材清单、模板、尺寸、字幕、封面和输出路径。失败时只回到缺口，不让客户看到复杂报错。
                  </p>
                  <div className="mt-4 rounded-md border border-blue-100 bg-white p-3 ring-1 ring-blue-50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Reliability Board</div>
                        <p className="mt-1 text-sm font-black leading-5 text-slate-950">稳定渲染看板</p>
                      </div>
                      <span className="w-fit rounded bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
                        {renderReliabilityBoard.status === 'ready' ? '可批量渲染' : renderReliabilityBoard.status === 'scale_review' ? '评估扩容' : '先补素材'}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-600">{renderReliabilityBoard.customerPromise}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {renderReliabilityBoard.lanes.map(lane => (
                        <div className="rounded bg-blue-50 px-3 py-2" key={lane.id}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 text-xs font-black leading-5 text-slate-800">{lane.label}</span>
                            <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-blue-700">{lane.count}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-slate-600">{lane.customerMeaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-indigo-100 bg-white p-3 ring-1 ring-indigo-50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">Render Operations Runbook</div>
                        <p className="mt-1 text-sm font-black leading-5 text-slate-950">{renderOperationsRunbook.headline}</p>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{renderOperationsRunbook.operatingMode}</p>
                      </div>
                      <span className="w-fit rounded bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700">{renderOperationsRunbook.batchSteps.length} 步</span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {renderOperationsRunbook.batchSteps.slice(0, 3).map(step => (
                        <div className="rounded bg-indigo-50 px-3 py-2" key={step.id}>
                          <div className="text-xs font-black leading-5 text-slate-900">{step.title}</div>
                          <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-slate-600">{step.action}</p>
                          <p className="mt-1 line-clamp-1 text-[11px] font-black leading-4 text-indigo-700">{step.proof}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {renderOperationsRunbook.escalationMatrix.slice(0, 2).map(item => (
                        <div className="rounded bg-slate-50 px-3 py-2 text-[11px] font-bold leading-4 text-slate-700" key={item.trigger}>
                          <span className="font-black text-indigo-700">{item.trigger}</span>
                          <span className="block mt-1">{item.decision}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-md bg-white p-3 ring-1 ring-blue-100">
                      <div className="text-lg font-black text-slate-950">{dryRun.exportedCount}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">可导出视频</div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-blue-100">
                      <div className="text-lg font-black text-slate-950">{remixPackage.artifacts.length}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">任务包文件</div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-blue-100">
                      <div className="text-lg font-black text-slate-950">{remixPlan.publishingPacks.reduce((sum, pack) => sum + pack.accountVariants.length, 0)}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">账号标题角度</div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2">
                    {queueSummary.map(item => (
                      <div className="flex items-center justify-between rounded-md border border-blue-100 bg-white px-3 py-2 text-sm font-black text-slate-800" key={item.status}>
                        <span>{item.label}</span>
                        <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">{item.count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-md border border-blue-100 bg-white p-3 text-xs leading-5 text-slate-600">
                    当前样例已经生成 {remixPlan.timeline.clips.length} 个时间线片段、{remixPlan.ffmpegCommands.length} 条 FFmpeg 命令、{remixPlan.publishingPacks.length} 个平台发布包，并拆成 {batchPlan.batches.length} 个稳定渲染批次；建议并发 {renderCapacity.recommendedConcurrency}，预估每小时 {renderCapacity.estimatedOutputsPerHour} 条输出。
                  </div>
                  <div className="mt-3 grid gap-2">
                    {renderCapacity.failureIsolation.map(item => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-blue-100" key={item}>{item}</div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-md border border-blue-100 bg-white p-3">
                    <div className="text-xs font-black tracking-[0.16em] text-blue-600">队列治理</div>
                    <div className="mt-3 grid gap-2">
                      {renderReliabilityBoard.batchControls.slice(0, 2).map(item => (
                        <div className="rounded bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                      ))}
                      {renderReliabilityBoard.operatorRules.slice(0, 2).map(item => (
                        <div className="rounded bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
                    <div className="text-xs font-black tracking-[0.16em] text-slate-600">客户看到的状态</div>
                    <div className="mt-3 grid gap-2">
                      {renderReliabilityBoard.customerVisibleStatuses.slice(0, 4).map(item => (
                        <div className="rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {renderCapacity.humanReviewGates.slice(0, 3).map(item => (
                      <div className="rounded-md bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-800 ring-1 ring-amber-100" key={item}>{item}</div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 p-3">
                    <div className="text-xs font-black text-emerald-700">扩容判断</div>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{renderReliabilityBoard.scaleDecision.currentMode}</p>
                  </div>
                  <div className="mt-3 rounded-md border border-cyan-100 bg-cyan-50 p-3">
                    <div className="text-xs font-black text-cyan-700">云盘交付结构</div>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{renderCapacity.storageHandoff.slice(0, 2).join(' / ')}</p>
                  </div>
                  <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black leading-5 text-indigo-700">
                    已接本地接口：/api/commerce-remix，可直接生成任务包、质量门禁、渲染批次和客户回填复盘。
                  </div>
                  <div className="mt-3 space-y-2">
                    {remixPackage.artifacts.slice(0, 4).map(artifact => (
                      <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs ring-1 ring-blue-100" key={artifact.path}>
                        <span className="min-w-0 truncate font-black text-slate-700">{artifact.path.split('/').pop()}</span>
                        <span className="shrink-0 text-slate-500">{artifact.kind}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-600">Template Bank</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">混剪模板少而准：种草、模特证明、客服异议三条主线</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">参考开源剪辑器的时间线和转场方式，但收敛成电商人能直接选择的模板，不把客户丢进复杂编辑器。</p>
                    </div>
                    <div className="rounded-md bg-fuchsia-50 px-3 py-2 text-sm font-black text-fuchsia-700">质量分 {qualityGate.score}</div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {templateBank.map(template => (
                      <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={template.id}>
                        <h4 className="text-sm font-black text-slate-950">{template.name}</h4>
                        <p className="mt-1 text-xs font-bold leading-5 text-fuchsia-700">{template.bestFor}</p>
                        <div className="mt-3 space-y-1">
                          {template.sceneOrder.slice(0, 3).map(scene => (
                            <div className="rounded bg-white px-2 py-1.5 text-xs font-bold leading-5 text-slate-600 ring-1 ring-slate-100" key={scene}>{scene}</div>
                          ))}
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-500">{template.captionSafeArea}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <aside className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-700">Quality Gate</p>
                  <h3 className="mt-2 text-xl font-black leading-snug text-slate-950">导出前先检查，不把不可用成片交给客户</h3>
                  <div className="mt-4 space-y-2">
                    {qualityGate.checks.map(check => (
                      <div className="flex items-start gap-3 rounded-md bg-white px-3 py-2.5 text-xs ring-1 ring-fuchsia-100" key={check.id}>
                        <span className={`mt-0.5 size-2.5 shrink-0 rounded-full ${check.passed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div className="min-w-0">
                          <div className="font-black text-slate-800">{check.id}</div>
                          <div className="mt-1 leading-5 text-slate-500">{check.evidence}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 rounded-md bg-white p-3 text-sm font-bold leading-6 text-slate-700 ring-1 ring-fuchsia-100">{qualityGate.operatorSummary}</p>
                </aside>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.74fr)]">
                <div className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">Customer Return Loop</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">客户自己发布后，用云盘和表现表回到下一轮</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">不要求平台自动登录，也不把表现读取当成首版阻塞。客户上传链接、截图、CSV，系统就能判断继续放大、换标题，还是重剪素材。</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    {cloudDrive.folders.map((folder, index) => (
                      <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3" key={folder.path}>
                        <div className="text-[11px] font-black text-amber-600">{String(index + 1).padStart(2, '0')}</div>
                        <h4 className="mt-1 text-sm font-black leading-5 text-slate-950 [overflow-wrap:anywhere]">{folder.path.split('/').pop()}</h4>
                        <p className="mt-2 text-xs font-bold text-slate-500">负责人：{folder.owner}</p>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 [overflow-wrap:anywhere]">{folder.requiredFiles.join(' / ')}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 lg:grid-cols-[0.85fr_1fr]">
                    <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                      <h4 className="text-sm font-black text-slate-950">客户回填字段</h4>
                      <div className="mt-3 grid gap-2">
                        {cloudReturnPlan.intakeFields.map(field => (
                          <div className="rounded bg-white p-2 text-xs ring-1 ring-amber-100" key={field.label}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-black text-slate-800">{field.label}</span>
                              <span className="rounded bg-amber-50 px-2 py-0.5 font-black text-amber-700">{field.required ? '必填' : '选填'}</span>
                            </div>
                            <p className="mt-1 leading-5 text-slate-500 [overflow-wrap:anywhere]">{field.acceptedFormats.join(' / ')} · {field.example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-sm font-black text-slate-950">回填后系统看什么</h4>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {cloudReturnPlan.reviewSignals.map(item => (
                          <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Performance Upload</p>
                  <h3 className="mt-2 text-xl font-black leading-snug text-slate-950">表现数据先让客户上传，我们负责复盘和下一轮动作</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-md bg-white p-3 ring-1 ring-amber-100">
                      <div className="text-lg font-black text-slate-950">{performanceReport.totalImpressions.toLocaleString('zh-CN')}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">曝光</div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-amber-100">
                      <div className="text-lg font-black text-slate-950">{performanceReport.totalOrders}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">订单信号</div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-amber-100">
                      <div className="text-lg font-black text-slate-950">{performanceReport.rowCount}</div>
                      <div className="mt-1 text-[11px] font-black text-slate-500">CSV 行</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-amber-100">
                    最佳标题：<span className="font-black text-slate-950">{performanceReport.bestTitle}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {performanceReport.nextRoundAdvice.slice(0, 3).map(item => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-md border border-orange-100 bg-white p-3 ring-1 ring-orange-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Evidence Readiness</div>
                        <h4 className="mt-1 text-sm font-black text-slate-950">{evidenceReadinessBoard.headline}</h4>
                      </div>
                      <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-black ${evidenceReadinessBoard.status === 'ready_for_review' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {evidenceReadinessBoard.status === 'ready_for_review' ? '证据已齐' : '待客户上传'}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-600">{evidenceReadinessBoard.customerInstruction}</p>
                    <div className="mt-3 grid gap-2">
                      {evidenceReadinessBoard.requiredEvidenceChecks.map(check => (
                        <div className="rounded bg-orange-50 px-3 py-2 text-xs ring-1 ring-orange-100" key={check.label}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-slate-800">{check.label}</span>
                            <span className={`shrink-0 rounded px-2 py-0.5 font-black ${check.state === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {check.state === 'ready' ? '可复盘' : '缺证据'}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 leading-5 text-slate-600">{check.whyItMatters}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-amber-100 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-amber-700">回填收件箱</span>
                      <span className="rounded bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-700">
                        {customerReturnIntakeBoard.status === 'ready_for_review' ? '可复盘' : '待补证据'}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {customerReturnIntakeBoard.evidenceCards.slice(0, 4).map(card => (
                        <div className="flex items-start justify-between gap-2 rounded bg-amber-50 px-3 py-2 text-xs ring-1 ring-amber-100" key={card.id}>
                          <div className="min-w-0">
                            <div className="font-black text-slate-800">{card.label}</div>
                            <p className="mt-1 line-clamp-2 leading-5 text-slate-600">{card.operatorAction}</p>
                          </div>
                          <span className={`shrink-0 rounded px-2 py-1 font-black ${card.state === 'received' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {card.state === 'received' ? '已收' : '缺'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {customerReturnIntakeBoard.nextOwnerActions.slice(0, 3).map(item => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                    ))}
                  </div>
                </aside>
              </section>

              <section className="rounded-lg border border-[#fde68a] bg-[#fff8e6] p-5 shadow-sm">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.52fr)]">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Customer Evidence Upload Guide</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">{customerEvidenceUploadGuide.headline}</h3>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">{customerEvidenceUploadGuide.promise}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {customerEvidenceUploadGuide.uploadSteps.map(step => (
                        <article className="min-w-0 rounded-md bg-white p-4 ring-1 ring-amber-100" key={step.step}>
                          <div className="flex items-center gap-2">
                            <span className="grid size-7 shrink-0 place-items-center rounded bg-amber-100 text-[11px] font-black text-amber-800">{step.step}</span>
                            <h4 className="min-w-0 text-sm font-black leading-5 text-slate-950">{step.title}</h4>
                          </div>
                          <p className="mt-3 line-clamp-3 text-xs font-bold leading-5 text-slate-700">{step.customerAction}</p>
                          <p className="mt-2 line-clamp-3 rounded bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900">{step.wenaiAction}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {customerEvidenceUploadGuide.acceptedEvidence.map(item => (
                        <div className="min-w-0 rounded-md bg-white p-3 ring-1 ring-amber-100" key={item.label}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm font-black leading-5 text-slate-950">{item.label}</h4>
                              <p className="mt-1 text-xs font-bold leading-5 text-amber-700 [overflow-wrap:anywhere]">{item.destination}</p>
                            </div>
                            <span className="shrink-0 rounded bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-700">{item.formats.join('/')}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-600">{item.proves}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <aside className="min-w-0 rounded-md border border-amber-200 bg-white p-4">
                    <h4 className="text-sm font-black text-slate-950">什么情况下可以复盘</h4>
                    <div className="mt-3 grid gap-2">
                      {customerEvidenceUploadGuide.reviewReadinessRules.map(item => (
                        <div className="rounded bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-amber-100" key={item}>{item}</div>
                      ))}
                    </div>
                    <h4 className="mt-5 text-sm font-black text-slate-950">证据怎么变成下一轮动作</h4>
                    <div className="mt-3 grid gap-2">
                      {customerEvidenceUploadGuide.nextRoundMapping.map(item => (
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={item.evidence}>
                          <div className="line-clamp-1 text-xs font-black text-slate-900">{item.evidence}</div>
                          <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-600">{item.nextWenaiAction}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-md border border-rose-100 bg-rose-50 p-3">
                      <div className="text-xs font-black text-rose-800">不向客户索要</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {customerEvidenceUploadGuide.doNotAskCustomerFor.map(item => (
                          <span className="rounded bg-white px-2 py-1 text-[11px] font-black leading-4 text-rose-700 ring-1 ring-rose-100" key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              </section>

              <section className="rounded-lg border border-[#dbeafe] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Post Publish Action Board</p>
                    <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">{postPublishActionBoard.headline}</h3>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{postPublishActionBoard.evidenceSummary}</p>
                  </div>
                  <span className={`w-fit rounded px-3 py-2 text-xs font-black ${postPublishActionBoard.status === 'ready_for_next_round' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {postPublishActionBoard.status === 'ready_for_next_round' ? '可进入下一轮' : '待补证据'}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-4">
                  {postPublishActionBoard.actionLanes.map(lane => (
                    <article className="min-w-0 rounded-md border border-blue-100 bg-blue-50 p-4" key={lane.id}>
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">{lane.owner}</div>
                      <h4 className="mt-1 text-sm font-black leading-5 text-slate-950">{lane.label}</h4>
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-blue-700">{lane.trigger}</p>
                      <div className="mt-3 grid gap-2">
                        {lane.actions.slice(0, 3).map(action => (
                          <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-blue-100" key={action}>{action}</div>
                        ))}
                      </div>
                      <p className="mt-3 rounded bg-white px-3 py-2 text-xs font-black leading-5 text-slate-800 ring-1 ring-blue-100">{lane.output}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">复盘口径</h4>
                    <div className="mt-3 grid gap-2">
                      {postPublishActionBoard.reviewScript.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">仍然不自动化</h4>
                    <div className="mt-3 grid gap-2">
                      {postPublishActionBoard.doNotAutomate.map(item => (
                        <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600">Customer Service Pack</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">客服、售后和差评解释也进入商品增长包</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">电商人不只要视频，还要能回答客户问题。平台根据商品卖点生成 FAQ、异议处理和售后卡片，避免内容和客服话术断开。</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">常见问题</h4>
                    <div className="mt-3 space-y-2">
                      {servicePack.faq.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-slate-100" key={item.question}>
                          <div className="font-black text-slate-800">{item.question}</div>
                          <div className="mt-1 text-slate-500">{item.answer}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">异议处理</h4>
                    <div className="mt-3 space-y-2">
                      {servicePack.objectionReplies.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-slate-100" key={item.objection}>
                          <div className="font-black text-slate-800">{item.objection}</div>
                          <div className="mt-1 text-slate-500">{item.reply}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">售后卡片</h4>
                    <div className="mt-3 space-y-2">
                      {servicePack.afterSalesCards.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-slate-100" key={item.title}>
                          <div className="font-black text-slate-800">{item.title}</div>
                          <div className="mt-1 text-slate-500">{item.body}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <article className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">售前承接</h4>
                    <div className="mt-3 space-y-2">
                      {customerSupportWorkflow.preSaleReplies.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-rose-100" key={item.scenario}>
                          <div className="font-black text-rose-700">{item.scenario}</div>
                          <div className="mt-1 text-slate-600">{item.reply}</div>
                          <div className="mt-1 font-bold text-slate-500">发送：{item.assetToSend}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">售后处理</h4>
                    <div className="mt-3 space-y-2">
                      {customerSupportWorkflow.afterSaleReplies.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-rose-100" key={item.scenario}>
                          <div className="font-black text-rose-700">{item.scenario}</div>
                          <div className="mt-1 text-slate-600">{item.reply}</div>
                          <div className="mt-1 font-bold text-slate-500">{item.escalation}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-md border border-rose-100 bg-rose-50 p-4">
                    <h4 className="text-sm font-black text-slate-950">差评挽回</h4>
                    <div className="mt-3 space-y-2">
                      {customerSupportWorkflow.negativeReviewRecovery.map(item => (
                        <div className="rounded bg-white p-2 text-xs leading-5 ring-1 ring-rose-100" key={item.issue}>
                          <div className="font-black text-rose-700">{item.issue}</div>
                          <div className="mt-1 text-slate-600">{item.response}</div>
                          <div className="mt-1 font-bold text-slate-500">下一步：{item.nextAction}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
                <details className="mt-5 rounded-md border border-rose-100 bg-rose-50 p-3">
                  <summary className="cursor-pointer list-none rounded-md bg-white px-3 py-2 text-sm font-black text-slate-900 ring-1 ring-rose-100">
                    展开客服对话工单明细：售前、推荐、售后、复购和不能自动化的边界
                  </summary>
                  <div className="mt-4 rounded-md bg-rose-50 p-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">对话运营板</p>
                      <h4 className="mt-1 text-base font-black text-slate-950">像 chat Cut 一样把流程切细：接住售前、推荐、售后和复购，但不接管账号</h4>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{salesConversationBoard.promise}</p>
                    </div>
                    <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-rose-700 ring-1 ring-rose-100">{salesConversationBoard.lanes.length} 条对话 lane</span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-5">
                    {salesConversationBoard.lanes.map(lane => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-rose-100" key={lane.id}>
                        <div className="text-[11px] font-black text-rose-700">{lane.label}</div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{lane.customerTrigger}</p>
                        <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-slate-800">{lane.operatorAction}</p>
                        <p className="mt-3 rounded bg-rose-50 px-2 py-1 text-[11px] font-bold leading-4 text-rose-700">{lane.nextSystemStep}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-4">
                    {salesConversationBoard.noAutomationBoundaries.map(item => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-rose-100" key={item}>{item}</div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-md border border-pink-100 bg-white p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">chat Cut Workflow Console</p>
                        <h5 className="mt-1 text-base font-black leading-6 text-slate-950">{conversationOpsConsole.headline}</h5>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{conversationOpsConsole.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-pink-50 px-2.5 py-1 text-xs font-black text-pink-700 ring-1 ring-pink-100">{conversationOpsConsole.replyPackets.length} 个回复包</span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-4">
                      {conversationOpsConsole.triageColumns.map(column => (
                        <article className="min-w-0 rounded-md bg-pink-50 p-3 ring-1 ring-pink-100" key={column.id}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-pink-700">{column.id}</div>
                          <h6 className="mt-1 text-sm font-black leading-5 text-slate-950">{column.label}</h6>
                          <p className="mt-2 text-xs font-bold leading-5 text-pink-800">{column.customerSees}</p>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{column.operatorDoes}</p>
                          <p className="mt-3 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{column.proof}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {conversationOpsConsole.replyPackets.map(packet => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-pink-100" key={packet.laneId}>
                          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-pink-700">{packet.laneId}</div>
                          <h6 className="mt-1 text-sm font-black leading-5 text-slate-950">{packet.label}</h6>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{packet.firstReply}</p>
                          <p className="mt-3 rounded bg-pink-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-pink-800">发送：{packet.assetToSend}</p>
                          <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-500">回流：{packet.nextContentOpportunity}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                      <div className="rounded-md bg-pink-50 p-3 ring-1 ring-pink-100">
                        <h6 className="text-sm font-black text-slate-950">客户上传后怎么走</h6>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {conversationOpsConsole.inboxWorkflow.map(item => (
                            <div className="rounded bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-pink-100" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-pink-100">
                        <h6 className="text-sm font-black text-slate-950">不能自动化</h6>
                        <div className="mt-3 grid gap-2">
                          {conversationOpsConsole.noAutomationRules.map(item => (
                            <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800 ring-1 ring-rose-100" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </details>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Ecommerce Operating System</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">功能很多，但按电商人每天的工作组织</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">不是堆 AI 工具，而是把上新、模特图、内容、发布、客服、复盘放进同一个商品增长闭环。</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {commerceAssistantRows.map(row => (
                    <article className="rounded-md border border-slate-200 bg-slate-50 p-4" key={row[0]}>
                      <h4 className="text-sm font-black text-slate-950">{row[0]}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{row[1]}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Publishing Matrix</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">多账号矩阵先不做自动登录，先把每个平台发布包做准</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">客户自己发布，平台表现先上传截图、链接或 CSV；后续再接云盘和数据回流。</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {publishingRows.map(row => (
                    <article className="rounded-md border border-slate-200 bg-slate-50 p-3" key={row[0]}>
                      <h4 className="text-sm font-black text-slate-950">{row[0]}</h4>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{row[1]}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-5">
                  {publishingMatrix.map(plan => (
                    <article className="min-w-0 rounded-md border border-sky-100 bg-sky-50 p-3" key={plan.platform}>
                      <h4 className="text-sm font-black text-slate-950">{plan.platform}</h4>
                      <div className="mt-3 space-y-2">
                        {plan.accountAngles.slice(0, 3).map(angle => (
                          <div className="rounded bg-white p-2 text-xs ring-1 ring-sky-100" key={`${plan.platform}-${angle.accountType}`}>
                            <div className="font-black text-sky-700">{angle.accountType}</div>
                            <div className="mt-1 line-clamp-2 font-bold leading-5 text-slate-700">{angle.title}</div>
                            <div className="mt-1 line-clamp-2 leading-5 text-slate-500">{angle.assetHint}</div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                <details className="mt-5 rounded-md border border-cyan-100 bg-cyan-50 p-3">
                  <summary className="cursor-pointer list-none rounded-md bg-white px-3 py-2 text-sm font-black text-slate-900 ring-1 ring-cyan-100">
                    展开多账号矩阵明细：人设、标题、口播、质量门和客户回填字段
                  </summary>
                  <div className="mt-4 space-y-5">
                <div className="rounded-md border border-cyan-100 bg-cyan-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Persona Publishing Console</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{personaPublishingConsole.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{personaPublishingConsole.promise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-cyan-700 ring-1 ring-cyan-100">
                      {personaPublishingConsole.rows.length} 条可发布组合
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-3">
                    {personaPublishingConsole.rows.slice(0, 6).map(row => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-cyan-100" key={row.id}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-cyan-50 px-2 py-1 text-[11px] font-black text-cyan-700">{row.platformLabel}</span>
                          <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-700">{row.accountType}</span>
                        </div>
                        <p className="mt-3 text-xs font-black leading-5 text-cyan-700">{row.titleFamily}</p>
                        <h5 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-950">{row.title}</h5>
                        <div className="mt-3 grid gap-1.5">
                          {row.firstThreeVoiceoverLines.map((line, index) => (
                            <p className="rounded bg-slate-50 px-2 py-1.5 text-xs font-bold leading-5 text-slate-700" key={`${row.id}-line-${index}`}>
                              {index + 1}. {line}
                            </p>
                          ))}
                        </div>
                        <p className="mt-3 rounded bg-amber-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-amber-800">证明素材：{row.requiredProofAsset}</p>
                        <p className="mt-2 rounded bg-emerald-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-emerald-700">{row.customerCopyAction}</p>
                        <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-500">回传：{row.evidenceToUpload.slice(0, 4).join(' / ')}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    <div className="rounded-md bg-white p-3 ring-1 ring-cyan-100">
                      <h5 className="text-sm font-black text-slate-950">客户交付清单</h5>
                      <div className="mt-3 grid gap-2">
                        {personaPublishingConsole.customerHandoffChecklist.map(item => (
                          <div className="rounded bg-cyan-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-cyan-100">
                      <h5 className="text-sm font-black text-slate-950">回传字段</h5>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {personaPublishingConsole.evidenceFields.map(field => (
                          <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-100" key={field}>{field}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-cyan-100">
                      <h5 className="text-sm font-black text-slate-950">边界规则</h5>
                      <div className="mt-3 grid gap-2">
                        {personaPublishingConsole.boundaryRules.map(rule => (
                          <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800" key={rule}>{rule}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Self Publishing Command Center</p>
                      <h4 className="mt-1 text-base font-black leading-6 text-slate-950">{selfPublishingCommandCenter.headline}</h4>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{selfPublishingCommandCenter.promise}</p>
                    </div>
                    <span className="w-fit rounded bg-white px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                      {selfPublishingCommandCenter.slots.length} 个发布槽
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-5">
                    {selfPublishingCommandCenter.slots.slice(0, 10).map(slot => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-emerald-100" key={slot.id}>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-black leading-5 text-slate-950">{slot.platformLabel}</h5>
                          <span className="shrink-0 rounded bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">{slot.publishWindow}</span>
                        </div>
                        <p className="mt-2 text-xs font-black leading-5 text-emerald-700">{slot.accountType}</p>
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-800">{slot.title}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{slot.firstLine}</p>
                        <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{slot.copyAction}</p>
                        <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-emerald-700">回填：{slot.evidenceRequired.slice(0, 3).join(' / ')}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">客户发布步骤</h5>
                      <div className="mt-3 grid gap-2">
                        {selfPublishingCommandCenter.customerSteps.map(step => (
                          <div className="rounded bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={step}>{step}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">回填证据箱</h5>
                      <div className="mt-3 grid gap-2">
                        {selfPublishingCommandCenter.evidenceInbox.slice(0, 4).map(item => (
                          <div className="rounded bg-slate-50 px-3 py-2 text-xs leading-5" key={item.label}>
                            <div className="font-black text-emerald-700">{item.label}</div>
                            <div className="font-bold text-slate-600">{item.accepted}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                      <h5 className="text-sm font-black text-slate-950">不代登规则</h5>
                      <div className="mt-3 grid gap-2">
                        {selfPublishingCommandCenter.noLoginRules.map(rule => (
                          <div className="rounded bg-rose-50 px-3 py-2 text-xs font-bold leading-5 text-rose-800" key={rule}>{rule}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border border-sky-100 bg-sky-50 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Creator Persona Matrix</p>
                      <h4 className="mt-1 text-base font-black text-slate-950">超级 IP 和口播标题矩阵：先生成可复制脚本，客户自己发</h4>
                    </div>
                    <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                      {creatorPersonaMatrix.reduce((sum, plan) => sum + plan.personas.length, 0)} 个账号人设
                    </span>
                  </div>
                  <div className="mt-4 rounded-md border border-blue-100 bg-white p-4 ring-1 ring-sky-100">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Super IP Title Board</p>
                        <h5 className="mt-1 text-base font-black leading-6 text-slate-950">{superIpTitleBoard.headline}</h5>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{superIpTitleBoard.promise}</p>
                      </div>
                      <span className="w-fit rounded bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
                        {superIpTitleBoard.titleFamilies.length} 套标题打法
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {superIpTitleBoard.titleFamilies.map(family => (
                        <article className="min-w-0 rounded-md bg-sky-50 p-3 ring-1 ring-sky-100" key={family.id}>
                          <div className="text-xs font-black text-blue-700">{family.label}</div>
                          <h6 className="mt-2 line-clamp-2 text-sm font-black leading-5 text-slate-950">{family.titleFormula}</h6>
                          <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-700">{family.openingLine}</p>
                          <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-600">{family.voiceoverBeats.join(' / ')}</p>
                          <p className="mt-3 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-blue-700">{family.customerAction}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      {superIpTitleBoard.operatingRules.map(rule => (
                        <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={rule}>{rule}</div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-amber-100 bg-amber-50 p-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Title Quality Gate</p>
                        <h5 className="mt-1 text-base font-black leading-6 text-slate-950">{titleQualityGate.headline}</h5>
                        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{titleQualityGate.promise}</p>
                      </div>
                      <span className={`w-fit rounded bg-white px-2.5 py-1 text-xs font-black ring-1 ${titleQualityGate.gateStatus === 'ready_to_publish_pack' ? 'text-emerald-700 ring-emerald-100' : 'text-amber-700 ring-amber-100'}`}>
                        {titleQualityGate.gateStatus === 'ready_to_publish_pack' ? '可进发布包' : '需改标题'}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-4">
                      {titleQualityGate.checks.map(check => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-amber-100" key={check.label}>
                          <h6 className="text-sm font-black leading-5 text-slate-950">{check.label}</h6>
                          <p className="mt-2 line-clamp-3 text-xs font-bold leading-5 text-amber-800">{check.passRule}</p>
                          <p className="mt-3 line-clamp-2 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-600">{check.failAction}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 xl:grid-cols-5">
                      {titleQualityGate.platformGuides.map(guide => (
                        <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-amber-100" key={guide.platform}>
                          <h6 className="text-sm font-black text-slate-950">{guide.platformLabel}</h6>
                          <p className="mt-2 line-clamp-3 text-xs font-bold leading-5 text-slate-700">{guide.firstLineRule}</p>
                          <p className="mt-3 line-clamp-2 text-[11px] font-bold leading-4 text-amber-700">证据：{guide.proofNeeded.join(' / ')}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-md bg-white p-3 ring-1 ring-amber-100">
                        <h6 className="text-sm font-black text-slate-950">满足这些才给客户发</h6>
                        <div className="mt-3 grid gap-2">
                          {titleQualityGate.publishOnlyWhen.map(item => (
                            <div className="rounded bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md bg-white p-3 ring-1 ring-amber-100">
                        <h6 className="text-sm font-black text-slate-950">回填后怎么判断下一轮</h6>
                        <div className="mt-3 grid gap-2">
                          {titleQualityGate.returnSignals.map(item => (
                            <div className="rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-slate-100" key={item}>{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 xl:grid-cols-5">
                    {creatorPersonaMatrix.map(plan => (
                      <article className="min-w-0 rounded-md bg-white p-3 ring-1 ring-sky-100" key={plan.platform}>
                        <h5 className="text-sm font-black text-slate-950">{plan.platformLabel}</h5>
                        <div className="mt-3 space-y-2">
                          {plan.personas.slice(0, 3).map(persona => (
                            <div className="rounded bg-slate-50 p-2 text-xs ring-1 ring-slate-100" key={persona.personaId}>
                              <div className="font-black text-sky-700">{persona.accountType}</div>
                              <p className="mt-1 line-clamp-2 leading-5 text-slate-600">{persona.voiceStyle}</p>
                              <p className="mt-1 line-clamp-2 font-bold leading-5 text-slate-800">{persona.openingLines[0]}</p>
                              <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-sky-700">{persona.contentPillars.slice(0, 3).join(' / ')}</p>
                              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">{persona.filmingPrompts[0]}</p>
                              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">{persona.proofAssets.slice(0, 2).join(' / ')}</p>
                              <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-emerald-700">回填：{persona.returnMetrics.slice(0, 2).join(' / ')}</p>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    {creatorPersonaMatrix[0]?.personas[0]?.sourcePatterns.map(pattern => (
                      <div className="rounded-md bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 ring-1 ring-sky-100" key={pattern}>{pattern}</div>
                    ))}
                  </div>
                </div>
                  </div>
                </details>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">能力分层：API 生成、本地混剪、发布包三条路</h3>
                    <p className="mt-1 text-sm text-slate-500">能接 API 的直接接；能用开源组件完成的做成本地任务；最后发布环节给客户自发或授权辅助两条路。</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:hidden">
                  {capabilityRows.map(row => (
                    <article className="rounded-md border border-slate-200 bg-slate-50 p-3" key={row[0]}>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="min-w-0 text-sm font-black text-slate-950">{row[0]}</h4>
                        <span className="shrink-0 rounded bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">{row[2]}</span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-slate-600">{row[1]}</p>
                      <p className="mt-2 text-xs font-black text-indigo-600">下一步：{row[3]}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-5 hidden overflow-x-auto md:block">
                  <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                    <thead className="bg-[#f2f5fb] text-xs font-black text-slate-500">
                      <tr>
                        <th className="px-4 py-3">能力</th>
                        <th className="px-4 py-3">客户能理解的说法</th>
                        <th className="px-4 py-3">当前路径</th>
                        <th className="px-4 py-3">下一步</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {capabilityRows.map(row => (
                        <tr className="text-slate-700" key={row[0]}>
                          <td className="px-4 py-3 font-black text-slate-950">{row[0]}</td>
                          <td className="max-w-[420px] px-4 py-3">{row[1]}</td>
                          <td className="px-4 py-3"><span className="rounded bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">{row[2]}</span></td>
                          <td className="px-4 py-3 font-bold text-indigo-600">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
