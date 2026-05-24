import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/marketing/TopNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { POC_STANDARD_PACK_ROUTE } from '@/lib/standard-pack-routing';

export const metadata: Metadata = {
  title: '商品增长试用路径 | wenai',
  description: '从一个 SKU 开始跑通卖点、素材、视频任务、分发证据和销售跟进，明确 provider 配置前后的交付边界。',
};

const steps = [
  ['01', '选一个商品', '确认今天主推 SKU、目标渠道、素材现状和客户最关心的问题。'],
  ['02', '生成卖点与脚本', '把商品资料变成口播、图文、短视频脚本和可审核任务。'],
  ['03', '补齐素材和授权', '缺图、缺授权、缺口播资料时先补资料，不假装自动生成完成。'],
  ['04', '进入视频和分发', 'provider 未配置前只展示任务队列、发布计划和手工证据回填。'],
  ['05', '交给销售跟进', '把真实反馈、客户确认、负责人和下一步动作交给销售。'],
] as const;

const gates = [
  '没有视频 provider callback，不宣称一键成片或智能混剪已商用。',
  '没有平台 OAuth、发布回执和账号授权，不宣称自动发布或矩阵分发完成。',
  '没有广告账号授权、预算和 campaign 证据，不宣称自动投放或自动优化。',
  '没有 analytics sync 和审计账本，不展示 Wenai 自有规模数字。',
] as const;

const deliverables = [
  '商品增长任务板',
  '卖点与脚本草稿',
  '素材与授权清单',
  '视频生产队列',
  '分发证据面板',
  '销售跟进清单',
] as const;

export default function PocPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
      <TopNav />
      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div className="min-w-0">
                <p className="w-fit rounded-md bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">Trial Runbook</p>
                <h1 className="mt-4 max-w-4xl break-words text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                  从一个商品开始，验证整条内容增长交付链
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  试用目标不是展示一堆工具，而是让客户看清楚：商品怎么变成内容任务、哪些材料还缺、哪些外部 provider 必须配置、销售下一步怎么跟进。
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/factory?variant=friend_trial" className="inline-flex min-h-11 items-center justify-center rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 text-sm font-black text-white shadow-sm">
                    打开商品增长工作台
                  </Link>
                  <Link href="/inquire?from=poc" className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 text-sm font-black text-slate-700">
                    提交试用申请
                  </Link>
                  <Link href={POC_STANDARD_PACK_ROUTE} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 text-sm font-black text-slate-700">
                    生成试用标准包
                  </Link>
                </div>
              </div>

              <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Acceptance</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">客户试用要拿走什么</h2>
                <div className="mt-4 grid gap-2">
                  {deliverables.map(item => (
                    <div key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-5">
            {steps.map(([num, title, body]) => (
              <article key={num} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black text-blue-700">{num}</p>
                <h2 className="mt-2 break-words text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Provider Gates</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">补齐 web provider 前，页面必须停在哪里</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  这些不是保守话术，而是客户试用时必须看到的交付边界。
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {gates.map(gate => (
                  <p key={gate} className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                    {gate}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
          <div className="rounded-md bg-gradient-to-r from-[#17233f] via-[#244b73] to-[#6b5cff] p-5 text-white shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Next</p>
                <h2 className="mt-1 break-words text-2xl font-black">准备真实 SKU 后，直接进入试用申请</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">提交类目、平台、素材状态和当前卡点，我们只判断试用边界和下一步。</p>
              </div>
              <Link href="/inquire?from=poc-final" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-white px-5 text-sm font-black text-[#17233f]">
                提交试用申请
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
