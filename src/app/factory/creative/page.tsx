import type { Metadata } from 'next';

import { CreativeMonitoringConsoleClient } from '@/components/CreativeMonitoringConsoleClient';
import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';

export const metadata: Metadata = {
  title: '创意洞察工作台 | Wenai',
  description: '把商品卖点、竞品角度和渠道目标收敛成可审核的内容脚本。',
};

export default async function CreativeFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);

  if (selectedVariantId === 'friend_trial') {
    return <KuaiziWorkflowConsole active="creative" />;
  }

  return (
    <CreativeMonitoringConsoleClient
      initialProjectId={params.projectId || 'default-project'}
      selectedVariantId={selectedVariantId}
    />
  );
}
