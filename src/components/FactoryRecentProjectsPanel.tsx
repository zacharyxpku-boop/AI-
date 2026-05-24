'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type FactoryRecentProject = {
  title: string;
  type: string;
  status: string;
  tone: string;
};

type FactoryRecentProjectsPanelProps = {
  projects: FactoryRecentProject[];
  filters: string[];
  primaryActionHref: string;
  nextLabel: string;
};

function routeForProject(project: FactoryRecentProject) {
  if (project.type.includes('素材')) return '/factory/create?variant=friend_trial';
  if (project.type.includes('视频') || project.type.includes('混剪')) return '/factory/video?variant=friend_trial';
  if (project.status.includes('证据')) return '/factory/cast?variant=friend_trial';
  if (project.status.includes('客户')) return '/factory/manage?variant=friend_trial';
  return '/factory/creative?variant=friend_trial';
}

export function FactoryRecentProjectsPanel({
  projects,
  filters,
  primaryActionHref,
  nextLabel,
}: FactoryRecentProjectsPanelProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0] ?? '全部');
  const [query, setQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(projects[0]?.title ?? '');

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter(project => {
      const matchesFilter = activeFilter === filters[0] || project.type.includes(activeFilter) || project.status.includes(activeFilter);
      const haystack = `${project.title} ${project.type} ${project.status}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [activeFilter, filters, projects, query]);

  const selected = filteredProjects.find(project => project.title === selectedTitle) ?? filteredProjects[0] ?? projects[0];
  const selectedHref = selected ? routeForProject(selected) : primaryActionHref;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Recent Workspace</div>
          <h3 className="mt-1 text-2xl font-black text-slate-950">客户看得懂的生产记录</h3>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50" href="/factory/create?variant=friend_trial">
            上传素材
          </Link>
          <Link className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800" href={primaryActionHref}>
            {nextLabel}
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map(item => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                item === activeFilter ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              key={item}
              onClick={() => setActiveFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500" type="button">
            本周
          </button>
          <label className="min-w-[210px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-400">
            <span className="sr-only">输入关键词</span>
            <input
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={event => setQuery(event.target.value)}
              placeholder="输入关键词..."
              value={query}
            />
          </label>
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700" type="button">
            全部类型
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <button
              className={`overflow-hidden rounded-xl border text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md ${
                selected?.title === project.title ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50'
              }`}
              key={project.title}
              onClick={() => setSelectedTitle(project.title)}
              type="button"
            >
              <div className="relative aspect-video bg-gradient-to-br from-slate-200 via-white to-indigo-100">
                <div className="absolute left-3 top-3 rounded-md bg-slate-700/80 px-2 py-1 text-xs font-black text-white">{project.type}</div>
                <div className="absolute bottom-3 right-3 text-3xl font-black text-white/80">{String(index + 1).padStart(2, '0')}</div>
              </div>
              <div className="p-4">
                <div className="line-clamp-2 min-h-10 break-words text-sm font-black leading-5 text-slate-950">{project.title}</div>
                <span className={`mt-3 inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${project.tone}`}>
                  <span className="truncate">{project.status}</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Workspace Detail</div>
          <h4 className="mt-2 break-words text-lg font-black leading-6">{selected?.title ?? '暂无工程'}</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-bold text-slate-400">内容类型</div>
              <div className="mt-1 font-black">{selected?.type ?? '-'}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-bold text-slate-400">当前状态</div>
              <div className="mt-1 font-black">{selected?.status ?? '-'}</div>
            </div>
          </div>
          <Link className="mt-4 flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800" href={selectedHref}>
            打开这个工程
          </Link>
        </aside>
      </div>
    </div>
  );
}
