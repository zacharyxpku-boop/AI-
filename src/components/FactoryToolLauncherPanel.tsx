'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type FactoryWorkbenchTool = {
  title: string;
  desc: string;
  href: string;
  badge: string;
  accent: string;
};

type FactoryToolLauncherPanelProps = {
  tools: FactoryWorkbenchTool[];
  primaryActionHref: string;
};

const TOOL_CATEGORIES = ['全部', '脚本', '影棚', '视频', '分发'];

function categoryForTool(tool: FactoryWorkbenchTool) {
  if (tool.title.includes('脚本')) return '脚本';
  if (tool.title.includes('影棚')) return '影棚';
  if (tool.title.includes('分发') || tool.title.includes('洞察')) return '分发';
  return '视频';
}

export function FactoryToolLauncherPanel({ tools, primaryActionHref }: FactoryToolLauncherPanelProps) {
  const [activeCategory, setActiveCategory] = useState(TOOL_CATEGORIES[0]);
  const [query, setQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(tools[0]?.title ?? '');

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tools.filter(tool => {
      const category = categoryForTool(tool);
      const matchesCategory = activeCategory === '全部' || category === activeCategory;
      const matchesQuery = !normalized || `${tool.title} ${tool.desc} ${category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, tools]);

  const selected = filteredTools.find(tool => tool.title === selectedTitle) ?? filteredTools[0] ?? tools[0];

  return (
    <div className="mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-2xl border border-slate-200 bg-white/86 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Tool Launcher</div>
            <h3 className="mt-1 text-xl font-black text-slate-950">选择一个 AI 生产工具</h3>
          </div>
          <label className="flex h-10 min-w-[230px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-400">
            <span>⌕</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索工具..."
              value={query}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map(category => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                activeCategory === category ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredTools.map(tool => (
            <button
              className={`group flex min-h-[156px] flex-col justify-between rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                selected?.title === tool.title ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
              key={tool.title}
              onClick={() => setSelectedTitle(tool.title)}
              type="button"
            >
              <div>
                <div className={`relative h-20 overflow-hidden rounded-xl bg-gradient-to-br ${tool.accent}`}>
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-black text-slate-700">{tool.badge}</div>
                  <div className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-sm font-black text-slate-950">+</div>
                </div>
                <h4 className="mt-3 break-words text-base font-black leading-6 text-slate-950">{tool.title}</h4>
                <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{tool.desc}</p>
              </div>
              <div className="mt-4 text-xs font-black text-indigo-600 group-hover:text-indigo-800">查看预览 →</div>
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Tool Preview</div>
        <h3 className="mt-2 break-words text-2xl font-black">{selected?.title ?? '选择工具'}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{selected?.desc ?? '选择一个工具后查看生产入口。'}</p>
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-bold text-slate-400">推荐工作流</div>
          <div className="mt-1 break-all text-sm font-black text-slate-700">{selected?.href ?? primaryActionHref}</div>
        </div>
        <Link
          className="mt-5 flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          href={selected?.href ?? primaryActionHref}
        >
          打开这个工具
        </Link>
      </aside>
    </div>
  );
}
