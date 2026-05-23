'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type FactoryCurrentTaskPanelProps = {
  question: string;
  progress: string;
  job: string;
  output: string;
  owner: string;
  proof: string;
  nextLabel: string;
  nextHref: string;
};

const CHECKS = [
  '商品和目标渠道已确认',
  '素材和授权边界已确认',
  '下一步负责人已明确',
];

export function FactoryCurrentTaskPanel({
  question,
  progress,
  job,
  output,
  owner,
  proof,
  nextLabel,
  nextHref,
}: FactoryCurrentTaskPanelProps) {
  const [checked, setChecked] = useState<string[]>([CHECKS[0]]);
  const doneCount = checked.length;
  const percent = useMemo(() => Math.round((doneCount / CHECKS.length) * 100), [doneCount]);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Current Task</div>
          <h3 className="mt-1 text-xl font-black text-slate-950">{question}</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">{progress}</span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-black text-slate-500">
          <span>任务完成度</span>
          <span>{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">{job}</p>

      <div className="mt-5 grid gap-2">
        {CHECKS.map(item => {
          const active = checked.includes(item);
          return (
            <button
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                active ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
              }`}
              key={item}
              onClick={() => {
                setChecked(current => (current.includes(item) ? current.filter(value => value !== item) : [...current, item]));
              }}
              type="button"
            >
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${active ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'}`}>
                {active ? '✓' : '+'}
              </span>
              <span className="text-sm font-black">{item}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
        <div className="p-3">
          <div className="text-xs font-bold text-slate-400">本步输出</div>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-900">{output}</p>
        </div>
        <div className="p-3">
          <div className="text-xs font-bold text-slate-400">负责人</div>
          <p className="mt-1 text-sm font-bold text-slate-900">{owner}</p>
        </div>
        <div className="bg-amber-50 p-3">
          <div className="text-xs font-bold text-amber-700">边界说明</div>
          <p className="mt-1 text-sm leading-5 text-amber-900">{proof}</p>
        </div>
      </div>

      <Link className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-black text-white shadow-sm transition hover:bg-slate-800" href={nextHref}>
        {nextLabel}
      </Link>
    </aside>
  );
}
