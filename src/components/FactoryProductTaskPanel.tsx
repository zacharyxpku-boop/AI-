'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Metric = {
  label: string;
  value: string;
  detail?: string;
  tone?: 'slate' | 'emerald' | 'amber' | 'sky';
};

type FactoryProductTaskPanelProps = {
  title: string;
  job: string;
  nextHref: string;
  nextLabel: string;
  metrics: Metric[];
  readiness: string[];
};

const metricTone: Record<NonNullable<Metric['tone']>, string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
};

export function FactoryProductTaskPanel({
  title,
  job,
  nextHref,
  nextLabel,
  metrics,
  readiness,
}: FactoryProductTaskPanelProps) {
  const [product, setProduct] = useState('伸缩抽屉收纳盒');
  const [goal, setGoal] = useState('拿到客户咨询线索');
  const [channel, setChannel] = useState('小红书 / 抖音');
  const [saved, setSaved] = useState(false);

  const summary = useMemo(() => `${product || '未填写商品'} · ${channel || '未选择渠道'} · ${goal || '未填写目标'}`, [channel, goal, product]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">商品任务</div>
          <div className="mt-1 text-sm font-black text-indigo-600">创建一个商品增长任务</div>
          <h3 className="mt-1 text-2xl font-black text-slate-950">{title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{job}</p>
        </div>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700" href={nextHref}>
          {nextLabel}
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-400">商品</span>
          <input className="mt-1 w-full bg-transparent text-base font-black text-slate-950 outline-none" onChange={event => setProduct(event.target.value)} value={product} />
        </label>
        <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-400">目标</span>
          <input className="mt-1 w-full bg-transparent text-base font-black text-slate-950 outline-none" onChange={event => setGoal(event.target.value)} value={goal} />
        </label>
        <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-400">渠道</span>
          <input className="mt-1 w-full bg-transparent text-base font-black text-slate-950 outline-none" onChange={event => setChannel(event.target.value)} value={channel} />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black text-indigo-500">任务摘要</div>
          <div className="mt-1 truncate text-sm font-black text-indigo-950">{summary}</div>
        </div>
        <button
          className={`min-h-10 rounded-lg px-4 text-sm font-black shadow-sm transition ${saved ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
          onClick={() => setSaved(true)}
          type="button"
        >
          {saved ? '已保存任务' : '保存任务'}
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {metrics.map(item => (
          <div className={`rounded-lg border p-4 ${metricTone[item.tone ?? 'slate']}`} key={item.label}>
            <div className="text-xs font-bold opacity-70">{item.label}</div>
            <div className="mt-1 text-lg font-black">{item.value}</div>
            {item.detail ? <p className="mt-2 text-xs leading-5 opacity-75">{item.detail}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="text-xs font-black text-amber-700">推进前先确认</div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
          {readiness.map(item => (
            <li className="flex gap-2" key={item}>
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
