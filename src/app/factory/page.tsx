import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { KuaiziStyleWorkbench } from '@/components/KuaiziStyleWorkbench';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';

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

  if (selectedVariantId !== 'friend_trial') {
    redirect('/factory?variant=friend_trial');
  }

  return <KuaiziStyleWorkbench />;
}
