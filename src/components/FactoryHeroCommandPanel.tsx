'use client';

import Link from 'next/link';
import { useState } from 'react';

type HeroCommand = {
  label: string;
  href: string;
  prompt: string;
};

const COMMANDS: HeroCommand[] = [
  {
    label: '脚本',
    href: '/factory/creative?variant=friend_trial',
    prompt: '把商品卖点拆成标题、口播、图文草稿和行动引导，先审核再进入生产。',
  },
  {
    label: '影棚',
    href: '/factory/create?variant=friend_trial',
    prompt: '整理商品图、场景图、授权说明和素材限制，避免内容生产时缺关键资料。',
  },
  {
    label: '复刻',
    href: '/factory/video?variant=friend_trial',
    prompt: '参考内容结构，生成 Wenai 自有版本，不复制第三方品牌、素材或专有表达。',
  },
  {
    label: '配音',
    href: '/factory/video?variant=friend_trial',
    prompt: '把脚本切成可录制的短视频口播段落，适配不同平台节奏。',
  },
  {
    label: '分发',
    href: '/factory/cast?variant=friend_trial',
    prompt: '安排渠道、发布时间、发布证据和负责人，让客户看到真实推进状态。',
  },
];

export function FactoryHeroCommandPanel({ primaryActionHref }: { primaryActionHref: string }) {
  const [mode, setMode] = useState<'tools' | 'assistant'>('tools');
  const [selected, setSelected] = useState(COMMANDS[0]);

  return (
    <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-slate-200 bg-white/86 p-2 text-left shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <button
            className={`rounded-full px-6 py-2.5 text-sm font-black transition ${mode === 'tools' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
            onClick={() => setMode('tools')}
            type="button"
          >
            AI 工具
          </button>
          <button
            className={`rounded-full px-6 py-2.5 text-sm font-black transition ${mode === 'assistant' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
            onClick={() => setMode('assistant')}
            type="button"
          >
            小 W
          </button>
        </div>
        <Link
          className="flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
          href={mode === 'tools' ? selected.href : primaryActionHref}
        >
          {mode === 'tools' ? `打开${selected.label}` : '继续下一步'}
        </Link>
      </div>

      {mode === 'tools' ? (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {COMMANDS.map(command => (
              <button
                className={`rounded-full border px-3 py-1.5 text-xs font-black shadow-sm transition ${
                  command.label === selected.label
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700'
                }`}
                key={command.label}
                onClick={() => setSelected(command)}
                type="button"
              >
                {command.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-600">
            {selected.prompt}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold leading-6 text-indigo-900">
          小 W 会按“商品资料 → 内容生产 → 发布证据 → 销售移交”的顺序带客户推进，不展示虚构效果数字。
        </div>
      )}
    </div>
  );
}
