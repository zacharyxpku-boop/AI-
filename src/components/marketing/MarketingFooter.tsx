import { Container } from './Container';

const columns = [
  {
    title: '产品',
    links: [
      { label: '商品增长工作台', href: '/factory?variant=friend_trial' },
      { label: '生产流程', href: '/factory/creative?variant=friend_trial' },
      { label: 'Provider 配置', href: '/settings/kuaizi' },
    ],
  },
  {
    title: '试用',
    links: [
      { label: '开始第一轮试用', href: '/factory?variant=friend_trial' },
      { label: '客户试用说明', href: '/docs' },
      { label: '报告模板', href: '/poc/report' },
    ],
  },
  {
    title: '交付',
    links: [
      { label: 'Readiness 边界', href: '/status?variant=friend_trial' },
      { label: '素材生产', href: '/factory/create?variant=friend_trial' },
      { label: '分发证据', href: '/factory/cast?variant=friend_trial' },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '隐私', href: '/privacy' },
      { label: '条款', href: '/terms' },
      { label: '数据处理协议', href: '/legal/dpa' },
    ],
  },
];

const socials = [
  { label: '邮箱', initial: '邮' },
  { label: '领英', initial: 'in' },
  { label: 'X', initial: 'X' },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map(col => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label + link.href}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-slate-100 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-lg font-black tracking-tight text-[#17233f]">wenai</span>
            <span className="text-sm text-slate-400">Copyright 2026 wenai. All rights reserved.</span>
            <span className="text-sm text-slate-400">商品增长工作台</span>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(s => (
              <a
                key={s.label}
                href="/inquire?from=footer-social"
                aria-label={s.label}
                title={s.label}
                className="grid size-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-sm font-black text-slate-500 transition-colors hover:border-blue-200 hover:text-blue-700"
              >
                {s.initial}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
