import type { Metadata } from 'next';
import Link from 'next/link';
import { ListingFactoryConsole } from '@/components/marketing/ListingFactorySections';

export const metadata: Metadata = {
  title: '内容工厂控制台 | Wenai Listing Factory',
  description: '集中查看 SKU 上新进度、品牌禁区、批量 Brief、内容任务和客户交付状态。',
};

const FACTORY_OPERATING_LAYERS = [
  {
    name: 'Compose',
    title: '创意情报',
    body: '竞品账号、榜单趋势、视频拆解、Hook Bank、UGC 脚本骨架和品牌学习复利。',
    href: '/factory/creative',
    state: '内部账本已就绪，真实持续采集仍需授权源和解析 provider。',
  },
  {
    name: 'Create',
    title: '资产生产',
    body: 'SKU brief、脚本、素材、生产 handoff、客户交付包和资产权限审计。',
    href: '/factory',
    state: '可跑内部生产交接；真实云资产 enforcement 需要对象存储和签名链接。',
  },
  {
    name: 'Cut',
    title: '视频混剪',
    body: '一键视频队列、智能混剪计划、供应商门禁、成片回灌和客户审核。',
    href: '/factory/video',
    state: '工作流可用；自动成片需要视频生成/剪辑 provider、授权素材和回调。',
  },
  {
    name: 'Cast',
    title: '分发投放',
    body: '分发计划、矩阵账号、dispatch、广告假设、证据链接和表现回流。',
    href: '/settings/kuaizi',
    state: '账本和门禁已建；自动发布、广告投放、平台同步需要 OAuth 和广告账户。',
  },
  {
    name: 'Manage',
    title: '管理验收',
    body: 'readiness、外部材料清单、客户 review、CRM 交接、RBAC 和审计。',
    href: '/status',
    state: '可做合作者评审；等外部材料接齐后再进入真实平台级验收。',
  },
];

export default function FactoryPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-amber-200">Wenai 电商增长作战台</div>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
                从 SKU 上新到创意、视频、分发、审核和回流的一张工作台
              </h1>
              <p className="mt-4 max-w-3xl text-[14px] leading-7 text-white/70">
                这里是最终产品形态入口：筷子科技给出全链路工业化参照，Hookshot / Hookly 给出 hook 和 UGC 广告结构参照，Wenai 的目标是把它们收成可验收、可交接、可复盘的电商增长系统。
              </p>
            </div>
            <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-[13px] leading-6 text-amber-50">
              当前边界：内部闭环已可跑；真实 OAuth、自动发布、广告投放、视频 provider、平台数据同步和企业云资产接入前，不宣称平台级规模执行。
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {FACTORY_OPERATING_LAYERS.map(layer => (
              <Link
                className="rounded-md border border-white/10 bg-white/[0.045] p-4 transition hover:border-amber-300/40 hover:bg-white/[0.07]"
                href={layer.href}
                key={layer.name}
              >
                <div className="text-[11px] font-black text-amber-200">{layer.name}</div>
                <div className="mt-1 text-[15px] font-black">{layer.title}</div>
                <p className="mt-2 text-[12px] leading-5 text-white/70">{layer.body}</p>
                <p className="mt-3 text-[11px] leading-5 text-emerald-100/80">{layer.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ListingFactoryConsole />
    </main>
  );
}
