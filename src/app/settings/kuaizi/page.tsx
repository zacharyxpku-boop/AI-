'use client';

import { useEffect, useState } from 'react';

import { testKuaiziConnection, type KuaiziConnectionResult } from '@/lib/kuaizi-api';

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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <section className="rounded-md border border-slate-200 bg-white p-6">
        <div className="text-[12px] font-black tracking-wide text-amber-700">筷子科技连接配置</div>
        <h1 className="mt-2 text-3xl font-black text-slate-950">生产工具连接</h1>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          Wenai 只通过服务端代理连接筷子科技。浏览器不保存、不展示、不转发第三方密钥；未完成配置时，仍可导出生产规格，交给剪辑师或外部工具手动执行。
        </p>

        <div className="mt-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <StatusRow label="连接模式" value="服务端托管" />
          <StatusRow label="配置状态" value={configured ? '已配置' : '未配置'} strong={configured} />
          <StatusRow label="环境" value={status?.endpoint || '待配置'} />
          <StatusRow label="接口地址" value={status?.baseUrl || '待配置'} />
          <StatusRow label="密钥状态" value={status?.maskedApiKey || '不在浏览器保存'} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refresh(true)}
            disabled={isTesting}
            className="rounded-md bg-slate-950 px-4 py-3 text-[13px] font-black text-white disabled:opacity-60"
          >
            {isTesting ? '检查中...' : '检查服务端配置'}
          </button>
          <button
            type="button"
            onClick={() => refresh(false)}
            disabled={isTesting || !configured}
            className="rounded-md bg-amber-600 px-4 py-3 text-[13px] font-black text-white disabled:opacity-60"
          >
            {isTesting ? '测试中...' : '测试真实连接'}
          </button>
        </div>

        <div className={`mt-5 rounded-md border p-4 ${configured ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="text-[12px] font-black text-slate-900">连接状态</div>
          <p className="mt-2 text-[13px] font-semibold text-slate-700">{status?.message || '正在检查服务端配置...'}</p>
          {!configured && (
            <p className="mt-2 text-[12px] leading-5 text-slate-700">
              发布前需要在服务端配置筷子科技应用密钥、连接环境和接口地址。当前状态不阻断 POC 演示，但不能承诺一键外部生产。
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function StatusRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span className={`break-all text-[13px] ${strong ? 'font-black text-emerald-700' : 'font-semibold text-slate-900'}`}>{value}</span>
    </div>
  );
}
