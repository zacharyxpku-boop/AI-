'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type QuickAction = {
  id: string;
  title: string;
  desc: string;
  href: string;
  meta: string;
  owner: string;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'project',
    title: '新建商品工作区',
    desc: '从一个商品开始，整理卖点、素材、内容、发布计划和销售跟进。',
    href: '/factory?variant=friend_trial',
    meta: '商品 / 渠道 / Owner',
    owner: '运营负责人',
    accent: 'from-slate-950 to-slate-700',
  },
  {
    id: 'asset',
    title: '上传素材到云库',
    desc: '把商品图、视频片段、授权说明和品牌禁区先放进素材库。',
    href: '/factory/create?variant=friend_trial',
    meta: '图片 / 视频 / 授权',
    owner: '素材负责人',
    accent: 'from-indigo-600 to-blue-500',
  },
  {
    id: 'script',
    title: '生成电商脚本',
    desc: '围绕主卖点生成标题、口播、图文和短视频草稿，先审再发。',
    href: '/factory/creative?variant=friend_trial',
    meta: '标题 / 口播 / CTA',
    owner: '内容负责人',
    accent: 'from-violet-600 to-fuchsia-500',
  },
  {
    id: 'batch',
    title: '批量合成内容',
    desc: '用同一套卖点生成多版本内容，给不同平台做小批量测试。',
    href: '/factory/video?variant=friend_trial',
    meta: '短视频 / 图文 / 多语',
    owner: '制作负责人',
    accent: 'from-cyan-600 to-teal-500',
  },
  {
    id: 'cast',
    title: '安排发布排期',
    desc: '设置渠道、发布时间、发布证据和负责人，让客户看到真实进度。',
    href: '/factory/cast?variant=friend_trial',
    meta: '渠道 / 链接 / 截图',
    owner: '投放负责人',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    id: 'handoff',
    title: '生成 CRM 移交包',
    desc: '把客户确认、发布证据和真实反馈整理给销售继续推进。',
    href: '/factory/manage?variant=friend_trial',
    meta: '反馈 / Owner / 下一步',
    owner: '销售负责人',
    accent: 'from-emerald-600 to-lime-500',
  },
];

export function FactoryWorkbenchInteractionPanel() {
  const [activeId, setActiveId] = useState(QUICK_ACTIONS[0].id);
  const [query, setQuery] = useState('');

  const filteredActions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return QUICK_ACTIONS;
    return QUICK_ACTIONS.filter(action =>
      `${action.title} ${action.desc} ${action.meta} ${action.owner}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const active = QUICK_ACTIONS.find(action => action.id === activeId) ?? QUICK_ACTIONS[0];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Quick Start</div>
            <h3 className="mt-1 text-2xl font-black text-slate-950">快捷创建</h3>
          </div>
          <div className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-sm">
            <span className="text-sm text-slate-400">⌕</span>
            <input
              aria-label="搜索快捷动作"
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none"
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索脚本 / 素材 / 发布..."
              value={query}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredActions.map(action => (
            <button
              className={`group rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                action.id === active.id ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
              key={action.id}
              onClick={() => setActiveId(action.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-950">{action.title}</div>
                  <div className="mt-1 truncate text-xs font-bold text-slate-400">{action.meta}</div>
                </div>
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    action.id === active.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 group-hover:text-slate-900'
                  }`}
                >
                  +
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <aside className="overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50 shadow-sm">
        <div className={`h-2 bg-gradient-to-r ${active.accent}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-400">Action Preview</div>
              <h3 className="mt-1 truncate text-xl font-black text-slate-950">{active.title}</h3>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">已选中</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{active.desc}</p>
          <div className="mt-5 grid gap-2">
            <div className="rounded-lg border border-indigo-100 bg-white p-3">
              <div className="text-xs font-bold text-slate-400">进入模块</div>
              <div className="mt-1 truncate text-sm font-black text-slate-950">{active.href}</div>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3">
              <div className="text-xs font-bold text-slate-400">默认负责人</div>
              <div className="mt-1 text-sm font-black text-slate-950">{active.owner}</div>
            </div>
          </div>
          <Link
            className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
            href={active.href}
          >
            打开这个工作流
          </Link>
        </div>
      </aside>
    </section>
  );
}
