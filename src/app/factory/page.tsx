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

const FACTORY_UI_VARIANTS = [
  {
    id: 'industrial',
    label: '工业运营版',
    audience: '给内容运营、投放、客户经理和生产负责人',
    focus: '把 Compose / Create / Cut / Cast / Manage 放成一张作战台，先看每段是否有负责人、证据、下一步和阻断项。',
    firstAction: '从创意洞察进入 Hook Bank，再把胜出结构推进视频队列和分发计划。',
    stopLine: '没有 OAuth、广告账户、视频 provider 和平台回流前，只展示门禁，不展示平台级自动执行。',
  },
  {
    id: 'partner',
    label: '合作者演示版',
    audience: '给合作方、投资人、外部供应商和客户老板',
    focus: '少讲技术，多讲已经能演示的闭环、需要对方提供的材料、以及接上外部能力后能扩大的部分。',
    firstAction: '先看 readiness 和外部接入清单，再打开客户 review 链路证明非技术用户能验收。',
    stopLine: '91M+ creative output、42M+ video distribution 只作为竞品规模参照，不能写成 Wenai 自有数据。',
  },
  {
    id: 'stable',
    label: '朋友试用版',
    audience: '给第一次使用、没有技术背景的朋友',
    focus: '只保留项目、工厂、审核、报告和下一步，不把 API、provider、ledger 术语放在主路径上。',
    firstAction: '打开一个样例项目，按“看洞察 -> 生成 Brief -> 看视频任务 -> 审核交付”完成一次零解释试跑。',
    stopLine: '任何需要解释环境变量、后台任务或平台授权的步骤，都不能算朋友可独立完成。',
  },
];

const FACTORY_READINESS_SLICES = [
  {
    title: '内部继续做',
    items: ['variant 入口层', '客户 review 可视化', '视频队列 UI', '品牌学习档案', '资产权限 enforcement', '创意洞察手动/半自动导入'],
  },
  {
    title: '外部接入后做',
    items: ['真实 OAuth', '广告账户授权', '自动发布', '视频生成/剪辑 provider', '平台数据自动同步', '对象存储与签名 URL'],
  },
  {
    title: '现在不能宣称',
    items: ['筷子等价', '自动投放优化', '平台级矩阵发布', '91M+ 自有创意产出', '42M+ 自有视频分发', '无人工介入的全自动视频工厂'],
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

          <div className="mt-6 border-y border-white/10 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">UI Variant Workflow</div>
                <h2 className="mt-1 text-2xl font-black">同一套工厂，按对象切三种视角</h2>
              </div>
              <p className="max-w-xl text-[12px] leading-6 text-white/60">
                Variant 不是换颜色，而是决定用户先看到什么、能做什么、哪些能力必须被明确挡住。先把三种视角跑通，再继续加厚创意、视频、分发和管理页面。
              </p>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {FACTORY_UI_VARIANTS.map(variant => (
                <div key={variant.id} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[15px] font-black text-white">{variant.label}</div>
                    <div className="rounded-sm border border-amber-200/30 px-2 py-1 text-[10px] font-black uppercase text-amber-100">{variant.id}</div>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-amber-100/80">{variant.audience}</p>
                  <div className="mt-3 space-y-2 text-[12px] leading-5 text-white/70">
                    <p><span className="font-black text-white">首屏重点：</span>{variant.focus}</p>
                    <p><span className="font-black text-white">第一动作：</span>{variant.firstAction}</p>
                    <p><span className="font-black text-rose-100">停止线：</span>{variant.stopLine}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {FACTORY_READINESS_SLICES.map(slice => (
              <div key={slice.title} className="rounded-md border border-white/10 bg-slate-900/80 p-4">
                <div className="text-[13px] font-black text-amber-100">{slice.title}</div>
                <ul className="mt-3 space-y-2 text-[12px] leading-5 text-white/65">
                  {slice.items.map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-amber-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
