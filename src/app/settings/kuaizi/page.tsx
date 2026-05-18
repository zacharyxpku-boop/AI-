'use client';

import { useEffect, useState } from 'react';

import { testKuaiziConnection, type KuaiziConnectionResult } from '@/lib/kuaizi-api';

const EXTERNAL_SETUP_LANES = [
  {
    title: '视频生成 / 剪辑供应商',
    wenaiCanDo: '我可以接服务端提交、回调验签、失败重试、成片回灌和客户审核链接。',
    youProvide: '供应商后台、提交地址、服务端密钥、回调签名、测试任务额度、成本上限。',
    acceptance: '能提交一条沙盒任务，拿到任务编号，回调后写入成片 URL。',
  },
  {
    title: '多平台 OAuth / 账号池',
    wenaiCanDo: '我可以接授权回调、账号状态、发布频率、风险状态和矩阵排班账本。',
    youProvide: '平台开发者应用、回调地址白名单、测试账号授权、平台账号或店铺 ID。',
    acceptance: '至少一个平台账号完成授权，Wenai 能读到账号身份和授权状态。',
  },
  {
    title: '自动发布 / PubPal 矩阵分发',
    wenaiCanDo: '我可以接上传、发布、审核状态、证据链接、失败重试和手工兜底。',
    youProvide: '上传发布权限、素材规格、平台审核规则、频率限制、沙盒发布权限。',
    acceptance: '能发布一条测试内容，返回平台发布证据链接。',
  },
  {
    title: '广告投放',
    wenaiCanDo: '我可以接 campaign ledger、预算上限、素材绑定、停止条件和投放回流。',
    youProvide: '广告账户、广告主 ID、创建权限、测试预算、测试 campaign 或 sandbox。',
    acceptance: '能创建或读取一条测试 campaign，并把花费、曝光、点击、转化写回。',
  },
  {
    title: '平台数据自动同步',
    wenaiCanDo: '我可以接指标字段映射、定时同步、去重、归因窗口和品牌学习回流。',
    youProvide: 'analytics 权限、账号 ID、指标定义、同步频率、时区和归因规则。',
    acceptance: '能同步一段测试数据，并更新表现回流和下一轮创意建议。',
  },
  {
    title: '企业云资产 / 权限',
    wenaiCanDo: '我可以接对象存储、签名链接、下载/分享拦截、审计日志、水印和保留策略。',
    youProvide: 'bucket/project、服务账号、签名链接策略、团队角色、DLP/水印规则。',
    acceptance: '客户、运营、分发角色访问同一资产时，权限和审计结果不同且可追踪。',
  },
  {
    title: '自有规模审计',
    wenaiCanDo: '我可以接去重规则、来源拆分、日期范围和页面展示保护。',
    youProvide: 'Wenai 自有创意产出、视频分发、平台来源和审计证据。',
    acceptance: '没有审计证据前，91M+ / 42M+ 只能显示为竞品 benchmark。',
  },
];

