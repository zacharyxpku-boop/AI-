'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { saveEarlyBirdLead } from '@/lib/early-bird';

type Plan = {
  name: 'Free' | 'Starter' | 'Growth';
  price: string;
  cta: string;
  href?: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    cta: '开始第一轮试用',
    href: '/factory?variant=friend_trial',
    features: ['1 个试用项目', '商品增长工作台', 'provider-gated 交付边界'],
  },
  {
    name: 'Starter',
    price: '$29/月',
    cta: '获取早鸟优惠',
    features: ['3 个项目', '无水印客户报告', '素材、视频和分发任务协同'],
  },
  {
    name: 'Growth',
    price: '$99/月',
    cta: '获取团队早鸟',
    features: ['多项目与团队协作', '回流数据与复盘记录', '外部 provider 接入支持'],
  },
];

export function PricingIntentCards({ compact = false }: { compact?: boolean }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlan || !email.trim()) return;
    if (selectedPlan.name === 'Free') return;
    const result = saveEarlyBirdLead({ tier: selectedPlan.name, email, source: 'pricing' });
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage('已记录。Starter/Growth 上线后会优先通知你；当前仍可先用 Free 试用路径。');
    setEmail('');
  };

  return (
    <div>
      <div className={compact ? 'grid gap-3 lg:grid-cols-3' : 'grid gap-4 lg:grid-cols-3'}>
        {plans.map(plan => (
          <div key={plan.name} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-950">{plan.name}</div>
                <div className="mt-2 break-words text-3xl font-black text-slate-950">{plan.price}</div>
              </div>
              {plan.name === 'Starter' && <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">推荐</span>}
            </div>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
              {plan.features.map(feature => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span className="min-w-0 break-words">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.href ? (
              <Link href={plan.href} className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] px-4 text-sm font-black text-white">
                {plan.cta}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(plan);
                  setMessage('即将上线，留下邮箱获取早鸟优惠。');
                }}
                className="mt-5 min-h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 transition-colors hover:bg-white"
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && (
        <form onSubmit={submit} className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm font-black text-slate-950">{selectedPlan.name} 即将上线，留下邮箱获取早鸟优惠</div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="min-h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
            />
            <button type="submit" className="min-h-10 rounded-md bg-slate-950 px-4 text-sm font-black text-white">
              提交
            </button>
          </div>
          {message && <p className="mt-2 text-sm font-semibold text-blue-700">{message}</p>}
        </form>
      )}
    </div>
  );
}
