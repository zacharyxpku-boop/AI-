import type { Metadata } from 'next';

import { CreativeMonitoringConsoleClient } from '@/components/CreativeMonitoringConsoleClient';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';

export const metadata: Metadata = {
  title: '创意情报台 | Wenai',
  description: '把竞品账号、榜单趋势和视频关键词拆解沉淀为可复用的创意洞察账本。',
};

export default async function CreativeFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);
  return (
    <CreativeMonitoringConsoleClient
      initialProjectId={params.projectId || 'default-project'}
      selectedVariantId={selectedVariantId}
    />
  );
}
