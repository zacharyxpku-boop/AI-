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

const PROVIDER_MATERIAL_PACKS = [
  {
    priority: 'P0',
    pack: '视频生成 / 剪辑 provider 包',
    why: '决定 Create 和 Cut 能不能从工作流骨架进入真实成片工厂。',
    provideVia: '在部署平台配置服务端 secret；测试素材用沙盒项目或无敏感商品。',
    materials: ['提交 endpoint', 'server token', 'webhook signing secret', 'sandbox task quota', '回调白名单', '成本上限'],
    doNotSend: '不要把 provider token、cookie、后台登录态贴到聊天或浏览器 localStorage。',
    acceptance: 'Wenai 能提交一条测试视频任务，收到签名回调，生成成片资产和客户审核链接。',
  },
  {
    priority: 'P0',
    pack: '平台 OAuth / 账号池授权包',
    why: '决定 Cast 能不能从 manual handoff 进入真实矩阵账号运营。',
    provideVia: '平台开发者后台创建 app，并把 Wenai 回调地址加入白名单。',
    materials: ['client id', 'client secret', 'redirect URI', '测试账号授权', '店铺/主页/账号 ID', '发布频率限制'],
    doNotSend: '不要提供个人主账号密码；只给可撤销 app 授权或测试账号授权。',
    acceptance: '至少一个平台账号完成授权，账号状态进入 oauth_ready，并能被分发门禁读取。',
  },
  {
    priority: 'P0',
    pack: '广告账户 / Campaign 包',
    why: '决定广告投放是否能从 campaign ledger 进入真实预算和素材实验。',
    provideVia: '广告平台授权测试广告主，先用 sandbox 或小预算白名单 campaign。',
    materials: ['广告主 ID', '广告账户 ID', '创建/读取权限', '测试预算', '转化事件', '停投规则'],
    doNotSend: '不要开放无限预算或生产账户全权限；先用最小权限和预算上限。',
    acceptance: 'Wenai 能读取或创建测试 campaign，并把 spend、impression、click、conversion 写回表现回流。',
  },
  {
    priority: 'P1',
    pack: 'Analytics sync / 回流包',
    why: '决定 Compose 和 Cut 能不能靠真实表现数据复利，而不是靠人工判断。',
    provideVia: '平台 analytics API 或定时导出任务，字段先做只读同步。',
    materials: ['平台 account id', 'metric mapping', 'sync frequency', 'timezone', 'attribution window', 'API quota'],
    doNotSend: '不要混用多个平台口径；每个平台要明确指标定义和归因窗口。',
    acceptance: 'Wenai 能同步一段测试表现，去重后更新素材表现、品牌学习和下一轮创意建议。',
  },
  {
    priority: 'P1',
    pack: '企业云资产 / 权限包',
    why: '决定 Manage 能不能从内部 RBAC 模型进入真实企业云盘和审计。',
    provideVia: '对象存储或企业网盘项目授权，先给单独 bucket/project 和服务账号。',
    materials: ['bucket/project', 'service account', 'signed URL policy', 'team roles', 'DLP/watermark rules', 'retention policy'],
    doNotSend: '不要把生产客户全量云盘直接授权；先用独立空间和最小权限。',
    acceptance: '同一资产对客户、运营、分发角色返回不同权限结果，并写入可追踪审计。',
  },
  {
    priority: 'P1',
    pack: '规模数字审计包',
    why: '决定 91M+ / 42M+ 何时能从竞品 benchmark 变成 Wenai 自有规模指标。',
    provideVia: '只接受可审计来源、日期范围、去重规则和平台回执，不接受口头估算。',
    materials: ['creative output ledger', 'video distribution ledger', 'platform evidence URL', 'date range', 'dedupe rule', 'auditor note'],
    doNotSend: '不要把竞品公开数字写成 Wenai 自有成绩；没有审计前继续显示 benchmark。',
    acceptance: '规模数字能追溯到 Wenai 自有账本、平台回执和日期范围，页面才允许展示自有规模。',
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

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-6">
        <div className="text-[12px] font-black tracking-wide text-sky-700">外部材料包</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">你给材料，我按验收口径接；没有材料就保持门禁</h2>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          这张清单把“需要外部能力”拆成可执行交付物。P0 先打通真实生成、真实账号和真实广告；P1 再补自动回流、企业云资产和自有规模审计。任何 secret 都只进入服务端环境或部署平台，不进入仓库、不进入浏览器、不进入报告。
        </p>
        <div className="mt-5 grid gap-3">
          {PROVIDER_MATERIAL_PACKS.map(pack => (
            <article className="rounded-md border border-slate-200 bg-slate-50 p-4" key={pack.pack}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-[14px] font-black text-slate-950">{pack.pack}</div>
                  <p className="mt-1 text-[12px] leading-5 text-slate-600">{pack.why}</p>
                </div>
                <div className={`w-fit rounded-full border px-3 py-1 text-[11px] font-black ${pack.priority === 'P0' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                  {pack.priority}
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[0.9fr_1.1fr_1fr]">
                <SetupColumn label="交付方式" value={pack.provideVia} />
                <div>
                  <div className="text-[11px] font-black text-slate-500">材料清单</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pack.materials.map(item => (
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <SetupColumn label="验收证据" value={pack.acceptance} />
              </div>
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-5 text-amber-800">
                安全边界：{pack.doNotSend}
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
