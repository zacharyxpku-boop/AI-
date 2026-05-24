import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '试用与交付说明 | wenai',
  description: '面向客户和合作者的 Wenai 商品增长工作台试用路径、provider 材料和交付边界。',
};

const trialSteps = [
  {
    href: '/factory?variant=friend_trial',
    title: '1. 进入商品增长工作台',
    body: '先从一个 SKU 开始，确认商品、目标渠道和今天要推进的下一步。',
  },
  {
    href: '/factory/creative?variant=friend_trial',
    title: '2. 选择卖点角度',
    body: '把商品资料和竞品线索收敛成口播、图文和内容任务。',
  },
  {
    href: '/factory/create?variant=friend_trial',
    title: '3. 补齐素材与授权',
    body: '缺图、缺授权或缺口播资料时先补资料，不直接假装生成完成。',
  },
  {
    href: '/factory/video?variant=friend_trial',
    title: '4. 查看视频任务',
    body: '视频 provider 未配置前，只展示可审核队列和生产交接，不承诺自动成片。',
  },
  {
    href: '/factory/cast?variant=friend_trial',
    title: '5. 留下发布证据',
    body: '没有 OAuth、广告账号和发布回执前，只看计划、链接、截图和手工回填。',
  },
  {
    href: '/factory/manage?variant=friend_trial',
    title: '6. 交给销售跟进',
    body: '销售只接真实反馈、客户确认和负责人，不在后台页面里找线索。',
  },
];

const handoffLinks = [
  {
    href: '/settings/kuaizi',
    title: 'Provider 材料包',
    body: '视频、OAuth、广告账号、回流、云资产和规模审计的配置材料。',
  },
  {
    href: '/status?variant=friend_trial',
    title: 'Readiness 边界',
    body: '确认哪些能力已可试用，哪些仍处在 provider-gated 状态。',
  },
  {
    href: '/poc/report',
    title: '报告模板',
    body: '用于客户复盘的 POC 报告结构和可交付证明。',
  },
];

const boundaries = [
  '没有 provider callback，不宣称一键自动成片或批量智能混剪已商用。',
  '没有平台 OAuth、发布回执和账号授权，不宣称自动发布或矩阵分发完成。',
  '没有广告账号授权、预算和 campaign 证据，不宣称自动投放或自动优化。',
  '没有 analytics sync 和审计账本，不展示 Wenai 自有 91M+ / 42M+ 规模能力。',
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] px-4 py-5 text-[#15213f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1160px]">
        <section className="rounded-md border border-white bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Runbook</p>
          <h1 className="mt-2 break-words text-3xl font-black text-slate-950 md:text-4xl">客户试用与交付说明</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            试用时不要从后台 API 或工程概念开始。按下面路径走，只看客户能否理解输入、内容任务、视频队列、分发证据和销售交接。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/factory?variant=friend_trial" className="rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white">
              打开商品增长工作台
            </Link>
            <Link href="/settings/kuaizi" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
              查看 Provider 材料
            </Link>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {trialSteps.map(step => (
            <Link key={step.href} href={step.href} className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <h2 className="break-words text-lg font-black text-slate-950">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p>
            </Link>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Handoff</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">合作者交付入口</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {handoffLinks.map(item => (
                <Link key={item.href} href={item.href} className="rounded-md bg-slate-50 p-4 ring-1 ring-slate-200">
                  <h3 className="break-words text-base font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-md border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Stop Lines</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">对外话术边界</h2>
            <div className="mt-4 space-y-3">
              {boundaries.map(item => (
                <p key={item} className="rounded-md bg-white/75 p-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-amber-100">
                  {item}
                </p>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
