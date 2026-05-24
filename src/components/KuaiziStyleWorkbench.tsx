'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Tool = {
  id: string;
  label: string;
  title: string;
  desc: string;
  href: string;
  tag?: string;
  accent: string;
};

type Project = {
  title: string;
  type: string;
  date: string;
  status: string;
  href: string;
  accent: string;
};

const workflowNav = [
  { label: '开始工作', href: '/factory?variant=friend_trial', active: true },
  { label: '编写灵感', href: '/factory/creative?variant=friend_trial' },
  { label: '素材生产', href: '/factory/create?variant=friend_trial' },
  { label: '合成量产', href: '/factory/video?variant=friend_trial' },
  { label: '投放分发', href: '/factory/cast?variant=friend_trial' },
];

const serviceNav = [
  { label: '筷子云盘', href: '/factory/create?variant=friend_trial' },
  { label: '手机协同', href: '/factory/create?variant=friend_trial' },
  { label: '直播切片', href: '/factory/video?variant=friend_trial' },
  { label: '创意洞察', href: '/factory/creative?variant=friend_trial' },
  { label: '视频翻译', href: '/factory/video?variant=friend_trial' },
  { label: '评论管理', href: '/factory/manage?variant=friend_trial' },
];

const tools: Tool[] = [
  {
    id: 'script',
    label: '01',
    title: '编写脚本',
    desc: '开场引入、产品卖点、保证护肤成分、总结推荐。',
    href: '/factory/creative?variant=friend_trial',
    accent: 'from-slate-100 to-indigo-100',
  },
  {
    id: 'studio',
    label: '02',
    title: 'AI影棚',
    desc: '把商品图和场景图整理成可审核素材，不直接伪造发布效果。',
    href: '/factory/create?variant=friend_trial',
    tag: 'New',
    accent: 'from-pink-100 to-orange-100',
  },
  {
    id: 'remix',
    label: '03',
    title: 'AI复刻',
    desc: '只复用内容结构和节奏，不复制第三方品牌、素材或专有表达。',
    href: '/factory/video?variant=friend_trial',
    accent: 'from-emerald-100 to-sky-100',
  },
  {
    id: 'replace',
    label: '04',
    title: '元素替换',
    desc: '替换画面元素、卖点卡和口播段落，生成可交给客户审核的草稿。',
    href: '/factory/video?variant=friend_trial',
    accent: 'from-cyan-100 to-blue-100',
  },
  {
    id: 'voice',
    label: '05',
    title: '多语言AI配音',
    desc: '把脚本拆成可录制口播，保留平台节奏和审核说明。',
    href: '/factory/video?variant=friend_trial',
    tag: '100+ 音色',
    accent: 'from-blue-100 to-violet-100',
  },
  {
    id: 'cast',
    label: '06',
    title: '超级混剪 Pro',
    desc: '按素材、镜头组和脚本策略输出可审版本，provider 配齐后进入生成。',
    href: '/factory/cast?variant=friend_trial',
    tag: 'New',
    accent: 'from-amber-100 to-rose-100',
  },
];

const projects: Project[] = [
  { title: '宠物口腔护理 10 SKU', type: '混剪', date: '2026-05-24 03:18', status: '待客户审核', href: '/factory/video?variant=friend_trial', accent: 'from-rose-200 to-pink-100' },
  { title: '厨房收纳上新批次', type: '脚本', date: '2026-05-24 02:42', status: '卖点已确认', href: '/factory/creative?variant=friend_trial', accent: 'from-lime-200 to-emerald-100' },
  { title: '香薰礼盒素材库', type: '影棚', date: '2026-05-23 21:09', status: '缺授权图', href: '/factory/create?variant=friend_trial', accent: 'from-orange-200 to-yellow-100' },
  { title: '美妆口播多语版', type: '配音', date: '2026-05-23 18:30', status: '可进入合成', href: '/factory/video?variant=friend_trial', accent: 'from-indigo-200 to-sky-100' },
  { title: 'TikTok Shop 首批排期', type: '分发', date: '2026-05-22 16:02', status: '等发布证据', href: '/factory/cast?variant=friend_trial', accent: 'from-violet-200 to-fuchsia-100' },
  { title: '销售复盘交接包', type: 'CRM', date: '2026-05-22 11:56', status: '下一步已分配', href: '/factory/manage?variant=friend_trial', accent: 'from-slate-200 to-blue-100' },
];

const checks = ['商品和主渠道已确认', '素材授权边界已确认', '下一步负责人已明确'];