const CAST_OPERATING_BOARD = [
  {
    stage: '账号矩阵池',
    goal: '把 TikTok Shop、Instagram、YouTube、Amazon、Shopify、Meta Ads 等账号纳入同一张账号健康账本。',
    internal: 'Wenai 已有账号状态、授权状态、发布频率、风险状态、发布槽位和矩阵排班模型。',
    external: '需要平台开发者应用、OAuth 回调白名单、测试账号、店铺/主页/广告主 ID。',
    gate: '没有 oauth_ready 或 manual_ready 的账号，不能把任何 dispatch 标记为已发布。',
  },
  {
    stage: 'PubPal 矩阵分发',
    goal: '把同一条成片按账号池、平台规则、频率限制和内容去重策略排进发布队列。',
    internal: 'Wenai 已有分发计划、dispatch、证据链接、失败重试、手工兜底和表现回流字段。',
    external: '需要上传/发布权限、素材规格、平台审核规则、频率限制、沙盒发布权限。',
    gate: '没有平台发布证据链接前，只能算 handoff，不能算自动发布或矩阵分发完成。',
  },
  {
    stage: '广告投放',
    goal: '把 Offer Test Matrix 变成真实 campaign：预算、素材、受众、停止条件、ROAS/转化回流。',
    internal: 'Wenai 已有 campaign ledger、预算门槛、素材绑定、证据链接、回流门禁和风险检查。',
    external: '需要广告账户、广告主 ID、创建权限、测试预算、sandbox 或可控测试 campaign。',
    gate: '没有广告账户授权、预算和平台 campaign 证据，不能宣称自动投放或自动优化。',
  },
  {
    stage: '表现自动同步',
    goal: '把自然发布、广告投放、销售和互动指标同步回 Wenai，反哺 Compose / Cut 下一轮生产。',
    internal: 'Wenai 已有 CSV/API 回流入口、字段映射、去重、归因窗口和品牌学习回写。',
    external: '需要 analytics 权限、指标定义、同步频率、时区、归因规则和平台 API 配额。',
    gate: '没有真实同步任务和回流证据，只能展示导入结果，不能展示平台自动优化结果。',
  },
];

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

      <section className="mt-6 rounded-md border border-slate-200 bg-slate-950 p-6 text-white">
        <div className="text-[12px] font-black tracking-wide text-amber-200">Cast Operating Board</div>
        <h2 className="mt-2 text-2xl font-black">账号矩阵、PubPal 分发、广告投放和数据回流的统一门禁</h2>
        <p className="mt-2 text-[13px] leading-6 text-white/65">
          Cast 不是把内容“发出去”这么简单，而是把账号池、发布槽位、广告账户、证据链接和表现同步串成一个可审计闭环。内部账本已经能跑；外部 OAuth、发布权限、广告账户和 analytics sync 接齐后，才进入真实平台级执行。
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {CAST_OPERATING_BOARD.map(item => (
            <article className="rounded-md border border-white/10 bg-white/[0.045] p-4" key={item.stage}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-[15px] font-black">{item.stage}</div>
                <div className="rounded-full border border-amber-200/30 px-3 py-1 text-[11px] font-black text-amber-100">provider-gated</div>
              </div>
              <div className="mt-3 space-y-2 text-[12px] leading-5">
                <p className="text-white/65"><span className="font-black text-white">目标：</span>{item.goal}</p>
                <p className="text-emerald-100"><span className="font-black text-white">内部：</span>{item.internal}</p>
                <p className="text-amber-100"><span className="font-black text-white">外部：</span>{item.external}</p>
                <p className="text-rose-100"><span className="font-black text-white">门禁：</span>{item.gate}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-6">
        <div className="text-[12px] font-black tracking-wide text-emerald-700">外部环境接入作战台</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">能配的我接，必须授权的你统一给</h2>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          Wenai 当前已经有内部账本、队列、门禁和回流模型。下面这些不是继续堆 UI，而是把平台级能力从“可演示骨架”推进到“真实执行”。所有密钥只进服务端环境或部署平台 secret，不进浏览器、不进仓库、不贴到对话里。
        </p>

        <div className="mt-5 grid gap-3">
          {EXTERNAL_SETUP_LANES.map(lane => (
            <article className="rounded-md border border-slate-200 bg-slate-50 p-4" key={lane.title}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-[14px] font-black text-slate-950">{lane.title}</div>
                <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black text-amber-700">
                  外部授权后打开
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <SetupColumn label="Wenai 可配置" value={lane.wenaiCanDo} />
                <SetupColumn label="需要你提供" value={lane.youProvide} />
                <SetupColumn label="验收口径" value={lane.acceptance} />
              </div>
            </article>
          ))}
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

function SetupColumn({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-black text-slate-500">{label}</div>
      <p className="mt-1 text-[12px] leading-5 text-slate-700">{value}</p>
    </div>
  );
}
