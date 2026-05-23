'use client';

import Link from 'next/link';
import { useState } from 'react';

const ASSISTANT_ACTIONS = [
  {
    title: '补齐商品资料',
    desc: '先检查商品图、授权、卖点和目标渠道。',
    href: '/factory/create?variant=friend_trial',
  },
  {
    title: '生成一组脚本',
    desc: '把主卖点拆成标题、口播和图文草稿。',
    href: '/factory/creative?variant=friend_trial',
  },
  {
    title: '做发布排期',
    desc: '安排渠道、发布时间和发布证明。',
    href: '/factory/cast?variant=friend_trial',
  },
];

export function FactoryWorkbenchAssistant({ primaryActionHref }: { primaryActionHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-30 hidden items-end gap-3 md:flex">
      {open ? (
        <section className="w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Assistant</div>
                <h3 className="mt-1 text-base font-black">小W 工作助手</h3>
              </div>
              <button
                aria-label="关闭小W助手"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white transition hover:bg-white/20"
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              我会按“商品资料 → 内容生成 → 发布证据 → 销售移交”的顺序带客户走，不展示虚构效果数字。
            </div>
            <div className="grid gap-2">
              {ASSISTANT_ACTIONS.map(action => (
                <Link
                  className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                  href={action.href}
                  key={action.title}
                >
                  <div className="text-sm font-black text-slate-950">{action.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{action.desc}</p>
                </Link>
              ))}
            </div>
            <Link
              className="flex min-h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
              href={primaryActionHref}
            >
              继续当前下一步
            </Link>
          </div>
        </section>
      ) : (
        <button
          className="max-w-[360px] rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-left text-sm font-bold text-slate-700 shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl"
          onClick={() => setOpen(true)}
          type="button"
        >
          小W 在线 · 点我打开下一步助手
        </button>
      )}

      <button
        aria-label="打开小W助手"
        className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-pink-500 to-cyan-400 text-lg font-black text-white shadow-xl ring-4 ring-white transition hover:scale-105"
        onClick={() => setOpen(value => !value)}
        type="button"
      >
        W
      </button>
      <Link className="flex size-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white shadow-xl" href="/settings/kuaizi">
        ?
      </Link>
    </div>
  );
}
