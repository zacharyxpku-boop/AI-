'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopNav from '@/components/marketing/TopNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { buildInquiryStandardPackRoute } from '@/lib/standard-pack-routing';

interface FormData {
  company: string;
  contact: string;
  channel: string;
  scale: string;
  category: string;
  skuCount: string;
  platforms: string;
  assetsReady: string;
  expectedDeliverables: string;
  creativeNeeds: string;
  benchmarkLinks: string;
  painPoint: string;
  budget: string;
  timeline: string;
}

const INITIAL: FormData = {
  company: '',
  contact: '',
  channel: 'email',
  scale: '',
  category: '',
  skuCount: '',
  platforms: '',
  assetsReady: '',
  expectedDeliverables: '',
  creativeNeeds: '',
  benchmarkLinks: '',
  painPoint: '',
  budget: '',
  timeline: '',
};

const fields: Array<{
  key: keyof FormData;
  label: string;
  placeholder: string;
  type?: 'input' | 'textarea' | 'select';
  options?: Array<[string, string]>;
}> = [
  { key: 'company', label: '公司 / 品牌', placeholder: '例如：深圳 XX 跨境电商有限公司' },
  { key: 'contact', label: '联系方式', placeholder: '邮箱、微信或手机号' },
  {
    key: 'channel',
    label: '优先联系',
    placeholder: '',
    type: 'select',
    options: [['email', '邮件'], ['wechat', '微信'], ['phone', '电话']],
  },
  { key: 'category', label: '主营类目', placeholder: '例如：家居收纳、宠物用品、美妆个护' },
  { key: 'skuCount', label: '准备试用的 SKU 数', placeholder: '例如：1 个主推 SKU / 10 个 SKU 批次' },
  { key: 'platforms', label: '目标平台', placeholder: '例如：TikTok Shop、Amazon、Shopify、小红书' },
  { key: 'assetsReady', label: '素材状态', placeholder: '例如：有主图和包装图，缺授权达人图' },
  { key: 'painPoint', label: '当前最卡的问题', placeholder: '例如：素材多但不知道先做哪条内容，发布后也没有复盘证据', type: 'textarea' },
  { key: 'expectedDeliverables', label: '希望拿到什么', placeholder: '例如：脚本、视频任务、分发计划、客户报告', type: 'textarea' },
  { key: 'benchmarkLinks', label: '参考链接', placeholder: '竞品账号、爆款视频、店铺链接，可先留空', type: 'textarea' },
  { key: 'budget', label: '预算边界', placeholder: '例如：先小额试用 / 有正式接入预算' },
  { key: 'timeline', label: '期望节奏', placeholder: '例如：本周看试用结果 / 两周内完成第一轮' },
];

function InquireInner() {
  const params = useSearchParams();
  const source = params.get('from') || 'direct';
  const skuCountFromUrl = params.get('skuCount') || '';
  const platformFromUrl = params.get('platform') || '';

  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!skuCountFromUrl && !platformFromUrl) return;
    setForm(prev => ({
      ...prev,
      skuCount: prev.skuCount || skuCountFromUrl,
      platforms: prev.platforms || platformFromUrl,
    }));
  }, [skuCountFromUrl, platformFromUrl]);

  const ready = form.company.trim() && form.contact.trim() && form.painPoint.trim().length > 10;
  const standardPackHref = buildInquiryStandardPackRoute({
    company: form.company,
    scale: form.scale,
    category: form.category,
    skuCount: form.skuCount,
    platforms: form.platforms,
    assetsReady: form.assetsReady,
    expectedDeliverables: form.expectedDeliverables,
    creativeNeeds: form.creativeNeeds,
    benchmarkLinks: form.benchmarkLinks,
    painPoint: form.painPoint,
  });

  const setField = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!ready) {
      setError('请至少填写公司、联系方式，以及 10 个字以上的当前卡点。');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/sales/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试或邮件联系。');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
        <TopNav />
        <main className="px-4 py-12 sm:px-6">
          <section className="mx-auto max-w-[720px] rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-2xl font-black text-emerald-700 ring-1 ring-emerald-100">✓</div>
            <h1 className="mt-5 text-2xl font-black text-slate-950">已收到试用申请</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              我们会按你选择的联系方式确认类目、SKU、素材状态、provider 边界和下一步试用节奏。
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <Link href={standardPackHref} className="rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white">
                先生成试用标准包
              </Link>
              <Link href="/factory?variant=friend_trial" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                打开工作台
              </Link>
              <Link href="/settings/kuaizi" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                看 Provider 材料
              </Link>
            </div>
          </section>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#15213f]">
      <TopNav />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-md border border-white bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Trial Inquiry</p>
          <h1 className="mt-2 break-words text-3xl font-black text-slate-950 md:text-4xl">提交商品增长试用申请</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            你只要写清楚类目、平台、素材状态和最卡的地方。我们先判断这条试用链路能不能跑通，再决定是否进入正式 provider 接入。
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields.map(field => (
              <label key={field.key} className={field.type === 'textarea' ? 'block md:col-span-2' : 'block'}>
                <span className="mb-2 block text-xs font-bold text-slate-500">{field.label}</span>
                {field.type === 'select' ? (
                  <select
                    value={form[field.key]}
                    onChange={event => setField(field.key, event.target.value)}
                    className="min-h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
                  >
                    {field.options?.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={form[field.key]}
                    onChange={event => setField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={event => setField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
                  />
                )}
              </label>
            ))}
          </div>

          {error ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</div> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="min-h-11 rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-5 text-sm font-black text-white shadow-sm disabled:opacity-60"
            >
              {submitting ? '提交中...' : '提交试用申请'}
            </button>
            <Link href={standardPackHref} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 text-sm font-black text-slate-700">
              预览试用标准包
            </Link>
          </div>
        </section>

        <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">What Happens Next</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">我们只确认三件事</h2>
          <div className="mt-4 space-y-3">
            {[
              ['资料是否够跑', '商品、平台、素材和参考内容是否足够进入试用。'],
              ['门禁在哪里', 'provider、OAuth、广告账号、云资产和回流数据缺什么。'],
              ['下一步谁负责', '客户、运营、销售分别要做什么，避免只停在演示页面。'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-md bg-slate-50 p-3">
                <h3 className="text-sm font-black text-slate-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-slate-700">
            不要在这里提交第三方密钥、cookie 或后台登录态。真实 provider 材料只进入服务端配置流程。
          </div>
        </aside>
      </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

export default function InquirePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">加载中...</div>}>
      <InquireInner />
    </Suspense>
  );
}
