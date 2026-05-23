'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type CommandItem = {
  title: string;
  desc: string;
  href: string;
  group: string;
};

const COMMANDS: CommandItem[] = [
  { title: '新建商品工程', desc: '从商品、渠道和负责人开始', href: '/factory?variant=friend_trial', group: '工程' },
  { title: '生成脚本', desc: '标题、口播、图文草稿', href: '/factory/creative?variant=friend_trial', group: 'AI工具' },
  { title: '上传素材', desc: '商品图、视频片段、授权说明', href: '/factory/create?variant=friend_trial', group: '素材' },
  { title: '批量合成', desc: '短视频、图文、多版本内容', href: '/factory/video?variant=friend_trial', group: '生产' },
  { title: '发布排期', desc: '渠道、发布时间、发布证明', href: '/factory/cast?variant=friend_trial', group: '分发' },
  { title: 'CRM 移交', desc: '客户确认、证据和下一步', href: '/factory/manage?variant=friend_trial', group: '销售' },
];

export function FactoryCommandCenter({
  nextHref,
  nextLabel,
}: {
  nextHref: string;
  nextLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMANDS;
    return COMMANDS.filter(command => `${command.title} ${command.desc} ${command.group}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="relative flex shrink-0 items-center gap-2">
      <button
        className="flex min-h-10 min-w-[240px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-left text-sm font-bold text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-slate-800"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="text-slate-400">⌕</span>
        <span className="min-w-0 flex-1 truncate">搜索工具、工程、下一步...</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">Ctrl K</span>
      </button>
      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">样例空间 · 不展示虚假效果</span>
      <Link className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800" href={nextHref}>
        {nextLabel}
      </Link>

      {open ? (
        <>
          <button
            aria-label="关闭全局命令面板遮罩"
            className="fixed inset-0 z-30 cursor-default bg-slate-950/10 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="absolute right-0 top-12 z-40 w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Command Center</div>
                  <h3 className="mt-1 text-lg font-black text-slate-950">全局命令面板</h3>
                </div>
                <button
                  aria-label="关闭全局命令面板"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-500 transition hover:bg-slate-200"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <span className="text-slate-400">⌕</span>
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  onChange={event => setQuery(event.target.value)}
                  placeholder="搜索脚本、素材、分发、CRM..."
                  value={query}
                />
              </label>
            </div>
            <div className="max-h-[390px] overflow-y-auto p-3">
              {filteredCommands.map(command => (
                <Link
                  className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-indigo-50"
                  href={command.href}
                  key={command.title}
                >
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-center text-xs font-black text-slate-600">{command.group}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-slate-950">{command.title}</span>
                    <span className="block truncate text-xs font-bold text-slate-500">{command.desc}</span>
                  </span>
                  <span className="text-xs font-black text-indigo-600">打开</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
