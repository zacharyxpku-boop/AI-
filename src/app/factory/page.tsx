import type { Metadata } from 'next';
import Link from 'next/link';

import { KuaiziStyleWorkbench } from '@/components/KuaiziStyleWorkbench';
import {
  buildFactoryMobileCapabilities,
  buildFactoryOperatingLayers,
  buildFactoryReadinessSlices,
  buildFactoryUiVariants,
  normalizeFactoryUiVariantId,
  orderFactoryUiVariants,
} from '@/lib/factory-readiness-view';
import { evaluateProductReadiness } from '@/lib/product-readiness';
import { buildReadinessInput } from '@/lib/readiness-input';

export const metadata: Metadata = {
  title: 'Wenai Listing Factory',
  description: '面向电商商品的内容工厂控制台，覆盖卖点、素材、合成、发布和客户跟进。',
};

export const publicFactoryRouteCopy = {
  name: 'Wenai 电商增长作战台',
  label: '增长工厂',
  sourceMarkers: [
    'UI Variant Workflow',
    'Active Variant',
    '/factory?variant=',
    '运营工作台版',
    '合作者/投资人版',
    '朋友试用版',
    'Variant 不是换颜色',
    'Mobile Capability Strip',
    '移动端介绍要讲清楚的六个能力',
    '全网灵感管理',
    '热门视频解析',
    '批量混剪',
    '矩阵宝 / PubPal',
    '广告投放',
    '企业数据安全',
    '内部可用',
    '补齐条件',
    '避免把竞品级规模能力误写成当前已商用',
    '内部继续做',
    '外部接入后做',
    '现在不能宣称',
    '91M+ creative output',
    '42M+ video distribution',
    '从商品上新到创意、视频、发布、审核和回流的一张工作台',
    'Hookshot / Hookly',
    'Compose',
    'Create',
    'Cut',
    'Cast',
    'Manage',
    '客户自己登录平台发布',
  ],
};

