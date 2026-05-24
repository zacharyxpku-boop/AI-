import type { Metadata } from 'next';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import TopNav from '@/components/marketing/TopNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { PricingIntentCards } from '@/components/marketing/PricingIntentCards';

export const metadata: Metadata = {
  title: '定价 | Wenai 商品增长工作台',
  description: 'Free、Starter、Growth 三档权益对比：试用工作台、客户报告、provider 接入和团队协作。',
};

const rows = [
  ['试用项目', '1 个', '3 个', '多项目'],
  ['商品增长工作台', '支持', '支持', '支持'],
  ['客户报告', '带试用标记', '无水印', '无水印 + 团队复盘'],
  ['Provider 材料门禁', '可查看', '接入协助', '接入协助 + 回流复盘'],
  ['视频与分发任务', '手工交接', '任务协同', '任务协同 + 团队权限'],
  ['销售跟进', '基础清单', '负责人分配', 'CRM 协同'],
];

const faq = [
  {
    q: 'Free 能直接给客户试用吗？',
    a: '可以。Free 先跑商品增长工作台，展示卖点、素材、视频任务、分发证据和销售跟进；外部 provider 未配置前保持门禁。',
  },
  {
    q: '什么时候需要 Starter？',
    a: '当客户需要无水印报告、更多项目、素材和视频任务协同，以及正式 provider 接入协助时再升级。',
  },
  {
    q: '会不会泄露第三方密钥？',
    a: '不会。浏览器不保存 provider token、cookie 或后台登录态，真实连接只走服务端配置和最小权限账号。',
  },
];

export default function PricingPage() {
  return (
    <>
      <PageViewTracker page="pricing" />
      <TopNav />
      <main className="bg-[#f4f6fb] text-[#15213f]">
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 lg:px-8 lg:py-18">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="w-fit rounded-md bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">Pricing</div>
                <h1 className="mt-4 break-words text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  先免费跑通第一轮，再为更多协作和 provider 接入付费
                </h1>
                <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
                  付费点放在更高价值的动作上：无水印客户报告、更多项目、团队协作、外部 provider 接入和表现回流。试用期不承诺未配置的自动化。
                </p>
              </div>
              <Link href="/factory?variant=friend_trial" className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 text-sm font-black text-white shadow-sm">
                开始第一轮试用
              </Link>
            </div>
            <div className="mt-10">
              <PricingIntentCards />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 py-14">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Plan Compare</div>
              <h2 className="mt-3 text-3xl font-black text-slate-950">三档权益对比</h2>
            </div>
            <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 font-black text-slate-950">权益</th>
                    <th className="px-4 py-3 font-black text-slate-950">Free</th>
                    <th className="px-4 py-3 font-black text-slate-950">Starter</th>
                    <th className="px-4 py-3 font-black text-slate-950">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row[0]} className="border-b border-slate-100 last:border-b-0">
                      {row.map((cell, index) => (
                        <td key={cell} className={index === 0 ? 'px-4 py-3 font-black text-slate-800' : 'px-4 py-3 font-semibold text-slate-600'}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {rows.map(row => (
                <article key={row[0]} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-black text-slate-950">{row[0]}</h3>
                  <div className="mt-3 grid gap-2 text-sm">
                    {['Free', 'Starter', 'Growth'].map((plan, index) => (
                      <div key={plan} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                        <span className="font-bold text-slate-500">{plan}</span>
                        <span className="min-w-0 break-words text-right font-black text-slate-900">{row[index + 1]}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 py-14">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-5 sm:px-6 lg:grid-cols-3 lg:px-8">
            {faq.map(item => (
              <div key={item.q} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black text-slate-950">{item.q}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-5 px-5 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Start Free</div>
              <h2 className="mt-2 text-2xl font-black text-slate-950">先用一个商品跑出第一轮客户可审核链路</h2>
            </div>
            <Link href="/factory?variant=friend_trial" className="inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-black text-white">
              免费开始
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
