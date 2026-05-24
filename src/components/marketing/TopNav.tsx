'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { label: '商品增长工作台', href: '/factory?variant=friend_trial' },
  { label: '生产流程', href: '/factory/creative?variant=friend_trial' },
  { label: 'Provider 配置', href: '/settings/kuaizi' },
  { label: '交付边界', href: '/docs' },
];

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/factory?variant=friend_trial"
            className="flex min-w-0 shrink-0 items-center gap-2 text-lg font-black tracking-tight text-[#17233f]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#123b47] text-sm text-white">W</span>
            <span className="truncate">wenai</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/factory?variant=friend_trial"
              className="rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-4 py-2 text-sm font-black text-white shadow-sm"
            >
              开始第一轮试用
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(value => !value)}
            className="flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-lg font-black text-slate-900 transition-colors hover:border-blue-300 hover:text-blue-700 md:hidden"
          >
            {mobileOpen ? '×' : '≡'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-slate-200 bg-white shadow-sm md:hidden">
          <div className="space-y-2 px-5 py-5">
            {[...NAV, { label: '开始第一轮试用', href: '/factory?variant=friend_trial' }].map(item => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