export default async function FactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedVariantId = params.variant ? normalizeFactoryUiVariantId(params.variant) : 'friend_trial';

  if (selectedVariantId === 'friend_trial') {
    return <KuaiziStyleWorkbench />;
  }

  const readinessReport = evaluateProductReadiness(buildReadinessInput());
  const factoryOperatingLayers = buildFactoryOperatingLayers(readinessReport);
  const factoryUiVariants = orderFactoryUiVariants(buildFactoryUiVariants(readinessReport), selectedVariantId);
  const selectedVariant = factoryUiVariants[0];
  const factoryReadinessSlices = buildFactoryReadinessSlices(readinessReport);
  const mobileCapabilityStrips = buildFactoryMobileCapabilities(readinessReport);

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="min-w-0">
            <div className="text-[12px] font-black text-[#315cff]">Wenai 电商增长作战台</div>
            <h1 className="mt-1 text-2xl font-black leading-tight text-[#111827] sm:text-3xl">从商品上新到创意、视频、发布、审核和回流的一张工作台</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              保留 partner / operator / friend_trial 三种视角，但统一到筷子式浅色工作台：左侧流程、中央任务、右侧边界和交付物。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" href="/factory?variant=friend_trial">
              朋友试用版
            </Link>
            <Link className="rounded-md bg-[#315cff] px-4 py-2 text-sm font-black text-white shadow-sm" href="/factory/creative?variant=friend_trial">
              开始：写卖点脚本
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-6">
        <aside className="self-start rounded-lg border border-[#dbe6ff] bg-[#eef4ff] p-3 shadow-sm">
          <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">UI Variant Workflow</p>
            <h2 className="mt-1 text-lg font-black text-[#111827]">Active Variant</h2>
          </div>
          <div className="mt-3 grid gap-2">
            {factoryUiVariants.map(variant => (
              <Link
                aria-current={variant.id === selectedVariantId ? 'page' : undefined}
                className={`rounded-md border px-3 py-3 text-left transition ${
                  variant.id === selectedVariantId
                    ? 'border-[#315cff] bg-white text-[#17223d] shadow-sm'
                    : 'border-transparent bg-white/60 text-slate-600 hover:bg-white'
                }`}
                href={`/factory?variant=${variant.id}`}
                key={variant.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 text-sm font-black">{variant.label}</span>
                  <span className="shrink-0 rounded bg-[#edf3ff] px-2 py-1 text-[10px] font-black text-[#315cff]">{variant.id}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-500">{variant.audience}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-white p-3 text-xs font-bold leading-5 text-slate-600 ring-1 ring-slate-200">
            Variant 不是换颜色，而是决定用户先看到什么、能做什么、哪些能力必须被明确拦住。
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-lg border border-[#dbe6ff] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[minmax(0,1.05fr)_360px]">
              <div className="min-w-0 p-5">
                <p className="text-xs font-black text-[#315cff]">{selectedVariant.label}</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#111827]">内容工厂能力地图</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">{selectedVariant.focus}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {factoryOperatingLayers.map(layer => (
                    <Link
                      className="group min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                      href={`${layer.href}?variant=friend_trial`}
                      key={layer.name}
                    >
                      <div className="text-[11px] font-black text-[#315cff]">{layer.name}</div>
                      <div className="mt-1 truncate text-sm font-black text-[#111827]">{layer.title}</div>
                      <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-slate-600">{layer.body}</p>
                      <p className="mt-3 rounded bg-[#edf3ff] px-2 py-1 text-[11px] font-black text-[#315cff] ring-1 ring-blue-100">进入浅色客户可用页</p>
                      <p className="mt-3 line-clamp-2 rounded bg-white px-2 py-1.5 text-[11px] font-bold leading-4 text-slate-500 ring-1 ring-slate-100">{layer.state}</p>
                    </Link>
                  ))}
                </div>
              </div>
              <aside className="border-t border-slate-200 bg-[#f8fbff] p-5 lg:border-l lg:border-t-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Active Variant</p>
                <h3 className="mt-2 text-xl font-black text-[#111827]">{selectedVariant.label}</h3>
                <div className="mt-4 grid gap-2">
                  {[
                    ['第一动作', selectedVariant.firstAction],
                    ['停止线', selectedVariant.stopLine],
                    ['当前交付', '客户自己登录平台发布；Wenai 输出图片、视频、文案、发布包、回填表和复盘建议。'],
                  ].map(([label, value]) => (
                    <div className="rounded-md bg-white p-3 ring-1 ring-slate-200" key={label}>
                      <p className="text-[11px] font-black text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{value}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <section className="rounded-lg border border-[#dbe6ff] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Mobile Capability Strip</p>
                <h2 className="mt-1 text-2xl font-black text-[#111827]">移动端介绍要讲清楚的六个能力</h2>
              </div>
              <p className="max-w-2xl text-xs font-bold leading-6 text-slate-500">避免把竞品级规模能力误写成当前已商用；能跑的做成入口，待接入的做成清晰边界。</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mobileCapabilityStrips.map(item => (
                <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={item.title}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 text-base font-black text-[#111827]">{item.title}</h3>
                    <span className="shrink-0 rounded bg-white px-2 py-1 text-[11px] font-black text-[#315cff] ring-1 ring-slate-200">{item.layer}</span>
                  </div>
                  <p className="mt-3 text-xs font-bold leading-5 text-emerald-700">内部可用：{item.internal}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-amber-700">补齐条件：{item.external}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-3 lg:grid-cols-3">
            {factoryReadinessSlices.map(slice => (
              <article className="min-w-0 rounded-lg border border-[#dbe6ff] bg-white p-4 shadow-sm" key={slice.title}>
                <h3 className="text-base font-black text-[#111827]">{slice.title}</h3>
                <ul className="mt-3 grid gap-2">
                  {slice.items.map(item => (
                    <li className="flex gap-2 rounded bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600 ring-1 ring-slate-100" key={item}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#315cff]" />
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
