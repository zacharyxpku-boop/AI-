import { Container, Section, PrimaryButton, SecondaryButton } from '@/components/marketing/Container';

const DELIVERY_ITEMS = [
  '选择一个 SKU，确认今天主推的卖点和渠道',
  '生成脚本、素材清单、视频任务和客户审核入口',
  '分发前保留 provider、OAuth、广告账号和云资产门禁',
  '把发布证据和真实反馈交给销售继续跟进',
];

const STATS = [
  { value: '5 步', label: '从卖点到销售跟进' },
  { value: '10 SKU', label: '标准 POC 批次范围' },
  { value: '6 类', label: 'provider 材料与验收门禁' },
];

export function Hero() {
  return (
    <Section spacing="loose" className="relative overflow-hidden bg-[#f4f6fb]">
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-5 md:gap-10">
          <div className="flex min-w-0 flex-col gap-6 md:col-span-3">
            <div className="w-fit rounded-md bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Ecommerce Growth Workbench
            </div>
            <h1 className="max-w-[18ch] break-words text-[2.4rem] font-black leading-[1.05] text-slate-950 sm:text-5xl md:text-6xl">
              从一个商品开始，跑完整内容增长链路
            </h1>
            <p className="max-w-2xl text-[15px] leading-7 text-slate-600 md:text-lg">
              Wenai 把卖点、素材、视频任务、分发证据和销售跟进放进同一张工作台。provider 未配置前，客户看到的是清晰门禁，不是虚假的自动化承诺。
            </p>

            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
              {STATS.map(stat => (
                <div key={stat.value} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-black leading-none text-slate-950 md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-snug text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
              <PrimaryButton href="/factory?variant=friend_trial" size="lg" className="w-full bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] text-white sm:w-auto">
                开始第一轮试用
              </PrimaryButton>
              <SecondaryButton href="/settings/kuaizi" size="lg" className="w-full border-slate-200 bg-white text-slate-700 sm:w-auto">
                查看 Provider 材料
              </SecondaryButton>
            </div>
          </div>

          <div className="min-w-0 md:col-span-2">
            <div className="w-full rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Trial Package
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-950">
                    客户能拿走什么
                  </div>
                </div>
                <div className="shrink-0 rounded-md bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  可试用
                </div>
              </div>

              <div className="space-y-3">
                {DELIVERY_ITEMS.map((item, index) => (
                  <div
                    key={item}
                    className="flex min-w-0 gap-3 rounded-md border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-xs font-black text-blue-700 ring-1 ring-slate-200">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 break-words text-sm font-semibold leading-6 text-slate-700">
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-slate-700">
                第一次演示只回答一个问题：这批 SKU 能不能交付、哪里需要外部授权、下一步值不值得进入正式合作。
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