const capabilityRows = [
  ['商品任务', 'SKU、渠道、目标、负责人', '可用', '进入脚本'],
  ['素材生产', '图片、视频片段、授权边界', 'provider-gated', '补齐素材'],
  ['合成量产', '多版本脚本和短视频草稿', 'provider-gated', '配置生成服务'],
  ['投放分发', '发布时间、证据、负责人', '可记录', '回填链接'],
] as const;

function IconMark({ children }: { children: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-black text-slate-500 shadow-sm ring-1 ring-slate-200">
      {children}
    </span>
  );
}

export function KuaiziStyleWorkbench() {
  const [mode, setMode] = useState<'tools' | 'assistant'>('tools');
  const [selectedToolId, setSelectedToolId] = useState(tools[0].id);
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState(checks.slice(0, 1));
  const selectedTool = tools.find(tool => tool.id === selectedToolId) ?? tools[0];
  const completion = useMemo(() => Math.round((checked.length / checks.length) * 100), [checked.length]);
  const filteredProjects = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter(project => `${project.title} ${project.type} ${project.status}`.toLowerCase().includes(value));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-[224px] shrink-0 flex-col border-r border-[#dbe4f3] bg-[#eef4ff] xl:flex">
          <div className="px-5 pb-5 pt-7">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-[#5a55ff] via-[#d92dfb] to-[#23d7ff] text-sm font-black text-white">W</div>
              <div className="min-w-0">
                <div className="truncate text-[22px] font-black tracking-tight">wenai</div>
                <div className="inline-flex rounded bg-[#6758ff] px-1.5 py-0.5 text-[10px] font-black text-white">5.5</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 pb-4">
            <Link href="/factory?variant=friend_trial" className="mb-5 flex items-center gap-3 rounded-md bg-[#dfe7f8] px-3 py-2.5 text-sm font-black text-[#17223d]">
              <IconMark>⌂</IconMark>
              <span className="truncate">开始工作</span>
            </Link>

            <div className="px-3 pb-2 text-xs font-bold text-slate-400">工作流</div>
            <div className="space-y-1">
              {workflowNav.slice(1).map((item, index) => (
                <Link className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-white/75 hover:text-slate-950" href={item.href} key={item.href}>
                  <IconMark>{String(index + 1).padStart(2, '0')}</IconMark>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="px-3 pb-2 pt-5 text-xs font-bold text-slate-400">服务</div>
            <div className="space-y-1">
              {serviceNav.map((item, index) => (
                <Link className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-white/75 hover:text-slate-950" href={item.href} key={`${item.label}-${item.href}`}>
                  <IconMark>{String(index + 1)}</IconMark>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3 p-4">
            <Link href="/factory/manage?variant=friend_trial" className="flex min-h-10 items-center justify-center rounded-md bg-[#013f45] px-3 text-sm font-black text-white">
              生产 Agent
            </Link>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
              <span>消息通知</span>
              <span className="rounded-full bg-rose-500 px-1.5 text-[11px] text-white">1</span>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="grid size-8 place-items-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600">WA</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black">Wenai Admin</div>
                <div className="truncate text-xs text-slate-400">客户试用空间</div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-[#dbe4f3] bg-white/95 px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-black tracking-tight md:text-xl">Wenai 商品增长工作台</h1>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">provider 待配置</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">内部链路可跑</span>
                </div>
                <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                  按“商品资料 → 脚本 → 素材 → 合成 → 分发 → CRM”的顺序推进。现在不夸大外部发布能力，web provider 配齐后直接接入生成和回流。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600" type="button">搜索工具 Ctrl K</button>
                <Link className="min-h-10 rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 py-2.5 text-sm font-black text-white shadow-sm" href={selectedTool.href}>
                  {selectedTool.title}
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 md:px-6">
            <div className="mx-auto max-w-[1560px] space-y-5 pb-16">
              <section className="overflow-hidden rounded-lg border border-[#e2e8f5] bg-white shadow-sm">
                <div className="relative min-h-[390px] bg-[radial-gradient(circle_at_18%_0%,#ddf7ff_0,transparent_24%),radial-gradient(circle_at_70%_0%,#f0e9ff_0,transparent_30%),linear-gradient(180deg,#fbfdff_0%,#ffffff_74%)] px-5 py-9">
                  <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-black tracking-tight text-[#15213f] md:text-[30px]">Hi, what will we create today?</h2>
                    <div className="mt-6 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                      <button className={`rounded-full px-6 py-2 text-sm font-black ${mode === 'tools' ? 'bg-white text-[#17223d] shadow-sm ring-1 ring-slate-100' : 'text-slate-400'}`} onClick={() => setMode('tools')} type="button">AI工具</button>
                      <button className={`rounded-full px-6 py-2 text-sm font-black ${mode === 'assistant' ? 'bg-white text-[#17223d] shadow-sm ring-1 ring-slate-100' : 'text-slate-400'}`} onClick={() => setMode('assistant')} type="button">小W</button>
                    </div>
                    {mode === 'assistant' ? (
                      <p className="mx-auto mt-4 max-w-2xl rounded-lg bg-white/80 px-4 py-3 text-sm font-bold leading-6 text-slate-600 shadow-sm ring-1 ring-slate-100">
                        小W 会检查商品、素材、授权和目标渠道，缺关键资料时先拦住，不会把 demo 状态伪装成真实投放结果。
                      </p>
                    ) : null}
                  </div>

                  <div className="mx-auto mt-9 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                    {tools.map(tool => (
                      <button
                        className={`group relative min-h-[168px] rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedTool.id === tool.id ? 'border-[#6b5cff] ring-2 ring-[#6b5cff]/15' : 'border-slate-200'}`}
                        key={tool.id}
                        onClick={() => setSelectedToolId(tool.id)}
                        type="button"
                      >
                        {tool.tag ? <span className="absolute right-2 top-2 rounded bg-orange-500 px-1.5 py-0.5 text-[11px] font-black text-white">{tool.tag}</span> : null}
                        <div className={`grid size-14 place-items-center rounded-lg bg-gradient-to-br ${tool.accent} text-base font-black text-slate-700`}>{tool.label}</div>
                        <div className="mt-3 break-words text-sm font-black leading-5 text-slate-900">{tool.title}</div>
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{tool.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">最近工程</h3>
                      <p className="mt-1 text-sm text-slate-500">客户能看懂的生产记录，每张卡片都有下一步入口。</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input className="h-9 min-w-[220px] rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400" onChange={event => setQuery(event.target.value)} placeholder="搜索 SKU / 状态 / 类型" value={query} />
                      <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700" href="/factory/create?variant=friend_trial">上传素材</Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map(project => (
                      <Link className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md" href={project.href} key={project.title}>
                        <div className={`relative aspect-video bg-gradient-to-br ${project.accent}`}>
                          <span className="absolute left-3 top-3 rounded bg-slate-700/80 px-2 py-1 text-xs font-black text-white">{project.type}</span>
                          <span className="absolute bottom-3 right-3 rounded bg-white/80 px-2 py-1 text-[11px] font-bold text-slate-600">{project.status}</span>
                        </div>
                        <div className="p-3">
                          <div className="line-clamp-2 min-h-10 break-words text-sm font-black leading-5 text-slate-950">{project.title}</div>
                          <div className="mt-1 truncate text-xs font-bold text-slate-400">最后编辑于 {project.date}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <aside className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Current Task</div>
                      <h3 className="mt-1 text-xl font-black leading-snug text-slate-950">今天先确认哪一个商品？</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">1/6</span>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500">
                      <span>任务完成度</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-gradient-to-r from-[#6b5cff] via-[#b538ff] to-[#ff6c8f]" style={{ width: `${completion}%` }} />
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    先锁定一个 SKU、一个主渠道和一个负责人。资料不齐时先补资料，provider 未配置时只展示内部准备度和下一步。
                  </p>
                  <div className="mt-5 grid gap-2">
                    {checks.map(item => {
                      const active = checked.includes(item);
                      return (
                        <button
                          className={`flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm font-black transition ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}
                          key={item}
                          onClick={() => setChecked(current => (current.includes(item) ? current.filter(value => value !== item) : [...current, item]))}
                          type="button"
                        >
                          <span className={`grid size-5 shrink-0 place-items-center rounded-full text-xs ${active ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 ring-1 ring-slate-200'}`}>{active ? '✓' : '+'}</span>
                          <span className="min-w-0 flex-1">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Link className="mt-5 flex min-h-11 items-center justify-center rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-4 text-sm font-black text-white shadow-sm" href="/factory/creative?variant=friend_trial">
                    进入卖点选择
                  </Link>
                </aside>
              </section>

              <section className="rounded-lg border border-[#e2e8f5] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">能力呈现</h3>
                    <p className="mt-1 text-sm text-slate-500">客户看到的是能执行的工序，而不是泛泛的 AI 能力清单。</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">web provider 配齐后，生成、分发、回流会从 gated 变成可执行。</span>
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
                        <th className="px-4 py-3">模块</th>
                        <th className="px-4 py-3">客户看到什么</th>
                        <th className="px-4 py-3">当前状态</th>
                        <th className="px-4 py-3">下一步</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {capabilityRows.map(row => (
                        <tr className="text-slate-700" key={row[0]}>
                          <td className="px-4 py-3 font-black text-slate-950">{row[0]}</td>
                          <td className="max-w-[320px] px-4 py-3">{row[1]}</td>
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
