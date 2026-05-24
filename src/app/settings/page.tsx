'use client';

import Link from 'next/link';
import { useState } from 'react';

import clientConfig from '@/config/client.json';
import modulesConfig from '@/config/modules.json';

const catDotColors: Record<string, string> = {
  execute: 'bg-emerald-500',
  content: 'bg-violet-500',
  intel: 'bg-sky-500',
  service: 'bg-amber-500',
};

export default function SettingsPage() {
  const [config, setConfig] = useState(clientConfig);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const toggleModule = (moduleId: string) => {
    setConfig(prev => {
      const enabled = new Set(prev.enabledModules);
      if (enabled.has(moduleId)) {
        enabled.delete(moduleId);
      } else {
        enabled.add(moduleId);
      }
      return { ...prev, enabledModules: Array.from(enabled) };
    });
    setSaved(false);
    setSaveError('');
  };

  const handleSave = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setSaveError('');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(`保存失败：${error instanceof Error ? error.message : '请手动检查 src/config/client.json'}`);
    }
  };

  const enabledCount = config.enabledModules.length;
  const totalCount = modulesConfig.modules.length;

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-4 py-5 text-[#15213f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <header className="rounded-md border border-white bg-white/90 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Settings</p>
              <h1 className="mt-2 break-words text-3xl font-black text-slate-950">客户配置工作台</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                管理客户基础信息、启用模块和交付入口。这里不保存第三方平台密钥，provider 授权统一走服务端配置页。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/factory?variant=friend_trial" className="rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white">
                打开商品增长工作台
              </Link>
              <Link href="/settings/kuaizi" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                Provider 配置
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Basic Info</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-500">客户名称</span>
                  <input
                    type="text"
                    value={config.clientName}
                    onChange={event => setConfig(prev => ({ ...prev, clientName: event.target.value }))}
                    className="min-h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-500">行业</span>
                  <input
                    type="text"
                    value={config.industry}
                    onChange={event => setConfig(prev => ({ ...prev, industry: event.target.value }))}
                    className="min-h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">AI Modules</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">AI 员工配置</h2>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
                  <span>已启用</span>
                  <span className="text-blue-700">{enabledCount}</span>
                  <span>/</span>
                  <span>{totalCount}</span>
                </div>
              </div>

              <div className="space-y-5">
                {modulesConfig.categories.map(category => {
                  const catModules = modulesConfig.modules.filter(module => module.category === category.id);
                  const catEnabled = catModules.filter(module => config.enabledModules.includes(module.id)).length;
                  return (
                    <div key={category.id}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`size-2 rounded-full ${catDotColors[category.id] || 'bg-slate-400'}`} />
                        <span className="text-sm font-black text-slate-800">{category.label}</span>
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-xs font-bold text-slate-400">{catEnabled}/{catModules.length}</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {catModules.map(module => {
                          const isEnabled = config.enabledModules.includes(module.id);
                          return (
                            <button
                              key={module.id}
                              type="button"
                              onClick={() => toggleModule(module.id)}
                              className={`flex min-h-12 items-center justify-between gap-3 rounded-md border px-3 text-left text-sm font-bold transition ${
                                isEnabled
                                  ? 'border-blue-200 bg-blue-50 text-blue-950 shadow-sm'
                                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              <span className="min-w-0 break-words">{module.name}</span>
                              <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${isEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                <span className={`absolute top-0.5 size-4 rounded-full bg-white transition ${isEnabled ? 'left-4' : 'left-0.5'}`} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Release Gate</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">试用前检查</h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ['模块启用', `${enabledCount}/${totalCount}`],
                ['Provider', '去服务端配置'],
                ['客户入口', '商品增长工作台'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                  <span className="font-bold text-slate-500">{label}</span>
                  <span className="min-w-0 break-words text-right font-black text-slate-900">{value}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSave}
              className={`mt-5 min-h-11 w-full rounded-md px-4 text-sm font-black transition ${
                saved
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-gradient-to-r from-[#6b5cff] via-[#a63dff] to-[#ff6c8f] text-white shadow-sm'
              }`}
            >
              {saved ? '已保存' : '保存配置'}
            </button>
            {saveError && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                {saveError}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
