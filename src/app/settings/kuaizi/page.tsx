'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { testKuaiziConnection, type KuaiziConnectionResult } from '@/lib/kuaizi-api';

const providerLanes = [
  {
    priority: 'P0',
    title: '视频生成 / 剪辑 provider',
    unlocks: '解锁一键视频、智能混剪、批量成片、provider 回调和客户审核链接。',
    provide: '提交 endpoint、server token、webhook signing secret、sandbox quota、成本上限。',
    gate: '没有 provider callback 前，不宣称自动成片。',
    href: '/factory/video?variant=friend_trial',
  },
  {
    priority: 'P0',
    title: '平台 OAuth / 账号池',
    unlocks: '解锁账号身份、授权状态、发布频率、账号健康和矩阵排班。',
    provide: 'client id、client secret、redirect URI、测试账号授权、店铺或主页 ID。',
    gate: '没有 oauth_ready 或 manual_ready 的账号，不标记真实发布。',
    href: '/factory/cast?variant=friend_trial',
  },
  {
    priority: 'P0',
    title: '广告账号 / Campaign',
    unlocks: '解锁测试 campaign、预算门禁、素材绑定、停投规则和投放表现回流。',
    provide: '广告主 ID、广告账号 ID、创建/读取权限、测试预算、转化事件。',
    gate: '没有广告账号授权、预算和平台证据，不宣称自动投放或自动优化。',
    href: '/factory/cast?variant=friend_trial',
  },
  {
    priority: 'P1',
    title: 'Analytics sync / 表现回流',
    unlocks: '解锁字段映射、定时同步、去重、归因窗口和下一轮创意建议。',
    provide: 'account id、metric mapping、sync frequency、timezone、attribution window。',
    gate: '没有真实同步任务和回流证据，只展示手工导入结果。',
    href: '/factory/manage?variant=friend_trial',
  },
  {
    priority: 'P1',
    title: '企业云资产 / 权限',
    unlocks: '解锁对象存储、签名链接、下载/分享拦截、审计日志、水印和保留策略。',
    provide: 'bucket/project、service account、signed URL policy、team roles、DLP rules。',
    gate: '没有企业云授权前，不宣称团队云盘或外部分发权限。',
    href: '/factory/manage?variant=friend_trial',
  },
  {
    priority: 'P1',
    title: '规模数字审计',
    unlocks: '解锁 Wenai 自有 creative output、video distribution、日期范围和平台证据展示。',
    provide: 'production ledger、platform evidence URL、date range、dedupe rule、auditor note。',
    gate: '没有审计账本前，91M+ / 42M+ 只作为竞品 benchmark。',
    href: '/status?variant=friend_trial',
  },
];

const readinessChecks = [
  '材料已放入服务端安全位置',
  '使用 sandbox 或最小权限账号',
  '有可验证回调、发布回执或 campaign 数据',
  '页面保持 provider-gated，不泄露 token、cookie 或后台登录态',
];

function StatusRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className={`min-w-0 break-words text-right text-sm ${strong ? 'font-black text-emerald-700' : 'font-bold text-slate-800'}`}>{value}</span>
    </div>
  );
}

export default function KuaiziSettingsPage() {
  const [status, setStatus] = useState<KuaiziConnectionResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const refresh = async (dryRun = true) => {
    setIsTesting(true);
    const result = await testKuaiziConnection({ dryRun });
    setStatus(result);
    setIsTesting(false);
  };

  useEffect(() => {
    let cancelled = false;
    testKuaiziConnection({ dryRun: true }).then(result => {
      if (!cancelled) setStatus(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const configured = status?.configured === true;

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-4 py-5 text-[#15213f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="overflow-hidden rounded-md bg-gradient-to-r from-[#17233f] via-[#244b73] to-[#6b5cff] p-5 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Provider Control</p>
              <h1 className="mt-2 break-words text-3xl font-black md:text-4xl">外部生产连接工作台</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                能配的 Wenai 接，必须授权的由客户统一给。浏览器不保存、不展示、不转发第三方密钥；没材料就保持门禁。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/factory?variant=friend_trial" className="rounded-md bg-white px-4 py-3 text-sm font-black text-[#17233f]">
                回到商品增长工作台
              </Link>
              <Link href="/status?variant=friend_trial" className="rounded-md bg-white/10 px-4 py-3 text-sm font-black text-white ring-1 ring-white/25">
                readiness 边界
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Connection</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">服务端连接状态</h2>
            <div className="mt-4 space-y-2">
              <StatusRow label="连接模式" value="服务端托管" />
              <StatusRow label="配置状态" value={configured ? '已配置' : '未配置'} strong={configured} />
              <StatusRow label="环境" value={status?.endpoint || '待配置'} />
              <StatusRow label="接口地址" value={status?.baseUrl || '待配置'} />
              <StatusRow label="密钥状态" value={status?.maskedApiKey || '不在浏览器保存'} />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => refresh(true)}
                disabled={isTesting}
                className="min-h-11 rounded-md bg-slate-950 px-4 text-sm font-black text-white disabled:opacity-60"
              >
                {isTesting ? '检查中...' : '检查服务端配置'}
              </button>
              <button
                type="button"
                onClick={() => refresh(false)}
                disabled={isTesting || !configured}
                className="min-h-11 rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-4 text-sm font-black text-white disabled:opacity-50"
              >
                {isTesting ? '测试中...' : '测试真实连接'}
              </button>
            </div>
            <div className={`mt-4 rounded-md border p-3 ${configured ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <p className="text-xs font-black text-slate-900">连接状态</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{status?.message || '正在检查服务端配置...'}</p>
              {!configured ? (
                <p className="mt-2 text-xs leading-5 text-slate-600">当前不阻断 POC 演示，但不能承诺一键外部生产。</p>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Material Packs</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">外部材料包</h2>
                </div>
                <span className="w-fit rounded-md bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">P0 先打通真实生成、真实账号和真实广告</span>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-2">
                {providerLanes.map(lane => (
                  <article key={lane.title} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-blue-700">{lane.priority}</p>
                        <h3 className="mt-1 break-words text-lg font-black text-slate-950">{lane.title}</h3>
                      </div>
                      <Link href={lane.href} className="shrink-0 rounded-md bg-white px-2.5 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                        查看
                      </Link>
                    </div>
                    <dl className="mt-3 space-y-2 text-sm leading-6">
                      <div>
                        <dt className="font-black text-slate-500">接入后打开的能力</dt>
                        <dd className="break-words text-slate-700">{lane.unlocks}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-slate-500">材料字段</dt>
                        <dd className="break-words text-slate-700">{lane.provide}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-slate-500">缺失时保持的门禁</dt>
                        <dd className="break-words text-slate-700">{lane.gate}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">How To Obtain</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">去哪里拿材料</h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p><span className="font-black text-slate-900">视频 provider：</span>供应商控制台或服务商对接群，先开 sandbox 项目。</p>
                  <p><span className="font-black text-slate-900">平台 OAuth：</span>TikTok、Meta、Amazon、Shopify 等开发者后台创建 app。</p>
                  <p><span className="font-black text-slate-900">广告账号：</span>Ads Manager 或商务管理后台，使用最小权限和预算上限。</p>
                  <p><span className="font-black text-slate-900">企业云资产：</span>对象存储、CDN、企业网盘或云服务 IAM 控制台。</p>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Release Checklist</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">材料放行检查表</h2>
                <div className="mt-4 space-y-2">
                  {readinessChecks.map(check => (
                    <div key={check} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">✓</span>
                      <span className="min-w-0 break-words">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
