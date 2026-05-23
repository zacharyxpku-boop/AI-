import type { Metadata } from 'next';
import Link from 'next/link';

import { FactoryFriendTrialExperience } from '@/components/FactoryFriendTrialExperience';
import { ListingFactoryConsole } from '@/components/marketing/ListingFactorySections';
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
  title: '内容工厂控制台 | Wenai Listing Factory',
  description: '集中查看 SKU 上新进度、品牌边界、批量 Brief、内容任务和客户交付状态。',
};

export default async function FactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);
  const readinessReport = evaluateProductReadiness(buildReadinessInput());
  const factoryOperatingLayers = buildFactoryOperatingLayers(readinessReport);
  const factoryUiVariants = orderFactoryUiVariants(buildFactoryUiVariants(readinessReport), selectedVariantId);
  const selectedVariant = factoryUiVariants[0];
  const factoryReadinessSlices = buildFactoryReadinessSlices(readinessReport);
  const mobileCapabilityStrips = buildFactoryMobileCapabilities(readinessReport);

  if (selectedVariantId === 'friend_trial') {
    const operatingLinks = [
      { label: '第 1 步', title: '选择今天主推的卖点', href: '/factory/creative?variant=friend_trial', value: '先确认角度' },
      { label: '第 2 步', title: '补齐商品图和授权', href: '/factory/create?variant=friend_trial', value: '避免素材不可用' },
      { label: '第 3 步', title: '生成内容草稿', href: '/factory/video?variant=friend_trial', value: '客户先审核' },
      { label: '第 4 步', title: '安排发布渠道', href: '/factory/cast?variant=friend_trial', value: '留下发布证明' },
      { label: '第 5 步', title: '交给销售跟进', href: '/factory/manage?variant=friend_trial', value: '记录负责人' },
    ];

    return (
      <FactoryFriendTrialExperience
        active="overview"
        title="从一个商品开始，生成可审核的内容任务"
        subtitle="客户先录入商品和目标渠道，系统给出卖点、素材、内容、发布和销售跟进的下一步。"
        metrics={[
          { label: '商品资料', value: '待确认', detail: '客户可编辑', tone: 'slate' },
          { label: '内容计划', value: '待生成', detail: '先审核后发布', tone: 'emerald' },
          { label: '销售跟进', value: '待分配', detail: '不虚构线索', tone: 'amber' },
        ]}
        readiness={[
          { label: '商品与目标', value: '已锁定 1 个 SKU', detail: '客户先确认今天主推什么，再进入卖点和内容生产。', tone: 'sky' },
          { label: '素材与授权', value: '待补齐', detail: '缺图、缺授权或缺口播资料时，先补资料再生成内容。', tone: 'amber' },
          { label: '内容审核', value: '先出草稿', detail: '短视频和图文先给客户审核，不直接假装已经发布。', tone: 'emerald' },
          { label: '发布证明', value: '待回填', detail: '渠道链接、截图和负责人要回写，不能只停在任务卡。', tone: 'slate' },
          { label: '销售跟进', value: '可交接', detail: '只把真实反馈、客户确认和负责人交给销售继续谈。', tone: 'emerald' },
        ]}
        actions={[
          { role: '客户', title: '先填商品', value: '确认商品、目标和渠道', href: '/factory?variant=friend_trial' },
          { role: '运营', title: '处理内容任务', value: '从卖点和素材开始', href: '/factory/creative?variant=friend_trial' },
          { role: '销售', title: '接收跟进事项', value: '只接真实反馈和客户确认', href: '/factory/manage?variant=friend_trial' },
        ]}
        nextHref="/factory/creative?variant=friend_trial"
        nextLabel="选择卖点"
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {operatingLinks.map(item => (
            <Link
              className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg"
              href={item.href}
              key={item.href}
            >
              <div className="text-xs font-medium text-stone-500">{item.label}</div>
              <h2 className="mt-2 text-base font-semibold text-stone-950">{item.title}</h2>
              <p className="mt-4 rounded-xl bg-stone-50 px-3 py-2 text-sm font-medium text-stone-600">{item.value}</p>
            </Link>
          ))}
        </section>
      </FactoryFriendTrialExperience>
    );
  }

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
                这里是最终产品形态入口：伙伴工具给出全链路工业化参照，Wenai 的目标是把它们收敛成可验收、可交接、可复盘的电商增长系统。
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
                Variant 不是换颜色，而是决定用户先看到什么、能做什么、哪些能力必须被明确拦住。先把三种视角跑通，再继续加厚创意、视频、分发和管理页面。
              </p>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {factoryUiVariants.map(variant => (
                <Link
                  aria-current={variant.id === selectedVariantId ? 'page' : undefined}
                  href={`/factory?variant=${variant.id}`}
                  key={variant.id}
                  className={`rounded-md border p-4 transition hover:border-amber-300/40 hover:bg-white/[0.07] ${
                    variant.id === selectedVariantId
                      ? 'border-amber-300/55 bg-amber-300/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
                      : 'border-white/10 bg-white/[0.045]'
                  }`}
                >
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
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-amber-300/30 bg-slate-900/70 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-200">Active Variant</div>
              <div className="mt-2 grid gap-3 md:grid-cols-[0.8fr_1fr_1fr]">
                <div>
                  <div className="text-xl font-black text-white">{selectedVariant.label}</div>
                  <p className="mt-2 text-[12px] leading-5 text-white/65">{selectedVariant.audience}</p>
                </div>
                <p className="text-[12px] leading-6 text-white/75">{selectedVariant.focus}</p>
                <p className="text-[12px] leading-6 text-amber-100/85">{selectedVariant.firstAction}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {factoryReadinessSlices.map(slice => (
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

          <div className="mt-6 rounded-md border border-white/10 bg-white/[0.045] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">Mobile Capability Strip</div>
                <h2 className="mt-1 text-2xl font-black">移动端介绍要讲清楚的六个能力</h2>
              </div>
              <p className="max-w-xl text-[12px] leading-6 text-white/60">
                这些是对外最容易被理解的入口：能展示内部闭环，但每张卡都必须带外部门禁，避免把竞品级规模能力误写成当前已商用。
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mobileCapabilityStrips.map(item => (
                <article className="rounded-md border border-white/10 bg-slate-900/80 p-4" key={item.title}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[15px] font-black text-white">{item.title}</div>
                    <span className="rounded-sm border border-amber-200/30 px-2 py-1 text-[10px] font-black uppercase text-amber-100">{item.layer}</span>
                  </div>
                  <p className="mt-3 text-[12px] leading-5 text-emerald-100/85">内部可用：{item.internal}</p>
                  <p className="mt-2 text-[12px] leading-5 text-amber-100/85">外部门禁：{item.external}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {factoryOperatingLayers.map(layer => (
              <Link
                className="rounded-md border border-white/10 bg-white/[0.045] p-4 transition hover:border-amber-300/40 hover:bg-white/[0.07]"
                href={`${layer.href}?variant=${selectedVariantId}`}
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
